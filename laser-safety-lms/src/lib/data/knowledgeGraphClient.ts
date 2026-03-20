/**
 * Knowledge Graph Client
 * 
 * Handles queries and updates to the knowledge graph for tracking
 * learning dependencies and concept relationships.
 */

import { 
  KnowledgeGraph, 
  KnowledgeNode, 
  KnowledgeEdge, 
  MasteryLevel, 
  LearningPath,
  GapAnalysis,
  GapRecommendation,
  KnowledgeGap
} from '@/types/lms';
import { courses } from '@/data/courses';

const STORAGE_KEY = 'laser-lms-knowledge-graph';
const PATHS_STORAGE_KEY = 'laser-lms-learning-paths';

// Sample knowledge graph data
const DEFAULT_KNOWLEDGE_GRAPH: KnowledgeGraph = {
  nodes: [
    // Core Concepts
    { 
      id: 'concept-laser-basics', 
      type: 'concept', 
      name: 'Laser Fundamentals', 
      description: 'Basic principles of laser operation and properties',
      difficulty: 'Beginner',
      courses: ['course-1'],
      modules: ['c1-m1'],
      prerequisites: [],
      relatedNodes: ['concept-coherence', 'concept-wavelength'],
      learningOutcomes: ['Understand laser properties', 'Identify laser components'],
      resources: [],
      masteryLevel: 'unknown',
      position: { x: 0, y: 0, layer: 0 }
    },
    { 
      id: 'concept-coherence', 
      type: 'concept', 
      name: 'Coherence', 
      description: 'Temporal and spatial coherence in lasers',
      difficulty: 'Intermediate',
      courses: ['course-1'],
      modules: ['c1-m1'],
      prerequisites: ['concept-laser-basics'],
      relatedNodes: ['concept-interference'],
      learningOutcomes: ['Understand coherence properties'],
      resources: [],
      masteryLevel: 'unknown',
      position: { x: 100, y: 0, layer: 1 }
    },
    { 
      id: 'concept-wavelength', 
      type: 'concept', 
      name: 'Wavelength & Color', 
      description: 'Laser wavelengths and visible spectrum',
      difficulty: 'Beginner',
      courses: ['course-1', 'course-3'],
      modules: ['c1-m1', 'c3-m1'],
      prerequisites: [],
      relatedNodes: ['concept-laser-basics', 'calculation-mpe'],
      learningOutcomes: ['Identify wavelengths', 'Understand color perception'],
      resources: [],
      masteryLevel: 'unknown',
      position: { x: -100, y: 0, layer: 1 }
    },
    
    // Classification
    { 
      id: 'concept-classification', 
      type: 'concept', 
      name: 'Laser Classification', 
      description: 'Laser hazard classes 1 through 4',
      difficulty: 'Beginner',
      courses: ['course-1'],
      modules: ['c1-m2'],
      prerequisites: ['concept-laser-basics'],
      relatedNodes: ['concept-hazards', 'regulation-fda'],
      learningOutcomes: ['Classify lasers', 'Understand class requirements'],
      resources: [],
      masteryLevel: 'unknown',
      position: { x: 0, y: 100, layer: 1 }
    },
    
    // Hazards
    { 
      id: 'concept-hazards', 
      type: 'hazard', 
      name: 'Ocular Hazards', 
      description: 'Eye injury risks from laser exposure',
      difficulty: 'Intermediate',
      courses: ['course-1', 'course-3'],
      modules: ['c1-m1', 'c3-m1'],
      prerequisites: ['concept-wavelength'],
      relatedNodes: ['concept-mpe', 'safety-eyewear'],
      learningOutcomes: ['Identify eye hazards', 'Understand injury mechanisms'],
      resources: [],
      masteryLevel: 'unknown',
      position: { x: -100, y: 100, layer: 2 }
    },
    { 
      id: 'concept-skin-hazards', 
      type: 'hazard', 
      name: 'Skin Hazards', 
      description: 'Skin burn and photochemical risks',
      difficulty: 'Intermediate',
      courses: ['course-3'],
      modules: ['c3-m2'],
      prerequisites: ['concept-wavelength'],
      relatedNodes: ['concept-hazards'],
      learningOutcomes: ['Identify skin hazards', 'Understand thermal effects'],
      resources: [],
      masteryLevel: 'unknown',
      position: { x: -150, y: 150, layer: 2 }
    },
    
    // Calculations
    { 
      id: 'calculation-mpe', 
      type: 'calculation', 
      name: 'MPE Calculations', 
      description: 'Maximum Permissible Exposure calculations',
      difficulty: 'Advanced',
      courses: ['course-1', 'course-3'],
      modules: ['c1-m4', 'c3-m4'],
      prerequisites: ['concept-wavelength', 'concept-hazards'],
      relatedNodes: ['calculation-nohd'],
      learningOutcomes: ['Calculate MPE values', 'Apply correction factors'],
      resources: [],
      masteryLevel: 'unknown',
      position: { x: 100, y: 100, layer: 2 }
    },
    { 
      id: 'calculation-nohd', 
      type: 'calculation', 
      name: 'NOHD Calculations', 
      description: 'Nominal Ocular Hazard Distance',
      difficulty: 'Advanced',
      courses: ['course-1'],
      modules: ['c1-m4'],
      prerequisites: ['calculation-mpe'],
      relatedNodes: ['safety-zones'],
      learningOutcomes: ['Calculate NOHD', 'Determine safety zones'],
      resources: [],
      masteryLevel: 'unknown',
      position: { x: 150, y: 150, layer: 3 }
    },
    
    // Regulations
    { 
      id: 'regulation-fda', 
      type: 'regulation', 
      name: 'FDA Regulations', 
      description: '21 CFR 1040 and variance requirements',
      difficulty: 'Intermediate',
      courses: ['course-2'],
      modules: ['c2-m1', 'c2-m2'],
      prerequisites: ['concept-classification'],
      relatedNodes: ['regulation-variances'],
      learningOutcomes: ['Understand FDA requirements', 'File variance applications'],
      resources: [],
      masteryLevel: 'unknown',
      position: { x: 0, y: 200, layer: 2 }
    },
    { 
      id: 'regulation-variances', 
      type: 'regulation', 
      name: 'Variances', 
      description: 'FDA variance application process',
      difficulty: 'Intermediate',
      courses: ['course-2'],
      modules: ['c2-m2'],
      prerequisites: ['regulation-fda'],
      relatedNodes: ['regulation-ln50'],
      learningOutcomes: ['Apply for variances', 'Understand conditions'],
      resources: [],
      masteryLevel: 'unknown',
      position: { x: 50, y: 250, layer: 3 }
    },
    
    // Safety Procedures
    { 
      id: 'safety-eyewear', 
      type: 'safety-procedure', 
      name: 'Protective Eyewear', 
      description: 'Laser safety eyewear selection and use',
      difficulty: 'Intermediate',
      courses: ['course-3'],
      modules: ['c3-m5'],
      prerequisites: ['concept-hazards', 'calculation-od'],
      relatedNodes: ['safety-controls'],
      learningOutcomes: ['Select appropriate eyewear', 'Verify OD ratings'],
      resources: [],
      masteryLevel: 'unknown',
      position: { x: -50, y: 250, layer: 3 }
    },
    { 
      id: 'safety-controls', 
      type: 'safety-procedure', 
      name: 'Engineering Controls', 
      description: 'Interlocks, barriers, and warning systems',
      difficulty: 'Intermediate',
      courses: ['course-1'],
      modules: ['c1-m5'],
      prerequisites: ['concept-classification'],
      relatedNodes: ['safety-zones', 'safety-eyewear'],
      learningOutcomes: ['Implement controls', 'Design safe systems'],
      resources: [],
      masteryLevel: 'unknown',
      position: { x: -100, y: 300, layer: 3 }
    },
    { 
      id: 'safety-zones', 
      type: 'safety-procedure', 
      name: 'Controlled Areas', 
      description: 'Laser control area establishment',
      difficulty: 'Advanced',
      courses: ['course-1', 'course-6'],
      modules: ['c1-m5', 'c6-m4'],
      prerequisites: ['calculation-nohd', 'safety-controls'],
      relatedNodes: ['procedure-sops'],
      learningOutcomes: ['Establish LCAs', 'Post warnings'],
      resources: [],
      masteryLevel: 'unknown',
      position: { x: 0, y: 350, layer: 4 }
    },
    
    // Standards
    { 
      id: 'standard-ansi', 
      type: 'standard', 
      name: 'ANSI Z136.1', 
      description: 'American National Standard for Safe Use of Lasers',
      difficulty: 'Intermediate',
      courses: ['course-8'],
      modules: ['c8-m1'],
      prerequisites: ['concept-hazards', 'calculation-mpe'],
      relatedNodes: ['standard-esta'],
      learningOutcomes: ['Apply ANSI standards', 'Reference MPE tables'],
      resources: [],
      masteryLevel: 'unknown',
      position: { x: 200, y: 200, layer: 3 }
    },
    { 
      id: 'standard-iec', 
      type: 'standard', 
      name: 'IEC 60825-1', 
      description: 'International laser safety standard',
      difficulty: 'Intermediate',
      courses: ['course-3', 'course-5'],
      modules: ['c3-m3', 'c5-m6'],
      prerequisites: ['concept-classification'],
      relatedNodes: ['standard-ansi'],
      learningOutcomes: ['Understand IEC standards', 'Compare with ANSI'],
      resources: [],
      masteryLevel: 'unknown',
      position: { x: 250, y: 150, layer: 3 }
    },
  ],
  edges: [
    { id: 'edge-1', source: 'concept-laser-basics', target: 'concept-coherence', type: 'related', strength: 0.8 },
    { id: 'edge-2', source: 'concept-laser-basics', target: 'concept-wavelength', type: 'related', strength: 0.9 },
    { id: 'edge-3', source: 'concept-laser-basics', target: 'concept-classification', type: 'builds-on', strength: 0.9 },
    { id: 'edge-4', source: 'concept-classification', target: 'concept-hazards', type: 'builds-on', strength: 0.8 },
    { id: 'edge-5', source: 'concept-wavelength', target: 'concept-hazards', type: 'builds-on', strength: 0.9 },
    { id: 'edge-6', source: 'concept-hazards', target: 'calculation-mpe', type: 'prerequisite', strength: 1.0 },
    { id: 'edge-7', source: 'calculation-mpe', target: 'calculation-nohd', type: 'prerequisite', strength: 1.0 },
    { id: 'edge-8', source: 'concept-classification', target: 'regulation-fda', type: 'builds-on', strength: 0.7 },
    { id: 'edge-9', source: 'regulation-fda', target: 'regulation-variances', type: 'prerequisite', strength: 0.9 },
    { id: 'edge-10', source: 'concept-hazards', target: 'safety-eyewear', type: 'builds-on', strength: 0.8 },
    { id: 'edge-11', source: 'concept-classification', target: 'safety-controls', type: 'builds-on', strength: 0.8 },
    { id: 'edge-12', source: 'calculation-nohd', target: 'safety-zones', type: 'prerequisite', strength: 1.0 },
    { id: 'edge-13', source: 'safety-controls', target: 'safety-zones', type: 'builds-on', strength: 0.9 },
    { id: 'edge-14', source: 'concept-hazards', target: 'standard-ansi', type: 'applies-to', strength: 0.7 },
  ],
  userId: 'anonymous',
  lastUpdated: new Date().toISOString(),
};

// Default learning paths
const DEFAULT_LEARNING_PATHS: LearningPath[] = [
  {
    id: 'path-lso-certification',
    name: 'Laser Safety Officer Certification',
    description: 'Complete training path for LSO certification',
    targetCertification: 'Certified Laser Safety Officer',
    targetRole: 'LSO',
    difficulty: 'Advanced',
    estimatedDays: 30,
    courses: [
      { courseId: 'course-1', order: 1, required: true },
      { courseId: 'course-3', order: 2, required: true },
      { courseId: 'course-2', order: 3, required: true },
      { courseId: 'course-8', order: 4, required: true },
    ],
    milestones: [
      { 
        id: 'milestone-fundamentals', 
        name: 'Fundamentals Mastered', 
        description: 'Complete Laser Safety Fundamentals',
        criteria: { type: 'courses-complete', threshold: 1 }
      },
      { 
        id: 'milestone-technical', 
        name: 'Technical Knowledge', 
        description: 'Complete biological hazards course',
        criteria: { type: 'courses-complete', threshold: 2 }
      },
      { 
        id: 'milestone-certified', 
        name: 'LSO Ready', 
        description: 'Complete all required courses',
        criteria: { type: 'courses-complete', threshold: 4 }
      },
    ],
    prerequisites: [],
    recommendedFor: ['safety-professional', 'technician', 'operator'],
  },
  {
    id: 'path-operator',
    name: 'Laser Operator Training',
    description: 'Essential training for laser operators',
    targetRole: 'Operator',
    difficulty: 'Beginner',
    estimatedDays: 14,
    courses: [
      { courseId: 'course-1', order: 1, required: true },
      { courseId: 'course-7', order: 2, required: true },
    ],
    milestones: [
      { 
        id: 'milestone-basics', 
        name: 'Safety Basics', 
        description: 'Complete fundamentals',
        criteria: { type: 'courses-complete', threshold: 1 }
      },
      { 
        id: 'milestone-qualified', 
        name: 'Qualified Operator', 
        description: 'Complete all operator training',
        criteria: { type: 'courses-complete', threshold: 2 }
      },
    ],
    prerequisites: [],
    recommendedFor: ['operator', 'technician'],
  },
];

/**
 * Get the knowledge graph
 */
export async function getKnowledgeGraph(): Promise<KnowledgeGraph> {
  // Try to load from localStorage first
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Return default graph
  return DEFAULT_KNOWLEDGE_GRAPH;
}

/**
 * Save knowledge graph
 */
export async function saveKnowledgeGraph(graph: KnowledgeGraph): Promise<void> {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(graph));
}

/**
 * Query knowledge graph
 */
export async function queryKnowledgeGraph(
  query: { type?: string; courseId?: string; masteryLevel?: MasteryLevel }
): Promise<KnowledgeNode[]> {
  const graph = await getKnowledgeGraph();
  
  return graph.nodes.filter(node => {
    if (query.type && node.type !== query.type) return false;
    if (query.courseId && !node.courses.includes(query.courseId)) return false;
    if (query.masteryLevel && node.masteryLevel !== query.masteryLevel) return false;
    return true;
  });
}

/**
 * Update node mastery level
 */
export async function updateNodeMastery(nodeId: string, masteryLevel: MasteryLevel): Promise<void> {
  const graph = await getKnowledgeGraph();
  
  const updatedNodes = graph.nodes.map(node => 
    node.id === nodeId ? { ...node, masteryLevel } : node
  );
  
  await saveKnowledgeGraph({
    ...graph,
    nodes: updatedNodes,
    lastUpdated: new Date().toISOString(),
  });
}

/**
 * Get learning paths
 */
export async function getLearningPaths(): Promise<LearningPath[]> {
  const stored = localStorage.getItem(PATHS_STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return DEFAULT_LEARNING_PATHS;
}

/**
 * Get a specific learning path
 */
export async function getLearningPath(pathId: string): Promise<LearningPath | null> {
  const paths = await getLearningPaths();
  return paths.find(p => p.id === pathId) || null;
}

/**
 * Get path progress
 */
export async function getPathProgress(pathId: string): Promise<{
  completedCourses: number;
  totalCourses: number;
  milestonesEarned: string[];
}> {
  const path = await getLearningPath(pathId);
  if (!path) {
    return { completedCourses: 0, totalCourses: 0, milestonesEarned: [] };
  }

  // This would typically check actual course progress
  // For now, return mock data
  return {
    completedCourses: 0,
    totalCourses: path.courses.length,
    milestonesEarned: [],
  };
}

/**
 * Perform gap analysis
 */
export async function performGapAnalysis(targetCertification: string): Promise<GapAnalysis> {
  const graph = await getKnowledgeGraph();
  
  // Define required knowledge for certifications
  const certificationRequirements: Record<string, string[]> = {
    'Certified Laser Safety Officer': [
      'concept-laser-basics',
      'concept-classification',
      'concept-hazards',
      'calculation-mpe',
      'calculation-nohd',
      'regulation-fda',
      'safety-controls',
      'safety-zones',
      'standard-ansi',
    ],
    'Laser Operator': [
      'concept-laser-basics',
      'concept-classification',
      'safety-controls',
    ],
  };
  
  const required = certificationRequirements[targetCertification] || [];
  const requiredNodes = graph.nodes.filter(n => required.includes(n.id));
  
  // Identify gaps
  const gaps: KnowledgeGap[] = requiredNodes
    .filter(node => node.masteryLevel === 'unknown' || node.masteryLevel === 'exposure')
    .map(node => ({
      nodeId: node.id,
      name: node.name,
      requiredLevel: 'proficient',
      currentLevel: node.masteryLevel,
      priority: node.type === 'hazard' ? 'high' : node.type === 'calculation' ? 'medium' : 'low',
      relatedCourses: node.courses,
    }));

  // Generate recommendations
  const recommendations: GapRecommendation[] = gaps.slice(0, 5).map(gap => ({
    type: gap.currentLevel === 'unknown' ? 'course' : 'review',
    id: gap.relatedCourses[0] || '',
    title: `Learn: ${gap.name}`,
    reason: `Required for ${targetCertification}`,
    estimatedTime: 60,
    priority: gap.priority,
  }));

  return {
    userId: 'anonymous',
    targetCertification,
    completedAt: new Date().toISOString(),
    currentKnowledge: graph.nodes
      .filter(n => n.masteryLevel !== 'unknown')
      .map(n => ({ nodeId: n.id, name: n.name, masteryLevel: n.masteryLevel })),
    requiredKnowledge: requiredNodes.map(n => ({ 
      nodeId: n.id, 
      name: n.name, 
      masteryLevel: 'proficient' 
    })),
    gaps,
    recommendations,
  };
}

/**
 * Get personalized recommendations
 */
export async function getRecommendations(userId: string): Promise<GapRecommendation[]> {
  const graph = await getKnowledgeGraph();
  const paths = await getLearningPaths();
  
  const recommendations: GapRecommendation[] = [];
  
  // Find nodes that need attention (low mastery)
  const weakAreas = graph.nodes.filter(n => 
    n.masteryLevel === 'unknown' || n.masteryLevel === 'exposure'
  );
  
  // Recommend courses covering weak areas
  const recommendedCourseIds = new Set<string>();
  weakAreas.forEach(node => {
    node.courses.forEach(courseId => {
      if (!recommendedCourseIds.has(courseId)) {
        recommendedCourseIds.add(courseId);
        const course = courses.find(c => c.id === courseId);
        if (course) {
          recommendations.push({
            id: `rec-course-${courseId}`,
            type: 'next-course',
            course,
            title: course.title,
            description: course.description,
            priority: node.type === 'hazard' ? 'high' : 'medium',
            reason: `Covers ${node.name} which needs attention`,
            estimatedTime: course.totalMinutes,
          });
        }
      }
    });
  });
  
  // Recommend learning paths
  paths.forEach(path => {
    recommendations.push({
      id: `rec-path-${path.id}`,
      type: 'exploration',
      title: path.name,
      description: path.description,
      priority: 'low',
      reason: `Complete ${path.targetRole} training`,
      estimatedTime: path.estimatedDays * 60,
    });
  });
  
  return recommendations.slice(0, 10);
}

/**
 * Find learning path between two nodes
 */
export async function findLearningPath(
  fromNodeId: string, 
  toNodeId: string
): Promise<KnowledgeNode[] | null> {
  const graph = await getKnowledgeGraph();
  
  // Simple BFS to find path
  const queue: Array<{ nodeId: string; path: string[] }> = [{ nodeId: fromNodeId, path: [fromNodeId] }];
  const visited = new Set<string>();
  
  while (queue.length > 0) {
    const { nodeId, path } = queue.shift()!;
    
    if (nodeId === toNodeId) {
      return path.map(id => graph.nodes.find(n => n.id === id)!).filter(Boolean);
    }
    
    if (visited.has(nodeId)) continue;
    visited.add(nodeId);
    
    // Find neighbors through edges
    const neighbors = graph.edges
      .filter(e => e.source === nodeId)
      .map(e => e.target);
    
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        queue.push({ nodeId: neighbor, path: [...path, neighbor] });
      }
    }
  }
  
  return null;
}
