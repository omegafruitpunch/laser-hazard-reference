"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Phone,
  ChevronRight,
  RotateCcw
} from "lucide-react";

interface TimelineEvent {
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
  totalWeeks: number;
  events: TimelineEvent[];
}

const stateTimelines: Record<string, StateTimeline> = {
  illinois: {
    state: "Illinois",
    totalWeeks: 6,
    events: [
      {
        week: -6,
        title: "Initial Registration",
        description: "Submit laser system registration application",
        duration: "2-3 weeks processing",
        critical: true,
        documents: ["Equipment specifications", "Installation plans", "LSO qualifications"],
      },
      {
        week: -4,
        title: "LSO Qualification Review",
        description: "Verify all 9 LSO qualification areas are documented",
        duration: "1 week",
        critical: true,
        documents: ["Training certificates", "Experience documentation"],
      },
      {
        week: -2,
        title: "Advance Notice Filing",
        description: "Submit 10-working-day advance notice for operation",
        duration: "10 working days minimum",
        critical: true,
        contact: "(217) 785-9975",
      },
      {
        week: 0,
        title: "Operation Approved",
        description: "Laser show/operation may proceed",
        duration: "Event date",
        critical: false,
      },
      {
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
    totalWeeks: 5,
    events: [
      {
        week: -5,
        title: "Vendor Notification",
        description: "Submit 15-day vendor notification (if applicable)",
        duration: "15 days minimum",
        critical: true,
        documents: ["Vendor information", "Show plans", "ANSI Z136 compliance"],
      },
      {
        week: -3,
        title: "Waiver Application (if needed)",
        description: "Apply for undue hardship waiver if applicable",
        duration: "2-3 weeks",
        critical: false,
        documents: ["Waiver request form", "Justification documentation"],
      },
      {
        week: -1,
        title: "Final Preparation",
        description: "Confirm compliance with 105 CMR 121.000",
        duration: "1 week",
        critical: false,
        contact: "(617) 242-3035",
      },
      {
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
    totalWeeks: 2,
    events: [
      {
        week: -2,
        title: "Advance Notification",
        description: "Notify Radiation Control Program of planned operation",
        duration: "Recommended 2 weeks",
        critical: false,
        contact: "(775) 687-7550",
      },
      {
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
    totalWeeks: 8,
    events: [
      {
        week: -8,
        title: "Certificate Application",
        description: "Apply for Class A or Class B Certificate",
        duration: "4-6 weeks processing",
        critical: true,
        documents: ["Application form", "Training documentation", "Equipment list"],
      },
      {
        week: -6,
        title: "Training Completion",
        description: "Complete required training from approved provider",
        duration: "Varies by provider",
        critical: true,
        documents: ["Training certificates", "Provider approval verification"],
      },
      {
        week: -2,
        title: "Certificate Received",
        description: "Receive Class A or B Certificate",
        duration: "Processing complete",
        critical: true,
      },
      {
        week: -1,
        title: "Inspection Preparation",
        description: "Prepare for potential routine inspection",
        duration: "Ongoing",
        critical: false,
        contact: "(518) 457-1202",
      },
      {
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
    totalWeeks: 6,
    events: [
      {
        week: -6,
        title: "Equipment Registration",
        description: "Register laser equipment with state",
        duration: "3-4 weeks",
        critical: true,
        documents: ["Equipment specifications", "25 TAC 289 compliance docs"],
      },
      {
        week: -3,
        title: "Special Use Review",
        description: "Review for hair removal/IPL special provisions if applicable",
        duration: "1-2 weeks",
        critical: false,
      },
      {
        week: -1,
        title: "Final Confirmation",
        description: "Confirm all documentation is in order",
        duration: "1 week",
        critical: false,
        contact: "(512) 834-6688",
      },
      {
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
    totalWeeks: 2,
    events: [
      {
        week: -2,
        title: "Light Show Notification",
        description: "Submit light show specific notification",
        duration: "As required",
        critical: false,
        documents: ["Show description", "Safety plan"],
        contact: "(360) 236-3210",
      },
      {
        week: 0,
        title: "Operation",
        description: "Laser show/operation may proceed",
        duration: "Event date",
        critical: false,
      },
    ],
  },
};

export function LicensingTimelineVisualizer() {
  const [selectedState, setSelectedState] = useState<string>("illinois");
  const [hoveredEvent, setHoveredEvent] = useState<TimelineEvent | null>(null);

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

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Licensing Timeline Visualizer
            </CardTitle>
            <CardDescription>
              Week-by-week permit process breakdown by state
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => setSelectedState("illinois")}>
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* State Selection */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(stateTimelines).map(([key, data]) => (
            <Button
              key={key}
              variant={selectedState === key ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedState(key)}
            >
              {data.state}
            </Button>
          ))}
        </div>

        {/* Timeline Visualization */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{timeline.totalWeeks} weeks before</span>
            <span className="font-medium text-foreground">Event Date</span>
            <span>After</span>
          </div>

          {/* Timeline Bar */}
          <div className="relative h-16 bg-muted rounded-lg overflow-hidden">
            {/* Center line for event date */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-green-500 z-10" />
            <div className="absolute left-1/2 top-2 -translate-x-1/2 text-xs font-medium text-green-600">
              EVENT
            </div>

            {/* Events */}
            {timeline.events.map((event, idx) => {
              const isBefore = event.week <= 0;
              const position = getEventPosition(event.week);
              const leftPos = isBefore ? 50 - position / 2 : 50 + position / 2;

              return (
                <button
                  key={idx}
                  className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full ${getEventColor(
                    event
                  )} border-2 border-white shadow-md hover:scale-125 transition-transform cursor-pointer z-20`}
                  style={{ left: `${leftPos}%` }}
                  onMouseEnter={() => setHoveredEvent(event)}
                  onMouseLeave={() => setHoveredEvent(null)}
                  title={event.title}
                />
              );
            })}

            {/* Timeline gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-amber-500/10" />
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span>Pre-event milestone</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              <span>Critical deadline</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span>Event date</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span>Post-event/renewal</span>
            </div>
          </div>
        </div>

        {/* Event Details */}
        {hoveredEvent ? (
          <div className="p-4 bg-muted rounded-lg border">
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full ${getEventColor(hoveredEvent)} flex items-center justify-center text-white shrink-0`}>
                {hoveredEvent.critical ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
              </div>
              <div className="space-y-2 flex-1">
                <div>
                  <h4 className="font-medium">{hoveredEvent.title}</h4>
                  <p className="text-sm text-muted-foreground">{hoveredEvent.description}</p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{hoveredEvent.duration}</span>
                </div>
                {hoveredEvent.documents && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium">Required Documents:</p>
                    <ul className="text-xs text-muted-foreground space-y-0.5">
                      {hoveredEvent.documents.map((doc, idx) => (
                        <li key={idx} className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {doc}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {hoveredEvent.contact && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{hoveredEvent.contact}</span>
                  </div>
                )}
                {hoveredEvent.critical && (
                  <Badge variant="destructive" className="text-xs">
                    Critical Deadline
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-muted/50 rounded-lg text-center text-sm text-muted-foreground">
            Hover over timeline markers to view event details
          </div>
        )}

        {/* All Events List */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">All Timeline Events</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {timeline.events.map((event, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                onMouseEnter={() => setHoveredEvent(event)}
                onMouseLeave={() => setHoveredEvent(null)}
              >
                <div className={`w-2 h-2 rounded-full ${getEventColor(event)}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{event.duration}</p>
                </div>
                <Badge variant={event.week === 0 ? "default" : "outline"} className="text-xs shrink-0">
                  {event.week === 0 ? "Event" : event.week > 0 ? `+${event.week}w` : `${event.week}w`}
                </Badge>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default LicensingTimelineVisualizer;
