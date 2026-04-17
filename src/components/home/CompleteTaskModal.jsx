import { useState, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { REFLECTION_QUESTIONS } from '../../hooks/useHomeTasks'
import { MicroMotifs } from '../Decorations'

export default function CompleteTaskModal({ task, onComplete, onClose }) {
  const [reflection, setReflection] = useState('')

  // Pick a question deterministically based on task id so it doesn't shift on re-render
  const question = useMemo(() => {
    const idx = task.id.split('').reduce((s, c) => s + c.charCodeAt(0), 0)
    return REFLECTION_QUESTIONS[idx % REFLECTION_QUESTIONS.length]
  }, [task.id])

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
          maxWidth: '300px',
          background: 'var(--base)',
          borderRadius: '1.4rem',
          boxShadow: '0 12px 48px rgba(232,160,160,0.2)',
          border: '1px solid rgba(232,160,160,0.25)',
          padding: '1.4rem 1.25rem 1.2rem',
        }}
      >
        {/* Task name */}
        <p style={{
          fontSize: '0.72rem',
          fontWeight: 600,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          color: 'var(--steel)',
          margin: '0 0 0.25rem',
        }}>
          Done
        </p>
        <p style={{
          fontFamily: 'Lora, Georgia, serif',
          fontSize: '0.95rem',
          fontWeight: 500,
          color: 'var(--text-dark)',
          margin: '0 0 0.9rem',
          lineHeight: 1.4,
        }}>
          {task.title}
        </p>

        <div style={{ textAlign: 'center', margin: '0 0 0.85rem' }}>
          <MicroMotifs count={4} />
        </div>

        {/* Reflection question */}
        <p style={{
          fontFamily: 'Lora, Georgia, serif',
          fontSize: '0.85rem',
          fontStyle: 'italic',
          color: 'var(--text-mid)',
          margin: '0 0 0.6rem',
          lineHeight: 1.5,
        }}>
          {question}
        </p>

        <textarea
          autoFocus
          value={reflection}
          onChange={e => setReflection(e.target.value)}
          placeholder="Optional…"
          rows={3}
          style={{
            width: '100%',
            background: 'rgba(244,194,194,0.08)',
            border: '1px solid rgba(232,160,160,0.2)',
            borderRadius: '0.75rem',
            padding: '0.6rem 0.8rem',
            fontSize: '0.82rem',
            color: 'var(--text-dark)',
            fontFamily: 'Lora, Georgia, serif',
            fontStyle: 'italic',
            resize: 'none',
            outline: 'none',
            lineHeight: 1.5,
            boxSizing: 'border-box',
            marginBottom: '0.85rem',
          }}
        />

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => onComplete(null)}
            style={{
              flex: 1,
              padding: '0.6rem',
              background: 'transparent',
              border: '1px solid rgba(232,160,160,0.25)',
              borderRadius: '0.85rem',
              fontSize: '0.8rem',
              color: 'var(--steel)',
              cursor: 'pointer',
            }}
          >
            Skip
          </button>
          <button
            onClick={() => onComplete(reflection.trim() || null)}
            style={{
              flex: 2,
              padding: '0.6rem',
              background: 'var(--rose)',
              border: 'none',
              borderRadius: '0.85rem',
              fontSize: '0.8rem',
              fontWeight: 500,
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            Done ✦
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
