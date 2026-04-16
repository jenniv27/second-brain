// ─────────────────────────────────────────────
//  Body tab data — supplements & skincare
// ─────────────────────────────────────────────

export const SUPPLEMENT_PHASES = [
  {
    id: 'stimulant',
    name: 'Stimulant Phase',
    totalDays: 14,
    tagline: 'Fasting · Black Coffee · GCBE / Yohimbine',
    color: '#e8b4a0',
    items: [
      { id: 'coffee',     label: 'Black coffee',    note: '1–2 cups',                         asNeeded: false },
      { id: 'yohimbine',  label: 'Yohimbine',       note: '2.5 mg — or GCBE 500mg + Green Tea 256mg if needed', asNeeded: true },
    ],
  },
  {
    id: 'beauty',
    name: 'Light / Beauty Phase',
    totalDays: 12,
    tagline: '5-HTP · Choline · Cayenne',
    color: '#a0b4e8',
    items: [
      { id: '5htp',      label: '5-HTP',    note: '50 mg',  asNeeded: false },
      { id: 'choline',   label: 'Choline',  note: '650 mg', asNeeded: false },
      { id: 'cayenne',   label: 'Cayenne',  note: '530 mg', asNeeded: false },
    ],
  },
  {
    id: 'reset',
    name: 'Reset Phase',
    totalDays: 2,
    tagline: 'Water & Electrolytes only',
    color: '#a0c8e8',
    items: [
      { id: 'electrolytes', label: 'Electrolytes', note: 'as needed', asNeeded: true },
    ],
  },
]

// Morning only — collagen + glucomannan
export const DAILY_SUPPLEMENTS_AM = [
  { id: 'collagen',  label: 'Collagen',        note: '30 min before first meal · 16 oz water' },
  { id: 'gluco-am', label: 'Glucomannan AM',   note: '1g with collagen · space meds 1 hr before / 4 hrs after' },
  { id: 'creatine', label: 'Creatine',         note: '10g' },
]

// Evening — everything else
export const DAILY_SUPPLEMENTS_PM = [
  { id: 'zinc',        label: 'Zinc',               note: '' },
  { id: 'vitamin-d',   label: 'Vitamin D',           note: '' },
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
  { id: 'eye-bright',   label: 'Bye Bye Blemish under-eye',       note: '' },
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
