"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateClaimStatus } from "@/lib/actions/claim.actions";
import { generateOTP, verifyOTP, getClaimantOTP } from "@/lib/actions/handover.actions";
import { Loader2, UploadCloud, CheckCircle2, XCircle, KeyRound, ShieldAlert, Sparkles, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ClaimWorkflow({ claim, role }: { claim: any, role: 'CLAIMANT' | 'FINDER' }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<string>(claim.status);
  
  const [proofDescription, setProofDescription] = useState("");
  const [proofFile, setProofFile] = useState<{url: string, publicId: string} | null>(null);
  
  const [otp, setOtp] = useState("");
  const [claimantOtp, setClaimantOtp] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Sync when prop updates
  useEffect(() => {
    setCurrentStatus(claim.status);
  }, [claim.status]);

  useEffect(() => {
    if ((currentStatus === 'HANDOVER_PENDING' || claim.status === 'HANDOVER_PENDING') && role === 'CLAIMANT') {
      getClaimantOTP(claim._id).then(fetchedOtp => {
        if (fetchedOtp) setClaimantOtp(fetchedOtp);
      });
    }
  }, [currentStatus, claim.status, role, claim._id]);

  const handleUploadProof = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setLoading(true);
    setFeedback(null);
    try {
      const formData = new FormData();
      formData.append("file", e.target.files[0]);
      
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      
      if (data.secure_url) {
        setProofFile({ url: data.secure_url, publicId: data.public_id });
        setFeedback({ type: 'success', message: 'Proof file uploaded successfully.' });
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || "Failed to upload file. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const submitProof = async () => {
    if (!proofDescription.trim()) {
      setFeedback({ type: 'error', message: "Please provide a description of your ownership proof." });
      return;
    }
    setLoading(true);
    setFeedback(null);

    // Optimistic UI update
    setCurrentStatus("PROOF_SUBMITTED");

    try {
      await updateClaimStatus(claim._id, "PROOF_SUBMITTED", {
        description: proofDescription,
        files: proofFile ? [proofFile] : []
      });
      setFeedback({ type: 'success', message: "Proof submitted! Waiting for finder review." });
      router.refresh();
    } catch (err: any) {
      setCurrentStatus(claim.status); // rollback on error
      setFeedback({ type: 'error', message: err.message || "Failed to submit proof." });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    setFeedback(null);

    // Optimistic UI update
    const previousStatus = currentStatus;
    setCurrentStatus(newStatus);

    try {
      await updateClaimStatus(claim._id, newStatus);
      setFeedback({
        type: 'success',
        message: newStatus === "APPROVED" ? "Proof approved! You can now initiate OTP handover." : "Proof rejected."
      });
      router.refresh();
    } catch (err: any) {
      setCurrentStatus(previousStatus);
      setFeedback({ type: 'error', message: err.message || "Failed to update status." });
    } finally {
      setLoading(false);
    }
  };

  const handleStartHandover = async () => {
    setLoading(true);
    setFeedback(null);

    // Optimistic UI update
    setCurrentStatus("HANDOVER_PENDING");

    try {
      await generateOTP(claim._id);
      setFeedback({ type: 'success', message: "OTP generated! Ask claimant to show their 6-digit code." });
      router.refresh();
    } catch (err: any) {
      setCurrentStatus(claim.status);
      setFeedback({ type: 'error', message: err.message || "Failed to start handover." });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setFeedback({ type: 'error', message: "OTP must be exactly 6 digits." });
      return;
    }
    setLoading(true);
    setFeedback(null);

    try {
      await verifyOTP(claim._id, otp);
      setCurrentStatus("COMPLETED");
      setFeedback({ type: 'success', message: "Verification successful! The item is officially returned and resolved." });
      router.refresh();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || "Invalid or expired OTP. Please check with claimant." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Feedback Banner */}
      <AnimatePresence mode="wait">
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className={`p-3.5 rounded-xl text-sm flex items-center gap-2.5 ${
              feedback.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                : 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-300'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <p className="flex-1 font-medium text-xs md:text-sm">{feedback.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step 1: Proof */}
      <div className={`p-6 border rounded-2xl transition-all duration-300 ${
        currentStatus === 'PENDING' || currentStatus === 'CHAT_VERIFICATION' 
          ? 'border-[#ff7d0c]/70 bg-orange-50/20 dark:bg-orange-950/20 dark:border-[#ff7d0c]/70 shadow-sm' 
          : 'bg-white dark:bg-[#18181c] border-gray-200 dark:border-white/10'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-base md:text-lg text-gray-900 dark:text-white flex items-center">
            <span className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-950/80 text-[#ff7d0c] dark:text-[#f79b4a] border border-orange-200 dark:border-orange-500/30 text-xs font-bold flex items-center justify-center mr-2.5">1</span>
            Ownership Proof
          </h3>
          {currentStatus !== 'PENDING' && currentStatus !== 'CHAT_VERIFICATION' && (
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800/60">
              Submitted
            </span>
          )}
        </div>

        {currentStatus === 'PENDING' || currentStatus === 'CHAT_VERIFICATION' ? (
          role === 'CLAIMANT' ? (
            <div className="space-y-4">
              <p className="text-xs md:text-sm text-gray-600 dark:text-neutral-300">
                Provide details or upload a photo of a receipt, invoice, or identifying mark that proves this item belongs to you.
              </p>
              <textarea 
                value={proofDescription} 
                onChange={e => setProofDescription(e.target.value)} 
                className="w-full border border-gray-200 dark:border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff7d0c]/30 focus:border-[#ff7d0c] bg-white dark:bg-[#141416] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-neutral-500" 
                rows={3}
                placeholder="e.g. Serial number is SN-90218, has a small scratch near the power button..." 
              />
              
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 bg-white dark:bg-[#141416] border border-gray-200 dark:border-white/10 px-4 py-2.5 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 text-xs md:text-sm font-medium transition-colors shadow-sm text-gray-700 dark:text-neutral-300">
                  <UploadCloud className="w-4 h-4 text-gray-500 dark:text-neutral-400" /> Upload Photo / Receipt
                  <input type="file" className="hidden" onChange={handleUploadProof} />
                </label>
                {proofFile && (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-1" /> File ready
                  </span>
                )}
              </div>
              
              <motion.button 
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.97 }}
                onClick={submitProof} 
                disabled={loading} 
                className="btn-asym bg-[#FF7D0C] text-white px-6 py-2.5 text-xs md:text-sm font-semibold hover:bg-[#ea6c00] disabled:opacity-50 shadow-sm cursor-pointer"
              >
                {loading ? <span className="flex items-center"><Loader2 className="w-4 h-4 animate-spin mr-1.5" /> Submitting...</span> : 'Submit Proof for Finder Review'}
              </motion.button>
            </div>
          ) : (
            <p className="text-xs md:text-sm text-gray-500 dark:text-neutral-400">
              Waiting for claimant to submit their ownership proof or invoice details.
            </p>
          )
        ) : (
          <div className="text-xs md:text-sm space-y-2">
            <p className="font-semibold text-gray-800 dark:text-slate-200">Submitted Proof Details:</p>
            <p className="text-gray-600 dark:text-neutral-300 bg-gray-50 dark:bg-[#141416] p-3 rounded-xl border border-gray-100 dark:border-white/10 italic">
              "{claim.proofDescription || proofDescription}"
            </p>
            {(claim.proofFiles?.length > 0 || proofFile) && (
              <a 
                href={claim.proofFiles?.[0]?.url || proofFile?.url} 
                target="_blank" 
                rel="noreferrer" 
                className="text-[#ff7d0c] dark:text-[#f79b4a] hover:underline flex items-center font-medium mt-1"
              >
                View Attached Proof Document ↗
              </a>
            )}
          </div>
        )}
      </div>

      {/* Step 2: Review */}
      <div className={`p-6 border rounded-2xl transition-all duration-300 ${
        currentStatus === 'PROOF_SUBMITTED' 
          ? 'border-[#ff7d0c]/70 bg-orange-50/20 dark:bg-orange-950/20 dark:border-[#ff7d0c]/70 shadow-sm' 
          : 'bg-white dark:bg-[#18181c] border-gray-200 dark:border-white/10'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-base md:text-lg text-gray-900 dark:text-white flex items-center">
            <span className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-950/80 text-[#ff7d0c] dark:text-[#f79b4a] border border-orange-200 dark:border-orange-500/30 text-xs font-bold flex items-center justify-center mr-2.5">2</span>
            Finder Review
          </h3>
          {['APPROVED', 'HANDOVER_PENDING', 'COMPLETED'].includes(currentStatus) && (
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800/60">
              Approved
            </span>
          )}
          {currentStatus === 'REJECTED' && (
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-semibold border border-rose-200 dark:border-rose-800/60">
              Rejected
            </span>
          )}
        </div>

        {currentStatus === 'PROOF_SUBMITTED' ? (
          role === 'FINDER' ? (
            <div className="space-y-4">
              <p className="text-xs md:text-sm text-gray-600 dark:text-neutral-300">
                Check the proof submitted above or chat with the claimant. If satisfied, click Approve to enable OTP handover.
              </p>
              <div className="flex gap-3">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleStatusChange("APPROVED")} 
                  disabled={loading} 
                  className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-xs md:text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50 shadow-sm cursor-pointer"
                >
                  Approve Proof
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleStatusChange("REJECTED")} 
                  disabled={loading} 
                  className="bg-rose-600 text-white px-5 py-2.5 rounded-xl text-xs md:text-sm font-semibold hover:bg-rose-700 disabled:opacity-50 shadow-sm cursor-pointer"
                >
                  Reject Proof
                </motion.button>
              </div>
            </div>
          ) : (
            <p className="text-xs md:text-sm text-gray-500 dark:text-neutral-400">
              Waiting for finder to review your proof. You can also send messages in private chat.
            </p>
          )
        ) : (
          <p className="text-xs md:text-sm text-gray-600 dark:text-neutral-300">
            {['APPROVED', 'HANDOVER_PENDING', 'COMPLETED'].includes(currentStatus) ? (
              <span className="text-emerald-700 dark:text-emerald-400 font-medium">✓ Proof has been verified and approved by the finder.</span>
            ) : currentStatus === 'REJECTED' ? (
              <span className="text-rose-600 dark:text-rose-400 font-medium">Proof was rejected.</span>
            ) : (
              'Waiting for proof submission...'
            )}
          </p>
        )}
      </div>

      {/* Step 3: Handover */}
      <div className={`p-6 border rounded-2xl transition-all duration-300 ${
        ['APPROVED', 'HANDOVER_PENDING', 'COMPLETED'].includes(currentStatus) 
          ? 'border-[#ff7d0c]/70 bg-orange-50/20 dark:bg-orange-950/20 dark:border-[#ff7d0c]/70 shadow-sm' 
          : 'bg-white dark:bg-[#18181c] border-gray-200 dark:border-white/10'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-base md:text-lg text-gray-900 dark:text-white flex items-center">
            <span className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-950/80 text-[#ff7d0c] dark:text-[#f79b4a] border border-orange-200 dark:border-orange-500/30 text-xs font-bold flex items-center justify-center mr-2.5">3</span>
            Physical Handover & OTP
          </h3>
          {currentStatus === 'COMPLETED' && (
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800/60">
              Completed
            </span>
          )}
        </div>
        
        {currentStatus === 'APPROVED' ? (
          role === 'FINDER' ? (
            <div className="space-y-4">
              <p className="text-xs md:text-sm text-gray-600 dark:text-neutral-300">
                Coordinate a meeting spot in public. When you are meeting the claimant, click below to generate their 6-digit verification code.
              </p>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleStartHandover} 
                disabled={loading} 
                className="btn-asym bg-[#FF7D0C] hover:bg-[#ea6c00] text-white px-6 py-3 text-xs md:text-sm font-semibold disabled:opacity-50 shadow-sm cursor-pointer"
              >
                {loading ? 'Starting...' : 'Start OTP Handover'}
              </motion.button>
            </div>
          ) : (
            <p className="text-xs md:text-sm text-gray-600 dark:text-neutral-300">
              Proof approved! Coordinate a campus meeting spot in chat. The finder will tap "Start OTP Handover" when meeting in person.
            </p>
          )
        ) : currentStatus === 'HANDOVER_PENDING' ? (
          role === 'FINDER' ? (
            <div className="space-y-4">
              <div className="bg-white dark:bg-[#141416] border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl p-6 text-center">
                <KeyRound className="w-8 h-8 text-[#ff7d0c] dark:text-[#f79b4a] mx-auto mb-2" />
                <p className="text-xs md:text-sm text-gray-600 dark:text-neutral-300 mb-3">
                  Ask the claimant to read out or show the 6-digit OTP displayed on their screen:
                </p>
                <input 
                  type="text" 
                  maxLength={6} 
                  value={otp} 
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} 
                  className="w-48 text-center tracking-widest text-3xl font-mono font-black border-2 border-[#ff7d0c]/50 dark:border-[#f79b4a]/60 rounded-xl p-3 mx-auto block bg-orange-50/30 dark:bg-orange-950/20 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff7d0c]/40" 
                  placeholder="------" 
                />
              </div>
              <motion.button 
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleVerifyOtp} 
                disabled={loading || otp.length !== 6} 
                className="w-full btn-asym bg-[#FF7D0C] hover:bg-[#ea6c00] text-white px-6 py-3.5 text-sm font-bold disabled:opacity-50 shadow-md cursor-pointer"
              >
                {loading ? <span className="flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin mr-2" /> Verifying OTP...</span> : 'Verify OTP & Complete Return'}
              </motion.button>
            </div>
          ) : (
            <div className="text-center bg-white dark:bg-[#141416] border border-orange-100 dark:border-white/10 rounded-2xl p-8 shadow-sm">
              <ShieldAlert className="w-12 h-12 text-[#ff7d0c] dark:text-[#f79b4a] mx-auto mb-3" />
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-neutral-400 mb-1">Your One-Time Handover Code</p>
              <div className="bg-orange-50/60 dark:bg-orange-950/30 py-4 px-6 rounded-2xl mb-3 border border-orange-200 dark:border-orange-500/30 inline-block shadow-inner">
                <span className="text-4xl font-mono font-black tracking-widest text-orange-950 dark:text-[#f79b4a]">
                  {claimantOtp || (
                    <span className="flex items-center text-sm font-medium text-[#ff7d0c] dark:text-[#f79b4a]">
                      <Loader2 className="w-4 h-4 animate-spin mr-2" /> Fetching OTP...
                    </span>
                  )}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-neutral-400 max-w-sm mx-auto">
                Show this 6-digit code to the finder in person once they show you the item. Handover is recorded permanently upon verification.
              </p>
            </div>
          )
        ) : (
          <div className="text-xs md:text-sm">
            {currentStatus === 'COMPLETED' ? (
              <div className="flex items-center text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/60 font-semibold">
                <CheckCircle2 className="w-5 h-5 mr-2 shrink-0 text-emerald-600" />
                <span>Handover Completed! This item has been returned and marked RESOLVED.</span>
              </div>
            ) : (
              <span className="text-gray-500 dark:text-neutral-400">Handover will unlock after ownership proof is verified.</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
