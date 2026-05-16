// Google Calendar proxy for Lumen's Scheduler agent.
// Mirrors the shape of api/oura.js + api/gmail.js — read-only, public-callable, env-var creds.
//
// Env vars required (set in Vercel project Settings):
//   GOOGLE_CLIENT_ID
//   GOOGLE_CLIENT_SECRET
//   GOOGLE_REFRESH_TOKEN
//
// Query params:
//   ?type=events                      → returns array of upcoming events
//   ?start=YYYY-MM-DDTHH:MM:SSZ       → start of window (default: now)
//   ?end=YYYY-MM-DDTHH:MM:SSZ         → end of window (default: now + 7 days)
//   ?calendarId=primary               → optional; default 'primary'; can be 'all' to merge all calendars
//
// Response: array of normalized event objects.

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'method_not_allowed' })
  }

  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN } = process.env
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN) {
    return res.status(503).json({ error: 'no_credentials' })
  }

  const { start, end, calendarId = 'primary' } = req.query

  const startISO = start ? new Date(start).toISOString() : new Date().toISOString()
  const endISO = end
    ? new Date(end).toISOString()
    : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

  if (Number.isNaN(Date.parse(startISO)) || Number.isNaN(Date.parse(endISO))) {
    return res.status(400).json({ error: 'invalid_dates' })
  }

  try {
    const accessToken = await getAccessToken({ GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN })

    let calendarIds = [calendarId]
    if (calendarId === 'all') {
      // List all calendars accessible to the user
      const listRes = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      if (!listRes.ok) {
        const text = await listRes.text()
        return res.status(listRes.status).json({ error: 'calendar_list_failed', message: text })
      }
      const data = await listRes.json()
      calendarIds = (data.items || []).map((c) => c.id)
    }

    // Fetch events from each calendar
    const allEvents = []
    for (const cid of calendarIds) {
      const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(cid)}/events?timeMin=${encodeURIComponent(startISO)}&timeMax=${encodeURIComponent(endISO)}&singleEvents=true&orderBy=startTime&maxResults=100`
      const r = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } })
      if (!r.ok) continue   // skip calendars we can't read
      const data = await r.json()
      const items = (data.items || []).map((e) => ({
        id: e.id,
        calendarId: cid,
        summary: e.summary || '(no title)',
        description: e.description || '',
        location: e.location || '',
        start: e.start?.dateTime || e.start?.date || null,
        end: e.end?.dateTime || e.end?.date || null,
        allDay: !!e.start?.date && !e.start?.dateTime,
        attendees: (e.attendees || []).map((a) => ({
          email: a.email,
          displayName: a.displayName || '',
          responseStatus: a.responseStatus,
          self: !!a.self,
        })),
        hangoutLink: e.hangoutLink || '',
        status: e.status,
        organizer: e.organizer?.email || '',
        recurringEventId: e.recurringEventId || null,
      }))
      allEvents.push(...items)
    }

    // Sort merged events chronologically
    allEvents.sort((a, b) => (a.start > b.start ? 1 : -1))

    return res.status(200).json({
      count: allEvents.length,
      window: { start: startISO, end: endISO },
      events: allEvents,
    })
  } catch (err) {
    return res.status(500).json({ error: 'calendar_proxy_error', message: err?.message || String(err) })
  }
}
