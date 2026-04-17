import { useState } from 'react'
import { useWeight } from '../../hooks/useGoalsData'

function MilestoneCard({ milestone }) {
  return (
    <div style={{ background: 'linear-gradient(135deg, rgba(244,194,194,0.15) 0%, rgba(253,240,240,0.5) 100%)', border: '1px solid rgba(232,160,160,0.22)', borderRadius: '1rem', padding: '0.75rem 1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
        <span style={{ fontSize: '0.65rem', color: 'var(--rose)' }}>✦</span>
        <p style={{ fontFamily: 'Lora, Georgia, serif', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-dark)', margin: 0 }}>
          {milestone.lbs} lbs
        </p>
      </div>
      <p style={{ fontSize: '0.75rem', fontStyle: 'italic', fontFamily: 'Lora, Georgia, serif', color: 'var(--text-mid)', margin: '0 0 0.1rem', lineHeight: 1.4 }}>
        the weight of {milestone.comparison}
      </p>
      {milestone.note && (
        <p style={{ fontSize: '0.65rem', color: 'var(--steel)', margin: 0, fontStyle: 'italic' }}>{milestone.note}</p>
      )}
    </div>
  )
}

export default function WeightModule() {
  const { startWeight, lostLbs, achievedMilestones, nextMilestone, hasSetup, setStartWeight, logWeight } = useWeight()
  const [mode, setMode]   = useState(null) // 'setup' | 'log' | null
  const [input, setInput] = useState('')

  function handleSave() {
    if (!input) return
    if (mode === 'setup') setStartWeight(input)
    else logWeight(input)
    setInput('')
    setMode(null)
  }

  return (
    <div>
      <p style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--steel)', margin: '0 0 0.75rem' }}>Weight Milestones</p>

      {!hasSetup ? (
        mode === 'setup' ? (
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
            <input autoFocus type="number" value={input} onChange={e => setInput(e.target.value)} placeholder="Starting weight (lbs)…" style={{ flex: 1, background: 'rgba(244,194,194,0.08)', border: '1px solid rgba(232,160,160,0.25)', borderRadius: '0.75rem', padding: '0.5rem 0.75rem', fontSize: '0.82rem', color: 'var(--text-dark)', outline: 'none' }} />
            <button onClick={handleSave} disabled={!input} style={{ padding: '0.5rem 0.75rem', background: input ? 'var(--rose)' : 'rgba(232,160,160,0.2)', border: 'none', borderRadius: '0.75rem', fontSize: '0.78rem', fontWeight: 500, color: input ? '#fff' : 'var(--steel)', cursor: input ? 'pointer' : 'default' }}>Save</button>
            <button onClick={() => setMode(null)} style={{ background: 'none', border: 'none', fontSize: '0.75rem', color: 'var(--steel)', cursor: 'pointer' }}>✕</button>
          </div>
        ) : (
          <p style={{ fontSize: '0.73rem', fontStyle: 'italic', fontFamily: 'Lora, Georgia, serif', color: 'var(--steel)', margin: '0 0 0.5rem' }}>
            Set a starting weight to begin tracking milestones. This number stays private.{' '}
            <button onClick={() => setMode('setup')} style={{ background: 'none', border: 'none', color: 'var(--rose)', cursor: 'pointer', padding: 0, fontSize: '0.73rem', fontStyle: 'italic' }}>Set it →</button>
          </p>
        )
      ) : (
        <>
          {/* Achieved milestones */}
          {achievedMilestones.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem' }}>
              {achievedMilestones.map(m => <MilestoneCard key={m.lbs} milestone={m} />)}
            </div>
          ) : (
            <p style={{ fontSize: '0.73rem', fontStyle: 'italic', fontFamily: 'Lora, Georgia, serif', color: 'var(--steel)', margin: '0 0 0.75rem', opacity: 0.75 }}>
              Milestone cards appear here as you reach them.
            </p>
          )}

          {/* Next milestone horizon */}
          {nextMilestone && (
            <p style={{ fontSize: '0.7rem', fontStyle: 'italic', fontFamily: 'Lora, Georgia, serif', color: 'var(--steel)', margin: '0 0 0.65rem', opacity: 0.75 }}>
              Next on the horizon: {nextMilestone.lbs} lbs
            </p>
          )}

          {/* Log weight */}
          {mode === 'log' ? (
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
              <input autoFocus type="number" value={input} onChange={e => setInput(e.target.value)} placeholder="Current weight (lbs)…" style={{ flex: 1, background: 'rgba(244,194,194,0.08)', border: '1px solid rgba(232,160,160,0.25)', borderRadius: '0.75rem', padding: '0.5rem 0.75rem', fontSize: '0.82rem', color: 'var(--text-dark)', outline: 'none' }} />
              <button onClick={handleSave} disabled={!input} style={{ padding: '0.5rem 0.75rem', background: input ? 'var(--rose)' : 'rgba(232,160,160,0.2)', border: 'none', borderRadius: '0.75rem', fontSize: '0.78rem', fontWeight: 500, color: input ? '#fff' : 'var(--steel)', cursor: input ? 'pointer' : 'default' }}>Save</button>
              <button onClick={() => setMode(null)} style={{ background: 'none', border: 'none', fontSize: '0.75rem', color: 'var(--steel)', cursor: 'pointer' }}>✕</button>
            </div>
          ) : (
            <button onClick={() => setMode('log')} style={{ background: 'none', border: 'none', padding: 0, fontSize: '0.72rem', color: 'var(--rose)', cursor: 'pointer', fontStyle: 'italic' }}>
              + Log current weight
            </button>
          )}
        </>
      )}
    </div>
  )
}
