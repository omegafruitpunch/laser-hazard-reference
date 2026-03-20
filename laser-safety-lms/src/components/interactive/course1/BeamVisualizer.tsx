'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function BeamVisualizer() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Beam Divergence Visualization</CardTitle>
      </CardHeader>
      <CardContent>
        <svg viewBox="0 0 400 200" className="w-full h-48">
          {/* Laser source */}
          <circle cx="30" cy="100" r="15" fill="#FF0000" />
          <text x="30" y="140" textAnchor="middle" className="text-xs fill-current">Source</text>
          
          {/* Beam */}
          <path d="M 45 100 L 350 60 L 350 140 Z" fill="rgba(255,0,0,0.2)" stroke="#FF0000" strokeWidth="2" />
          
          {/* NOHD marker */}
          <line x1="350" y1="60" x2="350" y2="140" stroke="#00FF00" strokeWidth="3" strokeDasharray="5,5" />
          <text x="350" y="160" textAnchor="middle" className="text-xs fill-green-500">NOHD</text>
          
          {/* Labels */}
          <text x="200" y="85" textAnchor="middle" className="text-xs fill-current">Diverging Beam</text>
        </svg>
      </CardContent>
    </Card>
  );
}
