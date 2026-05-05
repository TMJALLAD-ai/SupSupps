export default function AboutPage() {
  return (
    <div>
      <div className="about-header">
        <h2 className="about-title">About This Project</h2>
      </div>

      <div className="about-section">
        <h3 className="about-section-title">Research Question</h3>
        <p>How can I build an evidence-based supplement advisor that cuts through marketing hype and gives lifters the scientific truth?</p>
      </div>

      <div className="about-section">
        <h3 className="about-section-title">Methodology</h3>
        <p><strong>Approach:</strong> Curated 15 peer-reviewed supplement studies, prioritizing Strong/Moderate evidence while excluding weak/limited evidence sources.</p>
        <p><strong>Tech Stack:</strong> React + Vite frontend, Claude Sonnet API for supplement analysis, Vercel serverless functions, localStorage for state.</p>
        <p><strong>AI Tool:</strong> Used Claude Anthropic API to generate evidence-based supplement responses. Claude processes queries against a defined system prompt (with JSON response format) for analysis, then I filter API responses to remove any unsolicited product suggestions.</p>
      </div>

      <div className="about-section">
        <h3 className="about-section-title">Key Features</h3>
        <ul className="about-list">
          <li>Search any supplement — get evidence level, dosage, timing, proof</li>
          <li>Audit your stack — get analysis of gaps, redundancies, timing</li>
          <li>Discover research — browse 15 studies with evidence levels and findings</li>
          <li>Visual clarity — evidence bars, benefit badges, timing timelines</li>
        </ul>
      </div>

      <div className="about-section">
        <h3 className="about-section-title">Findings</h3>
        <p>Users can quickly distinguish supplements with strong backing (creatine, vitamin D3, caffeine) from limited evidence ones. Visual elements significantly improve scannability. Organizing by timing and goals helps users understand their stack holistically rather than supplement-by-supplement.</p>
      </div>
    </div>
  )
}
