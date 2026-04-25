import { useState, useCallback, useEffect } from 'react'
import { NET_WORTH_MILESTONES, WEIGHT_MILESTONES, SOCIAL_ACKNOWLEDGMENTS } from '../data/goalsData'
import * as storage from '../services/storage'

function todayStr() { return new Date().toISOString().slice(0, 10) }
function thisMonth() { return new Date().toISOString().slice(0, 7) }

// ── Adds a task directly to the home tasks list ──────────────────
async function addHomeTask(title) {
  const existing = await storage.getItem('home:tasks', [])
  const month    = thisMonth()
  const already  = existing.some(t => t.title === title && t.createdAt?.startsWith(month))
  if (already) return
  const next = [
    {
      id: `task-${Date.now()}`,
      title,
      type: 'task',
      deadline: null,
      createdAt: new Date().toISOString(),
      archived: false,
      reflection: null,
    },
    ...existing,
  ]
  storage.setItem('home:tasks', next)
}

// ── Net Worth ─────────────────────────────────────────────────────
export function useNetWorth() {
  const [history, setHistory]   = useState(() => storage.cacheRead('goals:networth', []))
  const [showPrompt, setPrompt] = useState(false)

  useEffect(() => {
    storage.getItem('goals:networth', []).then(setHistory)
  }, [])

  useEffect(() => {
    const isFirst = new Date().getDate() === 1
    if (!isFirst) return
    storage.getItem('goals:networth:prompted', null).then(lastPrompted => {
      if (lastPrompted !== thisMonth()) setPrompt(true)
    })
  }, [])

  function saveNetWorth(amount) {
    const entry = { date: todayStr(), amount: Number(amount) }
    setHistory(prev => {
      const next = [entry, ...prev]
      storage.setItem('goals:networth', next)
      return next
    })
    storage.setItem('goals:networth:prompted', thisMonth())
    addHomeTask('Reconcile finances')
    setPrompt(false)
  }

  function dismissPrompt() {
    storage.setItem('goals:networth:prompted', thisMonth())
    setPrompt(false)
  }

  const current = history[0]?.amount ?? null

  const achievedMilestones = current !== null
    ? NET_WORTH_MILESTONES.filter(m => current >= m)
    : []

  const nextMilestone = current !== null
    ? NET_WORTH_MILESTONES.find(m => m > current) ?? null
    : null

  return { history, current, achievedMilestones, nextMilestone, showPrompt, saveNetWorth, dismissPrompt }
}

// ── Oura Steps ────────────────────────────────────────────────────
// Steps cache stays local only — it's a short-lived API cache, not user data
export function useSteps() {
  const [data, setData]       = useState(() => storage.cacheRead('goals:steps_cache', null))
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const fetch7Days = useCallback(async (force = false) => {
    if (!force && data) return
    setLoading(true)
    setError(null)
    try {
      const end   = todayStr()
      const start = new Date(Date.now() - 6 * 86400000).toISOString().slice(0, 10)
      const res   = await fetch(`/api/oura?start_date=${start}&end_date=${end}`)
      const json  = await res.json()
      if (json.error === 'no_token') throw new Error('no_token')
      if (!res.ok) throw new Error('api_error')
      const days  = (json.data ?? []).map(d => ({ day: d.day, steps: d.steps ?? 0 }))
      localStorage.setItem('goals:steps_cache', JSON.stringify(days))
      setData(days)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [data])

  useEffect(() => { fetch7Days() }, [])

  const weeklyAvg = data ? Math.round(data.reduce((s, d) => s + d.steps, 0) / data.length) : null
  const daysAt10k = data ? data.filter(d => d.steps >= 10_000).length : null

  return { data, loading, error, weeklyAvg, daysAt10k, refresh: () => fetch7Days(true) }
}

// ── Weight ────────────────────────────────────────────────────────
export function useWeight() {
  const [state, setState] = useState(() => storage.cacheRead('goals:weight', { startWeight: null, logs: [] }))

  useEffect(() => {
    storage.getItem('goals:weight', { startWeight: null, logs: [] }).then(setState)
  }, [])

  function setStartWeight(w) {
    const next = { ...state, startWeight: Number(w) }
    storage.setItem('goals:weight', next)
    setState(next)
  }

  function logWeight(w) {
    const log  = { date: todayStr(), weight: Number(w) }
    const next = { ...state, logs: [log, ...state.logs] }
    storage.setItem('goals:weight', next)
    setState(next)
  }

  const latestWeight = state.logs[0]?.weight ?? null
  const lostLbs = (state.startWeight !== null && latestWeight !== null)
    ? Math.max(0, state.startWeight - latestWeight)
    : null

  const achievedMilestones = lostLbs !== null
    ? WEIGHT_MILESTONES.filter(m => lostLbs >= m.lbs)
    : []

  const nextMilestone = lostLbs !== null
    ? WEIGHT_MILESTONES.find(m => lostLbs < m.lbs) ?? null
    : null

  return {
    startWeight: state.startWeight,
    latestWeight,
    lostLbs,
    achievedMilestones,
    nextMilestone,
    setStartWeight,
    logWeight,
    hasSetup: state.startWeight !== null,
  }
}

// ── Cooking Log ───────────────────────────────────────────────────
export function useCooking() {
  const [logs, setLogs]       = useState(() => storage.cacheRead('goals:cooking:logs', []))
  const [recipes, setRecipes] = useState(() => storage.cacheRead('goals:cooking:recipes', []))

  useEffect(() => {
    storage.getItem('goals:cooking:logs', []).then(setLogs)
    storage.getItem('goals:cooking:recipes', []).then(setRecipes)
  }, [])

  function logMeal(dish = null) {
    const next = [{ id: `meal-${Date.now()}`, date: todayStr(), dish }, ...logs]
    storage.setItem('goals:cooking:logs', next)
    setLogs(next)
  }

  function addRecipe({ name, rating }) {
    const next = [{ id: `recipe-${Date.now()}`, name: name.trim(), rating, addedAt: todayStr() }, ...recipes]
    storage.setItem('goals:cooking:recipes', next)
    setRecipes(next)
  }

  function deleteRecipe(id) {
    const next = recipes.filter(r => r.id !== id)
    storage.setItem('goals:cooking:recipes', next)
    setRecipes(next)
  }

  const month          = thisMonth()
  const mealsThisMonth = logs.filter(l => l.date.startsWith(month)).length

  return { logs, recipes, mealsThisMonth, logMeal, addRecipe, deleteRecipe }
}

// ── Solo Social Meetups ───────────────────────────────────────────
export function useSocial() {
  const [meetups, setMeetups] = useState(() => storage.cacheRead('goals:social', []))
  const [lastAck, setLastAck] = useState(null)

  useEffect(() => {
    storage.getItem('goals:social', []).then(setMeetups)
  }, [])

  function addMeetup(description = null) {
    const entry = { id: `social-${Date.now()}`, date: todayStr(), description }
    setMeetups(prev => {
      const next = [entry, ...prev]
      storage.setItem('goals:social', next)
      const ack = SOCIAL_ACKNOWLEDGMENTS[next.length % SOCIAL_ACKNOWLEDGMENTS.length]
      setLastAck(ack)
      setTimeout(() => setLastAck(null), 4000)
      return next
    })
  }

  return { meetups, total: meetups.length, addMeetup, lastAck }
}

// ── Mandarin Words ────────────────────────────────────────────────
export function useMandarinCount() {
  const [words, setWords] = useState(() => storage.cacheRead('learn:mandarin:words', []))

  useEffect(() => {
    storage.getItem('learn:mandarin:words', []).then(setWords)
  }, [])

  const mastered = words.filter(w => w.mastered).length
  return { mastered, total: words.length }
}
