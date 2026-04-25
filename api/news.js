/**
 * /api/news — generates or returns today's news digest
 *
 * GET /api/news          → returns today's digest (cached or freshly generated)
 * GET /api/news?force=1  → forces regeneration even if cached
 *
 * Called by:
 *   - Vercel cron job every morning
 *   - WorldTab on load and manual refresh
 */

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

// ── Supabase helpers ─────────────────────────────────────────────
async function getFromSupabase(key) {
  const url = `${SUPABASE_URL}/rest/v1/storage?key=eq.${encodeURIComponent(key)}&select=value`
  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'apikey': SUPABASE_SERVICE_KEY,
    },
  })
  const rows = await res.json()
  if (!res.ok || rows.length === 0) return null
  return rows[0].value
}

async function saveToSupabase(key, value) {
  const url = `${SUPABASE_URL}/rest/v1/storage`
  await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'apikey': SUPABASE_SERVICE_KEY,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates',
    },
    body: JSON.stringify({ key, value, updated_at: new Date().toISOString() }),
  })
}

// ── Claude web search call ───────────────────────────────────────
async function generateDigest(today) {
  const prompt = `Today is ${today}. Search the web for today's most important news stories and create a digest.

Return ONLY a valid JSON object in this exact format, with no text before or after it:

{
  "sections": [
    {
      "id": "world",
      "title": "World News",
      "stories": [
        { "headline": "Short headline here", "body": "What happened sentence. Why it matters sentence. One piece of context sentence." }
      ]
    },
    {
      "id": "business",
      "title": "Business & Finance",
      "stories": [
        { "headline": "Short headline here", "body": "What happened sentence. Why it matters sentence. One piece of context sentence." }
      ]
    },
    {
      "id": "politics",
      "title": "Politics",
      "stories": [
        { "headline": "Short headline here", "body": "What happened sentence. Why it matters sentence. One piece of context sentence." }
      ]
    },
    {
      "id": "worth-knowing",
      "title": "Worth Knowing This Week",
      "stories": [
        { "headline": "Short headline here", "body": "What happened sentence. Why it matters sentence. One piece of context sentence." }
      ]
    }
  ]
}

Rules:
- 3 to 4 stories per section
- Each body is exactly 3 sentences: what happened, why it matters, one piece of context
- No opinions, no editorializing, neutral summary only
- Pull from varied sources — do not rely on a single outlet
- Headlines are short and factual (under 12 words)
- Return only the JSON object, nothing else`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-beta': 'web-search-2025-03-05',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 5000,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!response.ok) {
    const err = await response.json()
    throw new Error(`Anthropic API error: ${JSON.stringify(err)}`)
  }

  const data = await response.json()

  // Extract the final text block from the response
  const textBlock = data.content?.findLast(b => b.type === 'text')
  if (!textBlock?.text) throw new Error('No text in Claude response')

  // Parse JSON from the response text
  const raw = textBlock.text.trim()
  const jsonStart = raw.indexOf('{')
  const jsonEnd = raw.lastIndexOf('}')
  if (jsonStart === -1 || jsonEnd === -1) throw new Error('No JSON found in response')

  const parsed = JSON.parse(raw.slice(jsonStart, jsonEnd + 1))
  return { ...parsed, date: today, generatedAt: new Date().toISOString() }
}

// ── Handler ──────────────────────────────────────────────────────
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.method === 'OPTIONS') return res.status(200).end()

  if (!ANTHROPIC_API_KEY) return res.status(503).json({ error: 'no_key' })
  if (!SUPABASE_URL)      return res.status(503).json({ error: 'no_supabase' })

  const today     = todayStr()
  const storageKey = `world:digest:${today}`
  const force     = req.query?.force === '1' || req.query?.force === 'true'

  // Return cached digest if available and not forcing
  if (!force) {
    try {
      const cached = await getFromSupabase(storageKey)
      if (cached) return res.status(200).json(cached)
    } catch {
      // ignore cache errors, proceed to generate
    }
  }

  // Generate fresh digest
  try {
    const digest = await generateDigest(today)
    await saveToSupabase(storageKey, digest)
    return res.status(200).json(digest)
  } catch (err) {
    return res.status(500).json({ error: 'generation_failed', message: err.message })
  }
}
