'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const milestones = [
  { year: '1960', event: 'First laser demonstrated' },
  { year: '1976', event: '21 CFR 1040 enacted' },
  { year: '1985', event: 'Laser Notice 48' },
  { year: '2023', event: 'Latest harmonization updates' },
];

export default function RegulatoryTimeline() {
  return (
    <div className="space-y-2">
      {milestones.map((m) => (
        <Card key={m.year}>
          <CardContent className="p-3 flex gap-4 items-center">
            <div className="font-bold text-primary min-w-[60px]">{m.year}</div>
            <div>{m.event}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
