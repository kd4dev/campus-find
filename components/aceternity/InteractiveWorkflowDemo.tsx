"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, MessageSquare, KeyRound, Sparkles, MapPin, CheckCircle2 } from "lucide-react";

export default function InteractiveWorkflowDemo() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 0,
      title: "1. Report Lost / Found",
      badge: "Instant Listing",
      icon: <Sparkles className="w-5 h-5 text-blue-600" />,
      desc: "Post your item with category, photo, and campus spot. Stays active on the board until physically returned.",
    },
    {
      id: 1,
      title: "2. Campus Discovery",
      badge: "Filter & Search",
      icon: <MapPin className="w-5 h-5 text-indigo-600" />,
      desc: "Finders and owners browse listings sorted by recent sightings across libraries, labs, and student dorms.",
    },
    {
      id: 2,
      title: "3. Private Verification Chat",
      badge: "100% Anonymous",
      icon: <MessageSquare className="w-5 h-5 text-purple-600" />,
      desc: "Chat securely without giving out personal WhatsApp or phone numbers. Upload proof of ownership privately.",
    },
    {
      id: 3,
      title: "4. Handover & One-Time OTP",
      badge: "Verified Handover",
      icon: <KeyRound className="w-5 h-5 text-emerald-600" />,
      desc: "Meet in public. The finder enters the 6-digit OTP from the claimant's phone to complete the return.",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <div className="w-full max-w-5xl mx-auto my-12 bg-white/90 dark:bg-[#141416] backdrop-blur-xl rounded-3xl border border-gray-200/80 dark:border-white/10 shadow-2xl overflow-hidden p-6 md:p-8">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-[#f79b4a] border border-orange-200 dark:border-orange-500/30">
          Live Interactive Simulation
        </span>
        <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mt-2">
          Experience the Return Journey
        </h3>
        <p className="text-gray-500 dark:text-neutral-400 text-sm mt-1">
          Click any step below to see how CampusFind protects students at every turn.
        </p>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8 bg-gray-50/80 dark:bg-[#0e0e11] p-1.5 rounded-2xl border border-gray-100 dark:border-white/10">
        {steps.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setActiveStep(idx)}
            className={`cursor-pointer px-3 py-3 rounded-xl text-left transition-all relative ${
              activeStep === idx
                ? "bg-white dark:bg-[#18181c] text-gray-900 dark:text-white shadow-sm font-semibold"
                : "text-gray-500 dark:text-neutral-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100/60 dark:hover:bg-white/5"
            }`}
          >
            <div className="flex items-center space-x-2">
              <span className="p-1 rounded-lg bg-gray-50 dark:bg-[#141416]">{s.icon}</span>
              <span className="text-xs md:text-sm truncate">{s.title}</span>
            </div>
            {activeStep === idx && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#FF7D0C] rounded-full"
              />
            )}
          </button>
        ))}
      </div>

      {/* Interactive Mock Display */}
      <div className="bg-[#0a0a0b] dark:bg-[#0e0e11] rounded-2xl p-6 md:p-8 text-white relative min-h-[260px] flex items-center justify-center overflow-hidden border border-gray-800 dark:border-white/10 shadow-inner">
        {/* Subtle background glow */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#ff7d0c]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#ff7d0c]/10 rounded-full blur-3xl pointer-events-none" />

        <AnimatePresence mode="wait">
          {activeStep === 0 && (
            <motion.div
              key="step-0"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-lg space-y-4"
            >
              <div className="bg-[#18181c] backdrop-blur-md border border-white/10 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-xs">
                    LOST
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">Sony WH-1000XM5 Headphones</h4>
                    <p className="text-xs text-neutral-400">Main Library 2nd Floor • 20 mins ago</p>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-medium border border-emerald-500/30">
                  Live on Board
                </span>
              </div>
              <p className="text-xs text-neutral-400 text-center">
                Posts stay searchable on campus until you complete OTP verification with the finder.
              </p>
            </motion.div>
          )}

          {activeStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-lg space-y-3"
            >
              <div className="bg-[#18181c] backdrop-blur-md border border-white/10 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                    FOUND
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">Sony Silver Headphones in Black Case</h4>
                    <p className="text-xs text-neutral-400">Library Study Cubicle #14</p>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-orange-500/20 text-[#f79b4a] font-medium border border-orange-500/30">
                  98% Match
                </span>
              </div>
              <p className="text-xs text-neutral-400 text-center">
                Smart campus filtering connects finders with owners instantly without public exposure.
              </p>
            </motion.div>
          )}

          {activeStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-lg space-y-3"
            >
              <div className="bg-[#18181c] backdrop-blur-md border border-white/10 rounded-xl p-4 space-y-2">
                <div className="flex justify-start">
                  <div className="bg-[#242429] text-neutral-200 text-xs px-3 py-2 rounded-2xl rounded-bl-none max-w-[80%] border border-white/5">
                    "Hey, I think I found your headphones near desk 14. What's the engraving on the band?"
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-[#FF7D0C] text-white text-xs px-3 py-2 rounded-2xl rounded-br-none max-w-[80%] shadow-sm">
                    "It has 'KD24' inscribed inside the right ear cup. Uploaded proof invoice too!"
                  </div>
                </div>
              </div>
              <p className="text-xs text-neutral-400 text-center">
                Private peer-to-peer verification with end-to-end anonymity.
              </p>
            </motion.div>
          )}

          {activeStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-lg text-center space-y-4"
            >
              <div className="bg-[#18181c] backdrop-blur-md border border-white/10 rounded-xl p-5 inline-block">
                <p className="text-xs text-neutral-400 mb-2 font-mono uppercase tracking-wider">
                  Handover Verification OTP
                </p>
                <div className="flex items-center justify-center space-x-2 font-mono text-2xl font-bold tracking-widest text-[#f79b4a]">
                  <span className="w-10 h-12 bg-[#0e0e11] border border-[#ff7d0c]/40 rounded-lg flex items-center justify-center shadow-lg">8</span>
                  <span className="w-10 h-12 bg-[#0e0e11] border border-[#ff7d0c]/40 rounded-lg flex items-center justify-center shadow-lg">4</span>
                  <span className="w-10 h-12 bg-[#0e0e11] border border-[#ff7d0c]/40 rounded-lg flex items-center justify-center shadow-lg">2</span>
                  <span className="w-10 h-12 bg-[#0e0e11] border border-[#ff7d0c]/40 rounded-lg flex items-center justify-center shadow-lg">9</span>
                  <span className="w-10 h-12 bg-[#0e0e11] border border-[#ff7d0c]/40 rounded-lg flex items-center justify-center shadow-lg">1</span>
                  <span className="w-10 h-12 bg-[#0e0e11] border border-[#ff7d0c]/40 rounded-lg flex items-center justify-center shadow-lg">6</span>
                </div>
              </div>
              <div className="flex items-center justify-center text-xs text-emerald-400 space-x-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Verified Handover • Item Marked Resolved Safely</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
