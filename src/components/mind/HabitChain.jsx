// Visual habit stack — shows the anchor→habit chain for a routine
export default function HabitChain({ habits }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {habits.map((habit, i) => (
        <div key={habit.id} style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start' }}>

          {/* Vertical connector */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: '0.85rem' }}>
            <div style={{
              width: '0.5rem', height: '0.5rem',
              borderRadius: '50%',
              border: '1.5px solid rgba(232,160,160,0.5)',
              background: 'rgba(244,194,194,0.12)',
              marginTop: '0.35rem',
              flexShrink: 0,
            }} />
            {i < habits.length - 1 && (
              <div style={{
                width: '1px',
                flex: 1,
                minHeight: '1.4rem',
                background: 'linear-gradient(to bottom, rgba(232,160,160,0.35), rgba(232,160,160,0.1))',
                margin: '0.2rem 0',
              }} />
            )}
          </div>

          {/* Content */}
          <div style={{ paddingBottom: i < habits.length - 1 ? '0.5rem' : 0 }}>
            {habit.anchor && (
              <p style={{
                fontSize: '0.65rem',
                fontStyle: 'italic',
                fontFamily: 'Lora, Georgia, serif',
                color: 'var(--steel)',
                margin: '0 0 0.1rem',
                lineHeight: 1.3,
              }}>
                {habit.anchor}
              </p>
            )}
            <p style={{
              fontSize: '0.85rem',
              color: 'var(--text-dark)',
              margin: 0,
              lineHeight: 1.35,
              fontWeight: 400,
            }}>
              {habit.label}
            </p>
            {habit.detail && (
              <p style={{
                fontSize: '0.68rem',
                color: 'var(--steel)',
                margin: '0.1rem 0 0',
                lineHeight: 1.3,
              }}>
                {habit.detail}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
