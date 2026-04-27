import { useState } from 'react'
import { useHabits, drawRandomClip } from '../hooks/useHabits'
import HabitSetup from '../components/habits/HabitSetup'
import SpinWheel, { MAIN_SEGMENTS, BONUS_SEGMENTS } from '../components/habits/SpinWheel'
import ClipInventory from '../components/habits/ClipInventory'
import PrizeJar from '../components/habits/PrizeJar'
import DBTSkillFlow from '../components/habits/DBTSkillFlow'
import { MicroMotifs } from '../components/Decorations'

const DEFAULT_HABIT = {
  name: '', t1Reward: '', t2Reward: '', t3Reward: '', jackpotReward: '',
  miniGoal: 20, midGoal: 50, moonshotGoal: 100,
  miniPrize: '', midPrize: '', moonshotPrize: '',
}

function rewardForTier(tier, habit) {
  if (tier === 'JACKPOT') return habit.jackpotReward || 'Jackpot! 🌟'
  if (tier === 3) return habit.t3Reward || 'Tier 3 reward'
  if (tier === 2) return habit.t2Reward || 'Tier 2 reward'
  return habit.t1Reward || 'Tier 1 reward'
}

// ── Timer component ───────────────────────────────────────────────

function BonusTimer({ pct, habit, onSuccess, onSkip }) {
  const [seconds, setSeconds] = useState(600)
  const [done, setDone]       = useState(false)
  const expired = seconds <= 0 && !done

  useEffect(() => {
    if (done) return
    const id = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) { clearInterval(id); return 0 }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [done])

  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`
  const progress = seconds / 600

  return (
    <div style={{ padding: '1.25rem 1.1rem' }}>
      <p style={{ margin: '0 0 1rem', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--steel)' }}>
        Bonus round
      </p>

      <div style={{
        background: expired ? 'rgba(192,99,90,0.05)' : 'white',
        border: `1.5px solid ${expired ? 'rgba(192,99,90,0.2)' : 'rgba(232,160,160,0.2)'}`,
        borderRadius: '1.25rem',
        padding: '1.5rem',
        textAlign: 'center',
        marginBottom: '1rem',
      }}>
        <p style={{ margin: '0 0 0.4rem', fontSize: '2.5rem', fontWeight: 800, color: expired ? '#c0635a' : 'var(--text-dark)', fontFamily: 'Lora, Georgia, serif' }}>
          {expired ? '0:00' : timeStr}
        </p>
        <p style={{ margin: '0 0 1rem', fontSize: '0.82rem', color: 'var(--text-mid)' }}>
          {expired
            ? "Time’s up — streak ends, but you keep your original reward."
            : `Do ${pct}% of your habit (${habit.name})`
          }
        </p>

        {/* Progress bar */}
        <div style={{ height: '4px', background: 'rgba(232,160,160,0.15)', borderRadius: '2px', marginBottom: '1.25rem' }}>
          <div style={{
            height: '100%',
            width: `${progress * 100}%`,
            background: expired ? '#e57373' : 'var(--rose)',
            borderRadius: '2px',
            transition: 'width 1s linear',
          }} />
        </div>

        {!expired && !done && (
          <button
            onClick={() => { setDone(true); onSuccess() }}
            style={{
              width: '100%', padding: '0.8rem',
              background: 'linear-gradient(135deg, var(--rose) 0%, rgba(232,160,160,0.8) 100%)',
              border: 'none', borderRadius: '1rem',
              fontSize: '0.9rem', fontWeight: 600, color: 'white',
              cursor: 'pointer', marginBottom: '0.5rem',
              boxShadow: '0 3px 12px rgba(232,160,160,0.3)',
            }}
          >
            I did it! +1 clip → Spin again
          </button>
        )}
        {expired && (
          <button
            onClick={onSkip}
            style={{
              width: '100%', padding: '0.8rem',
              background: 'none', border: '1px solid rgba(192,99,90,0.25)',
              borderRadius: '1rem', fontSize: '0.9rem', fontWeight: 600,
              color: '#c0635a', cursor: 'pointer',
            }}
          >
            Continue
          </button>
        )}
      </div>
      {!expired && !done && (
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={onSkip}
            style={{ background: 'none', border: 'none', fontSize: '0.75rem', color: 'var(--steel)', textDecoration: 'underline', cursor: 'pointer' }}
          >
            Skip bonus
          </button>
        </div>
      )}
    </div>
  )
}

// ── Main tab ──────────────────────────────────────────────────────

export default function HabitsTab() {
  const { habit, inventory, stats, loaded, saveHabit, addClip, spendClips, incrementSessions, totalClipsInJar } = useHabits()

  // Session phase state machine
  const [phase, setPhase]           = useState('home')
  const [editing, setEditing]       = useState(false)
  const [drawnClip, setDrawnClip]   = useState(null)
  const [activeTier, setActiveTier] = useState(1)
  const [mainResult, setMainResult] = useState(null)  // segment from main wheel
  const [bonusResult, setBonusResult] = useState(null) // segment from bonus wheel
  const [bonusPct, setBonusPct]     = useState(75)
  const [extraSpinsLeft, setExtraSpinsLeft] = useState(0)
  const [showDBT, setShowDBT]               = useState(false)

  if (!loaded) {
    return (
      <div style={{ padding: '3rem 1.1rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--steel)', fontSize: '0.82rem' }}>Loading…</p>
      </div>
    )
  }

  const hasHabit = habit.name?.trim().length > 0

  // ── Setup ─────────────────────────────────────────────────────
  if (!hasHabit || editing) {
    return (
      <div className="fade-up">
        <header style={{
          padding: '1.25rem 1.25rem 0.75rem',
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          borderBottom: '1px solid rgba(232,160,160,0.12)',
        }}>
          {editing && (
            <button onClick={() => setEditing(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--steel)', fontSize: '0.85rem' }}>
              ← Back
            </button>
          )}
          <span className="serif" style={{ fontSize: '1rem', color: 'var(--text-dark)', fontWeight: 600 }}>
            {editing ? 'Edit habit' : 'Build your casino'}
          </span>
        </header>
        <HabitSetup
          initialValues={habit.name ? habit : DEFAULT_HABIT}
          onSave={data => { saveHabit(data); setEditing(false) }}
        />
      </div>
    )
  }

  // ── Draw clip ─────────────────────────────────────────────────
  function handleDidIt() {
    const clip = drawRandomClip()
    setDrawnClip(clip)
    addClip(clip)
    incrementSessions()
    setPhase('cashing')
  }

  // ── Select tier → go spin ─────────────────────────────────────
  function handleSelectTier(opt) {
    if (opt.cost) spendClips(opt.cost.color, opt.cost.count)
    setActiveTier(opt.tier)
    setPhase('spinning')
  }

  // ── Main wheel result ─────────────────────────────────────────
  function handleMainResult(segment) {
    setMainResult(segment)
    if (segment.id === 'JACKPOT') {
      setPhase('result')
    } else if (segment.id === 'BONUS') {
      setPhase('bonus_spinning')
    } else {
      setPhase('result')
    }
  }

  // ── Bonus wheel result ────────────────────────────────────────
  function handleBonusResult(segment) {
    setBonusResult(segment)
    if (segment.id === 'FREE') {
      // Free clip — add one and go back to home
      const clip = drawRandomClip()
      addClip(clip)
      setPhase('free_clip')
    } else if (segment.id === 'EXTRA') {
      // Spin bonus wheel again (up to 2 extra times)
      setExtraSpinsLeft(prev => prev + 1)
      setPhase('bonus_spinning')
    } else {
      // 75 / 50 / 25 — timer
      setBonusPct(parseInt(segment.id, 10))
      setPhase('timer')
    }
  }

  function handleTimerSuccess() {
    const clip = drawRandomClip()
    addClip(clip)
    setDrawnClip(clip)
    setActiveTier(activeTier) // keep same tier floor
    setPhase('spinning')
  }

  function handleDone() {
    setPhase('home')
    setDrawnClip(null)
    setMainResult(null)
    setBonusResult(null)
    setActiveTier(1)
    setExtraSpinsLeft(0)
  }

  // ── Effective tier ────────────────────────────────────────────
  function effectiveTier(segment) {
    if (!segment) return activeTier
    if (segment.id === 'JACKPOT') return 'JACKPOT'
    if (segment.id === 'BONUS')   return activeTier
    return Math.max(activeTier, segment.tier ?? 1)
  }

  // ── Phase: home ───────────────────────────────────────────────
  if (phase === 'home') {
    return (
      <div className="fade-up">
        {showDBT && <DBTSkillFlow onClose={() => setShowDBT(false)} />}
        <header style={{
          padding: '1.25rem 1.25rem 0.9rem',
          background: 'linear-gradient(160deg, #fde8e8 0%, #fdf5f5 100%)',
          borderBottom: '1px solid rgba(232,160,160,0.12)',
          position: 'relative', overflow: 'hidden',
        }}>
          <span style={{ position: 'absolute', top: '0.6rem', right: '1.2rem', fontSize: '0.7rem', color: 'var(--rose)', opacity: 0.3, animation: 'starShimmer 5s infinite' }}>✦</span>
          <p style={{ fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--steel)', margin: '0 0 0.2rem' }}>Habits</p>
          <h1 className="serif" style={{ fontSize: '1.4rem', fontWeight: 500, color: 'var(--text-dark)', margin: '0 0 0.1rem', lineHeight: 1.2 }}>
            {habit.name} <span style={{ fontSize: '0.85rem' }}>✦</span>
          </h1>
          <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--steel)' }}>
            {stats.totalSessions} session{stats.totalSessions !== 1 ? 's' : ''} · HABIT → GRAB → CASH → SPIN
          </p>
        </header>

        <div style={{ padding: '1.1rem 1.1rem 0' }}>
          <PrizeJar totalClips={totalClipsInJar} habit={habit} />

          {/* Big "I did it" button */}
          <button
            onClick={handleDidIt}
            style={{
              width: '100%',
              padding: '1.1rem',
              background: 'linear-gradient(135deg, var(--rose) 0%, rgba(232,160,160,0.8) 100%)',
              border: 'none', borderRadius: '1.25rem',
              fontSize: '1.1rem', fontWeight: 700,
              color: 'white', cursor: 'pointer',
              letterSpacing: '0.03em',
              boxShadow: '0 4px 16px rgba(232,160,160,0.35)',
              marginBottom: '0.85rem',
            }}
          >
            I did it — draw a clip ✦
          </button>

          {/* Tier reminder */}
          <div style={{ background: 'white', border: '1px solid rgba(232,160,160,0.18)', borderRadius: '1rem', padding: '0.75rem 1rem', marginBottom: '0.75rem' }}>
            <p style={{ margin: '0 0 0.4rem', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--steel)' }}>Your rewards</p>
            {[
              { tier: 'T1', reward: habit.t1Reward, color: '#e48fa8' },
              { tier: 'T2', reward: habit.t2Reward, color: '#8b7cd4' },
              { tier: 'T3', reward: habit.t3Reward, color: '#4db6ac' },
              { tier: '★',  reward: habit.jackpotReward, color: '#f9a825' },
            ].filter(r => r.reward).map(({ tier, reward, color }) => (
              <div key={tier} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.25rem', alignItems: 'baseline' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color, minWidth: '1.5rem' }}>{tier}</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-mid)' }}>{reward}</span>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'right' }}>
            <button onClick={() => setEditing(true)} style={{ background: 'none', border: 'none', fontSize: '0.72rem', color: 'var(--steel)', textDecoration: 'underline', cursor: 'pointer', opacity: 0.6 }}>
              Edit habit
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', margin: '1.25rem 0 0.5rem' }}>
          <MicroMotifs count={5} />
        </div>
      </div>
    )
  }

  // ── Phase: cashing ────────────────────────────────────────────
  if (phase === 'cashing') {
    return (
      <div className="fade-up">
        <header style={{ padding: '1.1rem 1.1rem 0.75rem', borderBottom: '1px solid rgba(232,160,160,0.12)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={handleDone} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--steel)', fontSize: '0.85rem' }}>← Back</button>
          <span className="serif" style={{ fontSize: '1rem', color: 'var(--text-dark)', fontWeight: 600 }}>Cash in or spin</span>
        </header>
        <div style={{ paddingTop: '1rem' }}>
          <ClipInventory inventory={inventory} drawnClip={drawnClip} onSelectTier={handleSelectTier} />
        </div>
      </div>
    )
  }

  // ── Phase: spinning (main wheel) ──────────────────────────────
  if (phase === 'spinning') {
    return (
      <div className="fade-up">
        <header style={{ padding: '1.1rem 1.1rem 0.75rem', borderBottom: '1px solid rgba(232,160,160,0.12)' }}>
          <span className="serif" style={{ fontSize: '1rem', color: 'var(--text-dark)', fontWeight: 600 }}>
            Tier {activeTier} floor · Spinning…
          </span>
        </header>
        <div style={{ padding: '1.5rem 1.1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <SpinWheel segments={MAIN_SEGMENTS} onResult={handleMainResult} />
        </div>
      </div>
    )
  }

  // ── Phase: result (main wheel) ────────────────────────────────
  if (phase === 'result') {
    const tier   = effectiveTier(mainResult)
    const reward = rewardForTier(tier, habit)
    const isJackpot = tier === 'JACKPOT'

    return (
      <div className="fade-up">
        <div style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: isJackpot ? '3rem' : '2rem', marginBottom: '0.5rem' }}>
            {isJackpot ? '🌟' : tier === 3 ? '✦' : '✓'}
          </div>
          <p style={{ margin: '0 0 0.25rem', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: isJackpot ? '#f9a825' : 'var(--rose)' }}>
            {isJackpot ? 'Jackpot!' : `Tier ${tier}`}
          </p>
          <h2 className="serif" style={{ fontSize: '1.4rem', color: 'var(--text-dark)', margin: '0 0 0.5rem', lineHeight: 1.3 }}>
            {reward}
          </h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--steel)', margin: '0 0 2rem', fontStyle: 'italic' }}>
            {isJackpot ? 'The jackpot is yours. Enjoy every bit.' : 'You earned it. The naked rule applies.'}
          </p>
          <button onClick={handleDone} style={{
            padding: '0.75rem 2.5rem',
            background: 'linear-gradient(135deg, var(--rose) 0%, rgba(232,160,160,0.8) 100%)',
            border: 'none', borderRadius: '2rem',
            fontSize: '0.9rem', fontWeight: 600,
            color: 'white', cursor: 'pointer',
            boxShadow: '0 3px 12px rgba(232,160,160,0.3)',
          }}>
            Done ✦
          </button>
        </div>
      </div>
    )
  }

  // ── Phase: BONUS → show tier reward + bonus wheel ─────────────
  if (phase === 'bonus_spinning') {
    const autoTier = effectiveTier({ id: 'T' + activeTier, tier: activeTier })
    return (
      <div className="fade-up">
        <header style={{ padding: '1.1rem 1.1rem 0.75rem', borderBottom: '1px solid rgba(232,160,160,0.12)' }}>
          <p style={{ margin: '0 0 0.2rem', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--rose)' }}>
            BONUS landed!
          </p>
          <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-mid)' }}>
            Auto-collect Tier {activeTier}: {rewardForTier(activeTier, habit)}
          </p>
          {extraSpinsLeft > 0 && (
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.72rem', color: '#ffa000' }}>Extra spin #{extraSpinsLeft}</p>
          )}
        </header>
        <div style={{ padding: '1.5rem 1.1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <p style={{ margin: '0 0 1.25rem', fontSize: '0.85rem', color: 'var(--text-mid)', textAlign: 'center' }}>
            Spin the bonus wheel for a discounted rep.
          </p>
          <SpinWheel segments={BONUS_SEGMENTS} onResult={handleBonusResult} spinLabel="SPIN BONUS" />
        </div>
      </div>
    )
  }

  // ── Phase: FREE clip result ───────────────────────────────────
  if (phase === 'free_clip') {
    return (
      <div className="fade-up">
        <div style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎁</div>
          <p style={{ margin: '0 0 0.25rem', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--rose)' }}>FREE</p>
          <h2 className="serif" style={{ fontSize: '1.3rem', color: 'var(--text-dark)', margin: '0 0 0.4rem' }}>Free clip earned!</h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--steel)', margin: '0 0 0.5rem' }}>Plus your Tier {activeTier} reward:</p>
          <p className="serif" style={{ fontSize: '1rem', color: 'var(--text-mid)', fontStyle: 'italic', margin: '0 0 2rem' }}>
            {rewardForTier(activeTier, habit)}
          </p>
          <button onClick={handleDone} style={{
            padding: '0.75rem 2.5rem',
            background: 'linear-gradient(135deg, var(--rose) 0%, rgba(232,160,160,0.8) 100%)',
            border: 'none', borderRadius: '2rem',
            fontSize: '0.9rem', fontWeight: 600, color: 'white', cursor: 'pointer',
          }}>
            Done ✦
          </button>
        </div>
      </div>
    )
  }

  // ── Phase: timer ──────────────────────────────────────────────
  if (phase === 'timer') {
    return (
      <div className="fade-up">
        <BonusTimer
          pct={bonusPct}
          habit={habit}
          onSuccess={handleTimerSuccess}
          onSkip={handleDone}
        />
      </div>
    )
  }

  return null
}
