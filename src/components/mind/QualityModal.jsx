import { createPortal } from 'react-dom'
import { MicroMotifs } from '../Decorations'

const OPTIONS = [
  { label: 'Fully ✦', value: 'fully' },
  { label: 'Mostly',  value: 'mostly' },
  { label: 'Showed up', value: 'showed_up' },
]

export default function QualityModal({ routineName, onSelect, onDismiss }) {
  return createPortal(
    <>
      {/* Backdrop */}
      <div
        onClick={onDismiss}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(253,240,240,0.65)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          zIndex: 200,
        }}
      />

      {/* Card */}
      <div
        className="fade-up"
        style={{
          position: 'fixed',
          left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 201,
          width: 'min(88vw, 300px)',
          background: 'var(--base)',
          borderRadius: '1.4rem',
          boxShadow: '0 12px 48px rgba(232,160,160,0.22), 0 2px 8px rgba(232,160,160,0.1)',
          border: '1px solid rgba(232,160,160,0.28)',
          padding: '1.4rem 1.2rem 1.2rem',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '0.9rem' }}>
          <p style={{
            fontFamily: 'Lora, Georgia, serif',
            fontSize: '1rem',
            fontWeight: 500,
            color: 'var(--text-dark)',
            margin: '0 0 0.3rem',
          }}>
            How did this go?
          </p>
          <p style={{
            fontSize: '0.72rem',
            fontStyle: 'italic',
            fontFamily: 'Lora, Georgia, serif',
            color: 'var(--steel)',
            margin: '0 0 0.5rem',
          }}>
            {routineName}
          </p>
          <MicroMotifs count={3} />
        </div>

        <div style={{ display: 'flex', gap: '0.45rem' }}>
          {OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => onSelect(opt.value)}
              style={{
                flex: 1,
                padding: '0.65rem 0.25rem',
                background: 'rgba(244,194,194,0.1)',
                border: '1px solid rgba(232,160,160,0.28)',
                borderRadius: '0.85rem',
                fontSize: '0.77rem',
                fontWeight: 500,
                color: 'var(--text-dark)',
                cursor: 'pointer',
                transition: 'background 0.15s ease, border-color 0.15s ease',
                fontFamily: 'DM Sans, system-ui, sans-serif',
                lineHeight: 1.3,
                textAlign: 'center',
              }}
              onTouchStart={e => {
                e.currentTarget.style.background = 'rgba(232,160,160,0.2)'
                e.currentTarget.style.borderColor = 'var(--rose)'
              }}
              onTouchEnd={e => {
                e.currentTarget.style.background = 'rgba(244,194,194,0.1)'
                e.currentTarget.style.borderColor = 'rgba(232,160,160,0.28)'
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </>,
    document.body
  )
}
