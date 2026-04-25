import { useState, useEffect } from 'react'
import { Moon } from 'lucide-react'
import { MicroMotifs } from '../Decorations'

const SLEEP_TARGET_HRS = 8
const SLEEP_TARGET_SEC = SLEEP_TARGET_HRS * 3600

function toHoursMinutes(seconds) {
  if (!seconds && seconds !== 0) return '—'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

function dateRange(daysBack) {
  const end   = new Date()
  const start = new Date(Date.now() - daysBack * 86400000)
  return {
    start_date: start.toISOString().slice(0, 10),
    end_date:   end.toISOString().slice(0, 10),
  }
}

function StatPill({ label, value, highlight = false }) {
  return (
    <div style={{
      flex: 1,
      textAlign: 'center',
      padding: '0.6rem 0.4rem',
      background: highlight ? 'rgba(232,160,160,0.12)' : 'rgba(255,255,255,0.6)',
      borderRadius: '0.75rem',
      border: highlight ? '1px solid rgba(232,160,160,0.25)' : '1px solid rgba(140,155,171,0.12)',
    }}>
      <p style={{ margin: '0 0 0.2rem', fontSize: '1rem', fontWeight: 700, color: highlight ? 'var(--rose)' : 'var(--text-dark)', fontFamily: 'Lora, Georgia, serif' }}>
        {value}
      </p>
      <p style={{ margin: 0, fontSize: '0.65rem', color: 'var(--steel)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500 }}>
        {label}
      </p>
    </div>
  )
}

export default function SleepCard({ onGoToBody }) {
  const [sleep, setSleep]     = useState(null)
  const [deficit, setDeficit] = useState(null)
  const [loading, setLoading] = useState(true)
  const [noToken, setNoToken] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        // Fetch last 7 nights for deficit + last night's detail
        const { start_date, end_date } = dateRange(7)
        const res = await fetch(`/api/oura?type=sleep&start_date=${start_date}&end_date=${end_date}`)
        const json = await res.json()

        if (json.error === 'no_token') { setNoToken(true); return }
        if (!res.ok || !json.data) return

        // Only look at main sleep sessions (not naps)
        const sessions = (json.data ?? []).filter(s => s.type === 'long_sleep')
        if (sessions.length === 0) return

        // Last night = most recent session
        const last = sessions[sessions.length - 1]
        setSleep({
          total: last.total_sleep_duration,
          rem:   last.rem_sleep_duration,
          deep:  last.deep_sleep_duration,
          day:   last.day,
        })

        // 7-day cumulative deficit
        const totalOwed = sessions.reduce((acc, s) => {
          const shortfall = SLEEP_TARGET_SEC - (s.total_sleep_duration ?? 0)
          return acc + Math.max(0, shortfall)
        }, 0)
        setDeficit(totalOwed)

      } catch {
        // silently fail — card just won't show
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Don't render if no Oura token or still loading with no data
  if (noToken || (loading && !sleep)) return null

  // Format deficit label
  const deficitHrs = deficit !== null ? Math.floor(deficit / 3600) : null
  const deficitMins = deficit !== null ? Math.floor((deficit % 3600) / 60) : null
  const deficitLabel = deficit === 0
    ? 'caught up'
    : deficit !== null
      ? `${deficitHrs > 0 ? deficitHrs + 'h ' : ''}${deficitMins}m owed`
      : '—'

  return (
    <button
      onClick={onGoToBody}
      style={{
        width: '100%',
        textAlign: 'left',
        background: 'linear-gradient(135deg, #f0f4ff 0%, #fdf0f8 100%)',
        border: '1.5px solid rgba(140,155,171,0.2)',
        borderRadius: '1.25rem',
        padding: '1rem 1.1rem',
        marginBottom: '0.9rem',
        cursor: 'pointer',
        boxShadow: '0 2px 10px rgba(140,155,171,0.08)',
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Moon size={14} strokeWidth={1.5} color="var(--steel)" />
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-dark)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Last night
          </span>
          {sleep?.day && (
            <span style={{ fontSize: '0.7rem', color: 'var(--steel)' }}>
              · {new Date(sleep.day + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>
        <MicroMotifs count={3} />
      </div>

      {/* Stats row */}
      {loading ? (
        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--steel)', fontStyle: 'italic' }}>Loading…</p>
      ) : sleep ? (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <StatPill label="Total"   value={toHoursMinutes(sleep.total)} highlight />
          <StatPill label="REM"     value={toHoursMinutes(sleep.rem)} />
          <StatPill label="Deep"    value={toHoursMinutes(sleep.deep)} />
          <StatPill label="7d deficit" value={deficitLabel} />
        </div>
      ) : (
        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--steel)', fontStyle: 'italic' }}>
          No sleep data for last night yet.
        </p>
      )}

      {/* Link hint */}
      <p style={{ margin: '0.6rem 0 0', fontSize: '0.7rem', color: 'var(--steel)' }}>
        Tap to open Body tab · Morning session ›
      </p>
    </button>
  )
}
