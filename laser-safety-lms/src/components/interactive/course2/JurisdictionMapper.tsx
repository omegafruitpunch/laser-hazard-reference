'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const scenarios = [
  { q: 'Manufacturing laser products', answer: 'FDA CDRH (21 CFR 1040)' },
  { q: 'Workplace laser safety', answer: 'OSHA + State OSHA' },
  { q: 'Entertainment laser shows', answer: 'FDA Variance + State + Local' },
  { q: 'End user operations', answer: 'ANSI Z136.1 + State regulations' },
];

export default function JurisdictionMapper() {
  const [idx, setIdx] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const nextScenario = () => {
    setIdx((i) => (i + 1) % scenarios.length);
    setShowAnswer(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Who Regulates What?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-muted rounded-lg">
          <div className="font-medium mb-2">Scenario:</div>
          <div>{scenarios[idx].q}</div>
        </div>
        
        {showAnswer ? (
          <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
            <div className="font-medium mb-2 text-primary">Regulatory Authority:</div>
            <span className="font-semibold">{scenarios[idx].answer}</span>
          </div>
        ) : (
          <Button onClick={() => setShowAnswer(true)} variant="default" className="w-full">
            Show Answer
          </Button>
        )}
        
        <Button 
          onClick={nextScenario} 
          variant="outline" 
          className="w-full"
          disabled={!showAnswer}
        >
          Next Scenario →
        </Button>
        
        <div className="text-center text-xs text-muted-foreground">
          Scenario {idx + 1} of {scenarios.length}
        </div>
      </CardContent>
    </Card>
  );
}
