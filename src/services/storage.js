/**
 * Cloud storage service — wraps /api/storage (Supabase backend).
 * Always writes to localStorage as an instant cache, then syncs to cloud.
 * Reads prefer cloud; fall back to local cache if cloud is unavailable.
 */

const API = '/api/storage'

// ── Local cache helpers ──────────────────────────────────────────
function cacheGet(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key)
    return raw !== null ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function cacheSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}

// ── Public API ───────────────────────────────────────────────────

/**
 * Get a value. Returns cloud value if available, otherwise local cache.
 */
export async function getItem(key, fallback = null) {
  try {
    const res = await fetch(`${API}?key=${encodeURIComponent(key)}`)
    if (res.ok) {
      const data = await res.json()
      if (data !== null) {
        cacheSet(key, data)
        return data
      }
    }
  } catch {
    // network error — fall through to cache
  }
  return cacheGet(key, fallback)
}

/**
 * Save a value. Writes to local cache immediately, then syncs to cloud.
 */
export async function setItem(key, value) {
  cacheSet(key, value)
  try {
    await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value }),
    })
  } catch {
    // network error — value is still in local cache
  }
}

/**
 * Get all keys matching a prefix. Returns { key: value, ... }.
 */
export async function getByPrefix(prefix) {
  try {
    const res = await fetch(`${API}?prefix=${encodeURIComponent(prefix)}`)
    if (res.ok) return await res.json()
  } catch {}
  return {}
}

/**
 * Read from local cache only — instant, no network.
 * Use for initial useState values.
 */
export function cacheRead(key, fallback = null) {
  return cacheGet(key, fallback)
}
