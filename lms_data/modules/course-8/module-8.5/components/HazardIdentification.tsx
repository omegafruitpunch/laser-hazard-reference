/**
 * HazardIdentification Component
 * 
 * Educational component for identifying and understanding
 * electrical hazards in laser systems.
 */

import React, { useState } from 'react';
import { electricalHazards, equipmentCategories } from '../data';

export const HazardIdentification: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hazards' | 'equipment' | 'mitigation'>('hazards');
  const [selectedHazard, setSelectedHazard] = useState<string>('');
  const [quizMode, setQuizMode] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const hazard = selectedHazard 
    ? electricalHazards.find(h => h.id === selectedHazard)
    : null;

  const quizQuestions = [
    {
      question: 'You notice a laser projector power cord has a small cut in the insulation, exposing the conductor. What is the hazard level?',
      options: ['Low', 'Medium', 'High', 'Critical'],
      correct: 3,
      explanation: 'Exposed conductors present a critical electric shock hazard and the equipment must be taken out of service until repaired.'
    },
    {
      question: 'During inspection, you find that the housing interlock has been bypassed with a wire jumper. What should you do?',
      options: [
        'Remove the jumper and test the interlock',
        'Document it and continue the show',
        'Place the equipment out of service immediately',
        'Notify the operator but proceed'
      ],
      correct: 2,
      explanation: 'A bypassed interlock is a critical safety defect. The equipment must be taken out of service immediately and cannot be used until properly repaired.'
    },
    {
      question: 'The E-stop button on a laser projector takes 2-3 seconds to shut down the laser after activation. Is this acceptable?',
      options: [
        'Yes, as long as it eventually stops',
        'No, E-stop must be immediate',
        'Yes for low-power lasers only',
        'Depends on the venue'
      ],
      correct: 1,
      explanation: 'E-stop activation must result in immediate laser shutdown. A 2-3 second delay indicates a serious fault and the system must not be used.'
    }
  ];

  const startQuiz = () => {
    setQuizMode(true);
    setCurrentQuiz(0);
    setQuizScore(0);
    setShowAnswer(false);
  };

  const answerQuiz = (answerIndex: number) => {
    if (showAnswer) return;
    
    const correct = answerIndex === quizQuestions[currentQuiz].correct;
    if (correct) setQuizScore(s => s + 1);
    setShowAnswer(true);
  };

  const nextQuestion = () => {
    if (currentQuiz < quizQuestions.length - 1) {
      setCurrentQuiz(c => c + 1);
      setShowAnswer(false);
    } else {
      setQuizMode(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#ca8a04';
      case 'low': return '#16a34a';
      default: return '#6b7280';
    }
  };

  if (quizMode) {
    const q = quizQuestions[currentQuiz];
    return (
      <div className="hazard-quiz">
        <h3>Electrical Hazard Assessment Quiz</h3>
        <div className="quiz-progress">
          Question {currentQuiz + 1} of {quizQuestions.length}
        </div>
        <div className="quiz-score">
          Score: {quizScore} / {quizQuestions.length}
        </div>
        
        <div className="quiz-question">
          <p>{q.question}</p>
          <div className="quiz-options">
            {q.options.map((opt, idx) => (
              <button
                key={idx}
                className={`quiz-option ${showAnswer 
                  ? idx === q.correct 
                    ? 'correct' 
                    : 'incorrect'
                  : ''}`}
                onClick={() => answerQuiz(idx)}
                disabled={showAnswer}
              >
                {opt}
              </button>
            ))}
          </div>
          
          {showAnswer && (
            <div className="quiz-explanation">
              <p><strong>Explanation:</strong> {q.explanation}</p>
              <button className="btn-next" onClick={nextQuestion}>
                {currentQuiz < quizQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="hazard-identification">
      <div className="tabs">
        <button 
          className={activeTab === 'hazards' ? 'active' : ''}
          onClick={() => setActiveTab('hazards')}
        >
          Electrical Hazards
        </button>
        <button 
          className={activeTab === 'equipment' ? 'active' : ''}
          onClick={() => setActiveTab('equipment')}
        >
          Equipment-Specific
        </button>
        <button 
          className={activeTab === 'mitigation' ? 'active' : ''}
          onClick={() => setActiveTab('mitigation')}
        >
          Mitigation Strategies
        </button>
      </div>

      {activeTab === 'hazards' && (
        <div className="hazards-content">
          <div className="hazard-selector">
            <label>Select a hazard to learn more:</label>
            <select
              value={selectedHazard}
              onChange={(e) => setSelectedHazard(e.target.value)}
            >
              <option value="">-- Select Hazard --</option>
              {electricalHazards.map(h => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>
          </div>

          {hazard && (
            <div className="hazard-detail">
              <h4 style={{ color: getSeverityColor(hazard.severity) }}>
                {hazard.name}
                <span className="severity-badge" style={{ backgroundColor: getSeverityColor(hazard.severity) }}>
                  {hazard.severity.toUpperCase()}
                </span>
              </h4>
              <p className="description">{hazard.description}</p>
              
              <div className="hazard-section">
                <h5>Common Sources</h5>
                <ul>
                  {hazard.commonSources.map((source, idx) => (
                    <li key={idx}>{source}</li>
                  ))}
                </ul>
              </div>

              <div className="hazard-section">
                <h5>Mitigation Strategies</h5>
                <ul>
                  {hazard.mitigationStrategies.map((strategy, idx) => (
                    <li key={idx}>{strategy}</li>
                  ))}
                </ul>
              </div>

              <div className="hazard-section">
                <h5>Relevant Standards</h5>
                <ul>
                  {hazard.relevantStandards.map((std, idx) => (
                    <li key={idx} className="standard-ref">{std}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {!hazard && (
            <div className="hazard-overview">
              <h4>Common Electrical Hazards in Laser Systems</h4>
              <div className="hazard-grid">
                {electricalHazards.map(h => (
                  <div 
                    key={h.id}
                    className="hazard-card"
                    onClick={() => setSelectedHazard(h.id)}
                  >
                    <span 
                      className="severity-indicator"
                      style={{ backgroundColor: getSeverityColor(h.severity) }}
                    />
                    <h5>{h.name}</h5>
                    <p>{h.description.substring(0, 100)}...</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button className="btn-quiz" onClick={startQuiz}>
            Take Hazard Assessment Quiz
          </button>
        </div>
      )}

      {activeTab === 'equipment' && (
        <div className="equipment-content">
          <h4>Equipment-Specific Electrical Hazards</h4>
          {equipmentCategories.map(cat => (
            <div key={cat.id} className="equipment-category">
              <h5>{cat.name}</h5>
              <p>{cat.description}</p>
              
              <div className="inspection-items">
                <h6>Key Inspection Items:</h6>
                <ul>
                  {cat.inspectionItems.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="common-failures">
                <h6>Common Failures:</h6>
                <ul>
                  {cat.commonFailures.map((failure, idx) => (
                    <li key={idx} className="failure-item">{failure}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'mitigation' && (
        <div className="mitigation-content">
          <h4>Electrical Hazard Mitigation</h4>
          
          <div className="mitigation-categories">
            <div className="mitigation-category">
              <h5>Engineering Controls</h5>
              <ul>
                <li>Proper grounding and bonding of all equipment</li>
                <li>GFCI protection for portable and outdoor equipment</li>
                <li>Adequate circuit protection (breakers/fuses)</li>
                <li>Insulation integrity maintenance</li>
                <li>Surge protection for sensitive electronics</li>
              </ul>
            </div>

            <div className="mitigation-category">
              <h5>Administrative Controls</h5>
              <ul>
                <li>Regular inspection and testing procedures</li>
                <li>Lockout/tagout programs</li>
                <li>Personnel training on electrical safety</li>
                <li>Pre-use equipment checks</li>
                <li>Documentation of maintenance activities</li>
              </ul>
            </div>

            <div className="mitigation-category">
              <h5>Personal Protective Equipment</h5>
              <ul>
                <li>Insulated gloves for electrical work</li>
                <li>Non-conductive footwear</li>
                <li>ARC-rated clothing for high-voltage work</li>
                <li>Face shields for arc flash protection</li>
                <li>Insulated tools</li>
              </ul>
            </div>
          </div>

          <div className="testing-importance">
            <h5>Importance of Regular Testing</h5>
            <p>
              Electrical safety devices can fail over time due to wear, contamination, 
              or mechanical stress. Regular testing is essential to ensure these devices 
              will function when needed.
            </p>
            <ul>
              <li><strong>Before Each Use:</strong> GFCI, visual cord inspection</li>
              <li><strong>Before Each Performance:</strong> Interlocks, E-stop</li>
              <li><strong>Weekly:</strong> Key control, enclosure integrity</li>
              <li><strong>Monthly:</strong> Ground continuity, surge protectors</li>
              <li><strong>Annual:</strong> Comprehensive electrical safety audit</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
