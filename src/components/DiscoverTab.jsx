import { useState, useMemo } from 'react'
import { SUPPLEMENT_SOURCES } from '../utils/sources'
import { GetIconByName } from './Icons'

function SourceCard({ source }) {
  const IconComponent = GetIconByName(source.iconName)

  return (
    <div className="source-card">
      <div className="source-header">
        <div className="source-title-row">
          <div className="source-icon">
            <IconComponent />
          </div>
          <div className="source-title-group">
            <div className="source-supplement">{source.supplement}</div>
            <h4 className="source-title">{source.title}</h4>
          </div>
        </div>
        <div className="source-badges">
          <span className={`source-type`}>{source.type}</span>
          <span className={`evidence-badge evidence-${source.evidence?.toLowerCase()}`}>
            {source.evidence}
          </span>
        </div>
      </div>
      <div className="source-meta">
        <span className="source-authors">{source.authors}, {source.year}</span>
      </div>
      <p className="source-finding">{source.finding}</p>
    </div>
  )
}

export default function DiscoverTab() {
  const [searchQuery, setSearchQuery] = useState('')

  const supplements = useMemo(() => {
    const unique = [...new Set(SUPPLEMENT_SOURCES.map(s => s.supplement))]
    return unique.sort()
  }, [])

  const filteredSources = useMemo(() => {
    if (!searchQuery.trim()) return SUPPLEMENT_SOURCES
    const query = searchQuery.toLowerCase()
    return SUPPLEMENT_SOURCES.filter(
      s => s.supplement.toLowerCase().includes(query) ||
           s.title.toLowerCase().includes(query)
    )
  }, [searchQuery])

  return (
    <div>
      <p className="section-label">Search research</p>

      <div className="search-wrap" style={{ marginBottom: '1.5rem' }}>
        <input
          className="search-input"
          placeholder="Filter by supplement or study..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {supplements.length > 0 && (
        <>
          <p className="chips-label">Popular supplements</p>
          <div className="chips" style={{ marginBottom: '1.75rem' }}>
            {supplements.map(supp => (
              <button
                key={supp}
                className="chip"
                onClick={() => setSearchQuery(supp)}
                style={searchQuery.toLowerCase() === supp.toLowerCase() ? { opacity: 1 } : {}}
              >
                {supp}
              </button>
            ))}
          </div>
        </>
      )}

      <div className="sources-list">
        {filteredSources.length > 0 ? (
          filteredSources.map((source, idx) => (
            <SourceCard key={idx} source={source} />
          ))
        ) : (
          <div className="empty-state">
            No research found for "{searchQuery}". Try another search.
          </div>
        )}
      </div>

      <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(200, 240, 77, 0.04)', borderRadius: '8px', borderLeft: '3px solid rgba(200, 240, 77, 0.2)' }}>
        <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: '1.6' }}>
          Research sources compiled from peer-reviewed studies and systematic reviews. These findings represent the current scientific understanding of supplement efficacy. New research emerges regularly — check back for updates.
        </p>
      </div>
    </div>
  )
}
