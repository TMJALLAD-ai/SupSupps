export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { model, max_tokens, system, messages } = req.body

  if (!model || !system || !messages) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY not set')
    return res.status(500).json({ error: 'API key not configured' })
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: max_tokens || 1000,
        system,
        messages,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Anthropic API error:', data)
      return res.status(response.status).json(data)
    }

    return res.status(200).json(data)
  } catch (err) {
    console.error('API proxy error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
