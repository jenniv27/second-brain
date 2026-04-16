import { useState } from 'react'
import { Check, ChevronDown, ChevronUp, Sun, Coffee, Moon } from 'lucide-react'
import HabitChain from './HabitChain'
import { MicroMotifs } from '../Decorations'

const ROUTINE_ICONS = { morning: Sun, midday: Coffee, evening: Moon }

export default function MindRoutineCard({ routine, done, onToggle }) {
  const [expanded, setExpanded] = useState(false)
  const Icon = ROUTINE_ICONS[routine.id] ?? Sun

  return (
    <div
      className={`card${done ? '' : ' card-accent'}`}
      style={{
        marginBottom: '0.75rem',
        overflow: 'hidden',
        border: done ? '1.5px solid rgba(232,160,160,0.35)' : undefined,
        background: done ? 'linear-gradient(135deg, rgba(244,194,194,0.12) 0%, #fffbfb 100%)' : undefined,
        transition: 'all 0.3s ease',
      }}
    >
      {/* Header row */}
      <div style={{
        padding: '0.85rem 1rem',
        background: done
          ? 'transparent'
          : 'linear-gradient(135deg, #fde8e8 0%, #fdf5f5 100%)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.65rem',
        borderBottom: expanded ? '1px solid rgba(232,160,160,0.12)' : 'none',
      }}>

        {/* Complete toggle */}
        <button
          onClick={() => onToggle(routine.id)}
          style={{
            width: '1.5rem', height: '1.5rem',
            borderRadius: '50%',
            border: done ? '1.5px solid var(--rose)' : '1.5px solid rgba(232,160,160,0.4)',
            background: done ? 'var(--rose)' : 'rgba(244,194,194,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'all 0.25s ease',
          }}
        >
          {done && <Check size={9} strokeWidth={3} color="#fff" />}
        </button>

        {/* Icon + name */}
        <Icon size={14} strokeWidth={1.5} color={done ? 'var(--rose)' : 'var(--steel)'} />
        <div style={{ flex: 1 }}>
          <p style={{
            fontFamily: 'Lora, Georgia, serif',
            fontSize: '0.92rem',
            fontWeight: 600,
            color: done ? 'var(--text-mid)' : 'var(--text-dark)',
            margin: 0,
            textDecoration: done ? 'none' : 'none',
            transition: 'color 0.2s ease',
          }}>
            {routine.name}
            {routine.optional && (
              <span style={{ marginLeft: '0.4rem', fontSize: '0.6rem', color: 'var(--steel)', fontStyle: 'italic', fontWeight: 400 }}>optional</span>
            )}
          </p>
          <p style={{ fontSize: '0.68rem', color: 'var(--steel)', margin: 0 }}>{routine.time}</p>
        </div>

        <MicroMotifs count={2} />

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(e => !e)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.1rem', display: 'flex' }}
        >
          {expanded
            ? <ChevronUp size={13} strokeWidth={1.5} color="var(--steel)" />
            : <ChevronDown size={13} strokeWidth={1.5} color="var(--steel)" />}
        </button>
      </div>

      {/* Habit chain (expanded) */}
      {expanded && (
        <div style={{ padding: '0.85rem 1rem 0.9rem' }}>
          <HabitChain habits={routine.habits} />
          {routine.weekendNote && (
            <p style={{
              marginTop: '0.75rem',
              fontSize: '0.68rem',
              fontStyle: 'italic',
              fontFamily: 'Lora, Georgia, serif',
              color: 'var(--steel)',
              paddingTop: '0.5rem',
              borderTop: '1px solid rgba(232,160,160,0.12)',
            }}>
              ✦ {routine.weekendNote}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
