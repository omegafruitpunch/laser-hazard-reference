"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Command,
  BookOpen,
  FileText,
  GraduationCap,
  Lightbulb,
  Clock,
  ChevronRight,
  Hash,
  ArrowRight,
  Sparkles,
  History,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { courses } from "@/data/courses";
import { Course, Module } from "@/types";
import { Button } from "@/components/ui/button";

interface SearchResult {
  id: string;
  type: "course" | "module" | "topic" | "key-concept";
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  course?: Course;
  module?: Module;
  relevance: number;
  tags?: string[];
}

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const recentSearches: string[] = [];

const popularSearches = [
  "Laser classification",
  "FDA variance",
  "NOHD calculation",
  "Eye safety",
  "ANSI Z136",
];

// Build search index from courses
function buildSearchIndex(): SearchResult[] {
  const results: SearchResult[] = [];

  courses.forEach((course) => {
    // Add course
    results.push({
      id: course.id,
      type: "course",
      title: course.title,
      description: course.description,
      href: `/courses/${course.id}`,
      icon: <span className="text-lg">{course.icon}</span>,
      course,
      relevance: 1,
      tags: [course.category, course.difficulty],
    });

    // Add modules
    course.modules.forEach((module) => {
      results.push({
        id: module.id,
        type: "module",
        title: module.title,
        description: module.description,
        href: `/courses/${course.id}/${module.id}`,
        icon: <FileText className="w-4 h-4" />,
        course,
        module,
        relevance: 0.8,
      });

      // Add key takeaways as topics
      module.keyTakeaways.forEach((takeaway, index) => {
        results.push({
          id: `${module.id}-topic-${index}`,
          type: "topic",
          title: takeaway.substring(0, 60) + (takeaway.length > 60 ? "..." : ""),
          description: `From: ${module.title}`,
          href: `/courses/${course.id}/${module.id}`,
          icon: <Lightbulb className="w-4 h-4" />,
          course,
          module,
          relevance: 0.6,
        });
      });
    });
  });

  // Add key concepts
  const keyConcepts = [
    { term: "NOHD", description: "Nominal Ocular Hazard Distance", tags: ["safety", "calculation"] },
    { term: "MPE", description: "Maximum Permissible Exposure", tags: ["safety", "limits"] },
    { term: "OD", description: "Optical Density", tags: ["eyewear", "protection"] },
    { term: "IEC 60825", description: "International laser safety standard", tags: ["standards", "IEC"] },
    { term: "ANSI Z136", description: "US laser safety standard", tags: ["standards", "ANSI"] },
    { term: "Laser Class 4", description: "High power laser classification", tags: ["classification", "hazard"] },
    { term: "Laser Notice 50", description: "FDA audience scanning guidance", tags: ["FDA", "entertainment"] },
    { term: "NOTAM", description: "Notice to Air Missions", tags: ["FAA", "outdoor"] },
    { term: "Variance", description: "FDA variance for entertainment lasers", tags: ["FDA", "compliance"] },
    { term: "LSO", description: "Laser Safety Officer", tags: ["roles", "safety"] },
  ];

  keyConcepts.forEach((concept) => {
    results.push({
      id: `concept-${concept.term}`,
      type: "key-concept",
      title: concept.term,
      description: concept.description,
      href: `/courses`, // Link to courses for now
      icon: <Hash className="w-4 h-4" />,
      relevance: 0.9,
      tags: concept.tags,
    });
  });

  return results;
}

const searchIndex = buildSearchIndex();

function calculateRelevance(query: string, result: SearchResult): number {
  const queryLower = query.toLowerCase();
  const titleLower = result.title.toLowerCase();
  const descLower = result.description.toLowerCase();
  const tagsLower = result.tags?.join(" ").toLowerCase() || "";

  let score = result.relevance;

  // Exact match in title
  if (titleLower === queryLower) score += 2;
  // Title starts with query
  else if (titleLower.startsWith(queryLower)) score += 1.5;
  // Title contains query
  else if (titleLower.includes(queryLower)) score += 1;

  // Description contains query
  if (descLower.includes(queryLower)) score += 0.5;

  // Tags contain query
  if (tagsLower.includes(queryLower)) score += 0.8;

  // Word boundary matches
  const words = queryLower.split(/\s+/);
  const titleWords = titleLower.split(/\s+/);
  words.forEach((word) => {
    if (titleWords.some((tw) => tw.startsWith(word))) score += 0.3;
  });

  return score;
}

function SearchResultItem({
  result,
  isSelected,
  onSelect,
}: {
  result: SearchResult;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const router = useRouter();

  const handleClick = () => {
    router.push(result.href);
    onSelect();
  };

  const typeLabels = {
    course: "Course",
    module: "Module",
    topic: "Topic",
    "key-concept": "Key Concept",
  };

  const typeColors = {
    course: "bg-blue-500/10 text-blue-500",
    module: "bg-purple-500/10 text-purple-500",
    topic: "bg-amber-500/10 text-amber-500",
    "key-concept": "bg-green-500/10 text-green-500",
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "w-full flex items-start gap-3 px-4 py-3 text-left transition-colors",
        "hover:bg-muted/50 focus-visible:outline-none focus-visible:bg-muted",
        isSelected && "bg-muted"
      )}
      aria-selected={isSelected}
    >
      <div
        className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
          result.type === "course" && "bg-gradient-to-br from-blue-500/20 to-purple-500/20",
          result.type === "module" && "bg-muted",
          result.type === "topic" && "bg-amber-500/10",
          result.type === "key-concept" && "bg-green-500/10"
        )}
      >
        {result.icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-foreground truncate">
            {result.title}
          </p>
          <span
            className={cn(
              "text-[10px] px-1.5 py-0.5 rounded font-medium",
              typeColors[result.type]
            )}
          >
            {typeLabels[result.type]}
          </span>
        </div>

        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
          {result.description}
        </p>

        {result.course && (
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-[10px] text-muted-foreground">
              {result.course.title}
            </span>
            {result.module && (
              <>
                <ChevronRight className="w-3 h-3 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">
                  {result.module.estimatedMinutes} min
                </span>
              </>
            )}
          </div>
        )}

        {result.tags && result.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {result.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
    </button>
  );
}

export function SearchOverlay({ isOpen, onClose, className }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Perform search
  const results = useMemo(() => {
    if (!query.trim()) return [];

    const scored = searchIndex.map((result) => ({
      result,
      score: calculateRelevance(query, result),
    }));

    return scored
      .filter((item) => item.score > 0.5)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((item) => item.result);
  }, [query]);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results.length]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (results.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % results.length);
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
          break;
        case "Enter":
          e.preventDefault();
          if (results[selectedIndex]) {
            router.push(results[selectedIndex].href);
            onClose();
          }
          break;
      }
    },
    [results, selectedIndex, onClose, router]
  );

  // Global keyboard shortcut
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        // Toggle search
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Search modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "fixed left-1/2 top-[15%] -translate-x-1/2 w-full max-w-2xl z-50",
              "bg-popover rounded-2xl shadow-2xl border border-border overflow-hidden",
              className
            )}
            role="dialog"
            aria-modal="true"
            aria-label="Search"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
              <Search className="w-5 h-5 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search courses, modules, concepts..."
                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-base"
                aria-label="Search query"
              />
              <div className="flex items-center gap-2">
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="p-1 rounded hover:bg-muted transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
                <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs font-mono text-muted-foreground bg-muted rounded">
                  <Command className="w-3 h-3" />
                  <span>K</span>
                </kbd>
              </div>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {query ? (
                // Search results
                results.length > 0 ? (
                  <div role="listbox">
                    {results.map((result, index) => (
                      <SearchResultItem
                        key={result.id}
                        result={result}
                        isSelected={index === selectedIndex}
                        onSelect={onClose}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-12 text-center">
                    <Search className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">
                      No results for &quot;{query}&quot;
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Try searching for courses, modules, or laser safety concepts
                    </p>
                  </div>
                )
              ) : (
                // Default state - suggestions
                <div className="py-2">
                  {/* Recent searches */}
                  {recentSearches.length > 0 && (
                    <div className="mb-4">
                      <h3 className="px-4 py-2 text-xs font-medium text-muted-foreground flex items-center gap-2">
                        <History className="w-3 h-3" />
                        Recent
                      </h3>
                      <div className="px-2">
                        {recentSearches.slice(0, 3).map((search) => (
                          <button
                            key={search}
                            onClick={() => setQuery(search)}
                            className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-foreground hover:bg-muted rounded"
                          >
                            <ArrowRight className="w-3 h-3 text-muted-foreground" />
                            {search}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Popular searches */}
                  <div>
                    <h3 className="px-4 py-2 text-xs font-medium text-muted-foreground flex items-center gap-2">
                      <TrendingUp className="w-3 h-3" />
                      Popular
                    </h3>
                    <div className="px-2">
                      {popularSearches.map((search) => (
                        <button
                          key={search}
                          onClick={() => setQuery(search)}
                          className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-foreground hover:bg-muted rounded"
                        >
                          <ArrowRight className="w-3 h-3 text-muted-foreground" />
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick actions */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <h3 className="px-4 py-2 text-xs font-medium text-muted-foreground flex items-center gap-2">
                      <Sparkles className="w-3 h-3" />
                      Quick Actions
                    </h3>
                    <div className="grid grid-cols-2 gap-2 px-4 mt-2">
                      <Link href="/courses">
                        <Button variant="outline" className="w-full justify-start gap-2">
                          <BookOpen className="w-4 h-4" />
                          Browse Courses
                        </Button>
                      </Link>
                      <Link href="/certificate">
                        <Button variant="outline" className="w-full justify-start gap-2">
                          <GraduationCap className="w-4 h-4" />
                          Certificates
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/50 text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-background rounded border">↑↓</kbd>
                  <span>Navigate</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-background rounded border">↵</kbd>
                  <span>Select</span>
                </span>
              </div>
              <span>{results.length} results</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default SearchOverlay;
