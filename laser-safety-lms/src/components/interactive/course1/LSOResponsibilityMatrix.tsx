'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

const responsibilities = [
  'Hazard evaluation',
  'Control measure implementation',
  'Personnel training',
  'Safety program oversight',
  'Incident investigation',
];

export default function LSOResponsibilityMatrix() {
  const [checked, setChecked] = useState<boolean[]>(new Array(responsibilities.length).fill(false));

  const toggle = (i: number) => {
    const next = [...checked];
    next[i] = !next[i];
    setChecked(next);
  };

  const progress = (checked.filter(Boolean).length / responsibilities.length) * 100;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">LSO Responsibilities Checklist</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={progress} />
          <div className="space-y-2">
            {responsibilities.map((r, i) => (
              <div key={r} className="flex items-center gap-2">
                <Checkbox id={`r${i}`} checked={checked[i]} onCheckedChange={() => toggle(i)} />
                <Label htmlFor={`r${i}`}>{r}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
