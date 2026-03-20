'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const scenarios = [
  { id: 'product', text: 'Introducing a new laser product', form: 'FDA Form 3632 (Product Report)' },
  { id: 'supplement', text: 'Product modification', form: 'FDA Form 3632 (Supplemental Report)' },
  { id: 'annual', text: 'Annual sales report', form: 'FDA Form 3636 (Annual Report)' },
  { id: 'variance', text: 'Entertainment laser variance', form: 'FDA Form 3147 (Variance)' },
];

export default function FormSelectionWizard() {
  const [selected, setSelected] = useState<string | null>(null);

  const result = scenarios.find((s) => s.id === selected);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Which FDA Form Do I Need?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-2">
          {scenarios.map((s) => (
            <Button
              key={s.id}
              variant={selected === s.id ? 'default' : 'outline'}
              onClick={() => setSelected(s.id)}
              className="justify-start"
            >
              {s.text}
            </Button>
          ))}
        </div>
        {result && (
          <div className="p-4 bg-muted rounded-lg">
            <div className="font-semibold">{result.form}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
