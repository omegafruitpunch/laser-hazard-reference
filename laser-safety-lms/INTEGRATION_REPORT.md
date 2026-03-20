# Laser Safety LMS - Integration Layer Report

**Generated:** 2026-03-19  
**Agent:** Integration & Hooks Builder Agent

## Overview

This report documents the integration layer built for the Laser Safety LMS, including custom hooks, context providers, data utilities, type definitions, and animation utilities.

---

## 📁 Directory Structure

```
laser-safety-lms/src/
├── hooks/                    # 15 Custom React Hooks
│   ├── index.ts              # Barrel exports
│   ├── useModuleProgress.ts
│   ├── useCourseProgress.ts
│   ├── useOverallProgress.ts
│   ├── useQuiz.ts
│   ├── useAssessmentHistory.ts
│   ├── useSpacedRepetition.ts
│   ├── useKnowledgeGraph.ts
│   ├── useLearningPath.ts
│   ├── useRecommendations.ts
│   ├── useGapAnalysis.ts
│   ├── useCalculator.ts
│   ├── useSimulation.ts
│   ├── useDragAndDrop.ts
│   ├── useUserPreferences.ts
│   └── useAccessibilitySettings.ts
│
├── context/                  # 5 Context Providers
│   ├── index.ts              # Barrel exports + AppProviders
│   ├── ProgressContext.tsx
│   ├── KnowledgeGraphContext.tsx
│   ├── UserContext.tsx
│   ├── ModuleContext.tsx
│   └── AssessmentContext.tsx
│
├── lib/data/                 # 4 Data Utility Modules
│   ├── index.ts              # Barrel exports
│   ├── moduleLoader.ts
│   ├── knowledgeGraphClient.ts
│   ├── quizBankLoader.ts
│   └── progressStorage.ts
│
├── lib/animations/           # Animation Utilities
│   ├── index.ts              # Barrel exports
│   ├── variants.ts
│   └── transitions.ts
│
└── types/
    └── lms.ts                # Comprehensive TypeScript types
```

---

## 🔧 Custom Hooks

### Progress Tracking Hooks

| Hook | Purpose | Key Features |
|------|---------|--------------|
| `useModuleProgress` | Track module-level progress | Phase completion, time tracking, notes |
| `useCourseProgress` | Track course-level progress | Module completion, quiz results, percentage |
| `useOverallProgress` | Global learning statistics | Streak tracking, weekly goals, achievements |

**Usage Example:**
```tsx
import { useModuleProgress, useCourseProgress } from '@/hooks';

function ModuleViewer({ courseId, moduleId }) {
  const { progress, markComplete, updateTimeSpent } = useModuleProgress(courseId, moduleId);
  const { completionPercentage } = useCourseProgress(courseId);
  
  return (
    <div>
      <ProgressBar value={completionPercentage} />
      <button onClick={markComplete}>Mark Complete</button>
    </div>
  );
}
```

### Quiz & Assessment Hooks

| Hook | Purpose | Key Features |
|------|---------|--------------|
| `useQuiz` | Manage quiz state | Answer tracking, auto-advance, timer |
| `useAssessmentHistory` | Review past attempts | Statistics, trend analysis, filtering |
| `useSpacedRepetition` | Review sessions | SM-2 algorithm, due items, mastery tracking |

**Usage Example:**
```tsx
import { useQuiz } from '@/hooks';

function QuizContainer({ moduleId }) {
  const { 
    currentQuestion, 
    selectAnswer, 
    submitQuiz,
    score,
    passed 
  } = useQuiz(moduleId, { autoAdvance: true });
  
  return <QuizInterface question={currentQuestion} onAnswer={selectAnswer} />;
}
```

### Knowledge Graph Hooks

| Hook | Purpose | Key Features |
|------|---------|--------------|
| `useKnowledgeGraph` | Access knowledge nodes | Query, search, get related/prerequisites |
| `useLearningPath` | Path progress tracking | Milestones, unlock criteria, next step |
| `useRecommendations` | Personalized learning | Priority filtering, gap-based suggestions |
| `useGapAnalysis` | Certification readiness | Knowledge gaps, time estimates, recommendations |

**Usage Example:**
```tsx
import { useGapAnalysis, useRecommendations } from '@/hooks';

function Dashboard() {
  const { gapsByPriority, readinessScore } = useGapAnalysis('Certified LSO');
  const { recommendations, highPriority } = useRecommendations(userId);
  
  return (
    <div>
      <ReadinessScore score={readinessScore} />
      <RecommendationList items={highPriority} />
    </div>
  );
}
```

### Interactive Component Hooks

| Hook | Purpose | Key Features |
|------|---------|--------------|
| `useCalculator` | Laser safety calculators | NOHD, OD, classification formulas |
| `useSimulation` | Interactive scenarios | Multi-step, variables, decision tracking |
| `useDragAndDrop` | Learning exercises | Zone validation, scoring, retries |

**Usage Example:**
```tsx
import { useCalculator } from '@/hooks';

function NOHDCalculator() {
  const { calculator, inputs, results, setInputValue } = useCalculator('hazard-distance');
  
  return (
    <CalculatorForm 
      inputs={calculator?.inputs}
      values={inputs}
      onChange={setInputValue}
      results={results}
    />
  );
}
```

### User Preference Hooks

| Hook | Purpose | Key Features |
|------|---------|--------------|
| `useUserPreferences` | User settings | Theme, font size, notifications |
| `useAccessibilitySettings` | A11y features | High contrast, reduced motion, screen reader |

**Usage Example:**
```tsx
import { useAccessibilitySettings } from '@/hooks';

function Settings() {
  const { settings, updateSetting, announceToScreenReader } = useAccessibilitySettings();
  
  return (
    <Switch
      checked={settings.highContrast}
      onChange={(v) => updateSetting('highContrast', v)}
    />
  );
}
```

---

## 🏗️ Context Providers

### ProgressContext
Global progress state with course, module, and overall tracking.

```tsx
<ProgressProvider>
  <App />
</ProgressProvider>

// Usage
const { courseProgress, markModuleComplete } = useProgress();
```

### KnowledgeGraphContext
Knowledge graph access with query capabilities.

```tsx
<KnowledgeGraphProvider>
  <App />
</KnowledgeGraphProvider>

// Usage
const { graph, getRelatedNodes } = useKnowledgeGraphContext();
```

### UserContext
Authentication, profile, and preferences management.

```tsx
<UserProvider>
  <App />
</UserProvider>

// Usage
const { user, preferences, login, logout } = useUser();
```

### ModuleContext
Current module navigation and state.

```tsx
<ModuleProvider courseId={id} moduleId={modId}>
  <ModuleViewer />
</ModuleProvider>

// Usage
const { currentPhase, currentComponent, goToNext } = useModule();
```

### AssessmentContext
Quiz and assessment state management.

```tsx
<AssessmentProvider moduleId={id}>
  <QuizContainer />
</AssessmentProvider>

// Usage
const { currentQuestion, selectAnswer, submitQuiz } = useAssessment();
```

### Combined AppProviders
Convenience wrapper for all global providers:

```tsx
import { AppProviders } from '@/context';

function RootLayout({ children }) {
  return <AppProviders>{children}</AppProviders>;
}
```

---

## 💾 Data Utilities

### moduleLoader.ts
- `getModuleById(courseId, moduleId)` - Load module content
- `getCalculator(type)` - Get calculator configuration
- `calculate(formula, inputs, output)` - Execute calculations
- `getSimulation(scenarioId)` - Load simulation scenarios
- `prefetchModule(courseId, moduleId)` - Preload for performance

### knowledgeGraphClient.ts
- `getKnowledgeGraph()` - Load full knowledge graph
- `queryKnowledgeGraph(query)` - Filter nodes
- `updateNodeMastery(nodeId, level)` - Update mastery
- `performGapAnalysis(certification)` - Analyze readiness
- `getRecommendations(userId)` - Get personalized suggestions

### quizBankLoader.ts
- `getQuizByModuleId(moduleId)` - Load module quiz
- `saveQuizAttempt(attempt)` - Persist attempt
- `getSpacedRepetitionItems()` - Get SR items
- `createReviewSession(items)` - Build review session
- Implements SM-2 algorithm for spaced repetition

### progressStorage.ts
- `getCourseProgress(courseId)` - Load course progress
- `saveCourseProgress(courseId, progress)` - Persist progress
- `getOverallProgress()` - Get global stats
- `syncProgress()` - Sync with server (offline-first)
- `exportProgress()` / `importProgress()` - Data portability

---

## 🎨 Animation Utilities

### variants.ts
Pre-built Framer Motion variants:

| Variant | Description |
|---------|-------------|
| `fadeIn`, `fadeInUp`, `fadeInDown`, `fadeInLeft`, `fadeInRight` | Fade animations with direction |
| `slideUp`, `slideDown`, `slideLeft`, `slideRight` | Slide transitions |
| `scaleUp`, `scaleDown` | Scale animations |
| `pageTransition`, `pageSlideTransition` | Page transitions |
| `staggerContainer`, `staggerItem` | Staggered list animations |
| `cardVariants` | Card hover/tap states |
| `modalOverlay`, `modalContent` | Modal animations |
| `progressBar`, `progressCircle` | Progress indicators |
| `shake`, `errorPulse`, `successCheck` | Feedback animations |

**Usage Example:**
```tsx
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, cardHover } from '@/lib/animations';

<motion.div variants={staggerContainer} initial="hidden" animate="visible">
  {items.map(item => (
    <motion.div 
      key={item.id}
      variants={fadeInUp}
      whileHover={cardHover}
    >
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

### transitions.ts
Helper functions for respecting reduced motion:

| Function | Purpose |
|----------|---------|
| `useShouldAnimate()` | Check animation preference |
| `getTransitionProps()` | Get safe transition props |
| `getAnimatePresenceProps()` | AnimatePresence configuration |
| `easing`, `duration`, `springs` | Animation presets |

---

## 📐 Type Definitions (lms.ts)

Comprehensive TypeScript types covering:

- **Entity Types**: Course, Module, Phase, Component
- **Quiz Types**: Quiz, QuizQuestion, QuizAttempt, AnswerRecord
- **Progress Types**: CourseProgress, ModuleProgress, OverallProgress
- **Knowledge Graph**: KnowledgeNode, KnowledgeEdge, MasteryLevel
- **Learning Paths**: LearningPath, PathCourse, Milestone
- **Gap Analysis**: GapAnalysis, KnowledgeGap, GapRecommendation
- **Spaced Repetition**: SpacedRepetitionItem, ReviewSession
- **Interactive**: CalculatorType, SimulationState, DragDropExercise
- **User**: User, UserPreferences, UserCertification, AccessibilitySettings
- **API**: APIResponse, APIError, APIMeta, LearningEvent, LearningAnalytics

---

## 📦 Dependencies Added

```json
{
  "dependencies": {
    "framer-motion": "^12.5.0"
  }
}
```

Install with:
```bash
npm install
```

---

## 🎯 Usage Summary

### Basic Setup
```tsx
// app/layout.tsx
import { AppProviders } from '@/context';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
```

### Using Hooks
```tsx
// components/CourseDashboard.tsx
import { useCourseProgress, useRecommendations } from '@/hooks';

export function CourseDashboard({ courseId, userId }) {
  const { progress, completionPercentage } = useCourseProgress(courseId);
  const { recommendations } = useRecommendations(userId);
  
  return (
    <div>
      <Progress value={completionPercentage} />
      <RecommendationList items={recommendations} />
    </div>
  );
}
```

### Using Animations
```tsx
// components/AnimatedList.tsx
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';

export function AnimatedList({ items }) {
  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible">
      {items.map((item, i) => (
        <motion.div key={i} variants={fadeInUp}>
          {item}
        </motion.div>
      ))}
    </motion.div>
  );
}
```

---

## ✅ Files Created

| Directory | Files | Lines of Code |
|-----------|-------|---------------|
| `src/hooks/` | 16 files | ~4,500 |
| `src/context/` | 6 files | ~2,000 |
| `src/lib/data/` | 5 files | ~3,800 |
| `src/lib/animations/` | 3 files | ~700 |
| `src/types/` | 1 file | ~650 |
| **Total** | **31 files** | **~11,650** |

---

## 🔗 Integration Points

The integration layer connects with:

1. **Existing Components**: Uses existing `courses.ts` and `quizzes.ts` data
2. **Progress System**: Integrates with existing `progress.ts` utilities
3. **UI Components**: Compatible with shadcn/ui components
4. **Next.js App Router**: All hooks marked with 'use client'
5. **TypeScript**: Full type safety throughout

---

## 🚀 Next Steps

1. Install dependencies: `npm install`
2. Import providers in `app/layout.tsx`
3. Use hooks in components
4. Add animations for enhanced UX
5. Implement server-side sync for progress data

---

*End of Integration Report*
