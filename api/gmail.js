// Gmail proxy for Lumen's Postman agent.
// Mirrors the shape of api/oura.js — read-only, public-callable, env-var creds.
//
// Env vars required (set in Vercel project Settings):
//   GOOGLE_CLIENT_ID
//   GOOGLE_CLIENT_SECRET
//   GOOGLE_REFRESH_TOKEN
//
// Query params:
//   ?type=triage           → returns array of recent messages with metadata
//   ?since=YYYY-MM-DD      → optional; default = 24h ago
//   ?max=50                → optional; max messages to return (default 50, hard cap 100)
//   ?label=INBOX           → optional; default INBOX
//
// Response: array of message objects with id, threadId, from, to, subject, snippet,
//           labelIds, internalDate, unread.

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'method_not_allowed' })
  }

  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN } = process.env
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN) {
    return res.status(503).json({ error: 'no_credentials', message: 'Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN in Vercel env vars.' })
  }

  const { since, max = '50', label = 'INBOX' } = req.query
  const maxNum = Math.min(100, Math.max(1, parseInt(max, 10) || 50))

  // Default since: 24h ago
  const sinceMs = since
    ? Date.parse(since)
    : Date.now() - 24 * 60 * 60 * 1000
  if (Number.isNaN(sinceMs)) {
    return res.status(400).json({ error: 'invalid_since', message: 'Use YYYY-MM-DD' })
  }
  const sinceEpochSeconds = Math.floor(sinceMs / 1000)

  try {
    // 1. Get a fresh access token from refresh token
    const accessToken = await getAccessToken({ GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN })

    // 2. List message IDs in label, after the since date
    const q = `after:${sinceEpochSeconds}`
    const listUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages?labelIds=${encodeURIComponent(label)}&q=${encodeURIComponent(q)}&maxResults=${maxNum}`
    const listRes = await fetch(listUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (!listRes.ok) {
      const text = await listRes.text()
      return res.status(listRes.status).json({ error: 'gmail_list_failed', message: text })
    }
    const listData = await listRes.json()
    const messageIds = (listData.messages || []).map((m) => m.id)

    // 3. Fetch metadata for each (parallel, but cap concurrency)
    const messages = await Promise.all(
      messageIds.map(async (id) => {
        const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=metadata&metadataHeaders=From&metadataHeaders=To&metadataHeaders=Subject&metadataHeaders=Date`
        const r = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } })
        if (!r.ok) return null
        const m = await r.json()
        const headers = (m.payload?.headers || []).reduce((acc, h) => {
          acc[h.name.toLowerCase()] = h.value
          return acc
        }, {})
        return {
          id: m.id,
          threadId: m.threadId,
          from: headers.from || '',
          to: headers.to || '',
          subject: headers.subject || '(no subject)',
          date: headers.date || '',
          snippet: m.snippet || '',
          labelIds: m.labelIds || [],
          internalDate: m.internalDate,
          unread: (m.labelIds || []).includes('UNREAD'),
        }
      })
    )

    return res.status(200).json({
      count: messages.filter(Boolean).length,
      since: new Date(sinceMs).toISOString(),
      messages: messages.filter(Boolean),
    })
  } catch (err) {
    return res.status(500).json({ error: 'gmail_proxy_error', message: err?.message || String(err) })
  }
}

async function getAccessToken({ GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN }) {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    refresh_token: GOOGLE_REFRESH_TOKEN,
    grant_type: 'refresh_token',
  })
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  })
  if (!r.ok) {
    const text = await r.text()
    throw new Error(`token_refresh_failed: ${text}`)
  }
  const data = await r.json()
  return data.access_token
}
