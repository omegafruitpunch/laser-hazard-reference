/**
 * CertificationExamSimulator Component
 * 
 * Full-featured certification exam simulator for CLSO/CMLSO preparation.
 * Includes timed exam, question review, and detailed score analysis.
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ExamQuestion, ExamAnswer, ExamAttempt, ExamResult } from '../types';
import { practiceQuestions, certificationExams } from '../data';

interface CertificationExamSimulatorProps {
  onComplete?: (attempt: ExamAttempt) => void;
}

export const CertificationExamSimulator: React.FC<CertificationExamSimulatorProps> = ({
  onComplete
}) => {
  const [examMode, setExamMode] = useState<'select' | 'in-progress' | 'review'>('select');
  const [selectedExam, setSelectedExam] = useState<string>('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<ExamAnswer[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [markedQuestions, setMarkedQuestions] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);

  const exam = useMemo(() => 
    certificationExams.find(e => e.id === selectedExam),
    [selectedExam]
  );

  const questions = useMemo(() => {
    // Shuffle questions for variety
    const shuffled = [...practiceQuestions].sort(() => Math.random() - 0.5);
    return exam ? shuffled.slice(0, Math.min(exam.questionCount, shuffled.length)) : [];
  }, [exam]);

  const currentQ = questions[currentQuestion];

  // Timer effect
  useEffect(() => {
    if (examMode !== 'in-progress' || isPaused) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          completeExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examMode, isPaused]);

  const startExam = (examId: string) => {
    const selected = certificationExams.find(e => e.id === examId);
    if (!selected) return;

    setSelectedExam(examId);
    setExamMode('in-progress');
    setCurrentQuestion(0);
    setAnswers(questions.map(q => ({
      questionId: q.id,
      answer: -1,
      correct: false,
      timeSpent: 0
    })));
    setTimeRemaining(selected.duration * 60);
    setStartTime(Date.now());
    setMarkedQuestions([]);
    setShowResults(false);
  };

  const answerQuestion = (answerIndex: number) => {
    const questionStartTime = answers[currentQuestion]?.timeSpent || 0;
    
    setAnswers(prev => {
      const next = [...prev];
      const q = questions[currentQuestion];
      const isCorrect = Array.isArray(q.correctAnswer) 
        ? Array.isArray(answerIndex) 
          ? JSON.stringify([...answerIndex].sort()) === JSON.stringify([...q.correctAnswer].sort())
          : false
        : answerIndex === q.correctAnswer;
      
      next[currentQuestion] = {
        questionId: q.id,
        answer: answerIndex,
        correct: isCorrect,
        timeSpent: questionStartTime + Math.floor((Date.now() - startTime) / 1000)
      };
      return next;
    });
  };

  const markQuestion = () => {
    setMarkedQuestions(prev => 
      prev.includes(currentQuestion)
        ? prev.filter(i => i !== currentQuestion)
        : [...prev, currentQuestion]
    );
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestion(index);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const completeExam = () => {
    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
    const earnedPoints = answers.reduce((sum, a, idx) => {
      return sum + (a.correct ? questions[idx].points : 0);
    }, 0);

    const score = Math.round((earnedPoints / totalPoints) * 100);
    const passed = score >= (exam?.passingScore || 70);

    const attempt: ExamAttempt = {
      examId: selectedExam,
      startTime: new Date(startTime),
      endTime: new Date(),
      answers,
      score,
      passed,
      timeSpent: (exam?.duration || 0) * 60 - timeRemaining
    };

    setExamMode('review');
    setShowResults(true);
    onComplete?.(attempt);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getAnsweredCount = () => answers.filter(a => a.answer !== -1).length;

  // Exam Selection Screen
  if (examMode === 'select') {
    return (
      <div className="exam-selector">
        <h2>Certification Exam Simulator</h2>
        <p className="intro">
          Practice with exam-style questions similar to those on the actual 
          CLSO (Certified Laser Safety Officer) and CMLSO (Certified Medical 
          Laser Safety Officer) certification exams.
        </p>

        <div className="exam-options">
          {certificationExams.map(ex => (
            <div key={ex.id} className="exam-card">
              <h3>{ex.name}</h3>
              <p>{ex.description}</p>
              <div className="exam-details">
                <span>Duration: {ex.duration} minutes</span>
                <span>Questions: {ex.questionCount}</span>
                <span>Passing: {ex.passingScore}%</span>
              </div>
              <button 
                className="btn-start"
                onClick={() => startExam(ex.id)}
              >
                Start Practice Exam
              </button>
            </div>
          ))}
          
          <div className="exam-card quick-practice">
            <h3>Quick Practice</h3>
            <p>10-question mini exam for quick review</p>
            <div className="exam-details">
              <span>Duration: 15 minutes</span>
              <span>Questions: 10</span>
              <span>Passing: 70%</span>
            </div>
            <button 
              className="btn-start"
              onClick={() => startExam('quick')}
            >
              Start Quick Practice
            </button>
          </div>
        </div>

        <div className="exam-tips">
          <h4>Exam Tips</h4>
          <ul>
            <li>Read each question carefully before answering</li>
            <li>Eliminate obviously wrong answers first</li>
            <li>Mark questions you're unsure about for review</li>
            <li>Manage your time - don't spend too long on one question</li>
            <li>Review all answers before submitting if time permits</li>
          </ul>
        </div>
      </div>
    );
  }

  // Results Screen
  if (showResults && exam) {
    const correctCount = answers.filter(a => a.correct).length;
    const incorrectCount = answers.filter(a => !a.correct && a.answer !== -1).length;
    const unansweredCount = answers.filter(a => a.answer === -1).length;

    return (
      <div className="exam-results">
        <h2>Exam Results</h2>
        
        <div className={`result-summary ${answers[0]?.correct !== undefined ? 'complete' : 'incomplete'}`}>
          <div className="score-circle">
            <span className="score">{Math.round((answers.filter(a => a.correct).length / questions.length) * 100)}%</span>
            <span className="label">
              {answers.find(a => a.answer === -1) ? 'Incomplete' : 
               (answers.filter(a => a.correct).length / questions.length) >= (exam.passingScore / 100) ? 'PASSED' : 'FAILED'}
            </span>
          </div>
          
          <div className="stats">
            <div className="stat">
              <span className="value correct">{correctCount}</span>
              <span className="label">Correct</span>
            </div>
            <div className="stat">
              <span className="value incorrect">{incorrectCount}</span>
              <span className="label">Incorrect</span>
            </div>
            <div className="stat">
              <span className="value">{unansweredCount}</span>
              <span className="label">Unanswered</span>
            </div>
          </div>
        </div>

        <div className="category-breakdown">
          <h3>Performance by Category</h3>
          {Array.from(new Set(questions.map(q => q.category))).map(cat => {
            const catQuestions = questions.filter(q => q.category === cat);
            const catCorrect = catQuestions.filter((q, idx) => {
              const answerIdx = questions.findIndex(q2 => q2.id === q.id);
              return answers[answerIdx]?.correct;
            }).length;
            const pct = Math.round((catCorrect / catQuestions.length) * 100);
            
            return (
              <div key={cat} className="category-bar">
                <span className="category-name">{cat}</span>
                <div className="bar-container">
                  <div 
                    className="bar" 
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="percentage">{pct}%</span>
              </div>
            );
          })}
        </div>

        <div className="question-review">
          <h3>Question Review</h3>
          {questions.map((q, idx) => {
            const answer = answers[idx];
            return (
              <div 
                key={q.id} 
                className={`review-item ${answer.correct ? 'correct' : 'incorrect'}`}
              >
                <div className="question-header">
                  <span className="question-num">Q{idx + 1}</span>
                  <span className="category">{q.category}</span>
                  <span className={`status ${answer.correct ? 'correct' : 'incorrect'}`}>
                    {answer.correct ? 'Correct' : 'Incorrect'}
                  </span>
                </div>
                <p className="question-text">{q.question}</p>
                <div className="answer-review">
                  <p>
                    <strong>Your Answer:</strong> {
                      answer.answer === -1 ? 'Not answered' :
                      Array.isArray(answer.answer) 
                        ? answer.answer.map(i => q.options?.[i]).join(', ')
                        : q.options?.[answer.answer as number]
                    }
                  </p>
                  <p>
                    <strong>Correct Answer:</strong> {
                      Array.isArray(q.correctAnswer)
                        ? q.correctAnswer.map(i => q.options?.[i]).join(', ')
                        : q.options?.[q.correctAnswer]
                    }
                  </p>
                  <div className="explanation">
                    <strong>Explanation:</strong> {q.explanation}
                  </div>
                  <div className="reference">
                    <strong>Reference:</strong> {q.reference}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="action-buttons">
          <button className="btn-restart" onClick={() => setExamMode('select')}>
            Take Another Exam
          </button>
        </div>
      </div>
    );
  }

  // In-Progress Exam
  if (!currentQ) return null;

  const currentAnswer = answers[currentQuestion];

  return (
    <div className="exam-in-progress">
      <div className="exam-header">
        <div className="timer">
          Time Remaining: {formatTime(timeRemaining)}
        </div>
        <div className="progress">
          Question {currentQuestion + 1} of {questions.length}
        </div>
        <button 
          className="btn-pause"
          onClick={() => setIsPaused(!isPaused)}
        >
          {isPaused ? 'Resume' : 'Pause'}
        </button>
      </div>

      {isPaused ? (
        <div className="pause-screen">
          <h3>Exam Paused</h3>
          <p>The timer is paused. Click Resume to continue.</p>
          <button onClick={() => setIsPaused(false)}>Resume</button>
        </div>
      ) : (
        <>
          <div className="question-container">
            <div className="question-header">
              <span className="category">{currentQ.category}</span>
              <span className={`difficulty ${currentQ.difficulty}`}>
                {currentQ.difficulty}
              </span>
              <button 
                className={`btn-mark ${markedQuestions.includes(currentQuestion) ? 'marked' : ''}`}
                onClick={markQuestion}
              >
                {markedQuestions.includes(currentQuestion) ? 'Unmark' : 'Mark for Review'}
              </button>
            </div>

            <h3 className="question-text">{currentQ.question}</h3>

            {currentQ.options && (
              <div className="options">
                {currentQ.type === 'multiple_select' ? (
                  // Multiple select (checkboxes)
                  currentQ.options.map((opt, idx) => (
                    <label key={idx} className="option checkbox">
                      <input
                        type="checkbox"
                        checked={Array.isArray(currentAnswer?.answer) 
                          ? currentAnswer.answer.includes(idx)
                          : false}
                        onChange={(e) => {
                          const currentArr = Array.isArray(currentAnswer?.answer)
                            ? currentAnswer.answer as number[]
                            : [];
                          const newArr = e.target.checked
                            ? [...currentArr, idx]
                            : currentArr.filter(i => i !== idx);
                          answerQuestion(newArr);
                        }}
                      />
                      <span>{opt}</span>
                    </label>
                  ))
                ) : (
                  // Single select (radio buttons)
                  currentQ.options.map((opt, idx) => (
                    <label 
                      key={idx} 
                      className={`option radio ${currentAnswer?.answer === idx ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQ.id}`}
                        checked={currentAnswer?.answer === idx}
                        onChange={() => answerQuestion(idx)}
                      />
                      <span>{String.fromCharCode(65 + idx)}. {opt}</span>
                    </label>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="navigation">
            <button 
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
            >
              Previous
            </button>
            
            <div className="question-nav">
              {questions.map((_, idx) => (
                <button
                  key={idx}
                  className={`nav-dot ${
                    idx === currentQuestion ? 'current' :
                    answers[idx]?.answer !== -1 ? 'answered' :
                    markedQuestions.includes(idx) ? 'marked' : ''
                  }`}
                  onClick={() => goToQuestion(idx)}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            {currentQuestion === questions.length - 1 ? (
              <button 
                className="btn-submit"
                onClick={completeExam}
              >
                Submit Exam
              </button>
            ) : (
              <button onClick={nextQuestion}>
                Next
              </button>
            )}
          </div>

          <div className="exam-footer">
            <span>Answered: {getAnsweredCount()} of {questions.length}</span>
            <span>Marked: {markedQuestions.length}</span>
          </div>
        </>
      )}
    </div>
  );
};
