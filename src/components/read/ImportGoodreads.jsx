import { useRef, useState } from 'react'
import { Upload } from 'lucide-react'
import { parseCSV } from '../../hooks/useBooks'

export default function ImportGoodreads({ onImport }) {
  const inputRef = useRef(null)
  const [status, setStatus] = useState(null) // null | 'loading' | { count } | 'error'

  function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setStatus('loading')

    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const parsed = parseCSV(ev.target.result)
        if (parsed.length === 0) {
          setStatus('error')
          return
        }
        const count = onImport(parsed)
        setStatus({ count: count ?? parsed.length })
        setTimeout(() => setStatus(null), 2500)
      } catch {
        setStatus('error')
      }
    }
    reader.onerror = () => setStatus('error')
    reader.readAsText(file)

    // Reset input so the same file can be re-imported
    e.target.value = ''
  }

  const label = status === 'loading'
    ? 'Reading…'
    : status === 'error'
    ? 'Import failed'
    : status?.count != null
    ? `✓ ${status.count} books`
    : 'Import CSV'

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        onChange={handleFile}
        style={{ display: 'none' }}
      />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={status === 'loading'}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
          background: status?.count != null
            ? 'rgba(232,160,160,0.15)'
            : 'white',
          border: '1px solid rgba(232,160,160,0.3)',
          borderRadius: '0.65rem',
          padding: '0.38rem 0.75rem',
          fontSize: '0.75rem',
          fontWeight: 500,
          color: status === 'error' ? '#c0635a' : 'var(--rose)',
          cursor: status === 'loading' ? 'default' : 'pointer',
          transition: 'background 0.15s',
        }}
      >
        <Upload size={12} strokeWidth={2} />
        {label}
      </button>
    </>
  )
}
