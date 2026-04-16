import { useState } from 'react'
import { callMindCompanion } from '../../services/companion'
import { Bow, MicroMotifs } from '../Decorations'

const STEPS = ['happened', 'hard', 'loading', 'response']

export default function WeeklyCheckin({ onSave, onClose }) {
  const [step, setStep]           = useState('happened')
  const [whatHappened, setHappened] = useState('')
  const [whatWasHard, setHard]    = useState('')
  const [response, setResponse]   = useState('')
  const [error, setError]         = useState(null)

  async function submit() {
    setStep('loading')
    setError(null)
    try {
      const text = await callMindCompanion({ whatHappened, whatWasHard })
      setResponse(text)
      setStep('response')
    } catch (e) {
      if (e.message === 'no_key') {
        setError('no_key')
      } else {
        setError('api_error')
      }
      setStep('hard') // back to last input step
    }
  }

  function finish() {
    onSave({ date: new Date().toISOString().slice(0, 10), whatHappened, whatWasHard, response })
    onClose()
  }

  return (
    <div className="fade-up" style={{ padding: '1.25rem' }}>

      {/* Step: what happened */}
      {step === 'happened' && (
        <>
          <p style={{ fontFamily: 'Lora, Georgia, serif', fontSize: '1rem', fontWeight: 500, color: 'var(--text-dark)', margin: '0 0 0.35rem' }}>
            What happened this week?
          </p>
          <p style={{ fontSize: '0.75rem', fontStyle: 'italic', fontFamily: 'Lora, Georgia, serif', color: 'var(--steel)', margin: '0 0 0.85rem' }}>
            Evidence only — what you actually did, not what you meant to do.
          </p>
          <textarea
            autoFocus
            value={whatHappened}
            onChange={e => setHappened(e.target.value)}
            placeholder="This week I…"
            rows={6}
            style={textareaStyle}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
            <StepButton disabled={!whatHappened.trim()} onClick={() => setStep('hard')}>
              Next ✦
            </StepButton>
          </div>
        </>
      )}

      {/* Step: what was hard */}
      {step === 'hard' && (
        <>
          <p style={{ fontFamily: 'Lora, Georgia, serif', fontSize: '1rem', fontWeight: 500, color: 'var(--text-dark)', margin: '0 0 0.35rem' }}>
            What was hard?
          </p>
          <p style={{ fontSize: '0.75rem', fontStyle: 'italic', fontFamily: 'Lora, Georgia, serif', color: 'var(--steel)', margin: '0 0 0.85rem' }}>
            Honest is fine. You don't have to minimize it.
          </p>
          <textarea
            autoFocus
            value={whatWasHard}
            onChange={e => setHard(e.target.value)}
            placeholder="It was hard when…"
            rows={5}
            style={textareaStyle}
          />

          {error === 'no_key' && (
            <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'rgba(244,194,194,0.15)', borderRadius: '0.75rem', border: '1px solid rgba(232,160,160,0.3)' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-mid)', margin: '0 0 0.25rem', fontWeight: 500 }}>Companion not yet connected</p>
              <p style={{ fontSize: '0.72rem', color: 'var(--steel)', margin: 0, lineHeight: 1.5 }}>
                To enable the companion, add <code style={{ fontSize: '0.68rem', background: 'rgba(140,155,171,0.15)', padding: '0.1rem 0.3rem', borderRadius: '0.25rem' }}>ANTHROPIC_API_KEY</code> to your Vercel project's Environment Variables, then redeploy.
              </p>
            </div>
          )}
          {error === 'api_error' && (
            <p style={{ fontSize: '0.72rem', color: 'var(--steel)', margin: '0.5rem 0 0', fontStyle: 'italic' }}>
              Something went wrong. Check your connection and try again.
            </p>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
            <button onClick={() => setStep('happened')} style={backBtnStyle}>← Back</button>
            <StepButton disabled={!whatWasHard.trim()} onClick={submit}>
              Send to companion ✦
            </StepButton>
          </div>
        </>
      )}

      {/* Step: loading */}
      {step === 'loading' && (
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          <Bow size={24} color="var(--rose)" opacity={0.6} style={{ marginBottom: '0.75rem' }} />
          <p style={{ fontFamily: 'Lora, Georgia, serif', fontSize: '0.95rem', fontStyle: 'italic', color: 'var(--text-mid)', margin: 0 }}>
            Reading your week…
          </p>
          <div style={{ marginTop: '0.5rem' }}>
            <MicroMotifs count={5} />
          </div>
        </div>
      )}

      {/* Step: companion response */}
      {step === 'response' && (
        <>
          <div style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bow size={16} color="var(--rose)" opacity={0.65} />
            <p style={{ fontFamily: 'Lora, Georgia, serif', fontSize: '0.85rem', fontWeight: 500, color: 'var(--steel)', margin: 0, letterSpacing: '0.02em' }}>
              Your companion
            </p>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, rgba(244,194,194,0.1) 0%, rgba(253,240,240,0.5) 100%)',
            border: '1px solid rgba(232,160,160,0.2)',
            borderRadius: '1rem',
            padding: '1rem 1.1rem',
            marginBottom: '1rem',
          }}>
            <p style={{
              fontFamily: 'Lora, Georgia, serif',
              fontSize: '0.88rem',
              lineHeight: 1.7,
              color: 'var(--text-dark)',
              margin: 0,
              whiteSpace: 'pre-wrap',
            }}>
              {response}
            </p>
          </div>
          <div style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
            <MicroMotifs count={4} />
          </div>
          <button onClick={finish} style={{ ...stepBtnBase, width: '100%', justifyContent: 'center' }}>
            Close ✦
          </button>
        </>
      )}
    </div>
  )
}

const textareaStyle = {
  width: '100%',
  background: 'var(--base)',
  border: '1px solid rgba(232,160,160,0.25)',
  borderRadius: '0.85rem',
  padding: '0.75rem 0.9rem',
  fontSize: '0.875rem',
  color: 'var(--text-dark)',
  fontFamily: 'Lora, Georgia, serif',
  fontStyle: 'italic',
  resize: 'none',
  outline: 'none',
  lineHeight: 1.6,
  boxSizing: 'border-box',
}

const stepBtnBase = {
  background: 'var(--rose)',
  border: 'none',
  borderRadius: '0.85rem',
  padding: '0.55rem 1.1rem',
  fontSize: '0.82rem',
  fontWeight: 500,
  color: '#fff',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.3rem',
  transition: 'opacity 0.2s ease',
}

const backBtnStyle = {
  background: 'none',
  border: 'none',
  fontSize: '0.78rem',
  color: 'var(--steel)',
  cursor: 'pointer',
  padding: 0,
}

function StepButton({ disabled, onClick, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ ...stepBtnBase, opacity: disabled ? 0.4 : 1, cursor: disabled ? 'default' : 'pointer' }}
    >
      {children}
    </button>
  )
}
