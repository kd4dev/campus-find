import Link from "next/link";
import HeroSection from "@/components/landing/HeroSection";
import CampusContrast from "@/components/landing/CampusContrast";
import ProtocolTimeline from "@/components/landing/ProtocolTimeline";
import CategoryExplorer from "@/components/landing/CategoryExplorer";
import ClosingCTA from "@/components/landing/ClosingCTA";
import { ShieldCheck, Lock, CheckCircle2, Heart } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50/60 dark:bg-[#0a0a0b] text-slate-900 dark:text-neutral-100 relative overflow-hidden transition-colors duration-200">
      {/* 1. Asymmetric Hero with Live Interactive Console */}
      <HeroSection />

      {/* 2. Campus Contrast: Why Group Chats Fail vs. Handover Protocol */}
      <CampusContrast />

      {/* 3. The 4-Step Handover Protocol */}
      <ProtocolTimeline />

      {/* 4. Live Category Explorer */}
      <CategoryExplorer />

      {/* 5. Closing Campus Guarantee CTA */}
      <ClosingCTA />

      {/* Cohesive Campus Footer with ChaiCode Dark Uniformity */}
      <footer className="py-14 border-t border-neutral-200/80 dark:border-white/10 bg-white dark:bg-[#080809] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  CampusFind
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-[#f79b4a] border border-orange-500/20">
                  v2.4
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-neutral-400 max-w-sm leading-relaxed">
                The privacy-first lost & found platform built specifically for university campuses. No phone number leaks, guaranteed OTP handovers, and active listings until physical return.
              </p>
              <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-neutral-400 pt-1">
                <span className="flex items-center">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                  Anti-Doxxing Protected
                </span>
                <span className="flex items-center">
                  <Lock className="w-3.5 h-3.5 mr-1 text-[#ff7d0c] dark:text-[#f79b4a]" />
                  Encrypted In-App Chat
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
                Quick Actions
              </h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-neutral-400">
                <li>
                  <Link href="/items/lost/new" className="hover:text-[#ff7d0c] dark:hover:text-[#f79b4a] transition-colors">
                    Report Lost Item
                  </Link>
                </li>
                <li>
                  <Link href="/items/found/new" className="hover:text-[#ff7d0c] dark:hover:text-[#f79b4a] transition-colors">
                    Report Found Item
                  </Link>
                </li>
                <li>
                  <Link href="/items" className="hover:text-[#ff7d0c] dark:hover:text-[#f79b4a] transition-colors">
                    Campus Live Board
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-[#ff7d0c] dark:hover:text-[#f79b4a] transition-colors">
                    My Claims & Reports
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
                Campus Safety
              </h4>
              <ul className="space-y-2 text-xs text-slate-500 dark:text-neutral-400 leading-relaxed">
                <li>• Always meet in well-lit, public areas (e.g. Student Union).</li>
                <li>• Never hand over items before entering the 6-digit OTP.</li>
                <li>• Keep unique markings private until verified in chat.</li>
                <li>• Inappropriate or suspicious listings are moderated daily.</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-neutral-200/80 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-neutral-400 gap-4">
            <p>© {new Date().getFullYear()} CampusFind. Built for safer college communities.</p>
            <div className="flex items-center space-x-1">
              <span>Crafted for university students everywhere</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
