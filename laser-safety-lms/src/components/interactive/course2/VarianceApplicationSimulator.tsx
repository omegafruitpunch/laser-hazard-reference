'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const requirements = [
  'Laser product description',
  'Show/site description',
  'Safety measures',
  'Operator qualifications',
  'MPE calculations',
];

export default function VarianceApplicationSimulator() {
  const [checked, setChecked] = useState<boolean[]>(new Array(requirements.length).fill(false));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Variance Application Checklist (Form 3147)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {requirements.map((r, i) => (
            <div key={r} className="flex items-center gap-2">
              <Checkbox
                checked={checked[i]}
                onCheckedChange={(v) => {
                  const next = [...checked];
                  next[i] = !!v;
                  setChecked(next);
                }}
              />
              <Label>{r}</Label>
            </div>
          ))}
        </div>
        <div className="text-sm text-muted-foreground">
          Completed: {checked.filter(Boolean).length} / {requirements.length}
        </div>
      </CardContent>
    </Card>
  );
}
