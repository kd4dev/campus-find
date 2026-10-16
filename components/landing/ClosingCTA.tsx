"use client";

import Link from "next/link";
import { ArrowUpRight, PlusCircle, Search, ShieldCheck } from "lucide-react";

export default function ClosingCTA() {
  return (
    <section className="py-20 px-4 max-w-6xl mx-auto">
      <div className="rounded-3xl bg-neutral-900 text-white dark:bg-[#0c0f17] dark:border dark:border-white/10 p-8 sm:p-12 md:p-16 relative overflow-hidden shadow-2xl">
        {/* Subtle warm interior glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 dark:bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/10 text-neutral-200 text-xs font-semibold backdrop-blur-sm border border-white/10 dark:bg-white/[0.04] dark:text-neutral-300 dark:border-white/10">
            <ShieldCheck className="w-3.5 h-3.5 text-[#FF7D0C] dark:text-[#f79b4a]" />
            <span>Campus Community Guarantee</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-white">
            Misplaced something today?{" "}
            <span className="text-[#FF7D0C] dark:text-[#f79b4a]">
              Don't wait until it's gone.
            </span>
          </h2>

          <p className="text-neutral-300 text-base sm:text-lg leading-relaxed">
            The earlier you list a lost item or report a found belong, the higher the chance of recovery. Every listing stays active on the campus board until verified with a 6-digit OTP.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/items/lost/new" className="w-full sm:w-auto">
              <button className="btn-asym cursor-pointer w-full sm:w-auto px-8 py-3.5 text-sm font-bold bg-white text-neutral-950 hover:bg-neutral-100 transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center">
                <span>Report Lost Item</span>
                <ArrowUpRight className="w-4 h-4 ml-1.5" />
              </button>
            </Link>

            <Link href="/items/found/new" className="w-full sm:w-auto">
              <button className="btn-asym-mirror cursor-pointer w-full sm:w-auto px-8 py-3.5 text-sm font-bold bg-[#FF7D0C] hover:bg-[#ea6c00] text-white transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center">
                <PlusCircle className="w-4 h-4 mr-2" />
                <span>Report Found Item</span>
              </button>
            </Link>

            <Link href="/items" className="w-full sm:w-auto">
              <button className="cursor-pointer w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-semibold bg-transparent text-neutral-200 hover:text-white border border-neutral-700 hover:border-neutral-500 dark:border-white/15 dark:hover:border-white/30 transition-all flex items-center justify-center">
                <Search className="w-4 h-4 mr-2 text-neutral-400" />
                <span>Search Board</span>
              </button>
            </Link>
          </div>

          <p className="text-xs text-neutral-400 pt-2">
            No phone numbers required. Authenticated via student single sign-on.
          </p>
        </div>
      </div>
    </section>
  );
}
