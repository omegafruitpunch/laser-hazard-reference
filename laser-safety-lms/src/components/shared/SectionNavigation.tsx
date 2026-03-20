'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, ChevronRight } from 'lucide-react';

export interface Section {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

interface SectionNavigationProps {
  sections: Section[];
  activeSection: string;
  completedSections: Set<string>;
  onSectionChange: (sectionId: string) => void;
  onMarkComplete: (sectionId: string) => void;
  children: React.ReactNode;
}

export default function SectionNavigation({
  sections,
  activeSection,
  completedSections,
  onSectionChange,
  onMarkComplete,
  children,
}: SectionNavigationProps) {
  const progress = (completedSections.size / sections.length) * 100;
  const currentSectionIndex = sections.findIndex((s) => s.id === activeSection);
  const currentSection = sections[currentSectionIndex];

  const goToNextSection = () => {
    if (currentSectionIndex < sections.length - 1) {
      onSectionChange(sections[currentSectionIndex + 1].id);
    }
  };

  const goToPrevSection = () => {
    if (currentSectionIndex > 0) {
      onSectionChange(sections[currentSectionIndex - 1].id);
    }
  };

  return (
    <div className="space-y-4">
      {/* Section Navigation Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          const isComplete = completedSections.has(section.id);

          return (
            <Button
              key={section.id}
              variant={isActive ? 'default' : 'outline'}
              onClick={() => onSectionChange(section.id)}
              className="h-auto py-3 flex flex-col items-center gap-2 text-left"
            >
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                {isComplete && <CheckCircle2 className="w-4 h-4 text-green-500" />}
              </div>
              <div className="text-center">
                <div className="text-xs font-semibold">{section.title}</div>
                <div className="text-[10px] text-muted-foreground hidden sm:block">
                  {section.description}
                </div>
              </div>
            </Button>
          );
        })}
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>Progress:</span>
        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span>
          {completedSections.size}/{sections.length}
        </span>
      </div>

      {/* Section Content */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {currentSection && (
                <>
                  <currentSection.icon className="w-5 h-5 text-primary" />
                  <CardTitle>{currentSection.title}</CardTitle>
                </>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMarkComplete(activeSection)}
              disabled={completedSections.has(activeSection)}
            >
              {completedSections.has(activeSection) ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-1 text-green-500" />
                  Completed
                </>
              ) : (
                'Mark Complete'
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {children}

          {/* Section Navigation Footer */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPrevSection}
              disabled={currentSectionIndex === 0}
            >
              ← Previous
            </Button>

            <span className="text-sm text-muted-foreground">
              Section {currentSectionIndex + 1} of {sections.length}
            </span>

            <Button
              variant={currentSectionIndex === sections.length - 1 ? 'secondary' : 'default'}
              size="sm"
              onClick={goToNextSection}
              disabled={currentSectionIndex === sections.length - 1}
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper hook for section navigation state
export function useSectionNavigation(sectionIds: string[]) {
  const [activeSection, setActiveSection] = useState(sectionIds[0]);
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());

  const markComplete = (sectionId: string) => {
    setCompletedSections((prev) => new Set([...prev, sectionId]));
  };

  const isComplete = (sectionId: string) => completedSections.has(sectionId);

  const progress = (completedSections.size / sectionIds.length) * 100;

  return {
    activeSection,
    setActiveSection,
    completedSections,
    markComplete,
    isComplete,
    progress,
  };
}
