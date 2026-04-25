import { useState } from 'react'
import { Sun, Moon, ChevronDown, ChevronUp } from 'lucide-react'
import {
  DAILY_SUPPLEMENTS_AM, DAILY_SUPPLEMENTS_PM, AFTERNOON_REMINDERS,
  SKINCARE_AM, SKINCARE_PM, SKINCARE_TO_ADD,
} from '../data/bodyData'
import {
  useChecklist, useExercise, useSleep, useMorningIntention,
} from '../hooks/useBodyData'
import ChecklistSection from '../components/body/ChecklistSection'
import ExerciseLog from '../components/body/ExerciseLog'
import SleepLog from '../components/body/SleepLog'
import WaterModule from '../components/goals/WaterModule'
import { OrnateDivider, MicroMotifs, Bow } from '../components/Decorations'

// ── Reusable section card ──────────────────────
function SectionCard({ title, icon: Icon, defaultOpen = true, children, accent = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div
      className={`card${accent ? ' card-accent' : ''}`}
      style={{ marginBottom: '0.85rem', overflow: 'hidden' }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background: open
            ? 'linear-gradient(135deg, #fde8e8 0%, #fdf5f5 100%)'
            : 'transparent',
          border: 'none',
          width: '100%',
          padding: '0.85rem 1.1rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          textAlign: 'left',
          transition: 'background 0.2s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
          {Icon && <Icon size={15} strokeWidth={1.5} color="var(--rose)" />}
          <span style={{
            fontFamily: 'Lora, Georgia, serif',
            fontSize: '0.92rem',
            fontWeight: 600,
            color: 'var(--text-dark)',
          }}>
            {title}
          </span>
          <MicroMotifs count={3} />
        </div>
        {open
          ? <ChevronUp size={13} strokeWidth={1.5} color="var(--steel)" />
          : <ChevronDown size={13} strokeWidth={1.5} color="var(--steel)" />}
      </button>
      {open && (
        <div style={{ padding: '0.85rem 1.1rem 1rem', borderTop: '1px solid rgba(232,160,160,0.12)' }}>
          {children}
        </div>
      )}
    </div>
  )
}

// ── Session header ─────────────────────────────
function SessionHeader({ session, onSwitch }) {
  const hour = new Date().getHours()
  const isMorning = hour >= 5 && hour < 14

  return (
    <header style={{
      position: 'relative',
      padding: '1.5rem 1.25rem 1.1rem',
      background: 'linear-gradient(160deg, #f9d8d8 0%, #fce8e8 40%, var(--base) 100%)',
      borderBottom: '1px solid rgba(232,160,160,0.15)',
      overflow: 'hidden',
    }}>
      {/* Scatter */}
      <span style={{ position:'absolute', top:'0.6rem', right:'1.2rem', fontSize:'0.7rem', color:'var(--rose)', opacity:0.3, animation:'starShimmer 5s infinite' }}>✦</span>
      <span style={{ position:'absolute', top:'1.4rem', right:'0.5rem', fontSize:'0.4rem', color:'var(--rose)', opacity:0.2 }}>+</span>
      <span style={{ position:'absolute', top:'0.5rem', right:'3rem',   fontSize:'0.35rem', color:'var(--rose)', opacity:0.18 }}>°</span>

      <p style={{ fontSize:'0.72rem', fontWeight:500, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--steel)', margin:'0 0 0.35rem' }}>
        Body
      </p>
      <h1 style={{ fontFamily:'Lora, Georgia, serif', fontSize:'1.6rem', fontWeight:500, color:'var(--text-dark)', margin:'0 0 1rem', lineHeight:1.2 }}>
        {isMorning ? 'Morning session' : 'Evening session'} <span className="star-accent" style={{ fontSize:'0.9rem' }}>✦</span>
      </h1>

      {/* Session toggle */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        background: 'rgba(255,255,255,0.6)',
        borderRadius: '1rem',
        padding: '0.25rem',
        border: '1px solid rgba(232,160,160,0.2)',
        width: 'fit-content',
      }}>
        {[
          { key: 'morning', label: 'Morning', Icon: Sun },
          { key: 'evening', label: 'Evening', Icon: Moon },
        ].map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => onSwitch(key)}
            style={{
              background: session === key ? 'var(--rose)' : 'transparent',
              border: 'none',
              borderRadius: '0.75rem',
              padding: '0.4rem 0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'background 0.2s ease',
            }}
          >
            <Icon size={13} strokeWidth={1.5} color={session === key ? '#fff' : 'var(--steel)'} />
            <span style={{
              fontSize: '0.78rem',
              fontWeight: 500,
              color: session === key ? '#fff' : 'var(--steel)',
            }}>
              {label}
            </span>
          </button>
        ))}
      </div>

      {/* Wings divider */}
      <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginTop:'1rem' }}>
        <div style={{ flex:1, height:'1px', background:'linear-gradient(to right, rgba(232,160,160,0.4), transparent)' }} />
        <Bow size={14} color="var(--rose)" opacity={0.4} />
        <div style={{ flex:1, height:'1px', background:'linear-gradient(to left, rgba(232,160,160,0.4), transparent)' }} />
      </div>
    </header>
  )
}

// ── Morning session ────────────────────────────
function MorningSession() {
  const { checked: suppChecked,  toggle: toggleSupp  } = useChecklist('supp')
  const { checked: skinChecked,  toggle: toggleSkin  } = useChecklist('skin-am')
  const { sleep,  setSleep  } = useSleep()
  const { intention, setIntention } = useMorningIntention()

  return (
    <div style={{ padding: '1rem 1.1rem 0' }}>

      {/* Morning supplements */}
      <SectionCard title="Morning supplements" accent>
        <ChecklistSection
          items={DAILY_SUPPLEMENTS_AM}
          checked={suppChecked}
          onToggle={toggleSupp}
          dim
        />
      </SectionCard>

      {/* Skincare AM */}
      <SectionCard title="Skincare AM" accent>
        <ChecklistSection
          items={SKINCARE_AM}
          checked={skinChecked}
          onToggle={toggleSkin}
          dim
        />
      </SectionCard>

      {/* Hydration */}
      <SectionCard title="Hydration" accent>
        <WaterModule />
      </SectionCard>

      {/* Wake time + feel */}
      <SectionCard title="Sleep last night" defaultOpen={!sleep.wakeTime}>
        <SleepLog sleep={sleep} onUpdate={setSleep} showWakeTime />
      </SectionCard>

      {/* Morning intention */}
      <div className="card" style={{ padding: '1rem 1.1rem', marginBottom: '0.85rem' }}>
        <p style={{ fontSize:'0.72rem', fontWeight:500, color:'var(--steel)', letterSpacing:'0.05em', textTransform:'uppercase', margin:'0 0 0.5rem' }}>
          Morning intention <span style={{ color:'var(--rose)', opacity:0.5, fontSize:'0.55rem' }}>optional</span>
        </p>
        <textarea
          placeholder="No pressure. Just a word or two if anything comes."
          value={intention}
          onChange={e => setIntention(e.target.value)}
          rows={2}
          style={{
            width: '100%',
            background: 'var(--base)',
            border: '1px solid rgba(232,160,160,0.2)',
            borderRadius: '0.75rem',
            padding: '0.6rem 0.8rem',
            fontSize: '0.875rem',
            color: 'var(--text-dark)',
            fontFamily: 'Lora, Georgia, serif',
            fontStyle: 'italic',
            resize: 'none',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <OrnateDivider style={{ margin: '1rem 0 0.5rem' }} />

      {/* Afternoon reminders */}
      <SectionCard title="Afternoon reminders" defaultOpen={false}>
        <ChecklistSection
          items={AFTERNOON_REMINDERS}
          checked={suppChecked}
          onToggle={toggleSupp}
        />
      </SectionCard>

      <div style={{ textAlign:'center', marginBottom:'0.75rem' }}>
        <MicroMotifs count={5} />
      </div>
    </div>
  )
}

// ── Evening session ────────────────────────────
function EveningSession() {
  const { checked: suppChecked, toggle: toggleSupp } = useChecklist('supp')
  const { checked: skinChecked, toggle: toggleSkin } = useChecklist('skin-pm')
  const { exercise, setExercise } = useExercise()
  const { sleep, setSleep } = useSleep()
  const [showToAdd, setShowToAdd] = useState(false)

  return (
    <div style={{ padding: '1rem 1.1rem 0' }}>

      {/* Exercise */}
      <SectionCard title="Exercise" accent>
        <ExerciseLog exercise={exercise} onUpdate={setExercise} />
      </SectionCard>

      {/* Evening supplements */}
      <SectionCard title="Supplements" accent>
        <ChecklistSection
          items={DAILY_SUPPLEMENTS_PM}
          checked={suppChecked}
          onToggle={toggleSupp}
          dim
        />
      </SectionCard>

      {/* Skincare PM */}
      <SectionCard title="Skincare PM" accent>
        <ChecklistSection
          items={SKINCARE_PM}
          checked={skinChecked}
          onToggle={toggleSkin}
          dim
        />

        {/* To Add Consistently — collapsible secondary list */}
        <div style={{ marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(232,160,160,0.12)' }}>
          <button
            onClick={() => setShowToAdd(o => !o)}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              marginBottom: showToAdd ? '0.65rem' : 0,
            }}
          >
            <span style={{ fontSize:'0.7rem', fontWeight:600, letterSpacing:'0.05em', textTransform:'uppercase', color:'var(--steel)' }}>
              Building into routine
            </span>
            {showToAdd
              ? <ChevronUp size={11} strokeWidth={1.5} color="var(--steel)" />
              : <ChevronDown size={11} strokeWidth={1.5} color="var(--steel)" />}
          </button>
          {showToAdd && (
            <ChecklistSection
              items={SKINCARE_TO_ADD}
              checked={skinChecked}
              onToggle={toggleSkin}
              dim
            />
          )}
        </div>
      </SectionCard>

      {/* Sleep log */}
      <SectionCard title="Bedtime" defaultOpen={!sleep.bedtime}>
        <SleepLog sleep={sleep} onUpdate={setSleep} showWakeTime={false} />
      </SectionCard>

      {/* Companion placeholder */}
      <div className="card" style={{ padding: '1rem 1.1rem', marginBottom: '0.85rem' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.35rem' }}>
          <Bow size={14} color="var(--rose)" opacity={0.6} />
          <p style={{ fontFamily:'Lora, Georgia, serif', fontSize:'0.92rem', fontWeight:600, color:'var(--text-dark)', margin:0 }}>
            Evening check-in
          </p>
        </div>
        <p style={{ fontSize:'0.78rem', fontFamily:'Lora, Georgia, serif', fontStyle:'italic', color:'var(--steel)', margin:0 }}>
          Your companion check-in is coming soon. It will read everything you logged today and respond to that.
        </p>
      </div>

      <OrnateDivider style={{ margin: '0.5rem 0' }} />
      <div style={{ textAlign:'center', marginBottom:'0.75rem' }}>
        <MicroMotifs count={5} />
      </div>
    </div>
  )
}

// ── Main ───────────────────────────────────────
export default function BodyTab() {
  const hour = new Date().getHours()
  const [session, setSession] = useState(hour >= 5 && hour < 14 ? 'morning' : 'evening')

  return (
    <div className="fade-up">
      <SessionHeader session={session} onSwitch={setSession} />
      {session === 'morning' ? <MorningSession /> : <EveningSession />}
    </div>
  )
}
