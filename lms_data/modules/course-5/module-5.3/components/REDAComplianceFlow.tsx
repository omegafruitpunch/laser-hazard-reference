/**
 * REDA Compliance Flow Component
 * 
 * Interactive flowchart showing indoor vs outdoor compliance pathways
 * under Canada's Radiation Emitting Devices Act
 */

type PathwayType = 'indoor' | 'outdoor';

interface FlowStep {
  step: number;
  action: string;
  details: string;
  icon?: string;
}

interface CompliancePathway {
  id: PathwayType;
  title: string;
  steps: FlowStep[];
  keyPoint: string;
  additionalNotes?: string[];
}

export const REDAComplianceFlow: React.FC = () => {
  const [selectedPathway, setSelectedPathway] = React.useState<PathwayType>('indoor');
  const [completedSteps, setCompletedSteps] = React.useState<number[]>([]);

  const pathways: Record<PathwayType, CompliancePathway> = {
    indoor: {
      id: 'indoor',
      title: 'Indoor Shows Pathway',
      steps: [
        {
          step: 1,
          action: 'Design show with MPE below 2.5 mW/cm²',
          details: 'Maximum Permissible Exposure limit for audience',
          icon: '📐'
        },
        {
          step: 2,
          action: 'Conduct irradiance measurements',
          details: 'Verify compliance with MPE limit using calibrated meter',
          icon: '📊'
        },
        {
          step: 3,
          action: 'Document safety measures',
          details: 'Risk assessment, method statement, MPE calculations',
          icon: '📋'
        },
        {
          step: 4,
          action: 'Check provincial OHS requirements',
          details: 'Contact provincial regulator for any additional requirements',
          icon: '🏛️'
        }
      ],
      keyPoint: 'No federal permit required, but strict MPE compliance mandatory',
      additionalNotes: [
        'Provincial OHS acts may require additional permits',
        'Some cities (Montreal, Toronto, Vancouver) have strict laser pointer laws',
        'Documentation should be available for inspection'
      ]
    },
    outdoor: {
      id: 'outdoor',
      title: 'Outdoor Shows Pathway',
      steps: [
        {
          step: 1,
          action: 'Complete Notice of Proposal form',
          details: 'Transport Canada "Notice of Proposal to Conduct Outdoor Laser Operation(s)"',
          icon: '📝'
        },
        {
          step: 2,
          action: 'Submit to Civil Aviation Regional Office',
          details: 'Contact appropriate regional office for your area',
          icon: '📤'
        },
        {
          step: 3,
          action: 'Receive authorization before operation',
          details: 'Cannot proceed without written authorization from Transport Canada',
          icon: '✅'
        },
        {
          step: 4,
          action: 'Comply with any conditions specified',
          details: 'Authorization may include specific operational requirements',
          icon: '📋'
        }
      ],
      keyPoint: 'Authorization REQUIRED before outdoor operation',
      additionalNotes: [
        'Submit well in advance of planned show date',
        'Form similar to US FAA Advisory Circular 70-1',
        'Authorization may include NOTAM requirements',
        'Even terminated beams require authorization if outdoors'
      ]
    }
  };

  const currentPathway = pathways[selectedPathway];

  const toggleStep = (stepNum: number) => {
    if (completedSteps.includes(stepNum)) {
      setCompletedSteps(completedSteps.filter(s => s !== stepNum));
    } else {
      setCompletedSteps([...completedSteps, stepNum]);
    }
  };

  return (
    <div className="reda-compliance-flow">
      <div className="pathway-selector">
        <button 
          className={selectedPathway === 'indoor' ? 'active' : ''}
          onClick={() => {
            setSelectedPathway('indoor');
            setCompletedSteps([]);
          }}
        >
          🏢 Indoor Shows
        </button>
        <button 
          className={selectedPathway === 'outdoor' ? 'active' : ''}
          onClick={() => {
            setSelectedPathway('outdoor');
            setCompletedSteps([]);
          }}
        >
          🌤️ Outdoor Shows
        </button>
      </div>

      <div className={`pathway-display ${selectedPathway}`}>
        <div className="pathway-header">
          <h4>{currentPathway.title}</h4>
          <div className={`key-point ${selectedPathway}`}>
            <span className="icon">
              {selectedPathway === 'indoor' ? '⚠️' : '🛑'}
            </span>
            <span>{currentPathway.keyPoint}</span>
          </div>
        </div>

        <div className="flow-steps">
          {currentPathway.steps.map((step, index) => (
            <div 
              key={step.step}
              className={`flow-step ${completedSteps.includes(step.step) ? 'completed' : ''}`}
              onClick={() => toggleStep(step.step)}
            >
              <div className="step-connector">
                {index > 0 && <div className="connector-line" />}
                <div className="step-number">{step.step}</div>
              </div>
              
              <div className="step-content">
                <div className="step-icon">{step.icon}</div>
                <div className="step-text">
                  <h5>{step.action}</h5>
                  <p>{step.details}</p>
                </div>
                <div className="step-checkbox">
                  {completedSteps.includes(step.step) ? '✓' : '○'}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="progress-indicator">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: `${(completedSteps.length / currentPathway.steps.length) * 100}%` 
              }}
            />
          </div>
          <span className="progress-text">
            {completedSteps.length} of {currentPathway.steps.length} steps completed
          </span>
        </div>

        {currentPathway.additionalNotes && (
          <div className="additional-notes">
            <h5>Important Notes</h5>
            <ul>
              {currentPathway.additionalNotes.map((note, idx) => (
                <li key={idx}>{note}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="jurisdiction-matrix">
        <h5>Canadian Regulatory Jurisdiction</h5>
        <table>
          <thead>
            <tr>
              <th>Scenario</th>
              <th>Regulator</th>
              <th>Requirement</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Indoor laser show</td>
              <td>Provincial OHS</td>
              <td>MPE compliance (&lt; 2.5 mW/cm²)</td>
            </tr>
            <tr>
              <td>Outdoor laser show</td>
              <td>Transport Canada</td>
              <td>Notice of Proposal + Authorization</td>
            </tr>
            <tr>
              <td>Laser product sale/import</td>
              <td>Health Canada (REDA)</td>
              <td>Compliance with standards</td>
            </tr>
            <tr>
              <td>Laser device defect</td>
              <td>Health Canada</td>
              <td>Notification "forthwith"</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="comparison-summary">
        <h5>Indoor vs Outdoor Quick Reference</h5>
        <div className="comparison-grid">
          <div className="comparison-header">
            <div>Aspect</div>
            <div>Indoor</div>
            <div>Outdoor</div>
          </div>
          <div className="comparison-row">
            <div>Federal permit required</div>
            <div className="no">No</div>
            <div className="yes">Yes - Transport Canada</div>
          </div>
          <div className="comparison-row">
            <div>MPE limit</div>
            <div>2.5 mW/cm²</div>
            <div>As specified in authorization</div>
          </div>
          <div className="comparison-row">
            <div>Form submission</div>
            <div>Not required</div>
            <div>Notice of Proposal required</div>
          </div>
          <div className="comparison-row">
            <div>Advance notice</div>
            <div>As required by venue/province</div>
            <div>Sufficient time for TC review</div>
          </div>
        </div>
      </div>
    </div>
  );
};
