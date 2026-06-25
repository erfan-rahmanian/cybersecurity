"use client";

import React, { useState, useEffect } from "react";

// Custom light-weight mock-ups for motion and AnimatePresence to bypass Framer Motion SSR/Prerender context errors on React 19 / Next 15
const motion = {
  div: ({ initial, animate, exit, transition, ...props }: any) => (
    <div {...props} />
  ),
};
const AnimatePresence = ({ children }: any) => <>{children}</>;
import {
  Shield,
  Activity,
  Award,
  Terminal,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  BookOpen,
  RefreshCw,
  HelpCircle,
  Brain,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Check,
  Sun,
  Moon,
  Info,
  Star,
  Eye
} from "lucide-react";
import { getSeedQuestion, Question } from "@/lib/seedQuestions";

// Interfaces
interface UserAnswerState {
  selectedOption?: number;
  score?: number;
  textAnswer?: string;
  isCorrect?: boolean;
  gradingResult?: {
    score: number;
    status: "weak" | "partial" | "excellent";
    analysis: string;
    strengths: string;
    weaknesses: string;
    suggestedAnswer: string;
  } | null;
}

interface TopicProgress {
  completedIds: number[];
  answers: Record<number, UserAnswerState>;
}

const FlaggedSolutionBlock = ({ question, isDarkMode }: { question: any; isDarkMode: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="pt-2 border-t border-slate-100 dark:border-slate-900 mt-2">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full py-2 text-xs font-bold bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/40 text-blue-600 dark:text-cyan-400 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer border border-blue-100 dark:border-blue-900/30"
        >
          <span>دیدن پاسخ</span>
          <ChevronLeft className="h-3.5 w-3.5 transform -rotate-90 shrink-0" />
        </button>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-blue-600 dark:text-cyan-400 font-bold">پاسخ و تحلیل مرجع:</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline cursor-pointer"
            >
              پنهان‌سازی
            </button>
          </div>
          <div className={`p-3 rounded-lg text-xs leading-relaxed ${
            isDarkMode ? "bg-slate-950/50 text-slate-300" : "bg-slate-50 text-slate-700"
          }`}>
            <p className="font-medium leading-relaxed text-right">{question.explanation}</p>
            {question.hint && (
              <p className="text-slate-400 mt-1.5 border-t border-dashed border-slate-200 dark:border-slate-800 pt-1.5 text-right">
                💡 <b>راهنمایی:</b> {question.hint}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default function Home() {
  // Static Subject Configurations
  const subjects = [
    {
      id: "security+" as const,
      title: "CompTIA Security+",
      desc: "اصول هک قانونمند و زیرساخت‌‌های امنیتی شبکه، سیاست‌های احراز هویت و رمزنگاری داده‌ها.",
      levelText: "پروتکل‌ها و پایه‌های امنیت",
      color: "from-cyan-500 to-blue-600",
      accent: "cyan",
      badgeColor: "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950 dark:text-cyan-400 dark:border-cyan-800",
      glowClass: "shadow-[0_4px_20px_rgba(6,182,212,0.06)] dark:shadow-[0_0_15px_rgba(6,182,212,0.15)]",
      iconUrl: "https://img.icons8.com/color/96/shield.png",
      syllabus: [
        "CIA Triad, MFA, Cryptography",
        "IAM & Access Control Types",
        "Buffer Overflow & Memory Protections",
        "Phishing & Social Engineering Vectors"
      ]
    },
    {
      id: "ceh" as const,
      title: "Certified Ethical Hacker (CEH)",
      desc: "تکنیک‌های هک قانونمند، متدهای اسکن بسته‌ها، رپلی حملات و نحوه فرار از مکانیزم‌های دفاعی شبکه.",
      levelText: "تست نفوذ و حملات تهاجمی",
      color: "from-violet-500 to-purple-600",
      accent: "violet",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-400 dark:border-purple-800",
      glowClass: "shadow-[0_4px_20px_rgba(139,92,246,0.06)] dark:shadow-[0_0_15px_rgba(139,92,246,0.15)]",
      iconUrl: "https://img.icons8.com/color/96/hacker.png",
      syllabus: [
        "Active & Passive Footprinting",
        "TCP SYN / Port Scan Types",
        "SQL Injection: Error-Based & Blind",
        "WPA2 Krack & Wireless Spoofing",
        "IDS/IPS Fragmentation Evasion"
      ]
    },
    {
      id: "soc" as const,
      title: "SOC Analyst",
      desc: "مدیریت رویدادهای امنیتی، آنالیز لاگ‌های ویندوز، فیلترینگ هشدارهای امنیتی و سناریوهای پاسخ به رخداد.",
      levelText: "پایش رویدادها و دفاع سایبری",
      color: "from-emerald-500 to-teal-600",
      accent: "emerald",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800",
      glowClass: "shadow-[0_4px_20px_rgba(16,185,129,0.06)] dark:shadow-[0_0_15px_rgba(16,185,129,0.15)]",
      iconUrl: "https://img.icons8.com/fluency/96/radar.png",
      syllabus: [
        "Event Triage & Alert Management",
        "Windows Security Logon IDs",
        "Incident Response Containment Playbook",
        "Memory Forensics (Volatility)",
        "Apache/Nginx Log Parsing"
      ]
    }
  ];

  // GUI Tabs, selection, and Light/Dark Mode Theme
  const [activeTab, setActiveTab] = useState<"dashboard" | "exam" | "learn" | "flagged">("dashboard");
  const [selectedSub, setSelectedSub] = useState<"security+" | "ceh" | "soc">("security+");
  const [selectedExamType, setSelectedExamType] = useState<"multiple" | "essay">("multiple");

  // Flagged questions state & persistence
  interface FlaggedQuestion {
    category: "security+" | "ceh" | "soc";
    id: number;
    type: "multiple" | "essay";
  }

  const [flaggedQuestions, setFlaggedQuestions] = useState<FlaggedQuestion[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("cyberexams_flagged");
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem("cyberexams_flagged", JSON.stringify(flaggedQuestions));
    } catch (e) {
      console.error(e);
    }
  }, [flaggedQuestions]);

  const toggleFlagQuestion = (category: "security+" | "ceh" | "soc", id: number, type: "multiple" | "essay") => {
    setFlaggedQuestions(prev => {
      const isAlreadyFlagged = prev.some(q => q.category === category && q.id === id && q.type === type);
      if (isAlreadyFlagged) {
        logTerminal(`سوال ${id} از مبحث ${category} (${type === "multiple" ? "تستی" : "تشریحی"}) از لیست سوالات مهم حذف شد.`);
        return prev.filter(q => !(q.category === category && q.id === id && q.type === type));
      } else {
        logTerminal(`سوال ${id} از مبحث ${category} (${type === "multiple" ? "تستی" : "تشریحی"}) به لیست سوالات مهم اضافه شد.`);
        return [...prev, { category, id, type }];
      }
    });
  };

  const renderSubjectIcon = (id: "security+" | "ceh" | "soc" | string, className = "h-6 w-6") => {
    switch (id) {
      case "security+":
        return <Shield className={`${className} text-cyan-500`} />;
      case "ceh":
        return <Terminal className={`${className} text-purple-500`} />;
      case "soc":
        return <Activity className={`${className} text-emerald-500`} />;
      default:
        return <Shield className={className} />;
    }
  };
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      try {
        const storedTheme = localStorage.getItem("cyberexams_theme");
        return storedTheme === "dark";
      } catch (e) {
        console.error(e);
      }
    }
    return false; // Gorgeous customizable light mode by default
  });

  // Quiz progression
  const [currentQuestionId, setCurrentQuestionId] = useState<number>(1);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [loadingQuestion, setLoadingQuestion] = useState<boolean>(false);

  // Local state persistence optimized for separate multiple-choice and essay exams (100 each per topic)
  const [userProgress, setUserProgress] = useState<Record<string, TopicProgress>>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("cyberexams_progress_v3");
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      "security+_multiple": { completedIds: [], answers: {} },
      "security+_essay": { completedIds: [], answers: {} },
      "ceh_multiple": { completedIds: [], answers: {} },
      "ceh_essay": { completedIds: [], answers: {} },
      "soc_multiple": { completedIds: [], answers: {} },
      "soc_essay": { completedIds: [], answers: {} }
    };
  });

  const [essayInput, setEssayInput] = useState<string>("");
  const [showHint, setShowHint] = useState<boolean>(false);
  const [gradingResponse, setGradingResponse] = useState<boolean>(false);
  const [forceShowAnswer, setForceShowAnswer] = useState<boolean>(false);

  // Learn Tab interactive sub-states
  const [learnSubTab, setLearnSubTab] = useState<"syllabus" | "multiple-flash" | "essay-flash">("syllabus");
  const [learnCategory, setLearnCategory] = useState<"security+" | "ceh" | "soc">("security+");
  const [learnQuestionId, setLearnQuestionId] = useState<number>(1);
  const [showLearnAnswer, setShowLearnAnswer] = useState<boolean>(false);
  const [selectedLearnOption, setSelectedLearnOption] = useState<number | null>(null);

  // Local logs terminal
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "Initializing Secure Core Simulator...",
    "System loaded. Vazirmatn rendering optimized.",
    "Deterministic Evaluation Module ONLINE"
  ]);

  // Sync state helpers
  const saveProgressToStorage = (updated: Record<string, TopicProgress>) => {
    try {
      localStorage.setItem("cyberexams_progress_v3", JSON.stringify(updated));
      setUserProgress(updated);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleTheme = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    if (typeof window !== "undefined") {
      localStorage.setItem("cyberexams_theme", nextMode ? "dark" : "light");
    }
    logTerminal(`پوسته بصری به حالت ${nextMode ? "شامگاهی (Elegant Dark)" : "روز گشوده (Light Mode)"} تغییر یافت.`);
  };

  const logTerminal = (msg: string) => {
    const time = new Date().toLocaleTimeString("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
    setTerminalLogs(prev => [...prev.slice(-3), `[${time}] ${msg}`]);
  };

  // Question Loader (Now fully local & fast with type separation)
  const loadQuestion = (category: "security+" | "ceh" | "soc", id: number, examTypeParam?: "multiple" | "essay") => {
    const examType = examTypeParam || selectedExamType;

    // Wrap in setTimeout to defer state changes and prevent synchronous updates within the useEffect context
    setTimeout(() => {
      setLoadingQuestion(true);
      setCurrentQuestion(null);
      setShowHint(false);
      setForceShowAnswer(false);

      const progressKey = `${category}_${examType}`;
      const savedAns = userProgress[progressKey]?.answers[id];
      setEssayInput(savedAns?.textAnswer || "");

      try {
        const q = getSeedQuestion(category, id, examType);
        setCurrentQuestion(q);
        logTerminal(`سوال ${id} (${examType === "multiple" ? "تستی" : "تشریحی"}) مبحث ${category.toUpperCase()} با موفقیت بارگذاری شد.`);
      } catch (e) {
        console.error(e);
        logTerminal(`خطا در بازیابی ساختار سناریوی ${id}`);
      } finally {
        setLoadingQuestion(false);
      }
    }, 10);
  };

  useEffect(() => {
    if (activeTab === "exam") {
      loadQuestion(selectedSub, currentQuestionId, selectedExamType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionId, selectedSub, activeTab, selectedExamType]);

  // Navigation Questions
  const navigateQuestion = (dir: "next" | "prev") => {
    if (dir === "next" && currentQuestionId < 100) {
      setCurrentQuestionId(prev => prev + 1);
    } else if (dir === "prev" && currentQuestionId > 1) {
      setCurrentQuestionId(prev => prev - 1);
    }
  };

  // Multiple Choice Selection Answer Handler
  const selectOption = (optIndex: number) => {
    if (!currentQuestion || currentQuestion.type !== "multiple") return;

    const isCorrect = optIndex === currentQuestion.correctOption;
    const prg = JSON.parse(JSON.stringify(userProgress)) as Record<string, TopicProgress>;
    const progressKey = `${selectedSub}_multiple`;

    if (!prg[progressKey]) {
      prg[progressKey] = { completedIds: [], answers: {} };
    }

    if (!prg[progressKey].completedIds.includes(currentQuestionId)) {
      prg[progressKey].completedIds.push(currentQuestionId);
    }

    prg[progressKey].answers[currentQuestionId] = {
      selectedOption: optIndex,
      isCorrect,
      score: isCorrect ? 10 : 0
    };

    saveProgressToStorage(prg);
    logTerminal(`سوال تستی ${currentQuestionId} ثبت پاسخ شد: ${isCorrect ? "درست ✅" : "نادرست ❌"}`);
  };

  // Deterministic local essay answers grading system (No AI API, fully local and programmatical)
  const gradeEssayAnswerLocally = (question: Question, answer: string) => {
    const rawNormalized = answer.toLowerCase().trim();
    
    // Normalize Persian typographic characters for solid keyword matching
    const normalize = (str: string) => {
      return str
        .replace(/ی/g, "ی")
        .replace(/ي/g, "ی")
        .replace(/ک/g, "ک")
        .replace(/ك/g, "ک")
        .replace(/\s+/g, " ")
        .trim();
    };

    const normAnswer = normalize(rawNormalized);
    const keywords = question.keywords || [];

    if (normAnswer.length < 15) {
      return {
        score: 1,
        status: "weak" as const,
        analysis: "پاسخ ارسال‌شده بسیار مختصر و فاقد اطلاعات تحلیلی کافی است. لطفاً حداقل در یک یا دو جمله سناریو را بررسی کنید.",
        strengths: "تلاش اولیه برای نوشتن پاسخ تئوری.",
        weaknesses: "عدم استفاده از کلیدواژه‌های امنیتی و پارامترهای اصلی سناریو.",
        suggestedAnswer: question.explanation
      };
    }

    const matched: string[] = [];
    const missing: string[] = [];

    keywords.forEach(kw => {
      const normKw = normalize(kw.toLowerCase());
      if (normAnswer.includes(normKw)) {
        matched.push(kw);
      } else {
        missing.push(kw);
      }
    });

    const matchedCount = matched.length;
    const totalCount = keywords.length || 1;
    
    // Base keywords score (out of 8 pts)
    const keywordScore = Math.round((matchedCount / totalCount) * 8);
    // Length bonus (out of 2 pts)
    const lengthBonus = normAnswer.length > 80 ? 2 : (normAnswer.length > 40 ? 1 : 0);
    const score = Math.max(1, Math.min(10, keywordScore + lengthBonus));

    let status: "weak" | "partial" | "excellent" = "weak";
    if (score >= 8) {
      status = "excellent";
    } else if (score >= 4) {
      status = "partial";
    }

    let analysis = "";
    let strengths = "";
    let weaknesses = "";

    if (status === "excellent") {
      analysis = "پاسخ تشریحی شما بسیار کامل، ساختاریافته و با تسلط کامل بر مفاهیم امنیت سایبری و ابزارهای مرتبط نوشته شده است.";
      strengths = `شما به درستی مفاهیم حساس [${matched.join("، ")}] را شرح داده‌اید که ستون اصلی این مبحث است.`;
      weaknesses = "نقطه ضعف عمده‌ای یافت نشد. پاسخ شما نمره کامل و عالی را کسب کرد.";
    } else if (status === "partial") {
      analysis = "پاسخ شما تا حدودی مرتبط است و مفاهیم اولیه را پوشش داده است، اما نیاز به تکمیل جزئیات فنی و اشاره به کلیدواژه‌های مرجع دارد.";
      strengths = matched.length > 0 
        ? `اشاره مناسب به مفاهیم کلیدی [${matched.join("، ")}] که گام مثبتی است.`
        : "ارسال متنی بلند و با ساختار معتبر.";
      weaknesses = missing.length > 0
        ? `عدم اشاره یا کم‌رنگ بودن مفاهیم حائز اهمیتی نظیر [${missing.join("، ")}]. توصیه می‌شود این موارد را تحلیل کنید.`
        : "جزئیات فنی پاسخ نیاز به ارتقا دارد.";
    } else {
      analysis = "پاسخ ارسال شده ضعیف است و شامل مفاهیم حاکمیتی و کلیدی خواسته شده در سوال نمی‌گردد.";
      strengths = matched.length > 0 
        ? `شناسایی مقدماتی کلمه [${matched.join("، ")}].`
        : "ثبت پاسخ متنی برای سوال.";
      weaknesses = `عدم اشاره به پایه‌ای ترین اصطلاحات مورد انتظار مانند [${missing.join("، ")}]. پیشنهاد می‌شود پاسخ کامل مرجع را به دقت مطالعه کنید.`;
    }

    return {
      score,
      status,
      analysis,
      strengths,
      weaknesses,
      suggestedAnswer: question.explanation
    };
  };

  const gradeEssayAnswer = async () => {
    if (!currentQuestion || currentQuestion.type !== "essay" || !essayInput.trim()) return;

    setGradingResponse(true);
    logTerminal(`ارسال پاسخ تشریحی سوال ${currentQuestionId} جهت ارزیابی هوشمند و تحلیل لکسیکال...`);

    const progressKey = `${selectedSub}_essay`;

    try {
      const response = await fetch("/api/exam/grade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userAnswer: essayInput,
          category: selectedSub,
          id: currentQuestionId,
        }),
      });

      if (!response.ok) {
        throw new Error("خطا در سیستم ارزیابی هوشمند");
      }

      const report = await response.json();
      const prg = JSON.parse(JSON.stringify(userProgress)) as Record<string, TopicProgress>;

      if (!prg[progressKey]) {
        prg[progressKey] = { completedIds: [], answers: {} };
      }

      if (!prg[progressKey].completedIds.includes(currentQuestionId)) {
        prg[progressKey].completedIds.push(currentQuestionId);
      }

      prg[progressKey].answers[currentQuestionId] = {
        textAnswer: essayInput,
        score: report.score,
        isCorrect: report.score >= 5,
        gradingResult: report,
      };

      saveProgressToStorage(prg);
      logTerminal(`ارزیابی سوال تشریحی ${currentQuestionId} با نمره ${report.score}/۱۰ به ثبت رسید.`);
    } catch (error) {
      console.error("Failed to grade using API, falling back to local deterministic engine:", error);
      logTerminal(`ارتباط موقت متوقف شد. لود سیستم تحلیل محلی برای ارزیابی پاسخ...`);

      const report = gradeEssayAnswerLocally(currentQuestion, essayInput);
      const prg = JSON.parse(JSON.stringify(userProgress)) as Record<string, TopicProgress>;

      if (!prg[progressKey]) {
        prg[progressKey] = { completedIds: [], answers: {} };
      }

      if (!prg[progressKey].completedIds.includes(currentQuestionId)) {
        prg[progressKey].completedIds.push(currentQuestionId);
      }

      prg[progressKey].answers[currentQuestionId] = {
        textAnswer: essayInput,
        score: report.score,
        isCorrect: report.score >= 5,
        gradingResult: report,
      };

      saveProgressToStorage(prg);
    } finally {
      setGradingResponse(false);
    }
  };

  // Reset progress logic
  const handleReset = () => {
    const confirmation = window.confirm(
      `آیا مطمئن هستید که می‌خواهید پیشرفت این آزمون ۱۰۰ سوالی ${selectedExamType === "multiple" ? "تستی" : "تشریحی"} را به طور کامل پاک کنید؟`
    );
    if (!confirmation) return;

    const prg = JSON.parse(JSON.stringify(userProgress)) as Record<string, TopicProgress>;
    const progressKey = `${selectedSub}_${selectedExamType}`;

    prg[progressKey] = { completedIds: [], answers: {} };
    saveProgressToStorage(prg);
    setCurrentQuestionId(1);
    logTerminal(`پیشرفت آزمون ${selectedExamType === "multiple" ? "تستی" : "تشریحی"} مبحث ${selectedSub.toUpperCase()} به کلی بازنشانی گردید.`);
    loadQuestion(selectedSub, 1, selectedExamType);
  };

  // Calculate statistics (Supports specific exam type or currently active exam type)
  const getSubjectStats = (subId: "security+" | "ceh" | "soc", typeParam?: "multiple" | "essay") => {
    const targetType = typeParam || selectedExamType;
    const progressKey = `${subId}_${targetType}`;
    const progress = userProgress[progressKey] || { completedIds: [], answers: {} };

    const totalCompleted = progress.completedIds.length;
    const percent = Math.min(100, totalCompleted);

    let correctCount = 0;
    let totalScore = 0;
    let gradedCount = 0;

    Object.entries(progress.answers).forEach(([_, state]) => {
      if (state.isCorrect) correctCount++;
      if (state.score !== undefined) {
        totalScore += state.score;
        gradedCount++;
      }
    });

    const avgScore = gradedCount > 0 ? (totalScore / gradedCount).toFixed(1) : "0";
    return {
      percent,
      correct: correctCount,
      avgScore
    };
  };

  const getDifficultyTitle = (id: number) => {
    if (id <= 33) return "آسان (پایه‌ها و مفاهیم بنیادین)";
    if (id <= 66) return "متوسط (سناریوها، ابزارها و تست نفوذ)";
    return "سخت (کدهای حمله، پلی‌بوک عملیاتی و فارنزیک)";
  };

  const getDifficultyColor = (id: number) => {
    if (id <= 33) {
      return isDarkMode
        ? "text-emerald-400 bg-emerald-950/40 border-emerald-900"
        : "text-emerald-700 bg-emerald-50 border-emerald-200";
    }
    if (id <= 66) {
      return isDarkMode
        ? "text-cyan-400 bg-cyan-950/40 border-cyan-800"
        : "text-cyan-700 bg-cyan-50 border-cyan-200";
    }
    return isDarkMode
      ? "text-purple-400 bg-purple-950/40 border-purple-900"
      : "text-purple-700 bg-purple-50 border-purple-200";
  };

  const totalCompletedCount =
    (userProgress["security+_multiple"]?.completedIds?.length || 0) +
    (userProgress["security+_essay"]?.completedIds?.length || 0) +
    (userProgress["ceh_multiple"]?.completedIds?.length || 0) +
    (userProgress["ceh_essay"]?.completedIds?.length || 0) +
    (userProgress["soc_multiple"]?.completedIds?.length || 0) +
    (userProgress["soc_essay"]?.completedIds?.length || 0);

  const totalProgressPercent = Math.min(100, Math.round((totalCompletedCount / 600) * 100));

  return (
    <div
      className={`min-h-screen ${
        isDarkMode
          ? "bg-[#0A0B0E] text-slate-100 selection:bg-blue-600/30 selection:text-blue-100"
          : "bg-[#F8FAFC] text-slate-800 selection:bg-blue-100 selection:text-blue-900"
      } flex flex-col justify-between px-4 md:px-8 py-6 transition-colors duration-300 font-sans`}
      id="main-applet-container"
    >
      {/* GLOBAL HEADER */}
      <header
        className={`border-b ${
          isDarkMode ? "border-slate-900 bg-[#0A0B0E]" : "border-slate-205/85 bg-white shadow-sm"
        } pb-5 mb-8 rounded-2xl p-4 transition-all duration-300`}
        id="global-header-panel"
      >
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 flex items-center justify-center shrink-0">
              <img src="https://img.icons8.com/fluency/96/shield.png" className="h-10 w-10" alt="Cyber Academy Logo" />
            </div>
            <div>
              <h1 className={`text-lg font-bold tracking-tight ${isDarkMode ? "text-white" : "text-slate-950"} flex items-center gap-2`}>
                آکادمی آزمون‌های امنیت سایبری
                <span className={`text-[10px] uppercase font-mono tracking-widest ${
                  isDarkMode 
                    ? "bg-blue-950 border border-blue-800 text-blue-400" 
                    : "bg-blue-50 border border-blue-200 text-blue-700"
                } px-2 py-0.5 rounded-full font-bold`}>
                  v3.5 Local Core
                </span>
              </h1>
              <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>کنسول شبیه‌ساز سناریو محور تستی و تشریحی بدون نیاز به اینترنت</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Header tab switcher */}
            <div className={`flex flex-wrap items-center gap-1.5 ${isDarkMode ? "bg-slate-950/80 border-slate-900" : "bg-slate-100 border-slate-200/80"} p-1.5 rounded-xl border`}>
              <button
                onClick={() => {
                  setActiveTab("dashboard");
                  logTerminal("ورود به داشبورد پیشخوان اصلی.");
                }}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition duration-250 cursor-pointer ${
                  activeTab === "dashboard" || activeTab === "exam"
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/10"
                    : `${isDarkMode ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-950"}`
                }`}
              >
                کنسول اصلی
              </button>
              <button
                onClick={() => {
                  setActiveTab("learn");
                  logTerminal("ورود به بخش کارت‌های مرور درسنامه.");
                }}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition duration-250 cursor-pointer ${
                  activeTab === "learn"
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/10"
                    : `${isDarkMode ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-950"}`
                }`}
              >
                کارت‌های مرور درسنامه
              </button>
              <button
                onClick={() => {
                  setActiveTab("flagged");
                  logTerminal("ورود به بخش سوالات مهم نشان‌شده.");
                }}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition duration-250 cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "flagged"
                    ? "bg-amber-500 text-white shadow-sm shadow-amber-500/10"
                    : `${isDarkMode ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-950"}`
                }`}
              >
                <Star className={`h-3.5 w-3.5 ${activeTab === "flagged" ? "fill-white text-white" : "text-amber-500"}`} />
                سوالات مهم ({flaggedQuestions.length})
              </button>
            </div>

            {/* HIGH CONTRACT LIGHT/DARK TOGGLER WITH ICONS8 */}
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl border ${
                isDarkMode
                  ? "bg-slate-950 border-slate-850 text-amber-400 hover:text-amber-300"
                  : "bg-white border-slate-250 text-indigo-600 hover:bg-slate-50 shadow-sm"
              } transition-all duration-300 cursor-pointer`}
              title={isDarkMode ? "تغییر به لایت مود" : "تغییر به دارک مود"}
            >
              {isDarkMode ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>
          </div>
          
        </div>
      </header>

      {/* CORE WRAPPER */}
      <main className="max-w-7xl mx-auto w-full flex-1">
        
        {/* VIEW 1: DASHBOARD */}
        {activeTab === "dashboard" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* HERO PANEL */}
            <div className={`relative overflow-hidden rounded-2xl border ${
              isDarkMode 
                ? "border-slate-800 bg-[#0F1115] hover:bg-[#15181E]" 
                : "border-slate-200 bg-white hover:bg-slate-50/50 shadow-[0_4px_30px_rgba(0,0,0,0.01)]"
            } p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 transition-colors duration-300`}
            id="hero-dashboard-card"
            >
              <div className="space-y-3 z-10 text-right md:max-w-xl">
                <div className={`inline-flex items-center gap-1.5 ${
                  isDarkMode 
                    ? "bg-emerald-950/80 border border-emerald-900 text-emerald-400" 
                    : "bg-emerald-50 border border-emerald-250 text-emerald-700"
                } text-[10px] px-2.5 py-1 rounded-full font-bold`}>
                  <Activity className="h-3 w-3 shrink-0" />
                  سامانه سنجش و آماده‌سازی آنلاین مرجع سکیوریتی
                </div>
                <h2 className={`text-xl md:text-2xl font-black ${isDarkMode ? "text-white" : "text-slate-950"} leading-tight`}>
                  آزمون جامع ۳۰۰ سواله امنیت شبکه و تست نفوذ
                </h2>
                <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-600"} leading-relaxed`}>
                  سه آزمون جامع ۱۰۰ سواله در سرفصل‌های رسمی Security+ (مفاهیم و سه‌گانه امنیت)، CEH (هک اخلاقی و تست‌ نفوذ عملیاتی)، و SOC Analyst (تحلیل دفاع و تریاژ حوادث). سوالات به تدریج از پایه‌های تئوری به سناریوهای عمیق، لاگ‌های لینوکس و باج‌افزارها افزایش درجه سختی می‌یابند.
                </p>
              </div>

              {/* Award progress badge using Icons8 Medal */}
              <div className={`flex flex-col items-center justify-center p-6 ${
                isDarkMode ? "bg-slate-950/60 border-slate-900" : "bg-slate-50 border-slate-200"
              } border rounded-xl min-w-[200px] hover:border-blue-500/40 transition duration-300`}>
                <img src="https://img.icons8.com/fluency/96/diploma.png" className="h-10 w-10 mb-2 animate-bounce" alt="Diploma Award" />
                <span className={`text-[11px] ${isDarkMode ? "text-slate-500" : "text-slate-500"} uppercase tracking-widest font-mono font-bold`}>پیشرفت کل آکادمی</span>
                <b className={`text-3xl font-black ${isDarkMode ? "text-white" : "text-slate-950"} tracking-tight mt-1 font-mono`}>{totalProgressPercent}%</b>
                <span className={`text-[10px] ${isDarkMode ? "text-slate-400" : "text-slate-500"} mt-1 font-mono`}>({totalCompletedCount} از ۳۰۰ سوال)</span>
              </div>
            </div>

            {/* SYLLABUS TOPICS GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="subject-cards-grid">
              {subjects.map(sub => {
                const statsMultiple = getSubjectStats(sub.id, "multiple");
                const statsEssay = getSubjectStats(sub.id, "essay");
                const isSelected = selectedSub === sub.id;

                return (
                  <div
                    key={sub.id}
                    className={`border rounded-xl transition duration-300 relative flex flex-col justify-between overflow-hidden ${
                      isDarkMode 
                        ? `bg-[#0F1115] ${sub.glowClass} ${isSelected ? "border-blue-500/50" : "border-slate-800 hover:border-slate-700"}` 
                        : `bg-white ${sub.glowClass} ${isSelected ? "border-blue-500" : "border-slate-200/80 hover:border-slate-350 hover:shadow-md"}`
                    }`}
                  >
                    <div className="p-5 space-y-4">
                      
                      <div className={`flex items-center justify-between border-b ${isDarkMode ? "border-slate-900" : "border-slate-100"} pb-3`}>
                        <div className="flex items-center gap-2">
                          {renderSubjectIcon(sub.id, "h-6 w-6 shrink-0")}
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border ${sub.badgeColor} font-mono uppercase`}>
                            {sub.id}
                          </span>
                        </div>
                        <span className={`text-xs ${isDarkMode ? "text-slate-500" : "text-slate-500"} font-medium`}>{sub.levelText}</span>
                      </div>

                      <div className="space-y-2">
                        <h3 className={`text-base font-bold ${isDarkMode ? "text-white" : "text-slate-950"} tracking-tight`}>{sub.title}</h3>
                        <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-600"} leading-relaxed min-h-[3.5rem]`}>{sub.desc}</p>
                      </div>

                      {/* Course statistics split cards inside */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {/* Multiple Choice Stats */}
                        <div className={`${isDarkMode ? "bg-slate-950/70 border-slate-900" : "bg-blue-50/40 border-blue-100/60"} p-2.5 rounded-lg border space-y-1.5`}>
                          <span className="text-[10px] font-bold text-blue-600 dark:text-cyan-400 block">📝 آزمون تستی</span>
                          <div className="flex justify-between items-center text-[10px] text-slate-500">
                            <span>پیشرفت:</span>
                            <span className={`font-mono ${isDarkMode ? "text-white" : "text-slate-950"} font-bold`}>{statsMultiple.percent}%</span>
                          </div>
                          <div className={`h-1 w-full ${isDarkMode ? "bg-slate-900" : "bg-slate-200"} rounded-full overflow-hidden`}>
                            <div
                              className="h-full bg-blue-500 rounded-full transition-all duration-300"
                              style={{ width: `${statsMultiple.percent}%` }}
                            />
                          </div>
                        </div>

                        {/* Essay Stats */}
                        <div className={`${isDarkMode ? "bg-slate-950/70 border-slate-900" : "bg-emerald-50/40 border-emerald-100/60"} p-2.5 rounded-lg border space-y-1.5`}>
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block">✍️ آزمون تشریحی</span>
                          <div className="flex justify-between items-center text-[10px] text-slate-500">
                            <span>پیشرفت:</span>
                            <span className={`font-mono ${isDarkMode ? "text-white" : "text-slate-950"} font-bold`}>{statsEssay.percent}%</span>
                          </div>
                          <div className={`h-1 w-full ${isDarkMode ? "bg-slate-900" : "bg-slate-200"} rounded-full overflow-hidden`}>
                            <div
                              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                              style={{ width: `${statsEssay.percent}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Topics outline micro-pills */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">مهم‌ترین سرفصل‌های سنجش:</span>
                        <div className="flex flex-wrap gap-1">
                          {sub.syllabus.map((topic, index) => (
                            <span key={index} className={`text-[9px] ${
                              isDarkMode 
                                ? "bg-slate-900 text-slate-300 border-slate-800" 
                                : "bg-slate-100 text-slate-650 border-slate-200/60"
                            } px-2 py-0.5 rounded border font-medium`}>
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>

                    </div>

                    <div className={`p-3 border-t ${isDarkMode ? "border-slate-900 bg-slate-950/30" : "border-slate-100 bg-slate-50/50"} flex gap-2`}>
                      <button
                        onClick={() => {
                          setSelectedSub(sub.id);
                          setSelectedExamType("multiple");
                          setCurrentQuestionId(1);
                          setActiveTab("exam");
                          logTerminal(`ورود به آزمون تستی ۱۰۰ سوالی ${sub.title}.`);
                        }}
                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-350 cursor-pointer flex items-center justify-center gap-1 ${
                          statsMultiple.percent > 0
                            ? "bg-slate-200 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-300"
                            : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md"
                        }`}
                      >
                        <span>تستی (۱۰۰ سوال)</span>
                        <ArrowLeft className="h-3 w-3 shrink-0" />
                      </button>

                      <button
                        onClick={() => {
                          setSelectedSub(sub.id);
                          setSelectedExamType("essay");
                          setCurrentQuestionId(1);
                          setActiveTab("exam");
                          logTerminal(`ورود به آزمون تشریحی ۱۰۰ سوالی ${sub.title}.`);
                        }}
                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-350 cursor-pointer flex items-center justify-center gap-1 ${
                          statsEssay.percent > 0
                            ? "bg-slate-200 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-300"
                            : "bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-md"
                        }`}
                      >
                        <span>تشریحی (۱۰۰ سوال)</span>
                        <ArrowLeft className="h-3 w-3 shrink-0" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* CYBERSHELL LOGS PANEL */}
            <div className={`border ${isDarkMode ? "border-slate-850 bg-slate-950" : "border-slate-200 bg-slate-900"} rounded-xl p-4 font-mono select-none`}>
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-3 text-xs text-slate-400">
                <span className="flex items-center gap-1 text-slate-300">
                  <Terminal className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                  Terminal Console v1.5_Local
                </span>
                <span className="text-[10px] text-emerald-400 uppercase tracking-widest flex items-center gap-1 font-bold">
                  <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-ping" />
                  active mode
                </span>
              </div>
              <div className="space-y-1.5 text-xs text-slate-300">
                {terminalLogs.map((log, index) => (
                  <p key={index} className="leading-relaxed whitespace-pre-wrap">
                    {log}
                  </p>
                ))}
              </div>
            </div>

          </motion.div>
        )}

        {/* VIEW 2: EXAM INTERFACE */}
        {activeTab === "exam" && (
          <div className="space-y-6">
            
            {/* Quick Header controls */}
            <div className={`flex flex-col md:flex-row items-center justify-between gap-4 border ${
              isDarkMode ? "border-slate-850 bg-slate-950/40" : "border-slate-200 bg-white shadow-sm"
            } p-4 rounded-xl`}>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setActiveTab("dashboard");
                      logTerminal("برگشت به داشبورد پیشخوان.");
                    }}
                    className={`p-2 rounded-lg ${
                      isDarkMode ? "bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    } transition cursor-pointer`}
                    title="بازگشت به پیشخوان"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <div className={`h-4 w-[1px] ${isDarkMode ? "bg-slate-800" : "bg-slate-200"}`} />
                  <div>
                    <h3 className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-slate-950"} flex items-center gap-1.5`}>
                      تالار ارزیابی آزمون سه‌گانه:
                      <span className="text-cyan-600 dark:text-cyan-400 uppercase font-mono bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-900 px-2.5 py-0.5 rounded text-[11px] font-bold">
                        {selectedSub.toUpperCase()}
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      پیمایش و حل ۱۰۰ سوال سنجش سطح‌بندی شده (آسان به سخت)
                    </p>
                  </div>
                </div>

                {/* Split Exam Toggle Tabs inside Exam Interface */}
                <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border border-slate-200/80 dark:border-slate-800 gap-1 shrink-0">
                  <button
                    onClick={() => {
                      setSelectedExamType("multiple");
                      setCurrentQuestionId(1);
                      logTerminal(`انتخاب ارزیابی نوع تستی سوالات (${selectedSub.toUpperCase()})`);
                    }}
                    className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all duration-300 cursor-pointer flex items-center gap-1 ${
                      selectedExamType === "multiple"
                        ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-cyan-400 shadow-sm"
                        : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    }`}
                  >
                    📝 آزمون تستی
                  </button>
                  <button
                    onClick={() => {
                      setSelectedExamType("essay");
                      setCurrentQuestionId(1);
                      logTerminal(`انتخاب ارزیابی نوع تشریحی سوالات (${selectedSub.toUpperCase()})`);
                    }}
                    className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all duration-300 cursor-pointer flex items-center gap-1 ${
                      selectedExamType === "essay"
                        ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm"
                        : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    }`}
                  >
                    ✍️ آزمون تشریحی
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-950 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 text-xs font-semibold hover:bg-red-100 dark:hover:bg-red-900/30 transition flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" />
                  پاکسازی پیشرفت {selectedExamType === "multiple" ? "تستی" : "تشریحی"}
                </button>
              </div>
            </div>

            {/* BUBBLE NAVIGATION GRID */}
            <div className={`border ${isDarkMode ? "border-slate-850 bg-slate-900/50" : "border-slate-200 bg-white shadow-sm"} p-4 rounded-xl space-y-3`}>
              <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 dark:border-slate-850/50 pb-2">
                <span>نقشه پیمایش ۱۰۰ سوال آزمون {selectedExamType === "multiple" ? "تستی" : "تشریحی"} (سطح آسان به سخت):</span>
                <span className="font-mono text-[11px] text-cyan-600 dark:text-cyan-400 font-bold">
                  پیشرفت: {getSubjectStats(selectedSub).percent}% completed
                </span>
              </div>
              
              <div className="grid grid-cols-10 sm:grid-cols-20 gap-1.5 justify-center max-h-[160px] overflow-y-auto pr-1">
                {Array.from({ length: 100 }, (_, i) => {
                  const qNum = i + 1;
                  const isCurrent = currentQuestionId === qNum;
                  const progressKey = `${selectedSub}_${selectedExamType}`;
                  const answered = userProgress[progressKey]?.answers?.[qNum];
                  const completed = userProgress[progressKey]?.completedIds?.includes(qNum);

                  let bgClass = isDarkMode
                    ? "bg-slate-950 border border-slate-800 text-slate-500 hover:border-slate-700 hover:text-white"
                    : "bg-white border border-slate-200 text-slate-400 hover:border-slate-350 hover:bg-slate-50 hover:text-slate-800";
                  
                  if (completed) {
                    if (answered?.isCorrect) {
                      bgClass = isDarkMode 
                        ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200";
                    } else if (answered?.isCorrect === false) {
                      bgClass = isDarkMode
                        ? "bg-red-950/60 text-red-400 border-red-900/40"
                        : "bg-red-50 text-red-700 border-red-200";
                    } else {
                      bgClass = isDarkMode
                        ? "bg-cyan-950 text-cyan-400 border-cyan-800"
                        : "bg-cyan-50 text-cyan-700 border-cyan-200";
                    }
                  }

                  if (isCurrent) {
                    bgClass += " ring-2 ring-blue-500 ring-offset-2 " + (isDarkMode ? "ring-offset-[#0A0B0E]" : "ring-offset-white");
                  }

                  return (
                    <button
                      key={qNum}
                      onClick={() => setCurrentQuestionId(qNum)}
                      className={`h-7 w-7 rounded-lg text-[10px] font-bold font-mono transition inline-flex items-center justify-center cursor-pointer ${bgClass}`}
                    >
                      {qNum}
                    </button>
                  );
                })}
              </div>

              {/* Difficulty indicators explanation */}
              <div className="flex flex-wrap gap-4 pt-1.5 text-[10px] text-slate-500 border-t border-slate-100 dark:border-slate-850/40 justify-center">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  آسان (۱ تا ۳۳)
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-cyan-500" />
                  متوسط (۳۴ تا ۶۶)
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-purple-500" />
                  سخت (۶۷ تا ۱۰۰)
                </span>
                <span className="flex items-center gap-1">
                  • تستی: فرد | تشریحی: زوج
                </span>
              </div>
            </div>

            {/* MAIN ACTIVE EXAM PANEL GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Question container box (col-span 2) */}
              <div className="lg:col-span-2 space-y-4">
                
                <AnimatePresence mode="wait">
                  {loadingQuestion ? (
                    <div className={`border ${isDarkMode ? "border-slate-850 bg-slate-900" : "border-slate-205 bg-white"} rounded-xl p-16 flex flex-col items-center justify-center space-y-3`}>
                      <RefreshCw className="h-8 w-8 text-cyan-500 animate-spin" />
                      <p className="text-xs text-slate-500">در حال رندر و تحلیل هوشمند محلی...</p>
                    </div>
                  ) : currentQuestion ? (
                    <motion.div
                      key={currentQuestion.id}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className={`border ${
                        isDarkMode ? "border-slate-850 bg-[#0F1115]" : "border-slate-200 bg-white shadow-md"
                      } rounded-xl overflow-hidden flex flex-col justify-between min-h-[420px]`}
                    >
                      {/* Sub-header status bar within card */}
                      <div className={`p-4 ${isDarkMode ? "bg-slate-950/60 border-slate-850" : "bg-slate-50 border-b border-slate-200/80"} flex flex-wrap items-center justify-between gap-2.5`}>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-[11px] font-bold ${isDarkMode ? "text-slate-400" : "text-slate-650"}`}>سوال {currentQuestion.id} از ۱۰۰</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase font-mono ${getDifficultyColor(currentQuestion.id)}`}>
                            {currentQuestion.difficulty}
                          </span>
                          
                          {/* Flag as Important Button */}
                          <button
                            onClick={() => toggleFlagQuestion(selectedSub, currentQuestion.id, selectedExamType)}
                            className={`p-1.5 rounded-lg border transition-all cursor-pointer inline-flex items-center gap-1.5 text-[10px] font-bold ${
                              flaggedQuestions.some(q => q.category === selectedSub && q.id === currentQuestion.id && q.type === selectedExamType)
                                ? "bg-amber-100 border-amber-300 text-amber-700 dark:bg-amber-955 dark:border-amber-800 dark:text-amber-400"
                                : isDarkMode
                                  ? "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                                  : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                            }`}
                            title={
                              flaggedQuestions.some(q => q.category === selectedSub && q.id === currentQuestion.id && q.type === selectedExamType)
                                ? "حذف از سوالات مهم"
                                : "افزودن به سوالات مهم"
                            }
                          >
                            <Star className={`h-3.5 w-3.5 ${
                              flaggedQuestions.some(q => q.category === selectedSub && q.id === currentQuestion.id && q.type === selectedExamType)
                                ? "fill-amber-400 text-amber-400"
                                : ""
                            }`} />
                            {flaggedQuestions.some(q => q.category === selectedSub && q.id === currentQuestion.id && q.type === selectedExamType)
                              ? "نشان شده"
                              : "نشان کردن سوال"
                            }
                          </button>
                        </div>
                        <span className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-600"} font-semibold`}>سرفصل: {currentQuestion.syllabusTopic}</span>
                      </div>

                      {/* Question Text zone */}
                      <div className="p-6 space-y-6">
                        
                        <div className="space-y-4">
                          <div className="flex gap-2">
                            <span className={`h-6 w-6 rounded-md ${
                              isDarkMode ? "bg-blue-600/20 text-blue-400 border-blue-900" : "bg-blue-50 text-blue-700 border-blue-200"
                            } border flex items-center justify-center shrink-0 font-bold font-mono text-xs shadow-sm`}>Q</span>
                            <h4 className={`text-sm lg:text-base font-bold ${isDarkMode ? "text-slate-100" : "text-slate-950"} leading-relaxed text-right`}>
                              {currentQuestion.questionText}
                            </h4>
                          </div>

                          {/* Beautiful Icons8 powered hint banner */}
                          {currentQuestion.hint && (
                            <div className={`p-3 rounded-lg border ${
                              isDarkMode ? "bg-slate-900/40 border-slate-800" : "bg-amber-50/55 border-amber-200"
                            }`}>
                              <button
                                onClick={() => setShowHint(!showHint)}
                                className="inline-flex items-center gap-1.5 text-xs text-amber-600 dark:text-cyan-400 hover:underline font-bold cursor-pointer"
                              >
                                <img src="https://img.icons8.com/fluency/48/idea.png" className="h-4 w-4" alt="Hint Icon" />
                                {showHint ? "مخفی کردن راهنمایی" : "نمایش راهنمایی برای حل"}
                              </button>
                              
                              {showHint && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  className="mt-2 text-xs text-slate-600 dark:text-cyan-300 leading-relaxed font-normal"
                                >
                                  {currentQuestion.hint}
                                </motion.div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* RENDER QUESTION SPECIFIC INPUT MODULES */}
                        {currentQuestion.type === "multiple" ? (
                          // MULTIPLE CHOICE TYPE (Odds)
                          <div className="space-y-2.5">
                            {currentQuestion.options?.map((option, idx) => {
                              const examKey = `${selectedSub}_multiple`;
                              const userAns = userProgress[examKey]?.answers?.[currentQuestionId];
                              const isSelected = userAns?.selectedOption === idx;
                              const isCorrectOption = idx === currentQuestion.correctOption;

                              let btnStyle = isDarkMode
                                ? "bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:text-white"
                                : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900";
                              
                              if (userAns !== undefined) {
                                if (isCorrectOption) {
                                  btnStyle = isDarkMode
                                    ? "bg-emerald-950/60 border-emerald-800 text-emerald-400 font-bold"
                                    : "bg-emerald-50 border-emerald-300 text-emerald-800 font-bold shadow-sm";
                                } else if (isSelected) {
                                  btnStyle = isDarkMode
                                    ? "bg-red-950/60 border-red-900/60 text-red-100"
                                    : "bg-red-50 border-red-300 text-red-800 shadow-sm";
                                } else {
                                  btnStyle = "bg-transparent border-slate-200 dark:border-slate-850 text-slate-400 opacity-50 cursor-not-allowed";
                                }
                              }

                              return (
                                <button
                                  key={idx}
                                  disabled={userAns !== undefined}
                                  onClick={() => selectOption(idx)}
                                  className={`w-full p-3.5 rounded-xl border text-xs text-right transition cursor-pointer flex items-center justify-between gap-4 font-normal ${btnStyle}`}
                                >
                                  <span>{option}</span>
                                  {userAns !== undefined && isCorrectOption && (
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                                  )}
                                  {userAns !== undefined && isSelected && !isCorrectOption && (
                                    <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          // ESSAY TYPE (Evens)
                          (() => {
                            const essayKey = `${selectedSub}_essay`;
                            const currentEssayAns = userProgress[essayKey]?.answers?.[currentQuestionId];
                            
                            return (
                              <div className="space-y-4">
                                <div className="space-y-1.5">
                                  <label className={`text-[11px] font-bold ${isDarkMode ? "text-slate-400" : "text-slate-600"} block`}>پاسخ تشریحی خود را در فضای زیر بنویسید:</label>
                                  <textarea
                                    value={essayInput}
                                    onChange={(e) => setEssayInput(e.target.value)}
                                    disabled={currentEssayAns?.gradingResult !== undefined}
                                    placeholder="پاسخ خود را شامل تعاریف پروتکل‌ها، تحلیل لاگ‌ها یا دستورات پاسخ بنویسید (مثلاً حداقل یک یا دو جمله)..."
                                    className={`w-full min-h-[110px] p-3 text-xs ${
                                      isDarkMode ? "bg-slate-950 border-slate-850 text-slate-200" : "bg-white border-slate-250 text-slate-900 shadow-inner"
                                    } rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-all font-light leading-relaxed`}
                                  />
                                </div>

                                {/* Programmatic Grader and See Answer button group */}
                                <div className="flex flex-wrap gap-2.5 items-center">
                                  {currentEssayAns?.gradingResult === undefined ? (
                                    <button
                                      onClick={gradeEssayAnswer}
                                      disabled={gradingResponse || !essayInput.trim()}
                                      className="px-4 py-2.5 hover:shadow-lg hover:shadow-indigo-600/10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
                                    >
                                      {gradingResponse ? (
                                        <>
                                          <RefreshCw className="h-3.5 w-3.5 animate-spin shrink-0" />
                                          در حال تحلیل لکسیکال پاسخ...
                                        </>
                                      ) : (
                                        <>
                                          <img src="https://img.icons8.com/fluency/48/brainstorming.png" className="h-5 w-5" alt="Brain Icon" />
                                          ارسال و تصحیح محلی (نمره‌دهی فوری)
                                        </>
                                      )}
                                    </button>
                                  ) : null}

                                  <button
                                    onClick={() => {
                                      setForceShowAnswer(!forceShowAnswer);
                                      logTerminal(`نمایش مستقیم پاسخ تشریحی مرجع سوال ${currentQuestionId} تغییر کرد.`);
                                    }}
                                    className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                                      forceShowAnswer
                                        ? "bg-slate-200 border-slate-350 text-slate-850 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                        : "bg-white border-slate-250 text-slate-650 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-350 dark:hover:bg-slate-850"
                                    }`}
                                  >
                                    <Eye className="h-4 w-4 shrink-0" />
                                    {forceShowAnswer ? "پنهان‌سازی پاسخ" : "دیدن پاسخ"}
                                  </button>
                                </div>

                                {forceShowAnswer && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`p-4 border rounded-xl leading-relaxed text-xs space-y-2 text-right ${
                                      isDarkMode ? "border-emerald-900/60 bg-emerald-950/20 text-slate-200" : "border-emerald-200 bg-emerald-50/40 text-slate-800"
                                    }`}
                                  >
                                    <div className="flex items-center gap-1.5 border-b border-dashed pb-1.5 border-emerald-900/20 dark:border-emerald-800/20">
                                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                        <Check className="h-4 w-4 shrink-0 text-emerald-500" />
                                        پاسخ مرجع و صحیح:
                                      </span>
                                    </div>
                                    <p className="font-medium leading-relaxed">{currentQuestion.explanation}</p>
                                  </motion.div>
                                )}

                                {/* ESSAY DETAILED PROGRAMMATICAL ANALYSIS REPORT */}
                                {currentEssayAns?.gradingResult && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`mt-4 border ${
                                      isDarkMode 
                                        ? "border-blue-900 bg-blue-950/20" 
                                        : "border-blue-200 bg-blue-50/45 shadow-sm"
                                    } p-4 rounded-xl space-y-3`}
                                  >
                                    <div className={`flex items-center justify-between border-b ${isDarkMode ? "border-blue-900/60" : "border-blue-200/60"} pb-2`}>
                                      <div className="flex items-center gap-1.5">
                                        <img src="https://img.icons8.com/fluency/48/diploma.png" className="h-5 w-5" alt="Award Badge" />
                                        <span className={`text-xs font-extrabold ${isDarkMode ? "text-white" : "text-slate-900"}`}>گزارش خلاصه ارزیابی و تصحیح هوشمند:</span>
                                      </div>
                                      <span className="text-xs font-black font-mono bg-blue-600 text-white px-2.5 py-1 rounded-lg">
                                        نمره کسب شده: {currentEssayAns?.score} / ۱۰
                                      </span>
                                    </div>

                                    <div className={`space-y-2 text-xs leading-relaxed ${isDarkMode ? "text-slate-300" : "text-slate-700"} font-normal`}>
                                      <p><b>تحلیل کلی و دسته‌بندی نمره:</b> {currentEssayAns?.gradingResult?.analysis}</p>
                                      <p className="text-emerald-600 dark:text-emerald-400"><b>نقاط مثبت پاسخ شما:</b> {currentEssayAns?.gradingResult?.strengths}</p>
                                      <p className="text-rose-600 dark:text-rose-400"><b>ضعف‌ها و نیازمند بهبود:</b> {currentEssayAns?.gradingResult?.weaknesses}</p>
                                    </div>

                                    <div className={`border-t ${isDarkMode ? "border-blue-900/40" : "border-blue-250/20"} pt-2 space-y-1`}>
                                      <span className="text-[11px] font-bold text-blue-600 dark:text-cyan-400 block flex items-center gap-1">
                                        <Info className="h-3.5 w-3.5" />
                                        پاسخ تشریحی کامل مرجع:
                                      </span>
                                      <p className={`text-xs ${
                                        isDarkMode ? "text-slate-300 bg-slate-950/60 border-slate-900" : "text-slate-800 bg-white border-slate-200"
                                      } leading-relaxed p-3 rounded-lg border font-normal`}>
                                        {currentEssayAns?.gradingResult?.suggestedAnswer}
                                      </p>
                                    </div>
                                  </motion.div>
                                )}
                              </div>
                            );
                          })()
                        )}

                      </div>

                      {/* BOTTOM NAVIGATION ZONE */}
                      <div className={`border-t ${
                        isDarkMode ? "border-slate-900 bg-slate-950/45" : "border-slate-100 bg-slate-50"
                      } p-4 flex items-center justify-between`}>
                        <button
                          onClick={() => navigateQuestion("prev")}
                          disabled={currentQuestionId === 1}
                          className={`flex items-center gap-1 px-4 py-2 rounded-xl text-xs ${
                            isDarkMode 
                              ? "bg-slate-900 border-slate-800 text-slate-300 hover:text-white" 
                              : "bg-white border-slate-205 text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-sm"
                          } disabled:opacity-30 disabled:pointer-events-none cursor-pointer`}
                        >
                          <ChevronRight className="h-4 w-4 shrink-0" />
                          سوال قبلی
                        </button>

                        <div className={`text-xs ${isDarkMode ? "text-slate-500" : "text-slate-500"} font-bold tracking-wider`}>
                          {getDifficultyTitle(currentQuestionId)}
                        </div>

                        <button
                          onClick={() => navigateQuestion("next")}
                          disabled={currentQuestionId === 100}
                          className={`flex items-center gap-1 px-4 py-2 rounded-xl text-xs ${
                            isDarkMode 
                              ? "bg-slate-900 border-slate-800 text-slate-300 hover:text-white" 
                              : "bg-white border-slate-205 text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-sm"
                          } disabled:opacity-30 disabled:pointer-events-none cursor-pointer`}
                        >
                          سوال بعدی
                          <ChevronLeft className="h-4 w-4 shrink-0" />
                        </button>
                      </div>

                    </motion.div>
                  ) : (
                    <div className="border border-slate-200 rounded-xl bg-white p-12 text-center text-slate-400">
                      پوشه تعریف فرعی خالی است. مجدداً سوال را بارگذاری کنید.
                    </div>
                  )}
                </AnimatePresence>

              </div>

              {/* Sidebar stats panel (col-span 1) */}
              <div className="space-y-6">
                
                {/* Subject Info details */}
                <div className={`border ${
                  isDarkMode ? "border-slate-805 bg-[#0F1115]" : "border-slate-200 bg-white shadow-sm"
                } rounded-xl p-5 space-y-4`}>
                  <h4 className={`text-sm font-bold ${isDarkMode ? "text-slate-200" : "text-slate-900"} border-b ${
                    isDarkMode ? "border-slate-900" : "border-slate-100"
                  } pb-2`}>سنجش آمادگی مبحث</h4>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs text-slate-500">
                      <span>تکمیل شده:</span>
                      <span className={`font-mono ${isDarkMode ? "text-slate-100" : "text-slate-900"} font-bold`}>{getSubjectStats(selectedSub).percent}%</span>
                    </div>
                    <div className={`h-2 w-full ${isDarkMode ? "bg-slate-950" : "bg-slate-100"} rounded-full overflow-hidden`}>
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-300"
                        style={{ width: `${getSubjectStats(selectedSub).percent}%` }}
                      />
                    </div>
                  </div>

                  <div className={`pt-3 border-t ${
                    isDarkMode ? "border-slate-900 text-slate-400" : "border-slate-100 text-slate-600"
                  } space-y-3 text-xs`}>
                    <div className="flex justify-between">
                      <span>تعداد سوالات درست:</span>
                      <b className="text-emerald-600 dark:text-emerald-400 font-mono">{getSubjectStats(selectedSub).correct} سوال</b>
                    </div>
                    <div className="flex justify-between">
                      <span>میانگین نمره‌دهی تشریحی:</span>
                      <b className="text-blue-600 dark:text-cyan-400 font-mono">{getSubjectStats(selectedSub).avgScore} / ۱۰</b>
                    </div>
                  </div>
                </div>

                {/* Difficulty Map Legend card with Icons8 Shield list */}
                <div className={`border ${
                  isDarkMode ? "border-slate-805 bg-[#0F1115]" : "border-slate-200 bg-white shadow-sm"
                } rounded-xl p-5 space-y-3`}>
                  <h4 className={`text-xs font-bold ${isDarkMode ? "text-slate-400" : "text-slate-700"} uppercase tracking-wider block`}>فلسفه پیشرفت تستی و تشریحی:</h4>
                  
                  <div className={`space-y-3 text-xs ${isDarkMode ? "text-slate-300" : "text-slate-600"} leading-relaxed font-normal`}>
                    <div className="flex gap-2.5">
                      <img src="https://img.icons8.com/color/48/checked.png" className="h-4 w-4 shrink-0" alt="Check Icon" />
                      <span><b>سوالات تستی (فرد):</b> سنجش مفاهیم پایه‌ای، تعاریف پروتکل‌ها، شناخت ابزارها و کدهای وضعیت.</span>
                    </div>
                    <div className="flex gap-2.5">
                      <img src="https://img.icons8.com/color/48/document.png" className="h-4 w-4 shrink-0" alt="Document Icon" />
                      <span><b>سوالات تشریحی (زوج):</b> آنالیز عمیق سناریوهای نفوذ، لاگ بدافزارها و طراحی استراتژی مهار حادثه.</span>
                    </div>
                    <p className={`text-[11px] ${isDarkMode ? "text-slate-500" : "text-slate-500"} border-t ${
                      isDarkMode ? "border-slate-900" : "border-slate-100"
                    } pt-2.5 block font-light`}>
                      آزمون‌ها بر اساس ساختار استاندارد طراحی شده‌اند. برای پاسخ‌های تشریحی، ارزیابی املایی و لکسیکال بر حسب کلمات تخصصی صورت می‌گیرد.
                    </p>
                  </div>
                </div>

                {/* Return dashboard button */}
                <button
                  onClick={() => {
                    setActiveTab("dashboard");
                    logTerminal("بازگشت به منوی پیشخوان.");
                  }}
                  className={`w-full py-3 rounded-xl border ${
                    isDarkMode 
                      ? "bg-slate-900 border-slate-850 text-slate-300 hover:text-white" 
                      : "bg-white border-slate-205 text-slate-700 hover:bg-slate-50 shadow-sm"
                  } text-xs font-bold cursor-pointer transition flex items-center justify-center gap-1.5`}
                >
                  <ArrowRight className="h-4 w-4" />
                  بازگشت به پیشخوان اصلی
                </button>

              </div>

            </div>

          </div>
        )}

        {/* VIEW 3: LEARN TAB */}
        {activeTab === "learn" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 text-right"
            dir="rtl"
          >
            
            {/* Learn Hero Heading */}
            <div className={`border ${
              isDarkMode ? "border-slate-850 bg-[#0F1115]" : "border-slate-200 bg-white shadow-sm"
            } rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4`}>
              <div className="flex items-center gap-3">
                <img src="https://img.icons8.com/fluency/96/study.png" className="h-10 w-10 shrink-0" alt="Learn study book shelf" />
                <div>
                  <h3 className={`text-base font-bold ${isDarkMode ? "text-slate-100" : "text-slate-950"} flex items-center gap-2`}>
                    دانشنامه، درسنامه جامع و کارت‌های خودآموز تعاملی
                  </h3>
                  <p className="text-xs text-slate-500">
                    مرور طبقه‌بندی شده مفاهیم پیش‌نیاز، پاسخ‌نامه‌های تشریحی مرجع و فلش‌کارت‌های هوشمند ۱۰۰ تایی تستی و تشریحی
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveTab("dashboard");
                  logTerminal("بازگشت به پیشخوان.");
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  isDarkMode 
                    ? "bg-slate-900 text-slate-300 hover:text-white border border-slate-800" 
                    : "bg-white border border-slate-250 text-slate-700 hover:bg-slate-50 shadow-sm"
                }`}
              >
                بازگشت به پیشخوان اصلی
              </button>
            </div>

            {/* INNER NAVIGATION SUB-TABS */}
            <div className="flex border-b border-slate-200 dark:border-slate-850 gap-2 pb-px overflow-x-auto">
              <button
                onClick={() => {
                  setLearnSubTab("syllabus");
                  logTerminal("مشاهده بخش درسنامه جامع.");
                }}
                className={`py-3 px-4 text-xs font-bold transition-all relative shrink-0 cursor-pointer ${
                  learnSubTab === "syllabus"
                    ? "text-blue-600 dark:text-cyan-400 border-b-2 border-blue-600 dark:border-cyan-400"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
                }`}
              >
                📖 ۱. درسنامه عمیق و جامع تخصصی
              </button>
              <button
                onClick={() => {
                  setLearnSubTab("multiple-flash");
                  setLearnQuestionId(1);
                  setSelectedLearnOption(null);
                  logTerminal("ورود به ایستگاه فلش‌کارت‌های تستی.");
                }}
                className={`py-3 px-4 text-xs font-bold transition-all relative shrink-0 cursor-pointer ${
                  learnSubTab === "multiple-flash"
                    ? "text-blue-600 dark:text-cyan-400 border-b-2 border-blue-600 dark:border-cyan-400"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
                }`}
              >
                🎴 ۲. کارت‌های خودآموز تستی (۱۰۰ سوال در بخش)
              </button>
              <button
                onClick={() => {
                  setLearnSubTab("essay-flash");
                  setLearnQuestionId(1);
                  setShowLearnAnswer(false);
                  logTerminal("ورود به ایستگاه هاب پاسخ تشریحی.");
                }}
                className={`py-3 px-4 text-xs font-bold transition-all relative shrink-0 cursor-pointer ${
                  learnSubTab === "essay-flash"
                    ? "text-blue-600 dark:text-cyan-400 border-b-2 border-blue-600 dark:border-cyan-400"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
                }`}
              >
                🃏 ۳. بانک پاسخنامه تشریحی و کلید نمره (۱۰۰ سوال)
              </button>
            </div>

            {/* TAB CONTENT 1: SYLLABUS summaries */}
            {learnSubTab === "syllabus" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Security+ Course */}
                  <div className={`border ${isDarkMode ? "border-slate-850 bg-[#0F1115] shadow-lg shadow-cyan-950/5" : "border-slate-200 bg-white shadow-sm hover:shadow-md"} rounded-2xl p-5 space-y-5 transition-all duration-300 hover:scale-[1.01]`}>
                    <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-900 pb-3">
                      <div className="flex items-center gap-2">
                        {renderSubjectIcon("security+", "h-6 w-6")}
                        <span className="text-xs bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-400 px-2.5 py-0.5 rounded font-extrabold">SECURITY+ SY0-701</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="p-3.5 bg-slate-50 dark:bg-slate-950/40 rounded-lg border border-slate-100 dark:border-slate-900 leading-relaxed text-xs">
                        <h4 className="font-bold text-cyan-600 dark:text-cyan-400 mb-1">فصل اول: چارچوب‌های حاکمیت امنیتی و CIA Triad</h4>
                        <p className="text-slate-600 dark:text-slate-300">
                          بنیان تمام دکترین‌های دفاع سایبری امنیت اطلاعات بر سه اصل <b>Confidentiality</b> (رمزگذاری نامتقارن/متقارن مانند AES-256 و کنترل دسترسی بر پایه‌ی هویت)، <b>Integrity</b> (تالیف چک‌سام‌ها، مک‌های هش مانند SHA-3 و پیاده‌سازی امضاهای دیجیتال متکی به رمزنگاری جفت‌کلید)، و <b>Availability</b> (تجهیز سرورها به ساختارهای خوشه‌بندی Active-Active، افزونگی دیسک با ریدهای ۵ یا ۶ و ابزارهای مهار غول‌آسای جریان مخرب یعنی DDoS Mitigation) استوار است. دستکاری کوچک‌ترین لولا در محاسبات به سقوط زنجیره کلید یا نشت کور ختم خواهد شد.
                        </p>
                      </div>

                      <div className="p-3.5 bg-slate-50 dark:bg-slate-950/40 rounded-lg border border-slate-100 dark:border-slate-900 leading-relaxed text-xs">
                        <h4 className="font-bold text-cyan-600 dark:text-cyan-400 mb-1">فصل دوم: پروتکل‌های احراز هویت و مهار مهندسی اجتماعی</h4>
                        <p className="text-slate-600 dark:text-slate-300">
                          در سیستم‌های مدرن، پروتکل قدیمی <b>PAP (Password Authentication Protocol)</b> به این دلیل که پسورد را به صورت متن خام روی سیم منتقل می‌نماید منسوخ گردیده و با پروتکل امن <b>CHAP (Challenge Handshake Authentication Protocol)</b> جایگزین شده که کلمه عبور را با مکانیزم سه مرحله‌ای و مقادیر متغیر تصادفی نمک (Salt) مخلوط کرده و هش نهایی را مقایسه می‌کند. مهار حملات فیشینگ نیزه‌ای (Spear Phishing) و ربودن توکن نشست تنها با تکنولوژی هوشمند کلاینت‌محور نظیر <b>FIDO2 WebAuthn</b> و کلیدهای سخت‌افزاری امن (MFA فاقد وابستگی به کدهای مخابراتی پیامک) میسر است.
                        </p>
                      </div>

                      <div className="p-3.5 bg-slate-50 dark:bg-slate-950/40 rounded-lg border border-slate-100 dark:border-slate-900 leading-relaxed text-xs">
                        <h4 className="font-bold text-cyan-600 dark:text-cyan-400 mb-1">فصل سوم: حفاظت از فضای آدرس سرور و حافظه (DEP / ASLR / Canaries)</h4>
                        <p className="text-slate-600 dark:text-slate-400 mb-1">
                          حملات کلاسیک سرریز بافر با نوشتن کدهای مخرب روی متغیرهای محلی و تغییر آدرس بازگشت اشاره‌گر تابع به سمت پی‌لود تهاجمی اجرا می‌گردند. برای خنثی‌سازی این بردباران، سه تکنولوژی اساسی در سطح فریم‌ورک سیستم‌عامل به کار می‌رود: <br/>
                          ۱. <b>DEP (Data Execution Prevention):</b> علامت‌گذاری سکتورهای استک رم به عنوان غیرقابل اجرا (NX) تا پی‌لود بارگذاری شده در آن اگزکیوت نشود. <br/>
                          ۲. <b>ASLR (Address Space Layout Randomization):</b> تصادفی سازی آدرس بارگذاری کتابخانه‌ها و پشته حافظه تا هکر نتواند آدرس دقیق تابع Return-to-libc را پیش‌بینی کند. <br/>
                          ۳. <b>Stack Canaries:</b> مقدار عددی تصادفی درست قبل از آدرس بازگشت؛ که اگر سرریزی رخ دهد این کناری تغییر کرده و سیستم‌عامل فوراً پروسه را کرش می‌دهد قبل از آنکه کد مهاجم اجرا شود.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* CEH Course */}
                  <div className={`border ${isDarkMode ? "border-slate-850 bg-[#0F1115] shadow-lg shadow-purple-950/5" : "border-slate-200 bg-white shadow-sm hover:shadow-md"} rounded-2xl p-5 space-y-5 transition-all duration-300 hover:scale-[1.01]`}>
                    <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-900 pb-3">
                      <div className="flex items-center gap-2">
                        {renderSubjectIcon("ceh", "h-6 w-6")}
                        <span className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-400 px-2.5 py-0.5 rounded font-extrabold">CEH v12 PRACTICAL</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-3.5 bg-slate-50 dark:bg-slate-950/40 rounded-lg border border-slate-100 dark:border-slate-900 leading-relaxed text-xs">
                        <h4 className="font-bold text-purple-600 dark:text-purple-400 mb-1">فصل اول: شناسایی، اسکن پورت نیمه‌باز (SYN) و مسموم‌سازی ARP</h4>
                        <p className="text-slate-600 dark:text-slate-300">
                          نفوذگر ابتدا با اسکن پورت‌ها و کشف رخنه‌ها مسیر تهاجم را باز می‌کند. در اسکن <b>SYN Stealth Scan (Half-Open)</b> یک بسته SYN ارسال می‌گردد. پاسخ SYN-ACK نشان‌دهنده باز بودن پورت است؛ مهاجم بلافاصله بسته RST را فرستاده و مانع برقراری دست‌تکانی سه مرحله‌ای TCP کامل می‌شود تا در فایل گزارش برنامه‌های حساس ثبت نشود. در اسکن‌های دیگر نظیر Xmas تمام پرچم‌های Fin, Psh و Urg روشن هستند. پس از نفوذ اولیه به لایه۲، برای دستیابی به ترافیک‌ها از جعل ARP (مسموم‌سازی جدول همسایگی سوییچ‌ها) استفاده می‌شود تا ترافیک هاب کلاینت از سیستم مهاجم رد شود.
                        </p>
                      </div>

                      <div className="p-3.5 bg-slate-50 dark:bg-slate-950/40 rounded-lg border border-slate-100 dark:border-slate-900 leading-relaxed text-xs">
                        <h4 className="font-bold text-purple-600 dark:text-purple-400 mb-1">فصل دوم: ریشه‌یابی رخنه‌های وب و کالبدشکافی عمیق SQL Injection</h4>
                        <p className="text-slate-600 dark:text-slate-300">
                          کدگذاری ضعیف ورودی‌ها منجر به نشت سناریوها می‌شود. در حملات SQL Injection کدهای مخرب در بدنه متغیرهای ورودی ارسال می‌گردند. در نوع <b>In-Band (Error-Based):</b> نتایج مستقیماً در متن خروجی کلاینت دیده می‌شوند (مثلاً پی‌لود تکیه دادن به خطاها). اما در مدل‌های پیشرفته سدهای فایروال <b>Blind SQL Injection</b> خطایی فاش نشده و نفوذگر مجبور است با سوالات منطقی تکیه‌گاه True/False (از تغییر جزیی بدنه پاسخ) یا با دستور ایجاد وقفه‌های زمانی (Time-Based مانند SLEEP دیتابیس) بایت به بایت مقادیر را تست و استخراج کند.
                        </p>
                      </div>

                      <div className="p-3.5 bg-slate-50 dark:bg-slate-950/40 rounded-lg border border-slate-100 dark:border-slate-900 leading-relaxed text-xs">
                        <h4 className="font-bold text-purple-600 dark:text-purple-400 mb-1">فصل سوم: حملات وایرلس KRACK و ترفندهای دور زدن IDS/IPS فایروال</h4>
                        <p className="text-slate-600 dark:text-purple-450 mb-1">
                          ۱. <b>حمله KRACK (Key Reinstallation Attack):</b> آسیب‌پذیری بزرگ تبادل ۴ مرحله‌ای پروتکل بی سیم WPA2؛ هکر با مسدود و ری‌پلی کردن پیام گام سوم تبادل، کلاینت را وادار به نصب دوباره کلید انقضا یافته و صفر کردن شماره توالی موقت (Nonce) می‌کند، در نتیجه الگوریتم رمزگذاری هک شده و ترافیک دکریپت می‌شود. <br/>
                          ۲. <b>تکنیک Packet Fragmentation:</b> خرد کردن مگنومتر فایل اکسپلویت مخرب به بسته‌های ریز شبکه؛ سیستم مانیتورینگ گمرک فایروال قدیمی به دلیل پر شدن سریع بافر یا تعلل در بازسازی استک، تکه‌ها را بی‌خطر می‌پندارد تا در مقصد نهایی با زحمت سیستم‌عامل سرهم شده و اجرا شوند.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* SOC Analyst Course */}
                  <div className={`border ${isDarkMode ? "border-slate-850 bg-[#0F1115] shadow-lg shadow-emerald-950/5" : "border-slate-200 bg-white shadow-sm hover:shadow-md"} rounded-2xl p-5 space-y-5 transition-all duration-300 hover:scale-[1.01]`}>
                    <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-900 pb-3">
                      <div className="flex items-center gap-2">
                        {renderSubjectIcon("soc", "h-6 w-6")}
                        <span className="text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 px-2.5 py-0.5 rounded font-extrabold">SOC ANALYST BLUE TEAM</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-3.5 bg-slate-50 dark:bg-slate-950/40 rounded-lg border border-slate-100 dark:border-slate-900 leading-relaxed text-xs">
                        <h4 className="font-bold text-emerald-600 dark:text-emerald-400 mb-1">فصل اول: غربالگری، تریاژ رویدادها (True vs False Positives)</h4>
                        <p className="text-slate-600 dark:text-slate-300">
                          بررسی هشدارهای دایم فایروال وب و ابزارهای مانیتورینگ بدون سیستم غربالگری به غرق شدن اپراتور تحلیلگر منجر می‌شود. تحلیلگر SOC موظف است هشدارهای <b>True Positive (حمله واقعی ستیزه‌جو)</b> را از هشدارهای <b>False Positive (یک هشدار کاذب به سبب رخدادهای قانونی نرم‌افزاری)</b> جدا کند. ابزارهای تریاژ با همبستگی لاگ‌های تکمیلی و گرفتن رنکینگ شهرت آی‌پی کلاینت در سراسر جهان ارزیابی اولیه ریسک را هدایت می‌کنند.
                        </p>
                      </div>

                      <div className="p-3.5 bg-slate-50 dark:bg-slate-950/40 rounded-lg border border-slate-100 dark:border-slate-900 leading-relaxed text-xs">
                        <h4 className="font-bold text-emerald-600 dark:text-emerald-400 mb-1">فصل دوم: جرم‌یابی سیستم لاگ‌های ویندوز و لینوکس (Windows Security Audit)</h4>
                        <p className="text-slate-600 dark:text-slate-300">
                          نظام مانیتورینگ ویندوز تلاطم‌ها را با آیدی‌های علنی ضبط می‌نماید. آیدی امنیتی <b>Event ID 4624 (ورود موفقیت‌آمیز به ویندوز)</b> جهت بازبینی ساعات غیراداری و شناسایی حرکات خزنده و آیدی حساس <b>Event ID 4625 (تلاش برای ورود ناموفق)</b> برای مانیتور خروشان حملات بروت‌فورس ضروری است. در لینوکس، ره‌گیری ترافیک‌های غیرمجاز با فیلتر مستمر فایل لاگ ریشه سیستم <code>/var/log/auth.log</code> حاصل می‌شود.
                        </p>
                      </div>

                      <div className="p-3.5 bg-slate-50 dark:bg-slate-950/40 rounded-lg border border-slate-100 dark:border-slate-900 leading-relaxed text-xs">
                        <h4 className="font-bold text-emerald-600 dark:text-emerald-400 mb-1">فصل سوم: اجرای دقیق پلی‌بوک‌های مهار باج‌افزار و جرم‌یابی حافظه موقت</h4>
                        <p className="text-slate-600 dark:text-emerald-450 mb-1">
                          به محض کشف فعالیت باج‌افزار مخرب (Active Ransomware Host) در شبکه، اولین اولویت مهار، <b>جداسازی فیزیکی یا منطقی سریع کارت شبکه سیستم آلوده (VLAN Quarantine)</b> می‌باشد تا بدافزار فاقد بستر فرار به سمت سرورهای بک‌آفیس باشد. همزمان، تحلیلگر نباید سیستم را فوراً خاموش کند تا دیتای حافظه موقت رم محفوظ بماند. ابزار جرم‌یابی رم (Volatility) با دستوراتی چون <code>pstree</code> ساختار درختی فرآیندهای ویندوز را بیرون می‌آورد تا بفهمیم پروسه‌ای مشکوک از والد فیک ران شده است یا خیر.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* TAB CONTENT 2: MULTIPLE CHOICE FLASHCARDS */}
            {learnSubTab === "multiple-flash" && (
              <div className="space-y-6">
                
                {/* Control bar */}
                <div className={`p-4 border ${isDarkMode ? "border-slate-850 bg-slate-950/45" : "border-slate-205 bg-white"} rounded-xl flex flex-wrap gap-4 items-center justify-between`}>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-500">انتخاب مبحث تستی:</span>
                    <div className="flex bg-slate-100 dark:bg-slate-905 p-1 rounded-lg border border-slate-200/80 dark:border-slate-800 gap-1">
                      <button
                        onClick={() => {
                          setLearnCategory("security+");
                          setLearnQuestionId(1);
                          setSelectedLearnOption(null);
                        }}
                        className={`px-3 py-1 rounded-md text-[11px] font-bold cursor-pointer transition ${
                          learnCategory === "security+"
                            ? "bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-sm"
                            : "text-slate-500"
                        }`}
                      >
                        Security+
                      </button>
                      <button
                        onClick={() => {
                          setLearnCategory("ceh");
                          setLearnQuestionId(1);
                          setSelectedLearnOption(null);
                        }}
                        className={`px-3 py-1 rounded-md text-[11px] font-bold cursor-pointer transition ${
                          learnCategory === "ceh"
                            ? "bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-sm"
                            : "text-slate-500"
                        }`}
                      >
                        CEH v12
                      </button>
                      <button
                        onClick={() => {
                          setLearnCategory("soc");
                          setLearnQuestionId(1);
                          setSelectedLearnOption(null);
                        }}
                        className={`px-3 py-1 rounded-md text-[11px] font-bold cursor-pointer transition ${
                          learnCategory === "soc"
                            ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm"
                            : "text-slate-500"
                        }`}
                      >
                        SOC Blue
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-505">شماره کارت (۱ تا ۱۰۰):</span>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={learnQuestionId}
                      onChange={(e) => {
                        const val = Math.min(100, Math.max(1, parseInt(e.target.value) || 1));
                        setLearnQuestionId(val);
                        setSelectedLearnOption(null);
                      }}
                      className={`w-16 p-1 text-center font-mono font-bold border rounded ${
                        isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
                      }`}
                    />
                  </div>
                </div>

                {/* Question Flashcard and interactive response panel */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Main Flashcard Box (col-span 2) */}
                  <div className="lg:col-span-2 space-y-4">
                    {(() => {
                      const qReviewed = getSeedQuestion(learnCategory, learnQuestionId, "multiple");
                      return (
                        <div className={`border ${
                          isDarkMode ? "border-slate-850 bg-[#0F1115]" : "border-slate-205 bg-white shadow-sm"
                        } rounded-xl p-6 space-y-6 relative overflow-hidden`}>
                          
                          {/* Top label difficulty */}
                          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-900 pb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-500 font-bold block flex items-center gap-1">
                                <span className={`h-2.5 w-2.5 rounded-full ${
                                  qReviewed.difficulty === "easy" ? "bg-emerald-500" : qReviewed.difficulty === "medium" ? "bg-cyan-500" : "bg-purple-500"
                                }`} />
                                کارت مرور تستی شماره {learnQuestionId} ({qReviewed.difficulty === "easy" ? "سطح آسان" : qReviewed.difficulty === "medium" ? "سطح متوسط" : "سطح سخت"})
                              </span>
                              
                              <button
                                onClick={() => toggleFlagQuestion(learnCategory, learnQuestionId, "multiple")}
                                className={`p-1 rounded-md border transition-all cursor-pointer inline-flex items-center gap-1 text-[9px] font-bold ${
                                  flaggedQuestions.some(q => q.category === learnCategory && q.id === learnQuestionId && q.type === "multiple")
                                    ? "bg-amber-100 border-amber-300 text-amber-700 dark:bg-amber-955 dark:border-amber-800 dark:text-amber-400"
                                    : isDarkMode
                                      ? "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                                      : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                                }`}
                                title={
                                  flaggedQuestions.some(q => q.category === learnCategory && q.id === learnQuestionId && q.type === "multiple")
                                    ? "حذف از سوالات مهم"
                                    : "افزودن به سوالات مهم"
                                }
                              >
                                <Star className={`h-3 w-3 ${
                                  flaggedQuestions.some(q => q.category === learnCategory && q.id === learnQuestionId && q.type === "multiple")
                                    ? "fill-amber-400 text-amber-400"
                                    : ""
                                }`} />
                                {flaggedQuestions.some(q => q.category === learnCategory && q.id === learnQuestionId && q.type === "multiple")
                                  ? "مهم"
                                  : "نشان کردن"
                                }
                              </button>
                            </div>
                            <span className="text-[10px] font-mono text-blue-500 bg-blue-50 dark:bg-blue-950 dark:text-cyan-400 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-900/60 font-bold">
                              {qReviewed.syllabusTopic}
                            </span>
                          </div>

                          {/* Question text */}
                          <div className="space-y-4">
                            <h4 className={`text-sm md:text-base font-extrabold leading-relaxed ${isDarkMode ? "text-slate-100" : "text-slate-950"}`}>
                              {qReviewed.questionText}
                            </h4>
                            
                            {/* Option list buttons */}
                            <div className="space-y-2.5">
                              {qReviewed.options?.map((option, idx) => {
                                const isSelected = selectedLearnOption === idx;
                                const isCorrectOpt = qReviewed.correctOption === idx;
                                let btnStyle = isDarkMode
                                  ? "bg-slate-950 border-slate-850 text-slate-300 hover:border-slate-750"
                                  : "bg-white border-slate-205 text-slate-800 hover:bg-slate-50 hover:border-slate-350";

                                if (selectedLearnOption !== null) {
                                  if (isCorrectOpt) {
                                    btnStyle = "bg-emerald-50 border-emerald-300 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300 font-bold";
                                  } else if (isSelected) {
                                    btnStyle = "bg-red-50 border-red-300 text-red-800 dark:bg-red-950/40 dark:border-red-800 dark:text-red-300";
                                  } else {
                                    btnStyle = "opacity-45 " + (isDarkMode ? "bg-slate-950 border-slate-850 text-slate-500" : "bg-white border-slate-200 text-slate-400");
                                  }
                                }

                                return (
                                  <button
                                    key={idx}
                                    onClick={() => {
                                      if (selectedLearnOption === null) {
                                        setSelectedLearnOption(idx);
                                        logTerminal(`پاسخ آزمایشی فلش‌کارت تستی ${learnQuestionId} داده شد.`);
                                      }
                                    }}
                                    className={`w-full text-right p-3.5 text-xs rounded-xl border transition-all duration-200 cursor-pointer flex items-start gap-2.5 leading-relaxed ${btnStyle}`}
                                  >
                                    <span className="font-mono bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 h-5 w-5 shrink-0 rounded-md inline-flex items-center justify-center font-bold text-[10px]">
                                      {idx + 1}
                                    </span>
                                    <span>{option}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Hint block */}
                          <div className={`p-3 rounded-lg border ${
                            isDarkMode ? "bg-slate-950/40 border-slate-905" : "bg-slate-50 border-slate-100"
                          } text-xs flex gap-2.5 items-start`}>
                            <img src="https://img.icons8.com/color/48/light-at-the-end-of-tunnel.png" className="h-5 w-5 shrink-0" alt="Hint Lightbulb" />
                            <p className="text-slate-500">
                              <b>راهنمایی مرور سریع:</b> {qReviewed.hint}
                            </p>
                          </div>

                          {/* Reveal analysis if answered */}
                          {selectedLearnOption !== null && (
                            <motion.div
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`p-4 border rounded-xl leading-relaxed text-xs space-y-2 ${
                                qReviewed.correctOption === selectedLearnOption
                                  ? (isDarkMode ? "border-emerald-900 bg-emerald-950/10 text-slate-300" : "border-emerald-200 bg-emerald-50/40 text-slate-800")
                                  : (isDarkMode ? "border-amber-900 bg-[#16130D] text-slate-300" : "border-amber-200 bg-amber-50/30 text-grey-850")
                              }`}
                            >
                              <div className="flex items-center gap-1.5 border-b border-dashed pb-1.5">
                                <img src="https://img.icons8.com/fluency/48/diploma.png" className="h-4.5 w-4.5" alt="Badge" />
                                <span className="font-extrabold">توجیه علمی و پاسخ مرجع درسنامه:</span>
                              </div>
                              <p className="font-normal">{qReviewed.explanation}</p>
                            </motion.div>
                          )}

                          {/* Navigation buttons */}
                          <div className={`border-t ${isDarkMode ? "border-slate-900" : "border-slate-100"} pt-4 flex justify-between items-center`}>
                            <button
                              onClick={() => {
                                if (learnQuestionId > 1) {
                                  setLearnQuestionId(prev => prev - 1);
                                  setSelectedLearnOption(null);
                                }
                              }}
                              disabled={learnQuestionId === 1}
                              className={`px-4 py-2 text-xs font-bold rounded-xl border transition cursor-pointer flex items-center gap-1 ${
                                isDarkMode 
                                  ? "bg-slate-900 border-slate-800 text-slate-350 hover:text-white" 
                                  : "bg-white border-slate-205 text-slate-650 hover:bg-slate-50"
                              } disabled:opacity-30 disabled:pointer-events-none`}
                            >
                              <ChevronRight className="h-4 w-4 shrink-0" />
                              فلش‌کارت قبلی
                            </button>

                            <span className="text-[11px] text-slate-400 font-mono">
                              Progress: {learnQuestionId} / 100
                            </span>

                            <button
                              onClick={() => {
                                if (learnQuestionId < 100) {
                                  setLearnQuestionId(prev => prev + 1);
                                  setSelectedLearnOption(null);
                                }
                              }}
                              disabled={learnQuestionId === 100}
                              className={`px-4 py-2 text-xs font-bold rounded-xl border transition cursor-pointer flex items-center gap-1 ${
                                isDarkMode 
                                  ? "bg-slate-900 border-slate-800 text-slate-355 hover:text-white" 
                                  : "bg-white border-slate-205 text-slate-650 hover:bg-slate-50"
                              } disabled:opacity-30 disabled:pointer-events-none`}
                            >
                              فلش‌کارت بعدی
                              <ChevronLeft className="h-4 w-4 shrink-0" />
                            </button>
                          </div>

                        </div>
                      );
                    })()}
                  </div>

                  {/* Sidebar Bubble Navigation Map */}
                  <div className={`border ${
                    isDarkMode ? "border-slate-850 bg-[#0F1115]" : "border-slate-200 bg-white shadow-sm"
                  } rounded-xl p-4 space-y-3 shrink-0 h-fit`}>
                    <div className="border-b border-slate-100 dark:border-slate-900 pb-2 flex items-center justify-between text-xs font-bold text-slate-500">
                      <span>نقشه پیمایش ۱۰۰ سوال تستی</span>
                    </div>

                    <div className="grid grid-cols-10 gap-1.5 justify-center max-h-[170px] overflow-y-auto pr-1">
                      {Array.from({ length: 100 }, (_, i) => {
                        const qNum = i + 1;
                        const isCurrent = learnQuestionId === qNum;
                        return (
                          <button
                            key={qNum}
                            onClick={() => {
                              setLearnQuestionId(qNum);
                              setSelectedLearnOption(null);
                            }}
                            className={`h-7 w-7 rounded border text-[10px] font-mono transition inline-flex items-center justify-center cursor-pointer font-bold ${
                              isCurrent
                                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                : isDarkMode
                                  ? "bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400"
                                  : "bg-white hover:bg-slate-50 border-slate-200 text-slate-650"
                            }`}
                          >
                            {qNum}
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-2 text-[10px] text-slate-500 leading-relaxed border-t border-slate-100 dark:border-slate-900 text-right">
                      💡 <b>نکته:</b> پاسخ‌گذاری روی این کارت‌ها تفریحی و بدون بارگذاری پیشرفت اصلی مربیگری است تا بتوانید آزادانه معلومات امنیت خود را مرور و تقویت کنید.
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* TAB CONTENT 3: ESSAY FLASHCARDS WITH REVEAL RESPONSE BUTTON */}
            {learnSubTab === "essay-flash" && (
              <div className="space-y-6">
                
                {/* Control bar */}
                <div className={`p-4 border ${isDarkMode ? "border-slate-850 bg-slate-950/45" : "border-slate-205 bg-white"} rounded-xl flex flex-wrap gap-4 items-center justify-between`}>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-500">انتخاب مبحث تشریحی:</span>
                    <div className="flex bg-slate-105 dark:bg-slate-905 p-1 rounded-lg border border-slate-200/80 dark:border-slate-800 gap-1">
                      <button
                        onClick={() => {
                          setLearnCategory("security+");
                          setLearnQuestionId(1);
                          setShowLearnAnswer(false);
                        }}
                        className={`px-3 py-1 rounded-md text-[11px] font-bold cursor-pointer transition ${
                          learnCategory === "security+"
                            ? "bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-sm"
                            : "text-slate-505"
                        }`}
                      >
                        Security+
                      </button>
                      <button
                        onClick={() => {
                          setLearnCategory("ceh");
                          setLearnQuestionId(1);
                          setShowLearnAnswer(false);
                        }}
                        className={`px-3 py-1 rounded-md text-[11px] font-bold cursor-pointer transition ${
                          learnCategory === "ceh"
                            ? "bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-sm"
                            : "text-slate-505"
                        }`}
                      >
                        CEH v12
                      </button>
                      <button
                        onClick={() => {
                          setLearnCategory("soc");
                          setLearnQuestionId(1);
                          setShowLearnAnswer(false);
                        }}
                        className={`px-3 py-1 rounded-md text-[11px] font-bold cursor-pointer transition ${
                          learnCategory === "soc"
                            ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm"
                            : "text-slate-505"
                        }`}
                      >
                        SOC Blue
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500">شماره کارت تشریحی (۱ تا ۱۰۰):</span>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={learnQuestionId}
                      onChange={(e) => {
                        const val = Math.min(100, Math.max(1, parseInt(e.target.value) || 1));
                        setLearnQuestionId(val);
                        setShowLearnAnswer(false);
                      }}
                      className={`w-16 p-1 text-center font-mono font-bold border rounded ${
                        isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
                      }`}
                    />
                  </div>
                </div>

                {/* Main Interactive Box */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Essay Card Details (col-span 2) */}
                  <div className="lg:col-span-2 space-y-4">
                    {(() => {
                      const qReviewed = getSeedQuestion(learnCategory, learnQuestionId, "essay");
                      return (
                        <div className={`border ${
                          isDarkMode ? "border-slate-850 bg-[#0F1115]" : "border-slate-205 bg-white shadow-sm"
                        } rounded-xl p-6 space-y-6 relative overflow-hidden`}>
                          
                          {/* Top label difficulty */}
                          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-900 pb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-500 font-bold block flex items-center gap-1">
                                <span className={`h-2.5 w-2.5 rounded-full ${
                                  qReviewed.difficulty === "easy" ? "bg-emerald-500" : qReviewed.difficulty === "medium" ? "bg-cyan-500" : "bg-purple-500"
                                }`} />
                                کارت پاسخ مرجع تشریحی شماره {learnQuestionId} ({qReviewed.difficulty === "easy" ? "سطح آسان" : qReviewed.difficulty === "medium" ? "سطح متوسط" : "سطح سخت"})
                              </span>
                              
                              <button
                                onClick={() => toggleFlagQuestion(learnCategory, learnQuestionId, "essay")}
                                className={`p-1.5 rounded-md border transition-all cursor-pointer inline-flex items-center gap-1 text-[9px] font-bold ${
                                  flaggedQuestions.some(q => q.category === learnCategory && q.id === learnQuestionId && q.type === "essay")
                                    ? "bg-amber-100 border-amber-300 text-amber-700 dark:bg-amber-955 dark:border-amber-800 dark:text-amber-400"
                                    : isDarkMode
                                      ? "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                                      : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                                }`}
                                title={
                                  flaggedQuestions.some(q => q.category === learnCategory && q.id === learnQuestionId && q.type === "essay")
                                    ? "حذف از سوالات مهم"
                                    : "افزودن به سوالات مهم"
                                }
                              >
                                <Star className={`h-3 w-3 ${
                                  flaggedQuestions.some(q => q.category === learnCategory && q.id === learnQuestionId && q.type === "essay")
                                    ? "fill-amber-400 text-amber-400"
                                    : ""
                                }`} />
                                {flaggedQuestions.some(q => q.category === learnCategory && q.id === learnQuestionId && q.type === "essay")
                                  ? "مهم"
                                  : "نشان کردن"
                                }
                              </button>
                            </div>
                            <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400 px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-900/60 font-bold">
                              {qReviewed.syllabusTopic}
                            </span>
                          </div>

                          {/* Question text */}
                          <div className="space-y-4">
                            <h4 className={`text-sm md:text-base font-extrabold leading-relaxed ${isDarkMode ? "text-slate-100" : "text-slate-950"}`}>
                              {qReviewed.questionText}
                            </h4>
                          </div>

                          {/* Hint block */}
                          <div className={`p-3 rounded-lg border ${
                            isDarkMode ? "bg-slate-950/40 border-slate-905" : "bg-slate-50 border-slate-101"
                          } text-xs flex gap-2.5 items-start`}>
                            <img src="https://img.icons8.com/color/48/light-at-the-end-of-tunnel.png" className="h-5 w-5 shrink-0" alt="Hint Lightbulb" />
                            <p className="text-slate-400">
                              <b>سرنخ کلیدی برای پاسخ‌دهی:</b> {qReviewed.hint}
                            </p>
                          </div>

                          {/* ACTION BUTTON TO REVEAL KEYWORDS AND REF ANSWER */}
                          {!showLearnAnswer ? (
                            <button
                              onClick={() => {
                                setShowLearnAnswer(true);
                                logTerminal(`پاسخ کامل تشریحی کارت شماره ${learnQuestionId} نمایان گردید.`);
                              }}
                              className="w-full py-4 text-xs font-bold leading-none bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer border border-blue-500"
                            >
                              <img src="https://img.icons8.com/fluency/48/search-in-list.png" className="h-5 w-5" alt="Show Solution" />
                              نمایش پاسخ کامل و تشریحی مرجع به همراه کلیدواژه‌های ارزیابی
                            </button>
                          ) : (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.98 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className={`border ${
                                isDarkMode ? "border-emerald-900/60 bg-emerald-950/20" : "border-emerald-201 bg-emerald-50/30"
                              } p-5 rounded-xl space-y-4 text-right`}
                            >
                              <div className="flex items-center justify-between border-b pb-2 mb-2 border-dashed border-emerald-900/30 dark:border-emerald-800/40">
                                <span className={`text-xs font-bold ${isDarkMode ? "text-slate-200" : "text-slate-900"} flex items-center gap-1.5`}>
                                  <img src="https://img.icons8.com/fluency/48/diploma.png" className="h-5 w-5" alt="Award Medal" />
                                  پاسخ تشریحی کامل مرجع سناریو:
                                </span>
                                <button
                                  onClick={() => setShowLearnAnswer(false)}
                                  className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline cursor-pointer"
                                >
                                  پنهان‌سازی پاسخ
                                </button>
                              </div>

                              <p className={`text-xs ${isDarkMode ? "text-slate-200" : "text-slate-800"} leading-relaxed font-normal`}>
                                {qReviewed.explanation}
                              </p>

                              {/* Target grading keywords indicator for learning */}
                              {qReviewed.keywords && qReviewed.keywords.length > 0 && (
                                <div className="space-y-1.5 border-t pt-3 border-emerald-900/30 dark:border-emerald-800/40 mt-3">
                                  <span className="text-[10px] font-extrabold text-blue-600 dark:text-cyan-400 block uppercase font-bold">
                                    🔑 کلیدواژه‌های ارزشمند تشریحی (معیار خودکار تصحیح محلی):
                                  </span>
                                  <div className="flex flex-wrap gap-1">
                                    {qReviewed.keywords.map((kw, kIdx) => (
                                      <span
                                        key={kIdx}
                                        className={`text-[9px] px-2 py-0.5 rounded border font-mono font-bold ${
                                          isDarkMode
                                            ? "bg-slate-900 text-slate-300 border-slate-800"
                                            : "bg-white text-slate-700 border-slate-200"
                                        }`}
                                      >
                                        {kw}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          )}

                          {/* Navigation buttons */}
                          <div className={`border-t ${isDarkMode ? "border-slate-900" : "border-slate-100"} pt-4 flex justify-between items-center`}>
                            <button
                              onClick={() => {
                                if (learnQuestionId > 1) {
                                  setLearnQuestionId(prev => prev - 1);
                                  setShowLearnAnswer(false);
                                }
                              }}
                              disabled={learnQuestionId === 1}
                              className={`px-4 py-2 text-xs font-bold rounded-xl border transition cursor-pointer flex items-center gap-1 ${
                                isDarkMode 
                                  ? "bg-slate-900 border-slate-800 text-slate-350 hover:text-white" 
                                  : "bg-white border-slate-205 text-slate-655 hover:bg-slate-50"
                              } disabled:opacity-30 disabled:pointer-events-none`}
                            >
                              <ChevronRight className="h-4 w-4 shrink-0" />
                              فلش‌کارت قبلی
                            </button>

                            <span className="text-[11px] text-slate-400 font-mono">
                              Essay Progress: {learnQuestionId} / 100
                            </span>

                            <button
                              onClick={() => {
                                if (learnQuestionId < 100) {
                                  setLearnQuestionId(prev => prev + 1);
                                  setShowLearnAnswer(false);
                                }
                              }}
                              disabled={learnQuestionId === 100}
                              className={`px-4 py-2 text-xs font-bold rounded-xl border transition cursor-pointer flex items-center gap-1 ${
                                isDarkMode 
                                  ? "bg-slate-900 border-slate-800 text-slate-355 hover:text-white" 
                                  : "bg-white border-slate-205 text-slate-655 hover:bg-slate-50"
                              } disabled:opacity-30 disabled:pointer-events-none`}
                            >
                              فلش‌کارت بعدی
                              <ChevronLeft className="h-4 w-4 shrink-0" />
                            </button>
                          </div>

                        </div>
                      );
                    })()}
                  </div>

                  {/* Sidebar Bubble Navigation Map */}
                  <div className={`border ${
                    isDarkMode ? "border-slate-850 bg-[#0F1115]" : "border-slate-200 bg-white shadow-sm"
                  } rounded-xl p-4 space-y-3 shrink-0 h-fit`}>
                    <div className="border-b border-slate-100 dark:border-slate-900 pb-2 flex items-center justify-between text-xs font-bold text-slate-500">
                      <span>نقشه پیمایش ۱۰۰ سوال تشریحی</span>
                    </div>

                    <div className="grid grid-cols-10 gap-1.5 justify-center max-h-[170px] overflow-y-auto pr-1">
                      {Array.from({ length: 100 }, (_, i) => {
                        const qNum = i + 1;
                        const isCurrent = learnQuestionId === qNum;
                        return (
                          <button
                            key={qNum}
                            onClick={() => {
                              setLearnQuestionId(qNum);
                              setShowLearnAnswer(false);
                            }}
                            className={`h-7 w-7 rounded border text-[10px] font-mono transition inline-flex items-center justify-center cursor-pointer font-bold ${
                              isCurrent
                                ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                                : isDarkMode
                                  ? "bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400"
                                  : "bg-white hover:bg-slate-50 border-slate-200 text-slate-650"
                            }`}
                          >
                            {qNum}
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-2 text-[10px] text-slate-500 leading-relaxed border-t border-slate-100 dark:border-slate-900 text-right font-light">
                      🌟 <b>بهره جستجو:</b> ۱۰۰ سوال تشریحی این مبحث را به همراه پاسخ توصیفی و کلیدواژه‌های ارزشیابی آن گام به گام تحلیل و مرور کنید.
                    </div>
                  </div>

                </div>

              </div>
            )}

          </motion.div>
        )}

        {activeTab === "flagged" && (
          <div className="space-y-6 text-right" dir="rtl">
            <div className={`p-6 border ${isDarkMode ? "border-slate-850 bg-slate-950/45" : "border-slate-200 bg-white shadow-sm"} rounded-2xl space-y-4`}>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-xl flex items-center justify-center">
                  <Star className="h-5 w-5 fill-amber-500" />
                </div>
                <div>
                  <h2 className={`text-lg font-extrabold ${isDarkMode ? "text-white" : "text-slate-900"}`}>سوالات مهم و نشان‌شده شما</h2>
                  <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"} mt-0.5`}>مجموعه‌ای اختصاصی از سوالات تستی و تشریحی که برای مرور نهایی گلچین کرده‌اید</p>
                </div>
              </div>
            </div>

            {flaggedQuestions.length === 0 ? (
              <div className={`border border-dashed ${isDarkMode ? "border-slate-800 bg-[#0F1115]" : "border-slate-200 bg-white"} rounded-2xl p-16 text-center space-y-4`}>
                <div className="mx-auto h-12 w-12 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full flex items-center justify-center text-slate-400">
                  <Star className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className={`text-sm font-bold ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>سیاهه سوالات مهم خالی است</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">هنوز هیچ سوالی را نشان نکرده‌اید. با کلیک بر روی آیکون ستاره در هر آزمون یا کارت مرور، سوالات مهم خود را در اینجا جمع‌آوری کنید.</p>
                </div>
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition cursor-pointer"
                >
                  بازگشت به پیشخوان آزمون‌ها
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {flaggedQuestions.map((fq, index) => {
                  const q = getSeedQuestion(fq.category, fq.id, fq.type);
                  return (
                    <motion.div
                      key={`${fq.category}-${fq.id}-${fq.type}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`border ${
                        isDarkMode ? "border-slate-850 bg-[#0F1115]" : "border-slate-200 bg-white shadow-sm hover:shadow-md"
                      } rounded-2xl p-5 space-y-4 relative flex flex-col justify-between overflow-hidden`}
                    >
                      {/* Card Header */}
                      <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-900">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                            fq.category === "security+"
                              ? "bg-cyan-50 border-cyan-200 text-cyan-600 dark:bg-cyan-950 dark:border-cyan-800 dark:text-cyan-400"
                              : fq.category === "ceh"
                                ? "bg-purple-50 border-purple-200 text-purple-600 dark:bg-purple-950 dark:border-purple-800 dark:text-purple-400"
                                : "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-400"
                          }`}>
                            {fq.category.toUpperCase()}
                          </span>
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                            fq.type === "multiple"
                              ? "bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-400"
                              : "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-400"
                          }`}>
                            {fq.type === "multiple" ? "تستی" : "تشریحی"}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 font-mono">ID {fq.id}</span>
                        </div>

                        {/* Unflag Button */}
                        <button
                          onClick={() => toggleFlagQuestion(fq.category, fq.id, fq.type)}
                          className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-amber-500 cursor-pointer"
                          title="حذف از سوالات مهم"
                        >
                          <Star className="h-4 w-4 fill-amber-400" />
                        </button>
                      </div>

                      {/* Question Text */}
                      <div className="space-y-3 flex-1">
                        <span className="text-[10px] text-slate-500 block">سرفصل: {q.syllabusTopic}</span>
                        <h4 className={`text-sm font-extrabold leading-relaxed ${isDarkMode ? "text-slate-200" : "text-slate-900"}`}>
                          {q.questionText}
                        </h4>

                        {/* If Multiple Choice, show options */}
                        {fq.type === "multiple" && q.options && (
                          <div className="space-y-2 pt-2">
                            {q.options.map((opt, oIdx) => (
                              <div
                                key={oIdx}
                                className={`p-2.5 text-xs rounded-lg border flex items-center gap-2 text-right ${
                                  oIdx === q.correctOption
                                    ? "bg-emerald-50/40 border-emerald-200 text-emerald-850 dark:bg-emerald-950/20 dark:border-emerald-800 dark:text-emerald-300 font-bold"
                                    : isDarkMode
                                      ? "bg-slate-950 border-slate-900 text-slate-400"
                                      : "bg-slate-50/40 border-slate-100 text-slate-600"
                                }`}
                              >
                                <span className="h-4.5 w-4.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center font-mono text-[9px] font-bold shrink-0">
                                  {oIdx + 1}
                                </span>
                                <span>{opt}</span>
                                {oIdx === q.correctOption && <span className="text-[9px] bg-emerald-500 text-white px-1.5 py-0.2 rounded mr-auto font-bold shrink-0">پاسخ صحیح</span>}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Collapsible Solution block */}
                      <FlaggedSolutionBlock question={q} isDarkMode={isDarkMode} />

                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className={`mt-12 border-t ${isDarkMode ? "border-slate-900" : "border-slate-200"} pt-6 text-center text-slate-500 text-xs`}>
        <p className="font-sans font-light text-[11px] leading-relaxed">
          طراحی شده بر اساس سرفصل‌های رسمی آزمون‌های بین‌المللی CompTIA Security+ SY0-701، EC-Council CEH v12 و پوزیشن کارشناس تحلیلگر مرکز عملیات امنیت (SOC).
        </p>
        <p className="font-mono mt-2 text-[10px] text-[#4A4F59] uppercase tracking-widest font-semibold flex items-center justify-center gap-1">
          <img src="https://img.icons8.com/fluency/48/checked.png" className="h-4.5 w-4.5" alt="Green Shield Tick" />
          CYBERSECURITY PREP ACADEMY © 2026 - 100% Deterministic Local Evaluation Engine
        </p>
      </footer>

    </div>
  );
}
