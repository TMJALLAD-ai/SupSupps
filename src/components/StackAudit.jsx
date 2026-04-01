import { useState } from 'react'

const GOALS = [
  'Muscle hypertrophy',
  'Strength & power',
  'Endurance & performance',
  'Fat loss & recomp',
  'General health & recovery',
]

// Mock audit result for Phase 1 — replaced with real API in Phase 3
const MOCK_AUDIT = {
  overall: 'Solid foundation with a clear gap in intra-workout performance support.',
  strengths: [
    'Creatine is the right anchor — strong evidence, correctly dosed',
    'Protein supplementation supports your hypertrophy goal well',
  ],
  gaps: [
    'No pre-workout nitric oxide support (L-Citrulline would help)',
    'Missing sleep/recovery support — Magnesium Glycinate would be a high-ROI add',
  ],
  redundancies: [
    'BCAAs are redundant if you\'re already hitting protein targets — remove them',
  ],
  timing_notes: [
    'Take creatine at the same time every day — timing is irrelevant, consistency is not',
    'Protein supplement is best used to hit daily targets, not just post-workout',
  ],
  top_add: 'L-Citrulline',
  top_add_reason:
    'Strong evidence for blood flow and endurance during training — directly supports hypertrophy goal.',
}

function AuditResult({ data }) {
  return (
    <div className="card">
      <p className="audit-overall">{data.overall}</p>

      {data.strengths?.length > 0 && (
        <div className="audit-section green">
          <div className="audit-section-title green">Strengths</div>
          <ul className="audit-list">
            {data.strengths.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
      )}

      {data.gaps?.length > 0 && (
        <div className="audit-section yellow">
          <div className="audit-section-title yellow">Gaps</div>
          <ul className="audit-list">
            {data.gaps.map((g, i) => <li key={i}>{g}</li>)}
          </ul>
        </div>
      )}

      {data.redundancies?.length > 0 && (
        <div className="audit-section red">
          <div className="audit-section-title red">Redundancies</div>
          <ul className="audit-list">
            {data.redundancies.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </div>
      )}

      {data.timing_notes?.length > 0 && (
        <div className="audit-section blue">
          <div className="audit-section-title blue">Timing Notes</div>
          <ul className="audit-list">
            {data.timing_notes.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </div>
      )}

      <div className="top-add-box">
        <div className="top-add-label">Top recommended addition</div>
        <div className="top-add-name">{data.top_add}</div>
        <div className="top-add-reason">{data.top_add_reason}</div>
      </div>
    </div>
  )
}

export default function StackAudit() {
  const [selectedGoals, setSelectedGoals] = useState([])
  const [supplements, setSupplements] = useState(['', ''])
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function toggleGoal(goal) {
    setSelectedGoals(prev =>
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
    )
  }

  function updateSupplement(index, value) {
    setSupplements(prev => prev.map((s, i) => (i === index ? value : s)))
  }

  function addSupplement() {
    setSupplements(prev => [...prev, ''])
  }

  function removeSupplement(index) {
    setSupplements(prev => prev.filter((_, i) => i !== index))
  }

  function handleAudit() {
    const filled = supplements.filter(s => s.trim())
    if (!filled.length || !selectedGoals.length) return

    setLoading(true)
    setError(null)
    setResult(null)

    // Phase 1: mock result
    setTimeout(() => {
      setResult(MOCK_AUDIT)
      setLoading(false)
    }, 1000)
  }

  const canAudit = selectedGoals.length > 0 && supplements.some(s => s.trim())

  return (
    <div>
      <p className="section-label">Your goal(s)</p>
      <div className="chips" style={{ marginBottom: '1.75rem' }}>
        {GOALS.map(goal => (
          <button
            key={goal}
            className={`chip${selectedGoals.includes(goal) ? ' selected' : ''}`}
            onClick={() => toggleGoal(goal)}
          >
            {goal}
          </button>
        ))}
      </div>

      <p className="section-label">Your current stack</p>
      <div className="supplement-inputs">
        {supplements.map((s, i) => (
          <div key={i} className="supplement-input-row">
            <input
              className="search-input"
              placeholder={`Supplement ${i + 1}`}
              value={s}
              onChange={e => updateSupplement(i, e.target.value)}
            />
            {supplements.length > 1 && (
              <button
                className="btn-remove"
                onClick={() => removeSupplement(i)}
                title="Remove"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      <button className="btn-add" onClick={addSupplement}>
        + Add supplement
      </button>

      <button
        className="btn-primary"
        style={{ width: '100%', marginBottom: '2rem' }}
        onClick={handleAudit}
        disabled={loading || !canAudit}
      >
        {loading ? 'Auditing…' : 'Audit my stack'}
      </button>

      {loading && (
        <div className="loading">
          <div className="spinner" />
          Auditing your stack…
        </div>
      )}

      {error && <div className="error-box">{error}</div>}

      {result && !loading && <AuditResult data={result} />}

      {!result && !loading && !error && (
        <div className="empty-state">
          Select your goal(s), enter your supplements, and get an honest audit.
        </div>
      )}
    </div>
  )
}
