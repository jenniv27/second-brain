import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useNetWorth } from '../../hooks/useGoalsData'
import { formatNetWorth } from '../../data/goalsData'
import { MicroMotifs } from '../Decorations'

function NetWorthPrompt({ onSave, onDismiss }) {
  const [value, setValue] = useState('')

  return createPortal(
    <div
      onClick={onDismiss}
      style={{ position: 'fixed', inset: 0, background: 'rgba(253,240,240,0.65)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem' }}
    >
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '300px', background: 'var(--base)', borderRadius: '1.4rem', boxShadow: '0 12px 48px rgba(232,160,160,0.2)', border: '1px solid rgba(232,160,160,0.25)', padding: '1.5rem 1.25rem 1.2rem' }}>
        <p style={{ fontFamily: 'Lora, Georgia, serif', fontSize: '1rem', fontWeight: 500, color: 'var(--text-dark)', margin: '0 0 0.3rem' }}>
          New month ✦
        </p>
        <p style={{ fontSize: '0.75rem', fontStyle: 'italic', fontFamily: 'Lora, Georgia, serif', color: 'var(--steel)', margin: '0 0 1rem', lineHeight: 1.5 }}>
          What is your current net worth?
        </p>
        <input
          autoFocus
          type="number"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="e.g. 12500"
          style={{ width: '100%', background: 'rgba(244,194,194,0.08)', border: '1px solid rgba(232,160,160,0.25)', borderRadius: '0.85rem', padding: '0.7rem 0.9rem', fontSize: '0.9rem', color: 'var(--text-dark)', outline: 'none', boxSizing: 'border-box', marginBottom: '0.85rem' }}
        />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={onDismiss} style={{ flex: 1, padding: '0.6rem', background: 'transparent', border: '1px solid rgba(232,160,160,0.25)', borderRadius: '0.85rem', fontSize: '0.8rem', color: 'var(--steel)', cursor: 'pointer' }}>
            Skip
          </button>
          <button onClick={() => value && onSave(value)} disabled={!value} style={{ flex: 2, padding: '0.6rem', background: value ? 'var(--rose)' : 'rgba(232,160,160,0.2)', border: 'none', borderRadius: '0.85rem', fontSize: '0.8rem', fontWeight: 500, color: value ? '#fff' : 'var(--steel)', cursor: value ? 'pointer' : 'default' }}>
            Save ✦
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

function MilestoneCard({ amount }) {
  return (
    <div style={{ background: 'linear-gradient(135deg, rgba(244,194,194,0.15) 0%, rgba(253,240,240,0.5) 100%)', border: '1px solid rgba(232,160,160,0.22)', borderRadius: '0.85rem', padding: '0.6rem 0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
      <span style={{ fontSize: '0.65rem', color: 'var(--rose)' }}>✦</span>
      <span style={{ fontFamily: 'Lora, Georgia, serif', fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-dark)' }}>{formatNetWorth(amount)}</span>
    </div>
  )
}

export default function NetWorthModule() {
  const { current, achievedMilestones, nextMilestone, showPrompt, saveNetWorth, dismissPrompt } = useNetWorth()
  const [showLog, setShowLog] = useState(false)
  const [logVal, setLogVal]   = useState('')

  return (
    <>
      {showPrompt && <NetWorthPrompt onSave={saveNetWorth} onDismiss={dismissPrompt} />}

      <div>
        {/* Current + next milestone */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div>
            <p style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--steel)', margin: '0 0 0.2rem' }}>Net Worth</p>
            <p style={{ fontFamily: 'Lora, Georgia, serif', fontSize: '1.5rem', fontWeight: 500, color: 'var(--text-dark)', margin: 0 }}>
              {current !== null ? formatNetWorth(current) : '—'}
            </p>
          </div>
          {nextMilestone && (
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '0.62rem', color: 'var(--steel)', margin: '0 0 0.15rem', fontStyle: 'italic' }}>next milestone</p>
              <p style={{ fontFamily: 'Lora, Georgia, serif', fontSize: '0.92rem', color: 'var(--steel)', margin: 0 }}>{formatNetWorth(nextMilestone)}</p>
            </div>
          )}
        </div>

        {/* Achieved milestone cards */}
        {achievedMilestones.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
            {achievedMilestones.map(m => <MilestoneCard key={m} amount={m} />)}
          </div>
        )}

        {/* Manual log button */}
        {!showLog ? (
          <button onClick={() => setShowLog(true)} style={{ background: 'none', border: 'none', padding: 0, fontSize: '0.72rem', color: 'var(--rose)', cursor: 'pointer', fontStyle: 'italic' }}>
            + Update net worth
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginTop: '0.3rem' }}>
            <input
              autoFocus
              type="number"
              value={logVal}
              onChange={e => setLogVal(e.target.value)}
              placeholder="Current net worth…"
              style={{ flex: 1, background: 'rgba(244,194,194,0.08)', border: '1px solid rgba(232,160,160,0.25)', borderRadius: '0.75rem', padding: '0.5rem 0.75rem', fontSize: '0.82rem', color: 'var(--text-dark)', outline: 'none' }}
            />
            <button onClick={() => { saveNetWorth(logVal); setShowLog(false); setLogVal('') }} disabled={!logVal} style={{ padding: '0.5rem 0.75rem', background: logVal ? 'var(--rose)' : 'rgba(232,160,160,0.2)', border: 'none', borderRadius: '0.75rem', fontSize: '0.78rem', fontWeight: 500, color: logVal ? '#fff' : 'var(--steel)', cursor: logVal ? 'pointer' : 'default' }}>Save</button>
            <button onClick={() => setShowLog(false)} style={{ background: 'none', border: 'none', fontSize: '0.75rem', color: 'var(--steel)', cursor: 'pointer' }}>✕</button>
          </div>
        )}

        {current === null && !showLog && (
          <p style={{ fontSize: '0.73rem', fontStyle: 'italic', fontFamily: 'Lora, Georgia, serif', color: 'var(--steel)', margin: '0.25rem 0 0', opacity: 0.7 }}>
            Tap above to log your first entry.
          </p>
        )}
      </div>
    </>
  )
}
