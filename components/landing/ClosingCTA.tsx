"use client";

import Link from "next/link";
import { ArrowRight, PlusCircle, Search, ShieldCheck } from "lucide-react";

export default function ClosingCTA() {
  return (
    <section className="py-20 px-4 max-w-6xl mx-auto">
      <div className="rounded-3xl bg-slate-900 text-white dark:bg-slate-900/90 dark:border dark:border-slate-800 p-8 sm:p-12 md:p-16 relative overflow-hidden shadow-2xl">
        {/* Subtle interior glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-slate-200 text-xs font-semibold backdrop-blur-sm border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Campus Community Guarantee</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Misplaced something today? Don't wait until it's gone.
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            The earlier you list a lost item or report a found belong, the higher the chance of recovery. Every listing stays active on the campus board until verified with a 6-digit OTP.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/items/lost/new" className="w-full sm:w-auto">
              <button className="cursor-pointer w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-bold bg-white text-slate-900 hover:bg-slate-100 transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center">
                <span>Report Lost Item</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </Link>

            <Link href="/items/found/new" className="w-full sm:w-auto">
              <button className="cursor-pointer w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center">
                <PlusCircle className="w-4 h-4 mr-2" />
                <span>Report Found Item</span>
              </button>
            </Link>

            <Link href="/items" className="w-full sm:w-auto">
              <button className="cursor-pointer w-full sm:w-auto px-6 py-3.5 rounded-2xl text-sm font-semibold bg-transparent text-slate-200 hover:text-white border border-slate-700 hover:border-slate-500 transition-colors flex items-center justify-center">
                <Search className="w-4 h-4 mr-2 text-slate-400" />
                <span>Search Board</span>
              </button>
            </Link>
          </div>

          <p className="text-xs text-slate-400 pt-2">
            No phone numbers required. Authenticated via student single sign-on.
          </p>
        </div>
      </div>
    </section>
  );
}
