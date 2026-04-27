import { useState, useEffect, useCallback } from 'react'
import * as storage from '../services/storage'

const HABIT_KEY     = 'habits:config'
const INVENTORY_KEY = 'habits:inventory'
const STATS_KEY     = 'habits:stats'

export const COLORS = ['red', 'blue', 'green', 'purple', 'orange', 'teal']
export const ALL_COLORS = [...COLORS, 'gold']

export const CLIP_HEX = {
  red:    '#ef5350',
  blue:   '#42a5f5',
  green:  '#66bb6a',
  purple: '#ab47bc',
  orange: '#ffa726',
  teal:   '#26c6da',
  gold:   '#ffd700',
}

// 10% gold, 15% each regular color
const CLIP_POOL = [
  ...Array(10).fill('gold'),
  ...COLORS.flatMap(c => Array(15).fill(c)),
]

export function drawRandomClip() {
  return CLIP_POOL[Math.floor(Math.random() * CLIP_POOL.length)]
}

const EMPTY_INVENTORY = Object.fromEntries(ALL_COLORS.map(c => [c, 0]))

const DEFAULT_HABIT = {
  name: '',
  t1Reward: '',
  t2Reward: '',
  t3Reward: '',
  jackpotReward: '',
  miniGoal: 20,
  midGoal: 50,
  moonshotGoal: 100,
  miniPrize: '',
  midPrize: '',
  moonshotPrize: '',
}

const DEFAULT_STATS = {
  totalClips: 0,
  totalSessions: 0,
}

// Returns available cash-in options given current inventory
export function getCashInOptions(inventory) {
  const opts = [{ tier: 1, label: 'Spin at Tier 1', cost: null }]

  // T3 via gold (preferred over 3-match)
  if (inventory.gold >= 1) {
    opts.push({ tier: 3, label: '1 gold clip → Tier 3 ★', cost: { color: 'gold', count: 1 } })
  } else {
    for (const c of COLORS) {
      if (inventory[c] >= 3) {
        opts.push({ tier: 3, label: `3 ${c} clips → Tier 3`, cost: { color: c, count: 3 } })
        break
      }
    }
  }

  // T2 (only show if T3 not already unlocked)
  const hasT3 = opts.some(o => o.tier === 3)
  if (!hasT3) {
    for (const c of COLORS) {
      if (inventory[c] >= 2) {
        opts.push({ tier: 2, label: `2 ${c} clips → Tier 2`, cost: { color: c, count: 2 } })
        break
      }
    }
  }

  return opts
}

export function useHabits() {
  const [habit, setHabit]         = useState(() => storage.cacheRead(HABIT_KEY, DEFAULT_HABIT))
  const [inventory, setInventory] = useState(() => storage.cacheRead(INVENTORY_KEY, EMPTY_INVENTORY))
  const [stats, setStats]         = useState(() => storage.cacheRead(STATS_KEY, DEFAULT_STATS))
  const [loaded, setLoaded]       = useState(false)

  useEffect(() => {
    Promise.all([
      storage.getItem(HABIT_KEY, DEFAULT_HABIT),
      storage.getItem(INVENTORY_KEY, EMPTY_INVENTORY),
      storage.getItem(STATS_KEY, DEFAULT_STATS),
    ]).then(([h, inv, st]) => {
      setHabit(h)
      setInventory(inv)
      setStats(st)
      setLoaded(true)
    })
  }, [])

  const saveHabit = useCallback((data) => {
    setHabit(data)
    storage.setItem(HABIT_KEY, data)
  }, [])

  const addClip = useCallback((color) => {
    setInventory(prev => {
      const next = { ...prev, [color]: (prev[color] ?? 0) + 1 }
      storage.setItem(INVENTORY_KEY, next)
      return next
    })
    setStats(prev => {
      const next = { ...prev, totalClips: prev.totalClips + 1 }
      storage.setItem(STATS_KEY, next)
      return next
    })
  }, [])

  const spendClips = useCallback((color, count) => {
    setInventory(prev => {
      const next = { ...prev, [color]: Math.max(0, (prev[color] ?? 0) - count) }
      storage.setItem(INVENTORY_KEY, next)
      return next
    })
  }, [])

  const incrementSessions = useCallback(() => {
    setStats(prev => {
      const next = { ...prev, totalSessions: prev.totalSessions + 1 }
      storage.setItem(STATS_KEY, next)
      return next
    })
  }, [])

  const resetInventory = useCallback(() => {
    setInventory(EMPTY_INVENTORY)
    storage.setItem(INVENTORY_KEY, EMPTY_INVENTORY)
  }, [])

  const totalClipsInJar = stats.totalClips

  return {
    habit, inventory, stats, loaded,
    saveHabit, addClip, spendClips, incrementSessions, resetInventory,
    totalClipsInJar,
  }
}
