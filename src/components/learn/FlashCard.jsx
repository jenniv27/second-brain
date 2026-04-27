import { useState, useEffect, useRef } from 'react'
import { Volume2 } from 'lucide-react'
import { MicroMotifs } from '../Decorations'
import { playAudio } from '../../services/audioStorage'

export default function FlashCard({ card, onNext }) {
  const [flipped, setFlipped]         = useState(false)
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [done, setDone]               = useState(false)
  const didAutoPlay = useRef(false)

  useEffect(() => {
    setFlipped(false)
    setDone(false)
    didAutoPlay.current = false
  }, [card.id])

  async function handleAudio() {
    if (audioPlaying || !card.audioFile) return
    setAudioPlaying(true)
    await playAudio(card.audioFile)
    setAudioPlaying(false)
  }

  function handleFlip() {
    if (done) return
    setFlipped(true)
    if (card.audioFile && !didAutoPlay.current) {
      didAutoPlay.current = true
      handleAudio()
    }
  }

  function rate(rating) {
    setDone(true)
    setTimeout(() => onNext(card.id, rating), 250)
  }

  return (
    <div style={{ width: '100%' }}>

      {/* ── Flip card ── */}
      <div
        onClick={!flipped && !done ? handleFlip : undefined}
        style={{
          perspective: '1000px',
          cursor: flipped ? 'default' : 'pointer',
          marginBottom: '1.25rem',
        }}
      >
        <div style={{
          position: 'relative',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.42s ease',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          minHeight: '200px',
        }}>

          {/* ── Front: definition ── */}
          <div style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            position: 'absolute', inset: 0,
            background: 'linear-gradient(160deg, #fde8e8 0%, #fdf5f5 100%)',
            borderRadius: '1.25rem',
            border: '1.5px solid rgba(232,160,160,0.25)',
            boxShadow: '0 4px 20px rgba(232,160,160,0.12)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '2rem', gap: '0.75rem',
          }}>
            <MicroMotifs count={3} />
            <p style={{
              fontFamily: 'Lora, Georgia, serif',
              fontSize: '1.4rem',
              fontWeight: 600,
              color: 'var(--text-dark)',
              margin: 0,
              lineHeight: 1.4,
              textAlign: 'center',
            }}>
              {card.definition}
            </p>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: 'var(--steel)' }}>
              tap to reveal
            </p>
            <MicroMotifs count={3} />
          </div>

          {/* ── Back: pinyin + audio ── */}
          <div style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            position: 'absolute', inset: 0,
            background: 'white',
            borderRadius: '1.25rem',
            border: '1.5px solid rgba(140,155,171,0.2)',
            boxShadow: '0 4px 20px rgba(140,155,171,0.08)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '1.5rem', gap: '0.5rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <p style={{
                fontFamily: 'Lora, Georgia, serif',
                fontSize: '2rem',
                fontWeight: 700,
                color: 'var(--text-dark)',
                margin: 0,
                textAlign: 'center',
              }}>
                {card.pinyin || '—'}
              </p>
              {card.audioFile && (
                <button
                  onClick={e => { e.stopPropagation(); handleAudio() }}
                  disabled={audioPlaying}
                  style={{
                    background: audioPlaying ? 'var(--pink)' : 'rgba(232,160,160,0.15)',
                    border: '1px solid rgba(232,160,160,0.3)',
                    borderRadius: '50%',
                    width: '2rem', height: '2rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: audioPlaying ? 'default' : 'pointer',
                    flexShrink: 0,
                  }}
                >
                  <Volume2 size={13} strokeWidth={1.75} color="var(--rose)" />
                </button>
              )}
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--steel)', margin: 0 }}>
              {card.definition}
            </p>
          </div>

        </div>
      </div>

      {/* ── Rating buttons (only after flip) ── */}
      {flipped && !done && (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[
            { rating: 0, label: 'Again', style: { background: 'rgba(192,99,90,0.08)', border: '1px solid rgba(192,99,90,0.25)', color: '#c0635a' } },
            { rating: 4, label: 'Good',  style: { background: 'linear-gradient(135deg, var(--rose) 0%, rgba(232,160,160,0.8) 100%)', border: 'none', color: 'white' } },
            { rating: 5, label: 'Easy',  style: { background: 'rgba(90,154,90,0.08)', border: '1px solid rgba(90,154,90,0.25)', color: '#4a8a4a' } },
          ].map(({ rating, label, style }) => (
            <button
              key={rating}
              onClick={() => rate(rating)}
              style={{
                flex: 1,
                padding: '0.75rem 0.5rem',
                borderRadius: '1rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                letterSpacing: '0.02em',
                ...style,
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
