import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './styles.module.css';
import { moduleInfo, phases, quizQuestions, scenarioChallenge } from './data';
import WavelengthExplorer from './components/WavelengthExplorer';
import LaserPropertyComparison from './components/LaserPropertyComparison';
import ReflectionHazardDemo from './components/ReflectionHazardDemo';

type PhaseType = 'warmup' | 'core' | 'practice' | 'challenge' | 'complete';

interface ModuleState {
  currentPhase: PhaseType;
  quizScore: number;
  quizAttempts: Record<string, number>;
  currentQuizIndex: number;
  scenarioAnswers: Record<string, string[]>;
  hintsUsed: number;
}

const LaserHazardsModule: React.FC = () => {
  const [state, setState] = useState<ModuleState>({
    currentPhase: 'warmup',
    quizScore: 0,
    quizAttempts: {},
    currentQuizIndex: 0,
    scenarioAnswers: {},
    hintsUsed: 0,
  });

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showHint, setShowHint] = useState(false);

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
      setShowHint(false);
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
        quizAttempts: {
          ...prev.quizAttempts,
          [currentQuestion.id]: (prev.quizAttempts[currentQuestion.id] || 0) + 1,
        },
      }));
    } else {
      setState((prev) => ({
        ...prev,
        quizAttempts: {
          ...prev.quizAttempts,
          [currentQuestion.id]: (prev.quizAttempts[currentQuestion.id] || 0) + 1,
        },
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
      setShowHint(false);
    } else {
      handlePhaseComplete();
    }
  };

  // Warm-up Phase
  const WarmupPhase = () => (
    <div className={styles.phaseContainer}>
      <div className={styles.warmupContent}>
        <h2 className={styles.phaseTitle}>⚡ The Laser Light Challenge</h2>
        <p className={styles.phaseIntro}>
          Before we dive into laser safety, let's test your intuition about what makes laser light different.
        </p>
        
        <div className={styles.warmupQuestion}>
          <h3>Which scenario presents the greater eye hazard?</h3>
          
          <div className={styles.scenarioCards}>
            <motion.div
              className={styles.scenarioCard}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedAnswer(0);
                setShowFeedback(true);
              }}
            >
              <div className={styles.scenarioIcon}>💡</div>
              <h4>Scenario A</h4>
              <p>Staring directly at a 100-watt light bulb from 1 meter away for 10 seconds</p>
            </motion.div>

            <motion.div
              className={styles.scenarioCard}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedAnswer(1);
                setShowFeedback(true);
              }}
            >
              <div className={styles.scenarioIcon}>🔴</div>
              <h4>Scenario B</h4>
              <p>A brief glimpse (0.1 seconds) of a 1-watt laser beam from across the room</p>
            </motion.div>
          </div>

          <AnimatePresence>
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={styles.warmupFeedback}
              >
                {selectedAnswer === 0 ? (
                  <div className={styles.incorrectFeedback}>
                    <p>Surprisingly, the light bulb is LESS hazardous to your eyes!</p>
                    <p>While 100W seems more powerful than 1W, the light bulb spreads its energy in all directions. Your eye's lens focuses laser light to an intense point on your retina, making even brief exposure dangerous.</p>
                  </div>
                ) : (
                  <div className={styles.correctFeedback}>
                    <p>✓ Correct! The laser presents the greater hazard.</p>
                    <p>Your eye's lens focuses laser light onto your retina, concentrating the power by 10,000 times or more. Even a 0.1-second exposure can cause permanent damage.</p>
                  </div>
                )}
                <button className={styles.continueButton} onClick={handlePhaseComplete}>
                  Continue to Learn Why →
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );

  // Core Concept Phase
  const CorePhase = () => (
    <div className={styles.phaseContainer}>
      <h2 className={styles.phaseTitle}>Understanding Laser Properties</h2>
      <p className={styles.phaseDescription}>
        Laser light differs from conventional light in three fundamental ways that create its unique hazards.
      </p>

      <LaserPropertyComparison />

      <div className={styles.divider} />

      <WavelengthExplorer />

      <div className={styles.phaseNavigation}>
        <button className={styles.continueButton} onClick={handlePhaseComplete}>
          Continue to Practice →
        </button>
      </div>
    </div>
  );

  // Practice Phase
  const PracticePhase = () => {
    const currentQuestion = quizQuestions[state.currentQuizIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const attempts = state.quizAttempts[currentQuestion.id] || 0;

    return (
      <div className={styles.phaseContainer}>
        <div className={styles.quizHeader}>
          <span className={styles.quizProgress}>
            Question {state.currentQuizIndex + 1} of {quizQuestions.length}
          </span>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${((state.currentQuizIndex + 1) / quizQuestions.length) * 100}%` }}
            />
          </div>
        </div>

        <h2 className={styles.phaseTitle}>Knowledge Check</h2>

        <div className={styles.quizContainer}>
          <h3 className={styles.quizQuestion}>{currentQuestion.question}</h3>

          {currentQuestion.hint && (
            <button
              className={styles.hintButton}
              onClick={() => {
                setShowHint(true);
                setState((prev) => ({ ...prev, hintsUsed: prev.hintsUsed + 1 }));
              }}
              disabled={showHint}
            >
              {showHint ? '🌟 Hint revealed' : '🌟 Need a hint?'}
            </button>
          )}

          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={styles.hintBox}
              >
                {currentQuestion.hint}
              </motion.div>
            )}
          </AnimatePresence>

          <div className={styles.answerOptions}>
            {currentQuestion.options.map((option, index) => (
              <motion.button
                key={index}
                className={`${styles.answerOption} ${
                  showFeedback
                    ? index === currentQuestion.correctAnswer
                      ? styles.correctAnswer
                      : index === selectedAnswer
                      ? styles.wrongAnswer
                      : styles.disabledOption
                    : ''
                }`}
                onClick={() => !showFeedback && handleQuizAnswer(index)}
                disabled={showFeedback}
                whileHover={!showFeedback ? { scale: 1.01 } : {}}
                whileTap={!showFeedback ? { scale: 0.99 } : {}}
              >
                <span className={styles.optionLetter}>{String.fromCharCode(65 + index)}</span>
                <span className={styles.optionText}>{option}</span>
                {showFeedback && index === currentQuestion.correctAnswer && (
                  <span className={styles.correctMark}>✓</span>
                )}
                {showFeedback && index === selectedAnswer && index !== currentQuestion.correctAnswer && (
                  <span className={styles.wrongMark}>✗</span>
                )}
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`${styles.feedbackBox} ${isCorrect ? styles.correctFeedbackBox : styles.incorrectFeedbackBox}`}
              >
                <h4>{isCorrect ? '✓ Correct!' : attempts >= 2 ? 'Here\'s the explanation:' : '✗ Not quite'}</h4>
                <p>{currentQuestion.explanation}</p>
                {!isCorrect && attempts < 2 && (
                  <p className={styles.retryHint}>Try again - you have another attempt!</p>
                )}
                {(isCorrect || attempts >= 2) && (
                  <button className={styles.continueButton} onClick={handleNextQuestion}>
                    {state.currentQuizIndex < quizQuestions.length - 1 ? 'Next Question →' : 'Continue to Challenge →'}
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  // Challenge Phase
  const ChallengePhase = () => (
    <div className={styles.phaseContainer}>
      <h2 className={styles.phaseTitle}>🎯 Real-World Challenge</h2>
      <p className={styles.phaseDescription}>
        Apply what you've learned to assess hazards in a realistic scenario.
      </p>

      <div className={styles.scenarioChallenge}>
        <div className={styles.scenarioHeader}>
          <h3>{scenarioChallenge.title}</h3>
          <p>{scenarioChallenge.description}</p>
        </div>

        <div className={styles.laserSpecs}>
          <h4>Laser Specifications:</h4>
          <ul>
            <li><strong>Wavelength:</strong> {scenarioChallenge.laserSpecs.wavelength}</li>
            <li><strong>Power:</strong> {scenarioChallenge.laserSpecs.power}</li>
            <li><strong>Classification:</strong> {scenarioChallenge.laserSpecs.classification}</li>
            <li><strong>Beam Diameter:</strong> {scenarioChallenge.laserSpecs.beamDiameter}</li>
            <li><strong>Divergence:</strong> {scenarioChallenge.laserSpecs.divergence}</li>
          </ul>
        </div>

        <ReflectionHazardDemo />

        <div className={styles.phaseNavigation}>
          <button className={styles.completeButton} onClick={handlePhaseComplete}>
            Complete Module 🎉
          </button>
        </div>
      </div>
    </div>
  );

  // Complete Phase
  const CompletePhase = () => (
    <div className={styles.phaseContainer}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={styles.completionCard}
      >
        <div className={styles.completionIcon}>🎓</div>
        <h2 className={styles.completionTitle}>Module Complete!</h2>
        <p className={styles.completionMessage}>
          Congratulations! You've mastered the fundamentals of laser hazards.
        </p>

        <div className={styles.scoreSummary}>
          <div className={styles.scoreItem}>
            <span className={styles.scoreLabel}>Quiz Score</span>
            <span className={styles.scoreValue}>
              {state.quizScore} / {quizQuestions.length}
            </span>
          </div>
          <div className={styles.scoreItem}>
            <span className={styles.scoreLabel}>Hints Used</span>
            <span className={styles.scoreValue}>{state.hintsUsed}</span>
          </div>
        </div>

        <div className={styles.learningOutcomes}>
          <h4>You can now:</h4>
          <ul>
            {moduleInfo.learningObjectives.map((objective, index) => (
              <li key={index}>✓ {objective}</li>
            ))}
          </ul>
        </div>

        <div className={styles.completionActions}>
          <button className={styles.secondaryButton} onClick={() => setState((prev) => ({ ...prev, currentPhase: 'warmup', quizScore: 0, currentQuizIndex: 0 }))}>
            Review Module
          </button>
          <button className={styles.primaryButton}>
            Next Module: Laser Classification →
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

export default LaserHazardsModule;
