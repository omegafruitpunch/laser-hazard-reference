'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const mpeData = [
  { wavelength: '400-700 nm', duration: '0.25 s', mpe: '0.00254 W/cm²' },
  { wavelength: '400-700 nm', duration: '10 s', mpe: '0.001 W/cm²' },
  { wavelength: '700-1050 nm', duration: '0.25 s', mpe: '0.005 W/cm²' },
];

export default function MPETableNavigator() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">MPE Table (ANSI Z136.1 Table 5a)</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Wavelength</th>
              <th className="text-left py-2">Duration</th>
              <th className="text-left py-2">MPE</th>
            </tr>
          </thead>
          <tbody>
            {mpeData.map((row, i) => (
              <tr key={i} className="border-b last:border-0">
                <td className="py-2">{row.wavelength}</td>
                <td className="py-2 text-muted-foreground">{row.duration}</td>
                <td className="py-2 font-mono text-green-500">{row.mpe}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
