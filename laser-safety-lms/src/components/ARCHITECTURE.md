# Laser Safety LMS Component Architecture

## Overview

This document describes the component architecture for the Laser Safety LMS, specifically covering:
- **Shared/Core Components**: Reusable components for all modules
- **Course 8 Components**: Industry Standards specific components

## Directory Structure

```
src/components/
├── shared/                    # Core reusable components
│   ├── ModuleContainer.tsx    # 4-phase module wrapper
│   ├── ProgressTracker.tsx    # Visual progress indicator
│   ├── QuizEngine.tsx         # Universal quiz component
│   ├── HintSystem.tsx         # 3-level progressive hints
│   ├── CompletionBadge.tsx    # Mastery badges
│   └── index.ts               # Shared exports
├── interactive/
│   └── course8/               # Course 8: Industry Standards
│       ├── StandardsHierarchyVisualizer.tsx
│       ├── Z136Navigator.tsx
│       ├── E146ComplianceChecker.tsx
│       ├── ControlMeasurePrioritizer.tsx
│       ├── DocumentationTemplateGallery.tsx
│       ├── ChecklistGenerator.tsx
│       ├── AuditSimulator.tsx
│       ├── CertificationExamSimulator.tsx
│       ├── KnowledgeGapAnalyzer.tsx
│       ├── StudyPlanGenerator.tsx
│       └── index.ts
└── ui/                        # shadcn/ui components
```

## Shared Components Architecture

### ModuleContainer
- **Purpose**: Wrapper for all modules with 4-phase structure
- **Phases**: Warm-Up → Core Concepts → Guided Practice → Challenge
- **Features**:
  - Phase navigation with progress tracking
  - Auto-advance on phase completion
  - Context provider for child components
  - Accessibility support

### ProgressTracker
- **Purpose**: Visual progress indicator for courses/modules
- **Variants**: minimal, compact, detailed
- **Features**:
  - Module completion tracking
  - Time spent estimation
  - Streak tracking
  - Category breakdown

### QuizEngine
- **Purpose**: Universal quiz component with multiple question types
- **Question Types**: single, multiple, true/false, matching, ordering
- **Features**:
  - Progressive hint system integration
  - Category-based question organization
  - Time tracking
  - Detailed results with category breakdown

### HintSystem
- **Purpose**: 3-level progressive hint system
- **Levels**: Nudge (1) → Guidance (2) → Detailed Help (3)
- **Features**:
  - Progressive revelation
  - Contextual triggers
  - Skip to solution option

### CompletionBadge
- **Purpose**: Mastery badges with tier system
- **Tiers**: Bronze → Silver → Gold → Platinum → Diamond
- **Features**:
  - Animated celebrations
  - Share functionality
  - Badge collections
  - Export options

## Course 8 Components Architecture

### StandardsHierarchyVisualizer
- **Purpose**: Interactive tree view of ANSI Z136 series
- **Features**:
  - Expandable/collapsible nodes
  - Search/filter functionality
  - Detail panel with scope, requirements, certification relevance
  - Visual color coding by standard type

### Z136Navigator
- **Purpose**: Progressive disclosure document explorer for Z136.1
- **Features**:
  - Section bookmarking
  - Search across sections
  - Quick reference cards
  - Subsection detail views

### E146ComplianceChecker
- **Purpose**: Step-by-step compliance verification for entertainment laser setups
- **Categories**: Planning, Installation, Safety Systems, Personnel
- **Features**:
  - Critical item highlighting
  - Compliance percentage tracking
  - Exportable reports
  - Category-based navigation

### ControlMeasurePrioritizer
- **Purpose**: Hierarchy of controls exercise
- **Levels**: Elimination → Engineering → Administrative → PPE
- **Features**:
  - Drag-and-drop ordering (simplified to click-based)
  - Scenario-based challenges
  - Detailed feedback on ordering
  - Multiple practice scenarios

### DocumentationTemplateGallery
- **Purpose**: Interactive safety documentation templates
- **Templates**: Risk Assessment, Hand-Over, MPE Record, SOP
- **Features**:
  - Field types: text, textarea, select, checkbox, date, number
  - Auto-save functionality
  - PDF export
  - Form validation

### ChecklistGenerator
- **Purpose**: Operation-specific checklist creation
- **Templates**: Pre-Show, Installation, Maintenance
- **Features**:
  - Customizable sections and items
  - Item types: checkbox, text, signature
  - Progress tracking
  - Export functionality

### AuditSimulator
- **Purpose**: Virtual compliance audit practice
- **Scenarios**: Entertainment Venue, Research Lab
- **Features**:
  - Severity-based findings (minor/major/critical)
  - Reference tracking
  - Compliance rate calculation
  - Detailed audit reports

### CertificationExamSimulator
- **Purpose**: CLSO/CMLSO practice exam
- **Exam Types**: CLSO (100 questions, 120 min), CMLSO (75 questions, 90 min)
- **Features**:
  - Timed exams
  - Category breakdown
  - Difficulty levels
  - Detailed explanations

### KnowledgeGapAnalyzer
- **Purpose**: Self-assessment tool for knowledge areas
- **Topics**: 20+ CLSO/CMLSO knowledge areas
- **Features**:
  - Confidence level assessment
  - Priority gap identification
  - Study recommendations
  - Overall knowledge score

### StudyPlanGenerator
- **Purpose**: Personalized study schedule creation
- **Templates**: CLSO Prep, CMLSO Prep, Refresher
- **Features**:
  - Configurable daily study time
  - Progress tracking
  - Session type variety
  - Calendar integration ready

## Design Patterns

### 1. Compound Component Pattern
Used in `ModuleContainer` with phase-specific wrappers:
```tsx
<ModuleContainer>
  <WarmUpSection>...</WarmUpSection>
  <CoreConceptSection>...</CoreConceptSection>
</ModuleContainer>
```

### 2. Context Provider Pattern
Module context for sharing state across phase sections:
```tsx
const ModuleContext = createContext<ModuleContextType>(...);
export function useModule() { ... }
```

### 3. Configurable Data Pattern
Components accept data props with sensible defaults:
```tsx
export function StandardsHierarchyVisualizer({
  data = DEFAULT_Z136_HIERARCHY,
  ...
})
```

### 4. Progressive Disclosure
Used in Z136Navigator and E146ComplianceChecker:
- Information revealed as needed
- Reduces cognitive load
- Maintains user focus

### 5. State Machine Pattern
Components like QuizEngine use phase-based state:
```tsx
type Phase = "intro" | "quiz" | "review" | "results";
const [phase, setPhase] = useState<Phase>("intro");
```

## Styling Architecture

### CSS Strategy
- Tailwind CSS for utility classes
- shadcn/ui component primitives
- Custom theme variables in globals.css
- Dark mode default

### Color Scheme
- Primary: Red (#e94560) - laser safety theme
- Success: Green (#4CAF50)
- Warning: Amber (#FFC107)
- Danger: Red (#ef4444)
- Info: Blue (#2196F3)

### Component Variants
Using class-variance-authority (CVA) for variant management:
```tsx
const buttonVariants = cva(
  "base-styles",
  { variants: { variant: { ... }, size: { ... } } }
);
```

## Accessibility

### Standards Compliance
- WCAG 2.1 AA compliance target
- Keyboard navigation support
- ARIA labels and roles
- Focus management
- Color contrast ratios

### Interactive Elements
- Focus visible states
- Keyboard shortcuts
- Screen reader announcements
- Reduced motion support

## Performance Considerations

### Optimization Strategies
- Lazy loading for heavy components
- Memoization for expensive calculations
- Virtualization for long lists (when needed)
- Image optimization

### Bundle Size
- Tree-shakeable exports
- Code splitting at route level
- Dynamic imports for modal content

## Testing Strategy

### Unit Tests
- Component rendering
- State management
- Event handling
- Props validation

### Integration Tests
- User workflows
- Cross-component communication
- Data flow verification

### E2E Tests
- Critical user paths
- Accessibility audits
- Performance benchmarks

## Future Enhancements

### Planned Features
1. Real-time collaboration on checklists
2. AI-powered study recommendations
3. Integration with calendar apps
4. Mobile app companion
5. Offline support

### Technical Debt
- Migrate remaining components to TypeScript strict mode
- Add comprehensive error boundaries
- Implement proper loading states
- Add analytics instrumentation

---

*Last Updated: March 19, 2026*
