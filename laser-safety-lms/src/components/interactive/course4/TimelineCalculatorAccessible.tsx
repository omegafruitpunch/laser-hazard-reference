"use client";

import React, { useState, useMemo, useCallback, KeyboardEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Phone,
  ChevronRight,
  RotateCcw,
  Plus,
  X,
  Calculator,
} from "lucide-react";
import { useAccessibilitySettings } from "@/hooks/useAccessibilitySettings";
import { cn } from "@/lib/utils";

interface TimelineEvent {
  id: string;
  week: number;
  title: string;
  description: string;
  duration: string;
  critical: boolean;
  documents?: string[];
  contact?: string;
}

interface StateTimeline {
  state: string;
  abbreviation: string;
  totalWeeks: number;
  events: TimelineEvent[];
}

const stateTimelines: Record<string, StateTimeline> = {
  illinois: {
    state: "Illinois",
    abbreviation: "IL",
    totalWeeks: 6,
    events: [
      {
        id: "il-1",
        week: -6,
        title: "Initial Registration",
        description: "Submit laser system registration application",
        duration: "2-3 weeks processing",
        critical: true,
        documents: ["Equipment specifications", "Installation plans", "LSO qualifications"],
      },
      {
        id: "il-2",
        week: -4,
        title: "LSO Qualification Review",
        description: "Verify all 9 LSO qualification areas are documented",
        duration: "1 week",
        critical: true,
        documents: ["Training certificates", "Experience documentation"],
      },
      {
        id: "il-3",
        week: -2,
        title: "Advance Notice Filing",
        description: "Submit 10-working-day advance notice for operation",
        duration: "10 working days minimum",
        critical: true,
        contact: "(217) 785-9975",
      },
      {
        id: "il-4",
        week: 0,
        title: "Operation Approved",
        description: "Laser show/operation may proceed",
        duration: "Event date",
        critical: false,
      },
      {
        id: "il-5",
        week: 52,
        title: "Annual Registration Renewal",
        description: "Renew laser system registration (if continuing operation)",
        duration: "Due annually",
        critical: true,
      },
    ],
  },
  massachusetts: {
    state: "Massachusetts",
    abbreviation: "MA",
    totalWeeks: 5,
    events: [
      {
        id: "ma-1",
        week: -5,
        title: "Vendor Notification",
        description: "Submit 15-day vendor notification (if applicable)",
        duration: "15 days minimum",
        critical: true,
        documents: ["Vendor information", "Show plans", "ANSI Z136 compliance"],
      },
      {
        id: "ma-2",
        week: -3,
        title: "Waiver Application (if needed)",
        description: "Apply for undue hardship waiver if applicable",
        duration: "2-3 weeks",
        critical: false,
        documents: ["Waiver request form", "Justification documentation"],
      },
      {
        id: "ma-3",
        week: -1,
        title: "Final Preparation",
        description: "Confirm compliance with 105 CMR 121.000",
        duration: "1 week",
        critical: false,
        contact: "(617) 242-3035",
      },
      {
        id: "ma-4",
        week: 0,
        title: "Operation Approved",
        description: "Laser show/operation may proceed",
        duration: "Event date",
        critical: false,
      },
    ],
  },
  nevada: {
    state: "Nevada",
    abbreviation: "NV",
    totalWeeks: 2,
    events: [
      {
        id: "nv-1",
        week: -2,
        title: "Advance Notification",
        description: "Notify Radiation Control Program of planned operation",
        duration: "Recommended 2 weeks",
        critical: false,
        contact: "(775) 687-7550",
      },
      {
        id: "nv-2",
        week: 0,
        title: "Operation",
        description: "Laser show/operation may proceed with minimal oversight",
        duration: "Event date",
        critical: false,
      },
    ],
  },
  "new-york": {
    state: "New York",
    abbreviation: "NY",
    totalWeeks: 8,
    events: [
      {
        id: "ny-1",
        week: -8,
        title: "Certificate Application",
        description: "Apply for Class A or Class B Certificate",
        duration: "4-6 weeks processing",
        critical: true,
        documents: ["Application form", "Training documentation", "Equipment list"],
      },
      {
        id: "ny-2",
        week: -6,
        title: "Training Completion",
        description: "Complete required training from approved provider",
        duration: "Varies by provider",
        critical: true,
        documents: ["Training certificates", "Provider approval verification"],
      },
      {
        id: "ny-3",
        week: -2,
        title: "Certificate Received",
        description: "Receive Class A or B Certificate",
        duration: "Processing complete",
        critical: true,
      },
      {
        id: "ny-4",
        week: -1,
        title: "Inspection Preparation",
        description: "Prepare for potential routine inspection",
        duration: "Ongoing",
        critical: false,
        contact: "(518) 457-1202",
      },
      {
        id: "ny-5",
        week: 0,
        title: "Operation Approved",
        description: "Laser show/operation may proceed with certificate",
        duration: "Event date",
        critical: false,
      },
    ],
  },
  texas: {
    state: "Texas",
    abbreviation: "TX",
    totalWeeks: 6,
    events: [
      {
        id: "tx-1",
        week: -6,
        title: "Equipment Registration",
        description: "Register laser equipment with state",
        duration: "3-4 weeks",
        critical: true,
        documents: ["Equipment specifications", "25 TAC 289 compliance docs"],
      },
      {
        id: "tx-2",
        week: -3,
        title: "Special Use Review",
        description: "Review for hair removal/IPL special provisions if applicable",
        duration: "1-2 weeks",
        critical: false,
      },
      {
        id: "tx-3",
        week: -1,
        title: "Final Confirmation",
        description: "Confirm all documentation is in order",
        duration: "1 week",
        critical: false,
        contact: "(512) 834-6688",
      },
      {
        id: "tx-4",
        week: 0,
        title: "Operation Approved",
        description: "Laser show/operation may proceed",
        duration: "Event date",
        critical: false,
      },
    ],
  },
  washington: {
    state: "Washington",
    abbreviation: "WA",
    totalWeeks: 2,
    events: [
      {
        id: "wa-1",
        week: -2,
        title: "Light Show Notification",
        description: "Submit light show specific notification",
        duration: "As required",
        critical: false,
        documents: ["Show description", "Safety plan"],
        contact: "(360) 236-3210",
      },
      {
        id: "wa-2",
        week: 0,
        title: "Operation",
        description: "Laser show/operation may proceed",
        duration: "Event date",
        critical: false,
      },
    ],
  },
};

// Federal holidays 2024-2026 for business day calculation
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

function calculateDeadline(eventDate: string, noticeDays: number): Date {
  const event = new Date(eventDate);
  const deadline = new Date(event);
  let daysCounted = 0;
  
  while (daysCounted < noticeDays) {
    deadline.setDate(deadline.getDate() - 1);
    if (isBusinessDay(deadline)) {
      daysCounted++;
    }
  }
  
  return deadline;
}

interface EventDateInput {
  id: string;
  state: string;
  eventDate: string;
}

export function TimelineCalculatorAccessible() {
  const { announceToScreenReader } = useAccessibilitySettings();
  const [selectedState, setSelectedState] = useState<string>("illinois");
  const [focusedEventId, setFocusedEventId] = useState<string | null>(null);
  const [eventDates, setEventDates] = useState<EventDateInput[]>([]);
  const [calculatedDeadlines, setCalculatedDeadlines] = useState<Array<{eventId: string; deadline: Date}>>([]);

  const timeline = stateTimelines[selectedState];
  const maxWeek = Math.max(...timeline.events.map((e) => Math.abs(e.week)));

  const getEventPosition = (week: number) => {
    const absWeek = Math.abs(week);
    return (absWeek / maxWeek) * 100;
  };

  const getEventColor = (event: TimelineEvent) => {
    if (event.critical) return "bg-destructive";
    if (event.week === 0) return "bg-green-500";
    if (event.week > 0) return "bg-amber-500";
    return "bg-primary";
  };

  const addEventDate = () => {
    setEventDates([...eventDates, { id: Date.now().toString(), state: selectedState, eventDate: "" }]);
  };

  const updateEventDate = (id: string, eventDate: string) => {
    setEventDates(eventDates.map(e => e.id === id ? { ...e, eventDate } : e));
  };

  const removeEventDate = (id: string) => {
    setEventDates(eventDates.filter(e => e.id !== id));
  };

  const calculateDeadlines = useCallback(() => {
    const deadlines: Array<{eventId: string; deadline: Date}> = [];
    
    eventDates.forEach(eventDate => {
      if (!eventDate.eventDate) return;
      
      const stateTimeline = stateTimelines[eventDate.state];
      if (!stateTimeline) return;

      stateTimeline.events.forEach(event => {
        if (event.critical && event.week < 0) {
          // Calculate deadline based on event type
          let noticeDays = 10; // Default
          if (event.title.includes("15-day")) noticeDays = 15;
          if (event.title.includes("Certificate")) noticeDays = 56;
          
          const deadline = calculateDeadline(eventDate.eventDate, noticeDays);
          deadlines.push({ eventId: event.id, deadline });
        }
      });
    });

    setCalculatedDeadlines(deadlines);
    announceToScreenReader(`Calculated ${deadlines.length} deadlines`, "polite");
  }, [eventDates, announceToScreenReader]);

  // Keyboard navigation for timeline events
  const handleTimelineKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const events = timeline.events;
    const currentIndex = events.findIndex(e => e.id === focusedEventId);
    
    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        if (currentIndex < events.length - 1) {
          setFocusedEventId(events[currentIndex + 1].id);
          announceToScreenReader(events[currentIndex + 1].title, "polite");
        }
        break;
      case "ArrowLeft":
        event.preventDefault();
        if (currentIndex > 0) {
          setFocusedEventId(events[currentIndex - 1].id);
          announceToScreenReader(events[currentIndex - 1].title, "polite");
        }
        break;
      case "Home":
        event.preventDefault();
        setFocusedEventId(events[0].id);
        announceToScreenReader(events[0].title, "polite");
        break;
      case "End":
        event.preventDefault();
        setFocusedEventId(events[events.length - 1].id);
        announceToScreenReader(events[events.length - 1].title, "polite");
        break;
    }
  };

  const focusedEvent = timeline.events.find(e => e.id === focusedEventId);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" aria-hidden="true" />
              Licensing Timeline Calculator
            </CardTitle>
            <CardDescription>
              Interactive timeline with deadline calculator
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setSelectedState("illinois")}>
              <RotateCcw className="h-4 w-4 mr-1" aria-hidden="true" />
              Reset
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* State Selection */}
        <div 
          role="radiogroup" 
          aria-label="Select a state to view timeline"
          className="flex flex-wrap gap-2"
        >
          {Object.entries(stateTimelines).map(([key, data]) => (
            <button
              key={key}
              role="radio"
              aria-checked={selectedState === key}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                selectedState === key 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted hover:bg-muted/80"
              )}
              onClick={() => {
                setSelectedState(key);
                setFocusedEventId(null);
                announceToScreenReader(`Viewing timeline for ${data.state}`, "polite");
              }}
            >
              {data.state}
            </button>
          ))}
        </div>

        {/* Timeline Visualization */}
        <div 
          className="space-y-4"
          role="region"
          aria-label={`${timeline.state} licensing timeline`}
        >
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{timeline.totalWeeks} weeks before</span>
            <span className="font-medium text-foreground">Event Date</span>
            <span>After</span>
          </div>

          {/* Timeline Bar */}
          <div 
            className="relative h-20 bg-muted rounded-lg overflow-hidden"
            onKeyDown={handleTimelineKeyDown}
            tabIndex={0}
            role="slider"
            aria-label="Timeline navigation. Use arrow keys to navigate events."
            aria-valuenow={timeline.events.findIndex(e => e.id === focusedEventId) + 1}
            aria-valuemin={1}
            aria-valuemax={timeline.events.length}
          >
            {/* Center line for event date */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-green-500 z-10" aria-hidden="true" />
            <div className="absolute left-1/2 top-2 -translate-x-1/2 text-xs font-medium text-green-600">
              EVENT
            </div>

            {/* Events */}
            {timeline.events.map((event, idx) => {
              const isBefore = event.week <= 0;
              const position = getEventPosition(event.week);
              const leftPos = isBefore ? 50 - position / 2 : 50 + position / 2;
              const isFocused = focusedEventId === event.id;

              return (
                <button
                  key={event.id}
                  className={cn(
                    "absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-white shadow-md transition-all",
                    getEventColor(event),
                    isFocused && "ring-4 ring-ring scale-125 z-30"
                  )}
                  style={{ left: `${leftPos}%` }}
                  onClick={() => {
                    setFocusedEventId(event.id);
                    announceToScreenReader(
                      `${event.title}. ${event.description}. ${event.critical ? "Critical deadline." : ""}`,
                      "polite"
                    );
                  }}
                  aria-label={`${event.title}, week ${event.week}. ${event.critical ? "Critical deadline" : ""}`}
                  aria-pressed={isFocused}
                />
              );
            })}

            {/* Timeline gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-amber-500/10" aria-hidden="true" />
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-xs" role="list" aria-label="Timeline legend">
            <div className="flex items-center gap-1" role="listitem">
              <div className="w-3 h-3 rounded-full bg-primary" aria-hidden="true" />
              <span>Pre-event milestone</span>
            </div>
            <div className="flex items-center gap-1" role="listitem">
              <div className="w-3 h-3 rounded-full bg-destructive" aria-hidden="true" />
              <span>Critical deadline</span>
            </div>
            <div className="flex items-center gap-1" role="listitem">
              <div className="w-3 h-3 rounded-full bg-green-500" aria-hidden="true" />
              <span>Event date</span>
            </div>
            <div className="flex items-center gap-1" role="listitem">
              <div className="w-3 h-3 rounded-full bg-amber-500" aria-hidden="true" />
              <span>Post-event/renewal</span>
            </div>
          </div>
        </div>

        {/* Event Details Panel */}
        {focusedEvent ? (
          <div 
            className="p-4 bg-muted rounded-lg border"
            role="region"
            aria-label="Selected event details"
          >
            <div className="flex items-start gap-3">
              <div 
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0",
                  getEventColor(focusedEvent)
                )}
                aria-hidden="true"
              >
                {focusedEvent.critical ? <AlertCircle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
              </div>
              <div className="space-y-2 flex-1">
                <div>
                  <h4 className="font-medium text-lg">{focusedEvent.title}</h4>
                  <p className="text-sm text-muted-foreground">{focusedEvent.description}</p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <span>{focusedEvent.duration}</span>
                </div>
                {focusedEvent.documents && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium">Required Documents:</p>
                    <ul className="text-xs text-muted-foreground space-y-0.5" role="list">
                      {focusedEvent.documents.map((doc, idx) => (
                        <li key={idx} className="flex items-center gap-1">
                          <FileText className="h-3 w-3" aria-hidden="true" />
                          {doc}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {focusedEvent.contact && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <a 
                      href={`tel:${focusedEvent.contact.replace(/\D/g, "")}`}
                      className="hover:underline focus:outline-none focus:ring-2 focus:ring-ring rounded"
                    >
                      {focusedEvent.contact}
                    </a>
                  </div>
                )}
                {focusedEvent.critical && (
                  <Badge variant="destructive" className="text-xs">
                    Critical Deadline
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-muted/50 rounded-lg text-center text-sm text-muted-foreground">
            Click on timeline markers to view event details, or use arrow keys to navigate
          </div>
        )}

        {/* Deadline Calculator */}
        <div 
          className="border rounded-lg p-4 space-y-4"
          role="region"
          aria-label="Deadline calculator"
        >
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5" aria-hidden="true" />
            <h4 className="font-medium">Deadline Calculator</h4>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Event dates</span>
              <Button onClick={addEventDate} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" aria-hidden="true" />
                Add Event
              </Button>
            </div>
            
            {eventDates.map((eventDate) => (
              <div key={eventDate.id} className="flex gap-2 items-center">
                <select
                  value={eventDate.state}
                  onChange={(e) => updateEventDate(eventDate.id, eventDate.eventDate)}
                  className="flex-1 px-3 py-2 border rounded-md text-sm"
                  aria-label="Select state"
                >
                  {Object.entries(stateTimelines).map(([key, data]) => (
                    <option key={key} value={key}>{data.state}</option>
                  ))}
                </select>
                <Input
                  type="date"
                  value={eventDate.eventDate}
                  onChange={(e) => updateEventDate(eventDate.id, e.target.value)}
                  className="flex-1"
                  aria-label="Event date"
                />
                {eventDates.length > 1 && (
                  <Button variant="ghost" size="sm" onClick={() => removeEventDate(eventDate.id)} aria-label="Remove event">
                    <X className="h-4 w-4" aria-hidden="true" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Button onClick={calculateDeadlines} className="w-full">
            Calculate Deadlines
          </Button>

          {calculatedDeadlines.length > 0 && (
            <div className="space-y-2" role="region" aria-label="Calculated deadlines">
              <h5 className="text-sm font-medium">Upcoming Deadlines:</h5>
              <ul className="space-y-1" role="list">
                {calculatedDeadlines.map((deadline, idx) => {
                  const event = timeline.events.find(e => e.id === deadline.eventId);
                  if (!event) return null;
                  return (
                    <li key={idx} className="text-sm flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-destructive" aria-hidden="true" />
                      <span>{event.title}:</span>
                      <strong>{deadline.deadline.toLocaleDateString()}</strong>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        {/* All Events List */}
        <div className="space-y-2" role="region" aria-label="All timeline events">
          <h4 className="font-medium text-sm">All Timeline Events</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {timeline.events.map((event, idx) => (
              <button
                key={event.id}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors",
                  "focus:outline-none focus:ring-2 focus:ring-ring",
                  focusedEventId === event.id ? "bg-muted" : "hover:bg-muted/50"
                )}
                onClick={() => {
                  setFocusedEventId(event.id);
                  announceToScreenReader(event.title, "polite");
                }}
                aria-current={focusedEventId === event.id ? "true" : undefined}
              >
                <div className={cn("w-3 h-3 rounded-full", getEventColor(event))} aria-hidden="true" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{event.duration}</p>
                </div>
                <Badge variant={event.week === 0 ? "default" : "outline"} className="text-xs shrink-0">
                  {event.week === 0 ? "Event" : event.week > 0 ? `+${event.week}w` : `${event.week}w`}
                </Badge>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default TimelineCalculatorAccessible;
