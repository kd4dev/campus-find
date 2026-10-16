"use client";

import { XCircle, CheckCircle2, ShieldAlert, ShieldCheck, Lock, Unlock, EyeOff, BellOff } from "lucide-react";

export default function CampusContrast() {
  return (
    <section className="py-20 px-4 max-w-6xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <span className="text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50">
          The Campus Problem Solved
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white mt-4 tracking-tight">
          Why campus group chats fail.
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg mt-3 leading-relaxed">
          Posting lost keys or electronics in 500-member WhatsApp groups leads to doxxing, false claims, and stolen belongings. CampusFind replaces the chaos with an engineered handover protocol.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
        {/* The Chaos of Group Chats */}
        <div className="rounded-3xl p-7 sm:p-9 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 flex flex-col justify-between relative overflow-hidden transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-400/10 dark:bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 flex items-center justify-center border border-rose-200 dark:border-rose-800/60">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                  The Old Way
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  WhatsApp & Social Boards
                </h3>
              </div>
            </div>

            <ul className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
              <li className="flex items-start">
                <XCircle className="w-5 h-5 text-rose-500 shrink-0 mr-3 mt-0.5" />
                <div>
                  <strong className="font-semibold text-slate-900 dark:text-white block">Personal Phone Numbers Leaked</strong>
                  Strangers get your cell phone number, dorm hints, and personal profiles in public chat archives.
                </div>
              </li>

              <li className="flex items-start">
                <XCircle className="w-5 h-5 text-rose-500 shrink-0 mr-3 mt-0.5" />
                <div>
                  <strong className="font-semibold text-slate-900 dark:text-white block">Opportunistic "Finders" Claim Your Item</strong>
                  Anyone in the group can message the finder claiming ownership without proving identity or serials.
                </div>
              </li>

              <li className="flex items-start">
                <XCircle className="w-5 h-5 text-rose-500 shrink-0 mr-3 mt-0.5" />
                <div>
                  <strong className="font-semibold text-slate-900 dark:text-white block">Listings Disappear in Minutes</strong>
                  Lost posts drown under hundreds of unrelated group messages, or get deleted before the owner sees them.
                </div>
              </li>

              <li className="flex items-start">
                <XCircle className="w-5 h-5 text-rose-500 shrink-0 mr-3 mt-0.5" />
                <div>
                  <strong className="font-semibold text-slate-900 dark:text-white block">Zero Handover Accountability</strong>
                  No record of who took the item, leaving original finders vulnerable to accusations of theft.
                </div>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-5 border-t border-rose-200/60 dark:border-rose-900/30 text-xs font-medium text-rose-700 dark:text-rose-400 flex items-center">
            <span className="w-2 h-2 rounded-full bg-rose-500 mr-2" />
            High risk of false claims & unwanted contact
          </div>
        </div>

        {/* The CampusFind Protocol */}
        <div className="rounded-3xl p-7 sm:p-9 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40 flex flex-col justify-between relative overflow-hidden transition-all shadow-lg shadow-emerald-500/5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 dark:bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center border border-emerald-200 dark:border-emerald-800/60">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                  The CampusFind Protocol
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Engineered Student Handover
                </h3>
              </div>
            </div>

            <ul className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
              <li className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mr-3 mt-0.5" />
                <div>
                  <strong className="font-semibold text-slate-900 dark:text-white block">Complete Anonymity & Privacy</strong>
                  Direct in-app messaging without exchanging phone numbers, Instagram, or social profiles.
                </div>
              </li>

              <li className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mr-3 mt-0.5" />
                <div>
                  <strong className="font-semibold text-slate-900 dark:text-white block">One-Time 6-Digit Handover OTP</strong>
                  The real owner generates a temporary verification code. The finder enters it upon physical return.
                </div>
              </li>

              <li className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mr-3 mt-0.5" />
                <div>
                  <strong className="font-semibold text-slate-900 dark:text-white block">Active Until Physical Resolution</strong>
                  Items remain visible with "Claim in Progress" status so other potential owners can monitor it until OTP verification.
                </div>
              </li>

              <li className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mr-3 mt-0.5" />
                <div>
                  <strong className="font-semibold text-slate-900 dark:text-white block">Campus Community Moderation</strong>
                  Flagged or fraudulent listings can be reported by students and resolved by verified campus admins.
                </div>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-5 border-t border-emerald-200/60 dark:border-emerald-900/30 text-xs font-medium text-emerald-700 dark:text-emerald-300 flex items-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
            94%+ successful return rate across campus
          </div>
        </div>
      </div>
    </section>
  );
}
