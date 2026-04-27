import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

function StarRating({ rating, max = 5 }) {
  return (
    <span style={{ display: 'inline-flex', gap: '1px', lineHeight: 1 }}>
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          style={{
            fontSize: '0.7rem',
            color: i < rating ? 'var(--rose)' : 'rgba(140,155,171,0.3)',
          }}
        >
          ★
        </span>
      ))}
    </span>
  )
}

export default function BookCard({ book }) {
  const [expanded, setExpanded] = useState(false)

  const hasReview = book.myReview?.trim().length > 0
  const hasNotes  = book.privateNotes?.trim().length > 0
  const hasExtra  = hasReview || hasNotes || book.publisher || book.binding || book.yearPublished

  return (
    <div style={{
      background: 'white',
      border: '1px solid rgba(232,160,160,0.18)',
      borderRadius: '1rem',
      padding: '0.9rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.35rem',
    }}>
      {/* Title + author row */}
      <div>
        <p style={{
          margin: 0,
          fontFamily: 'Lora, Georgia, serif',
          fontSize: '0.9rem',
          fontWeight: 600,
          color: 'var(--text-dark)',
          lineHeight: 1.3,
        }}>
          {book.title}
        </p>
        <p style={{
          margin: '0.15rem 0 0',
          fontSize: '0.75rem',
          color: 'var(--text-mid)',
        }}>
          {book.author}
        </p>
      </div>

      {/* Meta row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
        {book.myRating > 0 && <StarRating rating={book.myRating} />}
        {book.pages > 0 && (
          <span style={{ fontSize: '0.68rem', color: 'var(--steel)' }}>
            {book.pages} pp
          </span>
        )}
        {book.yearPublished > 0 && (
          <span style={{ fontSize: '0.68rem', color: 'var(--steel)' }}>
            {book.yearPublished}
          </span>
        )}
        {book.dateRead && (
          <span style={{ fontSize: '0.68rem', color: 'var(--steel)' }}>
            read {book.dateRead}
          </span>
        )}
        {book.avgRating > 0 && (
          <span style={{ fontSize: '0.68rem', color: 'var(--steel)', opacity: 0.7 }}>
            avg {book.avgRating.toFixed(2)}
          </span>
        )}
      </div>

      {/* Review preview */}
      {hasReview && !expanded && (
        <p style={{
          margin: 0,
          fontSize: '0.78rem',
          color: 'var(--text-mid)',
          fontStyle: 'italic',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          lineHeight: 1.5,
        }}>
          "{book.myReview.trim()}"
        </p>
      )}

      {/* Expanded content */}
      {expanded && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {hasReview && (
            <p style={{
              margin: 0,
              fontSize: '0.78rem',
              color: 'var(--text-mid)',
              fontStyle: 'italic',
              lineHeight: 1.6,
            }}>
              "{book.myReview.trim()}"
            </p>
          )}
          {hasNotes && (
            <p style={{
              margin: 0,
              fontSize: '0.75rem',
              color: 'var(--steel)',
              lineHeight: 1.5,
            }}>
              {book.privateNotes.trim()}
            </p>
          )}
          {(book.publisher || book.binding) && (
            <p style={{ margin: 0, fontSize: '0.68rem', color: 'var(--steel)' }}>
              {[book.publisher, book.binding].filter(Boolean).join(' · ')}
            </p>
          )}
          {book.bookshelves?.length > 0 && (
            <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
              {book.bookshelves.map(s => (
                <span key={s} style={{
                  fontSize: '0.62rem',
                  background: 'rgba(232,160,160,0.1)',
                  border: '1px solid rgba(232,160,160,0.25)',
                  borderRadius: '0.4rem',
                  padding: '0.15rem 0.45rem',
                  color: 'var(--rose)',
                }}>
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Expand toggle */}
      {hasExtra && (
        <button
          onClick={() => setExpanded(v => !v)}
          style={{
            alignSelf: 'flex-start',
            display: 'inline-flex', alignItems: 'center', gap: '0.2rem',
            background: 'none', border: 'none', padding: 0,
            fontSize: '0.68rem', color: 'var(--steel)',
            cursor: 'pointer', marginTop: '0.1rem',
          }}
        >
          {expanded
            ? <><ChevronUp size={11} strokeWidth={2} /> less</>
            : <><ChevronDown size={11} strokeWidth={2} /> more</>
          }
        </button>
      )}
    </div>
  )
}
