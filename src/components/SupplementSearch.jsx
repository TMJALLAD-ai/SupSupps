import { useState } from 'react'
import { searchSupplement } from '../utils/api'
import { canSearch, incrementSearchCount, getRemainingSearches, FREE_LIMIT } from '../utils/usage'

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
        {/* Only render Pairs With if the API returned a non-null value */}
        {data.pairs_with && (
          <div className="card-field">
            <label>Pairs well with</label>
            <span>{data.pairs_with}</span>
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

function LimitReached() {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.75rem' }}>
      <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🔒</div>
      <div className="supplement-name" style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>
        Daily limit reached
      </div>
      <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
        Free accounts get {FREE_LIMIT} searches per day. Come back tomorrow or upgrade for unlimited access.
      </p>
      {/* TODO(phase-payments): wire up Stripe upgrade flow */}
      <button className="btn-primary" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
        Upgrade to Premium — Coming Soon
      </button>
    </div>
  )
}

export default function SupplementSearch() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [remaining, setRemaining] = useState(() => getRemainingSearches())
  const limited = remaining === 0

  async function handleSearch(term) {
    const q = term || query
    if (!q.trim() || !canSearch()) return

    setLoading(true)
    setError(null)
    setResult(null)
    setQuery(q)

    try {
      const data = await searchSupplement(q)
      incrementSearchCount()
      setRemaining(getRemainingSearches())
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
      <div className="usage-bar">
        <span className="usage-text">
          <span>{remaining}</span> / {FREE_LIMIT} free searches remaining today
        </span>
      </div>

      <div className="search-wrap">
        <input
          className="search-input"
          placeholder="Search any supplement…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={limited}
        />
        <button
          className="btn-primary"
          onClick={() => handleSearch()}
          disabled={loading || !query.trim() || limited}
        >
          Search
        </button>
      </div>

      <p className="chips-label">Quick picks</p>
      <div className="chips">
        {QUICK_PICKS.map(name => (
          <button
            key={name}
            className={`chip${limited ? ' disabled' : ''}`}
            onClick={() => !limited && handleSearch(name)}
            style={limited ? { opacity: 0.4, cursor: 'not-allowed' } : {}}
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

      {limited && !result && <LimitReached />}

      {result && !loading && <VerdictCard data={result} />}

      {!result && !loading && !error && !limited && (
        <div className="empty-state">
          Search a supplement or pick one above to get the evidence-based verdict.
        </div>
      )}
    </div>
  )
}
