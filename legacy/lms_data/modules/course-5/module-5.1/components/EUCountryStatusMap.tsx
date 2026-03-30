/**
 * EU Country Status Map Component
 * 
 * Interactive map showing Status A-F classifications for EU countries
 * Supports country selection, status filtering, and multi-country comparison
 */

interface Country {
  code: string;
  name: string;
  status: 'status_a' | 'status_c' | 'status_d' | 'status_e' | 'status_f';
  standard?: string;
  authority?: string;
  requirements: string[];
  mpeLimit?: string;
  notes?: string;
}

interface StatusLegend {
  status_a: { color: string; label: string; icon: string; description: string };
  status_c: { color: string; label: string; icon: string; description: string };
  status_d: { color: string; label: string; icon: string; description: string };
  status_e: { color: string; label: string; icon: string; description: string };
  status_f: { color: string; label: string; icon: string; description: string };
}

export const EUCountryStatusMap: React.FC = () => {
  // Map configuration
  const legend: StatusLegend = {
    status_a: { 
      color: '#e74c3c', 
      label: 'Status A', 
      icon: '📋',
      description: 'Permit required, permission given'
    },
    status_c: { 
      color: '#f39c12', 
      label: 'Status C', 
      icon: '⚠️',
      description: 'Permit required but often not enforced'
    },
    status_d: { 
      color: '#27ae60', 
      label: 'Status D', 
      icon: '✓',
      description: 'Allowed without permit'
    },
    status_e: { 
      color: '#8e44ad', 
      label: 'Status E', 
      icon: '🚫',
      description: 'Not allowed under almost all circumstances'
    },
    status_f: { 
      color: '#95a5a6', 
      label: 'Status F', 
      icon: '❓',
      description: 'Situation unclear'
    }
  };

  // Country data
  const countries: Country[] = [
    {
      code: 'AT',
      name: 'Austria',
      status: 'status_a',
      standard: 'OENORM S1105:2014',
      requirements: ['Permit required from authorities', 'Risk assessment required'],
      mpeLimit: '1 mW/cm² (10 W/m²)'
    },
    {
      code: 'FI',
      name: 'Finland',
      status: 'status_a',
      authority: 'STUK',
      requirements: ['Permit from STUK required', 'All lasers and techs listed in permit', 'On-site inspection mandatory', 'Grating effects typically only'],
      mpeLimit: '1 mW/cm² (special permits)'
    },
    {
      code: 'SE',
      name: 'Sweden',
      status: 'status_a',
      authority: 'Swedish Radiation Authority',
      requirements: ['Permit required', 'Risk Assessment and Method Statement', 'On-site MPE measurements', 'PASS/scan-fail device required']
    },
    {
      code: 'DE',
      name: 'Germany',
      status: 'status_a',
      standard: 'TÜV Standards',
      requirements: ['Permit from local authorities', 'TÜV compliance expected']
    },
    {
      code: 'CH',
      name: 'Switzerland',
      status: 'status_a',
      authority: 'FOPH',
      requirements: ['14 days advance notification', 'Competence certificate required', 'Level 2 for audience exposure'],
      notes: 'Competence Level 2 requires MPE calculation knowledge'
    },
    {
      code: 'NL',
      name: 'Netherlands',
      status: 'status_d',
      references: 'NEN 6025x, ARBO',
      requirements: ['No specific permit required', 'General workplace safety applies']
    },
    {
      code: 'BE',
      name: 'Belgium',
      status: 'status_d',
      requirements: ['No permit required', 'General safety principles apply']
    },
    {
      code: 'FR',
      name: 'France',
      status: 'status_e',
      notes: 'Status D for outdoor shows',
      requirements: ['Indoor: Audience scanning not allowed', 'Outdoor: Allowed without permit']
    },
    {
      code: 'IT',
      name: 'Italy',
      status: 'status_d',
      requirements: ['No specific permit required']
    },
    {
      code: 'ES',
      name: 'Spain',
      status: 'status_d',
      requirements: ['No specific permit required']
    },
    {
      code: 'PL',
      name: 'Poland',
      status: 'status_f',
      notes: 'Situation unclear in practice'
    },
    {
      code: 'LU',
      name: 'Luxembourg',
      status: 'status_c',
      notes: 'Status A/C hybrid - permit required but enforcement varies'
    }
  ];

  // Component state management
  const [selectedCountry, setSelectedCountry] = React.useState<Country | null>(null);
  const [filteredStatus, setFilteredStatus] = React.useState<string | null>(null);
  const [comparisonCountries, setComparisonCountries] = React.useState<Country[]>([]);

  // Filter countries by status
  const filteredCountries = filteredStatus 
    ? countries.filter(c => c.status === filteredStatus)
    : countries;

  // Add country to comparison
  const addToComparison = (country: Country) => {
    if (comparisonCountries.length < 3 && !comparisonCountries.find(c => c.code === country.code)) {
      setComparisonCountries([...comparisonCountries, country]);
    }
  };

  return (
    <div className="eu-country-status-map">
      {/* Legend */}
      <div className="status-legend">
        <h4>Status Legend</h4>
        {Object.entries(legend).map(([key, value]) => (
          <div 
            key={key}
            className="legend-item"
            style={{ borderLeft: `4px solid ${value.color}` }}
            onClick={() => setFilteredStatus(filteredStatus === key ? null : key)}
          >
            <span className="legend-icon">{value.icon}</span>
            <span className="legend-label">{value.label}</span>
            <span className="legend-description">{value.description}</span>
          </div>
        ))}
      </div>

      {/* Map Visualization */}
      <div className="map-container">
        <svg viewBox="0 0 800 600" className="eu-map">
          {/* Simplified EU map paths would go here */}
          {filteredCountries.map(country => (
            <path
              key={country.code}
              d={getCountryPath(country.code)} // Country path data
              fill={legend[country.status].color}
              stroke="#fff"
              strokeWidth="1"
              className={`country-path ${selectedCountry?.code === country.code ? 'selected' : ''}`}
              onClick={() => setSelectedCountry(country)}
            />
          ))}
        </svg>
      </div>

      {/* Country Details Panel */}
      {selectedCountry && (
        <div className="country-details">
          <h3>{selectedCountry.name}</h3>
          <div className="status-badge" style={{ backgroundColor: legend[selectedCountry.status].color }}>
            {legend[selectedCountry.status].label}
          </div>
          {selectedCountry.standard && (
            <p><strong>Standard:</strong> {selectedCountry.standard}</p>
          )}
          {selectedCountry.authority && (
            <p><strong>Authority:</strong> {selectedCountry.authority}</p>
          )}
          {selectedCountry.mpeLimit && (
            <p><strong>MPE Limit:</strong> {selectedCountry.mpeLimit}</p>
          )}
          <h4>Requirements:</h4>
          <ul>
            {selectedCountry.requirements.map((req, idx) => (
              <li key={idx}>{req}</li>
            ))}
          </ul>
          {selectedCountry.notes && (
            <p className="notes">{selectedCountry.notes}</p>
          )}
          <button onClick={() => addToComparison(selectedCountry)}>
            Add to Comparison
          </button>
        </div>
      )}

      {/* Comparison Panel */}
      {comparisonCountries.length > 0 && (
        <div className="comparison-panel">
          <h4>Country Comparison ({comparisonCountries.length}/3)</h4>
          <table>
            <thead>
              <tr>
                <th>Attribute</th>
                {comparisonCountries.map(c => (
                  <th key={c.code}>{c.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Status</td>
                {comparisonCountries.map(c => (
                  <td key={c.code}>
                    <span style={{ color: legend[c.status].color }}>
                      {legend[c.status].label}
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td>Permit Required</td>
                {comparisonCountries.map(c => (
                  <td key={c.code}>
                    {c.status === 'status_a' ? 'Yes' : 
                     c.status === 'status_d' ? 'No' : 'Varies'}
                  </td>
                ))}
              </tr>
              <tr>
                <td>MPE Limit</td>
                {comparisonCountries.map(c => (
                  <td key={c.code}>{c.mpeLimit || 'Standard 10 W/m²'}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Helper function for country SVG paths
function getCountryPath(code: string): string {
  // Simplified paths for demonstration
  const paths: Record<string, string> = {
    'DE': 'M380,200 L420,200 L420,240 L380,240 Z',
    'FR': 'M320,250 L370,250 L370,320 L320,320 Z',
    'AT': 'M440,280 L470,280 L470,310 L440,310 Z',
    'CH': 'M390,290 L420,290 L420,310 L390,310 Z',
    'NL': 'M360,180 L390,180 L390,210 L360,210 Z',
    'BE': 'M350,220 L380,220 L380,250 L350,250 Z',
    'IT': 'M430,320 L460,320 L450,380 L440,380 Z',
    'ES': 'M280,320 L340,320 L330,380 L290,380 Z',
    'SE': 'M440,100 L480,100 L470,180 L450,180 Z',
    'FI': 'M480,80 L520,80 L510,140 L490,140 Z',
    'PL': 'M460,210 L500,210 L500,250 L460,250 Z',
    'LU': 'M370,250 L385,250 L385,265 L370,265 Z'
  };
  return paths[code] || '';
}
