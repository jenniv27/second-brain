// ─────────────────────────────────────────────
//  Body tab data — supplements & skincare
// ─────────────────────────────────────────────

// Morning only — collagen + glucomannan
export const DAILY_SUPPLEMENTS_AM = [
  { id: 'collagen',  label: 'Collagen',        note: '30 min before first meal · 16 oz water' },
  { id: 'gluco-am', label: 'Glucomannan AM',   note: '1g with collagen · space meds 1 hr before / 4 hrs after' },
  { id: 'creatine', label: 'Creatine',         note: '10g' },
]

// Evening — everything else
export const DAILY_SUPPLEMENTS_PM = [
  { id: 'multi',       label: 'Multivitamin',        note: '' },
  { id: 'iron',        label: 'Iron',                note: '' },
  { id: 'magnesium',   label: 'Magnesium citrate',   note: '' },
  { id: 'omega3',      label: 'Omega 3s',            note: '' },
  { id: 'hydroxyzine', label: 'Hydroxyzine',         note: '',    asNeeded: true },
]

export const AFTERNOON_REMINDERS = [
  { id: 'gluco-pm',  label: 'Glucomannan afternoon',       note: '1g · space meds 1 hr before / 4 hrs after' },
  { id: 'gluco-eve', label: 'Glucomannan before final meal', note: '1g · space meds 1 hr before / 4 hrs after' },
  { id: 'water',     label: 'Water check',                  note: '8–10 glasses today?' },
]

// Skincare
export const SKINCARE_AM = [
  { id: 'rice-milk',  label: 'Rice milk moisturizer', note: '' },
  { id: 'sunscreen',  label: 'Sunscreen',             note: '' },
]

export const SKINCARE_PM = [
  { id: 'cleanser',     label: 'Clinique face cleanser',          note: 'once a week' },
  { id: 'ha',           label: 'Hyaluronic acid',                 note: '' },
  { id: 'retinol',      label: 'Retinol serum under eye',         note: '' },
  { id: 'revitalash',   label: 'RevitaLash',                      note: '' },
  { id: 'micro-serum',  label: 'Real Ferment micro serum',        note: '' },
]

export const SKINCARE_TO_ADD = [
  { id: 'aha-bha',       label: 'AHA BHA cleanser',               note: 'legs, arms, bikini, underarms' },
  { id: 'sal-acid',      label: 'Salicylic acid wash',            note: 'face' },
  { id: 'eucerin',       label: 'Eucerin 5% Urea moisturizer',    note: 'everywhere' },
  { id: 'diabederma',    label: 'DiabeDerma 10% Urea Cream',      note: 'arms & legs · KP targeted' },
]

export const FEEL_OPTIONS = [
  { value: 'poor',  label: 'Not great' },
  { value: 'okay',  label: 'Okay'      },
  { value: 'good',  label: 'Good'      },
  { value: 'great', label: 'Great'     },
]

export const EFFORT_OPTIONS = [
  { value: 'easy',   label: 'Easy'   },
  { value: 'medium', label: 'Medium' },
  { value: 'hard',   label: 'Hard'   },
]
