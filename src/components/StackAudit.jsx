import { useState } from 'react'
import { auditStack } from '../utils/api'

const GOALS = [
  'Muscle hypertrophy',
  'Strength & power',
  'Endurance & performance',
  'Fat loss & recomp',
  'General health & recovery',
]

const DEFAULT_SECTIONS = [
  { id: 'morning',    label: 'Morning',     rows: [{ name: '', dose: '' }] },
  { id: 'preworkout', label: 'Pre-workout', rows: [{ name: '', dose: '' }] },
  { id: 'evening',    label: 'Evening',     rows: [{ name: '', dose: '' }] },
  { id: 'misc',       label: 'Misc',        rows: [] },
]

// Common supplements with their standard effective doses for auto-populate
const KNOWN_DOSES = {
  'Creatine': '5g',
  'Ashwagandha': '300–600mg',
  'L-Citrulline': '6–8g',
  'Beta-Alanine': '3.2g',
  'Magnesium Glycinate': '200–400mg',
  'Vitamin D3': '2,000–4,000 IU',
  'BCAAs': '5–10g',
  'Turkesterone': 'None established',
  'Caffeine': '3–6mg/kg',
  'Fish Oil': '1–3g EPA+DHA',
  'Zinc': '15–30mg',
  'Vitamin C': '500–1,000mg',
  'Melatonin': '0.5–3mg',
  'L-Theanine': '100–200mg',
  'Collagen': '10–15g',
  'Rhodiola': '200–600mg',
  'Alpha-GPC': '300–600mg',
  'Lion\'s Mane': '500–3,000mg',
  'Berberine': '500mg',
  'NMN': 'None established',
  'Taurine': '1–3g',
  'Electrolytes': 'Per label',
  'Protein Powder': 'Per label',
  'Pre-workout': 'Per label',
  'Multivitamin': 'Per label',
}

const SUPPLEMENT_NAMES = Object.keys(KNOWN_DOSES)

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

function SupplementRow({ row, onChange, onRemove, showRemove, sectionId, rowIndex }) {
  const inputId = `supp-${sectionId}-${rowIndex}`

  function handleNameChange(value) {
    const dose = KNOWN_DOSES[value] ?? row.dose
    onChange({ name: value, dose })
  }

  return (
    <div className="stack-row">
      <div className="stack-row-name">
        <input
          className="search-input"
          placeholder="Supplement"
          value={row.name}
          list={`${inputId}-list`}
          onChange={e => handleNameChange(e.target.value)}
        />
        <datalist id={`${inputId}-list`}>
          {SUPPLEMENT_NAMES.map(n => <option key={n} value={n} />)}
        </datalist>
      </div>
      <div className="stack-row-dose">
        <input
          className="search-input"
          placeholder="Dose"
          value={row.dose}
          onChange={e => onChange({ ...row, dose: e.target.value })}
        />
      </div>
      {showRemove && (
        <button className="btn-remove" onClick={onRemove} title="Remove">×</button>
      )}
    </div>
  )
}

function TimingSection({ section, onAddRow, onRemoveRow, onChangeRow, onRemoveSection }) {
  const hasRows = section.rows.length > 0

  return (
    <div className="timing-section">
      <div className="timing-section-header">
        <span className="timing-section-label">{section.label}</span>
        <button
          className="timing-remove-section"
          onClick={onRemoveSection}
          title={`Remove ${section.label}`}
        >
          ×
        </button>
      </div>

      {hasRows && (
        <div className="stack-rows">
          {section.rows.map((row, i) => (
            <SupplementRow
              key={i}
              row={row}
              sectionId={section.id}
              rowIndex={i}
              showRemove={section.rows.length > 1 || row.name !== ''}
              onChange={updated => onChangeRow(i, updated)}
              onRemove={() => onRemoveRow(i)}
            />
          ))}
        </div>
      )}

      <button className="btn-add-row" onClick={onAddRow}>
        + Add supplement
      </button>
    </div>
  )
}

export default function StackAudit() {
  const [selectedGoals, setSelectedGoals] = useState([])
  const [sections, setSections] = useState(DEFAULT_SECTIONS)
  const [newTimingLabel, setNewTimingLabel] = useState('')
  const [showTimingInput, setShowTimingInput] = useState(false)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function toggleGoal(goal) {
    setSelectedGoals(prev =>
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
    )
  }

  function addRow(sectionId) {
    setSections(prev => prev.map(s =>
      s.id === sectionId ? { ...s, rows: [...s.rows, { name: '', dose: '' }] } : s
    ))
  }

  function removeRow(sectionId, rowIndex) {
    setSections(prev => prev.map(s =>
      s.id === sectionId ? { ...s, rows: s.rows.filter((_, i) => i !== rowIndex) } : s
    ))
  }

  function changeRow(sectionId, rowIndex, updated) {
    setSections(prev => prev.map(s =>
      s.id === sectionId
        ? { ...s, rows: s.rows.map((r, i) => i === rowIndex ? updated : r) }
        : s
    ))
  }

  function removeSection(sectionId) {
    setSections(prev => prev.filter(s => s.id !== sectionId))
  }

  function addTimingSection() {
    const label = newTimingLabel.trim()
    if (!label) return
    setSections(prev => [...prev, {
      id: `custom-${Date.now()}`,
      label,
      rows: [{ name: '', dose: '' }],
    }])
    setNewTimingLabel('')
    setShowTimingInput(false)
  }

  async function handleAudit() {
    const filledSections = sections.filter(s => s.rows.some(r => r.name.trim()))
    if (!filledSections.length || !selectedGoals.length) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const data = await auditStack(selectedGoals, filledSections)
      setResult(data)
    } catch (err) {
      setError(err.message || 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const canAudit = selectedGoals.length > 0 &&
    sections.some(s => s.rows.some(r => r.name.trim()))

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

      <div className="timing-sections">
        {sections.map(section => (
          <TimingSection
            key={section.id}
            section={section}
            onAddRow={() => addRow(section.id)}
            onRemoveRow={i => removeRow(section.id, i)}
            onChangeRow={(i, updated) => changeRow(section.id, i, updated)}
            onRemoveSection={() => removeSection(section.id)}
          />
        ))}
      </div>

      {/* Add custom timing section */}
      {showTimingInput ? (
        <div className="timing-add-row">
          <input
            className="search-input"
            placeholder="Timing label (e.g. Intra-workout)"
            value={newTimingLabel}
            onChange={e => setNewTimingLabel(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTimingSection()}
            autoFocus
          />
          <button className="btn-primary" onClick={addTimingSection} disabled={!newTimingLabel.trim()}>
            Add
          </button>
          <button className="btn-ghost" onClick={() => { setShowTimingInput(false); setNewTimingLabel('') }}>
            Cancel
          </button>
        </div>
      ) : (
        <button className="btn-add" onClick={() => setShowTimingInput(true)}>
          + Add timing
        </button>
      )}

      <button
        className="btn-primary"
        style={{ width: '100%', marginBottom: '2rem', marginTop: '1rem' }}
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
          Select your goal(s), fill in your stack by timing, and get an honest audit.
        </div>
      )}
    </div>
  )
}
