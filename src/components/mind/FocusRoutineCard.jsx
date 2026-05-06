import { useState } from 'react'
import { Check, Sun, Coffee, Moon } from 'lucide-react'
import QualityModal from './QualityModal'

const ICONS = { morning: Sun, midday: Coffee, evening: Moon }

export default function FocusRoutineCard({ routine, checks, onToggle, onComplete }) {
  const [showQuality, setShowQuality] = useState(false)
  const Icon = ICONS[routine.id] ?? Sun

  const total        = routine.habits.length
  const checkedCount = routine.habits.filter(h => checks[`${routine.id}:${h.id}`]).length
  const allChecked   = checkedCount === total && total > 0

  function handleToggle(habitId) {
    onToggle(routine.id, habitId)
  }

  function handleCompleteBtn() {
    if (allChecked) {
      onComplete(routine.id, 'fully')
    } else {
      setShowQuality(true)
    }
  }

  return (
    <>
      {showQuality && (
        <QualityModal
          routineName={routine.name}
          onSelect={q => { onComplete(routine.id, q); setShowQuality(false) }}
          onDismiss={() => setShowQuality(false)}
        />
      )}

      <div className="card card-accent" style={{ marginBottom: '1rem', overflow: 'hidden' }}>
        {/* Card header */}
        <div style={{
          padding: '0.85rem 1rem',
          background: 'linear-gradient(135deg, #fde8e8 0%, #fdf5f5 100%)',
          borderBottom: '1px solid rgba(232,160,160,0.12)',
          display: 'flex', alignItems: 'center', gap: '0.6rem',
        }}>
          <Icon size={14} strokeWidth={1.5} color="var(--rose)" />
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: 'Lora, Georgia, serif', fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-dark)', margin: 0 }}>
              {routine.name}
              {routine.optional && (
                <span style={{ marginLeft: '0.35rem', fontSize: '0.6rem', color: 'var(--steel)', fontStyle: 'italic', fontWeight: 400 }}>optional</span>
              )}
            </p>
            <p style={{ fontSize: '0.68rem', color: 'var(--steel)', margin: 0 }}>{routine.time}</p>
          </div>
          {/* Progress pill */}
          <span style={{
            padding: '0.18rem 0.55rem',
            background: checkedCount > 0 ? 'rgba(232,160,160,0.15)' : 'transparent',
            border: '1px solid rgba(232,160,160,0.25)',
            borderRadius: '2rem',
            fontSize: '0.65rem',
            fontWeight: 700,
            color: checkedCount > 0 ? 'var(--rose)' : 'var(--steel)',
            transition: 'all 0.2s',
          }}>
            {checkedCount}/{total}
          </span>
        </div>

        {/* Habit list */}
        <div style={{ padding: '0.3rem 1rem 0' }}>
          {routine.habits.map((habit, i) => {
            const checked = !!checks[`${routine.id}:${habit.id}`]
            return (
              <button
                key={habit.id}
                onClick={() => handleToggle(habit.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.65rem',
                  background: 'none',
                  border: 'none',
                  borderBottom: i < routine.habits.length - 1
                    ? '1px solid rgba(232,160,160,0.08)'
                    : 'none',
                  padding: '0.55rem 0',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                {/* Square checkbox */}
                <div style={{
                  width: '1.15rem', height: '1.15rem',
                  borderRadius: '0.28rem',
                  border: checked
                    ? '1.5px solid var(--rose)'
                    : '1.5px solid rgba(232,160,160,0.38)',
                  background: checked ? 'var(--rose)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '0.12rem',
                  transition: 'all 0.15s ease',
                }}>
                  {checked && <Check size={7} strokeWidth={3.5} color="#fff" />}
                </div>

                {/* Label + metadata */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  {habit.anchor && (
                    <p style={{
                      fontSize: '0.6rem', fontStyle: 'italic',
                      fontFamily: 'Lora, Georgia, serif',
                      color: 'var(--steel)', margin: '0 0 0.06rem',
                      lineHeight: 1.3, opacity: 0.75,
                    }}>
                      {habit.anchor}
                    </p>
                  )}
                  <p style={{
                    fontSize: '0.85rem',
                    color: checked ? 'var(--steel)' : 'var(--text-dark)',
                    margin: 0, lineHeight: 1.35,
                    textDecoration: checked ? 'line-through' : 'none',
                    opacity: checked ? 0.55 : 1,
                    transition: 'all 0.15s',
                  }}>
                    {habit.label}
                  </p>
                  {habit.detail && !checked && (
                    <p style={{
                      fontSize: '0.62rem', color: 'var(--steel)',
                      margin: '0.05rem 0 0', lineHeight: 1.3,
                    }}>
                      {habit.detail}
                    </p>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Complete button */}
        <div style={{ padding: '0.75rem 1rem 0.9rem', borderTop: '1px solid rgba(232,160,160,0.1)', marginTop: '0.1rem' }}>
          <button
            onClick={handleCompleteBtn}
            style={{
              width: '100%',
              padding: '0.65rem',
              background: allChecked
                ? 'linear-gradient(135deg, var(--rose) 0%, rgba(232,160,160,0.8) 100%)'
                : 'rgba(232,160,160,0.07)',
              border: allChecked ? 'none' : '1px solid rgba(232,160,160,0.25)',
              borderRadius: '0.85rem',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: allChecked ? '#fff' : 'var(--steel)',
              cursor: 'pointer',
              letterSpacing: '0.02em',
              boxShadow: allChecked ? '0 3px 12px rgba(232,160,160,0.3)' : 'none',
              transition: 'all 0.25s ease',
            }}
          >
            {allChecked ? 'All done — complete ✦' : checkedCount > 0 ? 'Mark complete anyway' : 'Mark complete'}
          </button>
        </div>
      </div>
    </>
  )
}
