export default function PrizeJar({ totalClips, habit }) {
  const { miniGoal, midGoal, moonshotGoal, miniPrize, midPrize, moonshotPrize } = habit

  const milestones = [
    { goal: miniGoal,     prize: miniPrize,     label: 'Mini' },
    { goal: midGoal,      prize: midPrize,      label: 'Mid'  },
    { goal: moonshotGoal, prize: moonshotPrize,  label: '★'    },
  ].filter(m => m.prize)

  if (!milestones.length) return null

  const maxGoal = Math.max(...milestones.map(m => m.goal), 1)
  const fill    = Math.min(totalClips / maxGoal, 1)

  return (
    <div style={{
      background: 'white',
      border: '1px solid rgba(232,160,160,0.18)',
      borderRadius: '1rem',
      padding: '0.85rem 1rem',
      marginBottom: '1rem',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--steel)' }}>
          Prize jar
        </p>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-mid)', fontWeight: 600 }}>
          ${totalClips}
        </span>
      </div>

      {/* Bar */}
      <div style={{ position: 'relative', height: '8px', background: 'rgba(232,160,160,0.12)', borderRadius: '4px', marginBottom: '0.65rem' }}>
        <div style={{
          height: '100%',
          width: `${fill * 100}%`,
          background: 'linear-gradient(90deg, var(--rose) 0%, rgba(232,160,160,0.7) 100%)',
          borderRadius: '4px',
          transition: 'width 0.4s ease',
        }} />
        {/* Milestone ticks */}
        {milestones.map(m => (
          <div
            key={m.goal}
            style={{
              position: 'absolute',
              left: `${Math.min((m.goal / maxGoal) * 100, 100)}%`,
              top: '-2px', bottom: '-2px',
              width: '2px',
              background: totalClips >= m.goal ? 'var(--rose)' : 'rgba(140,155,171,0.4)',
              transform: 'translateX(-50%)',
              borderRadius: '1px',
            }}
          />
        ))}
      </div>

      {/* Labels */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {milestones.map(m => {
          const reached = totalClips >= m.goal
          return (
            <div key={m.goal} style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: '0.62rem', color: reached ? 'var(--rose)' : 'var(--steel)', fontWeight: reached ? 700 : 400 }}>
                {m.label} {reached ? '✓' : `$${m.goal}`}
              </p>
              {m.prize && (
                <p style={{ margin: '0.1rem 0 0', fontSize: '0.65rem', color: 'var(--text-mid)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {m.prize}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
