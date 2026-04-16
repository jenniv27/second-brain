import { MIND_SYSTEM_PROMPT } from '../data/mindData'

// Collect last 7 days of body data from localStorage for context
function collectWeekContext() {
  const days = []
  for (let i = 0; i < 7; i++) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    const routines = JSON.parse(localStorage.getItem(`mind:completions:${key}`) || '{}')
    const sleep    = JSON.parse(localStorage.getItem(`body:sleep:${key}`)        || '{}')
    const exercise = JSON.parse(localStorage.getItem(`body:exercise:${key}`)     || '{}')
    const intention = localStorage.getItem(`body:intention:${key}`) || ''
    days.push({ date: key, routines, sleep, exercise, intention })
  }
  return days
}

export async function callMindCompanion({ whatHappened, whatWasHard }) {
  const weekContext = collectWeekContext()

  const userMessage = [
    `Here is what happened this week: ${whatHappened}`,
    `Here is what was hard: ${whatWasHard}`,
    '',
    'Week data (last 7 days):',
    JSON.stringify(weekContext, null, 2),
  ].join('\n')

  const res = await fetch('/api/companion', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      systemPrompt: MIND_SYSTEM_PROMPT,
      maxTokens: 1500,
      messages: [{ role: 'user', content: userMessage }],
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    if (err.error === 'no_key') throw new Error('no_key')
    throw new Error('api_error')
  }

  const data = await res.json()
  return data.content?.[0]?.text ?? ''
}
