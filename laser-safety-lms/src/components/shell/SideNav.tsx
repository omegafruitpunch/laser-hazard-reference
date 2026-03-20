"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Award,
  Settings,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  LogOut,
  Sparkles,
  TrendingUp,
  Clock,
  Target,
  BarChart3,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getOverallStats } from "@/lib/progress";
import { courses } from "@/data/courses";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
  description?: string;
}

const mainNavItems: NavItem[] = [
  {
    href: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
    description: "Overview and progress",
  },
  {
    href: "/courses",
    label: "All Courses",
    icon: BookOpen,
    description: "Browse learning content",
  },
  {
    href: "/certificate",
    label: "Certificates",
    icon: Award,
    description: "View your achievements",
  },
];

const secondaryNavItems: NavItem[] = [
  {
    href: "/analytics",
    label: "Analytics",
    icon: BarChart3,
    description: "Learning insights",
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
    description: "Preferences",
  },
  {
    href: "/help",
    label: "Help & Support",
    icon: HelpCircle,
    description: "Get assistance",
  },
];

interface SideNavProps {
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
  collapsible?: boolean;
}

export function SideNav({
  isOpen = true,
  onClose,
  className,
  collapsible = true,
}: SideNavProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const totalModules = courses.reduce((acc, c) => acc + c.modules.length, 0);
  const stats = getOverallStats(totalModules, courses.length);

  const isActive = (href: string) => {
    if (href === "/") return pathname === href;
    return pathname?.startsWith(href);
  };

  // Compact view for collapsed state
  if (collapsible && collapsed) {
    return (
      <aside
        className={cn(
          "fixed left-0 top-16 bottom-0 w-16 bg-card border-r border-border z-30",
          "hidden lg:flex flex-col",
          className
        )}
        aria-label="Sidebar navigation collapsed"
      >
        <div className="flex-1 py-4 flex flex-col items-center gap-1">
          {mainNavItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                title={item.label}
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
              >
                <item.icon className="w-5 h-5" />
              </Link>
            );
          })}

          <div className="w-8 h-px bg-border my-2" />

          {secondaryNavItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                title={item.label}
                aria-label={item.label}
              >
                <item.icon className="w-5 h-5" />
              </Link>
            );
          })}
        </div>

        {/* Expand button */}
        <div className="p-2 border-t border-border">
          <Button
            variant="ghost"
            size="icon"
            className="w-full"
            onClick={() => setCollapsed(false)}
            aria-label="Expand sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </aside>
    );
  }

  // Full expanded view
  return (
    <aside
      className={cn(
        "bg-card border-r border-border flex flex-col",
        className
      )}
      aria-label="Sidebar navigation"
    >
      {/* Mobile close button */}
      {onClose && (
        <div className="flex items-center justify-between p-4 border-b border-border lg:hidden">
          <span className="font-semibold text-foreground">Menu</span>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close menu">
            <X className="w-5 h-5" />
          </Button>
        </div>
      )}

      {/* Progress section */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-primary-foreground">
            <Target className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">Your Progress</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.overallPercent}%` }}
                  className="h-full bg-primary rounded-full"
                />
              </div>
              <span className="text-xs text-muted-foreground tabular-nums">
                {stats.overallPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="text-center p-2 rounded-lg bg-muted/50">
            <p className="text-lg font-bold text-foreground">{stats.coursesFinished}</p>
            <p className="text-[10px] text-muted-foreground">Completed</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-muted/50">
            <p className="text-lg font-bold text-foreground">{stats.completedModules}</p>
            <p className="text-[10px] text-muted-foreground">Modules</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-muted/50">
            <p className="text-lg font-bold text-foreground">5</p>
            <p className="text-[10px] text-muted-foreground">Day Streak</p>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="flex-1 py-4 overflow-y-auto" aria-label="Main">
        <div className="px-3 space-y-1">
          <p className="px-3 text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
            Main
          </p>
          {mainNavItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                )}
                aria-current={active ? "page" : undefined}
                onClick={onClose}
              >
                <item.icon className="w-5 h-5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{item.label}</p>
                  <p
                    className={cn(
                      "text-xs truncate",
                      active ? "text-primary-foreground/70" : "text-muted-foreground"
                    )}
                  >
                    {item.description}
                  </p>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-primary/20 rounded-full">
                    {item.badge}
                  </span>
                )}
                {active && <ChevronRight className="w-4 h-4 opacity-50" />}
              </Link>
            );
          })}
        </div>

        {/* Secondary navigation */}
        <div className="px-3 mt-6 space-y-1">
          <p className="px-3 text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
            More
          </p>
          {secondaryNavItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  active
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                onClick={onClose}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        {/* Pro upgrade banner */}
        <div className="p-3 rounded-lg bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 mb-4">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Upgrade to Pro</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Get certificates and advanced analytics
              </p>
            </div>
          </div>
        </div>

        {/* Collapse button (desktop only) */}
        {collapsible && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full hidden lg:flex justify-between"
            onClick={() => setCollapsed(true)}
          >
            <span className="flex items-center gap-2">
              <ChevronLeft className="w-4 h-4" />
              Collapse
            </span>
          </Button>
        )}

        {/* Sign out (mobile only) */}
        <button
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors lg:hidden"
          onClick={onClose}
        >
          <LogOut className="w-5 h-5" />
          Sign out
        </button>
      </div>
    </aside>
  );
}

export default SideNav;
