import { useState, useEffect, useRef } from 'react'
import { Volume2, Pencil, Check, X } from 'lucide-react'
import { MicroMotifs } from '../Decorations'
import { playAudio } from '../../services/audioStorage'

export default function FlashCard({ card, onNext, onSaveCulturalContext }) {
  const [flipped, setFlipped]           = useState(false)
  const [context, setContext]           = useState(card.culturalContext ?? '')
  const [editing, setEditing]           = useState(false)
  const [draft, setDraft]               = useState('')
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [done, setDone]                 = useState(false)
  const didAutoPlay = useRef(false)
  const textareaRef = useRef(null)

  // Reset on card change
  useEffect(() => {
    setFlipped(false)
    setDone(false)
    setContext(card.culturalContext ?? '')
    setEditing(false)
    setDraft('')
    didAutoPlay.current = false
  }, [card.id])

  // Focus textarea when editing starts
  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [editing])

  async function handleAudio() {
    if (audioPlaying || !card.audioFile) return
    setAudioPlaying(true)
    await playAudio(card.audioFile)
    setAudioPlaying(false)
  }

  async function handleFlip() {
    if (done) return
    setFlipped(true)

    // Auto-play audio on flip (user gesture satisfies browser policy)
    if (card.audioFile && !didAutoPlay.current) {
      didAutoPlay.current = true
      handleAudio()
    }
  }

  function startEditing() {
    setDraft(context)
    setEditing(true)
  }

  function saveEdit() {
    setContext(draft)
    onSaveCulturalContext?.(card.id, draft)
    setEditing(false)
  }

  function cancelEdit() {
    setEditing(false)
    setDraft('')
  }

  function handleNext() {
    setDone(true)
    setTimeout(() => onNext(card.id), 250)
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
          minHeight: '260px',
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

          {/* ── Back: pinyin + audio + cultural context ── */}
          <div style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            position: 'absolute', inset: 0,
            background: 'white',
            borderRadius: '1.25rem',
            border: '1.5px solid rgba(140,155,171,0.2)',
            boxShadow: '0 4px 20px rgba(140,155,171,0.08)',
            padding: '1.25rem',
            overflowY: 'auto',
          }}>

            {/* Pinyin + audio button */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
              <p style={{
                fontFamily: 'Lora, Georgia, serif',
                fontSize: '1.7rem',
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
                    transition: 'background 0.15s',
                  }}
                >
                  <Volume2 size={13} strokeWidth={1.75} color="var(--rose)" />
                </button>
              )}
            </div>

            {/* Definition (smaller, for reference) */}
            <p style={{
              fontSize: '0.82rem',
              color: 'var(--steel)',
              margin: '0 0 1rem',
              textAlign: 'center',
            }}>
              {card.definition}
            </p>

            {/* Divider */}
            <div style={{
              height: '1px',
              background: 'linear-gradient(to right, transparent, rgba(232,160,160,0.4), transparent)',
              margin: '0 0 1rem',
            }} />

            {/* Cultural context — manually editable */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <p style={{
                fontSize: '0.65rem', fontWeight: 600,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                color: 'var(--rose)', margin: 0,
              }}>
                Notes
              </p>
              {!editing && (
                <button
                  onClick={e => { e.stopPropagation(); startEditing() }}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '0.25rem',
                    color: 'var(--steel)', fontSize: '0.7rem', padding: '0.1rem 0.3rem',
                  }}
                >
                  <Pencil size={11} strokeWidth={1.75} />
                  {context ? 'Edit' : 'Add note'}
                </button>
              )}
            </div>

            {editing ? (
              <div onClick={e => e.stopPropagation()}>
                <textarea
                  ref={textareaRef}
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  placeholder="Paste pinyin, usage examples, memory tips…"
                  rows={4}
                  style={{
                    width: '100%',
                    fontSize: '0.82rem',
                    fontFamily: 'Lora, Georgia, serif',
                    fontStyle: 'italic',
                    color: 'var(--text-mid)',
                    lineHeight: 1.65,
                    border: '1px solid rgba(232,160,160,0.4)',
                    borderRadius: '0.6rem',
                    padding: '0.6rem 0.75rem',
                    resize: 'vertical',
                    outline: 'none',
                    background: '#fdf9f9',
                    boxSizing: 'border-box',
                  }}
                />
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button
                    onClick={saveEdit}
                    style={{
                      flex: 1,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem',
                      background: 'var(--rose)',
                      border: 'none', borderRadius: '0.6rem',
                      padding: '0.45rem',
                      fontSize: '0.78rem', fontWeight: 600,
                      color: 'white', cursor: 'pointer',
                    }}
                  >
                    <Check size={13} strokeWidth={2.5} /> Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem',
                      background: 'rgba(140,155,171,0.1)',
                      border: '1px solid rgba(140,155,171,0.2)', borderRadius: '0.6rem',
                      padding: '0.45rem 0.75rem',
                      fontSize: '0.78rem', color: 'var(--steel)', cursor: 'pointer',
                    }}
                  >
                    <X size={13} strokeWidth={2} /> Cancel
                  </button>
                </div>
              </div>
            ) : context ? (
              <p style={{
                fontSize: '0.82rem', color: 'var(--text-mid)',
                lineHeight: 1.65,
                fontFamily: 'Lora, Georgia, serif', fontStyle: 'italic',
                margin: 0, whiteSpace: 'pre-wrap',
              }}>
                {context}
              </p>
            ) : (
              <p style={{ fontSize: '0.78rem', color: 'var(--steel)', fontStyle: 'italic', margin: 0 }}>
                No notes yet — tap "Add note" to paste in pinyin or a memory tip.
              </p>
            )}
          </div>

        </div>
      </div>

      {/* ── Next button (only after flip) ── */}
      {flipped && !done && (
        <button
          onClick={handleNext}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: 'linear-gradient(135deg, var(--rose) 0%, rgba(232,160,160,0.8) 100%)',
            border: 'none',
            borderRadius: '1rem',
            fontSize: '0.88rem',
            fontWeight: 600,
            color: 'white',
            cursor: 'pointer',
            letterSpacing: '0.02em',
          }}
        >
          Next →
        </button>
      )}
    </div>
  )
}
