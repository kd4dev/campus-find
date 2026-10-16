"use client";

import { useState } from "react";
import { Flag, X, Loader2, CheckCircle2 } from "lucide-react";
import { createReport } from "@/lib/actions/report.actions";

export default function ReportItemModal({ itemId, itemName }: { itemId: string; itemName: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState<"SPAM" | "INAPPROPRIATE" | "FAKE_LISTING" | "HARASSMENT" | "OTHER">("FAKE_LISTING");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createReport({ itemId, reason, details });
      setSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
        setSubmitted(false);
      }, 2000);
    } catch (err: any) {
      alert(err.message || "Failed to submit report");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-xs text-gray-500 hover:text-red-600 flex items-center transition-colors cursor-pointer"
      >
        <Flag className="w-3.5 h-3.5 mr-1" /> Report Listing
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-900">Report Submitted</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Thank you for keeping our campus safe. Admins will review this listing.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center">
                    <Flag className="w-5 h-5 text-red-600 mr-2" /> Report Listing
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Item: {itemName}</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Reason</label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value as any)}
                    className="w-full border rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="FAKE_LISTING">Fake or Fraudulent Listing</option>
                    <option value="SPAM">Spam or Advertisement</option>
                    <option value="INAPPROPRIATE">Inappropriate / Offensive Content</option>
                    <option value="HARASSMENT">Harassment or Abuse</option>
                    <option value="OTHER">Other Violation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Details (Optional)</label>
                  <textarea
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    rows={3}
                    placeholder="Provide any additional context or proof..."
                    className="w-full border rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 border rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 flex items-center"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : null}
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
