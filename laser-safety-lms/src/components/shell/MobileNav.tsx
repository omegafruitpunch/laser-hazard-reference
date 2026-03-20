"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  BookOpen,
  GraduationCap,
  User,
  MoreHorizontal,
  Compass,
  Award,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  activePattern?: RegExp;
}

const navItems: NavItem[] = [
  {
    href: "/",
    label: "Home",
    icon: Home,
  },
  {
    href: "/courses",
    label: "Learn",
    icon: BookOpen,
    activePattern: /^\/courses/,
  },
  {
    href: "/certificate",
    label: "Certificates",
    icon: Award,
  },
  {
    href: "/profile",
    label: "Profile",
    icon: User,
  },
];

interface MobileNavProps {
  className?: string;
}

export function MobileNav({ className }: MobileNavProps) {
  const pathname = usePathname();

  const isActive = (item: NavItem) => {
    if (item.activePattern) {
      return item.activePattern.test(pathname || "");
    }
    return pathname === item.href;
  };

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-border z-40",
        "safe-area-inset-bottom",
        className
      )}
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const active = isActive(item);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 w-full h-full",
                "transition-colors",
                active ? "text-primary" : "text-muted-foreground"
              )}
              aria-current={active ? "page" : undefined}
            >
              {/* Active indicator */}
              {active && (
                <motion.div
                  layoutId="mobileNavIndicator"
                  className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}

              <item.icon
                className={cn(
                  "w-5 h-5 transition-transform",
                  active && "scale-110"
                )}
              />
              <span
                className={cn(
                  "text-[10px] font-medium",
                  active && "text-primary"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Safe area spacer for iOS */}
      <div className="h-safe-area-inset-bottom bg-background" />
    </nav>
  );
}

interface FloatingActionButtonProps {
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export function FloatingActionButton({
  onClick,
  className,
  children,
}: FloatingActionButtonProps) {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "fixed bottom-20 right-4 z-30",
        "w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg",
        "flex items-center justify-center",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      aria-label="Quick action"
    >
      {children || <Compass className="w-6 h-6" />}
    </motion.button>
  );
}

export default MobileNav;
