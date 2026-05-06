import { useState, useEffect, useCallback, useMemo } from 'react'
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

// ── Per-habit checkbox state ─────────────────────────────────────
// Key: mind:habitchecks:YYYY-MM-DD → { 'routineId:habitId': true, ... }
export function useHabitChecks() {
  const key = `mind:habitchecks:${todayKey()}`
  const [checks, setChecks] = useState(() => storage.cacheRead(key, {}))

  useEffect(() => {
    storage.getItem(key, {}).then(setChecks)
  }, [key])

  const toggle = useCallback((routineId, habitId) => {
    const hkey = `${routineId}:${habitId}`
    setChecks(prev => {
      const next = { ...prev, [hkey]: !prev[hkey] }
      storage.setItem(key, next)
      return next
    })
  }, [key])

  return { checks, toggle }
}

// ── Consecutive-day streak ───────────────────────────────────────
// Counts days (including today if completed) where morning or evening was done.
export function useStreak(todayDone) {
  const today = todayKey()
  const doneKeys = Object.keys(todayDone).sort().join(',')

  return useMemo(() => {
    let count = 0
    for (let i = 0; i < 365; i++) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateKey = d.toISOString().slice(0, 10)
      const c = dateKey === today
        ? todayDone
        : storage.cacheRead(`mind:completions:${dateKey}`, {})
      const hasCompletion = c.morning || c.evening
      if (hasCompletion) {
        count++
      } else if (dateKey === today) {
        continue // today not done yet — don't break the streak
      } else {
        break
      }
    }
    return count
  }, [doneKeys, today]) // eslint-disable-line react-hooks/exhaustive-deps
}
