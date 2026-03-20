"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Home,
  BookOpen,
  GraduationCap,
  FileText,
  MoreHorizontal,
  ChevronDown,
  LayoutDashboard,
  Award,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { courses } from "@/data/courses";

interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  isCurrent?: boolean;
}

interface BreadcrumbTrailProps {
  className?: string;
  maxItems?: number;
  showHome?: boolean;
}

const routePatterns = [
  { pattern: /^\/$/, label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
  { pattern: /^\/courses$/, label: "All Courses", icon: <BookOpen className="w-4 h-4" /> },
  { pattern: /^\/courses\/([^\/]+)$/, label: "Course", icon: <BookOpen className="w-4 h-4" /> },
  { pattern: /^\/courses\/([^\/]+)\/([^\/]+)$/, label: "Module", icon: <FileText className="w-4 h-4" /> },
  { pattern: /^\/quiz\/([^\/]+)$/, label: "Quiz", icon: <GraduationCap className="w-4 h-4" /> },
  { pattern: /^\/certificate$/, label: "Certificates", icon: <Award className="w-4 h-4" /> },
  { pattern: /^\/present\/([^\/]+)$/, label: "Presentation", icon: <BookOpen className="w-4 h-4" /> },
  { pattern: /^\/settings$/, label: "Settings", icon: <Settings className="w-4 h-4" /> },
];

export function BreadcrumbTrail({
  className,
  maxItems = 4,
  showHome = true,
}: BreadcrumbTrailProps) {
  const pathname = usePathname();
  const [showDropdown, setShowDropdown] = useState(false);

  const breadcrumbs = useMemo(() => {
    const items: BreadcrumbItem[] = [];

    if (showHome && pathname !== "/") {
      items.push({
        label: "Home",
        href: "/",
        icon: <Home className="w-4 h-4" />,
      });
    }

    // Parse path segments
    const segments = pathname?.split("/").filter(Boolean) || [];

    // Build breadcrumbs based on route patterns
    for (let i = 0; i < segments.length; i++) {
      const currentPath = "/" + segments.slice(0, i + 1).join("/");
      const remainingPath = pathname?.slice(currentPath.length) || "";
      const fullPath = currentPath + remainingPath.split("/").slice(0, 2).join("/");

      // Check if this is a course page
      if (segments[i] === "courses" && segments[i + 1]) {
        const courseId = segments[i + 1];
        const course = courses.find((c) => c.id === courseId);
        if (course) {
          items.push({
            label: course.title,
            href: `/courses/${courseId}`,
            icon: <BookOpen className="w-4 h-4" />,
          });

          // If there's a module
          if (segments[i + 2]) {
            const moduleId = segments[i + 2];
            const module = course.modules.find((m) => m.id === moduleId);
            if (module) {
              items.push({
                label: module.title,
                href: `/courses/${courseId}/${moduleId}`,
                icon: <FileText className="w-4 h-4" />,
                isCurrent: true,
              });
            }
          }
          break;
        }
      }

      // Check if this is a quiz page
      if (segments[i] === "quiz" && segments[i + 1]) {
        const courseId = segments[i + 1];
        const course = courses.find((c) => c.id === courseId);
        items.push({
          label: course ? `${course.title} Quiz` : "Quiz",
          href: pathname || "#",
          icon: <GraduationCap className="w-4 h-4" />,
          isCurrent: true,
        });
        break;
      }

      // Check if this is a certificate page
      if (segments[i] === "certificate") {
        items.push({
          label: "Certificates",
          href: "/certificate",
          icon: <Award className="w-4 h-4" />,
          isCurrent: true,
        });
        break;
      }

      // Check if this is a presentation page
      if (segments[i] === "present" && segments[i + 1]) {
        const courseId = segments[i + 1];
        const course = courses.find((c) => c.id === courseId);
        items.push({
          label: course ? `${course.title} Presentation` : "Presentation",
          href: pathname || "#",
          icon: <BookOpen className="w-4 h-4" />,
          isCurrent: true,
        });
        break;
      }

      // Generic segment handling
      const segmentLabel = segments[i]
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      if (i === segments.length - 1) {
        items.push({
          label: segmentLabel,
          href: currentPath,
          isCurrent: true,
        });
      } else {
        items.push({
          label: segmentLabel,
          href: currentPath,
        });
      }
    }

    // Mark last item as current
    if (items.length > 0) {
      items[items.length - 1].isCurrent = true;
    }

    return items;
  }, [pathname, showHome]);

  // Handle truncation
  const shouldTruncate = breadcrumbs.length > maxItems;
  let visibleBreadcrumbs = breadcrumbs;
  let hiddenBreadcrumbs: BreadcrumbItem[] = [];

  if (shouldTruncate) {
    const firstItems = breadcrumbs.slice(0, 1);
    const lastItems = breadcrumbs.slice(-(maxItems - 2));
    hiddenBreadcrumbs = breadcrumbs.slice(1, -(maxItems - 2));
    visibleBreadcrumbs = [...firstItems, { label: "...", href: "#" }, ...lastItems];
  }

  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("w-full", className)}
    >
      <ol
        className="flex flex-wrap items-center gap-1 text-sm"
        role="list"
      >
        {visibleBreadcrumbs.map((item, index) => {
          const isLast = index === visibleBreadcrumbs.length - 1;
          const isEllipsis = item.label === "...";

          return (
            <li
              key={index}
              className="flex items-center"
              aria-current={item.isCurrent ? "page" : undefined}
            >
              {index > 0 && (
                <ChevronRight
                  className="w-4 h-4 mx-1 text-muted-foreground"
                  aria-hidden="true"
                />
              )}

              {isEllipsis ? (
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center justify-center w-6 h-6 rounded hover:bg-muted transition-colors"
                    aria-label="Show more breadcrumbs"
                    aria-expanded={showDropdown}
                    aria-haspopup="true"
                  >
                    <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                  </button>

                  <AnimatePresence>
                    {showDropdown && (
                      <>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 z-40"
                          onClick={() => setShowDropdown(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-0 top-full mt-2 w-56 bg-popover border border-border rounded-lg shadow-lg z-50 py-1"
                        >
                          {hiddenBreadcrumbs.map((hidden, hiddenIndex) => (
                            <Link
                              key={hiddenIndex}
                              href={hidden.href}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                              onClick={() => setShowDropdown(false)}
                            >
                              {hidden.icon}
                              <span className="truncate">{hidden.label}</span>
                            </Link>
                          ))}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : item.isCurrent ? (
                <span
                  className={cn(
                    "flex items-center gap-1.5 px-2 py-1 rounded-md",
                    "text-foreground font-medium bg-muted"
                  )}
                  aria-current="page"
                >
                  {item.icon}
                  <span className="truncate max-w-[200px]">{item.label}</span>
                </span>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 px-2 py-1 rounded-md",
                    "text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  )}
                >
                  {item.icon}
                  <span className="truncate max-w-[200px]">{item.label}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

interface LearningPathBreadcrumbProps {
  courseName: string;
  moduleName: string;
  phase: "learn" | "practice" | "assess" | "review";
  className?: string;
}

export function LearningPathBreadcrumb({
  courseName,
  moduleName,
  phase,
  className,
}: LearningPathBreadcrumbProps) {
  const phaseColors = {
    learn: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    practice: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    assess: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    review: "bg-green-500/10 text-green-500 border-green-500/20",
  };

  const phaseLabels = {
    learn: "Learning",
    practice: "Practice",
    assess: "Assessment",
    review: "Review",
  };

  return (
    <nav
      aria-label="Learning path"
      className={cn(
        "flex items-center gap-2 text-sm",
        className
      )}
    >
      <Link
        href="/"
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        Dashboard
      </Link>
      <ChevronRight className="w-4 h-4 text-muted-foreground" />
      <Link
        href="/courses"
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        Courses
      </Link>
      <ChevronRight className="w-4 h-4 text-muted-foreground" />
      <Link
        href={`/courses/${courseName.toLowerCase().replace(/\s+/g, "-")}`}
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        {courseName}
      </Link>
      <ChevronRight className="w-4 h-4 text-muted-foreground" />
      <span className="text-foreground font-medium">{moduleName}</span>
      <span
        className={cn(
          "px-2 py-0.5 text-xs font-medium rounded-full border",
          phaseColors[phase]
        )}
      >
        {phaseLabels[phase]}
      </span>
    </nav>
  );
}

export default BreadcrumbTrail;
