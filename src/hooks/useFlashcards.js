import { useState, useEffect, useCallback } from 'react'
import * as storage from '../services/storage'

const CARDS_KEY = 'learn:mandarin:cards'

// ── Field detection helpers ──────────────────────────────────────

function isHanzi(text) {
  return /[一-鿿㐀-䶿]/.test(text)
}

// True when the field is mostly Chinese — used to find the hanzi field and
// to avoid mistaking "hello (你好)" style mixed fields for hanzi.
function isPrimarilyHanzi(text) {
  if (!text) return false
  const hanziCount = (text.match(/[一-鿿㐀-䶿]/g) ?? []).length
  return hanziCount / text.replace(/\s/g, '').length > 0.4
}

function looksLikePinyin(text) {
  if (!text || text.length > 80) return false
  if (/[āáǎàōóǒòēéěèīíǐìūúǔùǖǘǚǜ]/.test(text)) return true   // diacritic tones
  if (/\b[a-zA-Z]+[1-5]\b/.test(text)) return true              // numbered tones: ni3 hao3
  return false
}

function extractAudioFilename(text) {
  const m = (text ?? '').match(/\[sound:([^\]]+)\]/)
  return m ? m[1] : null
}

function stripTags(html) {
  return (html ?? '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\[sound:[^\]]+\]/g, '')
    .trim()
}

function getModelFieldNames(db) {
  // Old Anki format: col.models is a JSON blob of all models
  try {
    const res = db.exec('SELECT models FROM col LIMIT 1')
    if (res.length) {
      const models = JSON.parse(res[0].values[0][0])
      const keys = Object.keys(models)
      if (keys.length > 0) {
        const names = models[keys[0]]?.flds?.map(f => f.name.toLowerCase())
        if (names?.length) return names
      }
    }
  } catch {}

  // New Anki format (2.1.28+): models live in notetypes + fields tables
  try {
    const res = db.exec(
      'SELECT name FROM fields ORDER BY ntid ASC, ord ASC LIMIT 30'
    )
    if (res.length && res[0].values.length) {
      return res[0].values.map(r => String(r[0]).toLowerCase())
    }
  } catch {}

  return null
}

function findIdx(names, patterns) {
  if (!names) return -1
  return names.findIndex(n => patterns.some(p => n.includes(p)))
}

// ── Deck parser ──────────────────────────────────────────────────

export function parseAnkiCards(db) {
  const fieldNames = getModelFieldNames(db)

  const pinyinPatterns  = ['pinyin', 'reading', 'romanization', 'pronunciation']
  const englishPatterns = ['english', 'definition', 'meaning', 'translation', 'gloss', 'back']
  const hanziPatterns   = ['hanzi', 'chinese', 'simplified', 'traditional', 'character', 'expression', 'vocab', 'word', 'front']
  const audioPatterns   = ['audio', 'sound']

  let pinyinIdx  = findIdx(fieldNames, pinyinPatterns)
  let englishIdx = findIdx(fieldNames, englishPatterns)
  let hanziIdx   = findIdx(fieldNames, hanziPatterns)
  let audioIdx   = findIdx(fieldNames, audioPatterns)

  const result = db.exec(`
    SELECT c.id, c.nid, n.flds, n.tags
    FROM cards c
    JOIN notes n ON c.nid = n.id
    GROUP BY c.nid
    ORDER BY c.id ASC
  `)
  if (!result.length) return []

  const cards = []

  for (const [id, nid, flds, tags] of result[0].values) {
    const rawFields = (flds ?? '').split('\x1f')
    const clean     = rawFields.map(stripTags)

    let pinyin     = null
    let definition = null
    let hanzi      = null
    let audioFile  = null

    // Apply field-name indices but validate the content actually matches the
    // expected role. If a "hanzi" field contains English (or vice-versa), the
    // assignment is discarded so the content-based fallback can correct it.
    if (audioIdx >= 0)  audioFile  = extractAudioFilename(rawFields[audioIdx])
    if (hanziIdx >= 0   && isHanzi(clean[hanziIdx]))                          hanzi      = clean[hanziIdx]
    if (pinyinIdx >= 0  && clean[pinyinIdx] && !isPrimarilyHanzi(clean[pinyinIdx])) pinyin = clean[pinyinIdx]
    if (englishIdx >= 0 && clean[englishIdx] && !isPrimarilyHanzi(clean[englishIdx])) definition = clean[englishIdx]

    // Content-based fallbacks for anything not confirmed above
    if (!audioFile)   audioFile  = rawFields.map(extractAudioFilename).find(Boolean) ?? null
    if (!hanzi)       hanzi      = clean.find(f => f && isPrimarilyHanzi(f)) ?? null
    if (!pinyin)      pinyin     = clean.find(f => looksLikePinyin(f) && !isPrimarilyHanzi(f)) ?? null
    if (!definition)  definition = clean.find(f => f && !isPrimarilyHanzi(f) && f !== pinyin) ?? ''

    if (!definition && !pinyin && !hanzi) continue

    cards.push({
      id:             String(id),
      noteId:         String(nid),
      hanzi:          hanzi ?? '',
      pinyin:         pinyin ?? '',
      definition:     definition ?? '',
      audioFile,
      tags:           (tags ?? '').trim().split(/\s+/).filter(Boolean),
      mastered:       false,
      culturalContext: null,
    })
  }

  return cards
}

// ── SM-2 spaced repetition ───────────────────────────────────────
// rating: 0 = Again, 4 = Good, 5 = Easy

function sm2(card, rating) {
  let interval    = card.interval    ?? 0
  let easeFactor  = card.easeFactor  ?? 2.5
  let repetitions = card.repetitions ?? 0

  if (rating === 0) {
    interval    = 1
    repetitions = 0
    easeFactor  = Math.max(1.3, easeFactor - 0.2)
  } else {
    repetitions += 1
    if      (repetitions === 1) interval = 1
    else if (repetitions === 2) interval = 6
    else                        interval = Math.round(interval * easeFactor)

    easeFactor = Math.max(1.3, easeFactor + 0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02))
  }

  const due = new Date()
  due.setDate(due.getDate() + interval)
  return { interval, easeFactor, repetitions, dueDate: due.toISOString().split('T')[0] }
}

function today() {
  return new Date().toISOString().split('T')[0]
}

// ── Shuffle helper ───────────────────────────────────────────────

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ── Hook ─────────────────────────────────────────────────────────

export function useFlashcards() {
  const [cards, setCards]   = useState(() => storage.cacheRead(CARDS_KEY, []))
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    storage.getItem(CARDS_KEY, []).then(data => {
      setCards(data)
      setLoaded(true)
    })
  }, [])

  // Rate a card after review — updates SM-2 scheduling fields
  const rateCard = useCallback((cardId, rating) => {
    setCards(prev => {
      const next = prev.map(c => {
        if (c.id !== cardId) return c
        return { ...c, ...sm2(c, rating), mastered: true }
      })
      storage.setItem(CARDS_KEY, next)
      return next
    })
  }, [])

  // Cache cultural context on a card after it's generated
  const saveCulturalContext = useCallback((cardId, context) => {
    setCards(prev => {
      const next = prev.map(c => c.id === cardId ? { ...c, culturalContext: context } : c)
      storage.setItem(CARDS_KEY, next)
      return next
    })
  }, [])

  // Import cards from a parsed deck.
  // Cards whose Anki ID already exists are re-parsed (fields updated) while
  // preserving mastered state and cached cultural context. Brand-new IDs are
  // added, unless a card with the same definition or pinyin already exists in
  // a different deck entry (cross-deck dedup).
  const importCards = useCallback((parsed) => {
    setCards(prev => {
      const prevById    = new Map(prev.map(c => [c.id, c]))
      const prevDefs    = new Set(prev.map(c => c.definition?.toLowerCase().trim()).filter(Boolean))
      const prevPinyins = new Set(prev.map(c => c.pinyin?.toLowerCase().trim()).filter(Boolean))

      const seenIds     = new Set()
      const seenDefs    = new Set()
      const seenPinyins = new Set()

      const toUpdate = [] // same Anki ID — refresh parser fields, keep progress
      const toAdd    = [] // brand-new cards

      for (const c of parsed) {
        const def    = c.definition?.toLowerCase().trim()
        const pinyin = c.pinyin?.toLowerCase().trim()

        if (seenIds.has(c.id)) continue
        seenIds.add(c.id)
        if (def)    seenDefs.add(def)
        if (pinyin) seenPinyins.add(pinyin)

        if (prevById.has(c.id)) {
          const existing = prevById.get(c.id)
          toUpdate.push({
            ...c,
            mastered:       existing.mastered,
            culturalContext: existing.culturalContext,
            interval:       existing.interval,
            easeFactor:     existing.easeFactor,
            repetitions:    existing.repetitions,
            dueDate:        existing.dueDate,
          })
        } else {
          if (def    && prevDefs.has(def))    continue
          if (pinyin && prevPinyins.has(pinyin)) continue
          toAdd.push(c)
        }
      }

      const updatesById = new Map(toUpdate.map(c => [c.id, c]))
      const next = [
        ...prev.map(c => updatesById.has(c.id) ? updatesById.get(c.id) : c),
        ...toAdd,
      ]
      storage.setItem(CARDS_KEY, next)
      return next
    })
    return parsed.length
  }, [])

  // Return shuffled cards that are due today (dueDate unset = new card = due now)
  const getSessionCards = useCallback(() => {
    const t = today()
    return shuffle(cards.filter(c => !c.dueDate || c.dueDate <= t))
  }, [cards])

  // Add a single manually-created card
  const addCard = useCallback((card) => {
    setCards(prev => {
      const next = [...prev, card]
      storage.setItem(CARDS_KEY, next)
      return next
    })
  }, [])

  // Delete all cards
  const clearDeck = useCallback(() => {
    setCards([])
    storage.setItem(CARDS_KEY, [])
  }, [])

  const t            = today()
  const totalCards   = cards.length
  const dueCount     = cards.filter(c => !c.dueDate || c.dueDate <= t).length
  const newCount     = cards.filter(c => !c.dueDate).length

  return {
    cards,
    totalCards,
    dueCount,
    newCount,
    loaded,
    rateCard,
    importCards,
    addCard,
    clearDeck,
    getSessionCards,
  }
}
