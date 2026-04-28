import { useState } from 'react'
import { BookOpen } from 'lucide-react'
import { ROUTINES } from '../data/mindData'
import { useRoutineCompletions, useCheckinHistory, useIdentityStatements } from '../hooks/useMindData'
import MindRoutineCard from '../components/mind/MindRoutineCard'
import WeeklyCheckin from '../components/mind/WeeklyCheckin'
import IdentityPage from '../components/mind/IdentityPage'
import MoodTracker from '../components/mind/MoodTracker'
import DBTTimeline from '../components/mind/DBTTimeline'
import { OrnateDivider, Bow, Wings, MicroMotifs } from '../components/Decorations'

// ── Week grid ────────────────────────────────────
// Shows Mon–Sun dots indicating routine completions
function WeekGrid() {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    const completions = JSON.parse(localStorage.getItem(`mind:completions:${key}`) || '{}')
    const count = Object.values(completions).filter(Boolean).length
    days.push({
      label: d.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 1),
      date: d.getDate(),
      count,
      isToday: i === 0,
    })
  }

  return (
    <div style={{ display: 'flex', gap: '0.3rem', justifyContent: 'space-between' }}>
      {days.map((day, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
          <p style={{ fontSize: '0.6rem', color: 'var(--steel)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {day.label}
          </p>
          <div style={{
            width: '1.6rem', height: '1.6rem',
            borderRadius: '50%',
            background: day.count === 3 ? 'var(--rose)'
              : day.count === 2 ? 'rgba(232,160,160,0.5)'
              : day.count === 1 ? 'rgba(232,160,160,0.25)'
              : 'transparent',
            border: day.isToday
              ? '1.5px solid var(--rose)'
              : '1.5px solid rgba(232,160,160,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s ease',
          }}>
            <p style={{
              fontSize: '0.6rem',
              color: day.count >= 2 ? '#fff' : day.count === 1 ? 'var(--rose)' : 'var(--steel)',
              margin: 0,
              fontWeight: 500,
            }}>
              {day.date}
            </p>
          </div>
          {/* Dot indicators for each routine */}
          <div style={{ display: 'flex', gap: '0.1rem' }}>
            {ROUTINES.map((r) => {
              const completions = JSON.parse(localStorage.getItem(`mind:completions:${days[i]?.date && (() => {
                const d2 = new Date(); d2.setDate(d2.getDate() - (6 - i)); return d2.toISOString().slice(0,10)
              })()}`) || '{}')
              return (
                <div key={r.id} style={{
                  width: '0.22rem', height: '0.22rem',
                  borderRadius: '50%',
                  background: completions[r.id] ? 'var(--rose)' : 'rgba(232,160,160,0.2)',
                }} />
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Main tab ─────────────────────────────────────
export default function MindTab() {
  const { done, complete, uncomplete } = useRoutineCompletions()
  const { saveCheckin, lastCheckin, daysSinceLast } = useCheckinHistory()
  const { statements, addStatement } = useIdentityStatements()

  const [view, setView]           = useState('overview') // 'overview' | 'checkin' | 'identity'

  const allDone = ROUTINES.every(r => r.optional || !!done[r.id])

  if (view === 'checkin') {
    return (
      <div className="fade-up">
        <div style={{
          padding: '1.25rem 1.25rem 0.75rem',
          background: 'linear-gradient(160deg, #f9d8d8 0%, #fce8e8 40%, var(--base) 100%)',
          borderBottom: '1px solid rgba(232,160,160,0.15)',
        }}>
          <button onClick={() => setView('overview')} style={{ background:'none', border:'none', fontSize:'0.78rem', color:'var(--steel)', cursor:'pointer', padding:0, marginBottom:'0.5rem' }}>
            ← Back
          </button>
          <h1 style={{ fontFamily:'Lora, Georgia, serif', fontSize:'1.4rem', fontWeight:500, color:'var(--text-dark)', margin:0 }}>
            Weekly check-in <span className="star-accent" style={{ fontSize:'0.85rem' }}>✦</span>
          </h1>
        </div>
        <WeeklyCheckin
          onSave={(entry) => { saveCheckin(entry) }}
          onClose={() => setView('overview')}
        />
      </div>
    )
  }

  if (view === 'identity') {
    return (
      <div className="fade-up">
        <div style={{
          padding: '1.25rem 1.25rem 0.75rem',
          background: 'linear-gradient(160deg, #f9d8d8 0%, #fce8e8 40%, var(--base) 100%)',
          borderBottom: '1px solid rgba(232,160,160,0.15)',
        }}>
        </div>
        <IdentityPage statements={statements} onClose={() => setView('overview')} />
      </div>
    )
  }

  return (
    <div className="fade-up">

      {/* ── Header ── */}
      <header style={{
        position: 'relative',
        padding: '1.75rem 1.25rem 1.25rem',
        background: 'linear-gradient(160deg, #f9d8d8 0%, #fce8e8 40%, var(--base) 100%)',
        borderBottom: '1px solid rgba(232,160,160,0.15)',
        overflow: 'hidden',
      }}>
        <span style={{ position:'absolute', top:'0.7rem', right:'1.2rem', fontSize:'0.7rem', color:'var(--rose)', opacity:0.3, animation:'starShimmer 5s infinite' }}>✦</span>
        <span style={{ position:'absolute', top:'1.5rem', right:'0.5rem', fontSize:'0.4rem', color:'var(--rose)', opacity:0.2 }}>+</span>
        <span style={{ position:'absolute', top:'0.5rem', right:'3rem',   fontSize:'0.35rem', color:'var(--rose)', opacity:0.18 }}>°</span>

        <p style={{ fontSize:'0.72rem', fontWeight:500, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--steel)', margin:'0 0 0.3rem' }}>Mind</p>
        <h1 style={{ fontFamily:'Lora, Georgia, serif', fontSize:'1.6rem', fontWeight:500, color:'var(--text-dark)', margin:'0 0 0.9rem', lineHeight:1.2 }}>
          Your routines <span className="star-accent" style={{ fontSize:'0.9rem' }}>✦</span>
        </h1>

        {/* Week grid */}
        <WeekGrid />

        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginTop:'1rem' }}>
          <div style={{ flex:1, height:'1px', background:'linear-gradient(to right, rgba(232,160,160,0.4), transparent)' }} />
          <Wings size={28} color="var(--rose)" opacity={0.35} />
          <div style={{ flex:1, height:'1px', background:'linear-gradient(to left, rgba(232,160,160,0.4), transparent)' }} />
        </div>
      </header>

      <div style={{ padding: '1.1rem 1.1rem 0' }}>

        {/* ── Today's routines ── */}
        <p style={{ fontSize:'0.7rem', fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', color:'var(--steel)', margin:'0 0 0.65rem' }}>
          Today
        </p>

        {ROUTINES.map(routine => (
          <MindRoutineCard
            key={routine.id}
            routine={routine}
            done={done[routine.id] || false}
            onComplete={complete}
            onUncomplete={uncomplete}
          />
        ))}

        {/* All done quiet signal */}
        {allDone && (
          <div className="check-in" style={{ textAlign:'center', margin:'0.25rem 0 0.85rem' }}>
            <p style={{ fontFamily:'Lora, Georgia, serif', fontSize:'0.82rem', fontStyle:'italic', color:'var(--steel)', margin:0 }}>
              All routines logged. The loop is closed. <span style={{ color:'var(--rose)' }}>✦</span>
            </p>
          </div>
        )}

        {/* ── Mood tracker ── */}
        <MoodTracker />

        <OrnateDivider style={{ margin: '0.25rem 0 1rem' }} />

        {/* ── Weekly check-in ── */}
        <div className="card card-accent" style={{ marginBottom: '0.85rem', overflow:'hidden' }}>
          <div style={{
            padding: '0.9rem 1.1rem',
            background: 'linear-gradient(135deg, #fde8e8 0%, #fdf5f5 100%)',
            borderBottom: '1px solid rgba(232,160,160,0.12)',
            display: 'flex', alignItems:'center', justifyContent:'space-between',
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
              <Bow size={15} color="var(--rose)" opacity={0.65} />
              <p style={{ fontFamily:'Lora, Georgia, serif', fontSize:'0.92rem', fontWeight:600, color:'var(--text-dark)', margin:0 }}>
                Weekly check-in
              </p>
              <MicroMotifs count={2} />
            </div>
          </div>
          <div style={{ padding: '0.85rem 1.1rem' }}>
            <p style={{ fontSize:'0.78rem', fontFamily:'Lora, Georgia, serif', fontStyle:'italic', color:'var(--steel)', margin:'0 0 0.75rem', lineHeight:1.55 }}>
              {lastCheckin
                ? daysSinceLast === 0
                  ? 'You checked in today. ✦'
                  : `Last check-in ${daysSinceLast} day${daysSinceLast === 1 ? '' : 's'} ago.`
                : 'A quiet weekly reflection — what happened, what was hard, what your companion noticed.'}
            </p>
            <button
              onClick={() => setView('checkin')}
              disabled={daysSinceLast === 0}
              style={{
                background: daysSinceLast === 0 ? 'transparent' : 'var(--rose)',
                border: daysSinceLast === 0 ? '1px solid rgba(232,160,160,0.3)' : 'none',
                borderRadius: '0.85rem',
                padding: '0.5rem 1.1rem',
                fontSize: '0.8rem',
                fontWeight: 500,
                color: daysSinceLast === 0 ? 'var(--steel)' : '#fff',
                cursor: daysSinceLast === 0 ? 'default' : 'pointer',
                opacity: daysSinceLast === 0 ? 0.6 : 1,
              }}
            >
              {daysSinceLast === 0 ? 'Done for this week' : 'Start check-in'}
            </button>
          </div>
        </div>

        {/* ── Identity page ── */}
        <button
          onClick={() => setView('identity')}
          className="card"
          style={{
            width: '100%',
            padding: '0.9rem 1.1rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'none',
            border: '1px solid rgba(232,160,160,0.18)',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <div style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
            <BookOpen size={15} strokeWidth={1.5} color="var(--steel)" />
            <div>
              <p style={{ fontFamily:'Lora, Georgia, serif', fontSize:'0.88rem', fontWeight:500, color:'var(--text-dark)', margin:'0 0 0.1rem' }}>
                Who you are
              </p>
              <p style={{ fontSize:'0.7rem', color:'var(--steel)', margin:0, fontStyle:'italic' }}>
                {statements.length === 0
                  ? 'Statements appear here as patterns emerge'
                  : `${statements.length} statement${statements.length === 1 ? '' : 's'}`}
              </p>
            </div>
          </div>
          <span style={{ fontSize:'0.7rem', color:'var(--rose)', opacity:0.6 }}>✦</span>
        </button>

        {/* ── DBT history ── */}
        <div style={{ marginBottom: '1.25rem' }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--steel)', margin: '0 0 0.65rem' }}>
            Skills practiced
          </p>
          <DBTTimeline />
        </div>

        <div style={{ textAlign:'center', marginBottom:'0.75rem' }}>
          <MicroMotifs count={5} />
        </div>
      </div>
    </div>
  )
}
