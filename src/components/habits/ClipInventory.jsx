import { COLORS, CLIP_HEX, getCashInOptions } from '../../hooks/useHabits'

function ClipDot({ color, count }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
      <div style={{
        width: '2rem', height: '2rem',
        borderRadius: '50%',
        background: CLIP_HEX[color],
        border: `2px solid ${count > 0 ? CLIP_HEX[color] : 'rgba(140,155,171,0.2)'}`,
        opacity: count > 0 ? 1 : 0.25,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: count > 0 ? `0 2px 6px ${CLIP_HEX[color]}55` : 'none',
        transition: 'all 0.2s',
      }} />
      <span style={{ fontSize: '0.65rem', color: count > 0 ? 'var(--text-mid)' : 'var(--steel)', fontWeight: count > 0 ? 600 : 400 }}>
        {count}
      </span>
    </div>
  )
}

export default function ClipInventory({ inventory, drawnClip, onSelectTier }) {
  const options = getCashInOptions(inventory)
  const hasUpgrade = options.some(o => o.tier > 1)

  return (
    <div style={{ padding: '0 1.1rem' }}>
      {/* Newly drawn clip */}
      {drawnClip && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          background: 'white',
          border: `1.5px solid ${CLIP_HEX[drawnClip]}44`,
          borderRadius: '1rem',
          padding: '0.75rem 1rem',
          marginBottom: '1rem',
          boxShadow: `0 2px 8px ${CLIP_HEX[drawnClip]}22`,
        }}>
          <div style={{
            width: '2.25rem', height: '2.25rem',
            borderRadius: '50%',
            background: CLIP_HEX[drawnClip],
            boxShadow: `0 2px 8px ${CLIP_HEX[drawnClip]}66`,
            flexShrink: 0,
          }} />
          <div>
            <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-dark)' }}>
              You drew a <span style={{ color: CLIP_HEX[drawnClip] }}>{drawnClip}</span> clip
              {drawnClip === 'gold' && ' ★'}
            </p>
            <p style={{ margin: '0.1rem 0 0', fontSize: '0.72rem', color: 'var(--steel)' }}>
              {drawnClip === 'gold' ? 'Instant Tier 3!' : 'Added to your inventory'}
            </p>
          </div>
        </div>
      )}

      {/* Inventory grid */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        background: 'white', border: '1px solid rgba(232,160,160,0.18)',
        borderRadius: '1rem', padding: '0.85rem 1rem',
        marginBottom: '1rem',
      }}>
        {[...COLORS, 'gold'].map(c => (
          <ClipDot key={c} color={c} count={inventory[c] ?? 0} />
        ))}
      </div>

      {/* Cash-in options */}
      <p style={{ margin: '0 0 0.5rem', fontSize: '0.7rem', color: 'var(--steel)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        Choose your tier
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {options.map(opt => (
          <button
            key={opt.tier}
            onClick={() => onSelectTier(opt)}
            style={{
              padding: '0.7rem 1rem',
              background: opt.tier === 3
                ? 'linear-gradient(135deg, #4db6ac 0%, #80cbc4 100%)'
                : opt.tier === 2
                ? 'linear-gradient(135deg, #8b7cd4 0%, #9fa8da 100%)'
                : 'white',
              border: opt.tier === 1 ? '1px solid rgba(232,160,160,0.25)' : 'none',
              borderRadius: '0.85rem',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: opt.tier === 1 ? 'var(--text-mid)' : 'white',
              cursor: 'pointer',
              textAlign: 'left',
              boxShadow: opt.tier > 1 ? '0 2px 8px rgba(0,0,0,0.12)' : 'none',
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {!hasUpgrade && (
        <p style={{ fontSize: '0.72rem', color: 'var(--steel)', fontStyle: 'italic', marginTop: '0.5rem' }}>
          Collect 2 matching clips to unlock Tier 2.
        </p>
      )}
    </div>
  )
}
