import { useState, useEffect } from 'react'
import { MicroMotifs } from '../Decorations'

async function fetchCulturalContext(word, definition) {
  const res = await fetch('/api/cultural-context', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ word, definition }),
  })
  if (!res.ok) throw new Error('Failed to fetch context')
  const data = await res.json()
  return data.context
}

export default function FlashCard({ card, onRate }) {
  const [flipped, setFlipped] = useState(false)
  const [context, setContext] = useState(card.culturalContext ?? null)
  const [contextLoading, setContextLoading] = useState(false)
  const [rated, setRated] = useState(false)

  // Reset state when card changes
  useEffect(() => {
    setFlipped(false)
    setRated(false)
    setContext(card.culturalContext ?? null)
  }, [card.id])

  async function handleFlip() {
    if (rated) return
    setFlipped(true)
    if (!context) {
      setContextLoading(true)
      try {
        const ctx = await fetchCulturalContext(card.front, card.back)
        setContext(ctx)
      } catch {
        setContext('Cultural context unavailable right now.')
      } finally {
        setContextLoading(false)
      }
    }
  }

  function handleRate(quality) {
    if (rated) return
    setRated(true)
    setTimeout(() => onRate(card.id, quality), 300)
  }

  const RATINGS = [
    { label: 'Again', quality: 1, color: '#E8A0A0', bg: 'rgba(232,160,160,0.12)' },
    { label: 'Good',  quality: 4, color: '#8C9BAB', bg: 'rgba(140,155,171,0.10)' },
    { label: 'Easy',  quality: 5, color: '#9BBBA8', bg: 'rgba(155,187,168,0.12)' },
  ]

  return (
    <div style={{ width: '100%' }}>

      {/* ── Card ── */}
      <div
        onClick={!flipped ? handleFlip : undefined}
        style={{
          perspective: '1000px',
          cursor: flipped ? 'default' : 'pointer',
          marginBottom: '1.25rem',
        }}
      >
        <div style={{
          position: 'relative',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.45s ease',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          minHeight: '260px',
        }}>

          {/* Front */}
          <div style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(160deg, #fde8e8 0%, #fdf5f5 100%)',
            borderRadius: '1.25rem',
            border: '1.5px solid rgba(232,160,160,0.25)',
            boxShadow: '0 4px 20px rgba(232,160,160,0.12)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            gap: '0.75rem',
          }}>
            <MicroMotifs count={3} />
            <p style={{
              fontFamily: 'Lora, Georgia, serif',
              fontSize: '2.8rem',
              fontWeight: 700,
              color: 'var(--text-dark)',
              margin: 0,
              lineHeight: 1.2,
              textAlign: 'center',
            }}>
              {card.front}
            </p>
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.75rem', color: 'var(--steel)' }}>
              tap to reveal
            </p>
            <MicroMotifs count={3} />
          </div>

          {/* Back */}
          <div style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            position: 'absolute',
            inset: 0,
            background: 'white',
            borderRadius: '1.25rem',
            border: '1.5px solid rgba(140,155,171,0.2)',
            boxShadow: '0 4px 20px rgba(140,155,171,0.08)',
            padding: '1.25rem',
            overflowY: 'auto',
          }}>
            {/* Word */}
            <p style={{
              fontFamily: 'Lora, Georgia, serif',
              fontSize: '1.6rem',
              fontWeight: 700,
              color: 'var(--text-dark)',
              margin: '0 0 0.25rem',
              textAlign: 'center',
            }}>
              {card.front}
            </p>

            {/* Definition */}
            <p style={{
              fontSize: '0.9rem',
              color: 'var(--text-mid)',
              margin: '0 0 1rem',
              textAlign: 'center',
              lineHeight: 1.5,
            }}>
              {card.back}
            </p>

            {/* Divider */}
            <div style={{
              height: '1px',
              background: 'linear-gradient(to right, transparent, rgba(232,160,160,0.4), transparent)',
              margin: '0 0 1rem',
            }} />

            {/* Cultural context */}
            <div>
              <p style={{
                fontSize: '0.65rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--rose)',
                margin: '0 0 0.5rem',
              }}>
                Cultural context
              </p>
              {contextLoading ? (
                <p style={{ fontSize: '0.8rem', color: 'var(--steel)', fontStyle: 'italic' }}>
                  Generating context…
                </p>
              ) : context ? (
                <p style={{
                  fontSize: '0.82rem',
                  color: 'var(--text-mid)',
                  lineHeight: 1.65,
                  fontFamily: 'Lora, Georgia, serif',
                  fontStyle: 'italic',
                  margin: 0,
                  whiteSpace: 'pre-wrap',
                }}>
                  {context}
                </p>
              ) : null}
            </div>
          </div>

        </div>
      </div>

      {/* ── Rating buttons (only shown when flipped) ── */}
      {flipped && !rated && (
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          {RATINGS.map(({ label, quality, color, bg }) => (
            <button
              key={label}
              onClick={() => handleRate(quality)}
              style={{
                flex: 1,
                padding: '0.7rem 0',
                background: bg,
                border: `1.5px solid ${color}`,
                borderRadius: '0.85rem',
                fontSize: '0.82rem',
                fontWeight: 600,
                color,
                cursor: 'pointer',
                transition: 'transform 0.1s, opacity 0.1s',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {rated && (
        <div style={{ textAlign: 'center', padding: '0.5rem' }}>
          <span style={{ color: 'var(--rose)', letterSpacing: '0.3em' }}>✦</span>
        </div>
      )}
    </div>
  )
}
