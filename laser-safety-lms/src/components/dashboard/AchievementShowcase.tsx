"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Medal,
  Star,
  Zap,
  Target,
  Clock,
  BookOpen,
  Award,
  Crown,
  Flame,
  Gem,
  Shield,
  CheckCircle2,
  Lock,
  Share2,
  Download,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Course } from "@/types";
import { getCourseProgress, getOverallStats } from "@/lib/progress";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  requirement: {
    type: "courses_completed" | "modules_completed" | "streak_days" | "quiz_score" | "time_spent";
    value: number;
  };
  rarity: "common" | "rare" | "epic" | "legendary";
}

const achievements: Achievement[] = [
  {
    id: "first-steps",
    name: "First Steps",
    description: "Complete your first module",
    icon: BookOpen,
    color: "from-blue-500 to-cyan-500",
    requirement: { type: "modules_completed", value: 1 },
    rarity: "common",
  },
  {
    id: "knowledge-seeker",
    name: "Knowledge Seeker",
    description: "Complete 5 modules",
    icon: Star,
    color: "from-blue-600 to-blue-400",
    requirement: { type: "modules_completed", value: 5 },
    rarity: "common",
  },
  {
    id: "safety-scholar",
    name: "Safety Scholar",
    description: "Complete 15 modules",
    icon: Medal,
    color: "from-indigo-500 to-purple-500",
    requirement: { type: "modules_completed", value: 15 },
    rarity: "rare",
  },
  {
    id: "laser-master",
    name: "Laser Master",
    description: "Complete 30 modules",
    icon: Trophy,
    color: "from-amber-500 to-yellow-500",
    requirement: { type: "modules_completed", value: 30 },
    rarity: "epic",
  },
  {
    id: "course-completer",
    name: "Course Completer",
    description: "Complete your first course",
    icon: CheckCircle2,
    color: "from-green-500 to-emerald-500",
    requirement: { type: "courses_completed", value: 1 },
    rarity: "common",
  },
  {
    id: "safety-expert",
    name: "Safety Expert",
    description: "Complete 3 courses",
    icon: Shield,
    color: "from-green-600 to-teal-500",
    requirement: { type: "courses_completed", value: 3 },
    rarity: "rare",
  },
  {
    id: "grand-master",
    name: "Grand Master",
    description: "Complete all courses",
    icon: Crown,
    color: "from-amber-400 via-yellow-500 to-amber-600",
    requirement: { type: "courses_completed", value: 8 },
    rarity: "legendary",
  },
  {
    id: "on-fire",
    name: "On Fire",
    description: "Maintain a 3-day study streak",
    icon: Flame,
    color: "from-orange-500 to-red-500",
    requirement: { type: "streak_days", value: 3 },
    rarity: "common",
  },
  {
    id: "dedicated-learner",
    name: "Dedicated Learner",
    description: "Maintain a 7-day study streak",
    icon: Zap,
    color: "from-red-500 to-pink-500",
    requirement: { type: "streak_days", value: 7 },
    rarity: "rare",
  },
  {
    id: "quiz-champion",
    name: "Quiz Champion",
    description: "Score 100% on any quiz",
    icon: Target,
    color: "from-purple-500 to-pink-500",
    requirement: { type: "quiz_score", value: 100 },
    rarity: "epic",
  },
  {
    id: "time-investor",
    name: "Time Investor",
    description: "Study for 5 hours total",
    icon: Clock,
    color: "from-cyan-500 to-blue-500",
    requirement: { type: "time_spent", value: 300 },
    rarity: "rare",
  },
  {
    id: "diamond-scholar",
    name: "Diamond Scholar",
    description: "Study for 20 hours total",
    icon: Gem,
    color: "from-blue-400 via-purple-500 to-pink-500",
    requirement: { type: "time_spent", value: 1200 },
    rarity: "legendary",
  },
];

const rarityConfig = {
  common: {
    label: "Common",
    color: "text-slate-400",
    bgColor: "bg-slate-500/10",
    borderColor: "border-slate-500/20",
  },
  rare: {
    label: "Rare",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  epic: {
    label: "Epic",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
  },
  legendary: {
    label: "Legendary",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
  },
};

interface AchievementShowcaseProps {
  courses: Course[];
  className?: string;
}

export function AchievementShowcase({ courses, className }: AchievementShowcaseProps) {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [filter, setFilter] = useState<"all" | "unlocked" | "locked">("all");

  const totalModules = useMemo(
    () => courses.reduce((acc, c) => acc + c.modules.length, 0),
    [courses]
  );

  const stats = useMemo(() => getOverallStats(totalModules, courses.length), [totalModules, courses.length]);

  // Calculate user progress for achievements
  const userStats = useMemo(() => {
    // Mock streak and time (in a real app, these would come from the backend)
    const streakDays = 5;
    const timeSpentMinutes = stats.completedModules * 15; // 15 min per module avg

    return {
      coursesCompleted: stats.coursesFinished,
      modulesCompleted: stats.completedModules,
      streakDays,
      timeSpentMinutes,
    };
  }, [stats]);

  // Calculate unlocked achievements
  const achievementStatus = useMemo(() => {
    return achievements.map((achievement) => {
      let unlocked = false;
      let progress = 0;

      switch (achievement.requirement.type) {
        case "courses_completed":
          progress = userStats.coursesCompleted;
          unlocked = progress >= achievement.requirement.value;
          break;
        case "modules_completed":
          progress = userStats.modulesCompleted;
          unlocked = progress >= achievement.requirement.value;
          break;
        case "streak_days":
          progress = userStats.streakDays;
          unlocked = progress >= achievement.requirement.value;
          break;
        case "time_spent":
          progress = userStats.timeSpentMinutes;
          unlocked = progress >= achievement.requirement.value;
          break;
        case "quiz_score":
          // Mock quiz score check
          unlocked = false;
          progress = 0;
          break;
      }

      return {
        achievement,
        unlocked,
        progress: Math.min(progress, achievement.requirement.value),
        maxProgress: achievement.requirement.value,
        progressPercent: Math.min(
          (progress / achievement.requirement.value) * 100,
          100
        ),
      };
    });
  }, [userStats]);

  // Filter achievements
  const filteredAchievements = useMemo(() => {
    switch (filter) {
      case "unlocked":
        return achievementStatus.filter((a) => a.unlocked);
      case "locked":
        return achievementStatus.filter((a) => !a.unlocked);
      default:
        return achievementStatus;
    }
  }, [achievementStatus, filter]);

  const unlockedCount = achievementStatus.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <CardTitle>Achievements</CardTitle>
              <CardDescription>
                {unlockedCount} of {totalCount} unlocked
              </CardDescription>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex p-1 bg-muted rounded-lg">
            {(["all", "unlocked", "locked"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-md transition-colors capitalize",
                  filter === f
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Overall progress bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Collection Progress</span>
            <span className="font-medium">
              {Math.round((unlockedCount / totalCount) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(unlockedCount / totalCount) * 100}%` }}
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-500"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filteredAchievements.map(({ achievement, unlocked, progressPercent }) => {
            const Icon = achievement.icon;
            const rarity = rarityConfig[achievement.rarity];

            return (
              <motion.button
                key={achievement.id}
                onClick={() => setSelectedAchievement(achievement)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "relative p-4 rounded-xl border transition-all text-center",
                  unlocked
                    ? cn("bg-card", rarity.borderColor)
                    : "bg-muted/30 border-border opacity-60"
                )}
              >
                {/* Achievement icon */}
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl mx-auto flex items-center justify-center mb-2",
                    unlocked
                      ? cn("bg-gradient-to-br", achievement.color)
                      : "bg-muted"
                  )}
                >
                  {unlocked ? (
                    <Icon className="w-6 h-6 text-white" />
                  ) : (
                    <Lock className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>

                {/* Name */}
                <p
                  className={cn(
                    "text-sm font-medium truncate",
                    unlocked ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {achievement.name}
                </p>

                {/* Rarity badge */}
                <span
                  className={cn(
                    "inline-block px-1.5 py-0.5 text-[10px] font-medium rounded mt-1",
                    rarity.bgColor,
                    rarity.color
                  )}
                >
                  {rarity.label}
                </span>

                {/* Progress indicator for locked */}
                {!unlocked && progressPercent > 0 && (
                  <div className="mt-2">
                    <div className="h-1 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {Math.round(progressPercent)}%
                    </p>
                  </div>
                )}

                {/* Shine effect for legendary */}
                {unlocked && achievement.rarity === "legendary" && (
                  <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                      animate={{ x: ["-200%", "200%"] }}
                      transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                    />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {filteredAchievements.length === 0 && (
          <div className="text-center py-8">
            <Award className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground">No achievements in this category</p>
          </div>
        )}
      </CardContent>

      {/* Achievement detail modal */}
      <AnimatePresence>
        {selectedAchievement && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setSelectedAchievement(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-popover border border-border rounded-2xl shadow-2xl z-50 p-6"
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedAchievement(null)}
                className="absolute right-4 top-4 p-1 rounded-lg hover:bg-muted"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>

              {/* Icon */}
              <div
                className={cn(
                  "w-20 h-20 rounded-2xl mx-auto flex items-center justify-center mb-4",
                  "bg-gradient-to-br",
                  selectedAchievement.color
                )}
              >
                <selectedAchievement.icon className="w-10 h-10 text-white" />
              </div>

              {/* Info */}
              <div className="text-center">
                <span
                  className={cn(
                    "inline-block px-2 py-0.5 text-xs font-medium rounded-full mb-2",
                    rarityConfig[selectedAchievement.rarity].bgColor,
                    rarityConfig[selectedAchievement.rarity].color
                  )}
                >
                  {rarityConfig[selectedAchievement.rarity].label}
                </span>
                <h3 className="text-xl font-bold text-foreground">
                  {selectedAchievement.name}
                </h3>
                <p className="text-muted-foreground mt-1">
                  {selectedAchievement.description}
                </p>

                {/* Requirement */}
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Requirement: {selectedAchievement.requirement.value}{" "}
                    {selectedAchievement.requirement.type.replace("_", " ")}
                  </p>
                </div>

                {/* Actions */}
                {achievementStatus.find(
                  (a) => a.achievement.id === selectedAchievement.id
                )?.unlocked && (
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" className="flex-1 gap-2">
                      <Share2 className="w-4 h-4" />
                      Share
                    </Button>
                    <Button variant="outline" className="flex-1 gap-2">
                      <Download className="w-4 h-4" />
                      Save
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Card>
  );
}

export default AchievementShowcase;
