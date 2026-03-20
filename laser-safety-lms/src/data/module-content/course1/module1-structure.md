# Module 1 Content Structure Document

## Overview
**Module:** Introduction to Laser Hazards  
**Course:** Course 1: Laser Safety Fundamentals  
**Source:** FDA Publication 86-8262, HHS, May 1986  
**File:** `module1-content.ts`

---

## Data Export Structure

```typescript
import { module1Content, Section, QuizQuestion, GlossaryTerm } from './module1-content';

// Main content object
module1Content: {
  title: string;
  course: string;
  source: string;
  documentType: string;
  totalPages: number;
  sections: Section[];
  quizQuestions: QuizQuestion[];
  glossary: GlossaryTerm[];
  quizMapping: QuizMapping[];
  learningObjectives: string[];
  prerequisites: string[];
  contentSourceVerification: VerificationInfo;
}
```

---

## Sections Overview

### 1. Laser Properties (`id: "laser-properties"`)
**Topics:**
- LASER acronym definition
- Monochromaticity (single wavelength/pure color)
- Coherence (in-phase waves)
- Minimal divergence (concentrated beam)
- Power concentration examples

**Interactive Data Available:**
- `lightComparison`: Comparison table (Laser vs Ordinary Light)
- `powerComparison`: Visual scale showing power concentration

**Key Points:** 6 key facts about laser properties

---

### 2. Electromagnetic Spectrum (`id: "em-spectrum"`)
**Topics:**
- Laser light in EM spectrum context
- Visible light range (380-700nm)
- Non-ionizing radiation distinction
- Common laser wavelengths in entertainment

**Interactive Data Available:**
- `spectrumDiagram`: Full EM spectrum with visible highlight
- `wavelengths`: Array of 12 laser wavelengths with uses and hazards

**Key Points:** 6 key facts about wavelengths and spectrum

---

### 3. Beam Interactions (`id: "beam-interactions"`)
**Topics:**
- Specular vs diffuse reflection
- Mirror ball safety mechanisms
- Scanning device functions
- Hazard assessment

**Interactive Data Available:**
- `reflectionTypes`: 3 types (specular, diffuse, scattered)
- `scenarios`: 4 safety scenarios with outcomes

**Key Points:** 7 key facts about reflection hazards

---

### 4. Ocular Hazards (`id: "ocular-hazards"`)
**Topics:**
- Eye anatomy and focusing
- Power concentration (10,000x)
- Peripheral vs central vision damage
- Skin burn hazards

**Interactive Data Available:**
- `eyeStructures`: 4 eye structures with functions/hazards
- `penetrationData`: Wavelength-specific absorption data
- `powerConcentration`: Calculation data

**Key Points:** 7 key facts about biological hazards

---

### 5. Laser Classification (`id: "laser-classification"`)
**Topics:**
- FDA laser classes (I, II, III, IV)
- Power thresholds
- Hazard characteristics
- Labeling requirements

**Interactive Data Available:**
- `classificationTable`: Complete class comparison table
- `powerScale`: Logarithmic scale visualization data

**Key Points:** 7 key facts about classification system

---

## Quiz Questions

**Total Questions:** 15

| Difficulty | Count | IDs |
|------------|-------|-----|
| Beginner | 5 | m1-q1 to m1-q5 |
| Intermediate | 5 | m1-q6 to m1-q10 |
| Advanced | 5 | m1-q11 to m1-q15 |

**Question Types:**
- `multiple_choice`: Standard 4-option questions
- `true_false`: True/False questions (options: ["True", "False"])
- `scenario`: Situation-based multiple choice
- `calculation`: Numerical problem solving

**Accessing Questions:**
```typescript
// All questions
const allQuestions = module1Content.quizQuestions;

// Filter by difficulty
const beginnerQuestions = module1Content.quizQuestions.filter(q => q.difficulty === 'beginner');

// Filter by topic
const beamQuestions = module1Content.quizQuestions.filter(q => q.topic === 'Beam Interactions');

// Map to sections
const sectionQuestions = module1Content.quizMapping
  .filter(m => m.sectionId === 'beam-interactions')
  .map(m => module1Content.quizQuestions.find(q => q.id === m.questionId));
```

---

## Glossary

**Total Terms:** 20

**Categories:**
- Laser Properties (3 terms)
- Beam Interactions (2 terms)
- Laser Physics (2 terms)
- Ocular Anatomy (2 terms)
- Laser Classification (4 terms)
- Physics (2 terms)
- Safety Equipment (2 terms)
- Laser Types (1 term)
- Biological Protection (1 term)
- Electromagnetic Spectrum (1 term)

---

## Quiz-to-Section Mapping

Use `module1Content.quizMapping` to associate questions with content sections:

```typescript
interface QuizMapping {
  questionId: string;  // e.g., "m1-q1"
  sectionId: string;   // e.g., "laser-properties"
  topic: string;       // e.g., "Laser Definition"
}
```

This enables:
- Section-specific quizzes
- Progress tracking
- Targeted review recommendations

---

## Integration Guide for Agent A

### 1. Section Content Display

```typescript
// Get section content
const section = module1Content.sections.find(s => s.id === 'laser-properties');

// Display content
<section.title>
<section.content>  // Full text content
<section.keyPoints>  // Array of bullet points
```

### 2. Interactive Components

**For Comparison Tables:**
```typescript
const comparisonData = section.interactiveData?.lightComparison;
// Render table with rows array
```

**For Spectrum Visualization:**
```typescript
const spectrumData = section.interactiveData?.spectrumDiagram;
// Render spectrum bar with ranges
```

**For Reflection Types:**
```typescript
const reflectionTypes = section.interactiveData?.reflectionTypes;
// Render 3-panel comparison cards
```

**For Scenarios:**
```typescript
const scenarios = section.interactiveData?.scenarios;
// Render interactive scenario cards with outcomes
```

**For Eye Diagram:**
```typescript
const eyeStructures = section.interactiveData?.eyeStructures;
// Render annotated eye diagram
```

### 3. Quiz Integration

```typescript
// At end of section, show relevant questions
const sectionQuizIds = module1Content.quizMapping
  .filter(m => m.sectionId === currentSectionId)
  .map(m => m.questionId);

const sectionQuizQuestions = module1Content.quizQuestions
  .filter(q => sectionQuizIds.includes(q.id));
```

### 4. Progress Tracking

```typescript
// Track which questions answered correctly per section
const sectionProgress = {
  sectionId: 'laser-properties',
  questionsAnswered: 3,
  questionsCorrect: 2,
  masteryLevel: 'needs_review' // | 'proficient' | 'mastered'
};
```

---

## Content Accuracy Verification

All content sourced from:
- **Document:** `lms_data/extracted_content/course-1/intro-laser-hazards_extracted.json`
- **Text:** `lms_data/extracted_content/course-1/intro-laser-hazards_extracted.txt`
- **Digest:** `lms_data/digested_content/course-1/intro-laser-hazards_digested.json`

**Key verified facts:**
- Class I: <0.39 microwatts (FDA p.17)
- Class II: <1 milliwatt (FDA p.17-18)
- Class III: <500 milliwatts (FDA p.18)
- Class IV: >500 milliwatts (FDA p.18)
- Retinal concentration: 10,000x or more (FDA p.16)
- Coherence definition (FDA p.8)
- Mirror ball safety (FDA p.11-12)

---

## Recommended Section Flow

1. **Introduction** → Overview of laser hazards
2. **Laser Properties** → What makes lasers unique
3. **EM Spectrum** → Where lasers fit in
4. **Beam Interactions** → How beams behave
5. **Ocular Hazards** → Why lasers are dangerous
6. **Classification** → FDA regulatory framework
7. **Quiz** → Assessment across all sections

---

## Notes for Implementation

- All text content is extracted directly from FDA source document
- No fictional or invented facts included
- Interactive data structured for React/Vue/Angular components
- Quiz questions have full explanations for learning reinforcement
- Glossary terms include context for proper usage
- Quiz mapping enables flexible assessment placement
