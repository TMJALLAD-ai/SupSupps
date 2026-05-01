export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const key = process.env.ANTHROPIC_API_KEY
  if (!key) {
    return res.status(500).json({ error: 'No key' })
  }

  // Test: just return a dummy response
  res.json({
    content: [{ text: '{"name":"Test","verdict":"test"}' }]
  })
}
