import { useState, useRef } from 'react'
import { storeAudio } from '../../services/audioStorage'

function cleanField(raw) {
  return (raw ?? '')
    .replace(/<[^>]+>/g, '')
    .replace(/\[sound:[^\]]+\]/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim()
    .slice(0, 40)
}

async function parseDeck(file) {
  const JSZip      = (await import('jszip')).default
  const initSqlJs  = (await import('sql.js')).default
  const { parseAnkiCards } = await import('../../hooks/useFlashcards')

  const SQL = await initSqlJs({ locateFile: () => '/sql-wasm.wasm' })
  const zip = await JSZip.loadAsync(file)

  const dbEntry = zip.file('collection.anki2') ?? zip.file('collection.anki21')
  if (!dbEntry) throw new Error('No collection.anki2 found in this file.')
  const dbBuffer = await dbEntry.async('arraybuffer')
  const db = new SQL.Database(new Uint8Array(dbBuffer))

  // ── Diagnostic: capture raw field names + 3 sample notes ────────
  const debug = { fieldNames: null, samples: [] }
  try {
    const r = db.exec('SELECT models FROM col LIMIT 1')
    if (r.length) {
      const models = JSON.parse(r[0].values[0][0])
      const keys = Object.keys(models)
      if (keys.length) debug.fieldNames = models[keys[0]]?.flds?.map(f => f.name) ?? null
    }
  } catch {}
  if (!debug.fieldNames) {
    try {
      const r = db.exec('SELECT name FROM fields ORDER BY ntid ASC, ord ASC LIMIT 20')
      if (r.length && r[0].values.length) debug.fieldNames = r[0].values.map(v => String(v[0]))
    } catch {}
  }
  try {
    const r = db.exec('SELECT flds FROM notes LIMIT 3')
    if (r.length) {
      debug.samples = r[0].values.map(row =>
        row[0].split('\x1f').map(cleanField)
      )
    }
  } catch {}
  // ────────────────────────────────────────────────────────────────

  const cards = parseAnkiCards(db)
  db.close()

  const mediaEntry = zip.file('media')
  if (mediaEntry && cards.some(c => c.audioFile)) {
    const mediaJson  = await mediaEntry.async('text')
    const mediaMap   = JSON.parse(mediaJson)
    const reverseMap = Object.fromEntries(
      Object.entries(mediaMap).map(([num, name]) => [name, num])
    )
    const needed = [...new Set(cards.map(c => c.audioFile).filter(Boolean))]
    await Promise.all(
      needed.map(async (filename) => {
        const zipNum   = reverseMap[filename]
        const zipEntry = zipNum != null ? zip.file(zipNum) : null
        if (!zipEntry) return
        const buf = await zipEntry.async('arraybuffer')
        await storeAudio(filename, buf)
      })
    )
  }

  return { cards, debug }
}

export default function ImportDeck({ onImport }) {
  const [status, setStatus]   = useState('idle')
  const [message, setMessage] = useState('')
  const [debug, setDebug]     = useState(null)
  const inputRef = useRef()

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.apkg')) {
      setStatus('error')
      setMessage('Please select an .apkg file exported from Anki.')
      return
    }

    setStatus('loading')
    setMessage('Reading deck…')
    setDebug(null)

    try {
      const { cards, debug } = await parseDeck(file)
      if (cards.length === 0) {
        setStatus('error')
        setMessage('No cards found in this deck.')
        setDebug(debug)
        return
      }
      onImport(cards)
      setStatus('done')
      setMessage(`${cards.length} cards imported.`)
      setDebug(debug)
    } catch (err) {
      setStatus('error')
      setMessage(`Import failed: ${err.message}`)
    }

    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept=".apkg"
        onChange={handleFile}
        style={{ display: 'none' }}
        id="deck-upload"
      />
      <label
        htmlFor="deck-upload"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.5rem 1.1rem',
          background: 'rgba(232,160,160,0.1)',
          border: '1.5px solid rgba(232,160,160,0.35)',
          borderRadius: '2rem',
          fontSize: '0.8rem',
          color: 'var(--text-mid)',
          cursor: status === 'loading' ? 'default' : 'pointer',
          fontWeight: 500,
        }}
      >
        {status === 'loading' ? '…' : '+ Import .apkg deck'}
      </label>

      {message && (
        <p style={{
          marginTop: '0.5rem',
          fontSize: '0.75rem',
          color: status === 'error' ? '#c0635a' : 'var(--steel)',
        }}>
          {message}
        </p>
      )}

      {/* ── Debug panel ── */}
      {debug && (
        <div style={{
          marginTop: '0.6rem',
          background: '#f8f4f4',
          border: '1px solid rgba(140,155,171,0.2)',
          borderRadius: '0.65rem',
          padding: '0.65rem 0.8rem',
          fontSize: '0.68rem',
          color: 'var(--steel)',
          fontFamily: 'monospace',
          lineHeight: 1.6,
        }}>
          <p style={{ margin: '0 0 0.3rem', fontWeight: 700, fontFamily: 'inherit', color: 'var(--text-mid)' }}>
            Field debug
          </p>
          <p style={{ margin: '0 0 0.4rem', fontFamily: 'inherit' }}>
            Names: {debug.fieldNames ? debug.fieldNames.join(' | ') : 'not detected'}
          </p>
          {debug.samples.map((sample, i) => (
            <p key={i} style={{ margin: '0 0 0.15rem', fontFamily: 'inherit', wordBreak: 'break-all' }}>
              Note {i + 1}: {sample.map((f, j) => `[${j}]${f || '∅'}`).join('  ')}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}
