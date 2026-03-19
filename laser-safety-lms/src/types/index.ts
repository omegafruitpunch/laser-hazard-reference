export interface Module {
  id: string;
  title: string;
  description: string;
  pdfPath: string;
  keyTakeaways: string[];
  estimatedMinutes: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  modules: Module[];
  totalMinutes: number;
  coverColor: string;
  icon: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CourseProgress {
  completedModules: string[];
  quizScore?: number;
  quizPassed?: boolean;
  completedAt?: string;
}

export interface UserProgress {
  [courseId: string]: CourseProgress;
}
