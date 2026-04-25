import { useState } from 'react'

export default function CulturalContextTool() {
  const [input, setInput]     = useState('')
  const [result, setResult]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    const word = input.trim()
    if (!word) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/cultural-context', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word, definition: '' }),
      })
      if (!res.ok) throw new Error('Request failed')
      const data = await res.json()
      setResult({ word, context: data.context })
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '1.25rem',
      border: '1.5px solid rgba(232,160,160,0.2)',
      overflow: 'hidden',
      marginBottom: '1rem',
    }}>
      {/* Header */}
      <div style={{
        padding: '0.85rem 1.1rem 0.75rem',
        borderBottom: '1px solid rgba(232,160,160,0.12)',
        background: 'linear-gradient(135deg, #fde8e8 0%, #fdf5f5 100%)',
      }}>
        <p style={{ margin: 0, fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--steel)' }}>
          Cultural context
        </p>
        <p style={{ margin: '0.15rem 0 0', fontSize: '0.8rem', color: 'var(--text-mid)', fontStyle: 'italic', fontFamily: 'Lora, Georgia, serif' }}>
          Paste a word or phrase from HelloChinese
        </p>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} style={{ padding: '0.85rem 1.1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="e.g. 加油 or 入乡随俗"
            disabled={loading}
            style={{
              flex: 1,
              padding: '0.6rem 0.85rem',
              background: 'var(--base)',
              border: '1px solid rgba(232,160,160,0.2)',
              borderRadius: '0.75rem',
              fontSize: '1rem',
              color: 'var(--text-dark)',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            style={{
              padding: '0.6rem 1rem',
              background: loading || !input.trim() ? 'var(--pink)' : 'var(--rose)',
              border: 'none',
              borderRadius: '0.75rem',
              fontSize: '0.82rem',
              color: 'white',
              cursor: loading || !input.trim() ? 'default' : 'pointer',
              fontWeight: 500,
              transition: 'background 0.2s',
            }}
          >
            {loading ? '…' : 'Look up'}
          </button>
        </div>
      </form>

      {/* Result */}
      {error && (
        <div style={{ padding: '0 1.1rem 1rem' }}>
          <p style={{ fontSize: '0.8rem', color: '#c0635a', margin: 0 }}>{error}</p>
        </div>
      )}

      {result && (
        <div style={{ padding: '0 1.1rem 1.1rem' }}>
          <div style={{
            height: '1px',
            background: 'linear-gradient(to right, transparent, rgba(232,160,160,0.3), transparent)',
            marginBottom: '0.85rem',
          }} />
          <p style={{
            fontFamily: 'Lora, Georgia, serif',
            fontSize: '1.1rem',
            fontWeight: 700,
            color: 'var(--text-dark)',
            margin: '0 0 0.6rem',
          }}>
            {result.word}
          </p>
          <p style={{
            fontSize: '0.84rem',
            color: 'var(--text-mid)',
            lineHeight: 1.7,
            fontFamily: 'Lora, Georgia, serif',
            fontStyle: 'italic',
            margin: 0,
            whiteSpace: 'pre-wrap',
          }}>
            {result.context}
          </p>
        </div>
      )}
    </div>
  )
}
