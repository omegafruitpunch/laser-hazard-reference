'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Activity, Shield } from 'lucide-react';

interface EyeStructure {
  id: string;
  name: string;
  hazard: string;
  damage: string;
  wavelengths: string;
  color: string;
  permanent: boolean;
}

const structures: EyeStructure[] = [
  { 
    id: 'cornea',
    name: 'Cornea', 
    hazard: 'UV and Far-IR absorption', 
    damage: 'Photokeratitis, burns',
    wavelengths: '180-315nm UV-B/C, >1400nm Far-IR',
    color: '#3B82F6',
    permanent: false
  },
  { 
    id: 'lens',
    name: 'Lens', 
    hazard: 'UV-A absorption (315-400nm)', 
    damage: 'Cataracts (requires surgery)',
    wavelengths: '300-400nm UV-A',
    color: '#EAB308',
    permanent: true
  },
  { 
    id: 'retina',
    name: 'Retina', 
    hazard: 'Visible and Near-IR (400-1400nm)', 
    damage: 'Permanent blind spots - NO REGENERATION',
    wavelengths: '400-1400nm (Retinal Hazard Region)',
    color: '#EF4444',
    permanent: true
  },
];

export default function EyeAnatomyExplorer() {
  const [selected, setSelected] = useState(0);
  const current = structures[selected];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          <span>Eye Anatomy & Laser Hazards</span>
          {current.permanent && (
            <Badge variant="destructive" className="text-xs animate-pulse">
              <AlertTriangle className="w-3 h-3 mr-1" />
              No Healing
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Structure Selector Buttons */}
        <div className="flex gap-2">
          {structures.map((s, i) => (
            <Button
              key={s.id}
              variant={selected === i ? 'default' : 'outline'}
              onClick={() => setSelected(i)}
              className="flex-1 transition-all duration-300"
              style={{
                backgroundColor: selected === i ? s.color : undefined,
                borderColor: s.color,
              }}
            >
              {s.name}
            </Button>
          ))}
        </div>

        {/* Info Panel with Smooth Transition */}
        <div 
          className="p-4 bg-muted rounded-lg transition-all duration-300 border-l-4"
          style={{ borderLeftColor: current.color }}
          key={current.id}
        >
          <div className="flex items-start gap-2">
            <Shield className="w-5 h-5 mt-0.5" style={{ color: current.color }} />
            <div className="flex-1">
              <div className="font-semibold" style={{ color: current.color }}>
                {current.hazard}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {current.wavelengths}
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t flex items-start gap-2">
            <Activity className="w-4 h-4 mt-0.5 text-red-500" />
            <div>
              <span className="text-sm font-medium">Damage: </span>
              <span className="text-sm text-muted-foreground">{current.damage}</span>
            </div>
          </div>
        </div>

        {/* Enhanced SVG Diagram */}
        <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-lg p-4">
          <svg viewBox="0 0 240 140" className="w-full h-40">
            <defs>
              {/* Gradients for structures */}
              <linearGradient id="corneaGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={selected === 0 ? '#60A5FA' : '#BFDBFE'} />
                <stop offset="100%" stopColor={selected === 0 ? '#3B82F6' : '#93C5FD'} />
              </linearGradient>
              <linearGradient id="lensGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={selected === 1 ? '#FCD34D' : '#FEF08A'} />
                <stop offset="100%" stopColor={selected === 1 ? '#F59E0B' : '#FDE68A'} />
              </linearGradient>
              <radialGradient id="retinaGrad">
                <stop offset="0%" stopColor={selected === 2 ? '#EF4444' : '#FECACA'} />
                <stop offset="100%" stopColor={selected === 2 ? '#DC2626' : '#FCA5A5'} />
              </radialGradient>
              
              {/* Glow filter for selected structure */}
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Sclera (white of eye) */}
            <ellipse 
              cx="120" cy="70" rx="100" ry="60" 
              fill="#F8FAFC" 
              stroke="#94A3B8" 
              strokeWidth="2"
            />
            
            {/* Cornea */}
            <path 
              d="M 30,70 Q 50,40 100,45 Q 150,50 170,70 Q 150,90 100,95 Q 50,100 30,70 Z" 
              fill="url(#corneaGrad)"
              stroke={selected === 0 ? '#2563EB' : '#60A5FA'}
              strokeWidth={selected === 0 ? '4' : '2'}
              className="transition-all duration-300 cursor-pointer"
              filter={selected === 0 ? 'url(#glow)' : undefined}
              onClick={() => setSelected(0)}
            />
            <text x="100" y="75" textAnchor="middle" className="text-[10px] fill-blue-700 font-medium pointer-events-none">
              Cornea
            </text>
            
            {/* Aqueous humor */}
            <path 
              d="M 100,45 Q 120,48 130,60 L 130,80 Q 120,92 100,95 Z" 
              fill="#E9D5FF" 
              fillOpacity="0.3"
            />
            
            {/* Pupil */}
            <circle cx="115" cy="70" r="10" fill="#1F2937" />
            
            {/* Iris */}
            <ellipse cx="118" cy="70" rx="20" ry="20" fill="none" stroke="#8B5CF6" strokeWidth="3" strokeOpacity="0.3" />
            
            {/* Lens */}
            <path 
              d="M 130,55 Q 145,60 145,70 Q 145,80 130,85 Q 135,70 130,55 Z" 
              fill="url(#lensGrad)"
              stroke={selected === 1 ? '#F59E0B' : '#FCD34D'}
              strokeWidth={selected === 1 ? '4' : '2'}
              className="transition-all duration-300 cursor-pointer"
              filter={selected === 1 ? 'url(#glow)' : undefined}
              onClick={() => setSelected(1)}
            />
            <text x="137" y="73" textAnchor="middle" className="text-[9px] fill-yellow-700 font-medium pointer-events-none">
              Lens
            </text>
            
            {/* Vitreous */}
            <path 
              d="M 145,60 Q 170,55 200,70 Q 170,85 145,80 Z" 
              fill="#F3E8FF" 
              fillOpacity="0.2"
            />
            
            {/* Retina */}
            <path 
              d="M 200,50 Q 215,50 220,70 Q 215,90 200,90 Q 185,90 180,70 Q 185,50 200,50 Z" 
              fill="url(#retinaGrad)"
              stroke={selected === 2 ? '#DC2626' : '#F87171'}
              strokeWidth={selected === 2 ? '4' : '2'}
              className="transition-all duration-300 cursor-pointer"
              filter={selected === 2 ? 'url(#glow)' : undefined}
              onClick={() => setSelected(2)}
            />
            
            {/* Macula indicator */}
            <circle cx="205" cy="70" r="4" fill="#DC2626">
              {selected === 2 && (
                <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite" />
              )}
            </circle>
            <text x="205" y="45" textAnchor="middle" className="text-[8px] fill-red-600 font-medium">
              Retina
            </text>
            <text x="205" y="55" textAnchor="middle" className="text-[7px] fill-red-500">
              (Macula)
            </text>
            
            {/* Laser beam indicator */}
            <line x1="10" y1="70" x2="30" y2="70" stroke="#EF4444" strokeWidth="2" strokeDasharray="4 2">
              <animate attributeName="stroke-dashoffset" values="0;12" dur="0.5s" repeatCount="indefinite" />
            </line>
            <text x="15" y="60" className="text-xs fill-red-500 font-medium">Laser</text>
            
            {/* Hazard zone indicators */}
            {selected === 0 && (
              <g className="animate-in fade-in duration-500">
                <path d="M 30,30 L 100,35 L 170,30" fill="none" stroke="#3B82F6" strokeWidth="2" markerEnd="url(#arrow)" />
                <text x="100" y="25" textAnchor="middle" className="text-xs fill-blue-600 font-bold">UV/Far-IR Zone</text>
              </g>
            )}
            {selected === 1 && (
              <g className="animate-in fade-in duration-500">
                <circle cx="137" cy="70" r="25" fill="none" stroke="#F59E0B" strokeWidth="2" strokeDasharray="4 2" />
                <text x="137" y="35" textAnchor="middle" className="text-xs fill-yellow-600 font-bold">UV-A Zone</text>
              </g>
            )}
            {selected === 2 && (
              <g className="animate-in fade-in duration-500">
                <path d="M 170,70 L 200,70" stroke="#EF4444" strokeWidth="3">
                  <animate attributeName="stroke-width" values="3;6;3" dur="1s" repeatCount="indefinite" />
                </path>
                <text x="185" y="105" textAnchor="middle" className="text-xs fill-red-600 font-bold">⚠️ 100,000x Focus</text>
              </g>
            )}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex gap-2 text-xs text-muted-foreground justify-center">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-blue-400" />
            Absorbs UV/Far-IR
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-yellow-400" />
            Absorbs UV-A
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-red-400" />
            Focuses Visible/NIR
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
