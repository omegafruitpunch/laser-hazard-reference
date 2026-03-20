// Type definitions for Module 4.1: California & Colorado State Regulations

export interface ModulePhase {
  id: string;
  title: string;
  duration: number; // minutes
  type: 'warmup' | 'core' | 'practice' | 'challenge';
  description: string;
  interactive_element?: InteractiveElement;
  content_sections?: ContentSection[];
}

export interface ContentSection {
  title: string;
  content: string;
  key_points: string[];
}

export type InteractiveElement =
  | ScenarioMapper
  | InteractiveMap
  | StateComparator
  | DecisionTree
  | TimelineVisualizer
  | ScenarioChallenge;

export interface ScenarioMapper {
  type: 'scenario_mapper';
  id: string;
  prompt: string;
  locations: LocationRequirement[];
  feedback: {
    correct_understanding: string;
    key_insight: string;
  };
}

export interface LocationRequirement {
  name: string;
  state: string;
  jurisdictions: string[];
  requirements: string[];
}

export interface InteractiveMap {
  type: 'interactive_map';
  id: string;
  title: string;
  layers: RegulatoryLayer[];
}

export interface RegulatoryLayer {
  name: string;
  applies_to: string;
  requirements: string[];
}

export interface StateComparator {
  type: 'state_comparator';
  id: string;
  title: string;
  categories: ComparisonCategory[];
}

export interface ComparisonCategory {
  name: string;
  california: string;
  colorado: string;
  note: string;
}

export interface DecisionTree {
  type: 'decision_tree';
  id: string;
  title: string;
  questions: DecisionQuestion[];
  results: { [key: string]: PermitResult };
}

export interface DecisionQuestion {
  id: string;
  question: string;
  options: DecisionOption[];
}

export interface DecisionOption {
  label: string;
  next: string;
}

export interface PermitResult {
  title: string;
  permits: string[];
  timeline: string;
  contact?: string;
  note?: string;
}

export interface TimelineVisualizer {
  type: 'timeline_visualizer';
  id: string;
  scenarios: TimelineScenario[];
}

export interface TimelineScenario {
  name: string;
  total_weeks: number;
  events: TimelineEvent[];
}

export interface TimelineEvent {
  week: number;
  milestone: string;
  action: string;
}

export interface ScenarioChallenge {
  type: 'scenario_challenge';
  id: string;
  title: string;
  scenario: string;
  questions: ChallengeQuestion[];
  badge: {
    name: string;
    description: string;
    icon: string;
  };
}

export interface ChallengeQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface QuizQuestion {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'scenario';
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options?: string[];
  correct_answer?: number;
  correct_answer_boolean?: boolean;
  scenario?: string;
  explanation: string;
}

export interface ModuleResource {
  title: string;
  url: string;
  type: 'official' | 'regulation' | 'guidance';
}

export interface StateModule {
  module_id: string;
  module_title: string;
  course: string;
  states_covered: string[];
  estimated_duration_minutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  learning_objectives: string[];
  prerequisites: string[];
  phases: ModulePhase[];
  quiz_questions: QuizQuestion[];
  key_takeaways: string[];
  resources: ModuleResource[];
  metadata: {
    version: string;
    created_date: string;
    author: string;
    review_status: string;
  };
}
