import { useState } from 'react'
import { createPortal } from 'react-dom'

const TYPES = [
  { value: 'task',    label: 'Task' },
  { value: 'want-to', label: 'Want to' },
]

export default function AddTaskModal({ onSave, onClose }) {
  const [taskType, setTaskType]       = useState('task')
  const [title, setTitle]             = useState('')
  const [hasDeadline, setHasDeadline] = useState(false)
  const [deadlineDate, setDate]       = useState('')
  const [deadlineType, setType]       = useState('soft')

  const isWantTo = taskType === 'want-to'

  function handleSave() {
    if (!title.trim()) return
    onSave({
      title,
      type: taskType,
      deadline: hasDeadline && deadlineDate
        ? { date: deadlineDate, type: isWantTo ? 'soft' : deadlineType }
        : null,
    })
    onClose()
  }

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(253,240,240,0.65)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '320px',
          background: 'var(--base)',
          borderRadius: '1.4rem',
          boxShadow: '0 12px 48px rgba(232,160,160,0.2)',
          border: '1px solid rgba(232,160,160,0.25)',
          padding: '1.4rem 1.25rem 1.2rem',
        }}
      >
        {/* Type toggle */}
        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem' }}>
          {TYPES.map(t => (
            <button
              key={t.value}
              onClick={() => setTaskType(t.value)}
              style={{
                flex: 1,
                padding: '0.45rem',
                borderRadius: '0.75rem',
                border: `1px solid ${taskType === t.value ? 'var(--rose)' : 'rgba(232,160,160,0.25)'}`,
                background: taskType === t.value ? 'rgba(232,160,160,0.12)' : 'transparent',
                fontSize: '0.78rem',
                fontWeight: 500,
                color: taskType === t.value ? 'var(--rose)' : 'var(--steel)',
                cursor: 'pointer',
              }}
            >
              {t.value === 'want-to' ? '✦ ' : ''}{t.label}
            </button>
          ))}
        </div>

        <p style={{
          fontFamily: 'Lora, Georgia, serif',
          fontSize: '1rem',
          fontWeight: 500,
          color: 'var(--text-dark)',
          margin: '0 0 1rem',
        }}>
          {isWantTo ? 'What do you want to do?' : 'What's on your mind?'}
        </p>

        {/* Title */}
        <input
          autoFocus
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          placeholder={isWantTo ? 'Something you've been meaning to…' : 'Task or intention…'}
          style={{
            width: '100%',
            background: 'rgba(244,194,194,0.08)',
            border: '1px solid rgba(232,160,160,0.25)',
            borderRadius: '0.85rem',
            padding: '0.7rem 0.9rem',
            fontSize: '0.9rem',
            color: 'var(--text-dark)',
            fontFamily: isWantTo ? 'Lora, Georgia, serif' : 'inherit',
            fontStyle: isWantTo ? 'italic' : 'normal',
            outline: 'none',
            boxSizing: 'border-box',
            marginBottom: '0.85rem',
          }}
        />

        {/* Deadline toggle */}
        <button
          onClick={() => setHasDeadline(d => !d)}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            fontSize: '0.75rem',
            color: hasDeadline ? 'var(--rose)' : 'var(--steel)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            marginBottom: hasDeadline ? '0.75rem' : '1rem',
          }}
        >
          <span style={{
            display: 'inline-block',
            width: '0.9rem', height: '0.9rem',
            borderRadius: '50%',
            border: `1.5px solid ${hasDeadline ? 'var(--rose)' : 'rgba(232,160,160,0.4)'}`,
            background: hasDeadline ? 'var(--rose)' : 'transparent',
          }} />
          {isWantTo ? 'Add a soft date' : 'Add deadline'}
        </button>

        {hasDeadline && (
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="date"
              value={deadlineDate}
              onChange={e => setDate(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(244,194,194,0.08)',
                border: '1px solid rgba(232,160,160,0.25)',
                borderRadius: '0.75rem',
                padding: '0.55rem 0.85rem',
                fontSize: '0.85rem',
                color: 'var(--text-dark)',
                outline: 'none',
                boxSizing: 'border-box',
                marginBottom: isWantTo ? 0 : '0.6rem',
              }}
            />
            {/* Soft / Hard toggle — tasks only */}
            {!isWantTo && (
              <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.6rem' }}>
                {['soft', 'hard'].map(type => (
                  <button
                    key={type}
                    onClick={() => setType(type)}
                    style={{
                      flex: 1,
                      padding: '0.4rem',
                      borderRadius: '0.65rem',
                      border: `1px solid ${deadlineType === type ? 'var(--rose)' : 'rgba(232,160,160,0.25)'}`,
                      background: deadlineType === type ? 'rgba(232,160,160,0.12)' : 'transparent',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: deadlineType === type ? 'var(--rose)' : 'var(--steel)',
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '0.6rem',
              background: 'transparent',
              border: '1px solid rgba(232,160,160,0.25)',
              borderRadius: '0.85rem',
              fontSize: '0.82rem',
              color: 'var(--steel)',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            style={{
              flex: 2,
              padding: '0.6rem',
              background: title.trim() ? 'var(--rose)' : 'rgba(232,160,160,0.2)',
              border: 'none',
              borderRadius: '0.85rem',
              fontSize: '0.82rem',
              fontWeight: 500,
              color: title.trim() ? '#fff' : 'var(--steel)',
              cursor: title.trim() ? 'pointer' : 'default',
            }}
          >
            Add ✦
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
