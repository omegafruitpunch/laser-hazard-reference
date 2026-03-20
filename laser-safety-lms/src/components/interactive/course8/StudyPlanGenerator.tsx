"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  Target, 
  CheckCircle2,
  BookOpen,
  Play,
  Download,
  Share2,
  Brain,
  AlertCircle,
  ArrowRight
} from "lucide-react";

// ============================================================================
// Types & Interfaces
// ============================================================================

export type StudySessionType = "reading" | "video" | "practice" | "quiz" | "review";

export interface StudySession {
  id: string;
  title: string;
  type: StudySessionType;
  duration: number;
  topic: string;
  resource?: string;
  completed: boolean;
}

export interface StudyDay {
  day: number;
  date: Date;
  sessions: StudySession[];
  totalMinutes: number;
}

export interface StudyPlan {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  dailyMinutes: number;
  days: StudyDay[];
  focusAreas: string[];
}

export interface StudyPlanGeneratorProps {
  onSave?: (plan: StudyPlan) => void;
  onExport?: (plan: StudyPlan) => void;
  className?: string;
}

// ============================================================================
// Study Templates
// ============================================================================

const STUDY_TEMPLATES = {
  CLSO: {
    name: "CLSO Exam Preparation",
    description: "Comprehensive 30-day study plan for CLSO certification",
    focusAreas: [
      "Laser Fundamentals",
      "Bioeffects & MPE",
      "Hazard Analysis",
      "Control Measures",
      "Standards & Regulations",
      "LSO Responsibilities",
      "Medical Surveillance",
    ],
    sessions: [
      { title: "Laser Physics Review", type: "reading" as const, duration: 45, topic: "Fundamentals" },
      { title: "MPE Tables Deep Dive", type: "practice" as const, duration: 60, topic: "MPE" },
      { title: "NOHD Calculation Exercises", type: "practice" as const, duration: 45, topic: "Hazard Analysis" },
      { title: "Control Measures Quiz", type: "quiz" as const, duration: 30, topic: "Controls" },
      { title: "ANSI Z136.1 Navigation", type: "video" as const, duration: 40, topic: "Standards" },
      { title: "LSO Responsibilities Review", type: "reading" as const, duration: 30, topic: "LSO Role" },
      { title: "Medical Surveillance Module", type: "video" as const, duration: 35, topic: "Medical" },
      { title: "Practice Exam 1", type: "quiz" as const, duration: 120, topic: "Review" },
      { title: "Weak Areas Review", type: "review" as const, duration: 60, topic: "Review" },
      { title: "Practice Exam 2", type: "quiz" as const, duration: 120, topic: "Review" },
    ],
  },
  CMLSO: {
    name: "CMLSO Exam Preparation",
    description: "Focused 21-day study plan for CMLSO certification",
    focusAreas: [
      "Medical Laser Physics",
      "Tissue Interactions",
      "Medical Laser Safety",
      "Healthcare Controls",
      "Medical Surveillance",
    ],
    sessions: [
      { title: "Medical Laser Fundamentals", type: "reading" as const, duration: 45, topic: "Fundamentals" },
      { title: "Tissue Interactions", type: "video" as const, duration: 40, topic: "Bioeffects" },
      { title: "Healthcare Safety Protocols", type: "reading" as const, duration: 50, topic: "Medical Safety" },
      { title: "Z136.3 Medical Standard", type: "reading" as const, duration: 45, topic: "Standards" },
      { title: "Medical Practice Quiz", type: "quiz" as const, duration: 30, topic: "Review" },
      { title: "Practice Exam", type: "quiz" as const, duration: 90, topic: "Review" },
    ],
  },
  REFRESHER: {
    name: "Knowledge Refresher",
    description: "7-day intensive review for experienced professionals",
    focusAreas: [
      "Key Standards Updates",
      "Calculation Practice",
      "Regulatory Changes",
    ],
    sessions: [
      { title: "Standards Review", type: "reading" as const, duration: 60, topic: "Standards" },
      { title: "Calculation Drills", type: "practice" as const, duration: 45, topic: "Calculations" },
      { title: "Regulatory Updates", type: "video" as const, duration: 30, topic: "Regulations" },
      { title: "Quick Assessment", type: "quiz" as const, duration: 30, topic: "Review" },
    ],
  },
};

// ============================================================================
// Main Component
// ============================================================================

export function StudyPlanGenerator({
  onSave,
  onExport,
  className,
}: StudyPlanGeneratorProps) {
  const [phase, setPhase] = useState<"select" | "configure" | "preview">("select");
  const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof STUDY_TEMPLATES | null>(null);
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [dailyMinutes, setDailyMinutes] = useState(60);
  const [generatedPlan, setGeneratedPlan] = useState<StudyPlan | null>(null);

  const generatePlan = (): StudyPlan => {
    if (!selectedTemplate) return null as unknown as StudyPlan;
    
    const template = STUDY_TEMPLATES[selectedTemplate];
    const start = new Date(startDate);
    const sessions = [...template.sessions];
    const days: StudyDay[] = [];
    let currentDay = 0;
    let currentMinutes = 0;
    let currentSessions: StudySession[] = [];

    sessions.forEach((sessionTemplate, index) => {
      // If adding this session would exceed daily limit, start new day
      if (currentMinutes + sessionTemplate.duration > dailyMinutes && currentSessions.length > 0) {
        days.push({
          day: currentDay + 1,
          date: new Date(start.getTime() + currentDay * 24 * 60 * 60 * 1000),
          sessions: currentSessions,
          totalMinutes: currentMinutes,
        });
        currentDay++;
        currentMinutes = 0;
        currentSessions = [];
      }

      // Add session to current day
      currentSessions.push({
        id: `session-${index}`,
        title: sessionTemplate.title,
        type: sessionTemplate.type,
        duration: sessionTemplate.duration,
        topic: sessionTemplate.topic,
        completed: false,
      });
      currentMinutes += sessionTemplate.duration;
    });

    // Add remaining sessions
    if (currentSessions.length > 0) {
      days.push({
        day: currentDay + 1,
        date: new Date(start.getTime() + currentDay * 24 * 60 * 60 * 1000),
        sessions: currentSessions,
        totalMinutes: currentMinutes,
      });
    }

    const endDate = days[days.length - 1]?.date || start;

    return {
      id: `plan-${Date.now()}`,
      name: template.name,
      description: template.description,
      startDate: start,
      endDate,
      totalDays: days.length,
      dailyMinutes,
      days,
      focusAreas: template.focusAreas,
    };
  };

  const handleGenerate = () => {
    const plan = generatePlan();
    setGeneratedPlan(plan);
    setPhase("preview");
  };

  const handleSave = () => {
    if (generatedPlan) {
      onSave?.(generatedPlan);
    }
  };

  const handleExport = () => {
    if (generatedPlan) {
      onExport?.(generatedPlan);
    }
  };

  const toggleSessionComplete = (dayIndex: number, sessionId: string) => {
    if (!generatedPlan) return;
    
    const newPlan = { ...generatedPlan };
    const session = newPlan.days[dayIndex].sessions.find((s) => s.id === sessionId);
    if (session) {
      session.completed = !session.completed;
    }
    setGeneratedPlan(newPlan);
  };

  const getSessionIcon = (type: StudySessionType) => {
    switch (type) {
      case "reading": return <BookOpen className="w-4 h-4" />;
      case "video": return <Play className="w-4 h-4" />;
      case "practice": return <Brain className="w-4 h-4" />;
      case "quiz": return <Target className="w-4 h-4" />;
      case "review": return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getSessionColor = (type: StudySessionType) => {
    switch (type) {
      case "reading": return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      case "video": return "bg-purple-500/10 text-purple-400 border-purple-500/30";
      case "practice": return "bg-green-500/10 text-green-400 border-green-500/30";
      case "quiz": return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "review": return "bg-red-500/10 text-red-400 border-red-500/30";
    }
  };

  // Phase: Select Template
  if (phase === "select") {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="text-center">
          <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
            <Calendar className="w-6 h-6 text-primary" />
            Study Plan Generator
          </h2>
          <p className="text-muted-foreground mt-2">
            Create a personalized study schedule for your certification goals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(Object.entries(STUDY_TEMPLATES) as [keyof typeof STUDY_TEMPLATES, typeof STUDY_TEMPLATES["CLSO"]][]).map(([key, template]) => (
            <button
              key={key}
              onClick={() => {
                setSelectedTemplate(key);
                setPhase("configure");
              }}
              className={cn(
                "p-6 rounded-xl border text-left transition-all hover:scale-[1.02]",
                selectedTemplate === key
                  ? "border-primary bg-primary/5"
                  : "border-border/50 bg-card hover:bg-muted/50"
              )}
            >
              <div className="p-3 rounded-lg bg-primary/10 text-primary w-fit mb-3">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg">{template.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {template.description}
              </p>
              <div className="flex flex-wrap gap-1 mt-3">
                {template.focusAreas.slice(0, 3).map((area) => (
                  <Badge key={area} variant="secondary" className="text-xs">
                    {area}
                  </Badge>
                ))}
                {template.focusAreas.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{template.focusAreas.length - 3}
                  </Badge>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Phase: Configure
  if (phase === "configure" && selectedTemplate) {
    const template = STUDY_TEMPLATES[selectedTemplate];

    return (
      <Card className={cn("max-w-2xl mx-auto", className)}>
        <CardHeader>
          <CardTitle>Configure Your Study Plan</CardTitle>
          <p className="text-muted-foreground">{template.name}</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Start Date */}
          <div>
            <label className="text-sm font-medium mb-2 block">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-muted border border-border"
            />
          </div>

          {/* Daily Study Time */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Daily Study Time: {dailyMinutes} minutes
            </label>
            <input
              type="range"
              min="30"
              max="180"
              step="15"
              value={dailyMinutes}
              onChange={(e) => setDailyMinutes(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>30 min</span>
              <span>3 hours</span>
            </div>
          </div>

          {/* Preview */}
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Plan Summary</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Focus areas: {template.focusAreas.join(", ")}</li>
              <li>• Study sessions: {template.sessions.length}</li>
              <li>• Estimated duration: ~{Math.ceil(template.sessions.reduce((acc, s) => acc + s.duration, 0) / dailyMinutes)} days</li>
            </ul>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setPhase("select")}>
            Back
          </Button>
          <Button onClick={handleGenerate}>
            Generate Plan
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Phase: Preview Plan
  if (phase === "preview" && generatedPlan) {
    const completedSessions = generatedPlan.days.reduce(
      (acc, day) => acc + day.sessions.filter((s) => s.completed).length,
      0
    );
    const totalSessions = generatedPlan.days.reduce(
      (acc, day) => acc + day.sessions.length,
      0
    );
    const progress = Math.round((completedSessions / totalSessions) * 100);

    return (
      <div className={cn("max-w-4xl mx-auto space-y-6", className)}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">{generatedPlan.name}</h2>
            <p className="text-muted-foreground">{generatedPlan.description}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Download className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Share2 className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Progress */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">
                {completedSessions}/{totalSessions} sessions ({progress}%)
              </span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-4 text-sm">
              <div>
                <span className="text-muted-foreground">Start:</span>{" "}
                {generatedPlan.startDate.toLocaleDateString()}
              </div>
              <div>
                <span className="text-muted-foreground">End:</span>{" "}
                {generatedPlan.endDate.toLocaleDateString()}
              </div>
              <div>
                <span className="text-muted-foreground">Duration:</span>{" "}
                {generatedPlan.totalDays} days
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Study Days */}
        <div className="space-y-4">
          {generatedPlan.days.map((day, dayIndex) => (
            <Card key={day.day}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                      {day.day}
                    </div>
                    <div>
                      <CardTitle className="text-base">
                        Day {day.day}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {day.date.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">
                    <Clock className="w-3 h-3 mr-1" />
                    {day.totalMinutes} min
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-2">
                  {day.sessions.map((session) => (
                    <button
                      key={session.id}
                      onClick={() => toggleSessionComplete(dayIndex, session.id)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-lg border transition-all",
                        session.completed
                          ? "bg-green-500/5 border-green-500/30"
                          : "bg-card border-border/50 hover:border-primary/30"
                      )}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center",
                          session.completed
                            ? "bg-green-500 text-white"
                            : "bg-muted"
                        )}
                      >
                        {session.completed ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          getSessionIcon(session.type)
                        )}
                      </div>
                      <div className="flex-grow text-left">
                        <div className={cn("font-medium", session.completed && "line-through opacity-70")}>
                          {session.title}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="outline" className={getSessionColor(session.type)}>
                            {session.type}
                          </Badge>
                          <span>{session.duration} min</span>
                          <span>•</span>
                          <span>{session.topic}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-center">
          <Button variant="outline" onClick={() => setPhase("select")}>
            Create New Plan
          </Button>
        </div>
      </div>
    );
  }

  return null;
}

export default StudyPlanGenerator;
