'use client';

import { useState } from 'react';
import { Plane, Calendar, MapPin, FileText, AlertTriangle, CheckCircle, Clock, Briefcase, Globe } from 'lucide-react';

interface TripStage {
  id: string;
  title: string;
  description: string;
  timeline: string;
  tasks: string[];
  critical: boolean;
}

const planningStages: TripStage[] = [
  {
    id: 'research',
    title: 'Initial Research & Assessment',
    description: 'Research destination requirements and assess feasibility',
    timeline: '8-12 weeks before departure',
    critical: true,
    tasks: [
      'Identify destination country ILDA category (A, B, F, G, X)',
      'Research local laser show regulations and requirements',
      'Contact local regulatory authority for current requirements',
      'Identify need for local partners or representatives',
      'Assess equipment import procedures (Carnet vs. temporary import)',
      'Research venue requirements and restrictions'
    ]
  },
  {
    id: 'permits',
    title: 'Permit Applications',
    description: 'Submit all required permit and license applications',
    timeline: '6-8 weeks before departure',
    critical: true,
    tasks: [
      'Complete laser show permit application',
      'Submit venue approval documentation',
      'Apply for temporary equipment import authorization if needed',
      'Obtain work permits/visas for crew members',
      'Submit LSO qualification documentation',
      'Provide proof of insurance coverage'
    ]
  },
  {
    id: 'documentation',
    title: 'Documentation Package',
    description: 'Prepare comprehensive documentation in required languages',
    timeline: '4-6 weeks before departure',
    critical: true,
    tasks: [
      'Translate key documents to local language',
      'Prepare equipment certification package',
      'Create detailed show description and beam analysis',
      'Document MPE compliance calculations',
      'Prepare emergency response procedures',
      'Compile crew qualifications and training records'
    ]
  },
  {
    id: 'logistics',
    title: 'Equipment & Logistics',
    description: 'Arrange equipment shipping and on-site logistics',
    timeline: '3-4 weeks before departure',
    critical: false,
    tasks: [
      'Arrange ATA Carnet or customs documentation',
      'Coordinate shipping/freight forwarding',
      'Confirm power requirements and compatibility',
      'Arrange local rigging and safety personnel',
      'Confirm venue access and load-in schedule',
      'Prepare equipment for international travel'
    ]
  },
  {
    id: 'final',
    title: 'Final Preparations',
    description: 'Last-minute confirmations and contingency planning',
    timeline: '1-2 weeks before departure',
    critical: false,
    tasks: [
      'Confirm all permits are approved and in hand',
      'Finalize crew travel arrangements',
      'Brief crew on local regulations and customs',
      'Prepare backup equipment list',
      'Confirm local emergency contacts',
      'Review and pack all documentation'
    ]
  }
];

const equipmentConsiderations = [
  {
    category: 'Power Systems',
    items: [
      'Voltage compatibility (110V vs 220V)',
      'Plug types and adapters needed',
      'Power distribution requirements',
      'Backup power considerations'
    ]
  },
  {
    category: 'Transportation',
    items: [
      'ATA Carnet for temporary import',
      'Packing for air freight',
      'Insurance for international transit',
      'Hazardous materials declarations'
    ]
  },
  {
    category: 'Compliance',
    items: [
      'CE marking verification',
      'Local electrical safety certification',
      'EMC compliance documentation',
      'Laser classification certificates'
    ]
  }
];

const commonIssues = [
  {
    issue: 'Documentation not in local language',
    solution: 'Arrange certified translation 4-6 weeks in advance',
    prevention: 'Research language requirements during initial assessment'
  },
  {
    issue: 'Power incompatibility',
    solution: 'Rent local power distribution or bring converters',
    prevention: 'Confirm voltage and connector types with venue'
  },
  {
    issue: 'Permit delays',
    solution: 'Engage local consultant to expedite',
    prevention: 'Apply for permits 8+ weeks in advance'
  },
  {
    issue: 'Equipment held in customs',
    solution: 'Have local agent and all documentation ready',
    prevention: 'Use experienced freight forwarder; ensure Carnet is properly executed'
  },
  {
    issue: 'Insurance not recognized locally',
    solution: 'Obtain local coverage or additional certificate',
    prevention: 'Verify insurance acceptance with venue/authorities in advance'
  }
];

export default function OverseasShowPlanner() {
  const [activeStage, setActiveStage] = useState<TripStage>(planningStages[0]);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  const toggleTask = (stageId: string, taskIdx: number) => {
    const key = `${stageId}-${taskIdx}`;
    const newCompleted = new Set(completedTasks);
    if (newCompleted.has(key)) {
      newCompleted.delete(key);
    } else {
      newCompleted.add(key);
    }
    setCompletedTasks(newCompleted);
  };

  const completedCount = completedTasks.size;
  const totalTasks = planningStages.reduce((acc, stage) => acc + stage.tasks.length, 0);
  const progress = Math.round((completedCount / totalTasks) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-800 to-indigo-700 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Plane className="w-8 h-8" />
          <h2 className="text-2xl font-bold">"I'm Taking My Show Overseas" Planner</h2>
        </div>
        <p className="text-white/80">
          A comprehensive guide to planning international laser show deployments. 
          Follow these stages to ensure smooth international operations.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400 text-sm">Planning Progress</span>
          <span className="text-white font-semibold">{completedCount} of {totalTasks} tasks ({progress}%)</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-purple-500 to-indigo-500 h-3 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stage Navigation */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-gray-300 font-semibold mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Planning Stages
          </h3>
          {planningStages.map((stage) => (
            <button
              key={stage.id}
              onClick={() => setActiveStage(stage)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                activeStage.id === stage.id
                  ? 'border-purple-500 bg-purple-900/20'
                  : 'border-gray-800 bg-gray-900 hover:border-gray-600'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-semibold">{stage.title}</span>
                {stage.critical && (
                  <span className="px-2 py-0.5 bg-red-900/50 text-red-400 text-xs rounded">Critical</span>
                )}
              </div>
              <p className="text-gray-400 text-xs">{stage.timeline}</p>
            </button>
          ))}
        </div>

        {/* Active Stage Detail */}
        <div className="lg:col-span-2">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 animate-in fade-in">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{activeStage.title}</h3>
                <p className="text-gray-400 text-sm mt-1">{activeStage.description}</p>
              </div>
              <div className="flex items-center gap-2 text-purple-400">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{activeStage.timeline}</span>
              </div>
            </div>

            {/* Task List */}
            <div className="space-y-3">
              <h4 className="text-gray-300 font-semibold flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Tasks
              </h4>
              {activeStage.tasks.map((task, idx) => {
                const isCompleted = completedTasks.has(`${activeStage.id}-${idx}`);
                return (
                  <button
                    key={idx}
                    onClick={() => toggleTask(activeStage.id, idx)}
                    className={`w-full flex items-start gap-3 p-3 rounded-lg border transition-all text-left ${
                      isCompleted
                        ? 'bg-green-900/20 border-green-700'
                        : 'bg-gray-800 border-gray-700 hover:border-gray-500'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isCompleted ? 'bg-green-500 border-green-500' : 'border-gray-500'
                    }`}>
                      {isCompleted && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    <span className={isCompleted ? 'text-gray-400 line-through' : 'text-gray-300'}>
                      {task}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Equipment Considerations */}
      <div className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 border border-amber-700/50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-amber-500" />
          Equipment Considerations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {equipmentConsiderations.map((cat) => (
            <div key={cat.category} className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-amber-400 font-semibold mb-3">{cat.category}</h4>
              <ul className="space-y-2">
                {cat.items.map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-300">
                    <span className="text-amber-500">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Common Issues */}
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          Common Issues & Solutions
        </h3>
        <div className="space-y-4">
          {commonIssues.map((issue, idx) => (
            <div key={idx} className="bg-gray-800 rounded-lg p-4 border-l-4 border-red-500">
              <p className="text-red-400 font-semibold mb-2">{issue.issue}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-amber-400 font-medium">Solution: </span>
                  <span className="text-gray-300">{issue.solution}</span>
                </div>
                <div>
                  <span className="text-green-400 font-medium">Prevention: </span>
                  <span className="text-gray-300">{issue.prevention}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Reference */}
      <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-xl p-6 border border-blue-700/50">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-400" />
          Quick Reference: Lead Times by Category
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { cat: 'A', time: '2-4 weeks', color: 'bg-green-500' },
            { cat: 'B', time: '4-6 weeks', color: 'bg-blue-500' },
            { cat: 'F', time: '6-10 weeks', color: 'bg-amber-500' },
            { cat: 'G', time: '10-16 weeks', color: 'bg-red-500' },
            { cat: 'X', time: '16+ weeks', color: 'bg-purple-600' }
          ].map((item) => (
            <div key={item.cat} className="bg-gray-900/50 rounded-lg p-3 text-center">
              <div className={`w-10 h-10 ${item.color} rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2`}>
                {item.cat}
              </div>
              <p className="text-gray-400 text-xs">Category {item.cat}</p>
              <p className="text-white font-semibold text-sm">{item.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
