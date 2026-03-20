/**
 * Knowledge Graph Data Loader
 * 
 * Provides utilities for loading and querying knowledge graph data,
 * semantic search, and learning path recommendations.
 */

import { promises as fs } from 'fs';
import path from 'path';
import { 
  KnowledgeGraph, 
  SemanticIndex, 
  LearningPaths,
  LearningPath,
  KnowledgeEntity,
  KnowledgeRelationship 
} from '@/types';

const KNOWLEDGE_GRAPH_DIR = path.join(process.cwd(), 'src/data/knowledge-graph');
const RESEARCH_DIR = path.join(process.cwd(), 'src/data/research');

/**
 * Load the master knowledge graph
 */
export async function getKnowledgeGraph(): Promise<KnowledgeGraph | null> {
  try {
    const filePath = path.join(KNOWLEDGE_GRAPH_DIR, 'master-graph.json');
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as KnowledgeGraph;
  } catch (error) {
    console.error('Error loading knowledge graph:', error);
    return null;
  }
}

/**
 * Load the semantic search index
 */
export async function getSemanticIndex(): Promise<SemanticIndex | null> {
  try {
    const filePath = path.join(KNOWLEDGE_GRAPH_DIR, 'semantic-index.json');
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as SemanticIndex;
  } catch (error) {
    console.error('Error loading semantic index:', error);
    return null;
  }
}

/**
 * Load learning paths
 */
export async function getLearningPaths(): Promise<LearningPaths | null> {
  try {
    const filePath = path.join(KNOWLEDGE_GRAPH_DIR, 'learning-paths.json');
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as LearningPaths;
  } catch (error) {
    console.error('Error loading learning paths:', error);
    return null;
  }
}

/**
 * Load pedagogy summary
 */
export async function getPedagogySummary(): Promise<unknown | null> {
  try {
    const filePath = path.join(RESEARCH_DIR, 'pedagogy-summary.json');
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error loading pedagogy summary:', error);
    return null;
  }
}

/**
 * Search knowledge graph entities by name or type
 */
export async function searchEntities(
  query: string,
  type?: string
): Promise<KnowledgeEntity[]> {
  const graph = await getKnowledgeGraph();
  
  if (!graph) return [];
  
  const lowerQuery = query.toLowerCase();
  
  return graph.entities.filter(entity => {
    const matchesQuery = 
      entity.name.toLowerCase().includes(lowerQuery) ||
      entity.aliases?.some(alias => 
        alias.toLowerCase().includes(lowerQuery)
      );
    
    const matchesType = type ? entity.type === type : true;
    
    return matchesQuery && matchesType;
  });
}

/**
 * Get entity by global ID
 */
export async function getEntityById(
  globalId: string
): Promise<KnowledgeEntity | null> {
  const graph = await getKnowledgeGraph();
  
  if (!graph) return null;
  
  return graph.entities.find(e => e.global_id === globalId) || null;
}

/**
 * Get related entities for a given entity
 */
export async function getRelatedEntities(
  globalId: string
): Promise<Array<{ entity: KnowledgeEntity; relationship: KnowledgeRelationship }>> {
  const graph = await getKnowledgeGraph();
  
  if (!graph) return [];
  
  const relationships = graph.relationships.filter(
    r => r.source === globalId || r.target === globalId
  );
  
  return relationships.map(rel => {
    const relatedId = rel.source === globalId ? rel.target : rel.source;
    const entity = graph.entities.find(e => e.global_id === relatedId);
    return entity ? { entity, relationship: rel } : null;
  }).filter((item): item is { entity: KnowledgeEntity; relationship: KnowledgeRelationship } => 
    item !== null
  );
}

/**
 * Semantic search using the index
 */
export async function semanticSearch(
  query: string,
  limit: number = 10
): Promise<Array<{ term: string; entities: string[]; courses: string[] }>> {
  const index = await getSemanticIndex();
  
  if (!index) return [];
  
  const lowerQuery = query.toLowerCase();
  const results: Array<{ term: string; entities: string[]; courses: string[] }> = [];
  
  // Direct term match
  for (const [term, refs] of Object.entries(index.terms)) {
    if (term.includes(lowerQuery) || lowerQuery.includes(term)) {
      const entities = refs.filter(ref => ref.startsWith('E'));
      const courses = refs.filter(ref => ref.startsWith('course-'));
      results.push({ term, entities, courses });
    }
  }
  
  // Synonym match
  for (const [canonical, synonyms] of Object.entries(index.synonyms)) {
    if (canonical.includes(lowerQuery) || synonyms.some(s => s.includes(lowerQuery))) {
      const termRefs = index.terms[canonical] || [];
      const entities = termRefs.filter(ref => ref.startsWith('E'));
      const courses = termRefs.filter(ref => ref.startsWith('course-'));
      results.push({ term: canonical, entities, courses });
    }
  }
  
  return results.slice(0, limit);
}

/**
 * Get learning path by ID
 */
export async function getLearningPathById(pathId: string) {
  const paths = await getLearningPaths();
  
  if (!paths) return null;
  
  return paths.paths.find(p => p.id === pathId) || null;
}

/**
 * Get recommended learning paths based on completed courses
 */
export async function getRecommendedPaths(
  completedCourses: string[]
): Promise<Array<{ path: LearningPath; progress: number }>> {
  const paths = await getLearningPaths();
  
  if (!paths) return [];
  
  return paths.paths.map(path => {
    const requiredCourses = path.courses
      .filter((c: { required: boolean }) => c.required)
      .map((c: { course_id: string }) => c.course_id);
    
    const completedRequired = requiredCourses.filter(id => 
      completedCourses.includes(id)
    ).length;
    
    const progress = Math.round((completedRequired / requiredCourses.length) * 100);
    
    return { path, progress };
  }).sort((a, b) => b.progress - a.progress);
}

/**
 * Get skills required for a learning path
 */
export async function getPathSkills(pathId: string): Promise<string[]> {
  const paths = await getLearningPaths();
  const path = paths?.paths.find(p => p.id === pathId);
  
  if (!path) return [];
  
  // Aggregate skills from courses in the path
  const skills = new Set<string>();
  
  for (const courseRef of path.courses) {
    // Find skills that include this course
    for (const [skill, courses] of Object.entries(paths?.skills_matrix || {})) {
      if (courses.includes(courseRef.course_id)) {
        skills.add(skill);
      }
    }
  }
  
  return Array.from(skills);
}

/**
 * Get knowledge graph statistics
 */
export async function getKnowledgeGraphStats() {
  const graph = await getKnowledgeGraph();
  const index = await getSemanticIndex();
  const paths = await getLearningPaths();
  
  if (!graph) return null;
  
  return {
    entities: {
      total: graph.total_entities,
      byType: graph.entities.reduce((acc, entity) => {
        acc[entity.type] = (acc[entity.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    },
    relationships: {
      total: graph.total_relationships,
      byType: [...new Set(graph.relationships.map(r => r.type))].length,
    },
    semanticIndex: {
      totalTerms: Object.keys(index?.terms || {}).length,
      synonymMappings: Object.keys(index?.synonyms || {}).length,
    },
    learningPaths: {
      total: paths?.paths.length || 0,
      certifications: paths?.paths.map(p => p.certification) || [],
    },
  };
}

// Re-export types
export type { 
  KnowledgeGraph, 
  SemanticIndex, 
  LearningPaths,
  KnowledgeEntity,
  KnowledgeRelationship 
};
