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
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-t-2xl p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center">
          <Link href="/messages" className="mr-3 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors" aria-label="Back to messages">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          {otherParticipant?.avatar ? (
            <img src={otherParticipant.avatar} alt={otherParticipant.name} className="w-10 h-10 rounded-full mr-3 border border-slate-200 dark:border-slate-700 object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full mr-3 bg-blue-100 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold">
              {otherParticipant?.name?.charAt(0)}
            </div>
          )}
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">{otherParticipant?.name}</h2>
            <Link href={`/items/${conversation.itemId._id}`} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
              Regarding: {conversation.itemId.itemName}
            </Link>
          </div>
        </div>
        {conversation.claimId && (
          <Link href={`/claims/${conversation.claimId}`} className="text-xs bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50 px-3 py-1.5 rounded-lg font-semibold transition-colors">
            View Claim &rarr;
          </Link>
        )}
      </div>

      <div className="flex-1 bg-white dark:bg-slate-900 border-x border-b border-slate-200 dark:border-slate-800 rounded-b-2xl overflow-hidden flex flex-col relative">
        <div className="bg-amber-50/90 dark:bg-amber-950/40 p-2.5 text-center text-xs text-amber-800 dark:text-amber-200 border-b border-amber-200 dark:border-amber-900/50 flex justify-center items-center">
          <Info className="w-3.5 h-3.5 mr-1.5 text-amber-600 dark:text-amber-400 shrink-0" /> 
          <span>Protect your privacy. Meet in designated campus public areas and verify OTP.</span>
        </div>
        
        <ChatWindow conversationId={conversation._id} currentUserId={user._id} />
      </div>
    </div>
  );
}
