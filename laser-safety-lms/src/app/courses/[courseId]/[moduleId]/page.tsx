"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  BookOpen,
  Lightbulb,
  HelpCircle,
  FileText,
  Menu,
  X,
  Target,
  Award,
  Download,
  Share2,
  Calculator,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { courses, getCourseById, getModuleById } from "@/data/courses";
import { getCourseProgress, isModuleComplete, markModuleComplete } from "@/lib/progress";
import type { QuizBank } from "@/types/quiz";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ModuleSidebar } from "@/components/navigation/ModuleSidebar";
import { BreadcrumbTrail } from "@/components/navigation/BreadcrumbTrail";
import { ProgressBar } from "@/components/navigation/ProgressBar";
import AssessmentFlow from "@/components/quiz/AssessmentFlow";

// ============================================================================
// COURSE 1: Laser Safety Fundamentals (5 modules)
// ============================================================================
import {
  Module1_IntroHazards,
  Module2_ClassificationSystem,
  Module3_LSORole,
  Module4_Calculations,
  Module5_Controls,
} from "@/components/interactive/course1";

// ============================================================================
// COURSE 2: FDA Compliance & Reporting (6 modules)
// ============================================================================
import {
  Module1_FDAFramework,
  Module2_VarianceApplications,
  Module3_LaserNotice50,
  Module4_IncidentReporting,
  Module5_FDAForms,
  Module6_Jurisdiction,
} from "@/components/interactive/course2";

// ============================================================================
// COURSE 3: Biological Hazards & Classification (5 modules)
// ============================================================================
import {
  Module1_OcularHazards,
  Module2_SkinHazards,
  Module3_IEC60825,
  Module4_MPETables,
  Module5_EyewearSelection,
} from "@/components/interactive/course3";

// ============================================================================
// COURSE 4: US State & Local Regulations (10 modules)
// ============================================================================
import {
  Module1_California,
  Module2_Florida,
  Module3_NewYork,
  Module4_Texas,
  Module5_Nevada,
  Module6_Illinois,
  Module7_Georgia,
  Module8_Washington,
  Module9_Massachusetts,
  Module10_Colorado,
} from "@/components/interactive/course4";

// ============================================================================
// COURSE 5: International Regulations (6 modules)
// ============================================================================
import {
  Module1_EU_Directives,
  Module2_UK_Regulations,
  Module3_Canada,
  Module4_Australia_NZ,
  Module5_Intl_Shows,
  Module6_IEC_ISO,
} from "@/components/interactive/course5";

// ============================================================================
// COURSE 6: Outdoor Laser Safety & Airspace (5 modules)
// ============================================================================
import {
  Module1_FAA_Regulations,
  Module2_NOTAM,
  Module3_Outdoor_Calculations,
  Module4_Securing_Shows,
  Module5_Intl_Outdoor,
} from "@/components/interactive/course6";

// ============================================================================
// COURSE 7: Event Safety & Operations (6 modules)
// ============================================================================
import {
  Module1_EventPlanning,
  Module2_CrowdSafety,
  Module3_WeatherProtocols,
  Module4_VenueAssessment,
  Module5_EmergencyResponse,
  Module6_Insurance,
} from "@/components/interactive/course7";

// ============================================================================
// COURSE 8: Entertainment Technology Standards (5 modules)
// ============================================================================
import {
  Module1_ANSIZ136,
  Module2_ESTAStandards,
  Module3_E146Standard,
  Module4_ElectricalSafety,
  Module5_ComplianceDocs,
} from "@/components/interactive/course8";

interface ModulePageProps {
  params: Promise<{
    courseId: string;
    moduleId: string;
  }>;
}

// ============================================================================
// Module ID to Component Mapping (All 46 modules)
// ============================================================================
const moduleComponents: Record<string, React.ComponentType<any>> = {
  // ========================================================================
  // COURSE 1: Laser Safety Fundamentals (5 modules)
  // ========================================================================
  "c1-m1": Module1_IntroHazards,
  "c1-m2": Module2_ClassificationSystem,
  "c1-m3": Module3_LSORole,
  "c1-m4": Module4_Calculations,
  "c1-m5": Module5_Controls,

  // ========================================================================
  // COURSE 2: FDA Compliance & Reporting (6 modules)
  // ========================================================================
  "c2-m1": Module1_FDAFramework,
  "c2-m2": Module2_VarianceApplications,
  "c2-m3": Module3_LaserNotice50,
  "c2-m4": Module4_IncidentReporting,
  "c2-m5": Module5_FDAForms,
  "c2-m6": Module6_Jurisdiction,

  // ========================================================================
  // COURSE 3: Biological Hazards & Classification (5 modules)
  // ========================================================================
  "c3-m1": Module1_OcularHazards,
  "c3-m2": Module2_SkinHazards,
  "c3-m3": Module3_IEC60825,
  "c3-m4": Module4_MPETables,
  "c3-m5": Module5_EyewearSelection,

  // ========================================================================
  // COURSE 4: US State & Local Regulations (10 modules)
  // ========================================================================
  "c4-m1": Module1_California,
  "c4-m2": Module2_Florida,
  "c4-m3": Module3_NewYork,
  "c4-m4": Module4_Texas,
  "c4-m5": Module5_Nevada,
  "c4-m6": Module6_Illinois,
  "c4-m7": Module7_Georgia,
  "c4-m8": Module8_Washington,
  "c4-m9": Module9_Massachusetts,
  "c4-m10": Module10_Colorado,

  // ========================================================================
  // COURSE 5: International Regulations (6 modules)
  // ========================================================================
  "c5-m1": Module1_EU_Directives,
  "c5-m2": Module2_UK_Regulations,
  "c5-m3": Module3_Canada,
  "c5-m4": Module4_Australia_NZ,
  "c5-m5": Module5_Intl_Shows,
  "c5-m6": Module6_IEC_ISO,

  // ========================================================================
  // COURSE 6: Outdoor Laser Safety & Airspace (5 modules)
  // ========================================================================
  "c6-m1": Module1_FAA_Regulations,
  "c6-m2": Module2_NOTAM,
  "c6-m3": Module3_Outdoor_Calculations,
  "c6-m4": Module4_Securing_Shows,
  "c6-m5": Module5_Intl_Outdoor,

  // ========================================================================
  // COURSE 7: Event Safety & Operations (6 modules)
  // ========================================================================
  "c7-m1": Module1_EventPlanning,
  "c7-m2": Module2_CrowdSafety,
  "c7-m3": Module3_WeatherProtocols,
  "c7-m4": Module4_VenueAssessment,
  "c7-m5": Module5_EmergencyResponse,
  "c7-m6": Module6_Insurance,

  // ========================================================================
  // COURSE 8: Entertainment Technology Standards (5 modules)
  // ========================================================================
  "c8-m1": Module1_ANSIZ136,
  "c8-m2": Module2_ESTAStandards,
  "c8-m3": Module3_E146Standard,
  "c8-m4": Module4_ElectricalSafety,
  "c8-m5": Module5_ComplianceDocs,
};

// Get quiz bank for a module
function getQuizBankForModule(courseId: string, moduleId: string): QuizBank {
  return {
    id: `${courseId}-${moduleId}`,
    courseId,
    title: "Knowledge Check",
    description: "Test your understanding of the module content",
    assessmentType: "module_quiz",
    totalQuestions: 0,
    passingScore: 80,
    timeLimitMinutes: 10,
    categories: {},
    questions: [],
    retakePolicy: {
      allowed: true,
      maxAttempts: 3,
      cooldownHours: 24,
    },
    randomizeQuestions: true,
    randomizeOptions: true,
  };
}

export default function ModulePage({ params }: ModulePageProps) {
  const { courseId, moduleId } = use(params);
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activePhase, setActivePhase] = useState<"learn" | "practice" | "assess" | "review">("learn");
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const course = useMemo(() => getCourseById(courseId), [courseId]);
  const module = useMemo(
    () => getModuleById(courseId, moduleId),
    [courseId, moduleId]
  );

  const InteractiveComponent = moduleComponents[moduleId];

  if (!course || !module) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h1 className="text-2xl font-bold text-foreground">Module not found</h1>
        <p className="text-muted-foreground mt-2">
          The module you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/courses" className="mt-4">
          <Button>Back to Courses</Button>
        </Link>
      </div>
    );
  }

  const courseProgress = getCourseProgress(courseId);
  const isComplete = isModuleComplete(courseId, moduleId);
  const moduleIndex = course.modules.findIndex((m) => m.id === moduleId);
  const isFirstModule = moduleIndex === 0;
  const isLastModule = moduleIndex === course.modules.length - 1;

  const prevModule = !isFirstModule ? course.modules[moduleIndex - 1] : null;
  const nextModule = !isLastModule ? course.modules[moduleIndex + 1] : null;

  // Calculate current phase based on progress
  const phaseProgress = ((moduleIndex + 1) / course.modules.length) * 100;
  const currentPhase: "learn" | "practice" | "assess" | "review" =
    phaseProgress >= 90 ? "review" : phaseProgress >= 70 ? "assess" : phaseProgress >= 40 ? "practice" : "learn";

  const handleMarkComplete = () => {
    markModuleComplete(courseId, moduleId);
    setShowCompletionModal(true);
  };

  const handleContinue = () => {
    if (nextModule) {
      router.push(`/courses/${courseId}/${nextModule.id}`);
    } else {
      router.push(`/quiz/${courseId}`);
    }
  };

  const handleQuizComplete = (result: any) => {
    setQuizCompleted(true);
    if (result.score >= 80) {
      markModuleComplete(courseId, moduleId);
    }
  };

  const phaseConfig = {
    learn: {
      icon: BookOpen,
      label: "Learning",
      color: "blue",
      description: "Interactive exploration of core concepts",
    },
    practice: {
      icon: Lightbulb,
      label: "Practice",
      color: "amber",
      description: "Apply your knowledge with guided exercises",
    },
    assess: {
      icon: HelpCircle,
      label: "Assessment",
      color: "purple",
      description: "Test your understanding",
    },
    review: {
      icon: FileText,
      label: "Review",
      color: "green",
      description: "Consolidate your learning",
    },
  };

  const PhaseIcon = phaseConfig[activePhase].icon;

  return (
    <div className="flex min-h-[calc(100vh-8rem)]">
      {/* Module Sidebar (Desktop) */}
      <ModuleSidebar
        course={course}
        currentModuleId={moduleId}
        className="hidden lg:block"
      />

      {/* Mobile Sidebar Toggle */}
      <Button
        variant="outline"
        size="sm"
        className="lg:hidden fixed left-4 top-20 z-30 gap-2"
        onClick={() => setMobileSidebarOpen(true)}
      >
        <Menu className="w-4 h-4" />
        Modules
      </Button>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            className="fixed left-0 top-0 bottom-0 w-80 bg-card z-50 lg:hidden"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold">Modules</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileSidebarOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <ModuleSidebar
              course={course}
              currentModuleId={moduleId}
              onCollapse={() => setMobileSidebarOpen(false)}
            />
          </motion.div>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <div className="border-b border-border bg-card/50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            {/* Breadcrumbs */}
            <BreadcrumbTrail className="mb-4" />

            {/* Module header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={cn(
                      "px-2 py-0.5 text-xs font-medium rounded-full",
                      `bg-${phaseConfig[activePhase].color}-500/10 text-${phaseConfig[activePhase].color}-500`
                    )}
                  >
                    Module {moduleIndex + 1} of {course.modules.length}
                  </span>
                  {isComplete && (
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-500/10 text-green-500">
                      Completed
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  {module.title}
                </h1>
                <p className="text-muted-foreground mt-1">{module.description}</p>
              </div>

              {/* Meta info */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {module.estimatedMinutes} min
                </span>
                <span className="flex items-center gap-1">
                  <PhaseIcon className="w-4 h-4" />
                  {phaseConfig[activePhase].label}
                </span>
              </div>
            </div>

            {/* Phase indicators */}
            <div className="flex gap-2 mt-6">
              {(Object.keys(phaseConfig) as Array<keyof typeof phaseConfig>).map(
                (phase) => {
                  const Icon = phaseConfig[phase].icon;
                  const isActive = phase === activePhase;
                  const isPast =
                    (activePhase === "practice" && phase === "learn") ||
                    (activePhase === "assess" &&
                      (phase === "learn" || phase === "practice")) ||
                    (activePhase === "review" &&
                      phase !== "review");

                  return (
                    <button
                      key={phase}
                      onClick={() => setActivePhase(phase)}
                      className={cn(
                        "flex-1 flex flex-col items-center gap-2 p-3 rounded-lg transition-colors",
                        isActive && "bg-primary/10",
                        !isActive && !isPast && "hover:bg-muted/50",
                        isPast && "opacity-50"
                      )}
                    >
                      <div
                        className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : isPast
                            ? "bg-green-500/20 text-green-500"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span
                        className={cn(
                          "text-xs font-medium",
                          isActive
                            ? "text-primary"
                            : isPast
                            ? "text-green-500"
                            : "text-muted-foreground"
                        )}
                      >
                        {phaseConfig[phase].label}
                      </span>
                    </button>
                  );
                }
              )}
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Phase content */}
          <motion.div
            key={activePhase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {activePhase === "learn" && (
              <>
                {/* Interactive Component */}
                <Card className="border-border">
                  <CardHeader className="border-b border-border bg-muted/30">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Zap className="w-5 h-5 text-yellow-500" />
                      Interactive Learning
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {InteractiveComponent ? (
                      <InteractiveComponent />
                    ) : (
                      <div className="text-center py-12">
                        <Calculator className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                        <p className="text-muted-foreground">Interactive component loading...</p>
                        <p className="text-xs text-muted-foreground/60 mt-2">
                          Module: {moduleId} | Course: {courseId}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Key Takeaways */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Lightbulb className="w-5 h-5 text-amber-500" />
                      Key Takeaways
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {module.keyTakeaways.map((takeaway, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-medium text-primary">
                              {index + 1}
                            </span>
                          </div>
                          <span className="text-foreground">{takeaway}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* PDF Reference */}
                <Card className="bg-muted/30 border-dashed">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Source Reference</p>
                          <p className="text-xs text-muted-foreground">Original PDF documentation</p>
                        </div>
                      </div>
                      <a
                        href={module.pdfPath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-red-400 hover:text-red-300 transition-colors"
                      >
                        View PDF ↗
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {activePhase === "practice" && (
              <Card className="p-8 text-center">
                <Target className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground">
                  Practice Exercises
                </h3>
                <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                  Apply your knowledge with guided exercises and scenarios.
                </p>
                {InteractiveComponent && (
                  <div className="mt-6 border-t border-border pt-6">
                    <p className="text-sm text-muted-foreground mb-4">Try the interactive exercise:</p>
                    <InteractiveComponent practiceMode />
                  </div>
                )}
              </Card>
            )}

            {activePhase === "assess" && (
              <Card className="p-6">
                {quizCompleted ? (
                  <div className="text-center py-8">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground">
                      Assessment Complete!
                    </h3>
                    <p className="text-muted-foreground mt-2">
                      Great job! You&apos;ve completed the knowledge check.
                    </p>
                    <Button 
                      className="mt-6" 
                      onClick={() => setActivePhase("review")}
                    >
                      Review Results
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                          <HelpCircle className="w-5 h-5 text-purple-500" />
                          Knowledge Check
                        </h3>
                        <p className="text-muted-foreground text-sm mt-1">
                          Test your understanding of {module.title}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          ~5 min
                        </span>
                        <span className="px-2 py-1 bg-primary/10 rounded text-xs">
                          80% to pass
                        </span>
                      </div>
                    </div>
                    <AssessmentFlow
                      quizBank={getQuizBankForModule(courseId, moduleId)}
                      onComplete={handleQuizComplete}
                    />
                  </>
                )}
              </Card>
            )}

            {activePhase === "review" && (
              <>
                <Card className="p-8 text-center">
                  <FileText className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground">
                    Module Summary
                  </h3>
                  <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                    Review what you&apos;ve learned in {module.title}.
                  </p>
                </Card>

                {/* Summary Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>What You Learned</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {module.keyTakeaways.map((takeaway, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <div className="flex gap-2 justify-center">
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download Notes
                  </Button>
                  <Button variant="outline">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </>
            )}
          </motion.div>

          {/* Completion action */}
          {!isComplete && activePhase === "learn" && (
            <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-foreground">
                    Ready to continue?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Mark this module as complete to track your progress
                  </p>
                </div>
                <Button onClick={handleMarkComplete} size="lg" className="gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Mark Complete
                </Button>
              </div>
            </div>
          )}

          {/* Module complete banner */}
          {isComplete && (
            <div className="mt-8 p-6 rounded-xl bg-green-500/10 border border-green-500/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-green-500">
                    Module Completed!
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Great job! You&apos;re making excellent progress.
                  </p>
                </div>
                <Button onClick={handleContinue} className="gap-2">
                  {nextModule ? (
                    <>
                      Next Module
                      <ChevronRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Take Quiz
                      <Award className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="border-t border-border bg-card/50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              {prevModule ? (
                <Link href={`/courses/${courseId}/${prevModule.id}`}>
                  <Button variant="ghost" className="gap-2">
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </Button>
                </Link>
              ) : (
                <Link href={`/courses/${courseId}`}>
                  <Button variant="ghost" className="gap-2">
                    <ChevronLeft className="w-4 h-4" />
                    Overview
                  </Button>
                </Link>
              )}

              {/* Module progress indicator */}
              <div className="hidden sm:flex items-center gap-2">
                {course.modules.map((m, i) => (
                  <Link key={m.id} href={`/courses/${courseId}/${m.id}`}>
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full transition-all",
                        i === moduleIndex && "w-6 bg-primary",
                        i < moduleIndex && "bg-green-500",
                        i > moduleIndex && "bg-muted"
                      )}
                      title={m.title}
                    />
                  </Link>
                ))}
              </div>

              {nextModule ? (
                <Link href={`/courses/${courseId}/${nextModule.id}`}>
                  <Button variant="ghost" className="gap-2">
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              ) : (
                <Link href={`/quiz/${courseId}`}>
                  <Button className="gap-2">
                    <span className="hidden sm:inline">Take Quiz</span>
                    <Award className="w-4 h-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-2xl p-8 max-w-md w-full text-center"
          >
            <div className="w-20 h-20 rounded-full bg-green-500 mx-auto flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Module Complete!
            </h2>
            <p className="text-muted-foreground mb-6">
              You&apos;ve completed &quot;{module.title}&quot;. Keep up the great work!
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => setShowCompletionModal(false)}>
                Stay Here
              </Button>
              <Button onClick={handleContinue}>
                {nextModule ? "Next Module" : "Take Quiz"}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
