import { Sun, Moon } from 'lucide-react'
import { MicroMotifs } from './Decorations'

function getSessionInfo() {
  const hour = new Date().getHours()
  const isMorning = hour >= 5 && hour < 14
  return {
    label: isMorning ? 'Morning Routine' : 'Evening Routine',
    Icon:  isMorning ? Sun : Moon,
    steps: isMorning
      ? ['Skincare AM', 'Supplements', 'Morning intention']
      : ['Exercise log', 'Skincare PM', 'Evening check-in'],
  }
}

export default function RoutineCard() {
  const { label, Icon, steps } = getSessionInfo()

  return (
    <div className="card card-accent" style={{ overflow: 'hidden' }}>

      {/* Warm header band */}
      <div style={{
        background: 'linear-gradient(135deg, #fde8e8 0%, #fdf0f0 100%)',
        padding: '0.9rem 1.25rem 0.8rem',
        borderBottom: '1px solid rgba(232,160,160,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: '2rem', height: '2rem',
            borderRadius: '0.6rem',
            background: 'rgba(232,160,160,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon size={14} strokeWidth={1.75} color="var(--rose)" />
          </div>
          <h2 style={{
            fontFamily: 'Lora, Georgia, serif',
            fontSize: '1rem',
            fontWeight: 600,
            color: 'var(--text-dark)',
            margin: 0,
          }}>
            {label}
          </h2>
        </div>
        <MicroMotifs count={4} />
      </div>

      {/* Step list */}
      <div style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
          {steps.map((step, i) => (
            <div key={step} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '1.15rem',
                height: '1.15rem',
                borderRadius: '50%',
                border: '1.5px solid rgba(232, 160, 160, 0.45)',
                flexShrink: 0,
                background: 'rgba(244,194,194,0.08)',
              }} />
              <span style={{ fontSize: '0.875rem', color: 'var(--text-mid)' }}>{step}</span>
            </div>
          ))}
        </div>

        {/* Footer nudge */}
        <p style={{
          marginTop: '1rem',
          marginBottom: 0,
          fontSize: '0.73rem',
          fontStyle: 'italic',
          fontFamily: 'Lora, Georgia, serif',
          color: 'rgba(140,155,171,0.8)',
        }}>
          Your full routine lives in the Body tab <span style={{ color: 'var(--rose)' }}>✦</span>
        </p>
      </div>
    </div>
  )
}
