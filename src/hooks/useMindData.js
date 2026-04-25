import { useState, useEffect, useCallback } from 'react'
import * as storage from '../services/storage'

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

// ── Routine completions ──────────────────────────────────────────
// Keyed by date → { routineId: 'fully'|'mostly'|'showed_up' }
export function useRoutineCompletions() {
  const key = `mind:completions:${todayKey()}`
  const [done, setDone] = useState(() => storage.cacheRead(key, {}))

  useEffect(() => {
    storage.getItem(key, {}).then(setDone)
  }, [key])

  const complete = useCallback((routineId, quality) => {
    setDone(prev => {
      const next = { ...prev, [routineId]: quality }
      storage.setItem(key, next)
      return next
    })
  }, [key])

  const uncomplete = useCallback((routineId) => {
    setDone(prev => {
      const next = { ...prev }
      delete next[routineId]
      storage.setItem(key, next)
      return next
    })
  }, [key])

  return { done, complete, uncomplete }
}

// ── Weekly check-in history ──────────────────────────────────────
export function useCheckinHistory() {
  const [history, setHistory] = useState(() => storage.cacheRead('mind:checkins', []))

  useEffect(() => {
    storage.getItem('mind:checkins', []).then(setHistory)
  }, [])

  function saveCheckin(entry) {
    setHistory(prev => {
      const next = [entry, ...prev].slice(0, 52)
      storage.setItem('mind:checkins', next)
      return next
    })
  }

  const lastCheckin = history[0] ?? null
  const daysSinceLast = lastCheckin
    ? Math.floor((Date.now() - new Date(lastCheckin.date)) / 86400000)
    : null

  return { history, saveCheckin, lastCheckin, daysSinceLast }
}

// ── Identity statements ──────────────────────────────────────────
export function useIdentityStatements() {
  const [statements, setStatements] = useState(() => storage.cacheRead('mind:identity', []))

  useEffect(() => {
    storage.getItem('mind:identity', []).then(setStatements)
  }, [])

  function addStatement(text) {
    setStatements(prev => {
      const next = [...prev, { text, addedAt: todayKey() }]
      storage.setItem('mind:identity', next)
      return next
    })
  }

  return { statements, addStatement }
}
