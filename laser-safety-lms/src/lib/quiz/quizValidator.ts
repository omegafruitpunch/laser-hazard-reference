/**
 * Quiz Validator - Validates answers for all question types
 * Handles scoring logic with partial credit and tolerance
 */

import { 
  Question, 
  QuestionType,
  MultipleChoiceQuestion,
  MultiSelectQuestion,
  TrueFalseQuestion,
  MatchingQuestion,
  FillBlankQuestion,
  ScenarioQuestion,
  CalculationQuestion,
  UserAnswer
} from '@/types/quiz';

export interface ValidationResult {
  isCorrect: boolean;
  pointsEarned: number;
  maxPoints: number;
  correctAnswer: unknown;
  explanation: string;
  feedback: string;
  details?: {
    correctCount?: number;
    incorrectCount?: number;
    partialCredit?: number;
    userAnswer?: number;
    difference?: number;
    toleranceApplied?: number;
  };
}

/**
 * Validate a multiple choice answer
 */
function validateMultipleChoice(
  question: MultipleChoiceQuestion,
  answer: unknown
): ValidationResult {
  const selectedIndex = typeof answer === 'number' ? answer : -1;
  const isCorrect = selectedIndex === question.correctIndex;
  
  return {
    isCorrect,
    pointsEarned: isCorrect ? question.points : 0,
    maxPoints: question.points,
    correctAnswer: question.correctIndex,
    explanation: question.explanation,
    feedback: isCorrect 
      ? 'Correct! ' + question.explanation
      : `The correct answer was: ${question.options[question.correctIndex]}`,
  };
}

/**
 * Validate a multi-select answer
 */
function validateMultiSelect(
  question: MultiSelectQuestion,
  answer: unknown
): ValidationResult {
  const selectedIndices = Array.isArray(answer) ? answer as number[] : [];
  const correctIndices = question.correctIndices;
  
  // Count correct and incorrect selections
  const correctSelections = selectedIndices.filter(idx => correctIndices.includes(idx));
  const incorrectSelections = selectedIndices.filter(idx => !correctIndices.includes(idx));
  const missedCorrect = correctIndices.filter(idx => !selectedIndices.includes(idx));
  
  let isCorrect: boolean;
  let pointsEarned: number;
  
  if (question.requireAllCorrect) {
    // Must select all correct and no incorrect
    isCorrect = correctSelections.length === correctIndices.length && incorrectSelections.length === 0;
    
    if (isCorrect) {
      pointsEarned = question.points;
    } else {
      // Partial credit calculation
      const correctRatio = correctSelections.length / correctIndices.length;
      const penaltyRatio = incorrectSelections.length / question.options.length;
      const partialCredit = Math.max(0, correctRatio - penaltyRatio);
      pointsEarned = Math.round(question.points * partialCredit);
    }
  } else {
    // Any correct selection gets partial credit
    isCorrect = correctSelections.length > 0;
    const ratio = correctSelections.length / correctIndices.length;
    pointsEarned = Math.round(question.points * ratio);
  }
  
  // Build feedback
  let feedback: string;
  if (isCorrect && correctSelections.length === correctIndices.length) {
    feedback = 'Perfect! You selected all correct answers.';
  } else if (correctSelections.length > 0) {
    feedback = `You got ${correctSelections.length} of ${correctIndices.length} correct answers.`;
    if (missedCorrect.length > 0) {
      feedback += ` You missed: ${missedCorrect.map(i => question.options[i]).join(', ')}`;
    }
    if (incorrectSelections.length > 0) {
      feedback += ` Incorrect selections: ${incorrectSelections.map(i => question.options[i]).join(', ')}`;
    }
  } else {
    feedback = 'None of your selections were correct.';
  }
  
  return {
    isCorrect,
    pointsEarned,
    maxPoints: question.points,
    correctAnswer: correctIndices,
    explanation: question.explanation,
    feedback,
    details: {
      correctCount: correctSelections.length,
      incorrectCount: incorrectSelections.length,
      partialCredit: pointsEarned / question.points,
    },
  };
}

/**
 * Validate a true/false answer
 */
function validateTrueFalse(
  question: TrueFalseQuestion,
  answer: unknown
): ValidationResult {
  const selectedAnswer = typeof answer === 'boolean' ? answer : null;
  const isCorrect = selectedAnswer === question.correctAnswer;
  
  return {
    isCorrect,
    pointsEarned: isCorrect ? question.points : 0,
    maxPoints: question.points,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
    feedback: isCorrect
      ? 'Correct! ' + question.explanation
      : `The correct answer is ${question.correctAnswer ? 'True' : 'False'}. ${question.explanation}`,
  };
}

/**
 * Validate a matching answer
 */
function validateMatching(
  question: MatchingQuestion,
  answer: unknown
): ValidationResult {
  const userMatches = typeof answer === 'object' && answer !== null 
    ? answer as Record<string, string>
    : {};
  
  let correctCount = 0;
  const totalPairs = question.pairs.length;
  
  question.pairs.forEach(pair => {
    if (userMatches[pair.leftId] === pair.rightId) {
      correctCount++;
    }
  });
  
  const isCorrect = correctCount === totalPairs;
  const partialCredit = correctCount / totalPairs;
  const pointsEarned = Math.round(question.points * partialCredit);
  
  const correctAnswer: Record<string, string> = {};
  question.pairs.forEach(pair => {
    correctAnswer[pair.leftId] = pair.rightId;
  });
  
  return {
    isCorrect,
    pointsEarned,
    maxPoints: question.points,
    correctAnswer,
    explanation: question.explanation,
    feedback: isCorrect
      ? 'Perfect! All matches are correct.'
      : `You matched ${correctCount} of ${totalPairs} correctly.`,
    details: {
      correctCount,
      incorrectCount: totalPairs - correctCount,
      partialCredit,
    },
  };
}

/**
 * Validate a fill-in-the-blank answer
 */
function validateFillBlank(
  question: FillBlankQuestion,
  answer: unknown
): ValidationResult {
  const userAnswers = typeof answer === 'object' && answer !== null
    ? answer as Record<string, string>
    : {};
  
  let correctCount = 0;
  const totalBlanks = question.blanks.length;
  
  question.blanks.forEach(blank => {
    const userAnswer = userAnswers[blank.id] || '';
    let isBlankCorrect = false;
    
    if (blank.caseSensitive) {
      isBlankCorrect = userAnswer === blank.correctAnswer ||
        (blank.acceptableAnswers?.includes(userAnswer) ?? false);
    } else {
      const normalizedUser = userAnswer.toLowerCase().trim();
      const normalizedCorrect = blank.correctAnswer.toLowerCase().trim();
      isBlankCorrect = normalizedUser === normalizedCorrect ||
        (blank.acceptableAnswers?.some(a => a.toLowerCase().trim() === normalizedUser) ?? false);
    }
    
    // Numeric tolerance check
    if (!isBlankCorrect && blank.tolerance !== undefined) {
      const userNum = parseFloat(userAnswer);
      const correctNum = parseFloat(blank.correctAnswer);
      if (!isNaN(userNum) && !isNaN(correctNum)) {
        const diff = Math.abs(userNum - correctNum);
        const toleranceValue = correctNum * (blank.tolerance / 100);
        isBlankCorrect = diff <= toleranceValue;
      }
    }
    
    if (isBlankCorrect) correctCount++;
  });
  
  const isCorrect = correctCount === totalBlanks;
  const partialCredit = correctCount / totalBlanks;
  const pointsEarned = Math.round(question.points * partialCredit);
  
  const correctAnswer: Record<string, string> = {};
  question.blanks.forEach(blank => {
    correctAnswer[blank.id] = blank.correctAnswer;
  });
  
  return {
    isCorrect,
    pointsEarned,
    maxPoints: question.points,
    correctAnswer,
    explanation: question.explanation,
    feedback: isCorrect
      ? 'Perfect! All blanks filled correctly.'
      : `You filled ${correctCount} of ${totalBlanks} blanks correctly.`,
    details: {
      correctCount,
      incorrectCount: totalBlanks - correctCount,
      partialCredit,
    },
  };
}

/**
 * Validate a scenario/branching answer
 */
function validateScenario(
  question: ScenarioQuestion,
  answer: unknown
): ValidationResult {
  const selectedBranchId = typeof answer === 'string' ? answer : '';
  const selectedBranch = question.branches.find(b => b.id === selectedBranchId);
  
  if (!selectedBranch) {
    return {
      isCorrect: false,
      pointsEarned: 0,
      maxPoints: question.points,
      correctAnswer: question.branches.find(b => b.isCorrect)?.id || '',
      explanation: question.explanation,
      feedback: 'Please select an option.',
    };
  }
  
  return {
    isCorrect: selectedBranch.isCorrect,
    pointsEarned: selectedBranch.points,
    maxPoints: question.points,
    correctAnswer: question.branches.find(b => b.isCorrect)?.id || '',
    explanation: question.explanation,
    feedback: selectedBranch.feedback,
  };
}

/**
 * Validate a calculation answer
 */
function validateCalculation(
  question: CalculationQuestion,
  answer: unknown
): ValidationResult {
  const userAnswer = typeof answer === 'number' ? answer : parseFloat(String(answer));
  
  if (isNaN(userAnswer)) {
    return {
      isCorrect: false,
      pointsEarned: 0,
      maxPoints: question.points,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      feedback: 'Please enter a valid number.',
    };
  }
  
  const diff = Math.abs(userAnswer - question.correctAnswer);
  const toleranceValue = Math.abs(question.correctAnswer) * (question.tolerance / 100);
  const isCorrect = diff <= toleranceValue;
  
  // Partial credit for close answers
  let pointsEarned = 0;
  if (isCorrect) {
    pointsEarned = question.points;
  } else {
    // Give partial credit if within 2x tolerance
    const extendedTolerance = toleranceValue * 2;
    if (diff <= extendedTolerance) {
      const closeness = 1 - (diff - toleranceValue) / toleranceValue;
      pointsEarned = Math.round(question.points * closeness * 0.5); // Max 50% for close
    }
  }
  
  let feedback: string;
  if (isCorrect) {
    feedback = `Correct! The answer is ${question.correctAnswer} ${question.unit}. ${question.explanation}`;
  } else {
    feedback = `Your answer: ${userAnswer} ${question.unit}. Correct: ${question.correctAnswer} ${question.unit}. `;
    if (pointsEarned > 0) {
      feedback += 'Close! You received partial credit.';
    } else {
      feedback += 'Review the calculation steps.';
    }
  }
  
  return {
    isCorrect,
    pointsEarned,
    maxPoints: question.points,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
    feedback,
    details: {
      userAnswer,
      difference: diff,
      toleranceApplied: question.tolerance,
    },
  };
}

/**
 * Main validation function - validates any question type
 */
export function validateAnswer(
  question: Question,
  answer: unknown
): ValidationResult {
  switch (question.type) {
    case 'multiple_choice':
      return validateMultipleChoice(question as MultipleChoiceQuestion, answer);
    case 'multi_select':
      return validateMultiSelect(question as MultiSelectQuestion, answer);
    case 'true_false':
      return validateTrueFalse(question as TrueFalseQuestion, answer);
    case 'matching':
      return validateMatching(question as MatchingQuestion, answer);
    case 'fill_blank':
      return validateFillBlank(question as FillBlankQuestion, answer);
    case 'scenario':
      return validateScenario(question as ScenarioQuestion, answer);
    case 'calculation':
      return validateCalculation(question as CalculationQuestion, answer);
    default: {
      // Unknown question type - return safe default
      return {
        isCorrect: false,
        pointsEarned: 0,
        maxPoints: 0,
        correctAnswer: null,
        explanation: 'Unknown question type',
        feedback: 'Unable to validate this question type.',
      };
    }
  }
}

/**
 * Validate multiple answers at once
 */
export function validateMultipleAnswers(
  questions: Question[],
  answers: Map<string, unknown>
): {
  results: ValidationResult[];
  totalPoints: number;
  pointsEarned: number;
  percentage: number;
} {
  let totalPoints = 0;
  let pointsEarned = 0;
  const results: ValidationResult[] = [];
  
  questions.forEach(question => {
    const answer = answers.get(question.id);
    const result = validateAnswer(question, answer);
    results.push(result);
    totalPoints += result.maxPoints;
    pointsEarned += result.pointsEarned;
  });
  
  const percentage = totalPoints > 0 ? Math.round((pointsEarned / totalPoints) * 100) : 0;
  
  return {
    results,
    totalPoints,
    pointsEarned,
    percentage,
  };
}

/**
 * Check if an answer is complete (not empty/null)
 */
export function isAnswerComplete(answer: unknown): boolean {
  if (answer === null || answer === undefined) return false;
  if (typeof answer === 'string' && answer.trim() === '') return false;
  if (Array.isArray(answer) && answer.length === 0) return false;
  if (typeof answer === 'object' && answer !== null && Object.keys(answer).length === 0) return false;
  return true;
}

/**
 * Format a correct answer for display
 */
export function formatCorrectAnswer(question: Question): string {
  switch (question.type) {
    case 'multiple_choice': {
      const mc = question as MultipleChoiceQuestion;
      return mc.options[mc.correctIndex] || '';
    }
    case 'multi_select': {
      const ms = question as MultiSelectQuestion;
      return ms.correctIndices.map(i => ms.options[i]).join(', ');
    }
    case 'true_false': {
      const tf = question as TrueFalseQuestion;
      return tf.correctAnswer ? 'True' : 'False';
    }
    case 'calculation': {
      const calc = question as CalculationQuestion;
      return `${calc.correctAnswer} ${calc.unit}`;
    }
    default:
      return 'See explanation';
  }
}

/**
 * Get validation summary for review mode
 */
export function getValidationSummary(
  questions: Question[],
  answers: Map<string, unknown>
): {
  correct: number;
  incorrect: number;
  unanswered: number;
  partial: number;
} {
  let correct = 0;
  let incorrect = 0;
  let unanswered = 0;
  let partial = 0;
  
  questions.forEach(question => {
    const answer = answers.get(question.id);
    
    if (!isAnswerComplete(answer)) {
      unanswered++;
      return;
    }
    
    const result = validateAnswer(question, answer);
    
    if (result.isCorrect && result.pointsEarned === result.maxPoints) {
      correct++;
    } else if (result.pointsEarned > 0) {
      partial++;
    } else {
      incorrect++;
    }
  });
  
  return { correct, incorrect, unanswered, partial };
}
