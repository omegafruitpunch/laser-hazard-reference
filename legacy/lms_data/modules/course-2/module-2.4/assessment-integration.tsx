/**
 * Assessment Integration for Module 2.4: Reporting Requirements
 * 
 * This file provides assessment hooks and components for tracking learner progress
 * and quiz integration for Module 2.4.
 */

import { useState, useCallback } from 'react';

// ============================================================================
// TYPES
// ============================================================================

interface AssessmentState {
  currentQuestion: number;
  answers: Record<string, string | number | number[]>;
  score: number;
  completed: boolean;
  timeSpent: number;
}

interface QuizQuestion {
  id: string;
  type: 'multiple_choice' | 'multiple_select' | 'true_false' | 'fill_in_blank' | 'scenario';
  question: string;
  options?: string[];
  correctAnswer?: number;
  correctAnswers?: number[];
  acceptableVariants?: string[];
  explanation: string;
  cfrReference: string;
}

// ============================================================================
// QUIZ QUESTIONS FOR MODULE 2.4
// ============================================================================

export const MODULE_24_QUIZ: QuizQuestion[] = [
  {
    id: 'c2m4_q1',
    type: 'multiple_choice',
    question: 'When must a Product Report be submitted to CDRH?',
    options: [
      'Within 30 days after introduction into commerce',
      'Within 60 days of manufacturing',
      'Prior to introduction of products into commerce',
      'Annually by September 1'
    ],
    correctAnswer: 2,
    explanation: 'Product Reports must be submitted prior to introduction of the reported products into commerce, including imported products.',
    cfrReference: '21 CFR 1002.10'
  },
  {
    id: 'c2m4_q2',
    type: 'multiple_choice',
    question: 'What type of report is used to report a new model in a previously reported model family?',
    options: [
      'Initial Product Report',
      'Supplemental Report',
      'Annual Report',
      'Abbreviated Report'
    ],
    correctAnswer: 1,
    explanation: 'Supplemental Reports are used to report new models in previously reported model families, modifications, or other changes to previous reports.',
    cfrReference: '21 CFR 1002.11'
  },
  {
    id: 'c2m4_q3',
    type: 'multiple_select',
    question: 'Which of the following changes require a Supplemental Report? (Select all that apply)',
    options: [
      'Changes affecting actual or potential emission',
      'Changes decreasing degree of compliance with the performance standard',
      'Changes resulting in decreased probability of detecting product noncompliance',
      'Changes to the product color only'
    ],
    correctAnswers: [0, 1, 2],
    explanation: 'Supplemental Reports are required for changes affecting emissions, compliance, or detection probability. Cosmetic changes like color alone do not require supplemental reports.',
    cfrReference: '21 CFR 1002.11'
  },
  {
    id: 'c2m4_q4',
    type: 'multiple_choice',
    question: 'When are Annual Reports due?',
    options: [
      'January 1 for the previous calendar year',
      'March 31 for the fiscal year',
      'September 1 for the 12 months ending June 30',
      'December 31 for the current calendar year'
    ],
    correctAnswer: 2,
    explanation: 'Annual Reports must be submitted by September 1 for the 12 months ending on June 30 of the same year.',
    cfrReference: '21 CFR 1002.13'
  },
  {
    id: 'c2m4_q5',
    type: 'fill_in_blank',
    question: 'What is the OMB control number for FORM FDA 3632?',
    acceptableVariants: ['0910-0025', '0910 0025'],
    explanation: 'FORM FDA 3632 has OMB control number 0910-0025 with expiration date February 28, 2026.',
    cfrReference: 'FORM FDA 3632 header'
  },
  {
    id: 'c2m4_q6',
    type: 'true_false',
    question: 'CDRH approves Product Reports and the products being reported.',
    correctAnswer: 1, // false
    explanation: 'CDRH does NOT approve Product Reports or the products being reported. It is the manufacturer\'s responsibility to certify compliance.',
    cfrReference: 'FORM FDA 3632 Foreword'
  },
  {
    id: 'c2m4_q7',
    type: 'multiple_choice',
    question: 'Which label is required on ALL laser products regardless of class?',
    options: [
      'Warning logotype',
      'Certification label',
      'Aperture label',
      'Class IV designation label'
    ],
    correctAnswer: 1,
    explanation: 'The Certification label (per 21 CFR 1010.2) and Identification label (per 21 CFR 1010.3) are required on ALL laser products.',
    cfrReference: '21 CFR 1010.2, 1010.3'
  },
  {
    id: 'c2m4_q8',
    type: 'multiple_choice',
    question: 'What is an "accession number" in the context of FDA laser product reports?',
    options: [
      'A manufacturing serial number',
      'A unique identifier assigned by CDRH upon receipt of a report',
      'The OMB control number',
      'A model family designation'
    ],
    correctAnswer: 1,
    explanation: 'When a report is received at CDRH, a unique accession number is assigned for future reference.',
    cfrReference: 'FORM FDA 3632 General Instructions'
  },
  {
    id: 'c2m4_q9',
    type: 'fill_in_blank',
    question: 'What is the contact phone number for questions about FDA laser product reporting?',
    acceptableVariants: ['1-800-638-2041', '800-638-2041'],
    explanation: 'The Division of Small Manufacturer\'s Assistance (DSMA) can be contacted at 1-800-638-2041 for reporting questions.',
    cfrReference: 'FORM FDA 3632 submission information'
  },
  {
    id: 'c2m4_q10',
    type: 'scenario',
    question: 'Scenario: A manufacturer modifies a Class IV laser to improve its beam attenuator. The modification reduces the probability of detecting noncompliance. What action is required?',
    options: [
      'No action needed - it\'s a safety improvement',
      'Include the change in next Annual Report only',
      'Submit a Supplemental Report prior to introduction into commerce',
      'Submit a new Product Report'
    ],
    correctAnswer: 2,
    explanation: 'Changes that result in decreased probability of detecting product noncompliance require a Supplemental Report.',
    cfrReference: '21 CFR 1002.11'
  }
];

// ============================================================================
// HOOK: USE ASSESSMENT
// ============================================================================

export const useAssessment = (moduleId: string) => {
  const [state, setState] = useState<AssessmentState>({
    currentQuestion: 0,
    answers: {},
    score: 0,
    completed: false,
    timeSpent: 0
  });

  const recordAnswer = useCallback((questionId: string, answer: string | number | number[]) => {
    setState(prev => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: answer }
    }));
  }, []);

  const nextQuestion = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentQuestion: Math.min(prev.currentQuestion + 1, MODULE_24_QUIZ.length - 1)
    }));
  }, []);

  const previousQuestion = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentQuestion: Math.max(prev.currentQuestion - 1, 0)
    }));
  }, []);

  const submitQuiz = useCallback(() => {
    let score = 0;
    MODULE_24_QUIZ.forEach(question => {
      const answer = state.answers[question.id];
      if (question.type === 'multiple_choice' || question.type === 'scenario') {
        if (answer === question.correctAnswer) score++;
      } else if (question.type === 'multiple_select') {
        if (JSON.stringify(answer) === JSON.stringify(question.correctAnswers)) score++;
      } else if (question.type === 'true_false') {
        if (answer === question.correctAnswer) score++;
      } else if (question.type === 'fill_in_blank') {
        const normalizedAnswer = String(answer).toLowerCase().trim();
        const isCorrect = question.acceptableVariants?.some(
          v => v.toLowerCase().trim() === normalizedAnswer
        );
        if (isCorrect) score++;
      }
    });

    setState(prev => ({
      ...prev,
      score,
      completed: true
    }));

    return { score, total: MODULE_24_QUIZ.length, passed: score >= 8 };
  }, [state.answers]);

  const resetQuiz = useCallback(() => {
    setState({
      currentQuestion: 0,
      answers: {},
      score: 0,
      completed: false,
      timeSpent: 0
    });
  }, []);

  return {
    ...state,
    totalQuestions: MODULE_24_QUIZ.length,
    currentQuestionData: MODULE_24_QUIZ[state.currentQuestion],
    recordAnswer,
    nextQuestion,
    previousQuestion,
    submitQuiz,
    resetQuiz,
    progress: ((state.currentQuestion + 1) / MODULE_24_QUIZ.length) * 100
  };
};

// ============================================================================
// COMPONENT: QUIZ WRAPPER
// ============================================================================

import React from 'react';

interface QuizWrapperProps {
  onComplete?: (result: { score: number; passed: boolean }) => void;
}

export const Module24Quiz: React.FC<QuizWrapperProps> = ({ onComplete }) => {
  const {
    currentQuestion,
    totalQuestions,
    currentQuestionData,
    answers,
    completed,
    score,
    recordAnswer,
    nextQuestion,
    previousQuestion,
    submitQuiz,
    resetQuiz,
    progress
  } = useAssessment('course-2-module-2.4');

  const handleSubmit = () => {
    const result = submitQuiz();
    onComplete?.(result);
  };

  if (completed) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <h2>Quiz Complete!</h2>
        <p style={{ fontSize: '24px', margin: '20px 0' }}>
          Score: {score} / {totalQuestions}
        </p>
        <p style={{ 
          color: score >= 8 ? '#10b981' : '#ef4444',
          fontWeight: 600
        }}>
          {score >= 8 ? '✓ Passed' : '✗ Did not pass (need 8/10)'}
        </p>
        <button 
          onClick={resetQuiz}
          style={{
            marginTop: '20px',
            padding: '12px 24px',
            background: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Retake Quiz
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span>Question {currentQuestion + 1} of {totalQuestions}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div style={{ height: '8px', background: '#e5e7eb', borderRadius: '4px' }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            background: '#3b82f6',
            borderRadius: '4px',
            transition: 'width 0.3s'
          }} />
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h3>{currentQuestionData.question}</h3>
        {currentQuestionData.cfrReference && (
          <span style={{ fontSize: '12px', color: '#6b7280' }}>
            Reference: {currentQuestionData.cfrReference}
          </span>
        )}
      </div>

      {currentQuestionData.options && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {currentQuestionData.options.map((option, index) => (
            <button
              key={index}
              onClick={() => recordAnswer(currentQuestionData.id, index)}
              style={{
                padding: '12px 16px',
                textAlign: 'left',
                background: answers[currentQuestionData.id] === index ? '#eff6ff' : '#f9fafb',
                border: `2px solid ${answers[currentQuestionData.id] === index ? '#3b82f6' : '#e5e7eb'}`,
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
        <button
          onClick={previousQuestion}
          disabled={currentQuestion === 0}
          style={{
            padding: '10px 20px',
            background: 'transparent',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer',
            opacity: currentQuestion === 0 ? 0.5 : 1
          }}
        >
          Previous
        </button>

        {currentQuestion === totalQuestions - 1 ? (
          <button
            onClick={handleSubmit}
            style={{
              padding: '10px 24px',
              background: '#10b981',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Submit
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            style={{
              padding: '10px 24px',
              background: '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default Module24Quiz;
