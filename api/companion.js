// Vercel serverless function — proxies Claude API calls
// Deploy to Vercel, then add ANTHROPIC_API_KEY in:
//   Project Settings → Environment Variables

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(503).json({
      error: 'no_key',
      message: 'ANTHROPIC_API_KEY not set in Vercel environment variables.',
    })
  }

  const { messages, systemPrompt, maxTokens = 1500 } = req.body

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: maxTokens,
        system: systemPrompt,
        messages,
      }),
    })

    const data = await response.json()
    return res.status(response.status).json(data)
  } catch (err) {
    return res.status(500).json({ error: 'fetch_failed', message: err.message })
  }
}
