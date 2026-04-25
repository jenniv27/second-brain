/**
 * IndexedDB wrapper for storing Anki audio files locally.
 * Audio blobs are too large for localStorage/Supabase key-value storage.
 */

const DB_NAME    = 'sb-audio'
const STORE_NAME = 'files'
const DB_VERSION = 1

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = e => e.target.result.createObjectStore(STORE_NAME)
    req.onsuccess  = e => resolve(e.target.result)
    req.onerror    = () => reject(req.error)
  })
}

export async function storeAudio(filename, arrayBuffer) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx  = db.transaction(STORE_NAME, 'readwrite')
    const req = tx.objectStore(STORE_NAME).put(arrayBuffer, filename)
    req.onsuccess = resolve
    req.onerror   = () => reject(req.error)
  })
}

export async function getAudio(filename) {
  if (!filename) return null
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx  = db.transaction(STORE_NAME, 'readonly')
      const req = tx.objectStore(STORE_NAME).get(filename)
      req.onsuccess = () => resolve(req.result ?? null)
      req.onerror   = () => reject(req.error)
    })
  } catch {
    return null
  }
}

export async function playAudio(filename) {
  const buffer = await getAudio(filename)
  if (!buffer) return false
  try {
    const blob = new Blob([buffer], { type: 'audio/mpeg' })
    const url  = URL.createObjectURL(blob)
    const audio = new Audio(url)
    audio.onended = () => URL.revokeObjectURL(url)
    await audio.play()
    return true
  } catch {
    return false
  }
}
