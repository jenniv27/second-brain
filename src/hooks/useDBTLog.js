import { useState, useEffect, useCallback } from 'react'
import * as storage from '../services/storage'

const LOG_KEY = 'dbt:log'

export function useDBTLog() {
  const [log, setLog] = useState(() => storage.cacheRead(LOG_KEY, []))

  useEffect(() => {
    storage.getItem(LOG_KEY, []).then(data => setLog(data))
  }, [])

  const addEntry = useCallback((skill, tier, reward) => {
    const entry = {
      id:        Date.now(),
      timestamp: new Date().toISOString(),
      date:      new Date().toISOString().split('T')[0],
      module:    skill.module,
      skillId:   skill.id,
      prompt:    skill.prompt,
      tier,
      reward,
    }
    setLog(prev => {
      const next = [entry, ...prev]
      storage.setItem(LOG_KEY, next)
      return next
    })
  }, [])

  return { log, addEntry }
}
