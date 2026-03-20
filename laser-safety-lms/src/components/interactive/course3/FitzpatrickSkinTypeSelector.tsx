'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sun, AlertTriangle, Shield, Info } from 'lucide-react';

interface SkinType {
  type: string;
  name: string;
  desc: string;
  risk: string;
  riskLevel: 'highest' | 'high' | 'moderate' | 'lower' | 'lowest';
  melanin: number; // percentage
  color: string;
  features: string[];
  laserConsiderations: string;
}

const skinTypes: SkinType[] = [
  { 
    type: 'I', 
    name: 'Very Fair',
    desc: 'Always burns, never tans', 
    risk: 'Highest UV sensitivity',
    riskLevel: 'highest',
    melanin: 5,
    color: '#FEF3C7',
    features: ['Pale white skin', 'Red or blonde hair', 'Blue/green eyes', 'Freckles'],
    laserConsiderations: 'Highest risk for UV damage. Melanin provides minimal protection. Extra caution with UV lasers.'
  },
  { 
    type: 'II', 
    name: 'Fair',
    desc: 'Usually burns, tans minimally', 
    risk: 'High UV sensitivity',
    riskLevel: 'high',
    melanin: 15,
    color: '#FDE68A',
    features: ['Fair skin', 'Blonde or light brown hair', 'Any eye color', 'May have freckles'],
    laserConsiderations: 'High risk for UV damage. Limited natural protection. Use protective measures with all laser classes.'
  },
  { 
    type: 'III', 
    name: 'Medium',
    desc: 'Sometimes burns, tans gradually', 
    risk: 'Moderate UV sensitivity',
    riskLevel: 'moderate',
    melanin: 30,
    color: '#FCD34D',
    features: ['Cream white to olive skin', 'Darker blonde to brown hair', 'Brown or hazel eyes'],
    laserConsiderations: 'Moderate natural protection. Standard laser safety protocols apply. UV protection still essential.'
  },
  { 
    type: 'IV', 
    name: 'Olive',
    desc: 'Rarely burns, tans easily', 
    risk: 'Moderate UV sensitivity',
    riskLevel: 'moderate',
    melanin: 45,
    color: '#F59E0B',
    features: ['Olive or light brown skin', 'Dark brown hair', 'Brown eyes'],
    laserConsiderations: 'Good natural melanin protection. However, visible/NIR lasers may cause more surface heating due to melanin absorption.'
  },
  { 
    type: 'V', 
    name: 'Brown',
    desc: 'Very rarely burns, tans darkly', 
    risk: 'Lower UV sensitivity',
    riskLevel: 'lower',
    melanin: 65,
    color: '#D97706',
    features: ['Brown skin', 'Dark brown to black hair', 'Dark brown eyes'],
    laserConsiderations: 'Strong UV protection from melanin. Caution: Higher melanin increases absorption of visible/NIR wavelengths.'
  },
  { 
    type: 'VI', 
    name: 'Dark Brown',
    desc: 'Never burns, deeply pigmented', 
    risk: 'Lowest UV sensitivity',
    riskLevel: 'lowest',
    melanin: 85,
    color: '#92400E',
    features: ['Dark brown to black skin', 'Black hair', 'Dark brown eyes'],
    laserConsiderations: 'Maximum UV protection. Note: High melanin content increases risk of thermal injury from visible/NIR lasers due to surface absorption.'
  },
];

const getRiskColor = (level: SkinType['riskLevel']) => {
  switch (level) {
    case 'highest': return 'text-red-600 bg-red-50 border-red-200';
    case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'lower': return 'text-green-600 bg-green-50 border-green-200';
    case 'lowest': return 'text-blue-600 bg-blue-50 border-blue-200';
  }
};

const getRiskBadgeVariant = (level: SkinType['riskLevel']) => {
  switch (level) {
    case 'highest': return 'destructive';
    case 'high': return 'default';
    case 'moderate': return 'secondary';
    case 'lower':
    case 'lowest': return 'outline';
  }
};

export default function FitzpatrickSkinTypeSelector() {
  const [selected, setSelected] = useState<number>(2); // Default to Type III
  const current = skinTypes[selected];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Sun className="w-4 h-4 text-yellow-500" />
          Fitzpatrick Skin Type & Laser Risk
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Skin Type Selector - Visual Buttons */}
        <div className="flex gap-1">
          {skinTypes.map((s, i) => (
            <button
              key={s.type}
              onClick={() => setSelected(i)}
              className={`flex-1 min-w-[50px] py-2 px-1 rounded-lg border-2 transition-all duration-300 ${
                selected === i 
                  ? 'border-primary scale-105 shadow-md' 
                  : 'border-transparent hover:border-muted'
              }`}
              style={{ backgroundColor: selected === i ? s.color : `${s.color}80` }}
            >
              <div className="text-xs font-bold text-foreground">{s.type}</div>
            </button>
          ))}
        </div>

        {/* Main Info Panel with Animation */}
        <div 
          className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-300"
          key={current.type}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Type {current.type} - {current.name}</h3>
              <p className="text-sm text-muted-foreground">{current.desc}</p>
            </div>
            <Badge variant={getRiskBadgeVariant(current.riskLevel)} className="text-xs">
              {current.risk} Risk
            </Badge>
          </div>

          {/* Melanin Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Melanin Content</span>
              <span>{current.melanin}%</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-500 ease-out rounded-full"
                style={{ 
                  width: `${current.melanin}%`,
                  background: `linear-gradient(to right, #FEF3C7, ${current.color})`
                }}
              />
            </div>
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-1">
            {current.features.map((feature, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>

          {/* Laser Risk Assessment */}
          <div className={`p-3 rounded-lg border ${getRiskColor(current.riskLevel)}`}>
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-sm">Laser Safety Consideration</div>
                <p className="text-xs mt-1 opacity-90">{current.laserConsiderations}</p>
              </div>
            </div>
          </div>

          {/* UV vs Visible/NIR Comparison */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded border border-purple-200 dark:border-purple-900">
              <div className="flex items-center gap-1 text-purple-700 dark:text-purple-400">
                <Sun className="w-3 h-3" />
                <span className="text-xs font-medium">UV Laser Risk</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {current.melanin < 30 ? 'Highest - minimal protection' : 
                 current.melanin < 50 ? 'Moderate - some protection' : 
                 'Lower - good melanin protection'}
              </p>
            </div>
            <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded border border-red-200 dark:border-red-900">
              <div className="flex items-center gap-1 text-red-700 dark:text-red-400">
                <Shield className="w-3 h-3" />
                <span className="text-xs font-medium">Visible/NIR Risk</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {current.melanin > 60 ? 'Higher surface heating' : 
                 current.melanin > 40 ? 'Moderate absorption' : 
                 'Deeper penetration, less surface heating'}
              </p>
            </div>
          </div>

          {/* Key Insight */}
          <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              <strong>Key Concept:</strong> Melanin paradox - while it protects against UV damage, 
              it increases absorption of visible and near-IR laser wavelengths (400-1400 nm), 
              potentially causing more surface heating in darker skin types.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
