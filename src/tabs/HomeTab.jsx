import { useState } from 'react'
import { Wallet, BookOpen, Flower2 } from 'lucide-react'
import LowEffortMode from '../components/LowEffortMode'
import RoutineCard from '../components/RoutineCard'
import TaskSection from '../components/home/TaskSection'
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

export default function HomeTab() {
  const [lowEffortOpen, setLowEffortOpen] = useState(false)
  const { dismissed, dismiss }            = useCheckinDismissal()
  const { text, sub } = getGreeting()
  const dateStr = formatDate()

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

        {/* ── Coming soon cards ── */}
        <div className="card card-accent" style={{
          padding: '1rem 1.25rem', marginBottom: '0.9rem',
          display: 'flex', alignItems: 'center', gap: '0.85rem',
        }}>
          <div style={{
            width: '2.4rem', height: '2.4rem', borderRadius: '0.75rem',
            background: 'linear-gradient(135deg, var(--pink), var(--base))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Wallet size={16} strokeWidth={1.5} color="var(--rose)" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-dark)', margin: '0 0 0.15rem' }}>Budget snapshot</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--steel)', margin: 0 }}>Coming soon from your Money tab</p>
          </div>
          <MicroMotifs count={3} />
        </div>

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
