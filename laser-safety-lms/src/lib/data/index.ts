/**
 * Data Layer Exports
 * 
 * Centralized exports for all data loading utilities.
 */

// Course data
export {
  getAllCourseIds,
  getCourseById,
  getAllCourses,
  getCoursesByCategory,
  getCoursesByDifficulty,
  getCoursesByPrerequisite,
  searchCourses,
  getCourseStats,
  type Course,
} from './courseData';

// Module data
export {
  getAllModuleIds,
  getModuleById,
  getModulesByCourseId,
  getModulesByIds,
  getNextModule,
  getPreviousModule,
  getModuleStats,
  searchModules,
  validatePrerequisites,
  type Module,
} from './moduleData';

// Quiz data
export {
  getAllQuizBankIds,
  getQuizBankById,
  getQuizByCourseId,
  getQuizByModuleId,
  getQuestionById,
  getRandomQuestions,
  calculateScore,
  getQuizStats,
  validateQuizAnswers,
  type QuizBank,
  type QuizQuestion,
} from './quizData';

// Knowledge graph data
export {
  getKnowledgeGraph,
  getSemanticIndex,
  getLearningPaths,
  getPedagogySummary,
  searchEntities,
  getEntityById,
  getRelatedEntities,
  semanticSearch,
  getLearningPathById,
  getRecommendedPaths,
  getPathSkills,
  getKnowledgeGraphStats,
  type KnowledgeGraph,
  type SemanticIndex,
  type LearningPaths,
  type KnowledgeEntity,
  type KnowledgeRelationship,
} from './knowledgeGraphData';
