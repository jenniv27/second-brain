// ─────────────────────────────────────────────
//  Mind tab — routines and habits
// ─────────────────────────────────────────────

export const ROUTINES = [
  {
    id: 'morning',
    name: 'Morning Routine',
    time: 'Weekdays 6am · Weekends 6–10am',
    habits: [
      { id: 'wake',        label: 'Wake up',                          anchor: null,                           detail: 'Weekdays 6am · Weekends 6–10am' },
      { id: 'phone',       label: 'Check phone',                      anchor: 'After waking',                 detail: 'Ricky & urgent Slack only' },
      { id: 'restroom',    label: 'Restroom',                         anchor: 'After phone' },
      { id: 'weight',      label: 'Log weight',                       anchor: 'After restroom' },
      { id: 'cats',        label: 'Play with & feed cats',            anchor: 'After weight' },
      { id: 'ready',       label: 'Get ready',                        anchor: 'After cats',                   detail: 'Positive affirmations video' },
      { id: 'supplements', label: 'Take supplements',                 anchor: 'After getting ready',          detail: 'Including creatine' },
      { id: 'walk',        label: 'Morning walk',                     anchor: 'Around 7am / after supplements on weekends', detail: 'Mandarin listening practice' },
      { id: 'checkin',     label: 'Morning check-in + ketone shot',   anchor: 'Right before 8am',             detail: 'Start "in the zone" playlist' },
    ],
    weekendNote: 'No work on weekends — routine concludes after morning walk.',
  },
  {
    id: 'midday',
    name: 'Midday Routine',
    time: 'Around first meal',
    optional: true,
    habits: [
      { id: 'collagen',     label: 'Collagen with water',             anchor: 'Right before first meal' },
      { id: 'afternoon-ci', label: 'Afternoon check-in',             anchor: 'After lunch',                  detail: 'Status check + water consumption' },
    ],
  },
  {
    id: 'evening',
    name: 'Evening Routine',
    time: 'Wind-down, ~9:30pm sleep',
    habits: [
      { id: 'tea',      label: 'Chamomile or mint tea',               anchor: 'Entering evening',             detail: 'Mandarin practice (HelloChinese)' },
      { id: 'dishes',   label: 'Wash dishes',                         anchor: 'After tea' },
      { id: 'exercise', label: 'Exercise',                            anchor: 'After dishes' },
      { id: 'shower',   label: 'Shower',                              anchor: 'After exercise' },
      { id: 'skincare',   label: 'LED mask + skincare + app check-in',  anchor: 'After shower',                detail: 'Mandarin practice' },
      { id: 'catteeth',  label: 'Brush cat teeth',                    anchor: 'After skincare',               everyOtherDay: true },
      { id: 'read',      label: 'Settle in & read',                   anchor: 'After getting ready for bed', detail: '~9:30pm' },
      { id: 'sleep',    label: 'Sleep',                               anchor: 'After reading',                detail: 'By 10pm' },
    ],
  },
]

// The companion's exact voice — copied verbatim from product brief
export const MIND_COMPANION_VOICE = `Honest and direct — not cold, but not saccharine. Like a trusted friend who actually pays attention. You read what was logged and you respond to that. You notice patterns. You ask one focused question, never a list. You never praise completion as if it is surprising — you treat showing up as the baseline. You never say 'great job.' You never use the words 'amazing,' 'wonderful,' or 'fantastic.' You are warm because you know Jennifer, not because you are performing warmth.`

export const MIND_SYSTEM_PROMPT = `You are Jennifer's Mind companion in her personal second brain app. Your role is to help her reflect on the week honestly and support identity-based habit formation.

${MIND_COMPANION_VOICE}

Jennifer has BPD, OCD, and likely ADHD. These affect how she relates to data and progress:
- Frame everything additively. Never mention what was missed or skipped.
- Do not feed planning loops. If she proposes a new habit, ask which existing routine it belongs to — don't help her create a new one.
- The weekly check-in ends with one specific observation about Jennifer grounded in what she actually did this week — never what she planned or hoped.
- Ask exactly one question. Never a list of questions.
- Keep your response to 3–5 short paragraphs maximum.

Jennifer's three routines are: Morning (wake, phone, restroom, weight, cats, get ready, supplements, morning walk with Mandarin, app check-in + ketone shot), Midday (collagen, afternoon check-in), Evening (tea + Mandarin, dishes, exercise, shower, skincare + LED + app check-in, read, sleep by 10pm).`
