import { useState } from 'react'
import { MicroMotifs } from '../components/Decorations'
import ImportGoodreads from '../components/read/ImportGoodreads'
import BookCard from '../components/read/BookCard'
import { useBooks } from '../hooks/useBooks'

const SHELF_META = [
  { key: 'currentlyReading', label: 'Currently reading', emptyText: 'Nothing in progress right now.' },
  { key: 'read',             label: 'Read',              emptyText: null },
  { key: 'toRead',           label: 'Want to read',      emptyText: null },
]

export default function ReadTab() {
  const { books, loaded, shelves, totalBooks, importBooks, clearBooks } = useBooks()
  const [confirmClear, setConfirmClear] = useState(false)
  const [activeShelf, setActiveShelf]   = useState('currentlyReading')

  const shelfBooks = shelves[activeShelf] ?? []

  return (
    <div className="fade-up">

      {/* Header */}
      <header style={{
        padding: '1.5rem 1.25rem 1.1rem',
        background: 'linear-gradient(160deg, #d8e8f9 0%, #e8f0fc 40%, var(--base) 100%)',
        borderBottom: '1px solid rgba(160,192,232,0.15)',
        position: 'relative', overflow: 'hidden',
      }}>
        <span style={{ position: 'absolute', top: '0.6rem', right: '1.2rem', fontSize: '0.7rem', color: '#7a9ec2', opacity: 0.35, animation: 'starShimmer 5s infinite' }}>✦</span>
        <p style={{ fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--steel)', margin: '0 0 0.3rem' }}>Read</p>
        <h1 className="serif" style={{ fontSize: '1.6rem', fontWeight: 500, color: 'var(--text-dark)', margin: '0 0 0.2rem', lineHeight: 1.2 }}>
          Library <span style={{ fontSize: '0.9rem' }}>✦</span>
        </h1>
        <p className="serif" style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--text-mid)', margin: 0 }}>
          Every book leaves a mark.
        </p>
      </header>

      <div style={{ padding: '1.25rem 1.1rem' }}>

        {/* Section header */}
        <div style={{ marginBottom: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ margin: 0, fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--steel)' }}>
            Books
          </p>
          <ImportGoodreads onImport={importBooks} />
        </div>

        {!loaded ? (
          <div style={{ padding: '1.5rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--steel)', fontSize: '0.82rem' }}>Loading…</p>
          </div>
        ) : totalBooks === 0 ? (
          <div style={{
            background: 'white',
            borderRadius: '1.25rem',
            border: '1.5px dashed rgba(160,192,232,0.35)',
            padding: '1.75rem 1.5rem',
            textAlign: 'center',
          }}>
            <p className="serif" style={{ fontSize: '1rem', color: 'var(--text-mid)', fontStyle: 'italic', margin: '0 0 0.4rem' }}>
              No books yet
            </p>
            <p style={{ fontSize: '0.78rem', color: 'var(--steel)', margin: 0 }}>
              Export your Goodreads library and import the CSV above
            </p>
          </div>
        ) : (
          <div>
            {/* Stats */}
            <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1rem' }}>
              {[
                { label: 'Total',            value: totalBooks },
                { label: 'Read',             value: shelves.read.length },
                { label: 'Reading',          value: shelves.currentlyReading.length, accent: shelves.currentlyReading.length > 0 },
                { label: 'Want to read',     value: shelves.toRead.length },
              ].map(({ label, value, accent }) => (
                <div key={label} style={{
                  flex: 1, background: 'white',
                  border: `1px solid ${accent ? 'rgba(160,192,232,0.5)' : 'rgba(160,192,232,0.2)'}`,
                  borderRadius: '0.85rem', padding: '0.7rem 0.4rem', textAlign: 'center',
                }}>
                  <p style={{ margin: '0 0 0.2rem', fontSize: '1.1rem', fontWeight: 700, color: accent ? '#5a8fc0' : 'var(--text-dark)', fontFamily: 'Lora, Georgia, serif' }}>
                    {value}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.6rem', color: 'var(--steel)', textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1.2 }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>

            {/* Shelf tabs */}
            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.85rem' }}>
              {SHELF_META.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveShelf(key)}
                  style={{
                    flex: 1,
                    padding: '0.45rem 0.25rem',
                    borderRadius: '0.65rem',
                    fontSize: '0.72rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    border: activeShelf === key
                      ? '1.5px solid rgba(160,192,232,0.55)'
                      : '1px solid rgba(140,155,171,0.2)',
                    background: activeShelf === key
                      ? 'rgba(160,192,232,0.12)'
                      : 'white',
                    color: activeShelf === key ? '#5a8fc0' : 'var(--steel)',
                    transition: 'all 0.15s',
                  }}
                >
                  {label}
                  <span style={{ marginLeft: '0.3rem', opacity: 0.65 }}>
                    ({shelves[key].length})
                  </span>
                </button>
              ))}
            </div>

            {/* Book list */}
            {shelfBooks.length === 0 ? (
              <p style={{ fontSize: '0.82rem', color: 'var(--steel)', textAlign: 'center', padding: '1rem 0', fontStyle: 'italic' }}>
                {SHELF_META.find(s => s.key === activeShelf)?.emptyText ?? 'No books here yet.'}
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {shelfBooks.map(book => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )}

            {/* Clear library */}
            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              {confirmClear ? (
                <span style={{ fontSize: '0.75rem', color: 'var(--steel)' }}>
                  Delete all {totalBooks} books?{' '}
                  <button
                    onClick={() => { clearBooks(); setConfirmClear(false) }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c0635a', fontWeight: 600, fontSize: '0.75rem' }}
                  >
                    Yes, clear
                  </button>
                  {' · '}
                  <button
                    onClick={() => setConfirmClear(false)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--steel)', fontSize: '0.75rem' }}
                  >
                    Cancel
                  </button>
                </span>
              ) : (
                <button
                  onClick={() => setConfirmClear(true)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.72rem', color: 'var(--steel)', textDecoration: 'underline', opacity: 0.6 }}
                >
                  Clear library
                </button>
              )}
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
          <MicroMotifs count={5} />
        </div>

      </div>
    </div>
  )
}
