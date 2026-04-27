import { useState } from 'react'
import { DBT_SKILLS, MODULE_META, pickSkill, resolveReward } from '../../data/dbtSkills'
import { useDBTLog } from '../../hooks/useDBTLog'
import SpinWheel, { MAIN_SEGMENTS } from './SpinWheel'

// ── Skill card ────────────────────────────────────────────────────

function SkillCard({ skill, onRefresh, onComplete, onClose }) {
  const meta = MODULE_META[skill.module] ?? { color: 'var(--rose)', bg: 'rgba(232,160,160,0.08)' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', padding: '1.5rem 1.25rem' }}>
      <button
        onClick={onClose}
        style={{ alignSelf: 'flex-start', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--steel)', fontSize: '0.85rem', padding: 0, marginBottom: '2rem' }}
      >
        ← back
      </button>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {/* Module tag */}
        <div style={{ marginBottom: '1.5rem' }}>
          <span style={{
            display: 'inline-block',
            padding: '0.25rem 0.75rem',
            borderRadius: '2rem',
            background: meta.bg,
            border: `1px solid ${meta.color}33`,
            fontSize: '0.68rem',
            fontWeight: 600,
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            color: meta.color,
          }}>
            {skill.module}
          </span>
        </div>

        {/* Prompt */}
        <p style={{
          fontFamily: 'Lora, Georgia, serif',
          fontSize: '1.15rem',
          fontWeight: 500,
          color: 'var(--text-dark)',
          lineHeight: 1.65,
          margin: '0 0 2.5rem',
        }}>
          {skill.prompt}
        </p>

        {/* Actions */}
        <button
          onClick={onComplete}
          style={{
            width: '100%',
            padding: '0.95rem',
            background: 'linear-gradient(135deg, var(--rose) 0%, rgba(232,160,160,0.8) 100%)',
            border: 'none',
            borderRadius: '1rem',
            fontSize: '0.9rem',
            fontWeight: 600,
            color: 'white',
            cursor: 'pointer',
            letterSpacing: '0.03em',
            boxShadow: '0 3px 14px rgba(232,160,160,0.3)',
            marginBottom: '1rem',
          }}
        >
          Done ✦ spin the wheel
        </button>

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={onRefresh}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.78rem',
              color: 'var(--steel)',
              padding: '0.25rem 0',
            }}
          >
            not this one
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Reward card ───────────────────────────────────────────────────

function RewardCard({ reward, onClose }) {
  const isJackpot = reward.tier === 'JACKPOT'
  const isBonus   = reward.tier === 'BONUS'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100%', padding: '2rem 1.5rem', textAlign: 'center' }}>
      <span style={{ fontSize: '1.5rem', color: 'var(--rose)', opacity: 0.6, marginBottom: '1.5rem' }}>✦</span>

      {isBonus && (
        <p style={{ margin: '0 0 0.4rem', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#ffa000' }}>
          bonus
        </p>
      )}
      {isJackpot && (
        <p style={{ margin: '0 0 0.4rem', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#f9a825' }}>
          jackpot ★
        </p>
      )}
      {!isBonus && !isJackpot && (
        <p style={{ margin: '0 0 0.4rem', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--steel)' }}>
          {reward.tier === 'T1' ? 'tier 1' : reward.tier === 'T2' ? 'tier 2' : 'tier 3'}
        </p>
      )}

      <div style={{
        background: 'white',
        border: '1px solid rgba(232,160,160,0.2)',
        borderRadius: '1.25rem',
        padding: '1.5rem 1.75rem',
        margin: '0.5rem 0 2.5rem',
        boxShadow: '0 2px 16px rgba(232,160,160,0.1)',
        maxWidth: '280px',
      }}>
        <p style={{
          fontFamily: 'Lora, Georgia, serif',
          fontSize: '1.2rem',
          fontWeight: 500,
          color: 'var(--text-dark)',
          margin: 0,
          lineHeight: 1.4,
        }}>
          {reward.text}
        </p>
      </div>

      <p style={{ fontSize: '0.78rem', color: 'var(--steel)', fontStyle: 'italic', margin: '0 0 2rem' }}>
        Only through the wheel.
      </p>

      <button
        onClick={onClose}
        style={{
          padding: '0.7rem 2.5rem',
          background: 'rgba(232,160,160,0.12)',
          border: '1px solid rgba(232,160,160,0.3)',
          borderRadius: '2rem',
          fontSize: '0.88rem',
          fontWeight: 500,
          color: 'var(--rose)',
          cursor: 'pointer',
        }}
      >
        Close
      </button>
    </div>
  )
}

// ── Main flow ─────────────────────────────────────────────────────

export default function DBTSkillFlow({ onClose }) {
  const { addEntry } = useDBTLog()
  const [skill, setSkill]   = useState(() => pickSkill())
  const [phase, setPhase]   = useState('skill') // 'skill' | 'spinning' | 'reward'
  const [reward, setReward] = useState(null)

  function handleRefresh() {
    setSkill(prev => pickSkill(prev.id))
  }

  function handleComplete() {
    setPhase('spinning')
  }

  function handleSpinResult(segment) {
    const r = resolveReward(segment.id)
    addEntry(skill, r.tier, r.text)
    setReward(r)
    setPhase('reward')
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 200,
      background: 'var(--base)',
      overflowY: 'auto',
    }}>
      {phase === 'skill' && (
        <SkillCard
          skill={skill}
          onRefresh={handleRefresh}
          onComplete={handleComplete}
          onClose={onClose}
        />
      )}

      {phase === 'spinning' && (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', padding: '1.5rem 1.25rem' }}>
          <button
            onClick={() => setPhase('skill')}
            style={{ alignSelf: 'flex-start', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--steel)', fontSize: '0.85rem', padding: 0, marginBottom: '1.5rem' }}
          >
            ← back
          </button>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--steel)', margin: '0 0 1rem' }}>
              Your reward
            </p>
            <SpinWheel
              segments={MAIN_SEGMENTS}
              onResult={handleSpinResult}
              spinLabel="SPIN ✦"
            />
          </div>
        </div>
      )}

      {phase === 'reward' && reward && (
        <RewardCard reward={reward} onClose={onClose} />
      )}
    </div>
  )
}
