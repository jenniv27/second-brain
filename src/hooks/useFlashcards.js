import { useState, useEffect, useCallback } from 'react'
import * as storage from '../services/storage'

const CARDS_KEY = 'learn:mandarin:cards'

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

// ── SM-2 algorithm ───────────────────────────────────────────────
// quality: 1 = again, 3 = hard, 4 = good, 5 = easy
export function sm2Review(card, quality) {
  let { interval = 1, repetitions = 0, easeFactor = 2.5 } = card

  if (quality < 3) {
    repetitions = 0
    interval = 1
  } else {
    repetitions += 1
    if (repetitions === 1) interval = 1
    else if (repetitions === 2) interval = 6
    else interval = Math.round(interval * easeFactor)
  }

  easeFactor = Math.max(
    1.3,
    easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
  )

  const due = new Date()
  due.setDate(due.getDate() + interval)

  return {
    ...card,
    interval,
    repetitions,
    easeFactor,
    dueDate: due.toISOString().slice(0, 10),
    lastReviewed: todayStr(),
  }
}

// ── Card parsing from Anki SQL results ──────────────────────────
function stripHtml(html) {
  return (html ?? '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim()
}

export function parseAnkiCards(db) {
  const cards = []

  // Get note fields for each card (join cards + notes)
  const result = db.exec(`
    SELECT c.id, c.nid, c.reps, c.ivl, c.factor, c.due, c.type,
           n.flds, n.tags
    FROM cards c
    JOIN notes n ON c.nid = n.id
    WHERE c.type != 3
    ORDER BY c.due ASC
  `)

  if (!result.length) return cards

  const rows = result[0].values
  const today = todayStr()

  for (const row of rows) {
    const [id, nid, reps, ivl, factor, due, type, flds, tags] = row
    const fields = (flds ?? '').split('\x1f').map(stripHtml)
    const front = fields[0] ?? ''
    const back  = fields[1] ?? ''
    if (!front) continue

    // Convert Anki due/ivl to our format
    // ivl > 0 = days, ivl < 0 = seconds (learning steps)
    const interval = Math.max(1, ivl > 0 ? ivl : 1)
    const easeFactor = factor ? factor / 1000 : 2.5

    // Estimate dueDate: for new/learning cards, due today
    // For review cards: Anki stores due as day offset from collection creation
    // We just schedule them all from today for a fresh start
    const dueDate = reps === 0 ? today : today

    cards.push({
      id: String(id),
      noteId: String(nid),
      front,
      back,
      tags: (tags ?? '').trim().split(/\s+/).filter(Boolean),
      interval,
      repetitions: reps ?? 0,
      easeFactor,
      dueDate,
      lastReviewed: null,
      mastered: false,
      culturalContext: null,
    })
  }

  return cards
}

// ── Hook ─────────────────────────────────────────────────────────
export function useFlashcards() {
  const [cards, setCards] = useState(() => storage.cacheRead(CARDS_KEY, []))
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    storage.getItem(CARDS_KEY, []).then(data => {
      setCards(data)
      setLoaded(true)
    })
  }, [])

  const saveCards = useCallback((next) => {
    setCards(next)
    storage.setItem(CARDS_KEY, next)
  }, [])

  // Cards due today or overdue
  const dueToday = cards.filter(c => !c.mastered && c.dueDate <= todayStr())

  // After reviewing a card, update it in the array
  const reviewCard = useCallback((cardId, quality) => {
    setCards(prev => {
      const next = prev.map(c => {
        if (c.id !== cardId) return c
        const updated = sm2Review(c, quality)
        // Mark mastered once card has had 3+ successful reviews
        const mastered = updated.repetitions >= 3
        return { ...updated, mastered }
      })
      storage.setItem(CARDS_KEY, next)
      return next
    })
  }, [])

  // Import a batch of parsed cards (merge with existing by id)
  const importCards = useCallback((parsed) => {
    setCards(prev => {
      const existingIds = new Set(prev.map(c => c.id))
      const newCards = parsed.filter(c => !existingIds.has(c.id))
      const next = [...prev, ...newCards]
      storage.setItem(CARDS_KEY, next)
      return next
    })
    return parsed.length
  }, [])

  const totalCards   = cards.length
  const masteredCount = cards.filter(c => c.mastered).length
  const dueCount     = dueToday.length

  return {
    cards,
    dueToday,
    totalCards,
    masteredCount,
    dueCount,
    loaded,
    reviewCard,
    importCards,
  }
}
