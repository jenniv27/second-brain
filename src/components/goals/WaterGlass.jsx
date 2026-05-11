import { useState, useEffect, useRef } from 'react'

const GW = 64   // inner glass width
const GH = 94   // inner glass height

// Bezier wave path for a 2-cycle wave across GW*2 px
function wavePath(filled = true) {
  const w = GW
  const path =
    `M0 8 C${w/4} 0 ${w*3/4} 16 ${w} 8 C${w+w/4} 0 ${w+w*3/4} 16 ${w*2} 8`
  return filled ? `${path} V 16 H 0 Z` : path
}

export default function WaterGlass({ glasses, goal, splashTrigger }) {
  const [bubbles, setBubbles]   = useState([])
  const [splashes, setSplashes] = useState([])
  const prevTrigger = useRef(null)
  const nextId      = useRef(0)

  const fillPct = goal > 0 ? Math.min(glasses / goal, 1) : 0
  const goalMet = glasses >= goal && goal > 0

  useEffect(() => {
    if (prevTrigger.current === null) { prevTrigger.current = splashTrigger; return }
    if (splashTrigger === prevTrigger.current) return
    prevTrigger.current = splashTrigger

    // Splash ripple
    const sid = nextId.current++
    setSplashes(prev => [...prev, sid])
    setTimeout(() => setSplashes(prev => prev.filter(id => id !== sid)), 800)

    // Bubbles
    const count = 3 + Math.floor(Math.random() * 4)
    const bs = Array.from({ length: count }, (_, i) => ({
      id:    nextId.current++,
      x:     6 + Math.random() * (GW - 12),
      size:  2.5 + Math.random() * 3.5,
      dur:   700 + Math.random() * 600,
      delay: i * 80,
    }))
    setBubbles(prev => [...prev, ...bs])
    const ids = new Set(bs.map(b => b.id))
    setTimeout(() => setBubbles(prev => prev.filter(b => !ids.has(b.id))), 1800)
  }, [splashTrigger])

  const waterColor    = goalMet ? 'rgba(232,160,160,0.25)' : 'rgba(100,185,240,0.2)'
  const waveStroke    = goalMet ? 'rgba(232,160,160,0.55)' : 'rgba(100,185,240,0.5)'
  const waveFill      = goalMet ? 'rgba(232,160,160,0.3)'  : 'rgba(100,185,240,0.3)'
  const bubbleStroke  = goalMet ? 'rgba(232,160,160,0.85)' : 'rgba(130,205,255,0.8)'
  const splashStroke  = goalMet ? 'rgba(232,160,160,0.8)'  : 'rgba(100,185,240,0.75)'
  const outlineColor  = goalMet ? 'rgba(220,140,150,0.5)'  : 'rgba(100,170,220,0.4)'

  return (
    <div style={{ position: 'relative', display: 'inline-block', width: 80, height: 110 }}>
      <style>{`
        @keyframes wgWave {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes wgBubble {
          0%   { opacity: 0.9; transform: translateY(0) scale(1); }
          80%  { opacity: 0.3; transform: translateY(-44px) scale(0.8); }
          100% { opacity: 0;   transform: translateY(-56px) scale(0.4); }
        }
        @keyframes wgSplash {
          0%   { transform: translateX(-50%) scale(0.2); opacity: 1; }
          100% { transform: translateX(-50%) scale(1);   opacity: 0; }
        }
        @keyframes wgGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(232,160,160,0); }
          50%       { box-shadow: 0 0 14px 4px rgba(232,160,160,0.3); }
        }
      `}</style>

      {/* Clipping container = glass inner */}
      <div style={{
        position: 'absolute',
        top: 8, left: 8,
        width: GW, height: GH,
        borderRadius: 6,
        overflow: 'hidden',
        background: 'rgba(235,247,255,0.35)',
        animation: goalMet ? 'wgGlow 2s ease-in-out infinite' : 'none',
      }}>
        {/* Water fill */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: `${fillPct * 100}%`,
          transition: 'height 0.85s cubic-bezier(0.34, 1.2, 0.64, 1)',
          background: waterColor,
        }}>
          {/* Wave surface */}
          {fillPct > 0 && (
            <div style={{
              position: 'absolute',
              top: -8, left: 0,
              width: '200%', height: 16,
              animation: 'wgWave 2.5s linear infinite',
              willChange: 'transform',
            }}>
              <svg width="100%" height={16} viewBox={`0 0 ${GW * 2} 16`} preserveAspectRatio="none">
                <path d={wavePath(false)} fill="none" stroke={waveStroke} strokeWidth="1.5" />
                <path d={wavePath(true)}  fill={waveFill} />
              </svg>
            </div>
          )}

          {/* Bubbles */}
          {bubbles.map(b => (
            <div key={b.id} style={{
              position: 'absolute',
              bottom: '5%',
              left: b.x,
              width: b.size,
              height: b.size,
              borderRadius: '50%',
              border: `1px solid ${bubbleStroke}`,
              background: 'rgba(210,240,255,0.3)',
              animation: `wgBubble ${b.dur}ms ease-out ${b.delay}ms both`,
            }} />
          ))}

          {/* Splash ripple */}
          {splashes.map(sid => (
            <div key={sid} style={{
              position: 'absolute',
              top: 4,
              left: '50%',
              width: 32, height: 9,
              borderRadius: '50%',
              border: `1.5px solid ${splashStroke}`,
              animation: 'wgSplash 0.7s ease-out forwards',
            }} />
          ))}
        </div>
      </div>

      {/* Glass outline + shine (SVG overlay, non-interactive) */}
      <svg
        width={80} height={110}
        viewBox="0 0 80 110"
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      >
        <rect x={8} y={8} width={GW} height={GH} rx={6}
          fill="none"
          stroke={outlineColor}
          strokeWidth="1.5"
        />
        <path
          d="M 14 13 Q 19 11 24 13"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}
