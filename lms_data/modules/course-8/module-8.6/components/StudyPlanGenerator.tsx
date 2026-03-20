/**
 * StudyPlanGenerator Component
 * 
 * Generates personalized study plans based on knowledge gap analysis
 * and user preferences (target exam date, available hours, etc.)
 */

import React, { useState } from 'react';
import { GapAnalysis, StudyPlan, StudySection } from '../types';
import { knowledgeDomains, practiceQuestions } from '../data';

interface StudyPlanGeneratorProps {
  gapAnalysis?: GapAnalysis[];
}

export const StudyPlanGenerator: React.FC<StudyPlanGeneratorProps> = ({
  gapAnalysis = []
}) => {
  const [targetDate, setTargetDate] = useState('');
  const [weeklyHours, setWeeklyHours] = useState(5);
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [showForm, setShowForm] = useState(true);

  const generateStudyPlan = () => {
    // Calculate available days until target
    const targetDateObj = targetDate ? new Date(targetDate) : null;
    const today = new Date();
    const daysAvailable = targetDateObj 
      ? Math.max(1, Math.ceil((targetDateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))
      : 90; // Default 90 days

    const totalHours = Math.floor(daysAvailable / 7) * weeklyHours;

    // Generate sections based on gaps
    const sections: StudySection[] = [];

    // If no gap analysis provided, create balanced plan
    const domainsToStudy = gapAnalysis.length > 0 
      ? gapAnalysis.filter(g => g.score < g.targetScore).sort((a, b) => a.score - b.score)
      : knowledgeDomains.map(d => ({
          domainId: d.id,
          domainName: d.name,
          score: 50,
          targetScore: 80,
          gaps: [],
          recommendations: [`Review ${d.name} fundamentals`]
        }));

    // Calculate priority-based time allocation
    const totalGapScore = domainsToStudy.reduce((sum, g) => sum + (100 - g.score), 0);

    domainsToStudy.forEach((gap, index) => {
      const domain = knowledgeDomains.find(d => d.id === gap.domainId);
      if (!domain) return;

      // Allocate more time to weaker domains
      const priorityWeight = (100 - gap.score) / (totalGapScore || 100);
      const hoursAllocated = Math.max(2, Math.floor(totalHours * priorityWeight * 0.8));
      
      const priority: 'high' | 'medium' | 'low' = 
        gap.score < 60 ? 'high' : gap.score < 80 ? 'medium' : 'low';

      // Reading section
      sections.push({
        id: `sec-${gap.domainId}-reading`,
        title: `${domain.name} - Core Concepts`,
        domain: domain.name,
        duration: Math.floor(hoursAllocated * 30), // 30% reading
        resources: [
          {
            id: `res-${gap.domainId}-1`,
            type: 'reading',
            title: `${domain.name} Study Guide`,
            duration: Math.floor(hoursAllocated * 15)
          },
          {
            id: `res-${gap.domainId}-2`,
            type: 'reading',
            title: `ANSI Z136 Reference - ${domain.name}`,
            duration: Math.floor(hoursAllocated * 15)
          }
        ],
        priority,
        completed: false
      });

      // Practice section
      sections.push({
        id: `sec-${gap.domainId}-practice`,
        title: `${domain.name} - Practice Questions`,
        domain: domain.name,
        duration: Math.floor(hoursAllocated * 40), // 40% practice
        resources: [
          {
            id: `res-${gap.domainId}-3`,
            type: 'practice',
            title: `${domain.name} Quiz`,
            duration: Math.floor(hoursAllocated * 20)
          },
          {
            id: `res-${gap.domainId}-4`,
            type: 'assessment',
            title: `${domain.name} Assessment`,
            duration: Math.floor(hoursAllocated * 20)
          }
        ],
        priority,
        completed: false
      });

      // Review section
      if (gap.gaps.length > 0) {
        sections.push({
          id: `sec-${gap.domainId}-review`,
          title: `${domain.name} - Gap Review`,
          domain: domain.name,
          duration: Math.floor(hoursAllocated * 30), // 30% review
          resources: gap.gaps.slice(0, 3).map((gap, idx) => ({
            id: `res-${gap.domainId}-gap-${idx}`,
            type: 'video',
            title: `Review: ${gap.substring(0, 50)}...`,
            duration: 15
          })),
          priority,
          completed: false
        });
      }
    });

    // Add final review section
    sections.push({
      id: 'sec-final-review',
      title: 'Comprehensive Final Review',
      domain: 'All Domains',
      duration: Math.max(4, Math.floor(weeklyHours * 0.5)) * 60,
      resources: [
        {
          id: 'res-final-1',
          type: 'practice',
          title: 'Full Practice Exam',
          duration: 180
        },
        {
          id: 'res-final-2',
          type: 'assessment',
          title: 'Weak Area Review',
          duration: 60
        }
      ],
      priority: 'high',
      completed: false
    });

    const plan: StudyPlan = {
      id: `plan-${Date.now()}`,
      userId: 'current-user',
      createdAt: new Date(),
      targetExamDate: targetDateObj || undefined,
      weeklyHours,
      sections: sections.sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }),
      gapAnalysis
    };

    setStudyPlan(plan);
    setShowForm(false);
  };

  const toggleSectionComplete = (sectionId: string) => {
    if (!studyPlan) return;
    
    setStudyPlan({
      ...studyPlan,
      sections: studyPlan.sections.map(s =>
        s.id === sectionId ? { ...s, completed: !s.completed } : s
      )
    });
  };

  const exportPlan = () => {
    if (!studyPlan) return;

    const content = [
      `PERSONALIZED LASER SAFETY STUDY PLAN`,
      `=====================================`,
      ``,
      `Created: ${studyPlan.createdAt.toLocaleDateString()}`,
      `Target Exam Date: ${studyPlan.targetExamDate?.toLocaleDateString() || 'Not set'}`,
      `Weekly Study Hours: ${studyPlan.weeklyHours}`,
      ``,
      `STUDY SCHEDULE`,
      `---------------`,
      ...studyPlan.sections.map((section, idx) => [
        `[${section.completed ? 'X' : ' '}] ${idx + 1}. ${section.title}`,
        `    Domain: ${section.domain}`,
        `    Priority: ${section.priority.toUpperCase()}`,
        `    Duration: ${section.duration} minutes`,
        `    Resources:`,
        ...section.resources.map(r => `      - ${r.title} (${r.duration} min) [${r.type}]`),
        ``
      ]).flat(),
      ``,
      `GAP ANALYSIS SUMMARY`,
      `--------------------`,
      ...studyPlan.gapAnalysis.map(gap => [
        `${gap.domainName}: ${gap.score}% (Target: ${gap.targetScore}%)`,
        ...gap.gaps.map(g => `  - Gap: ${g}`),
        ...gap.recommendations.map(r => `  - Action: ${r}`),
        ``
      ]).flat()
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laser-safety-study-plan-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#dc2626';
      case 'medium': return '#ca8a04';
      case 'low': return '#16a34a';
      default: return '#6b7280';
    }
  };

  const completedCount = studyPlan?.sections.filter(s => s.completed).length || 0;
  const totalSections = studyPlan?.sections.length || 0;
  const progress = totalSections > 0 ? Math.round((completedCount / totalSections) * 100) : 0;

  if (!showForm && studyPlan) {
    return (
      <div className="study-plan-display">
        <h2>Your Personalized Study Plan</h2>
        
        <div className="plan-summary">
          <div className="summary-item">
            <span className="label">Total Sections:</span>
            <span className="value">{totalSections}</span>
          </div>
          <div className="summary-item">
            <span className="label">Completed:</span>
            <span className="value">{completedCount}</span>
          </div>
          <div className="summary-item">
            <span className="label">Weekly Hours:</span>
            <span className="value">{studyPlan.weeklyHours}</span>
          </div>
          {studyPlan.targetExamDate && (
            <div className="summary-item">
              <span className="label">Target Date:</span>
              <span className="value">{studyPlan.targetExamDate.toLocaleDateString()}</span>
            </div>
          )}
        </div>

        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          />
          <span className="progress-text">{progress}% Complete</span>
        </div>

        <div className="study-sections">
          {studyPlan.sections.map((section, idx) => (
            <div 
              key={section.id}
              className={`study-section ${section.completed ? 'completed' : ''}`}
            >
              <div className="section-header">
                <input
                  type="checkbox"
                  checked={section.completed}
                  onChange={() => toggleSectionComplete(section.id)}
                />
                <span className="section-number">{idx + 1}</span>
                <span className="section-title">{section.title}</span>
                <span 
                  className="priority-badge"
                  style={{ backgroundColor: getPriorityColor(section.priority) }}
                >
                  {section.priority}
                </span>
              </div>
              
              <div className="section-details">
                <div className="detail-row">
                  <span className="label">Domain:</span>
                  <span className="value">{section.domain}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Duration:</span>
                  <span className="value">{section.duration} minutes</span>
                </div>
              </div>

              <div className="resources">
                <span className="label">Resources:</span>
                <ul>
                  {section.resources.map(resource => (
                    <li key={resource.id}>
                      <span className="resource-type">[{resource.type}]</span>
                      <span className="resource-title">{resource.title}</span>
                      <span className="resource-duration">({resource.duration} min)</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="action-buttons">
          <button className="btn-export" onClick={exportPlan}>
            Export Study Plan
          </button>
          <button 
            className="btn-new"
            onClick={() => {
              setStudyPlan(null);
              setShowForm(true);
            }}
          >
            Generate New Plan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="study-plan-generator">
      <h2>Generate Your Study Plan</h2>
      <p className="intro">
        Create a personalized study plan based on your knowledge gaps and 
        available study time. This will help you focus on the areas that need 
        the most attention for certification success.
      </p>

      <div className="plan-form">
        <div className="form-field">
          <label>Target Exam Date (optional):</label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
          <span className="help-text">
            If you have a target date for taking the certification exam
          </span>
        </div>

        <div className="form-field">
          <label>Weekly Study Hours: {weeklyHours}</label>
          <input
            type="range"
            min={2}
            max={20}
            value={weeklyHours}
            onChange={(e) => setWeeklyHours(parseInt(e.target.value))}
          />
          <span className="help-text">
            How many hours per week can you dedicate to studying?
          </span>
        </div>

        {gapAnalysis.length > 0 && (
          <div className="gap-preview">
            <h4>Knowledge Gaps to Address:</h4>
            <ul>
              {gapAnalysis
                .filter(g => g.score < g.targetScore)
                .sort((a, b) => a.score - b.score)
                .map(gap => (
                  <li key={gap.domainId}>
                    <strong>{gap.domainName}</strong> - {gap.score}% 
                    <span className="gap-count">({gap.gaps.length} gaps)</span>
                  </li>
                ))}
            </ul>
          </div>
        )}

        <button 
          className="btn-generate"
          onClick={generateStudyPlan}
        >
          Generate Study Plan
        </button>
      </div>

      <div className="plan-features">
        <h4>Your Study Plan Will Include:</h4>
        <ul>
          <li>Domain-specific study sections based on your gaps</li>
          <li>Prioritized learning path (high priority first)</li>
          <li>Recommended resources for each topic</li>
          <li>Time estimates for each section</li>
          <li>Progress tracking</li>
          <li>Exportable format for offline use</li>
        </ul>
      </div>
    </div>
  );
};
