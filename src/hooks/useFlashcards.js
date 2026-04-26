import { useState, useEffect, useCallback } from 'react'
import * as storage from '../services/storage'

const CARDS_KEY = 'learn:mandarin:cards'

// ── Field detection helpers ──────────────────────────────────────

function isHanzi(text) {
  if (!text) return false
  const hanziCount = (text.match(/[一-鿿㐀-䶿]/g) || []).length
  const totalChars = text.replace(/\s/g, '').length
  // Only treat as "hanzi field" if majority of chars are hanzi
  return totalChars > 0 && hanziCount / totalChars > 0.5
}

function looksLikePinyin(text) {
  if (!text || text.length > 80) return false
  // Tone-mark pinyin: nǐ hǎo
  if (/[āáǎàōóǒòēéěèīíǐìūúǔùǖǘǚǜ]/.test(text)) return true
  // Numbered-tone pinyin: ni3 hao3 / zhong1guo2
  return /^[a-züÜ:,;\s]+[1-5](\s|$)/i.test(text.trim())
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

// Returns { modelId → [fieldName, ...] } for ALL models in the collection
function getAllModels(db) {
  try {
    const res = db.exec('SELECT models FROM col LIMIT 1')
    if (!res.length) return {}
    const raw = res[0].values[0][0]
    if (!raw) return {}
    const models = JSON.parse(raw)
    return Object.fromEntries(
      Object.entries(models).map(([id, m]) => [
        String(id),
        m?.flds?.map(f => f.name.toLowerCase()) ?? [],
      ])
    )
  } catch { return {} }
}

function findIdx(names, patterns) {
  if (!names || !names.length) return -1
  return names.findIndex(n => patterns.some(p => n.includes(p)))
}

// ── Deck parser ──────────────────────────────────────────────────

export function parseAnkiCards(db) {
  const allModels = getAllModels(db)

  const pinyinPatterns  = ['pinyin', 'reading', 'romanization', 'pronunciation']
  const englishPatterns = ['english', 'definition', 'meaning', 'translation', 'gloss', 'answer', 'back']
  const audioPatterns   = ['audio', 'sound']
  const hanziPatterns   = ['hanzi', 'chinese', 'simplified', 'mandarin', 'character',
                           'word', 'vocab', 'expression', 'front']

  // Include n.mid so we can look up the correct model for each note
  const result = db.exec(`
    SELECT c.id, c.nid, n.flds, n.tags, n.mid
    FROM cards c
    JOIN notes n ON c.nid = n.id
    GROUP BY c.nid
    ORDER BY c.id ASC
  `)
  if (!result.length) return []

  const cards = []

  for (const [id, nid, flds, tags, mid] of result[0].values) {
    // Use the field names for THIS note's model (not just the first model)
    const fieldNames = allModels[String(mid)] ?? null

    const pinyinIdx  = findIdx(fieldNames, pinyinPatterns)
    const englishIdx = findIdx(fieldNames, englishPatterns)
    const audioIdx   = findIdx(fieldNames, audioPatterns)
    const hanziIdx   = findIdx(fieldNames, hanziPatterns)

    const rawFields = (flds ?? '').split('\x1f')
    const clean     = rawFields.map(stripTags)

    let pinyin     = pinyinIdx >= 0  ? (clean[pinyinIdx]  || null) : null
    let definition = englishIdx >= 0 ? (clean[englishIdx] || null) : null
    let audioFile  = audioIdx >= 0   ? extractAudioFilename(rawFields[audioIdx]) : null
    let hanzi      = hanziIdx >= 0   ? (clean[hanziIdx]   || null) : null

    // Content-based fallbacks
    if (!audioFile) {
      audioFile = rawFields.map(extractAudioFilename).find(Boolean) ?? null
    }
    if (!hanzi) {
      hanzi = clean.find(f => f && isHanzi(f)) ?? null
    }
    if (!pinyin) {
      pinyin = clean.find(f => f && looksLikePinyin(f) && !isHanzi(f)) ?? null
    }
    if (!definition) {
      // Prefer a field that's clearly not hanzi and not pinyin
      definition = clean.find(f => f && !isHanzi(f) && f !== pinyin) ?? null
    }
    // Last resort: first non-empty field
    if (!definition && !pinyin) {
      const any = clean.find(f => f)
      if (!any) continue
      definition = any
    }

    cards.push({
      id:              String(id),
      noteId:          String(nid),
      hanzi:           hanzi ?? '',
      pinyin:          pinyin ?? '',
      definition:      definition ?? '',
      audioFile:       audioFile,
      tags:            (tags ?? '').trim().split(/\s+/).filter(Boolean),
      mastered:        false,
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

  // Import new cards from parsed deck (skip duplicates by id, definition, or pinyin)
  const importCards = useCallback((parsed) => {
    setCards(prev => {
      const existingIds        = new Set(prev.map(c => c.id))
      const existingDefs       = new Set(prev.map(c => c.definition?.toLowerCase().trim()).filter(Boolean))
      const existingPinyins    = new Set(prev.map(c => c.pinyin?.toLowerCase().trim()).filter(Boolean))

      // Also deduplicate within the incoming batch itself
      const seenIds     = new Set()
      const seenDefs    = new Set()
      const seenPinyins = new Set()

      const fresh = parsed.filter(c => {
        const def    = c.definition?.toLowerCase().trim()
        const pinyin = c.pinyin?.toLowerCase().trim()

        if (existingIds.has(c.id))            return false
        if (def    && existingDefs.has(def))   return false
        if (pinyin && existingPinyins.has(pinyin)) return false
        if (seenIds.has(c.id))                return false
        if (def    && seenDefs.has(def))       return false
        if (pinyin && seenPinyins.has(pinyin)) return false

        seenIds.add(c.id)
        if (def)    seenDefs.add(def)
        if (pinyin) seenPinyins.add(pinyin)
        return true
      })

      const next = [...prev, ...fresh]
      storage.setItem(CARDS_KEY, next)
      return next
    })
    return parsed.length
  }, [])

  // Return a shuffled copy of cards that have something to display
  const getSessionCards = useCallback(
    () => shuffle(cards.filter(c => c.definition || c.pinyin || c.hanzi)),
    [cards]
  )

  const clearCards = useCallback(() => {
    setCards([])
    storage.setItem(CARDS_KEY, [])
  }, [])

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
    clearCards,
    getSessionCards,
  }
}
