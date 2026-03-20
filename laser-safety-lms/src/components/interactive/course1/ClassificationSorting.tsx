'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const items = [
  { name: 'Laser Pointer', class: 2 },
  { name: 'Laser Scanner', class: 3 },
  { name: 'DVD Player', class: 1 },
  { name: 'Industrial Cutter', class: 4 },
];

export default function ClassificationSorting() {
  const [sorted, setSorted] = useState<Record<string, number>>({});

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sort by Laser Class</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {items.map((item) => (
            <div key={item.name} className="flex items-center justify-between p-2 border rounded">
              <span>{item.name}</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((c) => (
                  <Button
                    key={c}
                    size="sm"
                    variant={sorted[item.name] === c ? 'default' : 'outline'}
                    onClick={() => setSorted({ ...sorted, [item.name]: c })}
                  >
                    Class {c}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
