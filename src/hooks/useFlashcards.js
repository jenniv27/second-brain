import { useState, useEffect, useCallback } from 'react'
import * as storage from '../services/storage'

const CARDS_KEY = 'learn:mandarin:cards'

// ── Field detection helpers ──────────────────────────────────────

function isHanzi(text) {
  return /[一-鿿㐀-䶿]/.test(text)
}

function looksLikePinyin(text) {
  if (!text || text.length > 60) return false
  // Has tone marks = almost certainly pinyin
  return /[āáǎàōóǒòēéěèīíǐìūúǔùǖǘǚǜ]/.test(text)
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
  try {
    const res = db.exec('SELECT models FROM col LIMIT 1')
    if (!res.length) return null
    const models = JSON.parse(res[0].values[0][0])
    const first  = models[Object.keys(models)[0]]
    return first?.flds?.map(f => f.name.toLowerCase()) ?? null
  } catch { return null }
}

function findIdx(names, patterns) {
  if (!names) return -1
  return names.findIndex(n => patterns.some(p => n.includes(p)))
}

// ── Deck parser ──────────────────────────────────────────────────

export function parseAnkiCards(db) {
  const fieldNames = getModelFieldNames(db)

  // Detect field positions by name, then fall back to content heuristics
  const pinyinPatterns  = ['pinyin', 'reading', 'romanization', 'pronunciation']
  const englishPatterns = ['english', 'definition', 'meaning', 'translation', 'back', 'front']
  const audioPatterns   = ['audio', 'sound']

  let pinyinIdx  = findIdx(fieldNames, pinyinPatterns)
  let englishIdx = findIdx(fieldNames, englishPatterns)
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

    // If field names didn't identify pinyin/english, use content detection
    let pinyin     = pinyinIdx >= 0 ? clean[pinyinIdx] : null
    let definition = englishIdx >= 0 ? clean[englishIdx] : null
    let audioFile  = audioIdx >= 0 ? extractAudioFilename(rawFields[audioIdx]) : null

    // Content-based fallback
    if (!audioFile) {
      audioFile = rawFields.map(extractAudioFilename).find(Boolean) ?? null
    }
    if (!pinyin) {
      pinyin = clean.find(f => looksLikePinyin(f) && !isHanzi(f)) ?? null
    }
    if (!definition) {
      // First field that isn't hanzi-only and isn't the pinyin we already found
      definition = clean.find(f => f && !isHanzi(f) && f !== pinyin) ?? clean[0] ?? ''
    }

    if (!definition && !pinyin) continue

    cards.push({
      id:             String(id),
      noteId:         String(nid),
      pinyin:         pinyin ?? '',
      definition:     definition ?? '',
      audioFile:      audioFile,
      tags:           (tags ?? '').trim().split(/\s+/).filter(Boolean),
      mastered:       false,
      culturalContext: null,
    })
  }

  return cards
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

  // Mark a card as mastered (reviewed at least once)
  const markReviewed = useCallback((cardId) => {
    setCards(prev => {
      const next = prev.map(c => c.id === cardId ? { ...c, mastered: true } : c)
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

  // Import new cards from parsed deck (skip duplicates by id)
  const importCards = useCallback((parsed) => {
    setCards(prev => {
      const existing = new Set(prev.map(c => c.id))
      const fresh    = parsed.filter(c => !existing.has(c.id))
      const next     = [...prev, ...fresh]
      storage.setItem(CARDS_KEY, next)
      return next
    })
    return parsed.length
  }, [])

  // Return a shuffled copy of all cards for a session
  const getSessionCards = useCallback(() => shuffle(cards), [cards])

  const totalCards    = cards.length
  const masteredCount = cards.filter(c => c.mastered).length

  return {
    cards,
    totalCards,
    masteredCount,
    loaded,
    markReviewed,
    saveCulturalContext,
    importCards,
    getSessionCards,
  }
}
