export default function PlaceholderTab({ name }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      gap: '0.75rem',
      color: 'var(--steel)',
    }}>
      <p className="serif" style={{
        fontSize: '1.1rem',
        color: 'var(--text-mid)',
        margin: 0,
        fontStyle: 'italic',
      }}>
        {name} is coming soon
      </p>
      <span style={{ fontSize: '0.8rem', color: 'var(--rose)', letterSpacing: '0.3em' }}>✦ ✦ ✦</span>
    </div>
  )
}
