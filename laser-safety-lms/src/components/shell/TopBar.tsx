"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  HelpCircle,
  Command,
  ChevronDown,
  Award,
  Zap,
  Clock,
  X,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SearchOverlay } from "@/components/navigation/SearchOverlay";
import { ThemeToggle } from "./ThemeToggle";
import { getOverallStats } from "@/lib/progress";
import { courses } from "@/data/courses";

interface TopBarProps {
  onMenuClick?: () => void;
  sidebarOpen?: boolean;
  className?: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning";
  timestamp: Date;
  read: boolean;
}

// Mock notifications
const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Course Progress",
    message: "You're 75% through Laser Safety Fundamentals!",
    type: "info",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    read: false,
  },
  {
    id: "2",
    title: "New Achievement",
    message: "You've earned the 'First Steps' badge!",
    type: "success",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false,
  },
  {
    id: "3",
    title: "Study Reminder",
    message: "Keep your streak going! Study today to maintain your 5-day streak.",
    type: "warning",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
  },
];

export function TopBar({ onMenuClick, sidebarOpen, className }: TopBarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const totalModules = courses.reduce((acc, c) => acc + c.modules.length, 0);
  const stats = getOverallStats(totalModules, courses.length);

  // Track scroll for shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-dropdown]")) {
        setNotificationsOpen(false);
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <Award className="w-4 h-4 text-green-500" />;
      case "warning":
        return <Zap className="w-4 h-4 text-amber-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 h-16 bg-background/80 backdrop-blur-xl",
          "border-b border-border/50 transition-shadow duration-300",
          scrolled && "shadow-sm",
          className
        )}
      >
        <div className="h-full flex items-center justify-between px-4 lg:px-6">
          {/* Left section */}
          <div className="flex items-center gap-4">
            {/* Menu button (mobile/sidebar toggle) */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuClick}
              className="lg:hidden"
              aria-label={sidebarOpen ? "Close menu" : "Open menu"}
              aria-expanded={sidebarOpen}
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 group"
              aria-label="Laser Safety LMS Home"
            >
              <span className="text-2xl">🔴</span>
              <span className="hidden sm:block text-lg font-bold tracking-tight group-hover:text-primary transition-colors">
                Laser Safety LMS
              </span>
            </Link>
          </div>

          {/* Search button */}
          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <button
              onClick={() => setSearchOpen(true)}
              className={cn(
                "w-full flex items-center gap-2 px-4 py-2 rounded-lg",
                "bg-muted/50 hover:bg-muted transition-colors",
                "text-muted-foreground text-sm"
              )}
            >
              <Search className="w-4 h-4" />
              <span className="flex-1 text-left">Search...</span>
              <kbd className="flex items-center gap-1 px-1.5 py-0.5 text-xs font-mono bg-background rounded border">
                <Command className="w-3 h-3" />
                <span>K</span>
              </kbd>
            </button>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Mobile search button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </Button>

            {/* Theme toggle */}
            <ThemeToggle />

            {/* Notifications */}
            <div className="relative" data-dropdown>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setProfileOpen(false);
                }}
                aria-label={`Notifications (${unreadCount} unread)`}
                aria-expanded={notificationsOpen}
                aria-haspopup="true"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </Button>

              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-popover border border-border rounded-xl shadow-lg z-50 overflow-hidden"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                      <h3 className="font-semibold text-foreground">Notifications</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-primary hover:underline"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    {/* Notifications list */}
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center text-muted-foreground">
                          <Bell className="w-10 h-10 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No notifications</p>
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={cn(
                              "flex gap-3 px-4 py-3 border-b border-border last:border-b-0",
                              !notification.read && "bg-muted/50"
                            )}
                          >
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground">
                                {notification.title}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {notification.message}
                              </p>
                              <p className="text-[10px] text-muted-foreground mt-1">
                                {formatTime(notification.timestamp)}
                              </p>
                            </div>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />
                            )}
                          </div>
                        ))
                      )}
                    </div>

                    {/* Footer */}
                    <div className="px-4 py-2 border-t border-border bg-muted/50">
                      <Link
                        href="/notifications"
                        className="text-xs text-center text-primary hover:underline block py-1"
                        onClick={() => setNotificationsOpen(false)}
                      >
                        View all notifications
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile dropdown */}
            <div className="relative" data-dropdown>
              <button
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setNotificationsOpen(false);
                }}
                className={cn(
                  "flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors",
                  "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                )}
                aria-label="Profile menu"
                aria-expanded={profileOpen}
                aria-haspopup="true"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-primary-foreground font-medium">
                  <User className="w-4 h-4" />
                </div>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 text-muted-foreground hidden sm:block transition-transform",
                    profileOpen && "rotate-180"
                  )}
                />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-64 bg-popover border border-border rounded-xl shadow-lg z-50 overflow-hidden"
                  >
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-border bg-muted/50">
                      <p className="font-medium text-foreground">Student User</p>
                      <p className="text-xs text-muted-foreground">student@example.com</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 px-4 py-3 border-b border-border">
                      <div className="text-center">
                        <p className="text-lg font-bold text-foreground">{stats.coursesFinished}</p>
                        <p className="text-[10px] text-muted-foreground">Completed</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-foreground">{stats.completedModules}</p>
                        <p className="text-[10px] text-muted-foreground">Modules</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-foreground">5</p>
                        <p className="text-[10px] text-muted-foreground">Day Streak</p>
                      </div>
                    </div>

                    {/* Menu items */}
                    <div className="py-1">
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                        onClick={() => setProfileOpen(false)}
                      >
                        <User className="w-4 h-4 text-muted-foreground" />
                        Profile
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                        onClick={() => setProfileOpen(false)}
                      >
                        <Settings className="w-4 h-4 text-muted-foreground" />
                        Settings
                      </Link>
                      <Link
                        href="/help"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                        onClick={() => setProfileOpen(false)}
                      >
                        <HelpCircle className="w-4 h-4 text-muted-foreground" />
                        Help & Support
                      </Link>
                      <div className="border-t border-border my-1" />
                      <button
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                        onClick={() => setProfileOpen(false)}
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16" />

      {/* Search Overlay */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

export default TopBar;
