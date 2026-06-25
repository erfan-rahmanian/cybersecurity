import React from "react";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0A0B0E] text-slate-200 flex flex-col items-center justify-center p-6 font-sans selection:bg-cyan-500/30 selection:text-cyan-200" id="not-found-container">
      <div
        className="max-w-md w-full bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 backdrop-blur-md text-center shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-cyan-500/30"
        id="not-found-card"
      >
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none" />

        <div className="flex justify-center mb-6" id="not-found-icon-wrapper">
          <div className="p-4 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
            <ShieldAlert className="h-12 w-12 text-cyan-400 animate-pulse" />
          </div>
        </div>

        <h1 className="text-6xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-3" id="not-found-title">
          404
        </h1>
        
        <h2 className="text-xl font-bold text-slate-100 mb-4" id="not-found-subtitle">
          صفحه مورد نظر یافت نشد | امن‌سازی مسیر
        </h2>

        <p className="text-sm text-slate-400 mb-8 leading-relaxed font-normal" id="not-found-description">
          مسیر درخواستی شما در شبیه‌ساز آکادمی وجود ندارد یا به دلایل امنیتی مسدود شده است. لطفاً جهت بازگشت به پنل اصلی شبیه‌ساز آزمون‌ها دکمه زیر را بفشارید.
        </p>

        <div id="not-found-btn-wrapper" className="transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]">
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-l from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm rounded-xl transition-all shadow-[0_4px_20px_rgba(6,182,212,0.25)] focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            id="not-found-home-link"
          >
            <span>بازگشت به شبیه‌ساز آزمون</span>
            <ArrowLeft className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
