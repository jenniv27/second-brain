/**
 * POST /api/cultural-context
 * { word, definition }
 * → returns cultural context string, cached in Supabase
 */

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY

async function getCache(key) {
  try {
    const url = `${SUPABASE_URL}/rest/v1/storage?key=eq.${encodeURIComponent(key)}&select=value`
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`, apikey: SUPABASE_SERVICE_KEY },
    })
    const rows = await res.json()
    return rows.length > 0 ? rows[0].value : null
  } catch { return null }
}

async function setCache(key, value) {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/storage`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        apikey: SUPABASE_SERVICE_KEY,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify({ key, value, updated_at: new Date().toISOString() }),
    })
  } catch {}
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).end()

  const { word, definition } = req.body
  if (!word) return res.status(400).json({ error: 'word is required' })

  const cacheKey = `learn:cultural:${word.trim()}`

  // Return cached context if available
  const cached = await getCache(cacheKey)
  if (cached) return res.status(200).json({ context: cached, cached: true })

  if (!ANTHROPIC_API_KEY) return res.status(503).json({ error: 'no_key' })

  // Detect whether input is pinyin (has tone marks or is Latin) or hanzi
  const hasToneMarks = /[āáǎàōóǒòēéěèīíǐìūúǔùǖǘǚǜ]/.test(word)
  const hasHanzi     = /[一-鿿㐀-䶿]/.test(word)
  const isPinyin     = hasToneMarks || (!hasHanzi && /^[a-z\s]+$/i.test(word.trim()))

  // Generate with Claude
  const prompt = `You are a Mandarin Chinese cultural context expert. Given a word or phrase${isPinyin ? ' (written in pinyin romanization)' : ''}, provide a rich but concise cultural note — the kind of context that makes a word memorable.

Word: ${word}
Definition: ${definition || '(not provided)'}

Cover:
${!isPinyin ? '- Literal character breakdown if it\'s a compound (brief)\n' : ''}- Cultural background or origin that makes this word interesting
- How it's actually used day-to-day vs formal settings
- Any related expressions, idioms, or tones of note

Write 3–4 short paragraphs. Be warm and curious in tone — like a knowledgeable friend, not a textbook.`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 600,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const data = await response.json()
    const context = data.content?.[0]?.text ?? ''
    if (!context) return res.status(500).json({ error: 'empty response' })

    await setCache(cacheKey, context)
    return res.status(200).json({ context, cached: false })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
