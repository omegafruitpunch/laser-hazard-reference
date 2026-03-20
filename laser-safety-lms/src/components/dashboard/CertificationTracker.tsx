"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Award,
  CheckCircle2,
  Clock,
  Target,
  TrendingUp,
  Lock,
  ChevronRight,
  Download,
  Share2,
  FileText,
  GraduationCap,
  Star,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Course } from "@/types";
import { getCourseProgress } from "@/lib/progress";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CertificationTrackerProps {
  courses: Course[];
  className?: string;
}

interface CertificationStatus {
  course: Course;
  progress: ReturnType<typeof getCourseProgress>;
  isEligible: boolean;
  isCertified: boolean;
  percentComplete: number;
  modulesRemaining: number;
}

export function CertificationTracker({ courses, className }: CertificationTrackerProps) {
  const [selectedCert, setSelectedCert] = useState<CertificationStatus | null>(null);

  const certifications = useMemo<CertificationStatus[]>(() => {
    return courses.map((course) => {
      const progress = getCourseProgress(course.id);
      const completedModules = progress.completedModules.length;
      const totalModules = course.modules.length;
      const percentComplete = Math.round((completedModules / totalModules) * 100);
      const isCertified = completedModules === totalModules && !!progress.quizPassed;
      const isEligible = completedModules === totalModules && !progress.quizPassed;
      const modulesRemaining = totalModules - completedModules;

      return {
        course,
        progress,
        isEligible,
        isCertified,
        percentComplete,
        modulesRemaining,
      };
    });
  }, [courses]);

  const stats = useMemo(() => {
    const certified = certifications.filter((c) => c.isCertified).length;
    const eligible = certifications.filter((c) => c.isEligible).length;
    const inProgress = certifications.filter(
      (c) => !c.isCertified && !c.isEligible && c.percentComplete > 0
    ).length;
    const notStarted = certifications.filter((c) => c.percentComplete === 0).length;

    return { certified, eligible, inProgress, notStarted };
  }, [certifications]);

  const getStatusColor = (status: CertificationStatus) => {
    if (status.isCertified) return "bg-green-500";
    if (status.isEligible) return "bg-amber-500";
    if (status.percentComplete > 0) return "bg-blue-500";
    return "bg-muted-foreground";
  };

  const getStatusText = (status: CertificationStatus) => {
    if (status.isCertified) return "Certified";
    if (status.isEligible) return "Ready for Quiz";
    if (status.percentComplete > 0) return "In Progress";
    return "Not Started";
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
              <Award className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <CardTitle>Certification Tracker</CardTitle>
              <CardDescription>
                {stats.certified} of {courses.length} certifications earned
              </CardDescription>
            </div>
          </div>

          {/* Overall progress */}
          <div className="text-right hidden sm:block">
            <p className="text-2xl font-bold text-foreground">
              {Math.round((stats.certified / courses.length) * 100)}%
            </p>
            <p className="text-xs text-muted-foreground">Complete</p>
          </div>
        </div>

        {/* Status summary */}
        <div className="flex flex-wrap gap-2 mt-4">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-medium">
            <CheckCircle2 className="w-3 h-3" />
            {stats.certified} Certified
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-medium">
            <Clock className="w-3 h-3" />
            {stats.eligible} Ready
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-medium">
            <TrendingUp className="w-3 h-3" />
            {stats.inProgress} In Progress
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
            <Lock className="w-3 h-3" />
            {stats.notStarted} Locked
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {certifications.map((status) => {
          const { course, percentComplete, modulesRemaining, isCertified, isEligible } = status;

          return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "p-4 rounded-xl border transition-all cursor-pointer",
                "hover:border-primary/50 hover:shadow-sm",
                isCertified
                  ? "bg-green-500/5 border-green-500/20"
                  : isEligible
                  ? "bg-amber-500/5 border-amber-500/20"
                  : "bg-card border-border"
              )}
              onClick={() => setSelectedCert(status)}
            >
              <div className="flex items-start gap-4">
                {/* Course icon */}
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0",
                    "bg-gradient-to-br",
                    course.coverColor
                  )}
                >
                  {course.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-foreground truncate">
                      {course.title}
                    </h4>
                    <span
                      className={cn(
                        "px-2 py-0.5 text-[10px] font-medium rounded-full",
                        isCertified && "bg-green-500/10 text-green-500",
                        isEligible && "bg-amber-500/10 text-amber-500",
                        !isCertified && !isEligible && "bg-muted text-muted-foreground"
                      )}
                    >
                      {getStatusText(status)}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mt-1">
                    {course.category} • {course.difficulty}
                  </p>

                  {/* Progress */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">
                        {percentComplete}% complete
                      </span>
                      {modulesRemaining > 0 && (
                        <span className="text-muted-foreground">
                          {modulesRemaining} modules remaining
                        </span>
                      )}
                      {isEligible && (
                        <span className="text-amber-500 font-medium">
                          Quiz ready!
                        </span>
                      )}
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentComplete}%` }}
                        className={cn(
                          "h-full rounded-full transition-all",
                          getStatusColor(status)
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Action */}
                <div className="flex-shrink-0">
                  {isCertified ? (
                    <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                      <Award className="w-5 h-5 text-green-500" />
                    </div>
                  ) : isEligible ? (
                    <Link
                      href={`/quiz/${course.id}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button size="sm" className="gap-1">
                        <GraduationCap className="w-4 h-4" />
                        Quiz
                      </Button>
                    </Link>
                  ) : (
                    <Link
                      href={`/courses/${course.id}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button variant="ghost" size="icon">
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}

        {selectedCert && (
          <CertificationDetailModal
            status={selectedCert}
            onClose={() => setSelectedCert(null)}
          />
        )}
      </CardContent>
    </Card>
  );
}

interface CertificationDetailModalProps {
  status: CertificationStatus;
  onClose: () => void;
}

function CertificationDetailModal({ status, onClose }: CertificationDetailModalProps) {
  const { course, isCertified, isEligible, percentComplete } = status;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-popover border border-border rounded-2xl shadow-2xl z-50 overflow-hidden"
      >
        {/* Header */}
        <div
          className={cn(
            "p-6 text-center",
            isCertified
              ? "bg-gradient-to-br from-green-500/10 to-emerald-500/10"
              : "bg-muted/50"
          )}
        >
          <div
            className={cn(
              "w-20 h-20 rounded-2xl mx-auto flex items-center justify-center text-3xl mb-4",
              "bg-gradient-to-br",
              course.coverColor
            )}
          >
            {isCertified ? <Award className="w-10 h-10 text-white" /> : course.icon}
          </div>

          <h3 className="text-xl font-bold text-foreground">{course.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {course.category} • {course.difficulty}
          </p>

          {isCertified && (
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-sm font-medium">
              <CheckCircle2 className="w-4 h-4" />
              Certified
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Progress */}
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{percentComplete}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full",
                  isCertified ? "bg-green-500" : "bg-primary"
                )}
                style={{ width: `${percentComplete}%` }}
              />
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-xs">Duration</span>
              </div>
              <p className="text-sm font-medium">{course.totalMinutes} minutes</p>
            </div>

            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <FileText className="w-4 h-4" />
                <span className="text-xs">Modules</span>
              </div>
              <p className="text-sm font-medium">{course.modules.length} modules</p>
            </div>
          </div>

          {/* Certificate preview for certified */}
          {isCertified && (
            <div className="p-4 rounded-xl border-2 border-dashed border-green-500/30 bg-green-500/5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center">
                  <Award className="w-6 h-6 text-green-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">Certificate of Completion</p>
                  <p className="text-xs text-muted-foreground">Issued on completion</p>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <Button variant="outline" size="sm" className="flex-1 gap-1">
                  <Download className="w-4 h-4" />
                  Download
                </Button>
                <Button variant="outline" size="sm" className="flex-1 gap-1">
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2">
            {isCertified ? (
              <Link href={`/certificate`} className="flex-1">
                <Button className="w-full gap-2">
                  <ExternalLink className="w-4 h-4" />
                  View Certificate
                </Button>
              </Link>
            ) : isEligible ? (
              <Link href={`/quiz/${course.id}`} className="flex-1">
                <Button className="w-full gap-2">
                  <GraduationCap className="w-4 h-4" />
                  Take Final Quiz
                </Button>
              </Link>
            ) : (
              <Link href={`/courses/${course.id}`} className="flex-1">
                <Button className="w-full gap-2">
                  <Target className="w-4 h-4" />
                  Continue Learning
                </Button>
              </Link>
            )}
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default CertificationTracker;
