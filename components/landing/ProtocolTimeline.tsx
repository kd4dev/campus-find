"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, MapPin, MessageSquare, KeyRound, ArrowRight, ShieldCheck, Check } from "lucide-react";
import Link from "next/link";

interface Step {
  number: string;
  title: string;
  tagline: string;
  description: string;
  icon: any;
  bullet: string[];
}

const STEPS: Step[] = [
  {
    number: "01",
    title: "Report with Controlled Privacy",
    tagline: "Photos public, secret marks private",
    description: "Whether you lost your dorm keys or found a graphing calculator, create a listing in 30 seconds. Keep distinguishing characteristics (like engravings or phone cases) hidden so only the true owner can describe them.",
    icon: Camera,
    bullet: [
      "Image upload with automatic optimization",
      "Option to conceal identifying serials",
      "Instant campus feed broadcast"
    ]
  },
  {
    number: "02",
    title: "Campus Location Pinpointing",
    tagline: "Filter by library, dining hall, or quad",
    description: "College campuses are vast. Categorizing items by precise building, room number, or outdoor quad area allows students to search exactly where they walked between lectures.",
    icon: MapPin,
    bullet: [
      "Specific building and zone tags",
      "Approximate timestamp tracking",
      "Instant category matching"
    ]
  },
  {
    number: "03",
    title: "Anonymized In-App Chat",
    tagline: "Coordinate without giving out your phone number",
    description: "No need to hand your WhatsApp or Instagram to strangers. Chat privately within CampusFind, review proof of ownership photos, and agree on a safe, public campus meetup location.",
    icon: MessageSquare,
    bullet: [
      "Zero phone number or email exposure",
      "Real-time message synchronization",
      "Photo attachment for proof verification"
    ]
  },
  {
    number: "04",
    title: "6-Digit OTP Handover Verification",
    tagline: "Cryptographic confirmation before resolution",
    description: "When meeting in person, the claimant presents a generated 6-digit OTP code on their phone screen. The finder enters it into CampusFind, instantly and permanently resolving the listing.",
    icon: KeyRound,
    bullet: [
      "Prevents opportunistic bystanders from taking items",
      "Items stay visible as 'Claim in Progress' until OTP",
      "Both parties receive confirmed return receipts"
    ]
  }
];

export default function ProtocolTimeline() {
  const [activeStep, setActiveStep] = useState<number>(0);

  return (
    <section className="py-24 px-4 max-w-6xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900/50">
          The CampusFind Standard
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white mt-4 tracking-tight">
          How the 4-step handover works.
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg mt-3 leading-relaxed">
          From the moment an item is misplaced until it is safely back in your hands, every step is designed for privacy, verification, and speed.
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isSelected = activeStep === idx;
          return (
            <div
              key={step.number}
              onMouseEnter={() => setActiveStep(idx)}
              className={`rounded-3xl p-6 sm:p-7 border flex flex-col justify-between transition-all duration-300 cursor-pointer ${
                isSelected
                  ? "bg-white dark:bg-slate-900 border-blue-500/70 dark:border-blue-500/60 shadow-xl shadow-blue-500/10 scale-[1.02]"
                  : "bg-white/70 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-900"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className={`text-2xl font-black ${
                    isSelected 
                      ? "text-blue-600 dark:text-blue-400" 
                      : "text-slate-400 dark:text-slate-600"
                  }`}>
                    {step.number}
                  </span>
                  <div className={`p-2.5 rounded-2xl ${
                    isSelected
                      ? "bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5">
                  {step.title}
                </h3>
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-3">
                  {step.tagline}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  {step.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <ul className="space-y-2">
                  {step.bullet.map((item, bIdx) => (
                    <li key={bIdx} className="flex items-center text-[11px] text-slate-600 dark:text-slate-400">
                      <Check className="w-3.5 h-3.5 mr-2 text-emerald-500 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/items"
          className="inline-flex items-center text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <span>Explore how students use the handover protocol right now</span>
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </Link>
      </div>
    </section>
  );
}
