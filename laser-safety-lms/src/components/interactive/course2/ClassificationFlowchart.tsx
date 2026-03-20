'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const questions = [
  { id: 1, text: 'Is the laser enclosed?', yes: 2, no: 3 },
  { id: 2, text: 'Accessible emission > Class 1 AEL?', yes: 3, no: 'Class 1' },
  { id: 3, text: 'Visible wavelength (400-700nm)?', yes: 4, no: 5 },
  { id: 4, text: 'Power < 1mW?', yes: 'Class 2', no: 5 },
  { id: 5, text: 'Power < 5mW?', yes: 'Class 3R', no: 6 },
  { id: 6, text: 'Power < 500mW?', yes: 'Class 3B', no: 'Class 4' },
];

export default function ClassificationFlowchart() {
  const [current, setCurrent] = useState(1);
  const [result, setResult] = useState<string | null>(null);

  const q = questions.find((x) => x.id === current);

  const answer = (res: boolean) => {
    if (!q) return;
    const next = res ? q.yes : q.no;
    if (typeof next === 'string') {
      setResult(next);
    } else {
      setCurrent(next);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">FDA Classification Wizard</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {result ? (
          <div className="text-center p-4 bg-green-500/10 rounded-lg">
            <div className="text-2xl font-bold text-green-500">{result}</div>
            <Button className="mt-4" onClick={() => { setCurrent(1); setResult(null); }}>Restart</Button>
          </div>
        ) : (
          <>
            <p className="text-center font-medium">{q?.text}</p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => answer(true)}>Yes</Button>
              <Button variant="outline" onClick={() => answer(false)}>No</Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
