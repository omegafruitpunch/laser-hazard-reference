/**
 * Inspector Powers Simulator Component
 * 
 * Interactive scenario-based learning about Health Canada
 * inspector powers and limitations under REDA
 */

interface Scenario {
  id: string;
  situation: string;
  action: string;
  permitted: boolean;
  explanation: string;
  legalReference: string;
}

export const InspectorPowers: React.FC = () => {
  const [currentScenario, setCurrentScenario] = React.useState<number>(0);
  const [userAnswer, setUserAnswer] = React.useState<boolean | null>(null);
  const [showResult, setShowResult] = React.useState(false);
  const [score, setScore] = React.useState({ correct: 0, total: 0 });

  const scenarios: Scenario[] = [
    {
      id: 'entry_business',
      situation: 'A Health Canada inspector arrives at your laser equipment business during operating hours.',
      action: 'The inspector enters the showroom floor without a warrant.',
      permitted: true,
      explanation: 'Section 8(1) allows inspectors to enter premises at any reasonable time to examine radiation emitting devices.',
      legalReference: 'REDA Section 8(1)'
    },
    {
      id: 'entry_home',
      situation: 'An inspector wants to examine laser equipment stored in your home-based workshop.',
      action: 'The inspector enters your home without consent or a warrant.',
      permitted: false,
      explanation: 'Section 8(2) requires either occupant consent or a warrant issued by a justice of the peace for dwelling-house entry.',
      legalReference: 'REDA Section 8(2)'
    },
    {
      id: 'seizure',
      situation: 'During an inspection, the inspector suspects a laser product violates safety standards.',
      action: 'The inspector seizes the laser equipment for further examination.',
      permitted: true,
      explanation: 'Section 10 allows seizure if the inspector believes on reasonable grounds that the Act has been contravened.',
      legalReference: 'REDA Section 10(1)'
    },
    {
      id: 'records',
      situation: 'An inspector is examining your business records related to laser product sales.',
      action: 'The inspector makes copies of shipping bills and test data records.',
      permitted: true,
      explanation: 'Section 8(1)(c) authorizes inspectors to examine and make copies of relevant books, records, and documents.',
      legalReference: 'REDA Section 8(1)(c)'
    },
    {
      id: 'arrest',
      situation: 'An inspector discovers a serious violation of REDA during an inspection.',
      action: 'The inspector arrests the business owner.',
      permitted: false,
      explanation: 'Inspectors do not have arrest powers. They report findings to the Minister who may pursue prosecution through courts.',
      legalReference: 'REDA Sections 7-10 (inspector powers do not include arrest)'
    },
    {
      id: 'obstruction',
      situation: 'During an inspection, you refuse to answer the inspector\'s questions.',
      action: 'You decline to provide information about your laser product inventory.',
      permitted: false,
      explanation: 'Section 8(4) requires giving inspectors all reasonable assistance and furnishing requested information.',
      legalReference: 'REDA Section 8(4)'
    },
    {
      id: 'detention',
      situation: 'An inspector takes a laser device for examination.',
      action: 'After testing, the inspector returns the device satisfied it complies with the Act.',
      permitted: true,
      explanation: 'Section 8(5) requires the inspector to release detained items once satisfied the Act\'s provisions have been complied with.',
      legalReference: 'REDA Section 8(5)'
    },
    {
      id: 'warrant',
      situation: 'An inspector wants to enter a private residence where laser equipment is stored.',
      action: 'The inspector obtains a warrant from a justice of the peace.',
      permitted: true,
      explanation: 'Section 8(3) allows a justice of the peace to issue a warrant if satisfied the conditions for entry exist.',
      legalReference: 'REDA Section 8(3)'
    }
  ];

  const handleAnswer = (answer: boolean) => {
    setUserAnswer(answer);
    setShowResult(true);
    
    const isCorrect = answer === scenarios[currentScenario].permitted;
    setScore({
      correct: score.correct + (isCorrect ? 1 : 0),
      total: score.total + 1
    });
  };

  const nextScenario = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setUserAnswer(null);
      setShowResult(false);
    }
  };

  const reset = () => {
    setCurrentScenario(0);
    setUserAnswer(null);
    setShowResult(false);
    setScore({ correct: 0, total: 0 });
  };

  const scenario = scenarios[currentScenario];
  const isCorrect = userAnswer === scenario.permitted;

  return (
    <div className="inspector-powers-simulator">
      <div className="progress-header">
        <span>Scenario {currentScenario + 1} of {scenarios.length}</span>
        <span className="score">Score: {score.correct}/{score.total}</span>
      </div>

      <div className="scenario-card">
        <div className="scenario-badge">
          <span role="img" aria-label="inspector">👮</span>
        </div>
        
        <div className="scenario-content">
          <h4>Situation</h4>
          <p>{scenario.situation}</p>
          
          <div className="action-box">
            <strong>Inspector Action:</strong>
            <p>{scenario.action}</p>
          </div>

          {!showResult ? (
            <div className="answer-section">
              <p className="question">Is this action permitted under REDA?</p>
              <div className="answer-buttons">
                <button 
                  onClick={() => handleAnswer(true)}
                  className="permitted-button"
                >
                  ✅ Permitted
                </button>
                <button 
                  onClick={() => handleAnswer(false)}
                  className="not-permitted-button"
                >
                  ❌ Not Permitted
                </button>
              </div>
            </div>
          ) : (
            <div className={`result-section ${isCorrect ? 'correct' : 'incorrect'}`}>
              <div className="result-header">
                <span className="result-icon">
                  {isCorrect ? '✓' : '✗'}
                </span>
                <span className="result-text">
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </span>
              </div>
              
              <div className="explanation">
                <p><strong>Answer:</strong> {scenario.permitted ? 'Permitted' : 'Not Permitted'}</p>
                <p>{scenario.explanation}</p>
                <p className="legal-ref">
                  <strong>Legal Reference:</strong> {scenario.legalReference}
                </p>
              </div>

              {currentScenario < scenarios.length - 1 ? (
                <button onClick={nextScenario} className="next-button">
                  Next Scenario →
                </button>
              ) : (
                <div className="completion">
                  <p>All scenarios completed!</p>
                  <p>Final Score: {score.correct}/{scenarios.length}</p>
                  <button onClick={reset} className="restart-button">
                    Try Again
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="powers-summary">
        <h5>Inspector Powers Summary (REDA Section 8)</h5>
        <div className="powers-grid">
          <div className="power-category permitted">
            <h6>✅ Permitted</h6>
            <ul>
              <li>Enter business premises at reasonable time</li>
              <li>Examine and remove devices</li>
              <li>Open and examine packages</li>
              <li>Copy records and documents</li>
              <li>Seize suspected contraband</li>
              <li>Enter dwelling with warrant</li>
            </ul>
          </div>
          <div className="power-category restricted">
            <h6>🚫 Restricted</h6>
            <ul>
              <li>Enter dwelling without consent/warrant</li>
              <li>Arrest individuals</li>
              <li>Inspect without certificate</li>
              <li>Remove items without cause</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="obstruction-warning">
        <h5>⚠️ Obstruction Offences (Section 9)</h5>
        <p>It is an offence to:</p>
        <ul>
          <li>Obstruct or hinder an inspector</li>
          <li>Knowingly make false or misleading statements</li>
          <li>Remove or interfere with detained devices</li>
        </ul>
        <p className="penalty-note">
          Penalties: Fine up to $1,000 and/or imprisonment up to 6 months (summary conviction)
        </p>
      </div>
    </div>
  );
};
