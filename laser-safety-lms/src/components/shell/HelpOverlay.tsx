"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  X,
  Search,
  BookOpen,
  MessageCircle,
  Video,
  FileText,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Mail,
  Phone,
  Play,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface HelpOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  context?: string;
}

interface HelpArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  readTime: number;
}

interface FAQItem {
  question: string;
  answer: string;
}

const helpArticles: HelpArticle[] = [
  {
    id: "getting-started",
    title: "Getting Started with Laser Safety LMS",
    content: `Welcome to the Laser Safety Learning Management System. This guide will help you navigate the platform and make the most of your learning experience.

## Course Structure
Each course is divided into modules that cover specific topics. Complete modules in sequence to build your knowledge progressively.

## Progress Tracking
Your progress is automatically saved. You can see your completion status on the dashboard and within each course.

## Earning Certificates
Complete all modules and pass the final quiz with a score of 80% or higher to earn your certificate.`,
    category: "Getting Started",
    readTime: 5,
  },
  {
    id: "laser-classification",
    title: "Understanding Laser Classification",
    content: `Laser classification is fundamental to laser safety. The classification system categorizes lasers based on their potential hazard.

## Class 1: Safe
Class 1 lasers are safe under all conditions of normal use. This includes enclosed high-power lasers.

## Class 2: Low Power Visible
Class 2 lasers emit visible light and are safe because of the blink reflex. Do not stare into the beam.

## Class 3R/3B: Medium Power
Direct viewing of these lasers can be hazardous. Safety measures are required.

## Class 4: High Power
These lasers can cause serious eye and skin injuries. Strict safety protocols must be followed.`,
    category: "Safety Fundamentals",
    readTime: 8,
  },
  {
    id: "quiz-taking",
    title: "How to Take Quizzes",
    content: `Quizzes are designed to test your understanding of course material.

## Quiz Format
- Multiple choice questions
- 80% passing score required
- Unlimited attempts allowed
- Immediate feedback provided

## Tips for Success
1. Review all modules before taking the quiz
2. Read questions carefully
3. Eliminate obviously wrong answers
4. Review explanations for incorrect answers`,
    category: "Platform Help",
    readTime: 3,
  },
];

const faqItems: FAQItem[] = [
  {
    question: "How long do I have to complete a course?",
    answer: "There is no time limit for completing courses. You can learn at your own pace and pick up where you left off at any time.",
  },
  {
    question: "Can I retake quizzes if I fail?",
    answer: "Yes, you can retake quizzes as many times as needed to pass. We encourage you to review the course material between attempts.",
  },
  {
    question: "Are certificates recognized by employers?",
    answer: "Our certificates demonstrate completion of comprehensive laser safety training. Many employers recognize this as valuable professional development.",
  },
  {
    question: "How do I track my progress across multiple devices?",
    answer: "Your progress is saved locally in your browser. For cross-device syncing, sign in to your account (coming soon).",
  },
  {
    question: "What is the difference between FDA and IEC laser standards?",
    answer: "FDA (21 CFR 1040) applies to laser products sold in the US, while IEC 60825 is the international standard. Both have similar classification systems with some differences in labeling requirements.",
  },
];

const quickGuides = [
  {
    title: "Course Navigation",
    icon: BookOpen,
    steps: ["Browse courses on the dashboard", "Click a course to see modules", "Complete modules in order"],
  },
  {
    title: "Quiz Best Practices",
    icon: CheckCircle2,
    steps: ["Review all content first", "Read questions carefully", "Review wrong answers"],
  },
];

interface ArticleViewProps {
  article: HelpArticle;
  onBack: () => void;
}

function ArticleView({ article, onBack }: ArticleViewProps) {
  return (
    <div className="h-full flex flex-col">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-primary mb-4 hover:underline"
      >
        <ChevronRight className="w-4 h-4 rotate-180" />
        Back to help
      </button>

      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <span className="px-2 py-0.5 bg-muted rounded-full">{article.category}</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {article.readTime} min read
          </span>
        </div>

        <h2 className="text-xl font-bold text-foreground mb-4">{article.title}</h2>

        <div className="prose prose-sm dark:prose-invert max-w-none">
          {article.content.split("\n\n").map((paragraph, i) => {
            if (paragraph.startsWith("## ")) {
              return (
                <h3 key={i} className="text-lg font-semibold mt-6 mb-3">
                  {paragraph.replace("## ", "")}
                </h3>
              );
            }
            return (
              <p key={i} className="text-muted-foreground mb-4">
                {paragraph}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FAQItem({ question, answer, isOpen, onToggle }: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-3 text-left"
        aria-expanded={isOpen}
      >
        <span className="text-sm font-medium text-foreground pr-4">{question}</span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="text-sm text-muted-foreground pb-3">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function HelpOverlay({ isOpen, onClose, context }: HelpOverlayProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(null);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"articles" | "faq" | "contact">("articles");

  // Filter articles based on search
  const filteredArticles = helpArticles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter FAQs based on search
  const filteredFAQs = faqItems.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reset state when closed
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setSearchQuery("");
        setSelectedArticle(null);
        setOpenFAQ(null);
        setActiveTab("articles");
      }, 300);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed right-4 top-20 w-full max-w-md max-h-[calc(100vh-6rem)] bg-popover border border-border rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-foreground">Help Center</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-muted transition-colors"
                aria-label="Close help"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Search */}
            {!selectedArticle && (
              <div className="px-4 py-3 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search help articles..."
                    className="w-full pl-9 pr-4 py-2 text-sm bg-muted rounded-lg border-0 focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              {selectedArticle ? (
                <div className="h-full p-4">
                  <ArticleView
                    article={selectedArticle}
                    onBack={() => setSelectedArticle(null)}
                  />
                </div>
              ) : (
                <>
                  {/* Tabs */}
                  <div className="flex border-b border-border">
                    {(["articles", "faq", "contact"] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                          "flex-1 px-4 py-2 text-sm font-medium capitalize transition-colors",
                          activeTab === tab
                            ? "text-primary border-b-2 border-primary"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {/* Tab content */}
                  <div className="h-[calc(100%-2.5rem)] overflow-y-auto p-4">
                    {activeTab === "articles" && (
                      <div className="space-y-4">
                        {/* Quick guides */}
                        {!searchQuery && (
                          <div className="grid grid-cols-2 gap-3">
                            {quickGuides.map((guide) => (
                              <div
                                key={guide.title}
                                className="p-3 rounded-xl bg-muted/50 border border-border"
                              >
                                <guide.icon className="w-5 h-5 text-primary mb-2" />
                                <h3 className="text-sm font-medium text-foreground">
                                  {guide.title}
                                </h3>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Articles list */}
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium text-muted-foreground">
                            {searchQuery ? "Search Results" : "Popular Articles"}
                          </h3>
                          {filteredArticles.map((article) => (
                            <button
                              key={article.id}
                              onClick={() => setSelectedArticle(article)}
                              className="w-full flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-left"
                            >
                              <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-foreground">
                                  {article.title}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {article.category} • {article.readTime} min read
                                </p>
                              </div>
                              <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            </button>
                          ))}
                          {filteredArticles.length === 0 && searchQuery && (
                            <p className="text-sm text-muted-foreground text-center py-4">
                              No articles found
                            </p>
                          )}
                        </div>

                        {/* Video tutorials link */}
                        <a
                          href="#"
                          className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20"
                        >
                          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                            <Play className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">
                              Video Tutorials
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Watch step-by-step guides
                            </p>
                          </div>
                          <ExternalLink className="w-4 h-4 text-muted-foreground" />
                        </a>
                      </div>
                    )}

                    {activeTab === "faq" && (
                      <div>
                        {filteredFAQs.map((faq, index) => (
                          <FAQItem
                            key={index}
                            question={faq.question}
                            answer={faq.answer}
                            isOpen={openFAQ === index}
                            onToggle={() => setOpenFAQ(openFAQ === index ? null : index)}
                          />
                        ))}
                        {filteredFAQs.length === 0 && searchQuery && (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            No FAQs found
                          </p>
                        )}
                      </div>
                    )}

                    {activeTab === "contact" && (
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Need more help? Our support team is here for you.
                        </p>

                        <a
                          href="mailto:support@lasersafety.com"
                          className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Mail className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">Email Support</p>
                            <p className="text-xs text-muted-foreground">
                              support@lasersafety.com
                            </p>
                          </div>
                          <ExternalLink className="w-4 h-4 text-muted-foreground" />
                        </a>

                        <a
                          href="tel:+1-800-LASER-SAFE"
                          className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                            <Phone className="w-5 h-5 text-green-500" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">Phone Support</p>
                            <p className="text-xs text-muted-foreground">
                              1-800-LASER-SAFE
                            </p>
                          </div>
                          <ExternalLink className="w-4 h-4 text-muted-foreground" />
                        </a>

                        <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                          <p className="text-sm font-medium text-foreground">
                            Response Times
                          </p>
                          <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                            <li>Email: Within 24 hours</li>
                            <li>Phone: Mon-Fri 9AM-5PM EST</li>
                            <li>Live Chat: Coming soon</li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

interface ContextualHelpProps {
  title: string;
  content: string;
  className?: string;
}

export function ContextualHelp({ title, content, className }: ContextualHelpProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        aria-expanded={isOpen}
      >
        <HelpCircle className="w-3 h-3" />
        <span>Help</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute left-0 top-full mt-2 w-72 p-4 bg-popover border border-border rounded-xl shadow-lg z-50"
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-medium text-sm text-foreground">{title}</h4>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-0.5 rounded hover:bg-muted"
                >
                  <X className="w-3 h-3 text-muted-foreground" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{content}</p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default HelpOverlay;
