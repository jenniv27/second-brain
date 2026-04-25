import { useState } from 'react'
import FlashCard from './FlashCard'
import { MicroMotifs } from '../Decorations'

export default function FlashcardSession({ dueCards, onRate, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [reviewed, setReviewed] = useState(0)

  const total = dueCards.length
  const card  = dueCards[currentIndex]
  const done  = currentIndex >= total

  function handleRate(cardId, quality) {
    onRate(cardId, quality)
    setReviewed(r => r + 1)
    setCurrentIndex(i => i + 1)
  }

  // ── Completion screen ──────────────────────────────────────────
  if (done) {
    return (
      <div style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✦</div>
        <h2 className="serif" style={{ fontSize: '1.5rem', color: 'var(--text-dark)', margin: '0 0 0.5rem' }}>
          Session complete
        </h2>
        <p style={{ color: 'var(--steel)', fontSize: '0.88rem', margin: '0 0 0.35rem' }}>
          {reviewed} {reviewed === 1 ? 'card' : 'cards'} reviewed
        </p>
        <p style={{ color: 'var(--steel)', fontSize: '0.78rem', fontStyle: 'italic', margin: '0 0 2rem' }}>
          That counts. The review is closed.
        </p>
        <button
          onClick={onComplete}
          style={{
            background: 'var(--pink)',
            border: 'none',
            borderRadius: '2rem',
            padding: '0.7rem 2rem',
            fontSize: '0.88rem',
            color: 'var(--text-dark)',
            cursor: 'pointer',
            fontWeight: 500,
          }}
        >
          Done
        </button>
      </div>
    )
  }

  const progress = currentIndex / total

  // ── Active session ─────────────────────────────────────────────
  return (
    <div style={{ padding: '1rem 1.1rem' }}>

      {/* Progress bar */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--steel)' }}>
            {currentIndex + 1} of {total}
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--steel)' }}>
            <MicroMotifs count={3} />
          </span>
        </div>
        <div style={{
          height: '3px',
          background: 'var(--pink)',
          borderRadius: '2px',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${progress * 100}%`,
            background: 'var(--rose)',
            borderRadius: '2px',
            transition: 'width 0.3s ease',
          }} />
        </div>
      </div>

      {/* Card */}
      <FlashCard card={card} onRate={handleRate} />

      {/* Quit */}
      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <button
          onClick={onComplete}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '0.75rem',
            color: 'var(--steel)',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          End session early
        </button>
      </div>
    </div>
  )
}
