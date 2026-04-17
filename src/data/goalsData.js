// ─────────────────────────────────────────────
//  Goals — static reference data
// ─────────────────────────────────────────────

// Net worth milestones (USD)
export const NET_WORTH_MILESTONES = [
  1_000, 5_000, 10_000, 25_000, 50_000,
  100_000, 250_000, 500_000, 1_000_000,
]

export function formatNetWorth(n) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1)}K`
  return `$${n.toLocaleString()}`
}

// Weight loss milestones — lbs lost
// Comparisons are warm and playful, never clinical
export const WEIGHT_MILESTONES = [
  { lbs: 2,  comparison: 'a bag of sugar',                    note: 'sweet and real' },
  { lbs: 5,  comparison: 'a whole pineapple',                 note: 'the juicy kind' },
  { lbs: 10, comparison: 'a regulation bowling ball',         note: '' },
  { lbs: 12, comparison: 'a chunky house cat',                note: 'the kind that judges you' },
  { lbs: 15, comparison: 'a full car tire',                   note: '' },
  { lbs: 20, comparison: 'a big bag of dog food',             note: '' },
  { lbs: 22, comparison: 'a toddler who refuses to walk',     note: '' },
  { lbs: 25, comparison: 'a small microwave',                 note: '' },
  { lbs: 27, comparison: 'a whole Thanksgiving turkey',       note: 'the full bird' },
  { lbs: 30, comparison: 'a fluffy medium-sized dog',         note: 'tail wagging' },
]

// Cooking log — comfort rating labels
export const COMFORT_RATINGS = [
  { value: 'natural', label: 'Natural',  description: 'second nature' },
  { value: 'fun',     label: 'Fun',      description: 'enjoyable effort' },
  { value: 'stretch', label: 'Stretch',  description: 'pushed you a little' },
]

// Social meetup — warm acknowledgment messages (rotate)
export const SOCIAL_ACKNOWLEDGMENTS = [
  "That took something. ✦",
  "You showed up. That's the whole thing.",
  "One more. Quietly counts.",
  "You made it happen. ✦",
  "The world got a little more of you today.",
]
