"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  GraduationCap, 
  Brain,
  Target,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText,
  Award,
  ArrowRight,
  BarChart3,
  Lightbulb,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Trophy
} from "lucide-react";

// ============================================================================
// Types & Interfaces
// ============================================================================

interface ExamTopic {
  id: string;
  name: string;
  category: string;
  clsWeight: number;
  cmlsWeight: number;
  keyConcepts: string[];
}

interface PracticeQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
  examType: "CLSO" | "CMLSO" | "both";
  difficulty: "easy" | "medium" | "hard";
}

interface StudyResource {
  title: string;
  type: "standard" | "course" | "guide" | "calculator";
  description: string;
  priority: "high" | "medium" | "low";
}

// ============================================================================
// Data Constants
// ============================================================================

const EXAM_TOPICS: ExamTopic[] = [
  {
    id: "t1",
    name: "Laser Physics & Fundamentals",
    category: "Fundamentals",
    clsWeight: 10,
    cmlsWeight: 15,
    keyConcepts: ["Coherence", "Monochromaticity", "Divergence", "Gaussian beams", "Wavelengths"]
  },
  {
    id: "t2",
    name: "Laser Classification",
    category: "Fundamentals",
    clsWeight: 10,
    cmlsWeight: 10,
    keyConcepts: ["Class 1-4 criteria", "AEL calculations", "Measurement conditions", "IEC vs FDA"]
  },
  {
    id: "t3",
    name: "Bioeffects & MPE",
    category: "Bioeffects",
    clsWeight: 15,
    cmlsWeight: 20,
    keyConcepts: ["Retinal hazards", "Corneal effects", "MPE tables", "Exposure durations", "Skin effects"]
  },
  {
    id: "t4",
    name: "Hazard Analysis",
    category: "Hazard Analysis",
    clsWeight: 15,
    cmlsWeight: 10,
    keyConcepts: ["NOHD calculations", "NHZ determination", "Controlled areas", "Beam paths"]
  },
  {
    id: "t5",
    name: "Control Measures",
    category: "Controls",
    clsWeight: 15,
    cmlsWeight: 15,
    keyConcepts: ["Engineering controls", "Administrative controls", "PPE selection", "Interlocks"]
  },
  {
    id: "t6",
    name: "LSO Responsibilities",
    category: "Administration",
    clsWeight: 15,
    cmlsWeight: 15,
    keyConcepts: ["Executive authority", "SOP development", "Training programs", "Incident investigation"]
  },
  {
    id: "t7",
    name: "Standards & Regulations",
    category: "Standards",
    clsWeight: 10,
    cmlsWeight: 10,
    keyConcepts: ["ANSI Z136.1", "21 CFR 1040", "State regulations", "Variances"]
  },
  {
    id: "t8",
    name: "Medical Surveillance",
    category: "Medical",
    clsWeight: 5,
    cmlsWeight: 5,
    keyConcepts: ["Pre-placement exams", "Post-exposure evaluation", "Medical referral"]
  }
];

const PRACTICE_QUESTIONS: PracticeQuestion[] = [
  {
    id: "q1",
    question: "What is the primary difference between Class 3B and Class 4 lasers?",
    options: [
      "Power output only",
      "Class 4 poses fire and diffuse reflection hazards; Class 3B does not",
      "Wavelength range",
      "Required warning labels"
    ],
    correctIndex: 1,
    explanation: "Class 4 lasers pose hazards from both direct exposure and scattered/diffuse reflections, and can be a fire hazard. Class 3B lasers are hazardous for direct viewing but scattered beams are normally safe.",
    category: "Classification",
    examType: "both",
    difficulty: "medium"
  },
  {
    id: "q2",
    question: "For a continuous wave visible laser (400-700 nm), what is the Maximum Permissible Exposure formula?",
    options: [
      "MPE = 1.8 × t^0.75 mW/cm²",
      "MPE = 3.0 × t^0.5 mW/cm²",
      "MPE = 1.0 mW/cm² constant",
      "MPE = 5.0 mW/cm² for all durations"
    ],
    correctIndex: 0,
    explanation: "For CW visible lasers, the MPE is calculated as 1.8 × t^0.75 mW/cm², where t is the exposure time in seconds. This formula is found in ANSI Z136.1 Table 5a.",
    category: "MPE & Bioeffects",
    examType: "both",
    difficulty: "medium"
  },
  {
    id: "q3",
    question: "Which wavelength region presents the GREATEST retinal hazard?",
    options: [
      "180-315 nm (UV-C/UV-B)",
      "315-400 nm (UV-A)",
      "400-700 nm (Visible)",
      "1400 nm - 1 mm (Far IR)"
    ],
    correctIndex: 2,
    explanation: "The visible spectrum (400-700 nm) presents the greatest retinal hazard because the eye's lens focuses this light onto the retina, concentrating the energy by up to 100,000 times.",
    category: "Bioeffects",
    examType: "both",
    difficulty: "easy"
  },
  {
    id: "q4",
    question: "According to ANSI Z136.1, the Laser Safety Officer's authority is:",
    options: [
      "Advisory only - makes recommendations to management",
      "Executive - has authority to suspend operations",
      "Limited to training personnel",
      "Only applies to medical facilities"
    ],
    correctIndex: 1,
    explanation: "The LSO must have executive authority and responsibility for the laser safety program, not merely an advisory role. The LSO has the authority to suspend laser operations if necessary.",
    category: "LSO Responsibilities",
    examType: "both",
    difficulty: "medium"
  },
  {
    id: "q5",
    question: "The Nominal Ocular Hazard Distance (NOHD) is defined as:",
    options: [
      "The distance at which the laser is no longer visible",
      "The distance from the laser where beam irradiance equals the MPE",
      "The minimum safe operating distance",
      "The maximum range of the laser beam"
    ],
    correctIndex: 1,
    explanation: "NOHD is the distance from the laser at which the beam irradiance or radiant exposure equals the appropriate MPE. Beyond this distance, the beam is considered eye-safe.",
    category: "Hazard Analysis",
    examType: "both",
    difficulty: "easy"
  },
  {
    id: "q6",
    question: "For protective eyewear, the required Optical Density (OD) is calculated by:",
    options: [
      "OD = log₁₀(Output Power)",
      "OD = log₁₀(H₀/MPE)",
      "OD = MPE × Exposure Time",
      "OD = Wavelength / 1000"
    ],
    correctIndex: 1,
    explanation: "The required OD is calculated as the logarithm base 10 of the ratio of the unprotected exposure level (H₀) to the MPE. This ensures sufficient attenuation to bring exposure below safe levels.",
    category: "Control Measures",
    examType: "both",
    difficulty: "hard"
  },
  {
    id: "q7",
    question: "Under FDA regulations, a variance is required for:",
    options: [
      "All Class 3B and Class 4 lasers",
      "Demonstration (light show) applications of Class 3B/4 lasers",
      "Medical laser products",
      "All laser products manufactured after 1986"
    ],
    correctIndex: 1,
    explanation: "A variance is required from FDA for using Class 3B or Class 4 lasers in demonstration or entertainment applications (laser light shows) because these products exceed Class I limits where the audience is located.",
    category: "Regulations",
    examType: "CLSO",
    difficulty: "medium"
  },
  {
    id: "q8",
    question: "Pre-placement eye examinations are required for personnel working with:",
    options: [
      "All classes of lasers",
      "Class 2 and above",
      "Class 3B and Class 4 only",
      "Class 4 only"
    ],
    correctIndex: 2,
    explanation: "Pre-placement eye examinations are required for personnel assigned to Class 3B or Class 4 laser work to establish a baseline for potential future exposure assessment.",
    category: "Medical Surveillance",
    examType: "both",
    difficulty: "easy"
  }
];

const STUDY_RESOURCES: StudyResource[] = [
  { title: "ANSI Z136.1-2022", type: "standard", description: "Primary standard for safe use of lasers", priority: "high" },
  { title: "ANSI Z136.3", type: "standard", description: "Healthcare facility laser safety", priority: "medium" },
  { title: "21 CFR 1040.10 & .11", type: "standard", description: "FDA laser product regulations", priority: "high" },
  { title: "Course 1: Fundamentals", type: "course", description: "Laser physics, classification, bioeffects", priority: "high" },
  { title: "Course 3: MPE & Eyewear", type: "course", description: "Maximum permissible exposure calculations", priority: "high" },
  { title: "Course 8: Standards", type: "course", description: "ANSI Z136 series and regulations", priority: "high" },
  { title: "NOHD Calculator", type: "calculator", description: "Practice hazard distance calculations", priority: "medium" },
  { title: "OD Calculator", type: "calculator", description: "Eyewear optical density calculations", priority: "medium" }
];

// ============================================================================
// Main Component
// ============================================================================

export function Module6_Certification_Prep() {
  const [activeTab, setActiveTab] = useState<"overview" | "topics" | "practice" | "study">("overview");
  const [selectedExam, setSelectedExam] = useState<"CLSO" | "CMLSO">("CLSO");
  
  // Practice exam state
  const [examPhase, setExamPhase] = useState<"intro" | "question" | "results">("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showExplanation, setShowExplanation] = useState(false);

  const filteredQuestions = PRACTICE_QUESTIONS.filter(q => 
    q.examType === "both" || q.examType === selectedExam
  );

  const startPractice = () => {
    setExamPhase("question");
    setCurrentQuestion(0);
    setAnswers({});
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    setAnswers(prev => ({ ...prev, [filteredQuestions[currentQuestion].id]: index }));
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestion < filteredQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setExamPhase("results");
    }
  };

  const calculateScore = () => {
    let correct = 0;
    filteredQuestions.forEach(q => {
      if (answers[q.id] === q.correctIndex) correct++;
    });
    return Math.round((correct / filteredQuestions.length) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-primary" />
            Module 8.6: Certification Preparation
          </h2>
          <p className="text-muted-foreground mt-1">
            CLSO and CMLSO exam preparation with practice questions
          </p>
        </div>
        <Badge variant="outline" className="text-sm px-3 py-1">
          <Award className="w-4 h-4 mr-1" />
          Exam Prep
        </Badge>
      </div>

      {/* Exam Type Selector */}
      <div className="flex gap-2">
        <button
          onClick={() => setSelectedExam("CLSO")}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            selectedExam === "CLSO" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
          )}
        >
          CLSO (General)
        </button>
        <button
          onClick={() => setSelectedExam("CMLSO")}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            selectedExam === "CMLSO" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
          )}
        >
          CMLSO (Medical)
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-border pb-1">
        {[
          { id: "overview", label: "Exam Overview", icon: Award },
          { id: "topics", label: "Topic Weights", icon: BarChart3 },
          { id: "practice", label: "Practice Questions", icon: Brain },
          { id: "study", label: "Study Resources", icon: BookOpen }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium transition-colors",
              activeTab === tab.id 
                ? "bg-primary text-primary-foreground" 
                : "hover:bg-muted"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Exam Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <GraduationCap className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">CLSO Exam</CardTitle>
                    <p className="text-sm text-muted-foreground">Certified Laser Safety Officer</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="font-bold">100</div>
                    <div className="text-xs text-muted-foreground">Questions</div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="font-bold">3 hrs</div>
                    <div className="text-xs text-muted-foreground">Duration</div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="font-bold">70%</div>
                    <div className="text-xs text-muted-foreground">Pass Score</div>
                  </div>
                </div>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• General laser safety across all applications</li>
                  <li>• Industrial, research, and entertainment</li>
                  <li>• ANSI Z136.1 comprehensive coverage</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-500/10 rounded-lg">
                    <Award className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">CMLSO Exam</CardTitle>
                    <p className="text-sm text-muted-foreground">Certified Medical Laser Safety Officer</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="font-bold">75</div>
                    <div className="text-xs text-muted-foreground">Questions</div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="font-bold">2 hrs</div>
                    <div className="text-xs text-muted-foreground">Duration</div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="font-bold">70%</div>
                    <div className="text-xs text-muted-foreground">Pass Score</div>
                  </div>
                </div>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Healthcare and medical applications</li>
                  <li>• Patient and operator safety</li>
                  <li>• ANSI Z136.3 emphasis</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Requirements */}
          <Card className="border-l-4 border-l-amber-500">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                Eligibility Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Education & Experience</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Bachelor's degree OR equivalent experience</li>
                    <li>• Minimum 3 years laser safety experience</li>
                    <li>• Current employment in laser safety role</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Recertification</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Required every 3 years</li>
                    <li>• Continuing Education Credits (CECs)</li>
                    <li>• Professional development activities</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "topics" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Exam Topic Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {EXAM_TOPICS.map(topic => (
                  <div key={topic.id} className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{topic.name}</h4>
                        <Badge variant="outline" className="text-xs">{topic.category}</Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-sm">
                          <span className="text-blue-500 font-bold">{topic.clsWeight}%</span> CLSO
                          <span className="mx-2">|</span>
                          <span className="text-emerald-500 font-bold">{topic.cmlsWeight}%</span> CMLSO
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {topic.keyConcepts.map((concept, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">{concept}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "practice" && (
        <div className="space-y-6">
          {examPhase === "intro" && (
            <Card className="max-w-2xl mx-auto">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Brain className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Practice Exam</CardTitle>
                <p className="text-muted-foreground">
                  Test your knowledge with sample {selectedExam} exam questions
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <Clock className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                    <div className="font-bold">Untimed</div>
                    <div className="text-xs text-muted-foreground">Practice mode</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <FileText className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                    <div className="font-bold">{filteredQuestions.length}</div>
                    <div className="text-xs text-muted-foreground">Questions</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <Target className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                    <div className="font-bold">Mixed</div>
                    <div className="text-xs text-muted-foreground">Difficulty</div>
                  </div>
                </div>

                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <div className="flex items-center gap-2 text-amber-700 font-medium mb-2">
                    <AlertCircle className="w-5 h-5" />
                    Practice Mode
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This is a practice exam with immediate feedback. The actual {selectedExam} exam 
                    is timed and does not provide feedback until completion.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button onClick={startPractice} size="lg">
                  Start Practice Exam
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {examPhase === "question" && (
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Progress */}
              <div className="flex items-center justify-between text-sm">
                <span>Question {currentQuestion + 1} of {filteredQuestions.length}</span>
                <Badge variant="secondary">
                  {filteredQuestions[currentQuestion].category}
                </Badge>
              </div>
              <Progress value={((currentQuestion + 1) / filteredQuestions.length) * 100} />

              {/* Question */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge 
                      className={cn(
                        filteredQuestions[currentQuestion].difficulty === "easy" && "bg-green-500",
                        filteredQuestions[currentQuestion].difficulty === "medium" && "bg-amber-500",
                        filteredQuestions[currentQuestion].difficulty === "hard" && "bg-red-500"
                      )}
                    >
                      {filteredQuestions[currentQuestion].difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg mt-3">
                    {filteredQuestions[currentQuestion].question}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {filteredQuestions[currentQuestion].options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const isCorrect = index === filteredQuestions[currentQuestion].correctIndex;
                    const showResult = showExplanation;

                    return (
                      <button
                        key={index}
                        onClick={() => !showExplanation && handleAnswer(index)}
                        disabled={showExplanation}
                        className={cn(
                          "w-full text-left p-4 rounded-lg border transition-all",
                          showResult && isCorrect && "bg-green-500/10 border-green-500",
                          showResult && isSelected && !isCorrect && "bg-red-500/10 border-red-500",
                          !showResult && isSelected && "bg-primary/10 border-primary",
                          !showResult && !isSelected && "bg-card border-border hover:border-primary/50"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
                          <span>{option}</span>
                          {showResult && isCorrect && (
                            <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto" />
                          )}
                          {showResult && isSelected && !isCorrect && (
                            <AlertCircle className="w-5 h-5 text-red-500 ml-auto" />
                          )}
                        </div>
                      </button>
                    );
                  })}

                  {/* Explanation */}
                  {showExplanation && (
                    <div className={cn(
                      "p-4 rounded-lg border mt-4",
                      selectedAnswer === filteredQuestions[currentQuestion].correctIndex
                        ? "bg-green-500/10 border-green-500/30"
                        : "bg-red-500/10 border-red-500/30"
                    )}>
                      <div className="flex items-center gap-2 font-medium mb-2">
                        {selectedAnswer === filteredQuestions[currentQuestion].correctIndex ? (
                          <>
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                            <span className="text-green-700">Correct!</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-5 h-5 text-red-500" />
                            <span className="text-red-700">Incorrect</span>
                          </>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {filteredQuestions[currentQuestion].explanation}
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    disabled={currentQuestion === 0}
                    onClick={() => {
                      setCurrentQuestion(prev => prev - 1);
                      setSelectedAnswer(answers[filteredQuestions[currentQuestion - 1].id] ?? null);
                      setShowExplanation(true);
                    }}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  {showExplanation && (
                    <Button onClick={handleNext}>
                      {currentQuestion === filteredQuestions.length - 1 ? "See Results" : "Next"}
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </div>
          )}

          {examPhase === "results" && (
            <Card className="max-w-2xl mx-auto">
              <CardHeader className="text-center">
                <div className={cn(
                  "mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4",
                  calculateScore() >= 70 ? "bg-green-500/20" : "bg-red-500/20"
                )}>
                  {calculateScore() >= 70 ? (
                    <Trophy className="w-10 h-10 text-green-500" />
                  ) : (
                    <AlertCircle className="w-10 h-10 text-red-500" />
                  )}
                </div>
                <CardTitle className="text-2xl">
                  {calculateScore() >= 70 ? "Great Job!" : "Keep Studying"}
                </CardTitle>
                <p className="text-muted-foreground">
                  {calculateScore() >= 70 
                    ? "You demonstrated solid knowledge of laser safety concepts." 
                    : "Review the topics you missed and try again."}
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className={cn(
                    "text-5xl font-bold",
                    calculateScore() >= 70 ? "text-green-500" : "text-red-500"
                  )}>
                    {calculateScore()}%
                  </div>
                  <p className="text-muted-foreground mt-2">
                    {Object.values(answers).filter((ans, i) => 
                      ans === filteredQuestions[i].correctIndex
                    ).length} correct out of {filteredQuestions.length}
                  </p>
                </div>

                {/* Question Review */}
                <div className="space-y-2">
                  <h4 className="font-semibold">Question Review:</h4>
                  {filteredQuestions.map((q, i) => {
                    const isCorrect = answers[q.id] === q.correctIndex;
                    return (
                      <div 
                        key={q.id}
                        className={cn(
                          "flex items-center gap-2 p-2 rounded",
                          isCorrect ? "bg-green-500/10" : "bg-red-500/10"
                        )}
                      >
                        {isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className="text-sm truncate">{q.question}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
              <CardFooter className="flex justify-center gap-3">
                <Button variant="outline" onClick={() => setExamPhase("intro")}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Restart
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      )}

      {activeTab === "study" && (
        <div className="space-y-6">
          {/* Priority Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Recommended Study Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {STUDY_RESOURCES.map((resource, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg"
                  >
                    <Badge 
                      className={cn(
                        "w-20 justify-center",
                        resource.priority === "high" && "bg-red-500",
                        resource.priority === "medium" && "bg-amber-500",
                        resource.priority === "low" && "bg-blue-500"
                      )}
                    >
                      {resource.priority} priority
                    </Badge>
                    <div className="flex-grow">
                      <div className="font-medium">{resource.title}</div>
                      <div className="text-sm text-muted-foreground">{resource.description}</div>
                    </div>
                    <Badge variant="outline">{resource.type}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Study Tips */}
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-primary" />
                Study Tips for Success
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Focus heavily on ANSI Z136.1 - it's the foundation of both exams</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Practice MPE table lookups until you can do them quickly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Memorize NOHD and OD calculation formulas</span>
                  </li>
                </ul>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Understand the LSO's executive authority vs advisory role</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Know FDA vs. OSHA vs. ANSI jurisdictions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Review laser classification criteria thoroughly</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default Module6_Certification_Prep;
