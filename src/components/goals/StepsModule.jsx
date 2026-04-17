import { RefreshCw } from 'lucide-react'
import { useSteps } from '../../hooks/useGoalsData'

function Stat({ label, value, sub }) {
  return (
    <div style={{ flex: 1, textAlign: 'center' }}>
      <p style={{ fontFamily: 'Lora, Georgia, serif', fontSize: '1.6rem', fontWeight: 500, color: 'var(--text-dark)', margin: '0 0 0.15rem', lineHeight: 1 }}>
        {value ?? '—'}
      </p>
      <p style={{ fontSize: '0.68rem', color: 'var(--steel)', margin: 0, lineHeight: 1.3 }}>{label}</p>
      {sub && <p style={{ fontSize: '0.62rem', color: 'var(--steel)', margin: '0.1rem 0 0', opacity: 0.65, fontStyle: 'italic' }}>{sub}</p>}
    </div>
  )
}

export default function StepsModule() {
  const { loading, error, weeklyAvg, daysAt10k, refresh } = useSteps()

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <p style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--steel)', margin: 0 }}>Steps</p>
        <button onClick={refresh} disabled={loading} style={{ background: 'none', border: 'none', cursor: loading ? 'default' : 'pointer', opacity: loading ? 0.4 : 0.6, padding: '0.2rem' }}>
          <RefreshCw size={12} color="var(--steel)" style={{ animation: loading ? 'softPulse 1s infinite' : 'none' }} />
        </button>
      </div>

      {error === 'no_token' ? (
        <p style={{ fontSize: '0.73rem', fontStyle: 'italic', fontFamily: 'Lora, Georgia, serif', color: 'var(--steel)', margin: 0, lineHeight: 1.55 }}>
          Add <code style={{ fontSize: '0.68rem', background: 'rgba(140,155,171,0.12)', padding: '0.1rem 0.3rem', borderRadius: '0.25rem' }}>OURA_ACCESS_TOKEN</code> to Vercel environment variables to enable steps.
        </p>
      ) : error ? (
        <p style={{ fontSize: '0.73rem', fontStyle: 'italic', color: 'var(--steel)', margin: 0 }}>Could not load step data.</p>
      ) : (
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Stat
            value={weeklyAvg !== null ? weeklyAvg.toLocaleString() : null}
            label="weekly average"
            sub="steps / day"
          />
          <div style={{ width: '1px', background: 'rgba(232,160,160,0.2)' }} />
          <Stat
            value={daysAt10k !== null ? daysAt10k : null}
            label="days at 10k+"
            sub="this week"
          />
        </div>
      )}
    </div>
  )
}
