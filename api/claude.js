// Vercel serverless function — proxies requests to Anthropic API
export default async function handler(req, res) {
  console.log('=== API Claude Handler Start ===')
  console.log('Method:', req.method)

  if (req.method !== 'POST') {
    console.log('Invalid method')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  console.log('API key present:', !!apiKey)

  if (!apiKey) {
    console.error('CRITICAL: API key not configured')
    return res.status(500).json({ error: 'API key not configured' })
  }

  try {
    console.log('Step 1: Preparing request')
    const requestBody = JSON.stringify(req.body)
    console.log('Step 2: Request body prepared, size:', requestBody.length)

    console.log('Step 3: Calling Anthropic API')
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: requestBody,
    })

    console.log('Step 4: Got response, status:', response.status)
    const data = await response.json()
    console.log('Step 5: Parsed response JSON')

    if (!response.ok) {
      console.error('Step 6: Anthropic returned error:', response.status, data?.error)
      return res.status(response.status).json(data)
    }

    console.log('Step 7: Returning success')
    res.status(200).json(data)
  } catch (err) {
    console.error('=== CATCH BLOCK ===')
    console.error('Error type:', err.constructor.name)
    console.error('Error message:', err.message)
    console.error('Error stack:', err.stack)
    res.status(500).json({ error: `Error: ${err.message}` })
  }
}
