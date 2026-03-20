'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const reports = [
  { type: 'Product Report', when: 'Before introducing product to commerce', deadline: 'Before sale' },
  { type: 'Supplemental Report', when: 'Product modifications affecting safety', deadline: '30 days' },
  { type: 'Annual Report', when: 'Yearly sales/distribution summary', deadline: 'September 1' },
];

export default function ReportTypeSelector() {
  return (
    <div className="space-y-2">
      {reports.map((r) => (
        <Card key={r.type}>
          <CardContent className="p-3">
            <div className="font-semibold">{r.type}</div>
            <div className="text-sm text-muted-foreground">When: {r.when}</div>
            <div className="text-sm text-muted-foreground">Deadline: {r.deadline}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
