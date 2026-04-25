import { useState, useEffect, useCallback } from 'react'
import * as storage from '../services/storage'

function todayKey() { return `goals:water:${new Date().toISOString().slice(0, 10)}` }

const DEFAULT_SETTINGS = { goal: 8, reminders: false, intervalHours: 2, startHour: 8, endHour: 21 }

export function useWater() {
  const [glasses, setGlasses]           = useState(() => storage.cacheRead(todayKey(), 0))
  const [settings, setSettings]         = useState(() => storage.cacheRead('goals:water:settings', DEFAULT_SETTINGS))
  const [notifPermission, setPermission] = useState('default')

  useEffect(() => {
    storage.getItem(todayKey(), 0).then(setGlasses)
    storage.getItem('goals:water:settings', DEFAULT_SETTINGS).then(setSettings)
  }, [])

  useEffect(() => {
    if (typeof Notification !== 'undefined') {
      setPermission(Notification.permission)
    }
  }, [])

  function addGlass() {
    setGlasses(prev => {
      const next = prev + 1
      storage.setItem(todayKey(), next)
      return next
    })
  }

  function removeGlass() {
    setGlasses(prev => {
      const next = Math.max(0, prev - 1)
      storage.setItem(todayKey(), next)
      return next
    })
  }

  async function requestPermission() {
    if (typeof Notification === 'undefined') return
    const result = await Notification.requestPermission()
    setPermission(result)
    if (result === 'granted') {
      const next = { ...settings, reminders: true }
      storage.setItem('goals:water:settings', next)
      setSettings(next)
    }
  }

  function disableReminders() {
    const next = { ...settings, reminders: false }
    storage.setItem('goals:water:settings', next)
    setSettings(next)
  }

  function updateSettings(patch) {
    const next = { ...settings, ...patch }
    storage.setItem('goals:water:settings', next)
    setSettings(next)
  }

  // Reminder timing is device-specific — keep in localStorage only
  const fireReminderIfDue = useCallback(async () => {
    if (!settings.reminders) return
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return

    const now  = new Date()
    const hour = now.getHours()
    if (hour < settings.startHour || hour >= settings.endHour) return

    const last       = storage.cacheRead('goals:water:lastReminder', 0)
    const intervalMs = settings.intervalHours * 60 * 60 * 1000
    if (Date.now() - last < intervalMs) return

    try {
      const reg            = await navigator.serviceWorker.ready
      const currentGlasses = storage.cacheRead(todayKey(), 0)
      reg.showNotification('Time to hydrate ✦', {
        body: `You've had ${currentGlasses} glass${currentGlasses === 1 ? '' : 'es'} today.`,
        icon: '/pwa-192x192.png',
        tag: 'water-reminder',
        renotify: true,
      })
      localStorage.setItem('goals:water:lastReminder', JSON.stringify(Date.now()))
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
