"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Monitor, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Theme = "light" | "dark" | "system";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Helper to apply theme to document
  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (newTheme === "dark" || (newTheme === "system" && systemDark)) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", newTheme);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
  };

  useEffect(() => {
    setMounted(true);
    // Check local storage or system preference
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const initialTheme = savedTheme || "system";
    setThemeState(initialTheme);
    applyTheme(initialTheme);
  }, []);

  // Listen for system preference changes
  useEffect(() => {
    if (!mounted || theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      const root = document.documentElement;
      if (e.matches) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, mounted]);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className={className} disabled>
        <Sun className="w-5 h-5" />
      </Button>
    );
  }

  const Icon = theme === "light" ? Sun : Moon;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size={showLabel ? "default" : "icon"}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className={cn(
          "relative overflow-hidden",
          showLabel && "gap-2"
        )}
        aria-label="Toggle theme"
        aria-expanded={dropdownOpen}
        aria-haspopup="listbox"
      >
        <motion.div
          initial={false}
          animate={{ rotate: theme === "light" ? 0 : 180 }}
          transition={{ duration: 0.3 }}
        >
          <Icon className="w-5 h-5" />
        </motion.div>
        {showLabel && (
          <span className="capitalize">{theme}</span>
        )}
      </Button>

      {/* Dropdown */}
      {dropdownOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setDropdownOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className={cn(
              "absolute right-0 top-full mt-2 w-40 bg-popover border border-border rounded-xl shadow-lg z-50 overflow-hidden",
              showLabel && "right-auto left-0"
            )}
            role="listbox"
            aria-label="Select theme"
          >
            {(["light", "dark", "system"] as Theme[]).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTheme(t);
                  setDropdownOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors",
                  "hover:bg-muted focus-visible:outline-none focus-visible:bg-muted",
                  theme === t && "bg-muted text-primary"
                )}
                role="option"
                aria-selected={theme === t}
              >
                {t === "light" && <Sun className="w-4 h-4" />}
                {t === "dark" && <Moon className="w-4 h-4" />}
                {t === "system" && <Monitor className="w-4 h-4" />}
                <span className="flex-1 text-left capitalize">{t}</span>
                {theme === t && <Check className="w-4 h-4" />}
              </button>
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
}

interface ThemePreviewProps {
  className?: string;
}

export function ThemePreview({ className }: ThemePreviewProps) {
  return (
    <div className={cn("flex gap-4", className)}>
      {/* Light mode preview */}
      <button
        onClick={() => {
          document.documentElement.classList.remove("dark");
          localStorage.setItem("theme", "light");
        }}
        className="flex-1 p-4 rounded-xl border-2 border-transparent hover:border-primary transition-colors bg-white text-gray-900"
      >
        <Sun className="w-6 h-6 mb-2" />
        <p className="font-medium text-sm">Light</p>
        <p className="text-xs text-gray-500">Clean and bright</p>
      </button>

      {/* Dark mode preview */}
      <button
        onClick={() => {
          document.documentElement.classList.add("dark");
          localStorage.setItem("theme", "dark");
        }}
        className="flex-1 p-4 rounded-xl border-2 border-transparent hover:border-primary transition-colors bg-gray-900 text-white"
      >
        <Moon className="w-6 h-6 mb-2" />
        <p className="font-medium text-sm">Dark</p>
        <p className="text-xs text-gray-400">Easy on the eyes</p>
      </button>
    </div>
  );
}

export default ThemeToggle;
