import { useState } from 'react'
import Header from './components/Header'
import SupplementSearch from './components/SupplementSearch'
import StackAudit from './components/StackAudit'

export default function App() {
  const [activeTab, setActiveTab] = useState('search')

  return (
    <>
      <Header />
      <main className="container">
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

        {activeTab === 'search' && <SupplementSearch />}
        {activeTab === 'audit' && <StackAudit />}
      </main>
    </>
  )
}
