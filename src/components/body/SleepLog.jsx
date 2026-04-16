import { FEEL_OPTIONS } from '../../data/bodyData'

export default function SleepLog({ sleep, onUpdate, showWakeTime = false }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>

      {/* Bedtime (evening) */}
      {!showWakeTime && (
        <div>
          <label style={{ fontSize: '0.72rem', fontWeight: 500, color: 'var(--steel)', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
            Bedtime
          </label>
          <input
            type="time"
            value={sleep.bedtime}
            onChange={e => onUpdate({ bedtime: e.target.value })}
            style={{
              background: 'var(--base)',
              border: '1px solid rgba(232,160,160,0.3)',
              borderRadius: '0.75rem',
              padding: '0.55rem 0.85rem',
              fontSize: '0.95rem',
              color: 'var(--text-dark)',
              fontFamily: 'Lora, Georgia, serif',
              outline: 'none',
              width: '100%',
              boxSizing: 'border-box',
            }}
          />
        </div>
      )}

      {/* Wake time (morning) */}
      {showWakeTime && (
        <>
          <div>
            <label style={{ fontSize: '0.72rem', fontWeight: 500, color: 'var(--steel)', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
              Wake time
            </label>
            <input
              type="time"
              value={sleep.wakeTime}
              onChange={e => onUpdate({ wakeTime: e.target.value })}
              style={{
                background: 'var(--base)',
                border: '1px solid rgba(232,160,160,0.3)',
                borderRadius: '0.75rem',
                padding: '0.55rem 0.85rem',
                fontSize: '0.95rem',
                color: 'var(--text-dark)',
                fontFamily: 'Lora, Georgia, serif',
                outline: 'none',
                width: '100%',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Feel rating */}
          <div>
            <label style={{ fontSize: '0.72rem', fontWeight: 500, color: 'var(--steel)', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
              How rested?
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {FEEL_OPTIONS.map(opt => {
                const selected = sleep.feel === opt.value
                return (
                  <button
                    key={opt.value}
                    onClick={() => onUpdate({ feel: selected ? null : opt.value })}
                    style={{
                      flex: 1,
                      background: selected ? 'var(--pink)' : 'var(--base)',
                      border: `1.5px solid ${selected ? 'var(--rose)' : 'rgba(232,160,160,0.3)'}`,
                      borderRadius: '0.75rem',
                      padding: '0.45rem 0.1rem',
                      cursor: 'pointer',
                      fontSize: '0.72rem',
                      fontWeight: selected ? 500 : 400,
                      color: selected ? 'var(--text-dark)' : 'var(--text-mid)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}

      {/* Hours slept display (if both times present) */}
      {sleep.bedtime && sleep.wakeTime && (() => {
        const [bh, bm] = sleep.bedtime.split(':').map(Number)
        const [wh, wm] = sleep.wakeTime.split(':').map(Number)
        let mins = (wh * 60 + wm) - (bh * 60 + bm)
        if (mins < 0) mins += 24 * 60
        const hrs = Math.floor(mins / 60)
        const rem = mins % 60
        return (
          <p style={{
            fontSize: '0.78rem',
            fontFamily: 'Lora, Georgia, serif',
            fontStyle: 'italic',
            color: 'var(--steel)',
            margin: 0,
            textAlign: 'center',
          }}>
            {hrs}h {rem > 0 ? `${rem}m` : ''} of sleep ✦
          </p>
        )
      })()}
    </div>
  )
}
