"use client";

import { useState } from "react";
import { Flag, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { createReport } from "@/lib/actions/report.actions";
import { motion, AnimatePresence } from "framer-motion";

export default function ReportItemModal({ itemId, itemName }: { itemId: string; itemName: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState<"SPAM" | "INAPPROPRIATE" | "FAKE_LISTING" | "HARASSMENT" | "OTHER">("FAKE_LISTING");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);
    try {
      await createReport({ itemId, reason, details });
      setSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
        setSubmitted(false);
      }, 2000);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit report");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => {
          setIsOpen(true);
          setErrorMessage(null);
        }}
        className="text-xs text-slate-500 dark:text-neutral-400 hover:text-red-600 dark:hover:text-rose-400 flex items-center transition-colors cursor-pointer py-1 px-2 rounded-md hover:bg-red-50 dark:hover:bg-rose-950/30"
      >
        <Flag className="w-3.5 h-3.5 mr-1" /> Report Listing
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-[#141416] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 dark:border-white/10 relative text-slate-900 dark:text-white"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-neutral-200 cursor-pointer p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {submitted ? (
                <div className="text-center py-8 space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Report Submitted</h3>
                  <p className="text-sm text-gray-600 dark:text-neutral-400">
                    Thank you for keeping our campus safe. Admins will review this listing.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                      <Flag className="w-5 h-5 text-red-600 mr-2" /> Report Listing
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1">Item: {itemName}</p>
                  </div>

                  {errorMessage && (
                    <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 rounded-xl text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-neutral-300 uppercase mb-1">Reason</label>
                    <select
                      value={reason}
                      onChange={(e) => setReason(e.target.value as any)}
                      className="w-full border border-gray-200 dark:border-white/10 rounded-xl p-2.5 text-sm bg-white dark:bg-[#18181c] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff7d0c]/30"
                    >
                      <option value="FAKE_LISTING">Fake or Fraudulent Listing</option>
                      <option value="SPAM">Spam or Advertisement</option>
                      <option value="INAPPROPRIATE">Inappropriate / Offensive Content</option>
                      <option value="HARASSMENT">Harassment or Abuse</option>
                      <option value="OTHER">Other Violation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-neutral-300 uppercase mb-1">Details (Optional)</label>
                    <textarea
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      rows={3}
                      placeholder="Provide any additional context or proof..."
                      className="w-full border border-gray-200 dark:border-white/10 rounded-xl p-2.5 text-sm bg-white dark:bg-[#18181c] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff7d0c]/30 placeholder:text-gray-400 dark:placeholder:text-neutral-500"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-2 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                      type="submit"
                      disabled={submitting}
                      className="px-5 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 disabled:opacity-50 flex items-center shadow-sm cursor-pointer"
                    >
                      {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : null}
                      Submit Report
                    </motion.button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
