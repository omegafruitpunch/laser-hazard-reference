/**
 * FAA Review Timeline - Interactive Process Visualization
 * 
 * FAA Official Aesthetic with aviation warning colors
 * Enhanced with weather/aviation icons and emergency-oriented design
 */

import React, { useState } from 'react';
import { FAAColors, FAAIcons, ZoneConfig } from '../../styles/FAAAviationStyles';

interface TimelineStage {
  id: string;
  title: string;
  duration: string;
  description: string;
  details: string[];
  responsible: string;
  outputs: string[];
  icon: string;
  warning?: boolean;
}

const timelineStages: TimelineStage[] = [
  {
    id: 'submission',
    title: 'Form 7140-1 Submission',
    duration: 'Day 0',
    description: 'Proponent submits completed Form 7140-1 to appropriate FAA Service Center',
    details: [
      'Submit at least 30 days before planned operation',
      'Include Laser Configuration Worksheet for each configuration',
      'Attach diagrams showing planned laser paths',
      'List all control measures in detail',
      'Provide calculation documentation if using alternative methods'
    ],
    responsible: 'Laser Proponent/Operator',
    outputs: ['Completed Form 7140-1', 'Supporting documentation', 'Laser Configuration Worksheets'],
    icon: '📝'
  },
  {
    id: 'intake',
    title: 'Initial Intake & Review',
    duration: 'Days 1-3',
    description: 'FAA Service Center reviews submission for completeness and clarity',
    details: [
      'Verify all required fields completed',
      'Check calculations for obvious errors',
      'Identify missing information or attachments',
      'Assign tracking number to submission',
      'Enter into FAA tracking system'
    ],
    responsible: 'FAA Service Center Staff',
    outputs: ['Intake confirmation', 'Information requests (if needed)'],
    icon: '📋'
  },
  {
    id: 'verification',
    title: 'Data Verification',
    duration: 'Days 3-7',
    description: 'FAA contacts proponent if questions or clarifications are needed',
    details: [
      'FAA may contact proponent for additional information',
      'Verify laser specifications and hazard calculations',
      'Confirm control measures are adequate',
      'Review beam direction and airspace coverage',
      'Validate geographic coordinates and elevations'
    ],
    responsible: 'FAA Technical Staff',
    outputs: ['Clarification requests', 'Technical review notes'],
    icon: '🔍'
  },
  {
    id: 'aeronautical',
    title: 'Aeronautical Study',
    duration: 'Days 7-20',
    description: 'Comprehensive evaluation of potential aviation safety impacts',
    details: [
      'Analyze proposed operation against airspace structure',
      'Identify affected airports and flight paths',
      'Evaluate proximity to approach/departure corridors',
      'Assess impact on air traffic operations',
      'Review for conflicts with other airspace users',
      'Coordinate with Air Traffic facilities as needed'
    ],
    responsible: 'FAA Service Center Specialists',
    outputs: ['Aeronautical study report', 'Risk assessment', 'Coordination memos'],
    icon: '✈️'
  },
  {
    id: 'coordination',
    title: 'Stakeholder Coordination',
    duration: 'Days 15-25',
    description: 'FAA coordinates with potentially affected aviation parties',
    details: [
      'Notify affected Air Traffic Control facilities',
      'Coordinate with airport operators if applicable',
      'Consult with flight standards if needed',
      'Engage Department of Defense for military airspace',
      'Notify other federal agencies as required'
    ],
    responsible: 'FAA Service Center / ATO',
    outputs: ['Coordination responses', 'Stakeholder comments', 'Agreement documentation'],
    icon: '🤝'
  },
  {
    id: 'determination',
    title: 'Letter of Determination',
    duration: 'Days 20-30',
    description: 'FAA issues final determination on the proposed operation',
    details: [
      'Compile all review findings and stakeholder input',
      'Draft Letter of Determination (LOD)',
      'Obtain management approval',
      'Issue LOD to proponent',
      'Document determination in FAA records'
    ],
    responsible: 'FAA Service Center Manager',
    outputs: ['Letter of Determination (LOD)', 'Conditions or restrictions (if any)'],
    icon: '📜',
    warning: true
  }
];

interface DeterminationOutcome {
  type: 'no_objection' | 'objection' | 'conditional';
  title: string;
  description: string;
  conditions?: string[];
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
}

const determinationOutcomes: DeterminationOutcome[] = [
  {
    type: 'no_objection',
    title: 'No Objection',
    description: 'FAA has no objection to the proposed laser operation as submitted.',
    conditions: [
      'Operation must proceed as described in Form 7140-1',
      'All control measures must be implemented as specified',
      'Any changes require FAA notification',
      'Operator must maintain 24/7 contact capability during operation'
    ],
    icon: '✅',
    color: '#16a34a',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-500',
    textColor: 'text-green-800'
  },
  {
    type: 'conditional',
    title: 'Conditional Approval',
    description: 'FAA has no objection provided specific conditions are met.',
    conditions: [
      'Additional control measures may be required',
      'Restricted operating hours or dates',
      'Modified beam directions or elevation angles',
      'Additional coordination with ATC required',
      'Enhanced observer requirements',
      'Weather-related restrictions'
    ],
    icon: '⚠️',
    color: '#f59e0b',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-500',
    textColor: 'text-amber-800'
  },
  {
    type: 'objection',
    title: 'Objection',
    description: 'FAA objects to the proposed laser operation due to unacceptable aviation safety risks.',
    conditions: [
      'Operation poses unacceptable risk to aviation safety',
      'Inadequate control measures for the proposed airspace',
      'Conflicts with critical flight operations',
      'Proponent may revise and resubmit with modifications',
      'Consider alternative locations or reduced power levels'
    ],
    icon: '⛔',
    color: '#dc2626',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-500',
    textColor: 'text-red-800'
  }
];

export const FAAReviewTimeline: React.FC = () => {
  const [activeStage, setActiveStage] = useState<string | null>('submission');
  const [showOutcomes, setShowOutcomes] = useState(true);
  const [selectedOutcome, setSelectedOutcome] = useState<DeterminationOutcome | null>(null);
  const [showZoneOverlay, setShowZoneOverlay] = useState(false);

  const activeStageData = timelineStages.find(s => s.id === activeStage);

  const getStageStatus = (stageId: string) => {
    if (stageId === activeStage) return 'active';
    const stageIndex = timelineStages.findIndex(s => s.id === stageId);
    const activeIndex = timelineStages.findIndex(s => s.id === activeStage);
    return stageIndex < activeIndex ? 'completed' : 'pending';
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* FAA Header */}
      <div className="bg-[#002868] text-white p-6 rounded-t-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-4xl mr-4">⏰</span>
            <div>
              <h2 className="text-2xl font-bold">FAA Review Process Timeline</h2>
              <p className="text-blue-100">From Form 7140-1 submission to Letter of Determination</p>
            </div>
          </div>
          <div className="hidden md:block text-right">
            <div className="text-sm text-blue-200">Estimated Duration</div>
            <div className="text-2xl font-bold">20-30 Days</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-b-xl shadow-lg p-6">
        {/* Timeline Visual - Aviation Style */}
        <div className="relative mb-8 overflow-x-auto">
          {/* Timeline Bar with Flight Path styling */}
          <div className="absolute top-10 left-0 right-0 h-2 bg-gray-200 rounded-full"></div>
          <div 
            className="absolute top-10 left-0 h-2 bg-[#002868] rounded-full transition-all duration-700"
            style={{ 
              width: activeStage 
                ? `${((timelineStages.findIndex(s => s.id === activeStage) + 1) / timelineStages.length) * 100}%` 
                : '0%' 
            }}
          ></div>

          {/* Timeline Points - Aviation markers */}
          <div className="relative flex justify-between min-w-[600px] px-2">
            {timelineStages.map((stage, index) => {
              const status = getStageStatus(stage.id);
              return (
                <button
                  key={stage.id}
                  onClick={() => setActiveStage(stage.id)}
                  className={`flex flex-col items-center focus:outline-none transition-all duration-300 ${
                    status === 'active' ? 'scale-110' : 'hover:scale-105'
                  }`}
                >
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl 
                      border-4 transition-all duration-300 shadow-lg ${
                      status === 'completed'
                        ? 'bg-green-500 border-green-500 text-white'
                        : status === 'active'
                        ? 'bg-[#002868] border-[#002868] text-white shadow-xl'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}
                  >
                    {status === 'completed' ? '✓' : stage.icon}
                  </div>
                  <span className={`mt-3 text-xs font-bold text-center max-w-[100px] leading-tight ${
                    status === 'active' ? 'text-[#002868]' : 'text-gray-500'
                  }`}>
                    {stage.title.split(' ').slice(0, 2).join(' ')}
                  </span>
                  <span className="text-xs text-gray-400 font-mono mt-1">{stage.duration}</span>
                  
                  {/* Warning indicator for critical stages */}
                  {stage.warning && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full 
                      flex items-center justify-center text-white text-xs font-bold">
                      !
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Stage Details */}
        {activeStageData && (
          <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden mb-8 animate-fadeIn">
            {/* Stage Header - FAA Blue */}
            <div className="bg-[#002868] text-white p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center">
                  <span className="text-5xl mr-5">{activeStageData.icon}</span>
                  <div>
                    <h3 className="text-2xl font-bold">{activeStageData.title}</h3>
                    <p className="text-blue-200 flex items-center mt-1">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {activeStageData.duration}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="bg-white/20 px-4 py-2 rounded-lg text-sm font-medium">
                    {activeStageData.responsible}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-[#002868] mb-4 flex items-center text-lg">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Description
                </h4>
                <p className="text-gray-700 mb-6 leading-relaxed">{activeStageData.description}</p>

                <h4 className="font-bold text-[#002868] mb-4 flex items-center text-lg">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  Key Activities
                </h4>
                <ul className="space-y-3">
                  {activeStageData.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start text-gray-700 bg-gray-50 p-3 rounded-lg">
                      <span className="w-6 h-6 bg-[#002868] text-white rounded-full flex items-center 
                        justify-center text-xs font-bold mr-3 flex-shrink-0">
                        {idx + 1}
                      </span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-green-700 mb-4 flex items-center text-lg">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Expected Outputs
                </h4>
                <ul className="space-y-3 mb-6">
                  {activeStageData.outputs.map((output, idx) => (
                    <li key={idx} className="flex items-center text-gray-700 bg-green-50 p-3 rounded-lg 
                      border border-green-200">
                      <span className="text-green-600 mr-3 text-xl">→</span>
                      <span className="font-medium">{output}</span>
                    </li>
                  ))}
                </ul>

                {/* Pro Tips - Aviation Amber */}
                <div className="bg-amber-50 border-2 border-amber-400 rounded-xl p-5">
                  <h5 className="font-bold text-amber-800 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" 
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
                        clipRule="evenodd" />
                    </svg>
                    Pro Tip
                  </h5>
                  {activeStageData.id === 'submission' && (
                    <p className="text-amber-700">Submit at least 30 days in advance. Earlier is better for complex operations near airports.</p>
                  )}
                  {activeStageData.id === 'intake' && (
                    <p className="text-amber-700">Ensure all fields are filled - incomplete forms cause significant delays.</p>
                  )}
                  {activeStageData.id === 'verification' && (
                    <p className="text-amber-700">Respond promptly to FAA requests to keep your timeline on track.</p>
                  )}
                  {activeStageData.id === 'aeronautical' && (
                    <p className="text-amber-700">This is the critical evaluation phase - be patient while FAA ensures safety.</p>
                  )}
                  {activeStageData.id === 'coordination' && (
                    <p className="text-amber-700">Multiple agencies may need to review - this takes time but ensures safety.</p>
                  )}
                  {activeStageData.id === 'determination' && (
                    <p className="text-amber-700 font-bold">Do NOT operate until you receive the LOD with "no objection" determination.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Determination Outcomes Section */}
        <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden mb-8">
          <button
            onClick={() => setShowOutcomes(!showOutcomes)}
            className="w-full p-5 text-left flex items-center justify-between hover:bg-gray-50 
              transition-colors bg-gray-50"
          >
            <div className="flex items-center">
              <span className="text-4xl mr-4">📜</span>
              <div>
                <h3 className="text-xl font-bold text-[#002868]">Letter of Determination Outcomes</h3>
                <p className="text-sm text-gray-600">Three possible determinations from the FAA</p>
              </div>
            </div>
            <svg
              className={`w-8 h-8 text-[#002868] transition-transform duration-300 ${showOutcomes ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showOutcomes && (
            <div className="p-6 border-t">
              {/* Outcome Selection */}
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {determinationOutcomes.map((outcome) => (
                  <button
                    key={outcome.type}
                    onClick={() => setSelectedOutcome(outcome)}
                    className={`p-5 rounded-xl border-2 text-left transition-all ${
                      selectedOutcome?.type === outcome.type
                        ? `${outcome.bgColor} ${outcome.borderColor} shadow-lg`
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-4xl mb-3 block">{outcome.icon}</span>
                    <h4 className={`font-bold text-lg ${outcome.textColor}`}>{outcome.title}</h4>
                  </button>
                ))}
              </div>

              {/* Selected Outcome Details */}
              {selectedOutcome && (
                <div className={`rounded-xl p-6 ${selectedOutcome.bgColor} border-2 
                  ${selectedOutcome.borderColor} animate-fadeIn`}>
                  <div className="flex items-center mb-4">
                    <span className="text-4xl mr-4">{selectedOutcome.icon}</span>
                    <div>
                      <h4 className={`text-2xl font-bold ${selectedOutcome.textColor}`}>
                        {selectedOutcome.title}
                      </h4>
                      <p className={`${selectedOutcome.textColor} opacity-80`}>
                        {selectedOutcome.description}
                      </p>
                    </div>
                  </div>
                  
                  <h5 className={`font-bold ${selectedOutcome.textColor} mb-3 text-lg`}>Requirements:</h5>
                  <ul className="space-y-2">
                    {selectedOutcome.conditions?.map((condition, idx) => (
                      <li key={idx} className={`flex items-start ${selectedOutcome.textColor}`}>
                        <span className="mr-3 text-xl">•</span>
                        <span className="font-medium">{condition}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Info Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          {/* Timeline Factors */}
          <div className="bg-blue-50 rounded-xl p-5 border-2 border-blue-200">
            <h4 className="font-bold text-blue-800 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" 
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
                  clipRule="evenodd" />
              </svg>
              Timeline Factors
            </h4>
            <ul className="text-sm text-blue-700 space-y-2">
              <li className="flex items-center"><span className="mr-2">✓</span> Simple operations: May be faster</li>
              <li className="flex items-center"><span className="mr-2">⚠️</span> Complex operations: May require more time</li>
              <li className="flex items-center"><span className="mr-2">⛔</span> Incomplete submissions: Significant delays</li>
              <li className="flex items-center"><span className="mr-2">✈️</span> High-traffic airspace: Extended coordination</li>
            </ul>
          </div>

          {/* Best Practices */}
          <div className="bg-green-50 rounded-xl p-5 border-2 border-green-200">
            <h4 className="font-bold text-green-800 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" 
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                  clipRule="evenodd" />
              </svg>
              Best Practices
            </h4>
            <ul className="text-sm text-green-700 space-y-2">
              <li className="flex items-center"><span className="mr-2">📅</span> Submit early - never wait until last minute</li>
              <li className="flex items-center"><span className="mr-2">📝</span> Be thorough - include all required info</li>
              <li className="flex items-center"><span className="mr-2">📞</span> Be responsive - reply quickly to requests</li>
              <li className="flex items-center"><span className="mr-2">🔄</span> Be flexible - consider modifications if needed</li>
            </ul>
          </div>

          {/* Zone Quick Reference */}
          <div className="bg-gray-50 rounded-xl p-5 border-2 border-gray-200">
            <h4 className="font-bold text-gray-800 mb-3 flex items-center">
              <span className="text-xl mr-2">🎯</span>
              Flight Zone Limits
            </h4>
            <div className="space-y-2">
              {Object.entries(ZoneConfig).map(([key, zone]) => (
                <div key={key} className={`flex justify-between items-center p-2 rounded ${zone.bgLight}`}>
                  <span className={`font-bold text-sm ${zone.textColor}`}>{zone.acronym}</span>
                  <span className="text-xs font-mono text-gray-600">{zone.threshold}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAAReviewTimeline;
