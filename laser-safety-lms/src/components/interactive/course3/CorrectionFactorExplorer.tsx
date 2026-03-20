'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const factors = [
  { name: 'CA', desc: 'Wavelength correction (400-700nm)', range: '1.0' },
  { name: 'CB', desc: 'IR correction (700-1050nm)', range: '10^((λ-700)/500)' },
  { name: 'CC', desc: 'Far-IR correction (>1050nm)', range: '8.0' },
  { name: 'CE', desc: 'Extended source', range: 'α/αmin' },
];

export default function CorrectionFactorExplorer() {
  return (
    <div className="space-y-2">
      {factors.map((f) => (
        <Card key={f.name}>
          <CardContent className="p-3">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-bold text-primary">{f.name}</div>
                <div className="text-sm text-muted-foreground">{f.desc}</div>
              </div>
              <div className="text-xs font-mono bg-muted px-2 py-1 rounded">
                {f.range}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
