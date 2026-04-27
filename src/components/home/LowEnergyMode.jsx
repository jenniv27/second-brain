import { useState } from 'react'
import { Bow, Wings, OrnateDivider, MicroMotifs } from '../Decorations'

const QUOTES = [
  "You don't have to earn rest.",
  "Showing up is enough. Even when it's just barely.",
  "You are allowed to have a hard day.",
  "Gentleness is not weakness. It takes real courage.",
  "One breath at a time is a perfectly valid pace.",
  "Rest is not a reward for finishing things. It's just rest.",
  "You are doing the best you can with what you have today.",
  "Some days the most important thing you did was get through them.",
  "It's okay to not be okay. You're still here.",
  "Being gentle with yourself is not giving up. It's wisdom.",
  "You don't have to be okay all the time. Nobody is.",
  "Small and steady is still moving forward.",
]

const AFFIRMATIONS = [
  "You are more than what you accomplish in a day.",
  "You are someone who keeps trying, even on the hard ones.",
  "You are curious, creative, and deeply caring.",
  "You matter to the people around you.",
  "You are learning, and that takes real courage.",
  "You are not behind. You are exactly where you are.",
  "You show up. That counts for more than you know.",
  "You notice things. That's a gift.",
]

export default function LowEnergyMode({ onExit }) {
  const [quoteIdx, setQuoteIdx] = useState(() => Math.floor(Math.random() * QUOTES.length))

  function nextQuote() {
    setQuoteIdx(i => (i + 1) % QUOTES.length)
  }

  return (
    <div className="fade-up" style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #ede8f5 0%, #f5eef8 45%, var(--base) 100%)',
      paddingBottom: '4rem',
    }}>

      {/* Header */}
      <header style={{
        padding: '2rem 1.25rem 1.75rem',
        textAlign: 'center',
        position: 'relative',
      }}>
        <button
          onClick={onExit}
          style={{
            position: 'absolute',
            left: '1.25rem',
            top: '1.75rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--steel)',
            fontSize: '0.82rem',
            padding: 0,
          }}
        >
          ← back
        </button>

        <Wings size={34} color="#8b7cd4" opacity={0.3} />

        <h1 style={{
          fontFamily: 'Lora, Georgia, serif',
          fontSize: '1.65rem',
          fontWeight: 500,
          color: 'var(--text-dark)',
          margin: '0.85rem 0 0.35rem',
          lineHeight: 1.25,
        }}>
          Hey, Jennifer{' '}
          <span style={{ fontSize: '1rem', color: '#8b7cd4', opacity: 0.6 }}>✦</span>
        </h1>

        <p style={{
          fontFamily: 'Lora, Georgia, serif',
          fontStyle: 'italic',
          fontSize: '0.95rem',
          color: 'var(--text-mid)',
          margin: 0,
        }}>
          You showed up today. That's enough.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '1.25rem' }}>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, rgba(139,124,212,0.25))' }} />
          <MicroMotifs count={5} />
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, rgba(139,124,212,0.25))' }} />
        </div>
      </header>

      <div style={{ padding: '0 1.25rem' }}>

        {/* You showed up card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(139,124,212,0.1) 0%, rgba(139,124,212,0.05) 100%)',
          border: '1.5px solid rgba(139,124,212,0.2)',
          borderRadius: '1.5rem',
          padding: '1.5rem 1.35rem',
          textAlign: 'center',
          marginBottom: '1.1rem',
        }}>
          <span style={{ fontSize: '1.4rem', color: '#8b7cd4', opacity: 0.4 }}>✦</span>
          <p style={{
            fontFamily: 'Lora, Georgia, serif',
            fontSize: '0.93rem',
            color: 'var(--text-mid)',
            margin: '0.65rem 0 0',
            lineHeight: 1.7,
          }}>
            Opening this app on a hard day — that's showing up.<br />
            The bar for "enough" is lower than you think.<br />
            You cleared it.
          </p>
        </div>

        {/* Quote card — tap to cycle */}
        <button
          onClick={nextQuote}
          style={{
            width: '100%',
            background: 'white',
            border: '1px solid rgba(139,124,212,0.15)',
            borderRadius: '1.5rem',
            padding: '1.75rem 1.5rem',
            cursor: 'pointer',
            textAlign: 'center',
            marginBottom: '1.25rem',
            boxShadow: '0 2px 20px rgba(139,124,212,0.07)',
          }}
        >
          <p style={{
            fontFamily: 'Lora, Georgia, serif',
            fontSize: '1.15rem',
            fontWeight: 500,
            color: 'var(--text-dark)',
            lineHeight: 1.7,
            margin: '0 0 1rem',
          }}>
            "{QUOTES[quoteIdx]}"
          </p>
          <span style={{ fontSize: '0.68rem', color: 'var(--steel)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            tap for another
          </span>
        </button>

        <OrnateDivider style={{ margin: '0.25rem 0 1.25rem' }} />

        {/* Who you are */}
        <p style={{
          fontSize: '0.68rem',
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#8b7cd4',
          margin: '0 0 0.9rem',
          opacity: 0.85,
        }}>
          Who you are
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '2rem' }}>
          {AFFIRMATIONS.map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
              <span style={{ color: '#8b7cd4', opacity: 0.45, fontSize: '0.65rem', marginTop: '0.3rem', flexShrink: 0 }}>✦</span>
              <p style={{
                fontFamily: 'Lora, Georgia, serif',
                fontSize: '0.93rem',
                color: 'var(--text-mid)',
                margin: 0,
                lineHeight: 1.55,
              }}>
                {a}
              </p>
            </div>
          ))}
        </div>

        {/* Be gentle reminder */}
        <div style={{
          background: 'rgba(139,124,212,0.06)',
          border: '1px solid rgba(139,124,212,0.15)',
          borderRadius: '1.25rem',
          padding: '1.1rem 1.25rem',
          textAlign: 'center',
          marginBottom: '1.5rem',
        }}>
          <p style={{
            fontFamily: 'Lora, Georgia, serif',
            fontStyle: 'italic',
            fontSize: '0.88rem',
            color: 'var(--text-mid)',
            margin: 0,
            lineHeight: 1.6,
          }}>
            Be as kind to yourself today as you would be to someone you love.
          </p>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <Bow size={18} color="#8b7cd4" opacity={0.25} />
          <p style={{
            fontFamily: 'Lora, Georgia, serif',
            fontStyle: 'italic',
            fontSize: '0.78rem',
            color: 'var(--steel)',
            margin: '0.6rem 0 0.5rem',
            opacity: 0.7,
          }}>
            The rest can wait.
          </p>
          <MicroMotifs count={5} />
        </div>

      </div>
    </div>
  )
}
