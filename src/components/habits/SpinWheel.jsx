import { useState } from 'react'

const CX = 150, CY = 150, R = 132

function toRad(deg) { return (deg - 90) * Math.PI / 180 }

function segPath(startDeg, endDeg) {
  const x1 = CX + R * Math.cos(toRad(startDeg))
  const y1 = CY + R * Math.sin(toRad(startDeg))
  const x2 = CX + R * Math.cos(toRad(endDeg))
  const y2 = CY + R * Math.sin(toRad(endDeg))
  const large = endDeg - startDeg > 180 ? 1 : 0
  return `M${CX} ${CY} L${x1.toFixed(1)} ${y1.toFixed(1)} A${R} ${R} 0 ${large} 1 ${x2.toFixed(1)} ${y2.toFixed(1)}Z`
}

function buildSegs(segments) {
  let cur = 0
  return segments.map(s => {
    const start = cur
    const end   = cur + (s.pct / 100) * 360
    const mid   = (start + end) / 2
    cur = end
    return { ...s, start, end, mid }
  })
}

function weightedPick(builtSegs) {
  let r = Math.random() * 100
  for (const s of builtSegs) {
    r -= s.pct
    if (r <= 0) return s
  }
  return builtSegs[builtSegs.length - 1]
}

export const MAIN_SEGMENTS = [
  { id: 'T1',      label: 'T1',    pct: 40, color: '#e48fa8' },
  { id: 'T2',      label: 'T2',    pct: 30, color: '#8b7cd4' },
  { id: 'T3',      label: 'T3',    pct: 20, color: '#4db6ac' },
  { id: 'BONUS',   label: 'BONUS', pct:  8, color: '#ffa000' },
  { id: 'JACKPOT', label: '★',     pct:  2, color: '#f9a825' },
]

export const BONUS_SEGMENTS = [
  { id: '75',    label: '75%',   pct: 45, color: '#e57373' },
  { id: '50',    label: '50%',   pct: 30, color: '#9575cd' },
  { id: '25',    label: '25%',   pct: 15, color: '#a1887f' },
  { id: 'FREE',  label: 'FREE',  pct:  7, color: '#4db6ac' },
  { id: 'EXTRA', label: 'EXTRA', pct:  3, color: '#ffa000' },
]

export default function SpinWheel({ segments = MAIN_SEGMENTS, onResult, spinLabel = 'SPIN', disabled = false }) {
  const [totalRot, setTotalRot] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const built = buildSegs(segments)

  function spin() {
    if (spinning || disabled) return
    const result = weightedPick(built)

    // Add random jitter within the segment for realism
    const jitter = (Math.random() - 0.5) * (result.end - result.start) * 0.5
    const targetMid = result.mid + jitter

    setTotalRot(prev => {
      const curAngle = prev % 360
      const land = ((targetMid - curAngle) + 360) % 360
      const extra = (5 + Math.floor(Math.random() * 3)) * 360
      return prev + extra + land
    })
    setSpinning(true)
    setTimeout(() => {
      setSpinning(false)
      onResult(result)
    }, 4200)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
      {/* Wheel + pointer wrapper */}
      <div style={{ position: 'relative', width: 264, height: 264 }}>
        {/* Fixed pointer triangle at top */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0, height: 0,
          borderLeft:  '11px solid transparent',
          borderRight: '11px solid transparent',
          borderTop:   '22px solid var(--text-dark)',
          zIndex: 10,
          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))',
        }} />
        {/* Rotating wheel */}
        <svg
          width={264} height={264}
          viewBox="0 0 300 300"
          style={{
            display: 'block',
            transform: `rotate(${totalRot}deg)`,
            transition: spinning
              ? 'transform 4.2s cubic-bezier(0.17, 0.67, 0.12, 0.99)'
              : 'none',
          }}
        >
          {/* Outer ring */}
          <circle cx={CX} cy={CY} r={R + 4} fill="rgba(0,0,0,0.06)" />
          {built.map((s, i) => {
            const midRad = toRad(s.mid)
            const lx = CX + R * 0.63 * Math.cos(midRad)
            const ly = CY + R * 0.63 * Math.sin(midRad)
            const fs = s.pct >= 20 ? 16 : s.pct >= 8 ? 11 : 8
            return (
              <g key={i}>
                <path
                  d={segPath(s.start, s.end)}
                  fill={s.color}
                  stroke="white"
                  strokeWidth={2.5}
                />
                <text
                  x={lx.toFixed(1)} y={ly.toFixed(1)}
                  textAnchor="middle" dominantBaseline="middle"
                  fill="white" fontSize={fs} fontWeight="800"
                  fontFamily="DM Sans, sans-serif"
                  style={{ userSelect: 'none' }}
                >
                  {s.label}
                </text>
              </g>
            )
          })}
          {/* Center hub */}
          <circle cx={CX} cy={CY} r={18} fill="white" stroke="rgba(0,0,0,0.1)" strokeWidth={1.5} />
        </svg>
      </div>

      <button
        onClick={spin}
        disabled={spinning || disabled}
        style={{
          padding: '0.75rem 2.5rem',
          background: spinning
            ? 'rgba(140,155,171,0.15)'
            : 'linear-gradient(135deg, var(--rose) 0%, rgba(232,160,160,0.8) 100%)',
          border: 'none',
          borderRadius: '2rem',
          fontSize: '1rem',
          fontWeight: 700,
          color: spinning ? 'var(--steel)' : 'white',
          cursor: spinning || disabled ? 'default' : 'pointer',
          letterSpacing: '0.06em',
          boxShadow: spinning ? 'none' : '0 3px 14px rgba(232,160,160,0.35)',
          transition: 'all 0.2s',
        }}
      >
        {spinning ? 'Spinning…' : spinLabel}
      </button>
    </div>
  )
}
