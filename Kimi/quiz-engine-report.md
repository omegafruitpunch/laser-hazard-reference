# Quiz & Assessment Engine - Build Report

## Overview

This report documents the comprehensive quiz and assessment engine built for the Laser Safety LMS. The engine powers all 534 quiz items across 8 courses with support for multiple question types, adaptive learning, and detailed analytics.

---

## Files Created

### Core Components

| File | Purpose |
|------|---------|
| `laser-safety-lms/src/components/quiz/QuizEngine.tsx` | Main quiz engine with timer, navigation, and scoring |
| `laser-safety-lms/src/components/quiz/AssessmentFlow.tsx` | Full assessment flow with intro, briefing, quiz, and results |
| `laser-safety-lms/src/components/quiz/AssessmentResults.tsx` | Detailed results page with breakdowns and recommendations |
| `laser-safety-lms/src/components/quiz/QuizResults.tsx` | Legacy simplified results component |
| `laser-safety-lms/src/components/quiz/QuizQuestion.tsx` | Legacy question component |

### Question Type Components

| File | Purpose |
|------|---------|
| `laser-safety-lms/src/components/quiz/questions/MultipleChoiceQuestion.tsx` | Single-select multiple choice |
| `laser-safety-lms/src/components/quiz/questions/MultiSelectQuestion.tsx` | Multi-select with partial credit |
| `laser-safety-lms/src/components/quiz/questions/TrueFalseQuestion.tsx` | True/false questions |
| `laser-safety-lms/src/components/quiz/questions/MatchingQuestion.tsx` | Drag-and-drop matching |
| `laser-safety-lms/src/components/quiz/questions/FillBlankQuestion.tsx` | Fill-in-the-blank with tolerance |
| `laser-safety-lms/src/components/quiz/questions/ScenarioQuestion.tsx` | Branching scenario questions |
| `laser-safety-lms/src/components/quiz/questions/CalculationQuestion.tsx` | Numerical calculations with steps |
| `laser-safety-lms/src/components/quiz/questions/index.ts` | Question component exports |

### Quiz Utilities

| File | Purpose |
|------|---------|
| `laser-safety-lms/src/lib/quiz/quizLoader.ts` | Load and normalize quiz data from JSON |
| `laser-safety-lms/src/lib/quiz/quizValidator.ts` | Validate answers with partial credit |
| `laser-safety-lms/src/lib/quiz/quizAnalytics.ts` | Track performance and generate insights |
| `laser-safety-lms/src/lib/quiz/spacedRepetition.ts` | SM-2 algorithm for review scheduling |
| `laser-safety-lms/src/lib/quiz/index.ts` | Utility exports |

### Type Definitions

| File | Purpose |
|------|---------|
| `laser-safety-lms/src/types/quiz.ts` | Comprehensive quiz type definitions |
| `laser-safety-lms/src/types/index.ts` | Updated with quiz type exports |

### Component Index

| File | Purpose |
|------|---------|
| `laser-safety-lms/src/components/quiz/index.ts` | Quiz component exports |

---

## Features Implemented

### 1. Question Types

#### Multiple Choice
- Single-select options (A, B, C, D)
- Immediate feedback with explanations
- Randomization support
- Visual indicators for correct/incorrect

#### Multi-Select
- Select all that apply
- Partial credit calculation
- Require all correct option
- Visual checkbox interface

#### True/False
- Binary choice with clear visuals
- Immediate validation
- Explanation display

#### Matching
- Drag-and-drop style matching
- Left/right column layout
- Visual connection indicators
- Partial credit for partial matches

#### Fill-in-the-Blank
- Multiple blanks per question
- Case sensitivity option
- Numeric tolerance (percentage)
- Acceptable alternatives

#### Scenario (Branching)
- Context presentation
- Multiple decision branches
- Branch-specific feedback
- Complex scenario navigation

#### Calculation
- Numeric input with units
- Configurable tolerance
- Step-by-step solutions
- Formula display option
- Variable presentation

### 2. Hint System

Three-level progressive hint system:
- **Level 1**: General guidance (-10-20% points)
- **Level 2**: Specific direction (-20-30% points)
- **Level 3**: Strong hint (-30-60% points)

Hints are context-aware and generated based on:
- Question content keywords
- Difficulty level
- Competency area

### 3. Assessment Types

| Type | Questions | Purpose |
|------|-----------|---------|
| Module Quiz | 5-10 | Per-module assessment |
| Course Exam | 20-30 | Comprehensive course test |
| Certification Practice | 75-100 | Full exam simulation |
| Knowledge Check | 1-3 | Quick concept verification |
| Spaced Repetition | Varies | Scheduled review questions |

### 4. Navigation Features

- **Previous/Next**: Navigate between questions
- **Question Navigator**: Jump to any question
- **Flag for Review**: Mark questions to revisit
- **Progress Indicator**: Visual progress bar
- **Timer**: Optional countdown timer

### 5. Analytics & Reporting

#### Tracked Metrics
- Time per question
- Attempt counts
- Hint usage rates
- Improvement over time
- Weak areas identification
- Strong areas identification

#### Reports Include
- Score breakdown by category
- Competency area analysis
- Correct/incorrect review
- Detailed explanations
- Personalized recommendations
- Next steps guidance

### 6. Spaced Repetition (SM-2 Algorithm)

Features:
- Automatic review scheduling
- Performance-based intervals
- Ease factor tracking
- New/Learning/Review/Mastered classification
- Review forecast

Performance Ratings:
- **Again**: Complete failure (reset interval)
- **Hard**: Correct with difficulty (1.2x interval, -0.15 ease)
- **Good**: Correct (normal interval)
- **Easy**: Easy answer (boosted interval, +0.15 ease)

---

## Integration Guide

### Basic Usage

```tsx
import { AssessmentFlow } from '@/components/quiz';
import { loadQuizBank } from '@/lib/quiz';

function QuizPage() {
  const quizBank = loadQuizBank('course-8-standards');
  
  if (!quizBank) return <div>Quiz not found</div>;
  
  return (
    <AssessmentFlow
      quizBank={quizBank}
      onComplete={(result) => console.log('Completed:', result)}
      onAbandon={() => console.log('Abandoned')}
    />
  );
}
```

### Using QuizEngine Directly

```tsx
import { QuizEngine } from '@/components/quiz';
import { loadQuizBank } from '@/lib/quiz';

function CustomQuiz() {
  const quizBank = loadQuizBank('course-1-beam-hazard');
  
  return (
    <QuizEngine
      quizBank={quizBank}
      config={{
        allowNavigation: true,
        allowFlagging: true,
        showTimer: true,
        showProgress: true,
        immediateFeedback: false,
        allowHints: true,
        randomizeQuestions: true,
        randomizeOptions: true,
      }}
      onComplete={(result) => {
        // Handle completion
      }}
    />
  );
}
```

### Loading Quiz Data

```tsx
import { 
  loadQuizBank, 
  getQuizBanksByCourse,
  selectRandomQuestions 
} from '@/lib/quiz';

// Load specific quiz
const quiz = loadQuizBank('course-8-standards');

// Get all quizzes for a course
const courseQuizzes = getQuizBanksByCourse('course-1');

// Get random subset of questions
const randomQuestions = selectRandomQuestions('course-8-standards', 10, {
  difficulty: 'intermediate',
  competency: 'hazard_calculations'
});
```

### Tracking Analytics

```tsx
import { 
  recordAttempt,
  getRecommendations,
  getWeakAreas,
  getOverallStats 
} from '@/lib/quiz/quizAnalytics';

// After quiz completion
recordAttempt(quizBankId, assessmentResult);

// Get recommendations
const recommendations = getRecommendations(quizBankId, questions);

// Get weak areas for targeted study
const weakAreas = getWeakAreas(quizBankId, questions);

// Get overall learning stats
const stats = getOverallStats();
```

### Spaced Repetition

```tsx
import { 
  processReview,
  getDueQuestions,
  getSRSStats,
  getRecommendedDailyCount 
} from '@/lib/quiz/spacedRepetition';

// Process a review
processReview(questionId, quizBankId, 'good');

// Get questions due for review
const dueQuestions = getDueQuestions(allQuestions, quizBankId, 20);

// Get SRS statistics
const stats = getSRSStats(allQuestions, quizBankId);

// Get recommended daily study count
const daily = getRecommendedDailyCount(allQuestions, quizBankId, 15); // 15 minutes
```

### Custom Question Components

```tsx
import { MultipleChoiceQuestion } from '@/components/quiz';

function CustomQuizQuestion({ question }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  
  return (
    <MultipleChoiceQuestion
      question={question}
      selectedIndex={selected}
      onSelect={setSelected}
      showResult={showResult}
      onUseHint={(level) => console.log('Hint used:', level)}
      hintsUsed={[]}
    />
  );
}
```

---

## Data Structure

### Quiz Bank Structure

```typescript
interface QuizBank {
  id: string;
  title: string;
  description: string;
  courseId: string;
  moduleIds?: string[];
  assessmentType: 'module_quiz' | 'course_exam' | 'certification_practice' | 'knowledge_check' | 'spaced_repetition';
  totalQuestions: number;
  passingScore: number;
  timeLimitMinutes?: number;
  categories: {
    [key: string]: {
      weight: number;
      questions: string[];
    };
  };
  questions: Question[];
  retakePolicy: {
    allowed: boolean;
    maxAttempts: number;
    cooldownHours: number;
  };
  randomizeQuestions: boolean;
  randomizeOptions: boolean;
}
```

### Question Structure

All questions extend a base with:
- `id`: Unique identifier
- `type`: Question type
- `text`: Question text
- `explanation`: Answer explanation
- `points`: Point value
- `difficulty`: beginner | intermediate | advanced | expert
- `competencyArea`: CLSO competency area
- `tags`: Array of tags
- `hints`: Array of 3 hints with levels and penalties
- `references`: Optional standard references

---

## Supported Quiz Data Formats

The quiz loader automatically normalizes data from:

### Format 1: Course 1 Style
```json
{
  "document": "beam-hazard-calculations.pdf",
  "title": "Professional Profile Quiz",
  "total_questions": 6,
  "questions": [...]
}
```

### Format 2: Course 8 Style (Quiz Bank)
```json
{
  "quiz_bank": {
    "id": "course-8-standards-quiz",
    "title": "Course 8: Entertainment Technology Standards Assessment",
    "categories": {...},
    "questions": [...],
    "retake_policy": {...}
  }
}
```

### Format 3: Course 5 Style (Module-based)
```json
{
  "courseId": "course-5",
  "modules": ["c5-m4", "c5-m5", "c5-m6"],
  "questions": [...]
}
```

---

## Browser Storage

The engine uses localStorage for:

| Key | Purpose |
|-----|---------|
| `laser-safety-user-id` | Anonymous user identification |
| `laser-safety-quiz-analytics-{userId}` | Quiz performance analytics |
| `laser-safety-srs-{userId}` | Spaced repetition data |
| `question-time-{quizBankId}-{questionId}` | Question timing data (session) |

---

## Performance Considerations

1. **Lazy Loading**: Quiz data is loaded on-demand
2. **Caching**: Normalized quiz banks are cached in memory
3. **Session Storage**: Temporary timing data cleared on session end
4. **Debounced Saves**: Analytics saved with debouncing

---

## Accessibility

- Keyboard navigation support
- Screen reader compatible
- High contrast mode support
- Focus indicators
- ARIA labels on interactive elements

---

## Future Enhancements

Potential improvements for future versions:

1. **Real-time Collaboration**: Multi-user quizzes
2. **AI Tutoring**: Hint generation using AI
3. **Video Questions**: Embedded video scenarios
4. **3D Simulations**: Interactive hazard visualizations
5. **Mobile Optimization**: Native app experience
6. **Offline Mode**: Service worker support
7. **Proctoring**: Anti-cheating measures
8. **Leaderboards**: Gamification elements

---

## Testing

Run these checks to verify installation:

1. Load quiz page - should show intro screen
2. Click "Start Assessment" - should show briefing
3. Agree to rules - should enter quiz
4. Answer questions - navigation should work
5. Use hints - should deduct points appropriately
6. Flag questions - should mark in navigator
7. Complete quiz - should show results
8. Check analytics - should be saved to localStorage

---

## Summary

The quiz engine provides:
- ✅ 7 question types with full interactivity
- ✅ Progressive 3-level hint system
- ✅ Multiple assessment types
- ✅ Comprehensive analytics
- ✅ Spaced repetition integration
- ✅ Question randomization
- ✅ Timer and progress tracking
- ✅ Flagging and review
- ✅ Detailed result breakdowns
- ✅ Personalized recommendations

Total Lines of Code: ~4,000+
Components: 10+
Utility Files: 4
Type Definitions: 200+
