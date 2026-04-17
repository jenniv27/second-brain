import { useMandarinCount } from '../../hooks/useGoalsData'

export default function MandarinModule() {
  const { mastered, total } = useMandarinCount()

  return (
    <div>
      <p style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--steel)', margin: '0 0 0.5rem' }}>Mandarin</p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginBottom: '0.35rem' }}>
        <p style={{ fontFamily: 'Lora, Georgia, serif', fontSize: '1.5rem', fontWeight: 500, color: 'var(--text-dark)', margin: 0 }}>
          {mastered}
        </p>
        <p style={{ fontSize: '0.75rem', color: 'var(--steel)', margin: 0 }}>
          word{mastered !== 1 ? 's' : ''} mastered
        </p>
      </div>

      {total > mastered && (
        <p style={{ fontSize: '0.72rem', fontStyle: 'italic', fontFamily: 'Lora, Georgia, serif', color: 'var(--steel)', margin: '0 0 0.2rem', opacity: 0.75 }}>
          {total - mastered} still learning
        </p>
      )}

      {total === 0 && (
        <p style={{ fontSize: '0.72rem', fontStyle: 'italic', fontFamily: 'Lora, Georgia, serif', color: 'var(--steel)', margin: 0, opacity: 0.7 }}>
          Words you master in the Learn tab will appear here.
        </p>
      )}
    </div>
  )
}
