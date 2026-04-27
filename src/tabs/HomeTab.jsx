import { useState } from 'react'
import { BookOpen, Flower2, Target } from 'lucide-react'
import LowEffortMode from '../components/LowEffortMode'
import DBTSkillFlow from '../components/habits/DBTSkillFlow'
import RoutineCard from '../components/RoutineCard'
import TaskSection from '../components/home/TaskSection'
import HomeBudgetCard from '../components/home/HomeBudgetCard'
import SleepCard from '../components/home/SleepCard'
import GoalsView from './GoalsView'
import { Bow, Wings, OrnateDivider, MotifCluster, MicroMotifs } from '../components/Decorations'
import { useCheckinDismissal } from '../hooks/useHomeTasks'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 5)  return { text: 'Still awake,',    sub: 'The quiet hours are yours.' }
  if (hour < 12) return { text: 'Good morning,',   sub: 'A soft start to the day.' }
  if (hour < 17) return { text: 'Good afternoon,', sub: 'You\'re doing just fine.' }
  if (hour < 21) return { text: 'Good evening,',   sub: 'Time to settle in.' }
  return          { text: 'Good night,',            sub: 'A gentle close to the day.' }
}

function formatDate() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })
}

export default function HomeTab({ onGoToMoney, onGoToBody }) {
  const [lowEffortOpen, setLowEffortOpen] = useState(false)
  const [view, setView]                   = useState('home') // 'home' | 'goals'
  const [showDBT, setShowDBT]             = useState(false)
  const { dismissed, dismiss }            = useCheckinDismissal()
  const { text, sub } = getGreeting()
  const dateStr = formatDate()

  if (view === 'goals') {
    return <GoalsView onBack={() => setView('home')} />
  }

  return (
    <div className="fade-up">

      {/* ── Decorative Header ── */}
      <header style={{
        position: 'relative',
        padding: '2rem 1.25rem 1.5rem',
        background: 'linear-gradient(160deg, #f9d8d8 0%, #fce8e8 45%, var(--base) 100%)',
        borderBottom: '1px solid rgba(232,160,160,0.15)',
        overflow: 'hidden',
      }}>
        <MotifCluster style={{ position: 'absolute', top: '0.5rem',  right: '0.5rem' }} />
        <MotifCluster style={{ position: 'absolute', top: '0.75rem', left: '0.25rem', opacity: 0.5 }} flip />

        <p style={{
          fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.08em',
          textTransform: 'uppercase', color: 'var(--steel)', margin: '0 0 0.5rem', position: 'relative',
        }}>
          {dateStr}
        </p>

        <h1 style={{
          fontFamily: 'Lora, Georgia, serif', fontSize: '2rem', fontWeight: 500,
          color: 'var(--text-dark)', margin: '0 0 0.35rem', lineHeight: 1.2, position: 'relative',
        }}>
          {text}{' '}
          <span style={{ whiteSpace: 'nowrap' }}>
            Jennifer{' '}
            <span className="star-accent" style={{ fontSize: '1.1rem' }}>✦</span>
          </span>
        </h1>

        <p style={{
          fontFamily: 'Lora, Georgia, serif', fontSize: '0.95rem', fontStyle: 'italic',
          color: 'var(--text-mid)', margin: '0 0 1.1rem', position: 'relative',
        }}>
          {sub}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, rgba(232,160,160,0.5), transparent)' }} />
          <Wings size={36} color="var(--rose)" opacity={0.4} />
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, rgba(232,160,160,0.5), transparent)' }} />
        </div>
        <div style={{ textAlign: 'center', marginTop: '0.4rem' }}>
          <MicroMotifs count={6} />
        </div>
      </header>

      {/* ── Content ── */}
      <div style={{ padding: '1.25rem 1.25rem 0' }}>

        {/* ── Today's Routine ── */}
        <RoutineCard />

        {/* ── Check-in (hidden after completing) ── */}
        {!dismissed && (
          <div style={{ marginTop: '1rem' }}>
            {lowEffortOpen ? (
              <LowEffortMode
                onClose={() => setLowEffortOpen(false)}
                onComplete={dismiss}
              />
            ) : (
              <button
                onClick={() => setLowEffortOpen(true)}
                className="pulse-soft"
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #fff5f5 0%, #fff9f9 100%)',
                  border: '1.5px solid rgba(232, 160, 160, 0.4)',
                  borderRadius: '1.25rem',
                  padding: '1rem 1.25rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textAlign: 'left',
                  boxShadow: '0 2px 14px rgba(232,160,160,0.1)',
                }}
              >
                <div>
                  <p style={{ fontFamily: 'Lora, Georgia, serif', fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-dark)', margin: '0 0 0.15rem' }}>
                    How are you doing today?
                  </p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--steel)', margin: 0 }}>
                    Tap to check in — takes two seconds
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.15rem', flexShrink: 0, marginLeft: '0.75rem' }}>
                  <Bow size={18} color="var(--rose)" opacity={0.7} />
                  <Flower2 size={16} strokeWidth={1.5} color="var(--rose)" style={{ opacity: 0.7 }} />
                </div>
              </button>
            )}
          </div>
        )}

        {/* ── Ornate divider ── */}
        <div style={{ margin: '1.4rem 0 1.2rem' }}>
          <OrnateDivider />
        </div>

        {/* ── On my mind ── */}
        <div style={{ marginBottom: '1rem' }}>
          <TaskSection />
        </div>

        <div style={{ margin: '1.2rem 0 1rem' }}>
          <OrnateDivider />
        </div>

        {/* ── Goals entry card ── */}
        <button
          onClick={() => setView('goals')}
          className="card card-accent"
          style={{
            width: '100%', textAlign: 'left', cursor: 'pointer',
            padding: '1rem 1.25rem', marginBottom: '0.9rem',
            display: 'flex', alignItems: 'center', gap: '0.85rem',
            background: 'linear-gradient(135deg, rgba(244,194,194,0.13) 0%, rgba(253,240,240,0.6) 100%)',
            border: '1.5px solid rgba(232,160,160,0.28)',
            borderRadius: '1.25rem', boxShadow: '0 2px 14px rgba(232,160,160,0.1)',
          }}
        >
          <div style={{
            width: '2.4rem', height: '2.4rem', borderRadius: '0.75rem',
            background: 'linear-gradient(135deg, var(--rose), rgba(244,194,194,0.6))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Target size={15} strokeWidth={1.75} color="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-dark)', margin: '0 0 0.15rem' }}>Goals</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--steel)', margin: 0 }}>Net worth, steps, weight, cooking & more</p>
          </div>
          <MicroMotifs count={3} />
        </button>

        {/* ── Sleep card ── */}
        <SleepCard onGoToBody={onGoToBody} />

        {/* ── Coming soon cards ── */}
        <HomeBudgetCard onGoToMoney={onGoToMoney} />

        <div className="card card-accent" style={{
          padding: '1rem 1.25rem', marginBottom: '1.25rem',
          display: 'flex', alignItems: 'center', gap: '0.85rem',
        }}>
          <div style={{
            width: '2.4rem', height: '2.4rem', borderRadius: '0.75rem',
            background: 'linear-gradient(135deg, var(--pink), var(--base))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <BookOpen size={16} strokeWidth={1.5} color="var(--rose)" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-dark)', margin: '0 0 0.15rem' }}>Currently reading</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--steel)', margin: 0 }}>Add a book from your Read tab</p>
          </div>
          <MicroMotifs count={3} />
        </div>

        {/* ── I need a moment ── */}
        {showDBT && <DBTSkillFlow onClose={() => setShowDBT(false)} />}
        <div style={{ textAlign: 'center', margin: '0.5rem 0 0.25rem' }}>
          <button
            onClick={() => setShowDBT(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem 1.5rem' }}
          >
            <div style={{ fontSize: '1.1rem', color: 'var(--rose)', opacity: 0.5, marginBottom: '0.2rem' }}>✦</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--steel)', letterSpacing: '0.04em' }}>I need a moment</div>
          </button>
        </div>

        {/* ── Footer ── */}
        <div style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
          <Bow size={20} color="var(--rose)" opacity={0.3} />
          <div style={{ marginTop: '0.3rem' }}>
            <MicroMotifs count={5} />
          </div>
        </div>

      </div>
    </div>
  )
}
