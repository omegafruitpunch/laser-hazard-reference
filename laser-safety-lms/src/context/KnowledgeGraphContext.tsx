'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { KnowledgeGraph, KnowledgeNode, KnowledgeEdge, MasteryLevel } from '@/types/lms';
import { getKnowledgeGraph, queryKnowledgeGraph } from '@/lib/data/knowledgeGraphClient';

interface KnowledgeGraphContextState {
  graph: KnowledgeGraph | null;
  isLoading: boolean;
  error: Error | null;
  
  // Query functions
  getNodeById: (nodeId: string) => KnowledgeNode | undefined;
  getRelatedNodes: (nodeId: string) => KnowledgeNode[];
  getPrerequisites: (nodeId: string) => KnowledgeNode[];
  getNodesByMastery: (level: MasteryLevel) => KnowledgeNode[];
  getNodesByCourse: (courseId: string) => KnowledgeNode[];
  searchNodes: (query: string) => KnowledgeNode[];
  getNodesByType: (type: string) => KnowledgeNode[];
  
  // Update functions
  updateNodeMastery: (nodeId: string, masteryLevel: MasteryLevel) => void;
  
  // Refresh
  refresh: () => Promise<void>;
}

const KnowledgeGraphContext = createContext<KnowledgeGraphContextState | undefined>(undefined);

interface KnowledgeGraphProviderProps {
  children: ReactNode;
}

/**
 * Knowledge Graph Context Provider
 * 
 * Provides global access to the knowledge graph for visualizing
 * learning dependencies and tracking concept mastery.
 * 
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <KnowledgeGraphProvider>
 *       <YourApp />
 *     </KnowledgeGraphProvider>
 *   );
 * }
 * 
 * function KnowledgeExplorer() {
 *   const { graph, getRelatedNodes, getPrerequisites } = useKnowledgeGraphContext();
 *   
 *   return (
 *     <div>
 *       <GraphVisualization nodes={graph?.nodes} edges={graph?.edges} />
 *     </div>
 *   );
 * }
 * ```
 */
export function KnowledgeGraphProvider({ children }: KnowledgeGraphProviderProps) {
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

  const getNodesByType = useCallback((type: string): KnowledgeNode[] => {
    return graph?.nodes.filter(node => node.type === type) || [];
  }, [graph]);

  const updateNodeMastery = useCallback((nodeId: string, masteryLevel: MasteryLevel) => {
    setGraph(prev => {
      if (!prev) return null;
      
      const updatedNodes = prev.nodes.map(node => 
        node.id === nodeId ? { ...node, masteryLevel } : node
      );
      
      const updated: KnowledgeGraph = {
        ...prev,
        nodes: updatedNodes,
        lastUpdated: new Date().toISOString(),
      };
      
      // Persist to storage
      localStorage.setItem('laser-lms-knowledge-graph', JSON.stringify(updated));
      
      return updated;
    });
  }, []);

  const value: KnowledgeGraphContextState = {
    graph,
    isLoading,
    error,
    getNodeById,
    getRelatedNodes,
    getPrerequisites,
    getNodesByMastery,
    getNodesByCourse,
    searchNodes,
    getNodesByType,
    updateNodeMastery,
    refresh: loadGraph,
  };

  return (
    <KnowledgeGraphContext.Provider value={value}>
      {children}
    </KnowledgeGraphContext.Provider>
  );
}

/**
 * Hook to access the KnowledgeGraphContext
 * 
 * @throws Error if used outside of KnowledgeGraphProvider
 */
export function useKnowledgeGraphContext(): KnowledgeGraphContextState {
  const context = useContext(KnowledgeGraphContext);
  if (context === undefined) {
    throw new Error('useKnowledgeGraphContext must be used within a KnowledgeGraphProvider');
  }
  return context;
}
