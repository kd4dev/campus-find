"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldAlert } from "lucide-react";
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

  const buttonText = item.type === 'FOUND' ? "I Think This Is Mine" : "I Found This Item";
  
  return (
    <div className="space-y-3">
      <button 
        onClick={handleClaim}
        disabled={isSubmitting || item.status !== 'ACTIVE'}
        className="w-full bg-blue-600 text-white font-medium py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 flex justify-center items-center shadow-sm cursor-pointer"
      >
        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <ShieldAlert className="w-5 h-5 mr-2" />}
        {item.status !== 'ACTIVE' ? `Item is ${item.status}` : buttonText}
      </button>
      
      <p className="text-xs text-center text-gray-500">
        This will open a secure claim workflow with private chat to verify details.
      </p>
    </div>
  );
}
