"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldAlert, CheckCircle, ArrowRight } from "lucide-react";
import { createClaim } from "@/lib/actions/claim.actions";
import { motion } from "framer-motion";

export default function ClaimButton({ item, currentUser }: { item: any, currentUser: any }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleClaim = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const rawItemUserId = (item.userId?._id || item.userId)?.toString();
      const currentUserId = currentUser._id?.toString();

      if (!rawItemUserId) {
        throw new Error("Item reporter information is missing");
      }

      if (rawItemUserId === currentUserId) {
        throw new Error("You cannot claim an item you reported yourself");
      }

      const claim = await createClaim({
        itemId: item._id,
        claimantId: item.type === 'FOUND' ? currentUserId : rawItemUserId,
        finderId: item.type === 'FOUND' ? rawItemUserId : currentUserId,
        type: item.type
      });

      if (!claim || !claim._id) {
        throw new Error("Failed to create claim record");
      }

      router.push(`/claims/${claim._id}`);
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to initiate claim workflow");
      setIsSubmitting(false);
    }
  };

  const isResolved = item.status === 'RESOLVED' || item.status === 'CLOSED';
  const buttonText = isResolved
    ? "Item Resolved / Returned"
    : item.type === 'FOUND'
    ? "I Think This Is Mine"
    : "I Found This Item";
  
  return (
    <div className="space-y-3">
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
          {errorMessage}
        </div>
      )}

      <motion.button 
        whileHover={{ scale: isResolved || isSubmitting ? 1 : 1.01 }}
        whileTap={{ scale: isResolved || isSubmitting ? 1 : 0.97 }}
        onClick={handleClaim}
        disabled={isSubmitting || isResolved}
        className={`w-full font-semibold py-3.5 px-4 rounded-xl flex justify-center items-center shadow-sm transition-all duration-200 cursor-pointer ${
          isResolved 
            ? "bg-gray-100 text-gray-500 cursor-not-allowed border" 
            : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50"
        }`}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            <span>Connecting to Claim & Chat...</span>
          </>
        ) : isResolved ? (
          <>
            <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
            <span>{buttonText}</span>
          </>
        ) : (
          <>
            <ShieldAlert className="w-5 h-5 mr-2" />
            <span>{buttonText}</span>
            <ArrowRight className="w-4 h-4 ml-2 opacity-80" />
          </>
        )}
      </motion.button>
      
      {item.status === 'CLAIM_PENDING' && !isResolved && (
        <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 text-center">
          A claim verification is currently in progress for this item. You can still reach out or view existing discussion.
        </div>
      )}

      {!isResolved && (
        <p className="text-xs text-center text-gray-500">
          This will open a secure claim workflow with private chat to verify details.
        </p>
      )}
    </div>
  );
}
