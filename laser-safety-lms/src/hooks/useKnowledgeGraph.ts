'use client';

import { useState, useEffect, useCallback } from 'react';
import { KnowledgeGraph, KnowledgeNode, KnowledgeEdge, MasteryLevel } from '@/types/lms';
import { getKnowledgeGraph, queryKnowledgeGraph } from '@/lib/data/knowledgeGraphClient';

interface UseKnowledgeGraphReturn {
  graph: KnowledgeGraph | null;
  isLoading: boolean;
  error: Error | null;
  getNodeById: (nodeId: string) => KnowledgeNode | undefined;
  getRelatedNodes: (nodeId: string) => KnowledgeNode[];
  getPrerequisites: (nodeId: string) => KnowledgeNode[];
  getNodesByMastery: (level: MasteryLevel) => KnowledgeNode[];
  getNodesByCourse: (courseId: string) => KnowledgeNode[];
  searchNodes: (query: string) => KnowledgeNode[];
  refresh: () => Promise<void>;
}

/**
 * Hook for accessing and querying the knowledge graph
 * 
 * @returns Knowledge graph data and query functions
 * 
 * @example
 * ```tsx
 * function KnowledgeMap() {
 *   const { graph, getRelatedNodes, isLoading } = useKnowledgeGraph();
 *   const [selectedNode, setSelectedNode] = useState<string | null>(null);
 *   
 *   const relatedNodes = selectedNode ? getRelatedNodes(selectedNode) : [];
 *   
 *   return (
 *     <div>
 *       <GraphVisualization nodes={graph?.nodes} edges={graph?.edges} />
 *       <RelatedNodesPanel nodes={relatedNodes} />
 *     </div>
 *   );
 * }
 * ```
 */
export function useKnowledgeGraph(): UseKnowledgeGraphReturn {
  const [graph, setGraph] = useState<KnowledgeGraph | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadGraph = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getKnowledgeGraph();
      setGraph(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load knowledge graph'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGraph();
  }, [loadGraph]);

  const getNodeById = useCallback((nodeId: string): KnowledgeNode | undefined => {
    return graph?.nodes.find(node => node.id === nodeId);
  }, [graph]);

  const getRelatedNodes = useCallback((nodeId: string): KnowledgeNode[] => {
    if (!graph) return [];
    
    const relatedIds = graph.edges
      .filter(edge => edge.source === nodeId || edge.target === nodeId)
      .map(edge => edge.source === nodeId ? edge.target : edge.source);
    
    return graph.nodes.filter(node => relatedIds.includes(node.id));
  }, [graph]);

  const getPrerequisites = useCallback((nodeId: string): KnowledgeNode[] => {
    if (!graph) return [];
    
    const node = graph.nodes.find(n => n.id === nodeId);
    if (!node) return [];
    
    return graph.nodes.filter(n => node.prerequisites.includes(n.id));
  }, [graph]);

  const getNodesByMastery = useCallback((level: MasteryLevel): KnowledgeNode[] => {
    return graph?.nodes.filter(node => node.masteryLevel === level) || [];
  }, [graph]);

  const getNodesByCourse = useCallback((courseId: string): KnowledgeNode[] => {
    return graph?.nodes.filter(node => node.courses.includes(courseId)) || [];
  }, [graph]);

  const searchNodes = useCallback((query: string): KnowledgeNode[] => {
    if (!query.trim() || !graph) return [];
    
    const lowerQuery = query.toLowerCase();
    return graph.nodes.filter(node => 
      node.name.toLowerCase().includes(lowerQuery) ||
      node.description.toLowerCase().includes(lowerQuery)
    );
  }, [graph]);

  return {
    graph,
    isLoading,
    error,
    getNodeById,
    getRelatedNodes,
    getPrerequisites,
    getNodesByMastery,
    getNodesByCourse,
    searchNodes,
    refresh: loadGraph,
  };
}
