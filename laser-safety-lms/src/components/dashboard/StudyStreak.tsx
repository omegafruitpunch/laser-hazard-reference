"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Flame,
  Trophy,
  Calendar,
  Clock,
  TrendingUp,
  Zap,
  Target,
  Star,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface StudyStreakProps {
  className?: string;
}

interface DayActivity {
  date: Date;
  active: boolean;
  minutes: number;
}

// Generate mock activity data
function generateActivityData(): DayActivity[] {
  const data: DayActivity[] = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Simulate some activity patterns
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const active = Math.random() > (isWeekend ? 0.4 : 0.2);
    const minutes = active ? Math.floor(Math.random() * 60) + 15 : 0;

    data.push({
      date,
      active,
      minutes,
    });
  }

  return data;
}

const streakMilestones = [
  { days: 3, reward: "Bronze Badge", icon: Star },
  { days: 7, reward: "Silver Badge", icon: Trophy },
  { days: 14, reward: "Gold Badge", icon: Flame },
  { days: 30, reward: "Platinum Badge", icon: Zap },
  { days: 60, reward: "Diamond Badge", icon: Target },
  { days: 100, reward: "Legend Badge", icon: Trophy },
];

export function StudyStreak({ className }: StudyStreakProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const activityData = useMemo(() => generateActivityData(), []);

  // Calculate current streak
  const currentStreak = useMemo(() => {
    let streak = 0;
    for (let i = activityData.length - 1; i >= 0; i--) {
      if (activityData[i].active) {
        streak++;
      } else if (i !== activityData.length - 1) {
        break;
      }
    }
    return streak;
  }, [activityData]);

  // Calculate longest streak
  const longestStreak = useMemo(() => {
    let maxStreak = 0;
    let current = 0;

    activityData.forEach((day) => {
      if (day.active) {
        current++;
        maxStreak = Math.max(maxStreak, current);
      } else {
        current = 0;
      }
    });

    return maxStreak;
  }, [activityData]);

  // Calculate weekly stats
  const weeklyStats = useMemo(() => {
    const last7Days = activityData.slice(-7);
    const activeDays = last7Days.filter((d) => d.active).length;
    const totalMinutes = last7Days.reduce((acc, d) => acc + d.minutes, 0);

    return { activeDays, totalMinutes };
  }, [activityData]);

  // Get calendar days for current month view
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days = [];
    const startPadding = firstDay.getDay();

    // Add padding days from previous month
    for (let i = startPadding - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push({ date, isPadding: true });
    }

    // Add actual days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      const activity = activityData.find(
        (d) => d.date.toDateString() === date.toDateString()
      );
      days.push({ date, isPadding: false, activity });
    }

    return days;
  }, [currentMonth, activityData]);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

  const nextMilestone = streakMilestones.find((m) => m.days > currentStreak);
  const progressToNext = nextMilestone
    ? (currentStreak / nextMilestone.days) * 100
    : 100;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <Flame className="w-6 h-6 text-white" />
              </div>
              {/* Glow effect */}
              {currentStreak > 0 && (
                <motion.div
                  className="absolute inset-0 rounded-xl bg-orange-500/30 blur-lg"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                {currentStreak} Day Streak
                {currentStreak >= 7 && (
                  <span className="text-xs px-2 py-0.5 bg-amber-500/10 text-amber-500 rounded-full">
                    On Fire!
                  </span>
                )}
              </CardTitle>
              <CardDescription>Best: {longestStreak} days</CardDescription>
            </div>
          </div>

          {/* Streak flame animation */}
          {currentStreak > 0 && (
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
            >
              <Flame className="w-8 h-8 text-orange-500" />
            </motion.div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Next milestone */}
        {nextMilestone && (
          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20">
            <div className="flex items-center gap-3">
              <nextMilestone.icon className="w-8 h-8 text-amber-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  Next Milestone: {nextMilestone.days} Days
                </p>
                <p className="text-xs text-muted-foreground">
                  {nextMilestone.days - currentStreak} days to unlock{" "}
                  {nextMilestone.reward}
                </p>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressToNext}%` }}
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Weekly activity */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">
            This Week ({weeklyStats.activeDays}/7 days)
          </h4>
          <div className="flex justify-between">
            {activityData.slice(-7).map((day, index) => {
              const dayName = ["M", "T", "W", "T", "F", "S", "S"][index];
              return (
                <div key={index} className="flex flex-col items-center gap-2">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center",
                      day.active
                        ? "bg-green-500 text-white"
                        : "bg-muted text-muted-foreground"
                    )}
                    title={day.active ? `${day.minutes} minutes` : "No activity"}
                  >
                    {day.active ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </motion.div>
                  <span className="text-[10px] text-muted-foreground">{dayName}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-xs">This Week</span>
            </div>
            <p className="text-lg font-bold text-foreground">
              {Math.round(weeklyStats.totalMinutes / 60)}h{" "}
              {weeklyStats.totalMinutes % 60}m
            </p>
          </div>

          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Target className="w-4 h-4" />
              <span className="text-xs">Daily Goal</span>
            </div>
            <p className="text-lg font-bold text-foreground">30 min</p>
          </div>
        </div>

        {/* Calendar view */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-foreground">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h4>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="w-7 h-7"
                onClick={() =>
                  setCurrentMonth(
                    new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
                  )
                }
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-7 h-7"
                onClick={() =>
                  setCurrentMonth(
                    new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
                  )
                }
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-[10px] text-muted-foreground py-1"
              >
                {day}
              </div>
            ))}
            {calendarDays.map(({ date, isPadding, activity }, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.01 }}
                className={cn(
                  "aspect-square rounded-lg flex items-center justify-center text-xs",
                  isPadding && "text-muted-foreground/30",
                  !isPadding && activity?.active && "bg-green-500/20 text-green-500",
                  !isPadding && !activity?.active && "bg-muted/50 text-muted-foreground",
                  date.toDateString() === new Date().toDateString() &&
                    "ring-2 ring-primary"
                )}
                title={
                  activity?.active ? `${activity.minutes} minutes studied` : undefined
                }
              >
                {date.getDate()}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-green-500/20" />
            <span>Active</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-muted" />
            <span>Inactive</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded ring-2 ring-primary" />
            <span>Today</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default StudyStreak;
