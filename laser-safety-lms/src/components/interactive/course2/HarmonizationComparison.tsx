'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const comparisons = [
  { aspect: 'Classification', fda: 'Class I-IV', iec: 'Class 1-4' },
  { aspect: 'Aperture', fda: '7mm', iec: '7mm (modified)' },
  { aspect: 'Measurement', fda: '21 CFR 1040.10', iec: 'IEC 60825-1' },
];

export default function HarmonizationComparison() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">FDA vs IEC Harmonization</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Aspect</th>
              <th className="text-left py-2">FDA</th>
              <th className="text-left py-2">IEC 60825-1</th>
            </tr>
          </thead>
          <tbody>
            {comparisons.map((c) => (
              <tr key={c.aspect} className="border-b last:border-0">
                <td className="py-2 font-medium">{c.aspect}</td>
                <td className="py-2 text-muted-foreground">{c.fda}</td>
                <td className="py-2 text-muted-foreground">{c.iec}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
