import { useState } from 'react'
import { Sun, Cloud, CloudRain } from 'lucide-react'

const OPTIONS = [
  { Icon: Sun,      label: 'Pretty good', value: 'good' },
  { Icon: Cloud,    label: 'Getting by',  value: 'okay' },
  { Icon: CloudRain, label: 'Rough today', value: 'hard' },
]

export default function LowEffortMode({ onClose }) {
  const [selected, setSelected] = useState(null)
  const [logged, setLogged] = useState(false)

  function handleSelect(value) {
    setSelected(value)
    setTimeout(() => setLogged(true), 600)
  }

  if (logged) {
    return (
      <div className="card check-in" style={{ padding: '1.5rem 1.25rem', textAlign: 'center' }}>
        <p className="star-pop" style={{ fontSize: '1.1rem', color: 'var(--rose)', margin: '0 0 0.5rem', letterSpacing: '0.15em' }}>
          ✦ ✦ ✦
        </p>
        <p style={{
          fontFamily: 'Lora, Georgia, serif',
          fontSize: '0.95rem',
          fontStyle: 'italic',
          color: 'var(--text-mid)',
          margin: '0 0 0.75rem',
        }}>
          That's enough. You showed up.
        </p>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '0.78rem',
            color: 'var(--steel)',
            cursor: 'pointer',
            textDecoration: 'underline',
            padding: 0,
          }}
        >
          Close
        </button>
      </div>
    )
  }

  return (
    <div className="card fade-up" style={{ padding: '1.25rem' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem',
      }}>
        <p style={{
          fontFamily: 'Lora, Georgia, serif',
          fontSize: '1rem',
          fontWeight: 500,
          color: 'var(--text-dark)',
          margin: 0,
        }}>
          How are you doing today?
        </p>
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--steel)',
            cursor: 'pointer',
            padding: '0 0 0 0.5rem',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ display: 'flex', gap: '0.65rem' }}>
        {OPTIONS.map(({ Icon, label, value }) => (
          <button
            key={value}
            onClick={() => handleSelect(value)}
            style={{
              flex: 1,
              background: selected === value ? 'var(--pink)' : 'var(--base)',
              border: `1.5px solid ${selected === value ? 'var(--rose)' : 'rgba(232,160,160,0.3)'}`,
              borderRadius: '1rem',
              padding: '0.85rem 0.25rem',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'all 0.2s ease',
              transform: selected === value ? 'scale(1.04)' : 'scale(1)',
            }}
          >
            <Icon
              size={22}
              strokeWidth={1.5}
              color={selected === value ? 'var(--rose)' : 'var(--steel)'}
            />
            <span style={{
              fontSize: '0.7rem',
              color: selected === value ? 'var(--text-dark)' : 'var(--text-mid)',
              fontWeight: 500,
              textAlign: 'center',
              lineHeight: 1.2,
            }}>
              {label}
            </span>
          </button>
        ))}
      </div>

      <p style={{
        marginTop: '0.85rem',
        marginBottom: 0,
        fontSize: '0.72rem',
        fontStyle: 'italic',
        fontFamily: 'Lora, Georgia, serif',
        color: 'var(--steel)',
        textAlign: 'center',
      }}>
        Logged quietly. No other steps needed.
      </p>
    </div>
  )
}
