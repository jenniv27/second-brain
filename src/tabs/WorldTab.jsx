import { useState, useEffect } from 'react'

const SECTIONS = ['world', 'business', 'politics', 'worth-knowing']

function timeAgo(isoString) {
  if (!isoString) return ''
  const diff = Date.now() - new Date(isoString).getTime()
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return 'just now'
  if (hours === 1) return '1 hour ago'
  if (hours < 24) return `${hours} hours ago`
  return 'yesterday'
}

function StoryCard({ story }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      onClick={() => setExpanded(e => !e)}
      style={{
        padding: '0.9rem 1rem',
        borderBottom: '1px solid var(--pink)',
        cursor: 'pointer',
        transition: 'background 0.15s',
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '0.5rem',
      }}>
        <p style={{
          margin: 0,
          fontSize: '0.88rem',
          fontWeight: 600,
          color: 'var(--text-dark)',
          lineHeight: 1.4,
        }}>
          {story.headline}
        </p>
        <span style={{
          color: 'var(--steel)',
          fontSize: '0.75rem',
          flexShrink: 0,
          marginTop: '0.1rem',
          transition: 'transform 0.2s',
          transform: expanded ? 'rotate(180deg)' : 'none',
        }}>▾</span>
      </div>

      {expanded && (
        <p style={{
          margin: '0.6rem 0 0',
          fontSize: '0.84rem',
          color: 'var(--text-mid)',
          lineHeight: 1.6,
        }}>
          {story.body}
        </p>
      )}
    </div>
  )
}

function SectionCard({ section }) {
  const [open, setOpen] = useState(true)

  return (
    <div style={{
      background: 'white',
      borderRadius: '0.75rem',
      overflow: 'hidden',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      marginBottom: '1rem',
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.85rem 1rem',
          background: 'none',
          border: 'none',
          borderBottom: open ? '2px solid var(--pink)' : 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span className="serif" style={{
          fontSize: '1rem',
          fontWeight: 700,
          color: 'var(--text-dark)',
        }}>
          {section.title}
        </span>
        <span style={{
          color: 'var(--steel)',
          fontSize: '0.8rem',
          transition: 'transform 0.2s',
          transform: open ? 'rotate(180deg)' : 'none',
        }}>▾</span>
      </button>

      {open && section.stories?.map((story, i) => (
        <StoryCard key={i} story={story} />
      ))}
    </div>
  )
}

export default function WorldTab() {
  const [digest, setDigest]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  async function loadDigest(force = false) {
    if (force) setRefreshing(true)
    else setLoading(true)
    setError(null)
    try {
      const url = force ? '/api/news?force=1' : '/api/news'
      const res = await fetch(url)
      if (!res.ok) throw new Error('Failed to load digest')
      const data = await res.json()
      setDigest(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { loadDigest() }, [])

  // ── Loading ──────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ padding: '2rem 1rem', textAlign: 'center' }}>
        <div className="serif" style={{
          fontSize: '1.5rem',
          color: 'var(--text-dark)',
          marginBottom: '0.5rem',
        }}>
          World
        </div>
        <p style={{ color: 'var(--steel)', fontSize: '0.85rem', margin: '2rem 0' }}>
          Gathering today's news…
        </p>
        <span style={{ color: 'var(--rose)', letterSpacing: '0.4em', fontSize: '0.9rem' }}>✦ ✦ ✦</span>
      </div>
    )
  }

  // ── Error ────────────────────────────────────────────────────
  if (error) {
    return (
      <div style={{ padding: '2rem 1rem', textAlign: 'center' }}>
        <div className="serif" style={{ fontSize: '1.5rem', color: 'var(--text-dark)', marginBottom: '1.5rem' }}>
          World
        </div>
        <p style={{ color: 'var(--steel)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          Couldn't load today's digest. Try again?
        </p>
        <button
          onClick={() => loadDigest(true)}
          style={{
            background: 'var(--pink)',
            border: 'none',
            borderRadius: '2rem',
            padding: '0.6rem 1.4rem',
            fontSize: '0.85rem',
            color: 'var(--text-dark)',
            cursor: 'pointer',
          }}
        >
          Try again
        </button>
      </div>
    )
  }

  // ── Digest ───────────────────────────────────────────────────
  const orderedSections = digest?.sections
    ? SECTIONS.map(id => digest.sections.find(s => s.id === id)).filter(Boolean)
    : digest?.sections ?? []

  return (
    <div style={{ padding: '1.25rem 1rem 2rem' }}>

      {/* Header */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="serif" style={{
              fontSize: '1.6rem',
              color: 'var(--text-dark)',
              margin: '0 0 0.2rem',
              fontWeight: 700,
            }}>
              World
            </h1>
            {digest?.generatedAt && (
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--steel)' }}>
                Updated {timeAgo(digest.generatedAt)}
              </p>
            )}
          </div>
          <button
            onClick={() => loadDigest(true)}
            disabled={refreshing}
            style={{
              background: 'none',
              border: '1.5px solid var(--pink)',
              borderRadius: '2rem',
              padding: '0.4rem 0.9rem',
              fontSize: '0.78rem',
              color: refreshing ? 'var(--steel)' : 'var(--text-mid)',
              cursor: refreshing ? 'default' : 'pointer',
            }}
          >
            {refreshing ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>

        <div style={{
          marginTop: '0.75rem',
          fontSize: '0.78rem',
          color: 'var(--steel)',
          fontStyle: 'italic',
        }}>
          Tap a headline to read. Refreshes every morning.
        </div>
      </div>

      {/* Sections */}
      {orderedSections.map(section => (
        <SectionCard key={section.id} section={section} />
      ))}

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <span style={{ color: 'var(--rose)', letterSpacing: '0.4em', fontSize: '0.8rem' }}>✦ ✦ ✦</span>
        <p style={{ fontSize: '0.72rem', color: 'var(--steel)', margin: '0.5rem 0 0' }}>
          Summarized from multiple sources · {digest?.date ?? ''}
        </p>
      </div>

    </div>
  )
}
