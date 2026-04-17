import { createPortal } from 'react-dom'
import { MicroMotifs } from '../Decorations'

const OPTIONS = [
  { label: 'Fully ✦',    value: 'fully' },
  { label: 'Mostly',     value: 'mostly' },
  { label: 'Showed up',  value: 'showed_up' },
]

export default function QualityModal({ routineName, onSelect, onDismiss }) {
  return createPortal(
    <div
      onClick={onDismiss}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(253,240,240,0.65)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '300px',
          background: 'var(--base)',
          borderRadius: '1.4rem',
          boxShadow: '0 12px 48px rgba(232,160,160,0.22), 0 2px 8px rgba(232,160,160,0.1)',
          border: '1px solid rgba(232,160,160,0.28)',
          padding: '1.4rem 1.2rem 1.2rem',
          animation: 'softPulse 0.2s ease',
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
                fontFamily: 'DM Sans, system-ui, sans-serif',
                lineHeight: 1.3,
                textAlign: 'center',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body
  )
}
