// Vercel serverless function — proxies Oura Ring API v2
// Add OURA_ACCESS_TOKEN in Vercel Project Settings → Environment Variables
//
// GET /api/oura?type=activity&start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
// GET /api/oura?type=sleep&start_date=YYYY-MM-DD&end_date=YYYY-MM-DD

const ENDPOINTS = {
  activity: 'daily_activity',
  sleep:    'sleep',
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  const token = process.env.OURA_ACCESS_TOKEN
  if (!token) return res.status(503).json({ error: 'no_token' })

  const { start_date, end_date, type = 'activity' } = req.query
  if (!start_date || !end_date) return res.status(400).json({ error: 'missing_dates' })

  const collection = ENDPOINTS[type] ?? ENDPOINTS.activity

  try {
    const url = `https://api.ouraring.com/v2/usercollection/${collection}?start_date=${start_date}&end_date=${end_date}`
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await response.json()
    return res.status(response.status).json(data)
  } catch (err) {
    return res.status(500).json({ error: 'fetch_failed', message: err.message })
  }
}
