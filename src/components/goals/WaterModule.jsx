import { useState } from 'react'
import { useWater } from '../../hooks/useWater'
import WaterGlass from './WaterGlass'

export default function WaterModule() {
  const {
    glasses,
    settings,
    notifPermission,
    addGlass,
    removeGlass,
    requestPermission,
    disableReminders,
    updateSettings,
  } = useWater()

  const [splashTrigger, setSplashTrigger] = useState(0)

  function handleAddGlass() {
    addGlass()
    setSplashTrigger(prev => prev + 1)
  }

  const goalMet   = glasses >= settings.goal
  const remindersOn = settings.reminders && notifPermission === 'granted'
  const INTERVALS = [1, 2, 3]

  return (
    <div>
      <p style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--steel)', margin: '0 0 1rem' }}>
        Hydration
      </p>

      {/* Glass animation + count */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '0.9rem' }}>
        <WaterGlass glasses={glasses} goal={settings.goal} splashTrigger={splashTrigger} />

        <div>
          <p style={{
            fontFamily: 'Lora, Georgia, serif',
            fontSize: '2rem',
            fontWeight: 500,
            color: goalMet ? 'var(--rose)' : 'var(--text-dark)',
            margin: '0 0 0.15rem',
            lineHeight: 1,
          }}>
            {glasses}
          </p>
          <p style={{ fontSize: '0.78rem', color: 'var(--steel)', fontFamily: 'Lora, Georgia, serif', fontStyle: 'italic', margin: '0 0 0.75rem' }}>
            of {settings.goal} glasses
          </p>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={removeGlass}
              disabled={glasses === 0}
              style={{
                background: 'none', border: 'none', padding: 0,
                fontSize: '0.78rem',
                color: glasses === 0 ? 'rgba(232,160,160,0.35)' : 'var(--rose)',
                cursor: glasses === 0 ? 'default' : 'pointer',
                fontStyle: 'italic',
              }}
            >
              − glass
            </button>
            <button
              onClick={handleAddGlass}
              style={{
                background: 'none', border: 'none', padding: 0,
                fontSize: '0.78rem', color: 'var(--rose)',
                cursor: 'pointer', fontStyle: 'italic',
              }}
            >
              + glass
            </button>
          </div>
        </div>
      </div>

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.9rem', flexWrap: 'wrap' }}>
        {Array.from({ length: settings.goal }).map((_, i) => (
          <div key={i} style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: i < glasses ? 'var(--rose)' : 'rgba(232,160,160,0.18)',
            border: i < glasses ? 'none' : '1px solid rgba(232,160,160,0.3)',
            transition: 'background 0.3s, border 0.3s',
          }} />
        ))}
      </div>

      {/* Separator */}
      <div style={{ borderTop: '1px solid rgba(232,160,160,0.15)', marginBottom: '0.75rem' }} />

      {/* Notifications */}
      {notifPermission === 'denied' ? (
        <p style={{ fontSize: '0.72rem', fontStyle: 'italic', fontFamily: 'Lora, Georgia, serif', color: 'var(--steel)', margin: '0 0 0.4rem' }}>
          Notifications blocked in your browser settings.
        </p>
      ) : remindersOn ? (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.72rem', fontStyle: 'italic', color: 'var(--steel)' }}>
              Reminders on · every {settings.intervalHours}h
            </span>
            <button
              onClick={disableReminders}
              style={{ background: 'none', border: 'none', padding: 0, fontSize: '0.72rem', color: 'var(--steel)', cursor: 'pointer', lineHeight: 1 }}
            >
              ×
            </button>
          </div>
          <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.4rem' }}>
            {INTERVALS.map(h => (
              <button
                key={h}
                onClick={() => updateSettings({ intervalHours: h })}
                style={{
                  background: 'none',
                  border: `1px solid ${settings.intervalHours === h ? 'var(--rose)' : 'rgba(140,155,171,0.3)'}`,
                  borderRadius: '0.5rem',
                  padding: '0.2rem 0.45rem',
                  fontSize: '0.68rem',
                  color: settings.intervalHours === h ? 'var(--rose)' : 'var(--steel)',
                  cursor: 'pointer',
                  fontWeight: settings.intervalHours === h ? 600 : 400,
                }}
              >
                {h}h
              </button>
            ))}
          </div>
        </div>
      ) : (
        <button
          onClick={requestPermission}
          style={{
            background: 'none', border: 'none', padding: 0,
            fontSize: '0.72rem', color: 'var(--rose)',
            cursor: 'pointer', fontStyle: 'italic',
            marginBottom: '0.4rem', display: 'block',
          }}
        >
          Turn on reminders
        </button>
      )}

      {notifPermission !== 'denied' && (
        <p style={{ fontSize: '0.65rem', fontStyle: 'italic', color: 'var(--steel)', margin: '0.35rem 0 0', opacity: 0.7 }}>
          Reminders fire while the app is open.
        </p>
      )}
    </div>
  )
}
