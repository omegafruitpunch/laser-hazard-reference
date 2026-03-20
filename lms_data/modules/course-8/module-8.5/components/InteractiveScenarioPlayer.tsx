/**
 * InteractiveScenarioPlayer Component
 * 
 * Interactive scenario-based learning for electrical safety
 * in laser entertainment settings.
 */

import React, { useState } from 'react';
import { interactiveScenarios } from '../data';

export const InteractiveScenarioPlayer: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<string>('');
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [completed, setCompleted] = useState(false);
  const [history, setHistory] = useState<{step: number, correct: boolean}[]>([]);

  const scenario = interactiveScenarios.find(s => s.id === selectedScenario);
  const step = scenario?.steps[currentStep];

  const startScenario = (id: string) => {
    setSelectedScenario(id);
    setCurrentStep(0);
    setScore(0);
    setShowFeedback(false);
    setSelectedOption('');
    setCompleted(false);
    setHistory([]);
  };

  const selectOption = (optionId: string) => {
    if (showFeedback) return;
    setSelectedOption(optionId);
  };

  const submitAnswer = () => {
    if (!step || !selectedOption) return;

    const option = step.options.find(o => o.id === selectedOption);
    if (!option) return;

    const correct = option.correct;
    if (correct) setScore(s => s + 1);
    
    setHistory(h => [...h, { step: currentStep, correct }]);
    setShowFeedback(true);
  };

  const nextStep = () => {
    if (!scenario) return;

    if (currentStep < scenario.steps.length - 1) {
      setCurrentStep(c => c + 1);
      setShowFeedback(false);
      setSelectedOption('');
    } else {
      setCompleted(true);
    }
  };

  const resetScenario = () => {
    setSelectedScenario('');
    setCurrentStep(0);
    setScore(0);
    setShowFeedback(false);
    setSelectedOption('');
    setCompleted(false);
    setHistory([]);
  };

  if (completed && scenario) {
    const percentage = Math.round((score / scenario.steps.length) * 100);
    const passed = percentage >= scenario.passingScore;

    return (
      <div className="scenario-complete">
        <h3>Scenario Complete!</h3>
        
        <div className={`completion-status ${passed ? 'passed' : 'failed'}`}>
          <div className="score-display">
            <span className="score-value">{percentage}%</span>
            <span className="score-label">{passed ? 'PASSED' : 'REVIEW NEEDED'}</span>
          </div>
          <p>
            You answered {score} of {scenario.steps.length} questions correctly.
          </p>
          {!passed && (
            <p className="review-message">
              Review the electrical safety concepts and try again to ensure full understanding.
            </p>
          )}
        </div>

        <div className="objectives-review">
          <h4>Learning Objectives</h4>
          <ul>
            {scenario.objectives.map((obj, idx) => (
              <li key={idx}>{obj}</li>
            ))}
          </ul>
        </div>

        <div className="history-review">
          <h4>Your Responses</h4>
          {history.map((h, idx) => (
            <div key={idx} className={`response-item ${h.correct ? 'correct' : 'incorrect'}`}>
              Step {h.step + 1}: {h.correct ? 'Correct' : 'Incorrect'}
            </div>
          ))}
        </div>

        <div className="action-buttons">
          <button className="btn-restart" onClick={() => startScenario(scenario.id)}>
            Replay Scenario
          </button>
          <button className="btn-new" onClick={resetScenario}>
            Select Different Scenario
          </button>
        </div>
      </div>
    );
  }

  if (!scenario) {
    return (
      <div className="scenario-selection">
        <h3>Interactive Electrical Safety Scenarios</h3>
        <p className="intro">
          Practice electrical safety decision-making in realistic scenarios. 
          Each scenario presents situations you may encounter during laser show 
          setup and operation.
        </p>

        <div className="scenario-cards">
          {interactiveScenarios.map(s => (
            <div 
              key={s.id}
              className="scenario-card"
              onClick={() => startScenario(s.id)}
            >
              <h4>{s.title}</h4>
              <p>{s.setup.substring(0, 150)}...</p>
              <div className="scenario-meta">
                <span>{s.steps.length} decision points</span>
                <span>Pass: {s.passingScore}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!step) return null;

  const selectedOptionData = step.options.find(o => o.id === selectedOption);

  return (
    <div className="scenario-player">
      <div className="scenario-header">
        <h3>{scenario.title}</h3>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${((currentStep + 1) / scenario.steps.length) * 100}%` }}
          />
          <span className="progress-text">
            Step {currentStep + 1} of {scenario.steps.length}
          </span>
        </div>
      </div>

      <div className="scenario-setup">
        <p>{scenario.setup}</p>
      </div>

      {scenario.equipment.length > 0 && (
        <div className="equipment-list">
          <h4>Equipment Involved</h4>
          <ul>
            {scenario.equipment.map(eq => (
              <li key={eq.id}>
                <strong>{eq.name}</strong> - {eq.voltage}, {eq.powerRating}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="step-content">
        <div className="step-description">
          <p>{step.description}</p>
        </div>

        <div className="options-list">
          {step.options.map(option => (
            <button
              key={option.id}
              className={`option-btn ${selectedOption === option.id ? 'selected' : ''} ${
                showFeedback 
                  ? option.correct 
                    ? 'correct' 
                    : selectedOption === option.id 
                      ? 'incorrect' 
                      : ''
                  : ''
              }`}
              onClick={() => selectOption(option.id)}
              disabled={showFeedback}
            >
              {option.text}
            </button>
          ))}
        </div>

        {!showFeedback ? (
          <button 
            className="btn-submit"
            onClick={submitAnswer}
            disabled={!selectedOption}
          >
            Submit Answer
          </button>
        ) : (
          <div className="feedback-section">
            <div className={`feedback ${selectedOptionData?.correct ? 'correct' : 'incorrect'}`}>
              <h4>{selectedOptionData?.correct ? 'Correct!' : 'Incorrect'}</h4>
              <p>{selectedOptionData?.feedback}</p>
            </div>
            
            <div className="explanation">
              <h5>Explanation</h5>
              <p>{step.explanation}</p>
            </div>

            <button className="btn-next" onClick={nextStep}>
              {currentStep < scenario.steps.length - 1 ? 'Next Step' : 'Complete Scenario'}
            </button>
          </div>
        )}
      </div>

      <button className="btn-exit" onClick={resetScenario}>
        Exit Scenario
      </button>
    </div>
  );
};
