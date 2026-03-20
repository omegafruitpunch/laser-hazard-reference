'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Shield, AlertTriangle, AlertOctagon, Eye, Info } from 'lucide-react';

interface LaserClass {
  name: string;
  shortName: string;
  desc: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ReactNode;
  hazardLevel: 'none' | 'minimal' | 'low' | 'moderate' | 'high';
  powerLimit: string;
  examples: string[];
  controls: string[];
}

const classes: LaserClass[] = [
  { 
    name: 'Class 1', 
    shortName: '1',
    desc: 'Safe under normal use',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-500',
    borderColor: 'border-emerald-600',
    icon: <Shield className="w-5 h-5" aria-hidden="true" />,
    hazardLevel: 'none',
    powerLimit: '< 0.39 µW',
    examples: ['CD/DVD players', 'Laser printers', 'Barcode scanners'],
    controls: ['Protective housing', 'Safety interlocks']
  },
  { 
    name: 'Class 2', 
    shortName: '2',
    desc: 'Low power visible - blink reflex protects',
    color: 'text-amber-700',
    bgColor: 'bg-amber-500',
    borderColor: 'border-amber-600',
    icon: <Eye className="w-5 h-5" aria-hidden="true" />,
    hazardLevel: 'minimal',
    powerLimit: '< 1 mW',
    examples: ['Laser pointers', 'Presentation pointers', 'Alignment lasers'],
    controls: ['Warning labels', 'Do not stare into beam']
  },
  { 
    name: 'Class 3R', 
    shortName: '3R',
    desc: 'Low risk, marginally above Class 2',
    color: 'text-orange-700',
    bgColor: 'bg-orange-400',
    borderColor: 'border-orange-500',
    icon: <Info className="w-5 h-5" aria-hidden="true" />,
    hazardLevel: 'low',
    powerLimit: '< 5 mW (visible)',
    examples: ['Higher power pointers', 'Some measurement devices'],
    controls: ['Avoid eye exposure', 'Key control optional']
  },
  { 
    name: 'Class 3B', 
    shortName: '3B',
    desc: 'Direct viewing hazardous',
    color: 'text-orange-800',
    bgColor: 'bg-orange-600',
    borderColor: 'border-orange-700',
    icon: <AlertTriangle className="w-5 h-5" aria-hidden="true" />,
    hazardLevel: 'moderate',
    powerLimit: '< 500 mW',
    examples: ['Research lasers', 'Medical lasers', 'Spectroscopy lasers'],
    controls: ['Key control', 'Protective eyewear', 'Warning signs']
  },
  { 
    name: 'Class 4', 
    shortName: '4',
    desc: 'High power - Eye and skin hazard',
    color: 'text-red-800',
    bgColor: 'bg-red-600',
    borderColor: 'border-red-700',
    icon: <AlertOctagon className="w-5 h-5" aria-hidden="true" />,
    hazardLevel: 'high',
    powerLimit: '> 500 mW',
    examples: ['Industrial cutting/welding', 'Surgical lasers', 'Research lasers'],
    controls: ['All Class 3B controls', 'Controlled area', 'SOP required', 'Training mandatory']
  },
];

const hazardLabels: Record<string, { text: string; pattern: string }> = {
  none: { text: 'No Hazard', pattern: '' },
  minimal: { text: 'Minimal Hazard', pattern: '▪' },
  low: { text: 'Low Hazard', pattern: '▪▪' },
  moderate: { text: 'Moderate Hazard', pattern: '▪▪▪' },
  high: { text: 'High Hazard', pattern: '▪▪▪▪▪' },
};

interface ClassificationPyramidProps {
  compact?: boolean;
  interactive?: boolean;
}

export default function ClassificationPyramid({ compact = false, interactive = true }: ClassificationPyramidProps) {
  const [expandedClass, setExpandedClass] = useState<string | null>(null);

  const toggleExpand = (className: string) => {
    if (interactive) {
      setExpandedClass(expandedClass === className ? null : className);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, className: string) => {
    if (interactive && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      toggleExpand(className);
    }
  };

  if (compact) {
    return (
      <div className="space-y-2" role="list" aria-label="Laser classification pyramid - compact view">
        {classes.map((c) => (
          <div
            key={c.name}
            className={`${c.bgColor} text-white p-2 rounded-lg flex items-center justify-between`}
            role="listitem"
          >
            <div className="flex items-center gap-2">
              {c.icon}
              <span className="font-bold text-sm">{c.name}</span>
            </div>
            <span className="text-xs opacity-90">{c.desc}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4" role="region" aria-label="Laser classification pyramid">
      <div className="text-sm text-muted-foreground mb-4">
        Click on each class to learn more about hazards and required controls.
      </div>
      
      <div className="space-y-3" role="list">
        {classes.map((c, index) => {
          const isExpanded = expandedClass === c.name;
          const hazardInfo = hazardLabels[c.hazardLevel];
          
          return (
            <div
              key={c.name}
              className={`${c.bgColor} text-white rounded-lg transition-all overflow-hidden focus-within:ring-2 focus-within:ring-white focus-within:ring-inset`}
              style={{
                marginLeft: `${index * 12}px`,
                marginRight: `${(classes.length - 1 - index) * 12}px`,
              }}
              role="listitem"
            >
              <button
                onClick={() => toggleExpand(c.name)}
                onKeyDown={(e) => handleKeyDown(e, c.name)}
                className="w-full p-4 flex items-center justify-between focus:outline-none"
                aria-expanded={isExpanded}
                aria-controls={`class-details-${c.shortName}`}
                aria-label={`${c.name}: ${c.desc}. Hazard level: ${hazardInfo.text}`}
                tabIndex={interactive ? 0 : -1}
              >
                <div className="flex items-center gap-3">
                  {c.icon}
                  <div className="text-left">
                    <div className="font-bold text-lg">{c.name}</div>
                    <div className="text-xs opacity-90">{c.desc}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-white/20 text-white border-0">
                    {hazardInfo.pattern} {hazardInfo.text}
                  </Badge>
                  {interactive && (
                    isExpanded ? (
                      <ChevronUp className="w-5 h-5" aria-hidden="true" />
                    ) : (
                      <ChevronDown className="w-5 h-5" aria-hidden="true" />
                    )
                  )}
                </div>
              </button>
              
              {isExpanded && interactive && (
                <div 
                  id={`class-details-${c.shortName}`}
                  className="px-4 pb-4 bg-black/20"
                >
                  <div className="grid md:grid-cols-2 gap-4 pt-2">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Power Limit</h4>
                      <p className="text-sm opacity-90">{c.powerLimit}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Common Examples</h4>
                      <ul className="text-sm opacity-90 space-y-1">
                        {c.examples.map((example, i) => (
                          <li key={i}>• {example}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="md:col-span-2">
                      <h4 className="font-semibold text-sm mb-2">Required Controls</h4>
                      <div className="flex flex-wrap gap-2">
                        {c.controls.map((control, i) => (
                          <Badge 
                            key={i} 
                            variant="outline" 
                            className="bg-white/10 text-white border-white/30"
                          >
                            {control}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="p-3 bg-muted rounded-lg text-sm">
        <div className="font-semibold mb-2">Hazard Level Legend:</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {Object.entries(hazardLabels).map(([level, info]) => (
            <div key={level} className="flex items-center gap-2">
              <span className="text-muted-foreground">{info.pattern}</span>
              <span className="capitalize">{info.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
