import { useState } from 'react'

const QUICK_PICKS = [
  'Creatine',
  'Ashwagandha',
  'L-Citrulline',
  'Beta-Alanine',
  'Magnesium Glycinate',
  'Vitamin D3',
  'BCAAs',
  'Turkesterone',
]

// Mock data for Phase 1 — replaced with real API in Phase 2
const MOCK_RESULT = {
  name: 'Creatine',
  verdict: 'The most proven performance supplement in existence. Just take it.',
  evidence: 'Strong',
  effective_dose: '3–5g daily',
  timing: 'Any time — consistency matters more than timing',
  best_for: 'Anyone doing resistance training or high-intensity sport',
  synergies: 'Beta-Alanine, Carbohydrates post-workout',
  watch_out: 'Cheap monohydrate works as well as any fancy form. Don\'t overpay.',
  lifter_take:
    'This is the one supplement with decades of research behind it. If you\'re not taking creatine, you\'re leaving gains on the table. No loading phase needed — 5g a day, done. Everything else in this list is optional. This is not.',
}

function evidenceBadgeClass(evidence) {
  switch (evidence?.toLowerCase()) {
    case 'strong':   return 'badge badge-strong'
    case 'moderate': return 'badge badge-moderate'
    case 'mixed':    return 'badge badge-mixed'
    case 'limited':  return 'badge badge-limited'
    default:         return 'badge badge-mixed'
  }
}

function VerdictCard({ data }) {
  return (
    <div className="card">
      <div className="card-header">
        <div className="supplement-name">{data.name}</div>
        <span className={evidenceBadgeClass(data.evidence)}>
          {data.evidence} evidence
        </span>
      </div>

      <p className="verdict-text">{data.verdict}</p>

      <div className="card-grid">
        <div className="card-field">
          <label>Effective dose</label>
          <span>{data.effective_dose}</span>
        </div>
        <div className="card-field">
          <label>Timing</label>
          <span>{data.timing}</span>
        </div>
        <div className="card-field">
          <label>Best for</label>
          <span>{data.best_for}</span>
        </div>
        <div className="card-field">
          <label>Pairs well with</label>
          <span>{data.synergies}</span>
        </div>
      </div>

      <div className="card-field" style={{ marginBottom: '1.25rem' }}>
        <label>Watch out</label>
        <span>{data.watch_out}</span>
      </div>

      <hr className="divider" />

      <div className="lifter-take">
        <div className="lifter-take-label">The Lifter Take</div>
        <p>{data.lifter_take}</p>
      </div>
    </div>
  )
}

export default function SupplementSearch({ usageCount, onSearch }) {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function handleSearch(term) {
    const q = term || query
    if (!q.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)
    setQuery(q)

    // Phase 1: mock result after a short delay to simulate API
    setTimeout(() => {
      setResult({ ...MOCK_RESULT, name: q })
      setLoading(false)
      if (onSearch) onSearch()
    }, 800)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div>
      <div className="search-wrap">
        <input
          className="search-input"
          placeholder="Search any supplement…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="btn-primary"
          onClick={() => handleSearch()}
          disabled={loading || !query.trim()}
        >
          Search
        </button>
      </div>

      <p className="chips-label">Quick picks</p>
      <div className="chips">
        {QUICK_PICKS.map(name => (
          <button
            key={name}
            className="chip"
            onClick={() => handleSearch(name)}
          >
            {name}
          </button>
        ))}
      </div>

      {loading && (
        <div className="loading">
          <div className="spinner" />
          Analyzing {query}…
        </div>
      )}

      {error && <div className="error-box">{error}</div>}

      {result && !loading && <VerdictCard data={result} />}

      {!result && !loading && !error && (
        <div className="empty-state">
          Search a supplement or pick one above to get the evidence-based verdict.
        </div>
      )}
    </div>
  )
}
