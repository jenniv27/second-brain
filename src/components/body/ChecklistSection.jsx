import { Check } from 'lucide-react'

export default function ChecklistSection({ title, items, checked, onToggle, dim = false }) {
  if (!items.length) return null

  const doneCount = items.filter(item => checked[item.id]).length

  return (
    <div style={{ marginBottom: '0.25rem' }}>
      {/* Section header */}
      {title && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.6rem',
          paddingBottom: '0.4rem',
          borderBottom: '1px solid rgba(232,160,160,0.15)',
        }}>
          <p style={{
            fontSize: '0.72rem',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--steel)',
            margin: 0,
          }}>
            {title}
          </p>
          <span style={{
            fontSize: '0.68rem',
            color: doneCount === items.length ? 'var(--rose)' : 'var(--steel)',
            opacity: doneCount === items.length ? 1 : 0.6,
            fontFamily: 'Lora, Georgia, serif',
            fontStyle: 'italic',
            transition: 'color 0.3s ease',
          }}>
            {doneCount}/{items.length}
          </span>
        </div>
      )}

      {/* Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
        {items.map(item => {
          const done = !!checked[item.id]
          return (
            <button
              key={item.id}
              onClick={() => onToggle(item.id)}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.7rem',
                textAlign: 'left',
                opacity: dim && !item.asNeeded && done ? 0.55 : 1,
                transition: 'opacity 0.2s ease',
              }}
            >
              {/* Checkbox */}
              <div style={{
                width: '1.2rem',
                height: '1.2rem',
                borderRadius: '50%',
                border: done
                  ? '1.5px solid var(--rose)'
                  : '1.5px solid rgba(232,160,160,0.45)',
                background: done
                  ? 'var(--rose)'
                  : 'rgba(244,194,194,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '0.05rem',
                transition: 'all 0.2s ease',
              }}>
                {done && <Check size={8} strokeWidth={3} color="#fff" />}
              </div>

              {/* Label + note */}
              <div>
                <span style={{
                  fontSize: '0.875rem',
                  color: done ? 'var(--text-mid)' : 'var(--text-dark)',
                  textDecoration: done ? 'line-through' : 'none',
                  textDecorationColor: 'rgba(232,160,160,0.5)',
                  transition: 'color 0.2s ease',
                  lineHeight: 1.3,
                }}>
                  {item.label}
                  {item.asNeeded && (
                    <span style={{
                      marginLeft: '0.4rem',
                      fontSize: '0.62rem',
                      fontStyle: 'italic',
                      color: 'var(--steel)',
                      textDecoration: 'none',
                    }}>
                      as needed
                    </span>
                  )}
                </span>
                {item.note && (
                  <p style={{
                    margin: '0.1rem 0 0',
                    fontSize: '0.72rem',
                    color: 'var(--steel)',
                    lineHeight: 1.35,
                  }}>
                    {item.note}
                  </p>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
