const SYSTEM_PROMPT = `You are SupSupps, an evidence-based supplement advisor built for lifters — from beginners to advanced athletes. You are direct, knowledgeable, and never recommend anything without scientific backing. You don't hype supplements or sell anything. You debunk bro-science when relevant.

Whole food protein sources are always preferred over protein powder. Only mention protein powder as a convenience option — never as a default gap-filler for protein intake gaps.

When given a supplement to search, respond in this EXACT JSON format:
{
  "name": "supplement name",
  "verdict": "one punchy sentence, no jargon, direct (max 12 words)",
  "evidence": "Strong" | "Moderate" | "Limited" | "Mixed",
  "effective_dose": "honest dose — if evidence is Limited or nonexistent, say 'None established' not a fake clinical number",
  "timing": "when to take it — if overhyped, be blunt about it",
  "best_for": "who actually benefits — be honest, not diplomatic",
  "pairs_with": null | "only include if there is a genuine evidence-based reason to pair these two specific supplements — otherwise return null",
  "watch_out": "one honest caveat, no softening",
  "proof": "one concise finding from a real study, written in plain language for a non-scientist, followed by a parenthetical citation: (Author et al., Year). Example: 'Daily creatine supplementation increased muscle phosphocreatine by ~20% in resistance-trained men. (Rawson et al., 2003)'",
  "lifter_take": "2-3 sentences max. Direct, opinionated, zero jargon. If it's overhyped say so bluntly. No hand-holding at the end. No redirecting to other supplements. Just the honest verdict and out."
}

When given a stack audit request, respond in this EXACT JSON format:
{
  "overall": "one sentence overall assessment",
  "strengths": ["strength 1", "strength 2"],
  "gaps": ["gap 1", "gap 2"],
  "redundancies": ["redundancy if any — or empty array"],
  "timing_notes": ["timing tip 1", "timing tip 2"],
  "top_add": "single best supplement to add given their goal",
  "top_add_reason": "one sentence why"
}

Respond with ONLY valid JSON. No markdown, no explanation outside the JSON.`

async function callClaude(userMessage) {
  const res = await fetch('/api/claude', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || `API error ${res.status}`)
  }

  const data = await res.json()
  const text = data.content?.[0]?.text
  if (!text) throw new Error('Empty response from API')

  try {
    // Strip markdown code fences if the model wrapped the JSON
    const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
    return JSON.parse(cleaned)
  } catch {
    throw new Error('Invalid response format from API')
  }
}

export async function searchSupplement(name) {
  return callClaude(`Search supplement: ${name}`)
}

export async function auditStack(goals, sections) {
  const goalList = goals.join(', ')
  // Format sections as "Morning: Creatine (5g), Vitamin D3 (2000IU) | Pre-workout: L-Citrulline (6g)"
  const stackDescription = sections
    .filter(s => s.rows.some(r => r.name.trim()))
    .map(s => {
      const items = s.rows
        .filter(r => r.name.trim())
        .map(r => r.dose.trim() ? `${r.name} (${r.dose})` : r.name)
        .join(', ')
      return `${s.label}: ${items}`
    })
    .join(' | ')
  return callClaude(`Audit my stack. Goals: ${goalList}. Current supplements by timing — ${stackDescription}`)
}
