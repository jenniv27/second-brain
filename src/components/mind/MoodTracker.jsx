import { useMoodLog } from '../../hooks/useMoodLog'

export const MOODS = [
  { id: 'bright', label: 'Bright', color: '#f9a825', bg: 'rgba(249,168,37,0.12)'  },
  { id: 'good',   label: 'Good',   color: '#e48fa8', bg: 'rgba(228,143,168,0.12)' },
  { id: 'okay',   label: 'Okay',   color: '#8b7cd4', bg: 'rgba(139,124,212,0.12)' },
  { id: 'low',    label: 'Low',    color: '#4db6ac', bg: 'rgba(77,182,172,0.12)'  },
  { id: 'rough',  label: 'Rough',  color: '#8c9bab', bg: 'rgba(140,155,171,0.12)' },
]

export const MOOD_MAP = Object.fromEntries(MOODS.map(m => [m.id, m]))

export default function MoodTracker() {
  const { todayMood, setMood, getWeek } = useMoodLog()
  const week = getWeek()
  const hasHistory = week.some(d => d.mood !== null)

  return (
    <div className="card card-accent" style={{ padding: '0.9rem 1.1rem', marginBottom: '0.85rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <p style={{ fontFamily: 'Lora, Georgia, serif', fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-dark)', margin: 0 }}>
          Today's mood
        </p>
        {todayMood && (
          <span style={{ fontSize: '0.7rem', color: 'var(--steel)', fontStyle: 'italic' }}>
            logged ✦
          </span>
        )}
      </div>

      {/* Mood buttons */}
      <div style={{ display: 'flex', gap: '0.35rem' }}>
        {MOODS.map(m => {
          const selected = todayMood === m.id
          return (
            <button
              key={m.id}
              onClick={() => setMood(m.id)}
              style={{
                flex: 1,
                padding: '0.55rem 0.15rem',
                background: selected ? m.bg : 'transparent',
                border: `1.5px solid ${selected ? m.color : 'rgba(140,155,171,0.2)'}`,
                borderRadius: '0.75rem',
                cursor: 'pointer',
                transition: 'all 0.15s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              <span style={{
                display: 'block',
                width: '0.4rem',
                height: '0.4rem',
                borderRadius: '50%',
                background: selected ? m.color : 'rgba(140,155,171,0.3)',
                flexShrink: 0,
              }} />
              <span style={{
                fontSize: '0.62rem',
                fontWeight: selected ? 700 : 400,
                color: selected ? m.color : 'var(--steel)',
                whiteSpace: 'nowrap',
              }}>
                {m.label}
              </span>
            </button>
          )
        })}
      </div>

      {/* 7-day history dots */}
      {hasHistory && (
        <div style={{
          display: 'flex',
          gap: '0.3rem',
          marginTop: '0.85rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid rgba(232,160,160,0.12)',
        }}>
          {week.map((d, i) => {
            const mood = d.mood ? MOOD_MAP[d.mood] : null
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                <div style={{
                  width: '1.5rem',
                  height: '1.5rem',
                  borderRadius: '50%',
                  background: mood ? mood.bg : 'transparent',
                  border: `1.5px solid ${d.isToday ? 'var(--rose)' : mood ? mood.color + '66' : 'rgba(140,155,171,0.15)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {mood && (
                    <span style={{
                      display: 'block',
                      width: '0.38rem',
                      height: '0.38rem',
                      borderRadius: '50%',
                      background: mood.color,
                    }} />
                  )}
                </div>
                <p style={{ fontSize: '0.55rem', color: 'var(--steel)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {d.label}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
