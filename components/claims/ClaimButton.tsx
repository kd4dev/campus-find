"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MessageSquare, ShieldAlert } from "lucide-react";
import { createClaim } from "@/lib/actions/claim.actions";

export default function ClaimButton({ item, currentUser }: { item: any, currentUser: any }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClaim = async () => {
    setIsSubmitting(true);
    try {
      const claim = await createClaim({
        itemId: item._id,
        claimantId: item.type === 'FOUND' ? currentUser._id : item.userId._id, // If item is FOUND, current user is claimant. If LOST, current user is finder.
        finderId: item.type === 'FOUND' ? item.userId._id : currentUser._id,
        type: item.type
      });
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
        className="w-full bg-blue-600 text-white font-medium py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 flex justify-center items-center shadow-sm"
      >
        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <ShieldAlert className="w-5 h-5 mr-2" />}
        {item.status !== 'ACTIVE' ? `Item is ${item.status}` : buttonText}
      </button>
      
      {/* 
        Optional simple message button if we don't want to start a full claim right away,
        but for the flow requested, creating a claim initiates the conversation.
      */}
      <p className="text-xs text-center text-gray-500">
        This will open a secure, private chat where you can verify details.
      </p>
    </div>
  );
}
