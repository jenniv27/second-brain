import { useState, useEffect } from 'react'
import * as storage from '../services/storage'

const MOOD_KEY = 'mood:log'

export function useMoodLog() {
  const [log, setLog] = useState(() => storage.cacheRead(MOOD_KEY, {}))

  useEffect(() => {
    storage.getItem(MOOD_KEY, {}).then(data => setLog(data))
  }, [])

  const today = new Date().toISOString().split('T')[0]
  const todayMood = log[today] ?? null

  function setMood(moodId) {
    setLog(prev => {
      const next = { ...prev, [today]: moodId }
      storage.setItem(MOOD_KEY, next)
      return next
    })
  }

  function getWeek() {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      days.push({
        key,
        label: d.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 1),
        mood: log[key] ?? null,
        isToday: i === 0,
      })
    }
    return days
  }

  return { todayMood, setMood, getWeek }
}
