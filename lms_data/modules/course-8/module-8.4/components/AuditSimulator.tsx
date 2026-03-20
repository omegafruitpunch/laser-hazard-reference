/**
 * AuditSimulator Component
 * 
 * Virtual compliance audit simulation for preparing operators
 * and LSOs for regulatory inspections.
 */

import React, { useState, useMemo } from 'react';
import { AuditScenario, AuditQuestion } from '../types';
import { auditScenarios } from '../data';

interface AuditSimulatorProps {
  onComplete?: (result: AuditResult) => void;
}

export interface AuditResult {
  scenario: AuditScenario;
  answers: AuditAnswer[];
  score: number;
  passed: boolean;
  timeSpent: number;
  completedAt: Date;
}

export interface AuditAnswer {
  questionId: string;
  compliant: boolean | null;
  notes: string;
  evidenceProvided: string[];
}

export const AuditSimulator: React.FC<AuditSimulatorProps> = ({
  onComplete
}) => {
  const [selectedScenario, setSelectedScenario] = useState<string>('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AuditAnswer[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const scenario = useMemo(() => 
    auditScenarios.find(s => s.id === selectedScenario),
    [selectedScenario]
  );

  const currentQuestion = useMemo(() =>
    scenario?.questions[currentQuestionIndex],
    [scenario, currentQuestionIndex]
  );

  const handleStartAudit = (scenarioId: string) => {
    setSelectedScenario(scenarioId);
    const s = auditScenarios.find(sc => sc.id === scenarioId);
    if (s) {
      setAnswers(s.questions.map(q => ({
        questionId: q.id,
        compliant: null,
        notes: '',
        evidenceProvided: []
      })));
      setStartTime(Date.now());
      setCurrentQuestionIndex(0);
      setIsComplete(false);
      setShowResults(false);
    }
  };

  const updateAnswer = (updates: Partial<AuditAnswer>) => {
    setAnswers(prev =>
      prev.map((a, idx) =>
        idx === currentQuestionIndex ? { ...a, ...updates } : a
      )
    );
  };

  const goToNext = () => {
    if (currentQuestionIndex < (scenario?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      completeAudit();
    }
  };

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const completeAudit = () => {
    if (!scenario) return;

    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const totalPoints = scenario.questions.reduce((sum, q) => sum + q.points, 0);
    const earnedPoints = answers.reduce((sum, a, idx) => {
      if (a.compliant === true) {
        return sum + scenario.questions[idx].points;
      }
      return sum;
    }, 0);

    const score = Math.round((earnedPoints / totalPoints) * 100);
    const passed = score >= scenario.passingScore;

    const result: AuditResult = {
      scenario,
      answers,
      score,
      passed,
      timeSpent,
      completedAt: new Date()
    };

    setIsComplete(true);
    setShowResults(true);
    onComplete?.(result);
  };

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'critical': return 'severity-critical';
      case 'major': return 'severity-major';
      case 'minor': return 'severity-minor';
      default: return '';
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'critical': return 'Critical Finding';
      case 'major': return 'Major Finding';
      case 'minor': return 'Minor Finding';
      default: return severity;
    }
  };

  if (showResults && scenario) {
    const criticalFindings = answers.filter((a, idx) => 
      a.compliant === false && scenario.questions[idx].severity === 'critical'
    ).length;
    const majorFindings = answers.filter((a, idx) => 
      a.compliant === false && scenario.questions[idx].severity === 'major'
    ).length;
    const minorFindings = answers.filter((a, idx) => 
      a.compliant === false && scenario.questions[idx].severity === 'minor'
    ).length;

    return (
      <div className="audit-results">
        <h2>Audit Results</h2>
        
        <div className={`result-summary ${answers.find(a => a.compliant === null) ? 'incomplete' : passed ? 'passed' : 'failed'}`}>
          <div className="score-display">
            <span className="score-value">{score}%</span>
            <span className="score-label">
              {answers.find(a => a.compliant === null) ? 'Incomplete' : passed ? 'PASSED' : 'FAILED'}
            </span>
          </div>
          <div className="result-details">
            <p>Passing Score: {scenario.passingScore}%</p>
            <p>Time: {Math.floor(timeSpent / 60)}m {timeSpent % 60}s</p>
          </div>
        </div>

        <div className="findings-summary">
          <h3>Findings Summary</h3>
          <div className="findings-count">
            <div className="finding critical">
              <span className="count">{criticalFindings}</span>
              <span className="label">Critical</span>
            </div>
            <div className="finding major">
              <span className="count">{majorFindings}</span>
              <span className="label">Major</span>
            </div>
            <div className="finding minor">
              <span className="count">{minorFindings}</span>
              <span className="label">Minor</span>
            </div>
          </div>
        </div>

        <div className="detailed-results">
          <h3>Detailed Findings</h3>
          {answers.map((answer, idx) => {
            const question = scenario.questions[idx];
            return (
              <div 
                key={question.id} 
                className={`finding-detail ${answer.compliant === null ? 'not-answered' : answer.compliant ? 'compliant' : 'non-compliant'}`}
              >
                <div className="finding-header">
                  <span className={`severity-badge ${getSeverityClass(question.severity)}`}>
                    {getSeverityLabel(question.severity)}
                  </span>
                  <span className="points">{question.points} pts</span>
                </div>
                <p className="question-text">{question.question}</p>
                <div className="finding-status">
                  <strong>Status:</strong> {
                    answer.compliant === null ? 'Not Answered' :
                    answer.compliant ? 'Compliant' : 'Non-Compliant'
                  }
                </div>
                {answer.notes && (
                  <div className="finding-notes">
                    <strong>Notes:</strong> {answer.notes}
                  </div>
                )}
                {!answer.compliant && (
                  <div className="corrective-action">
                    <strong>Required Action:</strong> {question.complianceCriteria}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="action-buttons">
          <button 
            className="btn-restart"
            onClick={() => {
              setSelectedScenario('');
              setShowResults(false);
              setIsComplete(false);
            }}
          >
            Start New Audit
          </button>
        </div>
      </div>
    );
  }

  if (!scenario) {
    return (
      <div className="audit-simulator">
        <h2>Virtual Compliance Audit Simulator</h2>
        <p className="intro">
          Practice for regulatory inspections by completing a virtual audit. 
          Select a scenario below to begin.
        </p>

        <div className="scenario-selection">
          <h3>Select Audit Scenario</h3>
          <div className="scenario-cards">
            {auditScenarios.map(s => (
              <div 
                key={s.id} 
                className="scenario-card"
                onClick={() => handleStartAudit(s.id)}
              >
                <h4>{s.name}</h4>
                <p className="description">{s.description}</p>
                <div className="scenario-meta">
                  <span>Venue: {s.venue}</span>
                  <span>Passing: {s.passingScore}%</span>
                  <span>Questions: {s.questions.length}</span>
                  <span>Time: {s.timeLimit} min</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestionIndex + 1) / scenario.questions.length) * 100;
  const currentAnswer = answers[currentQuestionIndex];

  return (
    <div className="audit-in-progress">
      <div className="audit-header">
        <h2>{scenario.name}</h2>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
          <span className="progress-text">
            Question {currentQuestionIndex + 1} of {scenario.questions.length}
          </span>
        </div>
      </div>

      {currentQuestion && currentAnswer && (
        <div className="question-card">
          <div className="question-header">
            <span className={`severity-badge ${getSeverityClass(currentQuestion.severity)}`}>
              {getSeverityLabel(currentQuestion.severity)}
            </span>
            <span className="category">{currentQuestion.category}</span>
            <span className="points">{currentQuestion.points} points</span>
          </div>

          <h3 className="question-text">{currentQuestion.question}</h3>

          <div className="regulation-reference">
            <strong>Regulation:</strong> {currentQuestion.regulation}
          </div>

          <div className="compliance-criteria">
            <strong>Compliance Criteria:</strong>
            <p>{currentQuestion.complianceCriteria}</p>
          </div>

          <div className="evidence-required">
            <strong>Required Evidence:</strong>
            <ul>
              {currentQuestion.evidenceRequired.map((ev, idx) => (
                <li key={idx}>{ev}</li>
              ))}
            </ul>
          </div>

          <div className="compliance-answer">
            <label>Compliance Determination:</label>
            <div className="compliance-options">
              <button
                className={`option ${currentAnswer.compliant === true ? 'selected' : ''}`}
                onClick={() => updateAnswer({ compliant: true })}
              >
                Compliant
              </button>
              <button
                className={`option ${currentAnswer.compliant === false ? 'selected' : ''}`}
                onClick={() => updateAnswer({ compliant: false })}
              >
                Non-Compliant
              </button>
              <button
                className={`option ${currentAnswer.compliant === null ? 'selected' : ''}`}
                onClick={() => updateAnswer({ compliant: null })}
              >
                Not Assessed
              </button>
            </div>
          </div>

          <div className="audit-notes">
            <label>Audit Notes:</label>
            <textarea
              value={currentAnswer.notes}
              onChange={(e) => updateAnswer({ notes: e.target.value })}
              placeholder="Enter observations, evidence reviewed, corrective actions required..."
              rows={4}
            />
          </div>
        </div>
      )}

      <div className="navigation-buttons">
        <button 
          className="btn-prev"
          onClick={goToPrevious}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </button>
        <button 
          className="btn-next"
          onClick={goToNext}
        >
          {currentQuestionIndex === scenario.questions.length - 1 ? 'Complete Audit' : 'Next'}
        </button>
      </div>
    </div>
  );
};
