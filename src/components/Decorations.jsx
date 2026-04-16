/* ─────────────────────────────────────────────
   Decorative motif components
   Inspired by: scattered + × ° ✦ · wings bow
───────────────────────────────────────────── */

/** Tiny ribbon bow SVG */
export function Bow({ size = 22, color = 'var(--rose)', opacity = 0.45, style = {} }) {
  return (
    <svg
      width={size}
      height={size * 0.62}
      viewBox="0 0 28 18"
      fill="none"
      stroke={color}
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ opacity, display: 'inline-block', ...style }}
    >
      {/* left loop */}
      <path d="M14 9 C11 4 4 2 2 5 C0 8 4 12 14 9 Z" />
      {/* right loop */}
      <path d="M14 9 C17 4 24 2 26 5 C28 8 24 12 14 9 Z" />
      {/* knot dot */}
      <circle cx="14" cy="9" r="1.4" fill={color} stroke="none" />
      {/* tail left */}
      <path d="M14 9 C11 12 7 15 5 14" />
      {/* tail right */}
      <path d="M14 9 C17 12 21 15 23 14" />
    </svg>
  )
}

/** Small feathered wings SVG */
export function Wings({ size = 32, color = 'var(--rose)', opacity = 0.35, style = {} }) {
  return (
    <svg
      width={size}
      height={size * 0.45}
      viewBox="0 0 40 18"
      fill="none"
      stroke={color}
      strokeWidth="1.05"
      strokeLinecap="round"
      style={{ opacity, display: 'inline-block', ...style }}
    >
      {/* left wing — three feather arcs */}
      <path d="M20 9 C16 5 8 3 4 6" />
      <path d="M20 9 C15 7 7 7 3 10" />
      <path d="M20 9 C15 10 8 13 5 12" />
      {/* right wing */}
      <path d="M20 9 C24 5 32 3 36 6" />
      <path d="M20 9 C25 7 33 7 37 10" />
      <path d="M20 9 C25 10 32 13 35 12" />
      {/* center dot */}
      <circle cx="20" cy="9" r="1.2" fill={color} stroke="none" />
    </svg>
  )
}

/** A horizontal ornate divider: ° · + ✦ ··· ✦ + · ° */
export function OrnateDivider({ style = {} }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.3rem',
      color: 'var(--rose)',
      opacity: 0.55,
      userSelect: 'none',
      ...style,
    }}>
      <span style={{ fontSize: '0.45rem' }}>°</span>
      <span style={{ fontSize: '0.38rem' }}>·</span>
      <span style={{ fontSize: '0.55rem', lineHeight: 1 }}>+</span>
      <span style={{ fontSize: '0.6rem'  }}>✦</span>
      <div style={{ width: '1.5rem', height: '1px', background: 'rgba(232,160,160,0.4)', margin: '0 0.1rem' }} />
      <Bow size={16} color="var(--rose)" opacity={0.6} />
      <div style={{ width: '1.5rem', height: '1px', background: 'rgba(232,160,160,0.4)', margin: '0 0.1rem' }} />
      <span style={{ fontSize: '0.6rem'  }}>✦</span>
      <span style={{ fontSize: '0.55rem', lineHeight: 1 }}>+</span>
      <span style={{ fontSize: '0.38rem' }}>·</span>
      <span style={{ fontSize: '0.45rem' }}>°</span>
    </div>
  )
}

/** Cluster of scattered motifs for corner decoration */
export function MotifCluster({ style = {}, flip = false }) {
  const mirror = flip ? { transform: 'scaleX(-1)' } : {}
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-flex',
        position: 'relative',
        width: '3.5rem',
        height: '2.8rem',
        ...style,
        ...mirror,
      }}
    >
      <M t="0.1rem"  l="1.6rem" s="0.7rem"  o={0.5}  ch="✦" />
      <M t="0.05rem" l="0.5rem" s="0.45rem" o={0.3}  ch="✦" />
      <M t="1.1rem"  l="0rem"   s="0.55rem" o={0.25} ch="✧" />
      <M t="0.2rem"  l="2.8rem" s="0.5rem"  o={0.2}  ch="+" />
      <M t="1rem"    l="2.5rem" s="0.42rem" o={0.2}  ch="°" />
      <M t="0.7rem"  l="1.1rem" s="0.38rem" o={0.18} ch="·" />
      <M t="1.6rem"  l="0.4rem" s="0.4rem"  o={0.15} ch="×" />
      <M t="1.5rem"  l="2.0rem" s="0.38rem" o={0.18} ch="°" />
    </span>
  )
}

/** Mini positioned motif helper */
function M({ t, l, s, o, ch }) {
  return (
    <span style={{
      position: 'absolute',
      top: t, left: l,
      fontSize: s,
      opacity: o,
      color: 'var(--rose)',
      lineHeight: 1,
      animation: 'starShimmer 4s ease-in-out infinite',
      animationDelay: `${Math.random() * 3}s`,
    }}>
      {ch}
    </span>
  )
}

/** Inline row of micro motifs for card headers */
export function MicroMotifs({ count = 4 }) {
  const chars = ['✦', '+', '°', '·', '✧', '×']
  return (
    <span aria-hidden="true" style={{ display: 'inline-flex', gap: '0.25rem', alignItems: 'center', opacity: 0.4 }}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} style={{
          fontSize: i % 2 === 0 ? '0.5rem' : '0.38rem',
          color: 'var(--rose)',
          lineHeight: 1,
        }}>
          {chars[i % chars.length]}
        </span>
      ))}
    </span>
  )
}
