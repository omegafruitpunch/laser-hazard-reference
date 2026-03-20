# Data Layer Documentation

## Overview

The data layer provides utilities for loading and querying course content, module data, quizzes, and knowledge graph information from JSON files.

## Directory Structure

```
src/data/
├── courses/          # Course metadata (8 courses)
├── modules/          # Module content (40+ modules)
├── quiz-banks/       # Quiz questions (8 quiz banks)
├── knowledge-graph/  # Knowledge graph and learning paths
└── research/         # Pedagogy and research data
```

## Data Loaders

### Course Data (`courseData.ts`)

```typescript
import { 
  getAllCourses, 
  getCourseById, 
  searchCourses,
  getCourseStats 
} from '@/lib/data/courseData';

// Get all courses
const courses = await getAllCourses();

// Get single course
const course = await getCourseById('course-1');

// Search courses
const results = await searchCourses('laser safety');

// Get statistics
const stats = await getCourseStats();
```

### Module Data (`moduleData.ts`)

```typescript
import { 
  getModulesByCourseId, 
  getModuleById,
  getNextModule,
  getPreviousModule,
  validatePrerequisites 
} from '@/lib/data/moduleData';

// Get modules for a course
const modules = await getModulesByCourseId('course-1');

// Get single module
const module = await getModuleById('module-1-1');

// Navigation
const next = await getNextModule('course-1', 'module-1-1');
const prev = await getPreviousModule('course-1', 'module-1-2');
```

### Quiz Data (`quizData.ts`)

```typescript
import { 
  getQuizByCourseId,
  getRandomQuestions,
  calculateScore,
  validateQuizAnswers 
} from '@/lib/data/quizData';

// Get quiz for a course
const quiz = await getQuizByCourseId('course-1');

// Calculate results
const result = calculateScore(questions, userAnswers);
```

### Knowledge Graph Data (`knowledgeGraphData.ts`)

```typescript
import { 
  getKnowledgeGraph,
  searchEntities,
  semanticSearch,
  getRecommendedPaths 
} from '@/lib/data/knowledgeGraphData';

// Search knowledge graph
const entities = await searchEntities('MPE');
const semantic = await semanticSearch('maximum permissible exposure');

// Get recommendations
const paths = await getRecommendedPaths(['course-1', 'course-2']);
```

## API Routes

### Course API

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/courses` | List all courses (supports filtering) |
| GET | `/api/courses/[id]` | Get course details with modules |

### Module API

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/modules/[courseId]/[moduleId]` | Get module content |
| POST | `/api/modules/[courseId]/[moduleId]` | Update module progress |

### Quiz API

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/quiz/[moduleId]` | Get quiz questions |
| POST | `/api/quiz/submit` | Submit quiz answers |
| GET | `/api/quiz/results/[attemptId]` | Get quiz results |

### Knowledge Graph API

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/knowledge/search?q=query` | Search concepts |
| GET | `/api/knowledge/recommendations` | Get learning recommendations |
| GET | `/api/knowledge/paths/[pathId]` | Get learning path details |

### User API

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/user/progress` | Get all progress |
| POST | `/api/user/progress` | Update progress |
| GET | `/api/user/preferences` | Get preferences |
| POST | `/api/user/preferences` | Update preferences |
| GET | `/api/user/achievements` | Get badges/achievements |

## Data Validation

Run the validation script to check all data files:

```bash
npx tsx scripts/validate-data.ts
```

## TypeScript Types

All types are exported from `@/types`:

```typescript
import { 
  Course, 
  Module, 
  QuizBank, 
  QuizQuestion,
  KnowledgeEntity,
  KnowledgeRelationship,
  LearningPath,
  UserProgress,
  ApiResponse 
} from '@/types';
```

## Adding New Data

1. Create JSON file in appropriate directory
2. Follow naming convention: `course-{n}.json`, `module-{c}-{m}.json`
3. Run validation script to ensure correctness
4. Update type definitions if adding new fields
