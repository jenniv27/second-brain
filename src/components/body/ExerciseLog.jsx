import { EFFORT_OPTIONS } from '../../data/bodyData'

export default function ExerciseLog({ exercise, onUpdate }) {
  return (
    <div>
      {/* Effort rating */}
      <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '0.9rem' }}>
        {EFFORT_OPTIONS.map(opt => {
          const selected = exercise.effort === opt.value
          return (
            <button
              key={opt.value}
              onClick={() => onUpdate({ effort: selected ? null : opt.value })}
              style={{
                flex: 1,
                background: selected ? 'var(--pink)' : 'var(--base)',
                border: `1.5px solid ${selected ? 'var(--rose)' : 'rgba(232,160,160,0.3)'}`,
                borderRadius: '0.85rem',
                padding: '0.55rem 0.25rem',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: selected ? 500 : 400,
                color: selected ? 'var(--text-dark)' : 'var(--text-mid)',
                transition: 'all 0.2s ease',
                transform: selected ? 'scale(1.03)' : 'scale(1)',
              }}
            >
              {opt.label}
            </button>
          )
        })}
        <button
          onClick={() => onUpdate({ effort: null })}
          style={{
            background: exercise.effort === null && exercise._rested !== undefined ? 'var(--pink)' : 'var(--base)',
            border: '1.5px solid rgba(232,160,160,0.3)',
            borderRadius: '0.85rem',
            padding: '0.55rem 0.4rem',
            cursor: 'pointer',
            fontSize: '0.72rem',
            color: 'var(--steel)',
            whiteSpace: 'nowrap',
          }}
        >
          Rest day
        </button>
      </div>

      {/* Optional note */}
      <textarea
        placeholder="Any notes? (optional)"
        value={exercise.note}
        onChange={e => onUpdate({ note: e.target.value })}
        rows={2}
        style={{
          width: '100%',
          background: 'var(--base)',
          border: '1px solid rgba(232,160,160,0.25)',
          borderRadius: '0.75rem',
          padding: '0.6rem 0.8rem',
          fontSize: '0.82rem',
          color: 'var(--text-dark)',
          fontFamily: 'Lora, Georgia, serif',
          fontStyle: 'italic',
          resize: 'none',
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />
    </div>
  )
}
