'use client';

import { useState } from 'react';
import { FileText, Download, CheckCircle, AlertCircle, Globe, Printer, FileCheck } from 'lucide-react';

interface DocumentCategory {
  id: string;
  name: string;
  description: string;
  documents: DocumentItem[];
}

interface DocumentItem {
  id: string;
  name: string;
  description: string;
  required: boolean;
  categoryA: boolean;
  categoryB: boolean;
  categoryF: boolean;
  categoryG: boolean;
  categoryX: boolean;
  translation: boolean;
}

const documentCategories: DocumentCategory[] = [
  {
    id: 'regulatory',
    name: 'Regulatory Documentation',
    description: 'Permits, licenses, and regulatory approvals',
    documents: [
      { id: 'laser_permit', name: 'Laser Show Permit', description: 'Primary authorization for laser show operation', required: true, categoryA: false, categoryB: false, categoryF: true, categoryG: true, categoryX: true, translation: true },
      { id: 'venue_approval', name: 'Venue Approval Letter', description: 'Written approval from venue operator', required: true, categoryA: true, categoryB: true, categoryF: true, categoryG: true, categoryX: true, translation: false },
      { id: 'lso_designation', name: 'LSO Designation Letter', description: 'Formal appointment of Laser Safety Officer', required: true, categoryA: false, categoryB: true, categoryF: true, categoryG: true, categoryX: true, translation: true },
      { id: 'insurance_cert', name: 'Insurance Certificate', description: 'Proof of liability insurance coverage', required: true, categoryA: true, categoryB: true, categoryF: true, categoryG: true, categoryX: true, translation: true },
      { id: 'import_license', name: 'Equipment Import License', description: 'Authorization to temporarily import laser equipment', required: false, categoryA: false, categoryB: false, categoryF: false, categoryG: true, categoryX: true, translation: true },
      { id: 'work_permits', name: 'Work Permits / Visas', description: 'Legal authorization for crew to work', required: true, categoryA: true, categoryB: true, categoryF: true, categoryG: true, categoryX: true, translation: false }
    ]
  },
  {
    id: 'equipment',
    name: 'Equipment Documentation',
    description: 'Technical specifications and certifications',
    documents: [
      { id: 'laser_specs', name: 'Laser Equipment Specifications', description: 'Technical details of all laser systems', required: true, categoryA: true, categoryB: true, categoryF: true, categoryG: true, categoryX: true, translation: true },
      { id: 'classification_labels', name: 'Classification Labels / Certifications', description: 'IEC 60825-1 classification certificates', required: true, categoryA: true, categoryB: true, categoryF: true, categoryG: true, categoryX: true, translation: false },
      { id: 'power_specs', name: 'Power Requirements Documentation', description: 'Voltage, current, and connector specifications', required: true, categoryA: true, categoryB: true, categoryF: true, categoryG: true, categoryX: true, translation: false },
      { id: 'maintenance_records', name: 'Equipment Maintenance Records', description: 'Recent service and calibration records', required: true, categoryA: false, categoryB: true, categoryF: true, categoryG: true, categoryX: true, translation: false },
      { id: 'carnet', name: 'ATA Carnet (if applicable)', description: 'Temporary import/export document', required: false, categoryA: true, categoryB: true, categoryF: true, categoryG: true, categoryX: true, translation: false },
      { id: 'packing_list', name: 'Detailed Packing List', description: 'Complete inventory of equipment being shipped', required: true, categoryA: true, categoryB: true, categoryF: true, categoryG: true, categoryX: true, translation: true }
    ]
  },
  {
    id: 'safety',
    name: 'Safety Documentation',
    description: 'Safety plans, calculations, and procedures',
    documents: [
      { id: 'safety_plan', name: 'Laser Safety Plan', description: 'Comprehensive safety procedures for the show', required: true, categoryA: false, categoryB: true, categoryF: true, categoryG: true, categoryX: true, translation: true },
      { id: 'mpe_calcs', name: 'MPE Compliance Calculations', description: 'Maximum Permissible Exposure analysis', required: true, categoryA: false, categoryB: false, categoryF: true, categoryG: true, categoryX: true, translation: true },
      { id: 'noehd_calc', name: 'NOHD Calculations', description: 'Nominal Ocular Hazard Distance analysis', required: true, categoryA: false, categoryB: true, categoryF: true, categoryG: true, categoryX: true, translation: true },
      { id: 'beam_diagrams', name: 'Beam Path Diagrams', description: 'Technical drawings of beam layouts', required: true, categoryA: false, categoryB: true, categoryF: true, categoryG: true, categoryX: true, translation: false },
      { id: 'emergency_plan', name: 'Emergency Response Plan', description: 'Procedures for accidents or incidents', required: true, categoryA: true, categoryB: true, categoryF: true, categoryG: true, categoryX: true, translation: true },
      { id: 'risk_assessment', name: 'Risk Assessment Document', description: 'Hazard identification and mitigation', required: true, categoryA: false, categoryB: true, categoryF: true, categoryG: true, categoryX: true, translation: true }
    ]
  },
  {
    id: 'personnel',
    name: 'Personnel Documentation',
    description: 'Qualifications and training records',
    documents: [
      { id: 'lso_qualifications', name: 'LSO Qualification Certificates', description: 'Proof of Laser Safety Officer competency', required: true, categoryA: false, categoryB: true, categoryF: true, categoryG: true, categoryX: true, translation: true },
      { id: 'operator_certs', name: 'Operator Training Certificates', description: 'Laser operator training documentation', required: true, categoryA: false, categoryB: true, categoryF: true, categoryG: true, categoryX: true, translation: true },
      { id: 'crew_list', name: 'Crew List with Roles', description: 'Complete list of all personnel', required: true, categoryA: true, categoryB: true, categoryF: true, categoryG: true, categoryX: true, translation: true },
      { id: 'passport_copies', name: 'Passport Copies', description: 'Copies for all international crew', required: true, categoryA: true, categoryB: true, categoryF: true, categoryG: true, categoryX: true, translation: false },
      { id: 'medical_certs', name: 'Medical Certificates (if required)', description: 'Health clearances if mandated', required: false, categoryA: false, categoryB: false, categoryF: false, categoryG: true, categoryX: true, translation: true }
    ]
  },
  {
    id: 'show',
    name: 'Show Documentation',
    description: 'Show descriptions and presentation materials',
    documents: [
      { id: 'show_description', name: 'Detailed Show Description', description: 'Narrative description of the laser show', required: true, categoryA: false, categoryB: true, categoryF: true, categoryG: true, categoryX: true, translation: true },
      { id: 'show_script', name: 'Show Script / Cue List', description: 'Detailed timing and effect documentation', required: false, categoryA: false, categoryB: false, categoryF: true, categoryG: true, categoryX: true, translation: true },
      { id: 'venue_layout', name: 'Venue Layout Drawings', description: 'Floor plans showing laser positions', required: true, categoryA: false, categoryB: true, categoryF: true, categoryG: true, categoryX: true, translation: false },
      { id: 'audience_scanning', name: 'Audience Scanning Analysis', description: 'If applicable, MPE compliance for audience exposure', required: false, categoryA: false, categoryB: false, categoryF: true, categoryG: true, categoryX: true, translation: true },
      { id: 'rehearsal_schedule', name: 'Rehearsal / Setup Schedule', description: 'Timeline for installation and testing', required: false, categoryA: true, categoryB: true, categoryF: true, categoryG: true, categoryX: true, translation: false }
    ]
  }
];

const countriesByCategory: Record<string, string[]> = {
  'A': ['Mexico', 'Most Caribbean nations', 'Some Middle Eastern countries', 'Parts of Southeast Asia', 'Certain South American countries'],
  'B': ['Canada', 'Japan', 'South Korea', 'Switzerland', 'Norway', 'Denmark', 'Sweden'],
  'F': ['United States', 'Germany', 'France', 'United Kingdom', 'Australia', 'Netherlands', 'Belgium', 'Austria', 'Italy', 'Spain'],
  'G': ['China', 'Russia', 'Singapore', 'UAE', 'Qatar', 'Saudi Arabia (indoor)', 'India (select venues)'],
  'X': ['Saudi Arabia (outdoor)', 'India (general)', 'Certain African nations', 'Indonesia']
};

export default function DocumentationChecklistGenerator() {
  const [selectedCategory, setSelectedCategory] = useState<string>('F');
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [showTranslation, setShowTranslation] = useState(true);

  const toggleItem = (id: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedItems(newChecked);
  };

  const getApplicableDocuments = () => {
    const categoryKey = `category${selectedCategory}` as keyof DocumentItem;
    return documentCategories.map(cat => ({
      ...cat,
      documents: cat.documents.filter(doc => doc[categoryKey] as boolean)
    }));
  };

  const applicableDocs = getApplicableDocuments();
  const totalRequired = applicableDocs.reduce((acc, cat) => acc + cat.documents.filter(d => d.required).length, 0);
  const checkedRequired = applicableDocs.reduce((acc, cat) => 
    acc + cat.documents.filter(d => d.required && checkedItems.has(d.id)).length, 0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-700 to-cyan-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <FileCheck className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Documentation Checklist Generator</h2>
        </div>
        <p className="text-white/80">
          Generate a customized documentation checklist based on destination country category.
          Select your destination category to see required documents.
        </p>
      </div>

      {/* Category Selection */}
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
        <h3 className="text-gray-300 font-semibold mb-4 flex items-center gap-2">
          <Globe className="w-4 h-4" />
          Select Destination Category
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {['A', 'B', 'F', 'G', 'X'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`p-4 rounded-xl border-2 transition-all text-center ${
                selectedCategory === cat
                  ? 'border-teal-500 bg-teal-900/20'
                  : 'border-gray-700 bg-gray-800 hover:border-gray-500'
              }`}
            >
              <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center text-white font-bold text-xl mb-2 ${
                cat === 'A' ? 'bg-green-500' :
                cat === 'B' ? 'bg-blue-500' :
                cat === 'F' ? 'bg-amber-500' :
                cat === 'G' ? 'bg-red-500' : 'bg-purple-600'
              }`}>
                {cat}
              </div>
              <p className="text-white font-medium">Category {cat}</p>
            </button>
          ))}
        </div>

        {/* Category Description */}
        <div className="mt-4 p-4 bg-gray-800 rounded-lg">
          <p className="text-gray-300 text-sm">
            <strong className="text-white">Category {selectedCategory} Countries:</strong>{' '}
            {countriesByCategory[selectedCategory].join(', ')}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between bg-gray-900 border border-gray-700 rounded-lg p-4">
        <div className="flex items-center gap-4">
          <span className="text-gray-400">Checklist Progress:</span>
          <span className="text-white font-semibold">{checkedRequired} of {totalRequired} required items</span>
        </div>
        <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
          <input
            type="checkbox"
            checked={showTranslation}
            onChange={(e) => setShowTranslation(e.target.checked)}
            className="w-4 h-4 rounded border-gray-600"
          />
          Show translation requirements
        </label>
      </div>

      {/* Checklist */}
      <div className="space-y-6">
        {applicableDocs.map((category) => (
          <div key={category.id} className="bg-gray-900 border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-2">{category.name}</h3>
            <p className="text-gray-400 text-sm mb-4">{category.description}</p>
            
            <div className="space-y-3">
              {category.documents.map((doc) => (
                <div
                  key={doc.id}
                  className={`flex items-start gap-4 p-4 rounded-lg border transition-all ${
                    checkedItems.has(doc.id)
                      ? 'bg-green-900/10 border-green-700/50'
                      : doc.required
                      ? 'bg-red-900/10 border-red-700/50'
                      : 'bg-gray-800 border-gray-700'
                  }`}
                >
                  <button
                    onClick={() => toggleItem(doc.id)}
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      checkedItems.has(doc.id)
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-500 hover:border-gray-400'
                    }`}
                  >
                    {checkedItems.has(doc.id) && <CheckCircle className="w-4 h-4 text-white" />}
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-white font-medium">{doc.name}</span>
                      {doc.required && (
                        <span className="px-2 py-0.5 bg-red-900/50 text-red-400 text-xs rounded">
                          Required
                        </span>
                      )}
                      {showTranslation && doc.translation && (
                        <span className="px-2 py-0.5 bg-blue-900/50 text-blue-400 text-xs rounded flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          Translation needed
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">{doc.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors"
        >
          <Printer className="w-4 h-4" />
          Print Checklist
        </button>
        <button
          onClick={() => {
            const content = generateExportContent(selectedCategory, applicableDocs, checkedItems);
            downloadFile(content, `checklist-category-${selectedCategory}.txt`);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
        >
          <Download className="w-4 h-4" />
          Export List
        </button>
      </div>
    </div>
  );
}

function generateExportContent(category: string, docs: DocumentCategory[], checked: Set<string>): string {
  let content = `LASER SHOW DOCUMENTATION CHECKLIST - CATEGORY ${category}\n`;
  content += `Generated: ${new Date().toLocaleDateString()}\n`;
  content += `================================\n\n`;
  
  docs.forEach(cat => {
    content += `\n${cat.name.toUpperCase()}\n`;
    content += `${'='.repeat(cat.name.length)}\n`;
    cat.documents.forEach(doc => {
      const status = checked.has(doc.id) ? '[X]' : '[ ]';
      const required = doc.required ? ' (REQUIRED)' : '';
      content += `${status} ${doc.name}${required}\n`;
    });
  });
  
  return content;
}

function downloadFile(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
