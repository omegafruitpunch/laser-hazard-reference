/**
 * UKCA vs CE Comparator Component
 * 
 * Side-by-side comparison showing the differences between
 * UKCA and CE marking requirements post-Brexit
 */

interface MarkingRequirement {
  category: string;
  ceRequirement: string;
  ukcaRequirement: string;
  highlight?: 'same' | 'different' | 'warning';
}

export const UKCACEComparator: React.FC = () => {
  const [selectedView, setSelectedView] = React.useState<'split' | 'table'>('split');
  const [highlightDifferences, setHighlightDifferences] = React.useState(false);

  const requirements: MarkingRequirement[] = [
    {
      category: 'Geographic Scope',
      ceRequirement: 'European Union + EEA (Norway, Iceland, Liechtenstein)',
      ukcaRequirement: 'Great Britain (England, Scotland, Wales)',
      highlight: 'different'
    },
    {
      category: 'Legal Basis',
      ceRequirement: 'EU Directives (2006/25/EC, Machinery Directive, etc.)',
      ukcaRequirement: 'Retained EU law + UK-specific regulations',
      highlight: 'different'
    },
    {
      category: 'Applicable Standards',
      ceRequirement: 'EU Harmonized Standards (EN)',
      ukcaRequirement: 'UK Designated Standards (BS EN)',
      highlight: 'same'
    },
    {
      category: 'Technical Requirements',
      ceRequirement: 'As specified in applicable directives',
      ukcaRequirement: 'Same technical requirements (initially)',
      highlight: 'same'
    },
    {
      category: 'Conformity Assessment',
      ceRequirement: 'EU Notified Bodies',
      ukcaRequirement: 'UK Approved Bodies',
      highlight: 'different'
    },
    {
      category: 'Declaration',
      ceRequirement: 'EU Declaration of Conformity',
      ukcaRequirement: 'UK Declaration of Conformity',
      highlight: 'different'
    },
    {
      category: 'Technical File',
      ceRequirement: 'Held by manufacturer or EU authorized representative',
      ukcaRequirement: 'Held by manufacturer or UK responsible person',
      highlight: 'different'
    },
    {
      category: 'Northern Ireland',
      ceRequirement: 'CE marking required',
      ukcaRequirement: 'UKNI marking with CE (special arrangement)',
      highlight: 'warning'
    }
  ];

  const timeline = [
    { date: 'Pre-2021', event: 'CE marking valid for UK and EU', status: 'past' },
    { date: 'Jan 2021', event: 'Brexit transition ends', status: 'past' },
    { date: 'Jan 2021 - Dec 2022', event: 'CE marking accepted in GB', status: 'past' },
    { date: 'Jan 2023 - Dec 2024', event: 'CE marking accepted for existing stock', status: 'current' },
    { date: 'Jan 2025+', event: 'UKCA required for GB market', status: 'future' }
  ];

  return (
    <div className="ukca-ce-comparator">
      <div className="view-controls">
        <button 
          className={selectedView === 'split' ? 'active' : ''}
          onClick={() => setSelectedView('split')}
        >
          Side by Side
        </button>
        <button 
          className={selectedView === 'table' ? 'active' : ''}
          onClick={() => setSelectedView('table')}
        >
          Table View
        </button>
        <label className="highlight-toggle">
          <input 
            type="checkbox" 
            checked={highlightDifferences}
            onChange={(e) => setHighlightDifferences(e.target.checked)}
          />
          Highlight Differences
        </label>
      </div>

      {selectedView === 'split' ? (
        <div className="split-view">
          <div className="ce-column">
            <div className="column-header">
              <span className="flag">🇪🇺</span>
              <h4>CE Marking</h4>
              <span className="scope">EU Market</span>
            </div>
            <div className="requirements-list">
              {requirements.map((req, idx) => (
                <div 
                  key={idx} 
                  className={`requirement-item ${highlightDifferences && req.highlight === 'different' ? 'highlight' : ''}`}
                >
                  <span className="category">{req.category}</span>
                  <span className="requirement">{req.ceRequirement}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="comparison-arrows">
            {requirements.map((req, idx) => (
              <div key={idx} className={`arrow ${req.highlight}`}>
                {req.highlight === 'same' ? '=' : req.highlight === 'different' ? '≠' : '⚠'}
              </div>
            ))}
          </div>

          <div className="ukca-column">
            <div className="column-header">
              <span className="flag">🇬🇧</span>
              <h4>UKCA Marking</h4>
              <span className="scope">GB Market</span>
            </div>
            <div className="requirements-list">
              {requirements.map((req, idx) => (
                <div 
                  key={idx} 
                  className={`requirement-item ${highlightDifferences && req.highlight === 'different' ? 'highlight' : ''}`}
                >
                  <span className="category">{req.category}</span>
                  <span className="requirement">{req.ukcaRequirement}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="table-view">
          <table>
            <thead>
              <tr>
                <th>Requirement</th>
                <th>CE Marking (EU)</th>
                <th>UKCA Marking (GB)</th>
              </tr>
            </thead>
            <tbody>
              {requirements.map((req, idx) => (
                <tr 
                  key={idx}
                  className={highlightDifferences && req.highlight === 'different' ? 'highlight' : ''}
                >
                  <td>{req.category}</td>
                  <td>{req.ceRequirement}</td>
                  <td>{req.ukcaRequirement}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="timeline-section">
        <h5>UKCA Implementation Timeline</h5>
        <div className="timeline">
          {timeline.map((item, idx) => (
            <div key={idx} className={`timeline-item ${item.status}`}>
              <span className="date">{item.date}</span>
              <span className="event">{item.event}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="key-insights">
        <h5>Key Insights</h5>
        <ul>
          <li>
            <strong>Dual marking possible:</strong> Products can bear both CE and UKCA 
            markings if they meet both sets of requirements
          </li>
          <li>
            <strong>Same technical standards:</strong> UK initially retained EU technical 
            standards, so requirements are largely identical
          </li>
          <li>
            <strong>Different conformity bodies:</strong> EU Notified Bodies vs UK Approved Bodies
          </li>
          <li>
            <strong>Northern Ireland special case:</strong> Uses UKNI marking alongside CE
          </li>
          <li>
            <strong>No mutual recognition:</strong> EU doesn't recognize UKCA; UK doesn't 
            recognize CE for new products post-2024
          </li>
        </ul>
      </div>
    </div>
  );
};
