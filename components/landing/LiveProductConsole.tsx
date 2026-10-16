"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  MessageSquare, 
  KeyRound, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  Lock,
  Smartphone,
  Eye,
  UserCheck
} from "lucide-react";
import Link from "next/link";

type TabType = "feed" | "chat" | "otp";

interface SampleItem {
  id: string;
  name: string;
  location: string;
  time: string;
  category: string;
  type: "LOST" | "FOUND";
  status: string;
  details: string;
}

const SAMPLE_ITEMS: SampleItem[] = [
  {
    id: "1",
    name: "AirPods Pro (2nd Gen)",
    location: "Main Library, 2nd Floor Silent Area",
    time: "24m ago",
    category: "Electronics",
    type: "FOUND",
    status: "Claim Pending",
    details: "White case with small blue silicone strap. Found on desk #42."
  },
  {
    id: "2",
    name: "Student ID Card & Dorm Fob",
    location: "Campus Dining Hall North",
    time: "1h ago",
    category: "IDs & Keys",
    type: "FOUND",
    status: "Active Listing",
    details: "Card in clear sleeve with red lanyard and brass room key."
  },
  {
    id: "3",
    name: "Hydro Flask 32oz (Navy)",
    location: "Engineering Quad Benches",
    time: "2h ago",
    category: "Personal Gear",
    type: "LOST",
    status: "Active Listing",
    details: "Navy blue bottle with campus computer science club stickers."
  }
];

export default function LiveProductConsole() {
  const [activeTab, setActiveTab] = useState<TabType>("feed");
  const [selectedItem, setSelectedItem] = useState<SampleItem>(SAMPLE_ITEMS[0]);
  const [otpInput, setOtpInput] = useState<string>("842195");
  const [isOtpVerified, setIsOtpVerified] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const handleVerifyOtp = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsOtpVerified(true);
    }, 600);
  };

  const handleResetOtp = () => {
    setIsOtpVerified(false);
    setOtpInput("842195");
  };

  return (
    <div className="w-full max-w-xl mx-auto rounded-3xl bg-white/90 dark:bg-[#0c1322]/95 border border-slate-200/90 dark:border-slate-800/90 dark:border-t-slate-700/80 shadow-2xl shadow-slate-200/50 dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95),0_0_35px_-5px_rgba(59,130,246,0.18)] overflow-hidden backdrop-blur-xl transition-all">
      {/* Console Top Window Bar */}
      <div className="px-5 py-3.5 bg-slate-50/90 dark:bg-[#080d17]/90 border-b border-slate-200/80 dark:border-slate-800/90 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-rose-400/80 dark:bg-rose-500 dark:shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
          <div className="w-3 h-3 rounded-full bg-amber-400/80 dark:bg-amber-500 dark:shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
          <div className="w-3 h-3 rounded-full bg-emerald-400/80 dark:bg-emerald-500 dark:shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
          <span className="ml-2 text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-tight">
            CampusFind Handover Console v2.4
          </span>
        </div>
        <div className="flex items-center space-x-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse dark:shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          <span className="hidden sm:inline">Campus Auth Active</span>
        </div>
      </div>

      {/* Interactive Tabs */}
      <div className="grid grid-cols-3 p-1.5 bg-slate-100/70 dark:bg-[#060a12]/80 border-b border-slate-200/60 dark:border-slate-800/90 text-xs font-medium">
        <button
          onClick={() => setActiveTab("feed")}
          className={`py-2 px-3 rounded-xl flex items-center justify-center space-x-1.5 transition-all ${
            activeTab === "feed"
              ? "bg-white dark:bg-slate-800/95 text-slate-900 dark:text-white shadow-sm dark:shadow-[0_2px_10px_rgba(0,0,0,0.5),0_0_12px_rgba(59,130,246,0.2)] dark:border dark:border-slate-700/80 font-semibold"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 dark:hover:bg-slate-900/60"
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>1. Live Feed</span>
        </button>

        <button
          onClick={() => setActiveTab("chat")}
          className={`py-2 px-3 rounded-xl flex items-center justify-center space-x-1.5 transition-all ${
            activeTab === "chat"
              ? "bg-white dark:bg-slate-800/95 text-slate-900 dark:text-white shadow-sm dark:shadow-[0_2px_10px_rgba(0,0,0,0.5),0_0_12px_rgba(59,130,246,0.2)] dark:border dark:border-slate-700/80 font-semibold"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 dark:hover:bg-slate-900/60"
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>2. Anonymized Chat</span>
        </button>

        <button
          onClick={() => setActiveTab("otp")}
          className={`py-2 px-3 rounded-xl flex items-center justify-center space-x-1.5 transition-all ${
            activeTab === "otp"
              ? "bg-white dark:bg-slate-800/95 text-slate-900 dark:text-white shadow-sm dark:shadow-[0_2px_10px_rgba(0,0,0,0.5),0_0_12px_rgba(59,130,246,0.2)] dark:border dark:border-slate-700/80 font-semibold"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 dark:hover:bg-slate-900/60"
          }`}
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>3. OTP Handover</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="p-5 min-h-[360px] flex flex-col justify-between">
        <AnimatePresence mode="wait">
          {activeTab === "feed" && (
            <motion.div
              key="feed"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pb-1">
                <span>Recent campus activity</span>
                <span className="text-blue-600 dark:text-blue-400 font-semibold">3 listings today</span>
              </div>

              {SAMPLE_ITEMS.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    selectedItem.id === item.id
                      ? "border-blue-500/60 dark:border-blue-500/80 dark:border-t-blue-400/80 bg-blue-50/50 dark:bg-blue-950/40 shadow-sm dark:shadow-[0_0_20px_-3px_rgba(59,130,246,0.25)]"
                      : "border-slate-200/80 dark:border-slate-800/90 bg-white dark:bg-slate-900/80 hover:border-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            item.type === "FOUND"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border dark:border-emerald-800/60"
                              : "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 dark:border dark:border-rose-800/60"
                          }`}
                        >
                          {item.type}
                        </span>
                        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                          {item.category}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {item.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center mt-1">
                        <MapPin className="w-3 h-3 mr-1 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[240px]">{item.location}</span>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-transparent dark:border-slate-700/60 px-2 py-0.5 rounded-full font-medium">
                        {item.status}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-1">{item.time}</p>
                    </div>
                  </div>
                </div>
              ))}

              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">
                  Selected: <strong className="text-slate-800 dark:text-slate-200">{selectedItem.name}</strong>
                </span>
                <button
                  onClick={() => setActiveTab("chat")}
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                >
                  Inspect Handover Chat <ArrowRight className="w-3 h-3 ml-1" />
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === "chat" && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              {/* Privacy Banner */}
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 flex items-center justify-between text-xs dark:shadow-[0_0_15px_-3px_rgba(245,158,11,0.15)]">
                <div className="flex items-center space-x-2 text-amber-800 dark:text-amber-300">
                  <Lock className="w-3.5 h-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                  <span>Encrypted Channel • Phone numbers masked</span>
                </div>
                <span className="text-[10px] bg-amber-200/60 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 px-1.5 py-0.5 rounded font-bold">
                  Protected
                </span>
              </div>

              {/* Message Thread */}
              <div className="space-y-2.5 bg-slate-50/70 dark:bg-[#080d18]/80 p-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-800/90">
                <div className="flex items-start space-x-2">
                  <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center text-xs font-bold shrink-0">
                    S
                  </div>
                  <div className="bg-white dark:bg-slate-800/95 p-2.5 rounded-2xl rounded-tl-sm text-xs text-slate-800 dark:text-slate-100 shadow-sm border border-slate-200/60 dark:border-slate-700/80 max-w-[85%]">
                    <p className="font-semibold text-[10px] text-blue-600 dark:text-blue-400 mb-0.5">Claimant (Student)</p>
                    Hey! I think that's my AirPods case left on desk 42. Does it have a scratch near the hinge?
                  </div>
                </div>

                <div className="flex items-start justify-end space-x-2">
                  <div className="bg-blue-600 dark:bg-blue-600 text-white p-2.5 rounded-2xl rounded-tr-sm text-xs shadow-sm dark:shadow-[0_2px_12px_rgba(37,99,235,0.35)] max-w-[85%]">
                    <p className="font-semibold text-[10px] text-blue-100 mb-0.5">Finder (Sam)</p>
                    Yes, exactly! It has that tiny mark. Let's meet at the Campus Center info desk tomorrow at 2 PM.
                  </div>
                  <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-center text-xs font-bold shrink-0">
                    F
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center text-xs font-bold shrink-0">
                    S
                  </div>
                  <div className="bg-white dark:bg-slate-800/95 p-2.5 rounded-2xl rounded-tl-sm text-xs text-slate-800 dark:text-slate-100 shadow-sm border border-slate-200/60 dark:border-slate-700/80 max-w-[85%]">
                    Awesome. I will show you my 6-digit handover OTP upon meeting. See you there!
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">
                  Item status: <span className="font-semibold text-amber-600 dark:text-amber-400">Stays live until OTP</span>
                </span>
                <button
                  onClick={() => setActiveTab("otp")}
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                >
                  Test OTP Handover <ArrowRight className="w-3 h-3 ml-1" />
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === "otp" && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-4 text-center py-2"
            >
              <div className="max-w-xs mx-auto">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-2 border border-indigo-200/60 dark:border-indigo-900/50 dark:shadow-[0_0_15px_-3px_rgba(99,102,241,0.25)]">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Physical Handover Verification
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  The claimant shares this one-time code in person. The finder enters it to confirm rightful receipt.
                </p>
              </div>

              {/* 6-Digit Code Display */}
              <div className="flex items-center justify-center space-x-2 my-3">
                {otpInput.split("").map((digit, idx) => (
                  <div
                    key={idx}
                    className={`w-9 h-11 sm:w-11 sm:h-13 rounded-xl border flex items-center justify-center text-base sm:text-lg font-black transition-all ${
                      isOtpVerified
                        ? "bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 text-emerald-700 dark:text-emerald-300 dark:shadow-[0_0_25px_-3px_rgba(16,185,129,0.4)]"
                        : "bg-slate-50 dark:bg-slate-800/90 border-slate-300 dark:border-slate-700/90 text-slate-900 dark:text-white dark:shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)]"
                    }`}
                  >
                    {digit}
                  </div>
                ))}
              </div>

              {/* Status Message */}
              {isOtpVerified ? (
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-600/60 text-emerald-800 dark:text-emerald-200 text-xs flex items-center justify-center space-x-2 animate-in fade-in zoom-in-95 dark:shadow-[0_0_20px_-3px_rgba(16,185,129,0.3)]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="font-semibold">Handover Verified! Item marked RESOLVED.</span>
                </div>
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Prevents unauthorized bystanders from taking claimed belongings.
                </p>
              )}

              {/* Action Buttons */}
              <div className="pt-1 flex items-center justify-center space-x-3">
                {!isOtpVerified ? (
                  <button
                    onClick={handleVerifyOtp}
                    disabled={isVerifying}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 dark:shadow-[0_0_25px_-5px_rgba(37,99,235,0.5)] transition-all hover:scale-105 active:scale-95 disabled:opacity-70 flex items-center"
                  >
                    {isVerifying ? (
                      <span>Verifying on-chain...</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 mr-1.5" />
                        <span>Simulate Handover Complete</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleResetOtp}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-transparent dark:border-slate-700/60 transition-colors"
                  >
                    Reset Simulator
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Console Footer */}
        <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-1.5">
            <UserCheck className="w-3.5 h-3.5 text-blue-500" />
            <span>Guaranteed Student Handover Protocol</span>
          </div>
          <Link
            href="/items"
            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center"
          >
            <span>Live Campus Board</span>
            <ArrowRight className="w-3 h-3 ml-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
