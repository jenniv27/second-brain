import { useState, useEffect, useCallback } from 'react'
import { SUPPLEMENT_PHASES } from '../data/bodyData'
import * as storage from '../services/storage'

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

// ── Phase state ──────────────────────────────────────────────────
export function usePhase() {
  const [phase, setPhaseState] = useState(() =>
    storage.cacheRead('body:phase', { phaseId: 'stimulant', startDate: todayKey() })
  )

  useEffect(() => {
    storage.getItem('body:phase', { phaseId: 'stimulant', startDate: todayKey() })
      .then(setPhaseState)
  }, [])

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
    storage.setItem('body:phase', next)
  }

  return { phase: currentPhase, dayNumber, setPhase }
}

// ── Daily checklist ──────────────────────────────────────────────
export function useChecklist(namespace) {
  const key = `body:${namespace}:${todayKey()}`
  const [checked, setChecked] = useState(() => storage.cacheRead(key, {}))

  useEffect(() => {
    storage.getItem(key, {}).then(setChecked)
  }, [key])

  const toggle = useCallback((id) => {
    setChecked(prev => {
      const next = { ...prev, [id]: !prev[id] }
      storage.setItem(key, next)
      return next
    })
  }, [key])

  return { checked, toggle }
}

// ── Exercise log ─────────────────────────────────────────────────
export function useExercise() {
  const key = `body:exercise:${todayKey()}`
  const [exercise, setExerciseState] = useState(() =>
    storage.cacheRead(key, { effort: null, note: '' })
  )

  useEffect(() => {
    storage.getItem(key, { effort: null, note: '' }).then(setExerciseState)
  }, [key])

  function setExercise(update) {
    setExerciseState(prev => {
      const next = { ...prev, ...update }
      storage.setItem(key, next)
      return next
    })
  }

  return { exercise, setExercise }
}

// ── Sleep log ────────────────────────────────────────────────────
export function useSleep() {
  const key = `body:sleep:${todayKey()}`
  const [sleep, setSleepState] = useState(() =>
    storage.cacheRead(key, { bedtime: '', wakeTime: '', feel: null })
  )

  useEffect(() => {
    storage.getItem(key, { bedtime: '', wakeTime: '', feel: null }).then(setSleepState)
  }, [key])

  function setSleep(update) {
    setSleepState(prev => {
      const next = { ...prev, ...update }
      storage.setItem(key, next)
      return next
    })
  }

  return { sleep, setSleep }
}

// ── Morning intention ────────────────────────────────────────────
export function useMorningIntention() {
  const key = `body:intention:${todayKey()}`
  const [intention, setIntentionState] = useState(() =>
    storage.cacheRead(key, '')
  )

  useEffect(() => {
    storage.getItem(key, '').then(setIntentionState)
  }, [key])

  function setIntention(text) {
    setIntentionState(text)
    storage.setItem(key, text)
  }

  return { intention, setIntention }
}
