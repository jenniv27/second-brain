import { useState, useEffect } from 'react'
import * as storage from '../services/storage'

const TASKS_KEY = 'home:tasks'

export const REFLECTION_QUESTIONS = [
  'What made this possible?',
  'What would you do differently?',
  'What did finishing this feel like?',
  'Who helped, even indirectly?',
  'What did you learn from this one?',
]

export const WANT_TO_QUESTIONS = [
  'How did it feel to make time for this?',
  'What did you notice while you were doing it?',
  'What surprised you about this one?',
  'Did this give you energy or ask for it?',
  'What would you want to remember about doing this?',
]

function sortTasks(tasks) {
  return [...tasks].sort((a, b) => {
    const aHard = a.deadline?.type === 'hard'
    const bHard = b.deadline?.type === 'hard'
    if (aHard && !bHard) return -1
    if (!aHard && bHard) return 1
    if (a.deadline && b.deadline) return new Date(a.deadline.date) - new Date(b.deadline.date)
    if (a.deadline && !b.deadline) return -1
    if (!a.deadline && b.deadline) return 1
    return new Date(b.createdAt) - new Date(a.createdAt)
  })
}

export function useHomeTasks() {
  const [tasks, setTasks] = useState(() => storage.cacheRead(TASKS_KEY, []))

  useEffect(() => {
    storage.getItem(TASKS_KEY, []).then(setTasks)
  }, [])

  function addTask({ title, deadline, type = 'task' }) {
    const next = [
      {
        id: `task-${Date.now()}`,
        title: title.trim(),
        type,
        deadline: deadline || null,
        createdAt: new Date().toISOString(),
        archived: false,
        reflection: null,
      },
      ...tasks,
    ]
    setTasks(next)
    storage.setItem(TASKS_KEY, next)
  }

  function completeTask(id, reflection = null) {
    const next = tasks.map(t =>
      t.id === id
        ? { ...t, archived: true, completedAt: new Date().toISOString(), reflection }
        : t
    )
    setTasks(next)
    storage.setItem(TASKS_KEY, next)
  }

  function deleteTask(id) {
    const next = tasks.filter(t => t.id !== id)
    setTasks(next)
    storage.setItem(TASKS_KEY, next)
  }

  const active   = sortTasks(tasks.filter(t => !t.archived))
  const archived = tasks.filter(t => t.archived)

  return { active, archived, addTask, completeTask, deleteTask }
}

// ── Today's check-in dismissal ───────────────────────────────────
const checkinKey = () => `home:checkin:${new Date().toISOString().slice(0, 10)}`

export function useCheckinDismissal() {
  const [dismissed, setDismissed] = useState(() => !!storage.cacheRead(checkinKey(), null))

  useEffect(() => {
    storage.getItem(checkinKey(), null).then(val => {
      if (val) setDismissed(true)
    })
  }, [])

  function dismiss() {
    storage.setItem(checkinKey(), true)
    setDismissed(true)
  }

  return { dismissed, dismiss }
}
