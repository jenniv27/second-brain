import { useState, useEffect, useCallback } from 'react'
import { SUPPLEMENT_PHASES } from '../data/bodyData'

function todayKey() {
  return new Date().toISOString().slice(0, 10) // YYYY-MM-DD
}

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

// ── Phase state ──────────────────────────────
// { phaseId: 'stimulant', startDate: 'YYYY-MM-DD' }
export function usePhase() {
  const [phase, setPhaseState] = useState(() =>
    loadJSON('body:phase', { phaseId: 'stimulant', startDate: todayKey() })
  )

  const currentPhase = SUPPLEMENT_PHASES.find(p => p.id === phase.phaseId) ?? SUPPLEMENT_PHASES[0]

  const dayNumber = (() => {
    const start = new Date(phase.startDate)
    const today = new Date(todayKey())
    const diff = Math.floor((today - start) / 86400000) + 1
    return Math.min(Math.max(diff, 1), currentPhase.totalDays)
  })()

  function setPhase(phaseId) {
    const next = { phaseId, startDate: todayKey() }
    setPhaseState(next)
    saveJSON('body:phase', next)
  }

  return { phase: currentPhase, dayNumber, setPhase }
}

// ── Daily checklist ──────────────────────────
// Keyed by date → { itemId: true/false }
export function useChecklist(namespace) {
  const key = `body:${namespace}:${todayKey()}`
  const [checked, setChecked] = useState(() => loadJSON(key, {}))

  const toggle = useCallback((id) => {
    setChecked(prev => {
      const next = { ...prev, [id]: !prev[id] }
      saveJSON(key, next)
      return next
    })
  }, [key])

  return { checked, toggle }
}

// ── Exercise log ─────────────────────────────
export function useExercise() {
  const key = `body:exercise:${todayKey()}`
  const [exercise, setExerciseState] = useState(() =>
    loadJSON(key, { effort: null, note: '' })
  )

  function setExercise(update) {
    setExerciseState(prev => {
      const next = { ...prev, ...update }
      saveJSON(key, next)
      return next
    })
  }

  return { exercise, setExercise }
}

// ── Sleep log ────────────────────────────────
export function useSleep() {
  const key = `body:sleep:${todayKey()}`
  const [sleep, setSleepState] = useState(() =>
    loadJSON(key, { bedtime: '', wakeTime: '', feel: null })
  )

  function setSleep(update) {
    setSleepState(prev => {
      const next = { ...prev, ...update }
      saveJSON(key, next)
      return next
    })
  }

  return { sleep, setSleep }
}

// ── Morning intention ────────────────────────
export function useMorningIntention() {
  const key = `body:intention:${todayKey()}`
  const [intention, setIntentionState] = useState(() =>
    loadJSON(key, '')
  )

  function setIntention(text) {
    setIntentionState(text)
    saveJSON(key, text)
  }

  return { intention, setIntention }
}
