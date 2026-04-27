export const DBT_SKILLS = [
  // ── Mindfulness ───────────────────────────────────────────────
  {
    id: 'm1', module: 'Mindfulness',
    prompt: 'Find something in your environment and observe it without naming or labeling it. Just look.',
  },
  {
    id: 'm2', module: 'Mindfulness',
    prompt: "Describe what you're feeling right now, as plainly as you can. 'I feel...' not 'I am...' — no judgment attached.",
  },
  {
    id: 'm3', module: 'Mindfulness',
    prompt: 'Pick one thing to do right now — just one — and give it your full attention for the next two minutes.',
  },
  {
    id: 'm4', module: 'Mindfulness',
    prompt: "Notice one judgment you've had today and try restating it as a plain observation. What actually happened?",
  },

  // ── Distress Tolerance ────────────────────────────────────────
  {
    id: 'd1', module: 'Distress Tolerance',
    prompt: 'Hold something cold, or splash cold water on your face. Let your body reset.',
  },
  {
    id: 'd2', module: 'Distress Tolerance',
    prompt: 'Move your body intensely for 60 seconds — jumping jacks, running in place, whatever feels right.',
  },
  {
    id: 'd3', module: 'Distress Tolerance',
    prompt: 'Breathe in for 4 counts, out for 6. Repeat for two minutes. Let the exhale do the work.',
  },
  {
    id: 'd4', module: 'Distress Tolerance',
    prompt: 'Slowly tense and release each muscle group, starting at your feet. Work your way up.',
  },
  {
    id: 'd5', module: 'Distress Tolerance',
    prompt: 'Distract yourself with an activity, a contribution, or a sensation. No judgment on what works.',
  },
  {
    id: 'd6', module: 'Distress Tolerance',
    prompt: 'Soothe one of your five senses deliberately — something warm, a scent, music, soft fabric, something sweet.',
  },

  // ── Emotion Regulation ────────────────────────────────────────
  {
    id: 'e1', module: 'Emotion Regulation',
    prompt: "Name an emotion you're feeling right now. Ask yourself honestly: does it fit the facts of what actually happened?",
  },
  {
    id: 'e2', module: 'Emotion Regulation',
    prompt: "Notice an urge you're feeling. What would the opposite action look like? Try it gently — no pressure.",
  },
  {
    id: 'e3', module: 'Emotion Regulation',
    prompt: "PLEASE check-in: how were your sleep, eating, and movement today? No fixing required — just noticing.",
  },
  {
    id: 'e4', module: 'Emotion Regulation',
    prompt: 'Do one small thing you already know you do well. Let yourself do it fully.',
  },

  // ── Interpersonal Effectiveness ───────────────────────────────
  {
    id: 'i1', module: 'Interpersonal Effectiveness',
    prompt: "Think of a situation where you want something. Can you describe it clearly — what happened, what you want, how you feel?",
  },
  {
    id: 'i2', module: 'Interpersonal Effectiveness',
    prompt: 'In one interaction today, try being a little gentler or more validating than usual. Just notice what happens.',
  },
  {
    id: 'i3', module: 'Interpersonal Effectiveness',
    prompt: "Check in with your values. Did you act in line with who you want to be today? No judgment — just honest.",
  },
]

export const DBT_REWARDS = {
  T1: [
    '5 minutes of social media',
    'One chapter of manga',
    'A YouTube video under 10 minutes',
  ],
  T2: [
    '30 minutes of video games',
    'Up to 30 minutes of YouTube',
  ],
  T3: [
    'One episode — anime, Gilmore Girls, or House',
    'Two hours of video games',
    'Fancy coffee',
  ],
  BONUS:   ['One free Tier 1 reward'],
  JACKPOT: ['Solo movie date'],
}

export const MODULE_META = {
  'Mindfulness':                { color: '#e48fa8', bg: 'rgba(228,143,168,0.1)'  },
  'Distress Tolerance':         { color: '#8b7cd4', bg: 'rgba(139,124,212,0.1)' },
  'Emotion Regulation':         { color: '#4db6ac', bg: 'rgba(77,182,172,0.1)'  },
  'Interpersonal Effectiveness':{ color: '#ffa000', bg: 'rgba(255,160,0,0.1)'   },
}

export function pickSkill(excludeId = null) {
  const pool = excludeId ? DBT_SKILLS.filter(s => s.id !== excludeId) : DBT_SKILLS
  return pool[Math.floor(Math.random() * pool.length)]
}

export function resolveReward(segmentId) {
  if (segmentId === 'JACKPOT') return { tier: 'JACKPOT', text: 'Solo movie date' }
  const pool = segmentId === 'BONUS'
    ? DBT_REWARDS.T1   // bonus gives a free T1 reward
    : (DBT_REWARDS[segmentId] ?? DBT_REWARDS.T1)
  const text = pool[Math.floor(Math.random() * pool.length)]
  return { tier: segmentId, text }
}
