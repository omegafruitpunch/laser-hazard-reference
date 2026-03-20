import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './styles.module.css';
import { moduleInfo, phases, quizQuestions, classificationScenarios } from './data';
import ClassificationPyramid from './components/ClassificationPyramid';
import ClassificationSorting from './components/ClassificationSorting';
import AELExplorer from './components/AELExplorer';
import ControlMeasuresMatrix from './components/ControlMeasuresMatrix';

type PhaseType = 'warmup' | 'core' | 'practice' | 'challenge' | 'complete';

interface ModuleState {
  currentPhase: PhaseType;
  quizScore: number;
  currentQuizIndex: number;
  hintsRevealed: Record<string, boolean>;
  scenarioAnswer: string | null;
}

const ClassificationModule: React.FC = () => {
  const [state, setState] = useState<ModuleState>({
    currentPhase: 'warmup',
    quizScore: 0,
    currentQuizIndex: 0,
    hintsRevealed: {},
    scenarioAnswer: null,
  });

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentScenario, setCurrentScenario] = useState(0);

  const handlePhaseComplete = () => {
    const phaseOrder: PhaseType[] = ['warmup', 'core', 'practice', 'challenge', 'complete'];
    const currentIndex = phaseOrder.indexOf(state.currentPhase);
    if (currentIndex < phaseOrder.length - 1) {
      setState((prev) => ({
        ...prev,
        currentPhase: phaseOrder[currentIndex + 1],
      }));
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  const handleQuizAnswer = (answerIndex: number) => {
    const currentQuestion = quizQuestions[state.currentQuizIndex];
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    
    setSelectedAnswer(answerIndex);
    setShowFeedback(true);

    if (isCorrect) {
      setState((prev) => ({
        ...prev,
        quizScore: prev.quizScore + 1,
      }));
    }
  };

  const handleNextQuestion = () => {
    if (state.currentQuizIndex < quizQuestions.length - 1) {
      setState((prev) => ({
        ...prev,
        currentQuizIndex: prev.currentQuizIndex + 1,
      }));
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      handlePhaseComplete();
    }
  };

  const toggleHint = (hintIndex: number) => {
    setState((prev) => ({
      ...prev,
      hintsRevealed: {
        ...prev.hintsRevealed,
        [`${currentScenario}-${hintIndex}`]: true,
      },
    }));
  };

  // Warm-up Phase
  const WarmupPhase = () => (
    <div className={styles.phaseContainer}>
      <h2 className={styles.phaseTitle}>🎯 The Classification Challenge</h2>
      <p className={styles.phaseIntro}>
        Can you classify these common laser products? Test your intuition before diving into the system.
      </p>
      
      <div className={styles.warmupCards}>
        {[
          { name: 'CD Player', power: '0.5 mW', answer: 'Class 1', reason: 'Fully enclosed, no user access to beam' },
          { name: 'Presentation Pointer', power: '5 mW', answer: 'Class 3R', reason: 'Exceeds 1 mW limit for Class 2' },
          { name: 'Industrial Cutter', power: '2000 W', answer: 'Class 4', reason: 'Far exceeds 500 mW limit' },
        ].map((item, index) => (
          <motion.div
            key={index}
            className={styles.warmupCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <h4>{item.name}</h4>
            <p className={styles.powerSpec}>{item.power}</p>
            <div className={styles.revealSection}>
              <details>
                <summary>Reveal Answer</summary>
                <p className={styles.answerText}>{item.answer}</p>
                <p className={styles.reasonText}>{item.reason}</p>
              </details>
            </div>
          </motion.div>
        ))}
      </div>

      <div className={styles.phaseNavigation}>
        <button className={styles.continueButton} onClick={handlePhaseComplete}>
          Learn the System →
        </button>
      </div>
    </div>
  );

  // Core Concept Phase
  const CorePhase = () => (
    <div className={styles.phaseContainer}>
      <h2 className={styles.phaseTitle}>Understanding Laser Classes</h2>
      <p className={styles.phaseDescription}>
        The IEC 60825-1 and FDA classification system divides lasers into 7 classes based on accessible emission limits (AEL).
      </p>

      <ClassificationPyramid />

      <div className={styles.divider} />

      <AELExplorer />

      <div className={styles.divider} />

      <ControlMeasuresMatrix />

      <div className={styles.phaseNavigation}>
        <button className={styles.continueButton} onClick={handlePhaseComplete}>
          Practice Classification →
        </button>
      </div>
    </div>
  );

  // Practice Phase
  const PracticePhase = () => (
    <div className={styles.phaseContainer}>
      <h2 className={styles.phaseTitle}>Classification Practice</h2>
      
      <ClassificationSorting />

      <div className={styles.phaseNavigation}>
        <button className={styles.continueButton} onClick={handlePhaseComplete}>
          Continue to Challenge →
        </button>
      </div>
    </div>
  );

  // Challenge Phase
  const ChallengePhase = () => {
    const scenario = classificationScenarios[currentScenario];
    const revealedHints = Object.keys(state.hintsRevealed).filter(k => k.startsWith(`${currentScenario}-`)).length;

    return (
      <div className={styles.phaseContainer}>
        <h2 className={styles.phaseTitle}>🧩 Expert Classification Challenge</h2>
        <p className={styles.phaseDescription}>
          Apply your knowledge to classify real-world laser products. Use hints if you need help!
        </p>

        <div className={styles.scenarioCard}>
          <div className={styles.scenarioProgress}>
            Scenario {currentScenario + 1} of {classificationScenarios.length}
          </div>

          <h3>{scenario.laserName}</h3>
          <p className={styles.scenarioDescription}>{scenario.intendedUse}</p>

          <div className={styles.specsPanel}>
            <h4>Specifications:</h4>
            <ul>
              <li><strong>Wavelength:</strong> {scenario.wavelength}</li>
              <li><strong>Power:</strong> {scenario.power}</li>
              {scenario.divergence && (
                <li><strong>Divergence:</strong> {scenario.divergence}</li>
              )}
              {scenario.pulseInfo && (
                <li><strong>Pulse:</strong> {scenario.pulseInfo}</li>
              )}
            </ul>
          </div>

          {/* Hints */}
          <div className={styles.hintsSection}>
            <h4>Hints Available:</h4>
            {scenario.hints.map((hint, index) => (
              <div key={index} className={styles.hintRow}>
                {!state.hintsRevealed[`${currentScenario}-${index}`] ? (
                  <button
                    className={styles.revealHintButton}
                    onClick={() => toggleHint(index)}
                  >
                    🌟 Reveal Hint {index + 1}
                  </button>
                ) : (
                  <p className={styles.revealedHint}>{hint}</p>
                )}
              </div>
            ))}
          </div>

          {/* Answer options */}
          <div className={styles.scenarioAnswers}>
            <h4>What is the correct classification?</h4>
            <div className={styles.answerGrid}>
              {['Class 1', 'Class 1M', 'Class 2', 'Class 2M', 'Class 3R', 'Class 3B', 'Class 4'].map((cls) => (
                <button
                  key={cls}
                  className={`${styles.scenarioAnswerButton} ${
                    state.scenarioAnswer === cls ? styles.selectedAnswer : ''
                  } ${
                    showFeedback && cls === scenario.correctClass ? styles.correctAnswer : ''
                  }`}
                  onClick={() => !showFeedback && setState((prev) => ({ ...prev, scenarioAnswer: cls }))}
                  disabled={showFeedback}
                >
                  {cls}
                </button>
              ))}
            </div>
          </div>

          {!showFeedback ? (
            <button
              className={styles.submitButton}
              onClick={() => setShowFeedback(true)}
              disabled={!state.scenarioAnswer}
            >
              Submit Answer
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${styles.scenarioFeedback} ${
                state.scenarioAnswer === scenario.correctClass ? styles.correctFeedback : styles.incorrectFeedback
              }`}
            >
              {state.scenarioAnswer === scenario.correctClass ? (
                <>
                  <h4>✓ Correct!</h4>
                  <p>{scenario.explanation}</p>
                </>
              ) : (
                <>
                  <h4>✗ Not quite</h4>
                  <p>The correct classification is <strong>{scenario.correctClass}</strong>.</p>
                  <p>{scenario.explanation}</p>
                </>
              )}
              
              {currentScenario < classificationScenarios.length - 1 ? (
                <button
                  className={styles.nextScenarioButton}
                  onClick={() => {
                    setCurrentScenario((prev) => prev + 1);
                    setShowFeedback(false);
                    setState((prev) => ({ ...prev, scenarioAnswer: null }));
                  }}
                >
                  Next Scenario →
                </button>
              ) : (
                <button className={styles.completeButton} onClick={handlePhaseComplete}>
                  Complete Module 🎉
                </button>
              )}
            </motion.div>
          )}
        </div>
      </div>
    );
  };

  // Complete Phase
  const CompletePhase = () => (
    <div className={styles.phaseContainer}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={styles.completionCard}
      >
        <div className={styles.completionIcon}>🏆</div>
        <h2 className={styles.completionTitle}>Module Complete!</h2>
        <p className={styles.completionMessage}>
          Excellent work! You now understand the laser classification system.
        </p>

        <div className={styles.knowledgeCheck}>
          <h4>You can now:</h4>
          <ul>
            {moduleInfo.learningObjectives.map((objective, index) => (
              <li key={index}>✓ {objective}</li>
            ))}
          </ul>
        </div>

        <div className={styles.keyTakeaways}>
          <h4>Key Takeaways:</h4>
          <ul>
            <li>Class 1 = inherently safe; Class 4 = all hazards present</li>
            <li>M classes require consideration of collecting optics</li>
            <li>Class 2 relies on blink reflex (visible only)</li>
            <li>Control requirements increase with hazard class</li>
            <li>LSO required for Class 3B and Class 4</li>
          </ul>
        </div>

        <div className={styles.completionActions}>
          <button 
            className={styles.secondaryButton}
            onClick={() => setState((prev) => ({ 
              ...prev, 
              currentPhase: 'warmup',
              quizScore: 0,
              currentQuizIndex: 0,
              scenarioAnswer: null
            }))}
          >
            Review Module
          </button>
          <button className={styles.primaryButton}>
            Next Module →
          </button>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className={styles.moduleContainer}>
      {/* Module Header */}
      <header className={styles.moduleHeader}>
        <div className={styles.breadcrumb}>
          {moduleInfo.courseName} / {moduleInfo.title}
        </div>
        <h1 className={styles.moduleTitle}>{moduleInfo.title}</h1>
        <p className={styles.moduleDescription}>{moduleInfo.description}</p>
        
        {/* Phase Progress */}
        <div className={styles.phaseProgress}>
          {phases.map((phase, index) => {
            const phaseOrder: PhaseType[] = ['warmup', 'core', 'practice', 'challenge'];
            const currentIndex = phaseOrder.indexOf(state.currentPhase);
            const isActive = phase.type === state.currentPhase;
            const isCompleted = currentIndex > index;
            
            return (
              <div
                key={phase.id}
                className={`${styles.phaseIndicator} ${
                  isActive ? styles.activePhase : ''
                } ${isCompleted ? styles.completedPhase : ''}`}
              >
                <div className={styles.phaseDot}>
                  {isCompleted ? '✓' : index + 1}
                </div>
                <span className={styles.phaseLabel}>{phase.title}</span>
                <span className={styles.phaseDuration}>{phase.duration} min</span>
              </div>
            );
          })}
        </div>
      </header>

      {/* Phase Content */}
      <main className={styles.moduleContent}>
        <AnimatePresence mode="wait">
          <motion.div
            key={state.currentPhase}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {state.currentPhase === 'warmup' && <WarmupPhase />}
            {state.currentPhase === 'core' && <CorePhase />}
            {state.currentPhase === 'practice' && <PracticePhase />}
            {state.currentPhase === 'challenge' && <ChallengePhase />}
            {state.currentPhase === 'complete' && <CompletePhase />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default ClassificationModule;
