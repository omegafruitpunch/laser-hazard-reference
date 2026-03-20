'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const surfaces = [
  { name: 'Mirror', hazard: 'Specular reflection - HIGH HAZARD', desc: 'Angle of incidence = Angle of reflection' },
  { name: 'White Paper', hazard: 'Diffuse reflection - MODERATE', desc: 'Scattered in all directions' },
  { name: 'Concrete', hazard: 'Diffuse reflection - LOW', desc: 'Rough surface scatters beam' },
  { name: 'Beam Dump', hazard: 'Absorption - SAFE', desc: 'Designed to absorb laser energy' },
];

export default function ReflectionHazardDemo() {
  const [selected, setSelected] = useState(0);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Reflection Hazard Simulator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {surfaces.map((s, i) => (
              <Button key={s.name} variant={selected === i ? 'default' : 'outline'} onClick={() => setSelected(i)}>
                {s.name}
              </Button>
            ))}
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <div className="font-semibold text-red-500">{surfaces[selected].hazard}</div>
            <div className="text-sm text-muted-foreground mt-1">{surfaces[selected].desc}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
