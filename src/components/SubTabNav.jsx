export default function SubTabNav({ tabs, active, onChange }) {
  return (
    <div style={{
      display: 'flex',
      gap: '0.35rem',
      padding: '0.75rem 1.1rem 0',
      overflowX: 'auto',
      scrollbarWidth: 'none',
    }}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          style={{
            flexShrink: 0,
            padding: '0.38rem 0.9rem',
            borderRadius: '2rem',
            fontSize: '0.75rem',
            fontWeight: 500,
            cursor: 'pointer',
            border: active === tab.id
              ? '1.5px solid rgba(232,160,160,0.5)'
              : '1px solid rgba(140,155,171,0.2)',
            background: active === tab.id
              ? 'rgba(232,160,160,0.12)'
              : 'white',
            color: active === tab.id ? 'var(--rose)' : 'var(--steel)',
            transition: 'all 0.15s',
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
