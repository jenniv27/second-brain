import { useState, useRef } from 'react'
import { storeAudio } from '../../services/audioStorage'

async function parseDeck(file) {
  const JSZip      = (await import('jszip')).default
  const initSqlJs  = (await import('sql.js')).default
  const { parseAnkiCards } = await import('../../hooks/useFlashcards')

  const SQL = await initSqlJs({ locateFile: () => '/sql-wasm.wasm' })
  const zip = await JSZip.loadAsync(file)

  // Load the SQLite database
  const dbEntry = zip.file('collection.anki2') ?? zip.file('collection.anki21')
  if (!dbEntry) throw new Error('No collection.anki2 found in this file.')
  const dbBuffer = await dbEntry.async('arraybuffer')
  const db = new SQL.Database(new Uint8Array(dbBuffer))

  // Parse cards
  const cards = parseAnkiCards(db)
  db.close()

  // Build reverse map: original filename → zip entry number
  const mediaEntry = zip.file('media')
  if (mediaEntry && cards.some(c => c.audioFile)) {
    const mediaJson  = await mediaEntry.async('text')
    const mediaMap   = JSON.parse(mediaJson) // { "0": "audio.mp3", "1": "word.mp3" }
    const reverseMap = Object.fromEntries(
      Object.entries(mediaMap).map(([num, name]) => [name, num])
    )

    // Collect unique audio files needed
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

  return cards
}

export default function ImportDeck({ onImport }) {
  const [status, setStatus]   = useState('idle') // idle | loading | done | error
  const [message, setMessage] = useState('')
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

    try {
      const cards = await parseDeck(file)
      if (cards.length === 0) {
        setStatus('error')
        setMessage('No cards found in this deck.')
        return
      }
      onImport(cards)
      setStatus('done')
      setMessage(`${cards.length} cards imported.`)
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
    </div>
  )
}
