import { useState } from 'react'
import { searchSupplement } from '../utils/api'

const QUICK_PICKS = [
  'Creatine',
  'Ashwagandha',
  'L-Citrulline',
  'Beta-Alanine',
  'Magnesium Glycinate',
  'Vitamin D3',
  'Caffeine',
  'Melatonin',
]

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

      <div className={`evidence-bar ${data.evidence?.toLowerCase()}`}>
        <div className="evidence-bar-segment"></div>
        <div className="evidence-bar-segment"></div>
        <div className="evidence-bar-segment"></div>
        <div className="evidence-bar-segment"></div>
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
        {/* Render training goals badges if present */}
        {data.best_goals && data.best_goals.length > 0 && (
          <div className="card-field">
            <label>For your goals</label>
            <div className="benefit-badges">
              {data.best_goals.map(goal => (
                <span key={goal} className="benefit-badge">{goal}</span>
              ))}
            </div>
          </div>
        )}
        {/* Render Pairs With with visual arrow if present */}
        {data.pairs_with && (
          <div className="card-field pairs-with-field">
            <label>Pairs well with</label>
            <div className="pairs-with-visual">
              <span>{data.name}</span>
              <span className="pairs-arrow">→</span>
              <span>{data.pairs_with}</span>
            </div>
          </div>
        )}
      </div>

      <div className="card-field" style={{ marginBottom: '1.25rem' }}>
        <label>Watch out</label>
        <span>{data.watch_out}</span>
      </div>

      {data.proof && (
        <div className="proof-block">
          <div className="proof-label">The Science</div>
          <p className="proof-text">{data.proof}</p>
        </div>
      )}

      <hr className="divider" />

      <div className="lifter-take">
        <div className="lifter-take-label">The Lifter Take</div>
        <p>{data.lifter_take}</p>
      </div>
    </div>
  )
}

export default function SupplementSearch() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSearch(term) {
    const q = term || query
    if (!q.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)
    setQuery(q)

    try {
      const data = await searchSupplement(q)
      setResult(data)
    } catch (err) {
      setError(err.message || 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div>
      <div className="search-wrap">
        <input
          className="search-input"
          placeholder="Look it up"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="btn-primary"
          onClick={() => handleSearch()}
          disabled={loading || !query.trim()}
        >
          Go
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
          Checking the science...
        </div>
      )}

      {error && <div className="error-box">{error}</div>}

      {result && !loading && <VerdictCard data={result} />}

      {!result && !loading && !error && (
        <div className="empty-state">
          Pick one or search. We'll tell you what the science says.
        </div>
      )}
    </div>
  )
}
