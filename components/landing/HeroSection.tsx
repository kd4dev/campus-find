"use client";

import Link from "next/link";
import { ArrowUpRight, Search, ShieldCheck, KeyRound, Clock, PlusCircle } from "lucide-react";
import LiveProductConsole from "@/components/landing/LiveProductConsole";

export default function HeroSection() {
  return (
    <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Authoritative Editorial Copy & Actions */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          
          {/* ChaiCode Signature Animated Glint Badge */}
          <div className="relative inline-flex items-center justify-center overflow-hidden rounded-full p-px mb-6">
            <span
              aria-hidden="true"
              className="absolute top-1/2 left-1/2 h-5 w-[320px] rounded-full bg-gradient-to-r from-transparent via-[#FF7D0C] to-transparent motion-safe:animate-chai-spin pointer-events-none"
              style={{ transform: "translate(-50%, -50%)" }}
            />
            <div className="relative z-10 flex items-center space-x-2 px-4 py-1.5 rounded-full bg-neutral-100/90 dark:bg-[#141416]/95 border border-neutral-200/80 dark:border-white/10 text-xs font-semibold text-neutral-800 dark:text-neutral-200 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#FF7D0C] animate-pulse" />
              <span>CampusFind • The College Handover Protocol</span>
            </div>
          </div>

          {/* Core Headline with ChaiCode Signature Highlight */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-neutral-900 dark:text-white tracking-tight leading-[1.08] mb-6">
            The campus lost & found where items{" "}
            <span className="text-[#FF7D0C] dark:text-[#f79b4a] underline decoration-[#FF7D0C]/40 decoration-wavy decoration-2">
              actually get returned.
            </span>
          </h1>

          {/* Narrative Subtitle */}
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300/90 leading-relaxed max-w-2xl mb-8">
            Campus WhatsApp groups leak your private phone number and invite opportunistic theft. CampusFind protects your identity with in-app anonymous chat, keeps listings active, and confirms returns with a 6-digit handover OTP.
          </p>

          {/* ChaiCode Dual Intent Asymmetric Action Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mb-8">
            <Link href="/items/lost/new" className="w-full sm:w-auto">
              <button className="btn-asym cursor-pointer w-full sm:w-auto px-7 py-3.5 text-sm font-bold bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 hover:bg-black dark:hover:bg-neutral-200 shadow-md transition-all flex items-center justify-center hover:scale-[1.02] active:scale-[0.98]">
                <span>I Lost Something</span>
                <ArrowUpRight className="w-4 h-4 ml-1.5" />
              </button>
            </Link>

            <Link href="/items/found/new" className="w-full sm:w-auto">
              <button className="btn-asym-mirror cursor-pointer w-full sm:w-auto px-6 py-3.5 text-sm font-bold border border-neutral-300 dark:border-white/15 bg-transparent hover:bg-neutral-100 dark:hover:bg-white/[0.05] text-neutral-800 dark:text-neutral-200 transition-all flex items-center justify-center hover:scale-[1.02] active:scale-[0.98]">
                <PlusCircle className="w-4 h-4 mr-2 text-[#FF7D0C] dark:text-[#f79b4a]" />
                <span>I Found an Item</span>
              </button>
            </Link>

            <Link href="/items" className="w-full sm:w-auto">
              <button className="cursor-pointer w-full sm:w-auto px-5 py-3.5 rounded-xl text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.04] border border-neutral-200 dark:border-white/10 transition-all flex items-center justify-center">
                <Search className="w-4 h-4 mr-2 text-neutral-400" />
                <span>Browse Board</span>
              </button>
            </Link>
          </div>

          {/* Trust Guarantees with Warm Hairline Divider */}
          <div className="pt-6 border-t border-neutral-200/80 dark:border-white/10 flex flex-wrap gap-y-3 gap-x-6 text-xs font-medium text-neutral-500 dark:text-neutral-400">
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-[#FF7D0C] dark:text-[#f79b4a] shrink-0" />
              <span>Zero Phone Doxxing</span>
            </div>

            <div className="flex items-center space-x-1.5">
              <KeyRound className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>6-Digit Verification OTP</span>
            </div>

            <div className="flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
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
