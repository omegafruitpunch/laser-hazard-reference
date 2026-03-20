/**
 * Compliance Pathway Simulator Component
 * 
 * Drag-and-drop sequencer for multi-country compliance steps
 * Allows learners to order the correct sequence of compliance actions
 */

interface ComplianceStep {
  id: string;
  text: string;
  order: number;
  note?: string;
}

interface ComplianceScenario {
  id: string;
  title: string;
  description: string;
  steps: ComplianceStep[];
  correctSequence: number[];
  hint: string;
}

export const CompliancePathway: React.FC = () => {
  const scenario: ComplianceScenario = {
    id: 'multi_country_festival',
    title: 'The Multi-Country Festival',
    description: "You're providing lasers for a festival that tours Finland, Sweden, and Germany. Put the compliance steps in the correct order:",
    steps: [
      { 
        id: 'step1', 
        text: 'Apply for permits from each country\'s radiation authority', 
        order: 2,
        note: 'Must be done after equipment is compliant'
      },
      { 
        id: 'step2', 
        text: 'Prepare Risk Assessments and Method Statements', 
        order: 3 
      },
      { 
        id: 'step3', 
        text: 'Ensure all equipment has CE marking', 
        order: 1,
        note: 'Prerequisite - must be done first'
      },
      { 
        id: 'step4', 
        text: 'Submit detailed equipment lists and tech credentials', 
        order: 4 
      },
      { 
        id: 'step5', 
        text: 'Conduct on-site MPE measurements before each show', 
        order: 6,
        note: 'Final verification step'
      },
      { 
        id: 'step6', 
        text: 'Have PASS/scan-fail devices installed', 
        order: 5,
        note: 'Required for Sweden'
      }
    ],
    correctSequence: [3, 1, 2, 4, 6, 5],
    hint: 'Equipment compliance comes first, then permits, then documentation, then on-site preparation.'
  };

  const [orderedSteps, setOrderedSteps] = React.useState<ComplianceStep[]>(
    [...scenario.steps].sort(() => Math.random() - 0.5) // Shuffle initially
  );
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);
  const [isCorrect, setIsCorrect] = React.useState<boolean | null>(null);
  const [showHint, setShowHint] = React.useState(false);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newSteps = [...orderedSteps];
    const draggedStep = newSteps[draggedIndex];
    newSteps.splice(draggedIndex, 1);
    newSteps.splice(index, 0, draggedStep);
    
    setOrderedSteps(newSteps);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const checkOrder = () => {
    const currentOrder = orderedSteps.map(step => step.order);
    const isOrderCorrect = JSON.stringify(currentOrder) === 
      JSON.stringify(scenario.correctSequence);
    setIsCorrect(isOrderCorrect);
  };

  const resetOrder = () => {
    setOrderedSteps([...scenario.steps].sort(() => Math.random() - 0.5));
    setIsCorrect(null);
    setShowHint(false);
  };

  return (
    <div className="compliance-pathway-simulator">
      <div className="scenario-header">
        <h4>{scenario.title}</h4>
        <p>{scenario.description}</p>
      </div>

      <div className="steps-container">
        <p className="instruction">Drag and drop to arrange in correct order:</p>
        
        {orderedSteps.map((step, index) => (
          <div
            key={step.id}
            className={`step-item ${draggedIndex === index ? 'dragging' : ''}`}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
          >
            <span className="step-number">{index + 1}</span>
            <span className="step-text">{step.text}</span>
            {step.note && (
              <span className="step-note" title={step.note}>ℹ️</span>
            )}
            <span className="drag-handle">⋮⋮</span>
          </div>
        ))}
      </div>

      <div className="controls">
        <button onClick={checkOrder} className="check-button">
          Check Order
        </button>
        <button onClick={() => setShowHint(true)} className="hint-button">
          Show Hint
        </button>
        <button onClick={resetOrder} className="reset-button">
          Reset
        </button>
      </div>

      {showHint && (
        <div className="hint-box">
          <strong>Hint:</strong> {scenario.hint}
        </div>
      )}

      {isCorrect !== null && (
        <div className={`result ${isCorrect ? 'correct' : 'incorrect'}`}>
          {isCorrect ? (
            <>
              <span className="icon">✓</span>
              <span>Correct! You've ordered the compliance steps properly.</span>
            </>
          ) : (
            <>
              <span className="icon">✗</span>
              <span>Not quite right. Try using the hint!</span>
            </>
          )}
        </div>
      )}

      <div className="explanation">
        <h5>Why This Order Matters:</h5>
        <ol>
          <li><strong>Equipment compliance</strong> (CE marking) is foundational - you can't get permits for non-compliant equipment</li>
          <li><strong>Permits</strong> must be obtained before detailed planning as they may have specific conditions</li>
          <li><strong>Documentation</strong> (Risk Assessments, Method Statements) is required for permit applications</li>
          <li><strong>Equipment lists and credentials</strong> are needed for authority review</li>
          <li><strong>Safety systems</strong> (PASS/scan-fail) must be in place before on-site testing</li>
          <li><strong>On-site measurements</strong> are the final verification before show operation</li>
        </ol>
      </div>
    </div>
  );
};
