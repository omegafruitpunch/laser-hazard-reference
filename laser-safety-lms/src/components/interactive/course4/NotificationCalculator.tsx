"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Plus,
  X,
  Download,
  RotateCcw
} from "lucide-react";

interface StateDeadline {
  state: string;
  eventDate: string;
  deadlineDate: string;
  noticeRequired: string;
  businessDays: number;
  status: "upcoming" | "urgent" | "passed";
}

interface EventInput {
  id: string;
  state: string;
  eventDate: string;
}

const stateNoticeRequirements: Record<string, { days: number; type: "calendar" | "business" }> = {
  illinois: { days: 10, type: "business" },
  massachusetts: { days: 15, type: "calendar" },
  nevada: { days: 14, type: "calendar" },
  "new-york": { days: 30, type: "calendar" },
  texas: { days: 21, type: "calendar" },
  washington: { days: 14, type: "calendar" },
};

const availableStates = [
  { id: "illinois", name: "Illinois" },
  { id: "massachusetts", name: "Massachusetts" },
  { id: "nevada", name: "Nevada" },
  { id: "new-york", name: "New York" },
  { id: "texas", name: "Texas" },
  { id: "washington", name: "Washington" },
];

// US Federal holidays 2024-2026
const federalHolidays = [
  "2024-01-01", "2024-01-15", "2024-02-19", "2024-05-27", "2024-06-19",
  "2024-07-04", "2024-09-02", "2024-10-14", "2024-11-11", "2024-11-28", "2024-12-25",
  "2025-01-01", "2025-01-20", "2025-02-17", "2025-05-26", "2025-06-19",
  "2025-07-04", "2025-09-01", "2025-10-13", "2025-11-11", "2025-11-27", "2025-12-25",
  "2026-01-01", "2026-01-19", "2026-02-16", "2026-05-25", "2026-06-19",
  "2026-07-03", "2026-09-07", "2026-10-12", "2026-11-11", "2026-11-26", "2026-12-25",
];

function isBusinessDay(date: Date): boolean {
  const day = date.getDay();
  if (day === 0 || day === 6) return false;
  const dateStr = date.toISOString().split("T")[0];
  return !federalHolidays.includes(dateStr);
}

function addBusinessDays(startDate: Date, days: number): Date {
  const result = new Date(startDate);
  let addedDays = 0;
  while (addedDays < days) {
    result.setDate(result.getDate() - 1);
    if (isBusinessDay(result)) {
      addedDays++;
    }
  }
  return result;
}

function addCalendarDays(startDate: Date, days: number): Date {
  const result = new Date(startDate);
  result.setDate(result.getDate() - days);
  return result;
}

function calculateDeadline(eventDate: string, state: string): StateDeadline | null {
  const requirement = stateNoticeRequirements[state];
  if (!requirement || !eventDate) return null;

  const event = new Date(eventDate);
  let deadline: Date;

  if (requirement.type === "business") {
    deadline = addBusinessDays(event, requirement.days);
  } else {
    deadline = addCalendarDays(event, requirement.days);
  }

  const today = new Date();
  const daysUntil = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  let status: StateDeadline["status"];
  if (daysUntil < 0) {
    status = "passed";
  } else if (daysUntil <= 3) {
    status = "urgent";
  } else {
    status = "upcoming";
  }

  return {
    state: availableStates.find((s) => s.id === state)?.name || state,
    eventDate,
    deadlineDate: deadline.toISOString().split("T")[0],
    noticeRequired: `${requirement.days} ${requirement.type} days`,
    businessDays: requirement.days,
    status,
  };
}

export function NotificationCalculator() {
  const [events, setEvents] = useState<EventInput[]>([
    { id: "1", state: "", eventDate: "" },
  ]);

  const addEvent = () => {
    setEvents([...events, { id: Date.now().toString(), state: "", eventDate: "" }]);
  };

  const removeEvent = (id: string) => {
    setEvents(events.filter((e) => e.id !== id));
  };

  const updateEvent = (id: string, field: keyof EventInput, value: string) => {
    setEvents(events.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  };

  const deadlines = useMemo(() => {
    return events
      .filter((e) => e.state && e.eventDate)
      .map((e) => calculateDeadline(e.eventDate, e.state))
      .filter((d): d is StateDeadline => d !== null)
      .sort((a, b) => new Date(a.deadlineDate).getTime() - new Date(b.deadlineDate).getTime());
  }, [events]);

  const upcomingCount = deadlines.filter((d) => d.status === "upcoming").length;
  const urgentCount = deadlines.filter((d) => d.status === "urgent").length;
  const passedCount = deadlines.filter((d) => d.status === "passed").length;

  const exportToCSV = () => {
    const headers = ["State", "Event Date", "Deadline", "Notice Required", "Status"];
    const rows = deadlines.map((d) => [
      d.state,
      d.eventDate,
      d.deadlineDate,
      d.noticeRequired,
      d.status,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "notification-deadlines.csv";
    a.click();
  };

  const reset = () => {
    setEvents([{ id: "1", state: "", eventDate: "" }]);
  };

  const getStatusBadge = (status: StateDeadline["status"]) => {
    switch (status) {
      case "urgent":
        return <Badge variant="destructive">Urgent</Badge>;
      case "passed":
        return <Badge variant="secondary">Passed</Badge>;
      default:
        return <Badge className="bg-green-100 text-green-800">Upcoming</Badge>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Notification Deadline Calculator
            </CardTitle>
            <CardDescription>
              Multi-state deadline calculator with business day exclusion
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportToCSV}>
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={reset}>
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Events Input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Events</h3>
            <Button onClick={addEvent} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-1" />
              Add Event
            </Button>
          </div>
          <div className="space-y-2">
            {events.map((event, index) => (
              <div key={event.id} className="flex gap-2 items-center">
                <select
                  value={event.state}
                  onChange={(e) => updateEvent(event.id, "state", e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-md text-sm"
                >
                  <option value="">Select state</option>
                  {availableStates.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  value={event.eventDate}
                  onChange={(e) => updateEvent(event.id, "eventDate", e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-md text-sm"
                />
                {events.length > 1 && (
                  <Button variant="ghost" size="sm" onClick={() => removeEvent(event.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        {deadlines.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 bg-green-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-600">{upcomingCount}</p>
              <p className="text-xs text-green-700">Upcoming</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-red-600">{urgentCount}</p>
              <p className="text-xs text-red-700">Urgent (≤3 days)</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-gray-600">{passedCount}</p>
              <p className="text-xs text-gray-700">Passed</p>
            </div>
          </div>
        )}

        {/* Deadlines List */}
        {deadlines.length > 0 ? (
          <div className="space-y-2">
            <h3 className="font-medium">Calculated Deadlines</h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {deadlines.map((deadline, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded-lg ${
                    deadline.status === "urgent"
                      ? "border-destructive bg-destructive/5"
                      : deadline.status === "passed"
                      ? "opacity-50"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{deadline.state}</p>
                        <p className="text-sm text-muted-foreground">
                          Notice: {deadline.noticeRequired}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(deadline.status)}
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Event Date</p>
                      <p className="font-medium">{deadline.eventDate}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Notification Deadline</p>
                      <p className={`font-medium ${deadline.status === "urgent" ? "text-destructive" : ""}`}>
                        {deadline.deadlineDate}
                      </p>
                    </div>
                  </div>
                  {deadline.status === "urgent" && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Immediate action required - deadline approaching!</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Add events above to calculate notification deadlines</p>
          </div>
        )}

        {/* Legend */}
        <div className="p-4 bg-muted rounded-lg text-sm space-y-2">
          <h4 className="font-medium flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Notice Requirements Reference
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>• Illinois: 10 business days</div>
            <div>• Massachusetts: 15 calendar days</div>
            <div>• Nevada: 14 days (recommended)</div>
            <div>• New York: 30 days</div>
            <div>• Texas: 21 days</div>
            <div>• Washington: 14 days</div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            * Federal holidays and weekends are excluded from business day calculations
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default NotificationCalculator;
