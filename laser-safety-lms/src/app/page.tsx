'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Zap, BookOpen, Award, TrendingUp } from "lucide-react";
import { courses } from "@/data/courses";
import { getOverallStats } from "@/lib/progress";
import { LearningDashboard } from "@/components/dashboard";
import { Button } from "@/components/ui/button";

const totalModules = courses.reduce((sum, c) => sum + c.modules.length, 0);

export default function DashboardPage() {
  const stats = getOverallStats(totalModules, courses.length);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-border"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(220,38,38,0.1),transparent_60%)]" />
        
        <div className="relative p-8 md:p-12">
          <div className="flex items-center gap-2 text-primary text-sm font-medium mb-3">
            <Zap size={14} />
            <span>Laser Safety Training Platform</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
            Welcome to<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
              Laser Safety LMS
            </span>
          </h1>
          
          <p className="text-muted-foreground max-w-2xl mb-6 text-lg">
            Master FDA compliance, ANSI standards, state regulations, and hands-on laser safety protocols
            across {courses.length} comprehensive courses.
          </p>
          
          <div className="flex flex-wrap gap-3">
            <Link href="/courses">
              <Button size="lg" className="gap-2">
                <BookOpen className="w-4 h-4" />
                Browse All Courses
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            
            {stats.coursesFinished > 0 ? (
              <Link href="/certificate">
                <Button variant="outline" size="lg" className="gap-2">
                  <Award className="w-4 h-4" />
                  View Certificates
                </Button>
              </Link>
            ) : (
              <Link href="/courses">
                <Button variant="outline" size="lg" className="gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Start Learning
                </Button>
              </Link>
            )}
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-border/50">
            <div>
              <p className="text-2xl font-bold text-foreground">{courses.length}</p>
              <p className="text-sm text-muted-foreground">Courses</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalModules}</p>
              <p className="text-sm text-muted-foreground">Modules</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {Math.round(courses.reduce((acc, c) => acc + c.totalMinutes, 0) / 60)}h
              </p>
              <p className="text-sm text-muted-foreground">Content</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.coursesFinished}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Learning Dashboard */}
      <LearningDashboard courses={courses} />
    </div>
  );
}
