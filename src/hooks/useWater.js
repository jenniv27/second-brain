import { useState, useEffect, useCallback } from 'react'

function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback }
}
function save(key, val) { localStorage.setItem(key, JSON.stringify(val)) }

function todayKey() { return `goals:water:${new Date().toISOString().slice(0, 10)}` }

const DEFAULT_SETTINGS = { goal: 8, reminders: false, intervalHours: 2, startHour: 8, endHour: 21 }

export function useWater() {
  const [glasses, setGlasses]         = useState(() => load(todayKey(), 0))
  const [settings, setSettings]       = useState(() => load('goals:water:settings', DEFAULT_SETTINGS))
  const [notifPermission, setPermission] = useState('default')

  useEffect(() => {
    if (typeof Notification !== 'undefined') {
      setPermission(Notification.permission)
    }
  }, [])

  function addGlass() {
    const next = glasses + 1
    setGlasses(next)
    save(todayKey(), next)
  }

  function removeGlass() {
    const next = Math.max(0, glasses - 1)
    setGlasses(next)
    save(todayKey(), next)
  }

  async function requestPermission() {
    if (typeof Notification === 'undefined') return
    const result = await Notification.requestPermission()
    setPermission(result)
    if (result === 'granted') {
      const next = { ...settings, reminders: true }
      save('goals:water:settings', next)
      setSettings(next)
    }
  }

  function disableReminders() {
    const next = { ...settings, reminders: false }
    save('goals:water:settings', next)
    setSettings(next)
  }

  function updateSettings(patch) {
    const next = { ...settings, ...patch }
    save('goals:water:settings', next)
    setSettings(next)
  }

  const fireReminderIfDue = useCallback(async () => {
    if (!settings.reminders) return
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return

    const now   = new Date()
    const hour  = now.getHours()
    if (hour < settings.startHour || hour >= settings.endHour) return

    const last        = load('goals:water:lastReminder', 0)
    const intervalMs  = settings.intervalHours * 60 * 60 * 1000
    if (Date.now() - last < intervalMs) return

    try {
      const reg = await navigator.serviceWorker.ready
      const currentGlasses = load(todayKey(), 0)
      reg.showNotification('Time to hydrate ✦', {
        body: `You've had ${currentGlasses} glass${currentGlasses === 1 ? '' : 'es'} today.`,
        icon: '/pwa-192x192.png',
        tag: 'water-reminder',
        renotify: true,
      })
      save('goals:water:lastReminder', Date.now())
    } catch {}
  }, [settings])

  useEffect(() => {
    fireReminderIfDue()
    const id = setInterval(fireReminderIfDue, 5 * 60 * 1000)
    return () => clearInterval(id)
  }, [fireReminderIfDue])

  return {
    glasses,
    settings,
    notifPermission,
    addGlass,
    removeGlass,
    requestPermission,
    disableReminders,
    updateSettings,
  }
}
