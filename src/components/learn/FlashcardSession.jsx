import { useState } from 'react'
import FlashCard from './FlashCard'
import { MicroMotifs } from '../Decorations'

export default function FlashcardSession({ sessionCards, reversed, onNext, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const total = sessionCards.length
  const card  = sessionCards[currentIndex]
  const done  = currentIndex >= total

  function handleNext(cardId, rating) {
    onNext(cardId, rating)
    setCurrentIndex(i => i + 1)
  }

  // ── Completion ───────────────────────────────────────────────
  if (done) {
    return (
      <div style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✦</div>
        <h2 className="serif" style={{ fontSize: '1.5rem', color: 'var(--text-dark)', margin: '0 0 0.5rem' }}>
          Session complete
        </h2>
        <p style={{ color: 'var(--steel)', fontSize: '0.88rem', margin: '0 0 0.35rem' }}>
          {total} {total === 1 ? 'card' : 'cards'} reviewed
        </p>
        <p style={{ color: 'var(--steel)', fontSize: '0.78rem', fontStyle: 'italic', margin: '0 0 2rem' }}>
          That counts. The loop is closed.
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

  // ── Session ──────────────────────────────────────────────────
  return (
    <div style={{ padding: '1rem 1.1rem' }}>

      {/* Progress */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--steel)' }}>
            {currentIndex + 1} of {total}
          </span>
          <MicroMotifs count={3} />
        </div>
        <div style={{ height: '3px', background: 'var(--pink)', borderRadius: '2px', overflow: 'hidden' }}>
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
      <FlashCard
        card={card}
        reversed={reversed}
        onNext={handleNext}
      />

      {/* Quit */}
      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <button
          onClick={onComplete}
          style={{
            background: 'none', border: 'none',
            fontSize: '0.75rem', color: 'var(--steel)',
            cursor: 'pointer', textDecoration: 'underline',
          }}
        >
          End session early
        </button>
      </div>
    </div>
  )
}
