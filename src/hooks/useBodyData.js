import { useState, useEffect, useCallback } from 'react'
import * as storage from '../services/storage'

function todayKey() {
  return new Date().toISOString().slice(0, 10)
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
