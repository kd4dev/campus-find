"use client";

import Link from "next/link";
import { ArrowRight, Search, ShieldCheck, KeyRound, Clock, PlusCircle } from "lucide-react";
import LiveProductConsole from "@/components/landing/LiveProductConsole";

export default function HeroSection() {
  return (
    <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 px-4 overflow-hidden">
      {/* Subtle background ambient gradient (calm, zero garish neon) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-blue-50/60 via-slate-50/20 to-transparent dark:from-blue-950/20 dark:via-slate-950/10 dark:to-transparent pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Authoritative Editorial Copy & Actions */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          {/* Live Campus Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 mb-6 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-full shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>CampusFind 2.4 • The College Handover Protocol</span>
          </div>

          {/* Core Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.08] mb-6">
            The campus lost & found where items{" "}
            <span className="underline decoration-blue-500/50 decoration-wavy decoration-2">
              actually get returned.
            </span>
          </h1>

          {/* Narrative Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mb-8">
            Campus WhatsApp groups leak your private phone number and invite opportunistic theft. CampusFind protects your identity with in-app anonymous chat, keeps listings active, and confirms returns with a 6-digit handover OTP.
          </p>

          {/* Dual Intent Action Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mb-8">
            <Link href="/items/lost/new" className="w-full sm:w-auto">
              <button className="cursor-pointer w-full sm:w-auto px-7 py-3.5 rounded-2xl text-sm font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 shadow-md shadow-slate-900/10 dark:shadow-none transition-all flex items-center justify-center hover:scale-[1.02] active:scale-[0.98]">
                <span>I Lost Something</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </Link>

            <Link href="/items/found/new" className="w-full sm:w-auto">
              <button className="cursor-pointer w-full sm:w-auto px-6 py-3.5 rounded-2xl text-sm font-bold bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 transition-all flex items-center justify-center hover:scale-[1.02] active:scale-[0.98]">
                <PlusCircle className="w-4 h-4 mr-2 text-emerald-600 dark:text-emerald-400" />
                <span>I Found an Item</span>
              </button>
            </Link>

            <Link href="/items" className="w-full sm:w-auto">
              <button className="cursor-pointer w-full sm:w-auto px-5 py-3.5 rounded-2xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-slate-200 dark:border-slate-800 transition-colors flex items-center justify-center">
                <Search className="w-4 h-4 mr-2 text-slate-400" />
                <span>Browse Board</span>
              </button>
            </Link>
          </div>

          {/* Trust Guarantees */}
          <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-wrap gap-y-3 gap-x-6 text-xs font-medium text-slate-500 dark:text-slate-400">
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>Zero Phone Doxxing</span>
            </div>

            <div className="flex items-center space-x-1.5">
              <KeyRound className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>6-Digit Verification OTP</span>
            </div>

            <div className="flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>Active Until Handover</span>
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive Return Console */}
        <div className="lg:col-span-5 w-full flex justify-center">
          <LiveProductConsole />
        </div>
      </div>
    </section>
  );
}
