import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { SUPPLEMENT_PHASES } from '../../data/bodyData'
import { MicroMotifs } from '../Decorations'

export default function PhaseCard({ phase, dayNumber, onSetPhase }) {
  const [open, setOpen] = useState(false)

  const pct = Math.round((dayNumber / phase.totalDays) * 100)

  return (
    <div className="card card-accent" style={{ overflow: 'hidden', marginBottom: '1rem' }}>
      {/* Main row */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background: 'none',
          border: 'none',
          width: '100%',
          cursor: 'pointer',
          padding: '0.9rem 1.1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          textAlign: 'left',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.15rem' }}>
            <p style={{
              fontFamily: 'Lora, Georgia, serif',
              fontSize: '0.95rem',
              fontWeight: 600,
              color: 'var(--text-dark)',
              margin: 0,
            }}>
              {phase.name}
            </p>
            <MicroMotifs count={2} />
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--steel)', margin: 0 }}>
            Day {dayNumber} of {phase.totalDays} · {phase.tagline}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--rose)', fontWeight: 500 }}>
            {pct}%
          </span>
          {open
            ? <ChevronUp size={14} strokeWidth={1.5} color="var(--steel)" />
            : <ChevronDown size={14} strokeWidth={1.5} color="var(--steel)" />}
        </div>
      </button>

      {/* Progress bar */}
      <div style={{
        height: '2px',
        background: 'rgba(232,160,160,0.15)',
        margin: '0 1.1rem 0.75rem',
        borderRadius: '2px',
      }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: 'linear-gradient(to right, var(--pink), var(--rose))',
          borderRadius: '2px',
          transition: 'width 0.4s ease',
        }} />
      </div>

      {/* Phase switcher (expanded) */}
      {open && (
        <div style={{
          borderTop: '1px solid rgba(232,160,160,0.15)',
          padding: '0.75rem 1.1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}>
          <p style={{ fontSize: '0.7rem', color: 'var(--steel)', margin: '0 0 0.25rem', letterSpacing: '0.04em' }}>
            Switch to a different phase:
          </p>
          {SUPPLEMENT_PHASES.map(p => (
            <button
              key={p.id}
              onClick={() => { onSetPhase(p.id); setOpen(false) }}
              style={{
                background: p.id === phase.id ? 'rgba(244,194,194,0.2)' : 'transparent',
                border: `1px solid ${p.id === phase.id ? 'rgba(232,160,160,0.4)' : 'rgba(232,160,160,0.15)'}`,
                borderRadius: '0.75rem',
                padding: '0.55rem 0.85rem',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <p style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-dark)', margin: '0 0 0.1rem' }}>
                {p.name}
                {p.id === phase.id && <span style={{ marginLeft: '0.4rem', fontSize: '0.6rem', color: 'var(--rose)' }}>✦ current</span>}
              </p>
              <p style={{ fontSize: '0.7rem', color: 'var(--steel)', margin: 0 }}>
                {p.totalDays} days · {p.tagline}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
