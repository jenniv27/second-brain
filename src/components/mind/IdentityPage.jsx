import { OrnateDivider, MicroMotifs } from '../Decorations'

export default function IdentityPage({ statements, onClose }) {
  return (
    <div className="fade-up" style={{ padding: '1.5rem 1.25rem 0' }}>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <h2 style={{
          fontFamily: 'Lora, Georgia, serif',
          fontSize: '1.3rem',
          fontWeight: 500,
          color: 'var(--text-dark)',
          margin: 0,
        }}>
          Who you are <span style={{ color: 'var(--rose)', fontSize: '0.9rem' }}>✦</span>
        </h2>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', fontSize: '0.78rem', color: 'var(--steel)', cursor: 'pointer' }}
        >
          ← Back
        </button>
      </div>

      <p style={{
        fontFamily: 'Lora, Georgia, serif',
        fontSize: '0.85rem',
        fontStyle: 'italic',
        color: 'var(--text-mid)',
        margin: '0 0 1.25rem',
        lineHeight: 1.6,
      }}>
        These statements are written from evidence — things you have actually done, not things you intend to do. They appear here as patterns emerge.
      </p>

      <OrnateDivider style={{ marginBottom: '1.25rem' }} />

      {statements.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          <MicroMotifs count={4} />
          <p style={{
            fontFamily: 'Lora, Georgia, serif',
            fontSize: '0.9rem',
            fontStyle: 'italic',
            color: 'var(--steel)',
            margin: '0.75rem 0 0',
            lineHeight: 1.7,
          }}>
            Statements will appear here as your patterns emerge.<br />
            They are earned, not declared.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {statements.map((s, i) => (
            <div key={i} style={{
              padding: '0.85rem 1.1rem',
              background: 'linear-gradient(135deg, rgba(244,194,194,0.1) 0%, #fffbfb 100%)',
              border: '1px solid rgba(232,160,160,0.2)',
              borderRadius: '1rem',
            }}>
              <p style={{
                fontFamily: 'Lora, Georgia, serif',
                fontSize: '0.95rem',
                color: 'var(--text-dark)',
                margin: 0,
                lineHeight: 1.6,
              }}>
                {s.text}
              </p>
              <p style={{ fontSize: '0.65rem', color: 'var(--steel)', margin: '0.35rem 0 0' }}>
                {s.addedAt}
              </p>
            </div>
          ))}
        </div>
      )}

      <div style={{ textAlign: 'center', margin: '1.5rem 0 0.5rem' }}>
        <MicroMotifs count={5} />
      </div>
    </div>
  )
}
