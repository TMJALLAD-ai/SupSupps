import { useState } from 'react'
import Header from './components/Header'
import SupplementSearch from './components/SupplementSearch'
import StackAudit from './components/StackAudit'

const FREE_SEARCH_LIMIT = 5

export default function App() {
  const [activeTab, setActiveTab] = useState('search')

  // Freemium usage tracking — scaffolded for Phase 4
  // TODO(phase-4): persist to localStorage, enforce limits in UI
  const [searchCount, setSearchCount] = useState(0)

  function handleSearch() {
    setSearchCount(c => c + 1)
  }

  return (
    <>
      <Header />
      <main className="container">
        {/* Usage indicator — visible once user starts searching */}
        {searchCount > 0 && (
          <div className="usage-bar">
            <span className="usage-text">
              <span>{FREE_SEARCH_LIMIT - searchCount}</span> free searches remaining today
            </span>
          </div>
        )}

        {/* Tab navigation */}
        <nav className="tabs">
          <button
            className={`tab-btn${activeTab === 'search' ? ' active' : ''}`}
            onClick={() => setActiveTab('search')}
          >
            Supplement Search
          </button>
          <button
            className={`tab-btn${activeTab === 'audit' ? ' active' : ''}`}
            onClick={() => setActiveTab('audit')}
          >
            Stack Audit
          </button>
        </nav>

        {/* Tab content */}
        {activeTab === 'search' && (
          <SupplementSearch usageCount={searchCount} onSearch={handleSearch} />
        )}
        {activeTab === 'audit' && (
          <StackAudit />
        )}
      </main>
    </>
  )
}
