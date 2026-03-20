'use client';

import { Card, CardContent } from '@/components/ui/card';

export default function LaserPropertyComparison() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardContent className="p-4">
          <h4 className="font-bold mb-2">Laser Light</h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Coherent (in-phase)</li>
            <li>• Monochromatic</li>
            <li>• Low divergence</li>
            <li>• Can be collimated</li>
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <h4 className="font-bold mb-2">Conventional Light</h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Incoherent (random phase)</li>
            <li>• Polychromatic</li>
            <li>• High divergence</li>
            <li>• Cannot be collimated</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
