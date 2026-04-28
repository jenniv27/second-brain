import { useDBTLog } from '../../hooks/useDBTLog'
import { MODULE_META } from '../../data/dbtSkills'

const TIER_COLOR = {
  T1:      '#e48fa8',
  T2:      '#8b7cd4',
  T3:      '#4db6ac',
  BONUS:   '#ffa000',
  JACKPOT: '#f9a825',
}

function formatDate(isoDate) {
  const today     = new Date().toISOString().slice(0, 10)
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
  if (isoDate === today)     return 'Today'
  if (isoDate === yesterday) return 'Yesterday'
  return new Date(isoDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function DBTTimeline() {
  const { log } = useDBTLog()

  if (log.length === 0) {
    return (
      <p style={{ fontSize: '0.78rem', fontStyle: 'italic', color: 'var(--steel)', margin: 0, textAlign: 'center' }}>
        No skills practiced yet. Try "I need a moment" from the Home tab.
      </p>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
      {log.slice(0, 10).map(entry => {
        const meta      = MODULE_META[entry.module] ?? { color: 'var(--rose)', bg: 'rgba(232,160,160,0.1)' }
        const tierColor = TIER_COLOR[entry.tier] ?? 'var(--steel)'

        return (
          <div key={entry.id} style={{
            background: 'white',
            border: '1px solid rgba(232,160,160,0.15)',
            borderRadius: '1rem',
            padding: '0.75rem 0.9rem',
            display: 'flex',
            gap: '0.7rem',
            alignItems: 'flex-start',
          }}>
            {/* Module colour bar */}
            <div style={{
              width: '3px',
              borderRadius: '2px',
              background: meta.color,
              alignSelf: 'stretch',
              flexShrink: 0,
              minHeight: '2rem',
            }} />

            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Module + date */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <span style={{
                  fontSize: '0.6rem', fontWeight: 700,
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                  color: meta.color,
                }}>
                  {entry.module}
                </span>
                <span style={{ fontSize: '0.65rem', color: 'var(--steel)' }}>
                  {formatDate(entry.date)}
                </span>
              </div>

              {/* Prompt (2-line clamp) */}
              <p style={{
                fontFamily: 'Lora, Georgia, serif',
                fontSize: '0.8rem',
                color: 'var(--text-mid)',
                margin: '0 0 0.4rem',
                lineHeight: 1.45,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}>
                {entry.prompt}
              </p>

              {/* Tier + reward */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.6rem', fontWeight: 700, color: tierColor, letterSpacing: '0.04em' }}>
                  {entry.tier === 'JACKPOT' ? '★ JACKPOT' : entry.tier}
                </span>
                <span style={{ fontSize: '0.6rem', color: 'var(--steel)', opacity: 0.5 }}>·</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-mid)', fontStyle: 'italic' }}>
                  {entry.reward}
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
