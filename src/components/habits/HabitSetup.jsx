import { useState } from 'react'

const FIELDS = [
  { key: 'name',          label: 'Habit name',        placeholder: 'e.g. 15 burpees', required: true },
  { key: 't1Reward',      label: 'Tier 1 reward',     placeholder: 'e.g. 20 min social media' },
  { key: 't2Reward',      label: 'Tier 2 reward',     placeholder: 'e.g. 1 episode Netflix' },
  { key: 't3Reward',      label: 'Tier 3 reward',     placeholder: 'e.g. Takeout dinner' },
  { key: 'jackpotReward', label: 'Jackpot reward ★',  placeholder: 'e.g. Spa day' },
]

const PRIZE_FIELDS = [
  { key: 'miniPrize',    goalKey: 'miniGoal',    label: 'Mini prize',     placeholder: 'e.g. Fancy coffee',  defaultGoal: 20  },
  { key: 'midPrize',     goalKey: 'midGoal',     label: 'Mid prize',      placeholder: 'e.g. New book',      defaultGoal: 50  },
  { key: 'moonshotPrize',goalKey: 'moonshotGoal',label: 'Moonshot prize', placeholder: 'e.g. Weekend trip',  defaultGoal: 100 },
]

export default function HabitSetup({ initialValues, onSave }) {
  const [form, setForm] = useState(initialValues)

  function set(key, val) {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  const canSave = form.name?.trim().length > 0

  return (
    <div style={{ padding: '1.25rem 1.1rem' }}>
      <p style={{ margin: '0 0 1rem', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--steel)' }}>
        Set up your habit
      </p>

      {/* Core fields */}
      <div style={{ background: 'white', borderRadius: '1rem', border: '1px solid rgba(232,160,160,0.2)', padding: '1rem', marginBottom: '1rem' }}>
        {FIELDS.map(({ key, label, placeholder, required }) => (
          <div key={key} style={{ marginBottom: '0.75rem' }}>
            <label style={{ display: 'block', fontSize: '0.68rem', color: 'var(--steel)', marginBottom: '0.2rem', letterSpacing: '0.04em' }}>
              {label}{required ? ' *' : ''}
            </label>
            <input
              value={form[key] ?? ''}
              onChange={e => set(key, e.target.value)}
              placeholder={placeholder}
              style={{
                width: '100%', boxSizing: 'border-box',
                border: '1px solid rgba(140,155,171,0.25)', borderRadius: '0.5rem',
                padding: '0.45rem 0.65rem', fontSize: '0.88rem',
                color: 'var(--text-dark)', outline: 'none', background: '#fafafa',
                fontFamily: 'inherit',
              }}
            />
          </div>
        ))}
      </div>

      {/* Prize jar */}
      <p style={{ margin: '0 0 0.5rem', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--steel)' }}>
        Prize jar (each session = $1)
      </p>
      <div style={{ background: 'white', borderRadius: '1rem', border: '1px solid rgba(232,160,160,0.2)', padding: '1rem', marginBottom: '1.25rem' }}>
        {PRIZE_FIELDS.map(({ key, goalKey, label, placeholder, defaultGoal }) => (
          <div key={key} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.68rem', color: 'var(--steel)', marginBottom: '0.2rem' }}>{label}</label>
              <input
                value={form[key] ?? ''}
                onChange={e => set(key, e.target.value)}
                placeholder={placeholder}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  border: '1px solid rgba(140,155,171,0.25)', borderRadius: '0.5rem',
                  padding: '0.4rem 0.6rem', fontSize: '0.82rem',
                  color: 'var(--text-dark)', outline: 'none', background: '#fafafa', fontFamily: 'inherit',
                }}
              />
            </div>
            <div style={{ flexShrink: 0 }}>
              <label style={{ display: 'block', fontSize: '0.68rem', color: 'var(--steel)', marginBottom: '0.2rem' }}>at $</label>
              <input
                type="number"
                value={form[goalKey] ?? defaultGoal}
                onChange={e => set(goalKey, Number(e.target.value))}
                min={1}
                style={{
                  width: '4.5rem',
                  border: '1px solid rgba(140,155,171,0.25)', borderRadius: '0.5rem',
                  padding: '0.4rem 0.6rem', fontSize: '0.82rem',
                  color: 'var(--text-dark)', outline: 'none', background: '#fafafa', fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => onSave(form)}
        disabled={!canSave}
        style={{
          width: '100%',
          padding: '0.85rem',
          background: canSave
            ? 'linear-gradient(135deg, var(--rose) 0%, rgba(232,160,160,0.8) 100%)'
            : 'rgba(140,155,171,0.2)',
          border: 'none', borderRadius: '1rem',
          fontSize: '0.9rem', fontWeight: 600,
          color: canSave ? 'white' : 'var(--steel)',
          cursor: canSave ? 'pointer' : 'default',
          boxShadow: canSave ? '0 3px 12px rgba(232,160,160,0.3)' : 'none',
        }}
      >
        Save habit
      </button>
    </div>
  )
}
