import { useState } from 'react'
import { MONEY_SYSTEM_PROMPT } from '../../data/moneyData'
import { buildBudgetContext } from '../../services/ynab'
import { SYSTEM_GROUPS } from '../../data/moneyData'
import { Bow, MicroMotifs } from '../Decorations'

export default function MoneyCheckin({ onSave, onClose, ynabData }) {
  const [step, setStep]         = useState('reflection')
  const [reflection, setRef]    = useState('')
  const [whatWasHard, setHard]  = useState('')
  const [response, setResponse] = useState('')
  const [error, setError]       = useState(null)

  async function submit() {
    setStep('loading')
    setError(null)

    const budgetContext = ynabData
      ? buildBudgetContext(ynabData.month, ynabData.categoryGroups, SYSTEM_GROUPS)
      : 'No YNAB data available.'

    const userMessage = [
      `Budget context:\n${budgetContext}`,
      `How the week felt financially: ${reflection}`,
      `What was hard: ${whatWasHard}`,
    ].join('\n\n')

    try {
      const res = await fetch('/api/companion', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: MONEY_SYSTEM_PROMPT,
          maxTokens: 600,
          messages: [{ role: 'user', content: userMessage }],
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        if (err.error === 'no_key') throw new Error('no_key')
        throw new Error('api_error')
      }

      const data = await res.json()
      setResponse(data.content?.[0]?.text ?? '')
      setStep('response')
    } catch (e) {
      setError(e.message === 'no_key' ? 'no_key' : 'api_error')
      setStep('hard')
    }
  }

  function finish() {
    onSave({
      date: new Date().toISOString().slice(0, 10),
      reflection,
      whatWasHard,
      response,
    })
    onClose()
  }

  return (
    <div className="fade-up" style={{ padding: '1.25rem' }}>

      {/* Step: reflection */}
      {step === 'reflection' && (
        <>
          <p style={questionStyle}>How did spending feel this week?</p>
          <p style={subStyle}>What you actually did — not what you meant to do.</p>
          <textarea
            autoFocus
            value={reflection}
            onChange={e => setRef(e.target.value)}
            placeholder="This week I spent…"
            rows={5}
            style={textareaStyle}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
            <StepButton disabled={!reflection.trim()} onClick={() => setStep('hard')}>
              Next ✦
            </StepButton>
          </div>
        </>
      )}

      {/* Step: what was hard */}
      {step === 'hard' && (
        <>
          <p style={questionStyle}>What was hard about money this week?</p>
          <p style={subStyle}>Honest is fine. You don't have to minimize it.</p>
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
              <p style={{ fontSize: '0.75rem', color: 'var(--text-mid)', margin: '0 0 0.25rem', fontWeight: 500 }}>Companion not connected</p>
              <p style={{ fontSize: '0.72rem', color: 'var(--steel)', margin: 0, lineHeight: 1.5 }}>
                Add <code style={{ fontSize: '0.68rem', background: 'rgba(140,155,171,0.15)', padding: '0.1rem 0.3rem', borderRadius: '0.25rem' }}>ANTHROPIC_API_KEY</code> to your Vercel environment variables.
              </p>
            </div>
          )}
          {error === 'api_error' && (
            <p style={{ fontSize: '0.72rem', color: 'var(--steel)', margin: '0.5rem 0 0', fontStyle: 'italic' }}>
              Something went wrong. Check your connection and try again.
            </p>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
            <button onClick={() => setStep('reflection')} style={backBtnStyle}>← Back</button>
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

// ── Styles ────────────────────────────────────

const questionStyle = {
  fontFamily: 'Lora, Georgia, serif',
  fontSize: '1rem',
  fontWeight: 500,
  color: 'var(--text-dark)',
  margin: '0 0 0.35rem',
}

const subStyle = {
  fontSize: '0.75rem',
  fontStyle: 'italic',
  fontFamily: 'Lora, Georgia, serif',
  color: 'var(--steel)',
  margin: '0 0 0.85rem',
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
