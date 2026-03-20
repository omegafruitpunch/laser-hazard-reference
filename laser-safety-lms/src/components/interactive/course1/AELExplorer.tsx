'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const aelData = [
  { class: 'Class 1', power: '< 0.39 µW', note: 'Inherently safe' },
  { class: 'Class 2', power: '< 1 mW', note: 'Blink reflex adequate' },
  { class: 'Class 3R', power: '< 5 mW', note: 'Low risk normally' },
  { class: 'Class 3B', power: '< 500 mW', note: 'Direct viewing hazard' },
  { class: 'Class 4', power: '> 500 mW', note: 'Eye and skin hazard' },
];

export default function AELExplorer() {
  return (
    <div className="space-y-2">
      {aelData.map((row) => (
        <Card key={row.class}>
          <CardContent className="p-3 flex justify-between items-center">
            <div>
              <div className="font-semibold">{row.class}</div>
              <div className="text-sm text-muted-foreground">{row.power}</div>
            </div>
            <div className="text-xs text-right text-muted-foreground">{row.note}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
