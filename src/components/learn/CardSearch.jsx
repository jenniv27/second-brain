import { useState } from 'react'
import { Search, Plus, X, Check } from 'lucide-react'

const FIELDS = [
  { key: 'definition', label: 'English', placeholder: 'Hello',   font: 'inherit', required: true },
  { key: 'pinyin',     label: 'Pinyin',  placeholder: 'nǐ hǎo', font: 'inherit' },
]

const EMPTY_FORM = { pinyin: '', definition: '' }

export default function CardSearch({ cards, onAdd }) {
  const [query, setQuery]       = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]         = useState(EMPTY_FORM)
  const [feedback, setFeedback] = useState(null) // 'added' | 'duplicate'

  const q = query.trim().toLowerCase()
  const results = q.length > 0
    ? cards.filter(c =>
        c.hanzi?.toLowerCase().includes(q) ||
        c.pinyin?.toLowerCase().includes(q) ||
        c.definition?.toLowerCase().includes(q)
      ).slice(0, 6)
    : []

  function clearSearch() {
    setQuery('')
    setShowForm(false)
    setFeedback(null)
  }

  function openForm() {
    setFeedback(null)
    setShowForm(true)
  }

  function handleAdd() {
    const def    = form.definition.trim().toLowerCase()
    const pinyin = form.pinyin.trim().toLowerCase()

    const isDuplicate = cards.some(c =>
      (def    && c.definition?.toLowerCase().trim() === def) ||
      (pinyin && c.pinyin?.toLowerCase().trim()     === pinyin)
    )

    if (isDuplicate) {
      setFeedback('duplicate')
      return
    }

    onAdd({
      id:          `manual-${Date.now()}`,
      noteId:      `manual-${Date.now()}`,
      hanzi:       '',
      pinyin:      form.pinyin.trim(),
      definition:  form.definition.trim(),
      audioFile:   null,
      tags:        ['manual'],
      mastered:    false,
    })

    setFeedback('added')
    setTimeout(() => {
      setFeedback(null)
      setShowForm(false)
      setForm(EMPTY_FORM)
      clearSearch()
    }, 1000)
  }

  const canSubmit = form.definition.trim().length > 0

  return (
    <div>
      {/* Search bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        background: 'white',
        border: '1px solid rgba(232,160,160,0.25)',
        borderRadius: '0.85rem',
        padding: '0.5rem 0.75rem',
      }}>
        <Search size={14} strokeWidth={1.75} color="var(--steel)" style={{ flexShrink: 0 }} />
        <input
          value={query}
          onChange={e => { setQuery(e.target.value); setShowForm(false); setFeedback(null) }}
          placeholder="Search cards…"
          style={{
            flex: 1, border: 'none', outline: 'none', background: 'none',
            fontSize: '0.85rem', color: 'var(--text-dark)',
            fontFamily: 'inherit',
          }}
        />
        {query && (
          <button
            onClick={clearSearch}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
          >
            <X size={13} strokeWidth={2} color="var(--steel)" />
          </button>
        )}
      </div>

      {/* Results + add prompt */}
      {q.length > 0 && (
        <div style={{ marginTop: '0.5rem' }}>

          {results.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '0.5rem' }}>
              {results.map(c => (
                <div key={c.id} style={{
                  background: 'white',
                  border: '1px solid rgba(232,160,160,0.18)',
                  borderRadius: '0.75rem',
                  padding: '0.55rem 0.85rem',
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                }}>
                  {c.hanzi && (
                    <span style={{ fontSize: '1.25rem', fontFamily: 'serif', color: 'var(--text-dark)', flexShrink: 0, lineHeight: 1 }}>
                      {c.hanzi}
                    </span>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-mid)', fontFamily: 'Lora, Georgia, serif' }}>
                      {c.pinyin || '—'}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--steel)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {c.definition}
                    </p>
                  </div>
                  {c.mastered && (
                    <Check size={12} strokeWidth={2.5} color="var(--rose)" style={{ flexShrink: 0 }} />
                  )}
                </div>
              ))}
            </div>
          )}

          {results.length === 0 && (
            <p style={{ fontSize: '0.78rem', color: 'var(--steel)', margin: '0.3rem 0 0.5rem', fontStyle: 'italic' }}>
              No cards match "{query}".
            </p>
          )}

          {!showForm && (
            <button
              onClick={openForm}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                fontSize: '0.78rem', color: 'var(--rose)', fontWeight: 500,
              }}
            >
              <Plus size={13} strokeWidth={2.5} />
              {results.length === 0 ? 'Add this as a new card' : 'Add a card'}
            </button>
          )}
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <div style={{
          marginTop: '0.75rem',
          background: 'white',
          border: '1.5px solid rgba(232,160,160,0.25)',
          borderRadius: '1rem',
          padding: '1rem',
        }}>
          <p style={{
            margin: '0 0 0.75rem',
            fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.08em',
            textTransform: 'uppercase', color: 'var(--steel)',
          }}>
            New card
          </p>

          {FIELDS.map(({ key, label, placeholder, font, required }) => (
            <div key={key} style={{ marginBottom: '0.6rem' }}>
              <label style={{
                display: 'block', fontSize: '0.68rem',
                color: 'var(--steel)', marginBottom: '0.2rem', letterSpacing: '0.04em',
              }}>
                {label}{required ? ' *' : ''}
              </label>
              <input
                value={form[key]}
                onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                placeholder={placeholder}
                onKeyDown={e => e.key === 'Enter' && canSubmit && handleAdd()}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  border: '1px solid rgba(140,155,171,0.25)',
                  borderRadius: '0.5rem',
                  padding: '0.45rem 0.65rem',
                  fontSize: '0.88rem',
                  color: 'var(--text-dark)',
                  outline: 'none',
                  background: '#fafafa',
                  fontFamily: font,
                }}
              />
            </div>
          ))}

          {feedback === 'duplicate' && (
            <p style={{ fontSize: '0.75rem', color: '#c0635a', margin: '0.4rem 0 0.6rem', fontStyle: 'italic' }}>
              A card with that definition or pinyin already exists.
            </p>
          )}

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
            <button
              onClick={handleAdd}
              disabled={!canSubmit || feedback === 'added'}
              style={{
                flex: 1,
                padding: '0.55rem',
                background: feedback === 'added'
                  ? 'rgba(232,160,160,0.4)'
                  : 'linear-gradient(135deg, var(--rose) 0%, rgba(232,160,160,0.8) 100%)',
                border: 'none', borderRadius: '0.65rem',
                fontSize: '0.82rem', fontWeight: 600,
                color: 'white', cursor: canSubmit ? 'pointer' : 'default',
                opacity: canSubmit ? 1 : 0.45,
                transition: 'background 0.2s',
              }}
            >
              {feedback === 'added' ? '✓ Added' : 'Add card'}
            </button>
            <button
              onClick={() => { setShowForm(false); setFeedback(null) }}
              style={{
                padding: '0.55rem 0.9rem',
                background: 'none',
                border: '1px solid rgba(140,155,171,0.2)',
                borderRadius: '0.65rem',
                fontSize: '0.82rem', color: 'var(--steel)',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
