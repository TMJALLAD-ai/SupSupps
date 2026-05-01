// Vercel serverless function — proxies requests to Anthropic API
// Keeps the API key server-side so it's never exposed in the browser
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.error('API key not configured in environment')
    return res.status(500).json({ error: 'API key not configured' })
  }

  try {
    console.log('Forwarding request to Anthropic API')
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(req.body),
    })

    const data = await response.json()
    console.log('Anthropic response status:', response.status)

    if (!response.ok) {
      console.error('Anthropic API error:', data)
      return res.status(response.status).json(data)
    }

    res.status(response.status).json(data)
  } catch (err) {
    console.error('Proxy error:', err.message, err.stack)
    res.status(500).json({ error: `Error: ${err.message}` })
  }
}
