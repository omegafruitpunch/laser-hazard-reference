// ============================================================================
// Shared/Core Components Export
// ============================================================================

// Module Container & Phase Sections
export { 
  ModuleContainer, 
  WarmUpSection, 
  CoreConceptSection, 
  GuidedPracticeSection, 
  ChallengeSection,
  useModule 
} from "./ModuleContainer";

// Progress Tracking
export { 
  ProgressTracker, 
  type CourseProgress, 
  type ModuleProgress 
} from "./ProgressTracker";

// Quiz Engine
export { 
  QuizEngine, 
  type QuizConfig, 
  type QuizQuestion, 
  type QuizResult,
  type QuizHint,
  type QuestionType 
} from "./QuizEngine";

// Hint System
export { 
  HintSystem, 
  ProgressiveHint, 
  ContextualHint,
  type Hint, 
  type HintLevel 
} from "./HintSystem";

// Completion Badges
export { 
  CompletionBadge, 
  BadgeCollection, 
  BadgeEarnedCelebration,
  type BadgeConfig, 
  type BadgeTier, 
  type BadgeType 
} from "./CompletionBadge";

// Content Flow Components (Added by UI Review Agent C)
export { default as ModuleIntroCard } from "./ModuleIntroCard";
export { default as InlineKnowledgeCheck } from "./InlineKnowledgeCheck";
export { 
  default as SectionNavigation, 
  useSectionNavigation,
  type Section 
} from "./SectionNavigation";
export { 
  default as ConceptBridge, 
  ModulePrerequisites 
} from "./ConceptBridge";
