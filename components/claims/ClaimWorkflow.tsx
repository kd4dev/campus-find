"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateClaimStatus } from "@/lib/actions/claim.actions";
import { generateOTP, verifyOTP, getClaimantOTP } from "@/lib/actions/handover.actions";
import { Loader2, UploadCloud, CheckCircle, XCircle, KeyRound, ShieldAlert } from "lucide-react";

export default function ClaimWorkflow({ claim, role }: { claim: any, role: 'CLAIMANT' | 'FINDER' }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [proofDescription, setProofDescription] = useState("");
  const [proofFile, setProofFile] = useState<{url: string, publicId: string} | null>(null);
  
  const [otp, setOtp] = useState("");
  const [claimantOtp, setClaimantOtp] = useState<string | null>(null);

  useEffect(() => {
    if (claim.status === 'HANDOVER_PENDING' && role === 'CLAIMANT') {
      getClaimantOTP(claim._id).then(otp => {
        if (otp) setClaimantOtp(otp);
      });
    }
  }, [claim.status, role, claim._id]);

  const handleUploadProof = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", e.target.files[0]);
      
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      
      if (data.secure_url) {
        setProofFile({ url: data.secure_url, publicId: data.public_id });
      }
    } catch (err) {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const submitProof = async () => {
    if (!proofDescription) return alert("Please add a description");
    setLoading(true);
    try {
      await updateClaimStatus(claim._id, "PROOF_SUBMITTED", {
        description: proofDescription,
        files: proofFile ? [proofFile] : []
      });
      router.refresh();
    } catch (err) {
      alert("Failed to submit proof");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    try {
      await updateClaimStatus(claim._id, newStatus);
      router.refresh();
    } catch (err) {
      alert("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const handleStartHandover = async () => {
    setLoading(true);
    try {
      await generateOTP(claim._id);
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Failed to start handover");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return alert("OTP must be 6 digits");
    setLoading(true);
    try {
      await verifyOTP(claim._id, otp);
      alert("Verification successful! Item marked as returned.");
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Step 1: Proof */}
      <div className={`p-5 border rounded-xl ${claim.status === 'PENDING' || claim.status === 'CHAT_VERIFICATION' ? 'border-blue-500 bg-blue-50/30' : 'bg-gray-50 opacity-60'}`}>
        <h3 className="font-bold text-lg mb-2">1. Ownership Proof</h3>
        {claim.status === 'PENDING' || claim.status === 'CHAT_VERIFICATION' ? (
          role === 'CLAIMANT' ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Provide details or upload a photo of a receipt, ID card, or specific distinguishing mark that proves this is yours.</p>
              <textarea value={proofDescription} onChange={e => setProofDescription(e.target.value)} className="w-full border rounded p-2 text-sm" placeholder="Describe your proof..." />
              
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 bg-white border px-4 py-2 rounded cursor-pointer hover:bg-gray-50 text-sm">
                  <UploadCloud className="w-4 h-4" /> Upload File
                  <input type="file" className="hidden" onChange={handleUploadProof} />
                </label>
                {proofFile && <span className="text-sm text-green-600 flex items-center"><CheckCircle className="w-4 h-4 mr-1" /> File ready</span>}
              </div>
              
              <button onClick={submitProof} disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
                {loading ? 'Submitting...' : 'Submit Proof'}
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-600">Waiting for claimant to submit ownership proof.</p>
          )
        ) : (
          <div className="text-sm">
            <p className="font-medium text-gray-800 mb-1">Proof Submitted:</p>
            <p className="text-gray-600 italic mb-2">"{claim.proofDescription}"</p>
            {claim.proofFiles?.length > 0 && (
              <a href={claim.proofFiles[0].url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center">
                View Attached Proof
              </a>
            )}
          </div>
        )}
      </div>

      {/* Step 2: Review */}
      <div className={`p-5 border rounded-xl ${claim.status === 'PROOF_SUBMITTED' ? 'border-blue-500 bg-blue-50/30' : 'bg-gray-50 opacity-60'}`}>
        <h3 className="font-bold text-lg mb-2">2. Finder Review</h3>
        {claim.status === 'PROOF_SUBMITTED' ? (
          role === 'FINDER' ? (
            <div>
              <p className="text-sm text-gray-600 mb-4">Review the proof submitted by the claimant.</p>
              <div className="flex gap-3">
                <button onClick={() => handleStatusChange("APPROVED")} disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-green-700">Approve</button>
                <button onClick={() => handleStatusChange("REJECTED")} disabled={loading} className="bg-red-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-red-700">Reject</button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-600">Waiting for finder to review your proof.</p>
          )
        ) : (
          <p className="text-sm text-gray-600">
            {claim.status === 'APPROVED' || claim.status === 'HANDOVER_PENDING' || claim.status === 'COMPLETED' ? 'Proof was approved.' : claim.status === 'REJECTED' ? 'Proof was rejected.' : 'Pending...'}
          </p>
        )}
      </div>

      {/* Step 3: Handover */}
      <div className={`p-5 border rounded-xl ${(claim.status === 'APPROVED' || claim.status === 'HANDOVER_PENDING') ? 'border-blue-500 bg-blue-50/30' : 'bg-gray-50 opacity-60'}`}>
        <h3 className="font-bold text-lg mb-2">3. Physical Handover</h3>
        
        {claim.status === 'APPROVED' ? (
          role === 'FINDER' ? (
            <div>
              <p className="text-sm text-gray-600 mb-4">Meet the claimant to return the item. Click below to generate an OTP for them.</p>
              <button onClick={handleStartHandover} disabled={loading} className="bg-gray-900 text-white px-6 py-2 rounded text-sm font-medium">Start OTP Handover</button>
            </div>
          ) : (
            <p className="text-sm text-gray-600">Proof approved! Coordinate a physical meeting. The finder will generate an OTP when you meet.</p>
          )
        ) : claim.status === 'HANDOVER_PENDING' ? (
          role === 'FINDER' ? (
            <div>
              <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4">
                <p className="text-sm text-gray-500 mb-2">Ask the claimant for the 6-digit OTP.</p>
                <input type="text" maxLength={6} value={otp} onChange={e => setOtp(e.target.value)} className="w-48 text-center tracking-widest text-2xl font-bold border rounded-md p-3 mx-auto block" placeholder="------" />
              </div>
              <button onClick={handleVerifyOtp} disabled={loading} className="w-full bg-blue-600 text-white px-6 py-3 rounded text-sm font-bold">Verify & Complete</button>
            </div>
          ) : (
            <div className="text-center bg-white border rounded-lg p-8">
              <ShieldAlert className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <p className="text-sm text-gray-500 mb-2">Your secure Handover OTP:</p>
              <div className="bg-gray-100 py-3 rounded-md mb-2">
                <span className="text-3xl font-mono font-bold tracking-widest text-gray-900">
                  {claimantOtp || "LOADING..."}
                </span>
              </div>
              <p className="text-xs text-gray-400">Provide this code to the finder in person.</p>
            </div>
          )
        ) : (
          <p className="text-sm text-gray-600">
            {claim.status === 'COMPLETED' ? <span className="text-green-600 font-bold">Handover Completed</span> : 'Pending...'}
          </p>
        )}
      </div>
    </div>
  );
}
