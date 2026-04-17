import { useState } from 'react'
import { useHomeTasks } from '../../hooks/useHomeTasks'
import AddTaskModal from './AddTaskModal'
import CompleteTaskModal from './CompleteTaskModal'

const PREVIEW_COUNT = 3

function formatDeadline(deadline) {
  if (!deadline?.date) return null
  const d    = new Date(deadline.date + 'T12:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diff = Math.round((d - today) / 86400000)

  if (diff < 0)  return 'Overdue'
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function TaskRow({ task, onComplete }) {
  const [completing, setCompleting] = useState(false)
  const label    = formatDeadline(task.deadline)
  const isHard   = task.deadline?.type === 'hard'
  const overdue  = label === 'Overdue'
  const isWantTo = task.type === 'want-to'

  return (
    <>
      {completing && (
        <CompleteTaskModal
          task={task}
          onComplete={(reflection) => { onComplete(task.id, reflection); setCompleting(false) }}
          onClose={() => setCompleting(false)}
        />
      )}

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.65rem',
        padding: '0.65rem 0',
        borderBottom: '1px solid rgba(232,160,160,0.08)',
      }}>
        {/* Complete circle */}
        <button
          onClick={() => setCompleting(true)}
          style={{
            width: '1.2rem', height: '1.2rem',
            borderRadius: isWantTo ? '3px' : '50%',
            border: `1.5px solid ${isWantTo ? 'rgba(232,160,160,0.35)' : 'rgba(232,160,160,0.4)'}`,
            background: 'transparent',
            flexShrink: 0,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.55rem',
            color: 'rgba(232,160,160,0.5)',
            transition: 'all 0.2s ease',
          }}
        >
          {isWantTo ? '✦' : ''}
        </button>

        {/* Title */}
        <p style={{
          flex: 1,
          fontSize: isWantTo ? '0.83rem' : '0.85rem',
          fontFamily: isWantTo ? 'Lora, Georgia, serif' : 'inherit',
          fontStyle: isWantTo ? 'italic' : 'normal',
          color: isWantTo ? 'var(--text-mid)' : 'var(--text-dark)',
          margin: 0,
          lineHeight: 1.35,
        }}>
          {task.title}
        </p>

        {/* Deadline */}
        {label && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
            {isHard && (
              <span style={{
                width: '0.35rem', height: '0.35rem',
                borderRadius: '50%',
                background: overdue ? 'rgba(232,130,130,0.8)' : 'var(--rose)',
                display: 'inline-block', flexShrink: 0,
              }} />
            )}
            <span style={{
              fontSize: '0.7rem',
              color: overdue ? 'var(--rose)' : isHard ? 'var(--rose)' : 'var(--steel)',
              opacity: overdue ? 1 : isHard ? 0.85 : 0.75,
              fontStyle: 'italic',
            }}>
              {label}
            </span>
          </div>
        )}
      </div>
    </>
  )
}

export default function TaskSection() {
  const { active, addTask, completeTask } = useHomeTasks()
  const [showAdd, setShowAdd]     = useState(false)
  const [showAll, setShowAll]     = useState(false)

  const preview  = active.slice(0, PREVIEW_COUNT)
  const overflow = active.length - PREVIEW_COUNT
  const displayed = showAll ? active : preview

  return (
    <>
      {showAdd && (
        <AddTaskModal
          onSave={addTask}
          onClose={() => setShowAdd(false)}
        />
      )}

      <div className="card" style={{ border: '1px solid rgba(232,160,160,0.18)', padding: '0.85rem 1rem 0.6rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: active.length > 0 ? '0.1rem' : '0' }}>
          <p style={{
            fontFamily: 'Lora, Georgia, serif',
            fontSize: '0.92rem',
            fontWeight: 600,
            color: 'var(--text-dark)',
            margin: 0,
          }}>
            On my mind
          </p>
          <button
            onClick={() => setShowAdd(true)}
            style={{
              width: '1.7rem', height: '1.7rem',
              borderRadius: '50%',
              background: 'rgba(232,160,160,0.12)',
              border: '1px solid rgba(232,160,160,0.28)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '0.75rem',
              color: 'var(--rose)',
              flexShrink: 0,
            }}
          >
            ✦
          </button>
        </div>

        {/* Empty state */}
        {active.length === 0 && (
          <p style={{
            fontSize: '0.75rem',
            fontStyle: 'italic',
            fontFamily: 'Lora, Georgia, serif',
            color: 'var(--steel)',
            margin: '0.5rem 0 0.25rem',
            opacity: 0.7,
          }}>
            Nothing here yet. Tap ✦ to add.
          </p>
        )}

        {/* Task rows */}
        {displayed.map(task => (
          <TaskRow key={task.id} task={task} onComplete={completeTask} />
        ))}

        {/* See all / show less */}
        {overflow > 0 && (
          <button
            onClick={() => setShowAll(s => !s)}
            style={{
              background: 'none',
              border: 'none',
              padding: '0.5rem 0 0.15rem',
              fontSize: '0.72rem',
              color: 'var(--rose)',
              cursor: 'pointer',
              fontStyle: 'italic',
            }}
          >
            {showAll ? 'Show less' : `See all · ${overflow} more`}
          </button>
        )}
      </div>
    </>
  )
}
