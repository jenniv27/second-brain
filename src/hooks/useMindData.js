import { useState, useCallback } from 'react'

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}
function loadJSON(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback }
}
function saveJSON(key, val) { localStorage.setItem(key, JSON.stringify(val)) }

// Routine completions keyed by date → { routineId: true }
export function useRoutineCompletions() {
  const key = `mind:completions:${todayKey()}`
  const [done, setDone] = useState(() => loadJSON(key, {}))

  const toggle = useCallback((routineId) => {
    setDone(prev => {
      const next = { ...prev, [routineId]: !prev[routineId] }
      saveJSON(key, next)
      return next
    })
  }, [key])

  return { done, toggle }
}

// Weekly check-in history
export function useCheckinHistory() {
  const [history, setHistory] = useState(() => loadJSON('mind:checkins', []))

  function saveCheckin(entry) {
    setHistory(prev => {
      const next = [entry, ...prev].slice(0, 52) // keep 1 year
      saveJSON('mind:checkins', next)
      return next
    })
  }

  const lastCheckin = history[0] ?? null
  const daysSinceLast = lastCheckin
    ? Math.floor((Date.now() - new Date(lastCheckin.date)) / 86400000)
    : null

  return { history, saveCheckin, lastCheckin, daysSinceLast }
}

// Identity statements (auto-populated by companion over time)
export function useIdentityStatements() {
  const [statements, setStatements] = useState(() => loadJSON('mind:identity', []))

  function addStatement(text) {
    setStatements(prev => {
      const next = [...prev, { text, addedAt: todayKey() }]
      saveJSON('mind:identity', next)
      return next
    })
  }

  return { statements, addStatement }
}
