import { useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import NetWorthModule   from '../components/goals/NetWorthModule'
import StepsModule      from '../components/goals/StepsModule'
import WeightModule     from '../components/goals/WeightModule'
import CookingModule    from '../components/goals/CookingModule'
import SocialModule     from '../components/goals/SocialModule'
import MandarinModule   from '../components/goals/MandarinModule'
import WaterModule      from '../components/goals/WaterModule'
import { OrnateDivider, MicroMotifs, Wings, Bow } from '../components/Decorations'

function Section({ children }) {
  return (
    <div style={{
      background: 'var(--base)',
      border: '1px solid rgba(232,160,160,0.18)',
      borderRadius: '1.25rem',
      padding: '1.1rem 1.15rem',
      boxShadow: '0 2px 12px rgba(232,160,160,0.07)',
    }}>
      {children}
    </div>
  )
}

export default function GoalsView({ onBack }) {
  const [showRecipes, setShowRecipes] = useState(false)

  return (
    <div className="fade-up">

      {/* ── Header ── */}
      <header style={{
        position: 'relative',
        padding: '1.75rem 1.25rem 1.4rem',
        background: 'linear-gradient(160deg, #f9d8d8 0%, #fce8e8 45%, var(--base) 100%)',
        borderBottom: '1px solid rgba(232,160,160,0.15)',
        overflow: 'hidden',
      }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.2rem',
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '0.8rem', color: 'var(--steel)', padding: 0,
            marginBottom: '0.9rem',
          }}
        >
          <ChevronLeft size={14} strokeWidth={2} />
          Home
        </button>

        <h1 style={{
          fontFamily: 'Lora, Georgia, serif', fontSize: '1.8rem', fontWeight: 500,
          color: 'var(--text-dark)', margin: '0 0 0.2rem', lineHeight: 1.2,
        }}>
          Goals{' '}
          <span className="star-accent" style={{ fontSize: '1rem' }}>✦</span>
        </h1>
        <p style={{
          fontFamily: 'Lora, Georgia, serif', fontSize: '0.88rem', fontStyle: 'italic',
          color: 'var(--text-mid)', margin: 0,
        }}>
          Quietly becoming.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '1rem' }}>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, rgba(232,160,160,0.5), transparent)' }} />
          <Wings size={32} color="var(--rose)" opacity={0.35} />
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, rgba(232,160,160,0.5), transparent)' }} />
        </div>
        <div style={{ textAlign: 'center', marginTop: '0.35rem' }}>
          <MicroMotifs count={5} />
        </div>
      </header>

      {/* ── Modules ── */}
      <div style={{ padding: '1.25rem 1.25rem 0', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>

        <Section>
          <NetWorthModule />
        </Section>

        <Section>
          <StepsModule />
        </Section>

        <Section>
          <WaterModule />
        </Section>

        <div style={{ margin: '0.2rem 0' }}>
          <OrnateDivider />
        </div>

        <Section>
          <WeightModule />
        </Section>

        <Section>
          <CookingModule
            showRecipes={showRecipes}
            onShowRecipes={() => setShowRecipes(true)}
            onHideRecipes={() => setShowRecipes(false)}
          />
        </Section>

        <div style={{ margin: '0.2rem 0' }}>
          <OrnateDivider />
        </div>

        <Section>
          <SocialModule />
        </Section>

        <Section>
          <MandarinModule />
        </Section>

        {/* ── Footer ── */}
        <div style={{ textAlign: 'center', margin: '0.5rem 0 1.25rem' }}>
          <Bow size={20} color="var(--rose)" opacity={0.3} />
          <div style={{ marginTop: '0.3rem' }}>
            <MicroMotifs count={5} />
          </div>
        </div>

      </div>
    </div>
  )
}
