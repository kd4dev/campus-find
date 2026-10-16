export const dynamic = 'force-dynamic';
import { getConversationById } from "@/lib/actions/message.actions";
import { getCurrentDbUser } from "@/lib/actions/user.actions";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Info } from "lucide-react";
import ChatWindow from "@/components/chat/ChatWindow";

export default async function ConversationPage({ params }: { params: Promise<{ conversationId: string }> }) {
  const user = await getCurrentDbUser();
  if (!user) redirect("/sign-in");

  const resolvedParams = await params;
  const conversation = await getConversationById(resolvedParams.conversationId);
  if (!conversation) notFound();

  const otherParticipant = conversation.participants.find((p: any) => p._id !== user._id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 h-[calc(100vh-4rem)] flex flex-col">
      <div className="bg-white dark:bg-[#141416] border border-neutral-200 dark:border-white/10 rounded-t-2xl p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center">
          <Link href="/messages" className="mr-3 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors" aria-label="Back to messages">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          {otherParticipant?.avatar ? (
            <img src={otherParticipant.avatar} alt={otherParticipant.name} className="w-10 h-10 rounded-full mr-3 border border-neutral-200 dark:border-white/10 object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full mr-3 bg-orange-100 dark:bg-orange-950/80 border border-orange-200 dark:border-orange-500/30 flex items-center justify-center text-[#ff7d0c] dark:text-[#f79b4a] font-bold">
              {otherParticipant?.name?.charAt(0)}
            </div>
          )}
          <div>
            <h2 className="font-bold text-neutral-900 dark:text-white text-sm sm:text-base">{otherParticipant?.name}</h2>
            <Link href={`/items/${conversation.itemId._id}`} className="text-xs text-[#ff7d0c] dark:text-[#f79b4a] hover:underline">
              Regarding: {conversation.itemId.itemName}
            </Link>
          </div>
        </div>
        {conversation.claimId && (
          <Link href={`/claims/${conversation.claimId}`} className="text-xs bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/40 dark:hover:bg-orange-900/60 text-orange-700 dark:text-[#f79b4a] border border-orange-200 dark:border-orange-500/30 px-3 py-1.5 rounded-lg font-semibold transition-colors">
            View Claim &rarr;
          </Link>
        )}
      </div>

      <div className="flex-1 bg-white dark:bg-[#141416] border-x border-b border-neutral-200 dark:border-white/10 rounded-b-2xl overflow-hidden flex flex-col relative">
        <div className="bg-amber-50/90 dark:bg-amber-950/20 p-2.5 text-center text-xs text-amber-800 dark:text-amber-300 border-b border-amber-200 dark:border-amber-500/30 flex justify-center items-center">
          <Info className="w-3.5 h-3.5 mr-1.5 text-amber-600 dark:text-amber-400 shrink-0" /> 
          <span>Protect your privacy. Meet in designated campus public areas and verify OTP.</span>
        </div>
        
        <ChatWindow conversationId={conversation._id} currentUserId={user._id} />
      </div>
    </div>
  );
}
