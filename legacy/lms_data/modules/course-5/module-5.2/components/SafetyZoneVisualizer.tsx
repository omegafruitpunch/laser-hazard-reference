/**
 * Safety Zone Visualizer Component
 * 
 * Interactive diagram showing UK safety zone separation distances
 * for supervised vs unsupervised installations
 */

interface ZoneConfig {
  type: 'supervised' | 'unsupervised';
  label: string;
  verticalSeparation: number;
  lateralSeparation: number;
  description: string;
}

export const SafetyZoneVisualizer: React.FC = () => {
  const [selectedZone, setSelectedZone] = React.useState<ZoneConfig['type']>('supervised');
  const [showMeasurements, setShowMeasurements] = React.useState(true);
  const [audienceDensity, setAudienceDensity] = React.useState<'low' | 'medium' | 'high'>('medium');

  const zones: Record<ZoneConfig['type'], ZoneConfig> = {
    supervised: {
      type: 'supervised',
      label: 'Supervised Installation',
      verticalSeparation: 3,
      lateralSeparation: 2.5,
      description: 'Operator present and monitoring during show'
    },
    unsupervised: {
      type: 'unsupervised',
      label: 'Unsupervised Installation',
      verticalSeparation: 6,
      lateralSeparation: 2.5,
      description: 'No dedicated operator monitoring (e.g., nightclub installation)'
    }
  };

  const currentZone = zones[selectedZone];

  // Calculate scale factor for visualization
  const scale = 40; // pixels per meter
  const canvasWidth = 600;
  const canvasHeight = 400;

  return (
    <div className="safety-zone-visualizer">
      <div className="controls">
        <div className="zone-selector">
          <button 
            className={selectedZone === 'supervised' ? 'active' : ''}
            onClick={() => setSelectedZone('supervised')}
          >
            Supervised (3m/2.5m)
          </button>
          <button 
            className={selectedZone === 'unsupervised' ? 'active' : ''}
            onClick={() => setSelectedZone('unsupervised')}
          >
            Unsupervised (6m/2.5m)
          </button>
        </div>
        
        <label className="toggle-measurements">
          <input 
            type="checkbox" 
            checked={showMeasurements}
            onChange={(e) => setShowMeasurements(e.target.checked)}
          />
          Show Measurements
        </label>
      </div>

      <div className="zone-info">
        <h4>{currentZone.label}</h4>
        <p>{currentZone.description}</p>
        <div className="requirements">
          <div className="requirement">
            <span className="label">Vertical Separation:</span>
            <span className="value">{currentZone.verticalSeparation} meters minimum</span>
          </div>
          <div className="requirement">
            <span className="label">Lateral Separation:</span>
            <span className="value">{currentZone.lateralSeparation} meters minimum</span>
          </div>
        </div>
      </div>

      <div className="visualization">
        <svg 
          viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
          className="zone-diagram"
        >
          {/* Background */}
          <rect width={canvasWidth} height={canvasHeight} fill="#f8f9fa" />
          
          {/* Audience area */}
          <rect 
            x={50} 
            y={canvasHeight - 100} 
            width={500} 
            height={80} 
            fill="#e3f2fd"
            stroke="#2196f3"
            strokeWidth="2"
            rx="4"
          />
          <text x={300} y={canvasHeight - 60} textAnchor="middle" fill="#1976d2">
            Audience Area
          </text>
          
          {/* Audience figures (simplified) */}
          {Array.from({ length: audienceDensity === 'low' ? 3 : audienceDensity === 'medium' ? 6 : 10 }).map((_, i) => (
            <circle 
              key={i}
              cx={100 + i * 45}
              cy={canvasHeight - 30}
              r="8"
              fill="#64b5f6"
            />
          ))}

          {/* Safety zone */}
          <rect 
            x={50} 
            y={canvasHeight - 100 - (currentZone.verticalSeparation * scale)} 
            width={500} 
            height={currentZone.verticalSeparation * scale} 
            fill="rgba(255, 193, 7, 0.2)"
            stroke="#ffc107"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
          <text 
            x={300} 
            y={canvasHeight - 100 - (currentZone.verticalSeparation * scale / 2)} 
            textAnchor="middle" 
            fill="#f57f17"
          >
            Safety Zone
          </text>

          {/* Laser position */}
          <g transform={`translate(300, ${canvasHeight - 100 - (currentZone.verticalSeparation * scale) - 30})`}>
            {/* Laser housing */}
            <rect x="-20" y="-15" width="40" height="30" fill="#424242" rx="4" />
            {/* Laser beam aperture */}
            <circle cx="0" cy="0" r="8" fill="#ff1744" />
            {/* Beam */}
            <line 
              x1="0" 
              y1="0" 
              x2="0" 
              y2={currentZone.verticalSeparation * scale} 
              stroke="#ff1744" 
              strokeWidth="3"
              opacity="0.6"
            />
            <text x="30" y="5" fill="#424242" fontSize="12">Laser</text>
          </g>

          {/* Measurement lines */}
          {showMeasurements && (
            <>
              {/* Vertical measurement */}
              <line 
                x1="520" 
                y1={canvasHeight - 100} 
                x2="520" 
                y2={canvasHeight - 100 - (currentZone.verticalSeparation * scale)} 
                stroke="#666"
                strokeWidth="1"
              />
              <line x1="515" y1={canvasHeight - 100} x2="525" y2={canvasHeight - 100} stroke="#666" />
              <line 
                x1="515" 
                y1={canvasHeight - 100 - (currentZone.verticalSeparation * scale)} 
                x2="525" 
                y2={canvasHeight - 100 - (currentZone.verticalSeparation * scale)} 
                stroke="#666"
              />
              <text 
                x="535" 
                y={canvasHeight - 100 - (currentZone.verticalSeparation * scale / 2)} 
                fill="#666"
                fontSize="12"
              >
                {currentZone.verticalSeparation}m
              </text>

              {/* Lateral measurement */}
              <line 
                x1={50} 
                y1={canvasHeight - 20} 
                x2={50 + (currentZone.lateralSeparation * scale)} 
                y2={canvasHeight - 20} 
                stroke="#666"
                strokeWidth="1"
              />
              <line x1="50" y1={canvasHeight - 25} x2="50" y2={canvasHeight - 15} stroke="#666" />
              <line 
                x1={50 + (currentZone.lateralSeparation * scale)} 
                y1={canvasHeight - 25} 
                x2={50 + (currentZone.lateralSeparation * scale)} 
                y2={canvasHeight - 15} 
                stroke="#666"
              />
              <text 
                x={50 + (currentZone.lateralSeparation * scale / 2)} 
                y={canvasHeight - 5} 
                textAnchor="middle"
                fill="#666"
                fontSize="12"
              >
                {currentZone.lateralSeparation}m lateral
              </text>
            </>
          )}

          {/* Hazard zone indicator (if beams below safe height) */}
          {currentZone.verticalSeparation < 3 && (
            <g>
              <rect x="50" y="50" width="500" height="50" fill="rgba(244, 67, 54, 0.2)" />
              <text x="300" y="80" textAnchor="middle" fill="#c62828">
                ⚠️ BELOW MINIMUM SAFE HEIGHT
              </text>
            </g>
          )}
        </svg>
      </div>

      <div className="mpe-requirements">
        <h5>MPE Requirements</h5>
        <table>
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Value</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Standard MPE (400-700nm)</td>
              <td>10 W/m² (1 mW/cm²)</td>
              <td>For 10 second exposure</td>
            </tr>
            <tr>
              <td>Children adjustment</td>
              <td>Factor of 10 reduction</td>
              <td>For λ &lt; 500nm when children present</td>
            </tr>
            <tr>
              <td>Measurement aperture</td>
              <td>7mm diameter</td>
              <td>Fully dilated pupil</td>
            </tr>
            <tr>
              <td>Aversion response time</td>
              <td>0.25 seconds</td>
              <td>For trained staff during setup</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="practical-notes">
        <h5>Practical Implementation Notes</h5>
        <ul>
          <li>Always measure from the lowest point where audience members may be present</li>
          <li>Consider crowd surging - people may move closer during excitement</li>
          <li>Account for people being lifted on shoulders (add ~2m)</li>
          <li>Barriers should be sturdy and cannot be easily moved by crowd</li>
          <li>Regular alignment checks are essential for permanent installations</li>
        </ul>
      </div>
    </div>
  );
};
