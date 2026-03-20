'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const controls = [
  { name: 'Enclosure', level: 1 },
  { name: 'Interlocks', level: 1 },
  { name: 'Remote Interlock', level: 2 },
  { name: 'Key Control', level: 2 },
  { name: 'Warning Signs', level: 3 },
  { name: 'Procedures', level: 3 },
  { name: 'Training', level: 3 },
  { name: 'Eye Protection', level: 4 },
];

const levels = ['Elimination', 'Engineering', 'Administrative', 'PPE'];

export default function ControlHierarchy() {
  const [selected, setSelected] = useState<Record<string, number>>({});

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Control Measure Hierarchy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {controls.map((c) => (
              <Button
                key={c.name}
                variant={selected[c.name] === c.level ? 'default' : 'outline'}
                onClick={() => setSelected({ ...selected, [c.name]: c.level })}
                className="justify-start"
              >
                {c.name} → Level {c.level}
              </Button>
            ))}
          </div>
          <div className="p-3 bg-muted rounded text-sm">
            {levels.map((l, i) => {
              const levelNum = i + 1;
              const isHighlighted = Object.values(selected).includes(levelNum);
              return (
                <div key={l} className={isHighlighted ? 'font-bold text-primary' : ''}>
                  {levelNum}. {l}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
