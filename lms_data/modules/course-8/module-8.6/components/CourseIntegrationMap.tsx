/**
 * CourseIntegrationMap Component
 * 
 * Visual map showing how all courses interconnect and relate to
 * real-world compliance and safety management.
 */

import React, { useState } from 'react';
import { courseIntegrations, integrationMap } from '../data';

export const CourseIntegrationMap: React.FC = () => {
  const [activeView, setActiveView] = useState<'courses' | 'standards' | 'procedures' | 'docs'>('courses');
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedStandard, setSelectedStandard] = useState<string>('');

  const course = courseIntegrations.find(c => c.courseId === selectedCourse);
  const standard = integrationMap.standards.find(s => s.standardId === selectedStandard);

  const renderCoursesView = () => (
    <div className="courses-integration">
      <div className="integration-diagram">
        <h4>Course Relationship Map</h4>
        <div className="course-flow">
          <div className="foundation-layer">
            <h5>Foundation</h5>
            {courseIntegrations
              .filter(c => c.courseId === 'course-1')
              .map(c => (
                <div 
                  key={c.courseId}
                  className={`course-node ${selectedCourse === c.courseId ? 'selected' : ''}`}
                  onClick={() => setSelectedCourse(c.courseId)}
                >
                  {c.courseName}
                </div>
              ))}
          </div>
          
          <div className="arrow">↓</div>
          
          <div className="core-layer">
            <h5>Core Knowledge</h5>
            <div className="core-nodes">
              {courseIntegrations
                .filter(c => ['course-2', 'course-3', 'course-4'].includes(c.courseId))
                .map(c => (
                  <div 
                    key={c.courseId}
                    className={`course-node ${selectedCourse === c.courseId ? 'selected' : ''}`}
                    onClick={() => setSelectedCourse(c.courseId)}
                  >
                    {c.courseName}
                  </div>
                ))}
            </div>
          </div>
          
          <div className="arrow">↓</div>
          
          <div className="application-layer">
            <h5>Application & Management</h5>
            <div className="app-nodes">
              {courseIntegrations
                .filter(c => ['course-5', 'course-6', 'course-7', 'course-8'].includes(c.courseId))
                .map(c => (
                  <div 
                    key={c.courseId}
                    className={`course-node ${selectedCourse === c.courseId ? 'selected' : ''}`}
                    onClick={() => setSelectedCourse(c.courseId)}
                  >
                    {c.courseName}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {course && (
        <div className="course-detail">
          <h4>{course.courseName}</h4>
          <p className="description">{course.relationshipToCompliance}</p>
          
          <div className="detail-section">
            <h5>Key Concepts</h5>
            <ul>
              {course.keyConcepts.map((concept, idx) => (
                <li key={idx}>{concept}</li>
              ))}
            </ul>
          </div>

          <div className="detail-section">
            <h5>Practical Applications</h5>
            <ul>
              {course.practicalApplications.map((app, idx) => (
                <li key={idx}>{app}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="integration-summary">
        <h4>How Courses Build Together</h4>
        <div className="integration-flow">
          <div className="flow-step">
            <span className="step-num">1</span>
            <span className="step-desc">
              <strong>Fundamentals</strong> - Understand laser properties and basic bioeffects
            </span>
          </div>
          <div className="flow-step">
            <span className="step-num">2</span>
            <span className="step-desc">
              <strong>Technical Skills</strong> - Calculate hazards and specify protection
            </span>
          </div>
          <div className="flow-step">
            <span className="step-num">3</span>
            <span className="step-desc">
              <strong>Regulatory Knowledge</strong> - Navigate standards and compliance
            </span>
          </div>
          <div className="flow-step">
            <span className="step-num">4</span>
            <span className="step-desc">
              <strong>Management</strong> - Implement comprehensive safety programs
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStandardsView = () => (
    <div className="standards-integration">
      <div className="standards-list">
        <h4>Standards and Applicable Courses</h4>
        {integrationMap.standards.map(std => (
          <div 
            key={std.standardId}
            className={`standard-card ${selectedStandard === std.standardId ? 'selected' : ''}`}
            onClick={() => setSelectedStandard(std.standardId)}
          >
            <h5>{std.standardName}</h5>
            <div className="applicable-courses">
              {std.applicableCourses.map(courseId => {
                const course = courseIntegrations.find(c => c.courseId === courseId);
                return (
                  <span key={courseId} className="course-tag">
                    {course?.courseName || courseId}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {standard && (
        <div className="standard-detail">
          <h4>{standard.standardName}</h4>
          
          <div className="detail-section">
            <h5>Key Requirements</h5>
            <ul>
              {standard.keyRequirements.map((req, idx) => (
                <li key={idx}>{req}</li>
              ))}
            </ul>
          </div>

          <div className="detail-section">
            <h5>Where to Learn</h5>
            <ul>
              {standard.applicableCourses.map(courseId => {
                const course = courseIntegrations.find(c => c.courseId === courseId);
                return (
                  <li key={courseId}>
                    <strong>{course?.courseName}</strong>: {course?.relationshipToCompliance}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );

  const renderProceduresView = () => (
    <div className="procedures-integration">
      <h4>Cross-Course Procedures</h4>
      <p className="intro">
        Many laser safety procedures span multiple knowledge domains. 
        Understanding these integrated procedures is essential for effective LSO practice.
      </p>

      {integrationMap.procedures.map(proc => (
        <div key={proc.procedureId} className="procedure-card">
          <h5>{proc.procedureName}</h5>
          
          <div className="procedure-courses">
            <span className="label">Involves:</span>
            {proc.applicableCourses.map(courseId => {
              const course = courseIntegrations.find(c => c.courseId === courseId);
              return (
                <span key={courseId} className="course-tag">
                  {course?.courseName || courseId}
                </span>
              );
            })}
          </div>

          <div className="procedure-steps">
            <span className="label">Key Steps:</span>
            <ol>
              {proc.steps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      ))}
    </div>
  );

  const renderDocsView = () => (
    <div className="documentation-integration">
      <h4>Documentation Requirements Across Courses</h4>
      <p className="intro">
        Comprehensive laser safety documentation requires knowledge from multiple courses.
        Each document type draws on specific competencies.
      </p>

      {integrationMap.documentation.map(doc => (
        <div key={doc.documentType} className="doc-card">
          <h5>{doc.documentType}</h5>
          
          <div className="doc-courses">
            <span className="label">Requires Knowledge From:</span>
            <ul>
              {doc.requiredCourses.map(courseId => {
                const course = courseIntegrations.find(c => c.courseId === courseId);
                return (
                  <li key={courseId}>{course?.courseName || courseId}</li>
                );
              })}
            </ul>
          </div>

          <div className="doc-elements">
            <span className="label">Required Elements:</span>
            <ul>
              {doc.elements.map((element, idx) => (
                <li key={idx}>{element}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="course-integration-map">
      <div className="view-tabs">
        <button 
          className={activeView === 'courses' ? 'active' : ''}
          onClick={() => setActiveView('courses')}
        >
          Course Flow
        </button>
        <button 
          className={activeView === 'standards' ? 'active' : ''}
          onClick={() => setActiveView('standards')}
        >
          Standards Map
        </button>
        <button 
          className={activeView === 'procedures' ? 'active' : ''}
          onClick={() => setActiveView('procedures')}
        >
          Integrated Procedures
        </button>
        <button 
          className={activeView === 'docs' ? 'active' : ''}
          onClick={() => setActiveView('docs')}
        >
          Documentation
        </button>
      </div>

      <div className="view-content">
        {activeView === 'courses' && renderCoursesView()}
        {activeView === 'standards' && renderStandardsView()}
        {activeView === 'procedures' && renderProceduresView()}
        {activeView === 'docs' && renderDocsView()}
      </div>
    </div>
  );
};
