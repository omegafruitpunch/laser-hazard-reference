"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { TopBar } from "./TopBar";
import { SideNav } from "./SideNav";
import { MobileNav } from "./MobileNav";
import { BreadcrumbTrail } from "@/components/navigation/BreadcrumbTrail";

interface AppShellProps {
  children: React.ReactNode;
  className?: string;
  showBreadcrumbs?: boolean;
  fullWidth?: boolean;
  sidebar?: React.ReactNode;
}

export function AppShell({
  children,
  className,
  showBreadcrumbs = true,
  fullWidth = false,
  sidebar,
}: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <TopBar
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />

      {/* Side Navigation (Desktop) */}
      <SideNav
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        className="hidden lg:block"
      />

      {/* Mobile Side Navigation */}
      <AnimatePresence>
        {sidebarOpen && isMobile && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-card z-50 lg:hidden"
            >
              <SideNav isOpen={true} onClose={() => setSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div
        className={cn(
          "transition-all duration-300",
          sidebarOpen && !isMobile ? "lg:pl-72" : "lg:pl-0"
        )}
      >
        {/* Main with optional sidebar */}
        <div className="flex min-h-[calc(100vh-4rem)]">
          {/* Custom Sidebar (e.g., module sidebar) */}
          {sidebar && (
            <aside className="hidden lg:block w-80 border-r border-border bg-card/50">
              {sidebar}
            </aside>
          )}

          {/* Content */}
          <main
            className={cn(
              "flex-1",
              fullWidth ? "" : "max-w-7xl mx-auto",
              "px-4 sm:px-6 lg:px-8 py-6"
            )}
          >
            {/* Breadcrumbs */}
            {showBreadcrumbs && (
              <div className="mb-6">
                <BreadcrumbTrail />
              </div>
            )}

            {/* Page Content */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={className}
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav className="lg:hidden" />
    </div>
  );
}

export default AppShell;
