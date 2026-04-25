import { useState, useEffect, useCallback } from 'react'
import {
  fetchCurrentMonth,
  fetchCategories,
  getToken,
  getBudgetId,
} from '../services/ynab'
import * as storage from '../services/storage'

// YNAB cache stays in localStorage only — it's a short-lived API cache, not user data
const CACHE_KEY = 'money:ynab_cache'
const CACHE_TTL = 60 * 60 * 1000 // 1 hour

function getCached() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { data, timestamp } = JSON.parse(raw)
    if (Date.now() - timestamp > CACHE_TTL) return null
    return data
  } catch {
    return null
  }
}

function setCache(data) {
  localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }))
}

// ── YNAB data hook ────────────────────────────────────────────────
export function useYNABData() {
  const [data, setData]       = useState(() => getCached())
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const load = useCallback(async (force = false) => {
    const token    = getToken()
    const budgetId = getBudgetId()
    if (!token || !budgetId) return

    if (!force) {
      const cached = getCached()
      if (cached) { setData(cached); return }
    }

    setLoading(true)
    setError(null)
    try {
      const [month, categoryGroups] = await Promise.all([
        fetchCurrentMonth(budgetId),
        fetchCategories(budgetId),
      ])
      const result = { month, categoryGroups }
      setCache(result)
      setData(result)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { data, loading, error, refresh: () => load(true) }
}

// ── Money check-in history ────────────────────────────────────────
export function useMoneyCheckins() {
  const [checkins, setCheckins] = useState(() => storage.cacheRead('money:checkins', []))

  useEffect(() => {
    storage.getItem('money:checkins', []).then(setCheckins)
  }, [])

  function saveCheckin(entry) {
    setCheckins(prev => {
      const updated = [entry, ...prev].slice(0, 52)
      storage.setItem('money:checkins', updated)
      return updated
    })
  }

  const last = checkins[0] ?? null
  const daysSinceLast = last
    ? Math.floor((Date.now() - new Date(last.date).getTime()) / 86400000)
    : null

  return { checkins, saveCheckin, lastCheckin: last, daysSinceLast }
}
