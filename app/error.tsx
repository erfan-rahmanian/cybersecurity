"use client";

import React, { useEffect } from "react";
import { ShieldAlert, RotateCcw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("System Core rendering failure:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0A0B0E] text-slate-200 flex flex-col items-center justify-center p-6 font-sans selection:bg-red-500/30 selection:text-red-200" id="error-container">
      <div
        className="max-w-md w-full bg-slate-900/40 border border-red-950/40 rounded-2xl p-8 backdrop-blur-md text-center shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-red-500/30"
        id="error-card"
      >
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-red-500/10 blur-[80px] rounded-full pointer-events-none" />

        <div className="flex justify-center mb-6" id="error-icon-wrapper">
          <div className="p-4 bg-red-500/10 rounded-2xl border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.15)]">
            <ShieldAlert className="h-12 w-12 text-red-400" />
          </div>
        </div>

        <h1 className="text-2xl font-extrabold text-slate-100 mb-2" id="error-title">
          خطای امنیتی سیستمی
        </h1>
        
        <h2 className="text-xs font-mono text-red-400 mb-4 bg-red-950/30 border border-red-900/20 rounded-lg p-2.5 overflow-x-auto text-left whitespace-pre-wrap max-h-24 scrollbar-thin" id="error-message">
          {error.message || "An unexpected system error occurred."}
        </h2>

        <p className="text-sm text-slate-400 mb-8 leading-relaxed font-normal" id="error-description">
          هسته مرکزی شبیه‌ساز با خطای غیرمنتظره مواجه شد. ارتباط‌ها و پارامترها بازنگری شدند. لطفاً تلاش مجدد کنید.
        </p>

        <div id="error-btn-wrapper" className="transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-l from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 text-white font-bold text-sm rounded-xl transition-all shadow-[0_4px_20px_rgba(239,68,68,0.25)] focus:outline-none focus:ring-2 focus:ring-red-500/50 cursor-pointer"
            id="error-reset-btn"
          >
            <span>راه‌اندازی مجدد هسته آزمون</span>
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
