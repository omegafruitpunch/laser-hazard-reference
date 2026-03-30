/**
 * KnowledgeGapAnalyzer Component
 * 
 * Analyzes user knowledge across all domains and identifies gaps
 * for targeted study and improvement.
 */

import React, { useState } from 'react';
import { knowledgeDomains, KnowledgeDomain, Competency } from '../data';
import { GapAnalysis } from '../types';

interface KnowledgeGapAnalyzerProps {
  onAnalysisComplete?: (gaps: GapAnalysis[]) => void;
}

interface DomainAssessment {
  domainId: string;
  competencyScores: Record<string, number>;
}

export const KnowledgeGapAnalyzer: React.FC<KnowledgeGapAnalyzerProps> = ({
  onAnalysisComplete
}) => {
  const [assessments, setAssessments] = useState<Record<string, DomainAssessment>>({});
  const [activeDomain, setActiveDomain] = useState<string>('');
  const [showResults, setShowResults] = useState(false);
  const [gapAnalysis, setGapAnalysis] = useState<GapAnalysis[]>([]);

  const currentDomain = knowledgeDomains.find(d => d.id === activeDomain);

  const startAssessment = (domainId: string) => {
    setActiveDomain(domainId);
    if (!assessments[domainId]) {
      setAssessments(prev => ({
        ...prev,
        [domainId]: {
          domainId,
          competencyScores: {}
        }
      }));
    }
    setShowResults(false);
  };

  const rateCompetency = (competencyId: string, score: number) => {
    setAssessments(prev => ({
      ...prev,
      [activeDomain]: {
        ...prev[activeDomain],
        competencyScores: {
          ...prev[activeDomain]?.competencyScores,
          [competencyId]: score
        }
      }
    }));
  };

  const calculateDomainScore = (domain: KnowledgeDomain): number => {
    const assessment = assessments[domain.id];
    if (!assessment) return 0;

    const scores = Object.values(assessment.competencyScores);
    if (scores.length === 0) return 0;

    const sum = scores.reduce((a, b) => a + b, 0);
    return Math.round((sum / (scores.length * 5)) * 100);
  };

  const completeAnalysis = () => {
    const gaps: GapAnalysis[] = knowledgeDomains.map(domain => {
      const score = calculateDomainScore(domain);
      const targetScore = 80; // Target competency level
      
      // Identify specific gaps
      const domainGaps: string[] = [];
      const recommendations: string[] = [];

      const assessment = assessments[domain.id];
      if (assessment) {
        domain.competencies.forEach(comp => {
          const score = assessment.competencyScores[comp.id] || 0;
          if (score < 3) {
            domainGaps.push(comp.statement);
            
            // Generate specific recommendation based on competency
            if (comp.level === 'basic') {
              recommendations.push(`Review fundamentals: ${comp.statement}`);
            } else if (comp.level === 'intermediate') {
              recommendations.push(`Practice application: ${comp.statement}`);
            } else {
              recommendations.push(`Advanced study: ${comp.statement}`);
            }
          }
        });
      }

      // Add domain-specific recommendations
      if (score < targetScore) {
        recommendations.push(`Complete ${domain.name} module review`);
        recommendations.push(`Take ${domain.name} practice assessment`);
      }

      return {
        domainId: domain.id,
        domainName: domain.name,
        score,
        targetScore,
        gaps: domainGaps,
        recommendations
      };
    });

    setGapAnalysis(gaps);
    setShowResults(true);
    setActiveDomain('');
    onAnalysisComplete?.(gaps);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#16a34a'; // green
    if (score >= 60) return '#ca8a04'; // yellow
    return '#dc2626'; // red
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Proficient';
    if (score >= 60) return 'Developing';
    return 'Needs Review';
  };

  // Results view
  if (showResults) {
    const overallScore = Math.round(
      gapAnalysis.reduce((sum, g) => sum + g.score, 0) / gapAnalysis.length
    );

    return (
      <div className="gap-analysis-results">
        <h2>Knowledge Gap Analysis Results</h2>
        
        <div className="overall-score">
          <div 
            className="score-circle"
            style={{ borderColor: getScoreColor(overallScore) }}
          >
            <span className="score-value" style={{ color: getScoreColor(overallScore) }}>
              {overallScore}%
            </span>
            <span className="score-label">{getScoreLabel(overallScore)}</span>
          </div>
        </div>

        <div className="domain-breakdown">
          <h3>Domain Performance</h3>
          {gapAnalysis.map(gap => (
            <div key={gap.domainId} className="domain-item">
              <div className="domain-header">
                <span className="domain-name">{gap.domainName}</span>
                <span 
                  className="domain-score"
                  style={{ color: getScoreColor(gap.score) }}
                >
                  {gap.score}%
                </span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${gap.score}%`,
                    backgroundColor: getScoreColor(gap.score)
                  }}
                />
              </div>
              
              {gap.gaps.length > 0 && (
                <div className="gaps-section">
                  <h4>Identified Gaps:</h4>
                  <ul>
                    {gap.gaps.map((g, idx) => (
                      <li key={idx}>{g}</li>
                    ))}
                  </ul>
                </div>
              )}

              {gap.recommendations.length > 0 && (
                <div className="recommendations-section">
                  <h4>Recommended Actions:</h4>
                  <ul>
                    {gap.recommendations.map((r, idx) => (
                      <li key={idx}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="priority-actions">
          <h3>Priority Study Areas</h3>
          <ol>
            {gapAnalysis
              .filter(g => g.score < 80)
              .sort((a, b) => a.score - b.score)
              .slice(0, 3)
              .map(gap => (
                <li key={gap.domainId}>
                  <strong>{gap.domainName}</strong> ({gap.score}%)
                  <p>Focus on: {gap.gaps.slice(0, 2).join(', ')}</p>
                </li>
              ))}
          </ol>
        </div>

        <div className="action-buttons">
          <button className="btn-study-plan">
            Generate Study Plan
          </button>
          <button 
            className="btn-reassess"
            onClick={() => {
              setShowResults(false);
              setAssessments({});
              setGapAnalysis([]);
            }}
          >
            Reassess
          </button>
        </div>
      </div>
    );
  }

  // Domain assessment view
  if (currentDomain) {
    const assessment = assessments[currentDomain.id];
    const progress = Object.keys(assessment?.competencyScores || {}).length;
    const total = currentDomain.competencies.length;

    return (
      <div className="domain-assessment">
        <div className="assessment-header">
          <h3>{currentDomain.name}</h3>
          <p>{currentDomain.description}</p>
          <div className="progress">
            Progress: {progress} of {total} competencies assessed
          </div>
        </div>

        <div className="competencies">
          {currentDomain.competencies.map(comp => {
            const score = assessment?.competencyScores[comp.id] || 0;
            
            return (
              <div key={comp.id} className="competency-item">
                <p className="competency-statement">{comp.statement}</p>
                <span className={`level-badge ${comp.level}`}>{comp.level}</span>
                
                <div className="rating">
                  <label>Self-assessment:</label>
                  <div className="rating-options">
                    {[1, 2, 3, 4, 5].map(rating => (
                      <button
                        key={rating}
                        className={`rating-btn ${score === rating ? 'selected' : ''}`}
                        onClick={() => rateCompetency(comp.id, rating)}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                  <span className="rating-label">
                    {score === 1 && 'Beginner'}
                    {score === 2 && 'Basic Understanding'}
                    {score === 3 && 'Competent'}
                    {score === 4 && 'Proficient'}
                    {score === 5 && 'Expert'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="assessment-navigation">
          <button onClick={() => setActiveDomain('')}>
            Back to Domains
          </button>
          
          {Object.keys(assessments).length === knowledgeDomains.length &&
           Object.values(assessments).every(a => 
             Object.keys(a.competencyScores).length === 
             knowledgeDomains.find(d => d.id === a.domainId)?.competencies.length
           ) && (
            <button 
              className="btn-complete"
              onClick={completeAnalysis}
            >
              Complete Analysis
            </button>
          )}
        </div>
      </div>
    );
  }

  // Domain selection view
  return (
    <div className="gap-analyzer">
      <h2>Knowledge Gap Analyzer</h2>
      <p className="intro">
        Assess your knowledge across all laser safety domains to identify 
        strengths and areas for improvement. This analysis will help create 
        a personalized study plan for certification preparation.
      </p>

      <div className="domains-grid">
        {knowledgeDomains.map(domain => {
          const score = calculateDomainScore(domain);
          const isAssessed = assessments[domain.id] && 
            Object.keys(assessments[domain.id].competencyScores).length === domain.competencies.length;

          return (
            <div 
              key={domain.id}
              className={`domain-card ${isAssessed ? 'assessed' : ''}`}
              onClick={() => startAssessment(domain.id)}
            >
              <h4>{domain.name}</h4>
              <p>{domain.description}</p>
              <div className="domain-meta">
                <span className="weight">Weight: {domain.weight}%</span>
                <span className="competencies">
                  {domain.competencies.length} competencies
                </span>
              </div>
              {isAssessed && (
                <div 
                  className="domain-score"
                  style={{ color: getScoreColor(score) }}
                >
                  {score}% Complete
                </div>
              )}
              {!isAssessed && assessments[domain.id] && (
                <div className="in-progress">In Progress</div>
              )}
            </div>
          );
        })}
      </div>

      <div className="assessment-instructions">
        <h4>How to Assess</h4>
        <ol>
          <li>Click on a domain to begin assessment</li>
          <li>Rate your confidence level (1-5) for each competency</li>
          <li>Be honest - this helps identify real knowledge gaps</li>
          <li>Complete all domains for comprehensive analysis</li>
          <li>Review your personalized gap analysis</li>
        </ol>
      </div>
    </div>
  );
};
