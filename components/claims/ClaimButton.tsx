"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldAlert, CheckCircle } from "lucide-react";
import { createClaim } from "@/lib/actions/claim.actions";

export default function ClaimButton({ item, currentUser }: { item: any, currentUser: any }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClaim = async () => {
    setIsSubmitting(true);
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
      alert(error.message || "Failed to initiate process");
      setIsSubmitting(false);
    }
  };

  const isResolved = item.status === 'RESOLVED' || item.status === 'CLOSED';
  const buttonText = isResolved
    ? "Item Resolved / Closed"
    : item.type === 'FOUND'
    ? "I Think This Is Mine"
    : "I Found This Item";
  
  return (
    <div className="space-y-3">
      <button 
        onClick={handleClaim}
        disabled={isSubmitting || isResolved}
        className={`w-full font-medium py-3 rounded-md flex justify-center items-center shadow-sm transition-colors ${
          isResolved 
            ? "bg-gray-100 text-gray-500 cursor-not-allowed border" 
            : "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
        }`}
      >
        {isSubmitting ? (
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
        ) : isResolved ? (
          <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
        ) : (
          <ShieldAlert className="w-5 h-5 mr-2" />
        )}
        {buttonText}
      </button>
      
      {item.status === 'CLAIM_PENDING' && !isResolved && (
        <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-md text-xs text-amber-800 text-center">
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
