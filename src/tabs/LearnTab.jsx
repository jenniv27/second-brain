import { useState } from 'react'
import { MicroMotifs, OrnateDivider } from '../components/Decorations'
import CulturalContextTool from '../components/learn/CulturalContextTool'
import ImportDeck from '../components/learn/ImportDeck'
import FlashcardSession from '../components/learn/FlashcardSession'
import { useFlashcards } from '../hooks/useFlashcards'

export default function LearnTab() {
  const {
    totalCards, masteredCount,
    loaded, markReviewed, saveCulturalContext,
    importCards, clearCards, getSessionCards,
  } = useFlashcards()

  const [view, setView]           = useState('home') // 'home' | 'session'
  const [sessionCards, setSession] = useState([])

  function startSession() {
    setSession(getSessionCards())
    setView('session')
  }

  // ── Review session ───────────────────────────────────────────
  if (view === 'session') {
    return (
      <div className="fade-up">
        <header style={{
          padding: '1.25rem 1.1rem 0.75rem',
          borderBottom: '1px solid rgba(232,160,160,0.12)',
          display: 'flex', alignItems: 'center', gap: '0.75rem',
        }}>
          <button
            onClick={() => setView('home')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--steel)', fontSize: '0.85rem' }}
          >
            ← Back
          </button>
          <span className="serif" style={{ fontSize: '1rem', color: 'var(--text-dark)', fontWeight: 600 }}>
            Review session
          </span>
        </header>
        <FlashcardSession
          sessionCards={sessionCards}
          onNext={markReviewed}
          onSaveCulturalContext={saveCulturalContext}
          onComplete={() => setView('home')}
        />
      </div>
    )
  }

  // ── Home view ────────────────────────────────────────────────
  return (
    <div className="fade-up">

      <header style={{
        padding: '1.5rem 1.25rem 1.1rem',
        background: 'linear-gradient(160deg, #f9d8d8 0%, #fce8e8 40%, var(--base) 100%)',
        borderBottom: '1px solid rgba(232,160,160,0.15)',
        position: 'relative', overflow: 'hidden',
      }}>
        <span style={{ position:'absolute', top:'0.6rem', right:'1.2rem', fontSize:'0.7rem', color:'var(--rose)', opacity:0.3, animation:'starShimmer 5s infinite' }}>✦</span>
        <p style={{ fontSize:'0.72rem', fontWeight:500, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--steel)', margin:'0 0 0.3rem' }}>Learn</p>
        <h1 className="serif" style={{ fontSize:'1.6rem', fontWeight:500, color:'var(--text-dark)', margin:'0 0 0.2rem', lineHeight:1.2 }}>
          Mandarin <span style={{ fontSize:'0.9rem' }}>✦</span>
        </h1>
        <p className="serif" style={{ fontSize:'0.85rem', fontStyle:'italic', color:'var(--text-mid)', margin:0 }}>
          Each session adds a small layer.
        </p>
      </header>

      <div style={{ padding: '1.25rem 1.1rem' }}>

        <CulturalContextTool />

        <div style={{ margin: '1rem 0' }}>
          <OrnateDivider />
        </div>

        {/* Flashcard section header */}
        <div style={{ marginBottom: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ margin:0, fontSize:'0.72rem', fontWeight:600, letterSpacing:'0.07em', textTransform:'uppercase', color:'var(--steel)' }}>
            Flashcards
          </p>
          <ImportDeck onImport={importCards} />
        </div>

        {!loaded ? (
          <div style={{ padding: '1.5rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--steel)', fontSize: '0.82rem' }}>Loading…</p>
          </div>
        ) : totalCards === 0 ? (
          <div style={{
            background: 'white',
            borderRadius: '1.25rem',
            border: '1.5px dashed rgba(232,160,160,0.3)',
            padding: '2rem 1.5rem',
            textAlign: 'center',
          }}>
            <p className="serif" style={{ fontSize:'1.1rem', color:'var(--text-mid)', fontStyle:'italic', margin:'0 0 0.5rem' }}>
              No deck imported yet
            </p>
            <p style={{ fontSize:'0.78rem', color:'var(--steel)', margin:0 }}>
              Export a deck from Anki as .apkg and import it above
            </p>
          </div>
        ) : (
          <div>
            {/* Stats */}
            <div style={{ display:'flex', gap:'0.6rem', marginBottom:'1rem' }}>
              {[
                { label: 'Total cards', value: totalCards },
                { label: 'Reviewed',    value: masteredCount },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  flex: 1, background: 'white',
                  border: '1px solid rgba(232,160,160,0.18)',
                  borderRadius: '0.85rem', padding: '0.7rem 0.5rem', textAlign: 'center',
                }}>
                  <p style={{ margin:'0 0 0.2rem', fontSize:'1.2rem', fontWeight:700, color:'var(--text-dark)', fontFamily:'Lora, Georgia, serif' }}>
                    {value}
                  </p>
                  <p style={{ margin:0, fontSize:'0.65rem', color:'var(--steel)', textTransform:'uppercase', letterSpacing:'0.05em' }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>

            {/* Start review */}
            <button
              onClick={startSession}
              style={{
                width: '100%',
                padding: '0.9rem',
                background: 'linear-gradient(135deg, var(--rose) 0%, rgba(232,160,160,0.8) 100%)',
                border: 'none', borderRadius: '1rem',
                fontSize: '0.9rem', fontWeight: 600,
                color: 'white', cursor: 'pointer',
                letterSpacing: '0.03em',
                boxShadow: '0 3px 12px rgba(232,160,160,0.3)',
              }}
            >
              Start review · {totalCards} {totalCards === 1 ? 'card' : 'cards'}
            </button>

            {/* Clear deck */}
            <button
              onClick={() => {
                if (confirm('Clear all cards? You can re-import your deck afterwards.')) {
                  clearCards()
                }
              }}
              style={{
                width: '100%',
                marginTop: '0.6rem',
                padding: '0.75rem',
                background: 'white',
                border: '1.5px solid rgba(232,160,160,0.35)',
                borderRadius: '1rem',
                fontSize: '0.85rem',
                fontWeight: 500,
                color: 'var(--steel)',
                cursor: 'pointer',
              }}
            >
              Clear deck &amp; re-import
            </button>
          </div>
        )}

        <div style={{ textAlign:'center', marginTop:'1.5rem', marginBottom:'0.5rem' }}>
          <MicroMotifs count={5} />
        </div>

      </div>
    </div>
  )
}
