import { useState } from 'react'
import Header from './components/Header'
import SupplementSearch from './components/SupplementSearch'
import StackAudit from './components/StackAudit'
import DiscoverTab from './components/DiscoverTab'
import AboutPage from './components/AboutPage'
import WorksCitedPage from './components/WorksCitedPage'
import { SearchIcon, AuditIcon, DiscoverIcon } from './components/Icons'

export default function App() {
  const [activeTab, setActiveTab] = useState('search')

  return (
    <>
      <Header />
      <main className="container">
        <p className="app-intro">
          Supplements can be confusing. There's a lot of hype, a lot of marketing, and not enough actual science. This tool exists to give you the research-backed answers so you can make informed decisions about what you're putting in your body.
        </p>

        {/* Feature cards preview */}
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <SearchIcon />
            </div>
            <div className="feature-title">Search</div>
            <div className="feature-text">Look up any supplement. Get the science, the dose, etc. Comprehensive breakdown of each.</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <AuditIcon />
            </div>
            <div className="feature-title">Audit</div>
            <div className="feature-text">Check your current stack. Find gaps, spot redundancies, optimize timing.</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <DiscoverIcon />
            </div>
            <div className="feature-title">Discover</div>
            <div className="feature-text">Browse curated research. See the studies backing every supplement.</div>
          </div>
        </div>

        <nav className="tabs">
          <button
            className={`tab-btn${activeTab === 'search' ? ' active' : ''}`}
            onClick={() => setActiveTab('search')}
          >
            <SearchIcon />
            Supplement Search
          </button>
          <button
            className={`tab-btn${activeTab === 'audit' ? ' active' : ''}`}
            onClick={() => setActiveTab('audit')}
          >
            <AuditIcon />
            Stack Audit
          </button>
          <button
            className={`tab-btn${activeTab === 'discover' ? ' active' : ''}`}
            onClick={() => setActiveTab('discover')}
          >
            <DiscoverIcon />
            Discover
          </button>
          <button
            className={`tab-btn${activeTab === 'about' ? ' active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            About
          </button>
          <button
            className={`tab-btn${activeTab === 'citations' ? ' active' : ''}`}
            onClick={() => setActiveTab('citations')}
          >
            Works Cited
          </button>
        </nav>

        {activeTab === 'search' && <SupplementSearch />}
        {activeTab === 'audit' && <StackAudit />}
        {activeTab === 'discover' && <DiscoverTab />}
        {activeTab === 'about' && <AboutPage />}
        {activeTab === 'citations' && <WorksCitedPage />}
      </main>
    </>
  )
}

