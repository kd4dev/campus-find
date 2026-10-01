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
      <div className="bg-white border rounded-t-xl p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center">
          <Link href="/messages" className="mr-4 text-gray-500 hover:text-gray-900">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          {otherParticipant?.avatar ? (
            <img src={otherParticipant.avatar} alt={otherParticipant.name} className="w-10 h-10 rounded-full mr-3 border" />
          ) : (
            <div className="w-10 h-10 rounded-full mr-3 bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              {otherParticipant?.name?.charAt(0)}
            </div>
          )}
          <div>
            <h2 className="font-bold text-gray-900">{otherParticipant?.name}</h2>
            <Link href={`/items/${conversation.itemId._id}`} className="text-xs text-blue-600 hover:underline">
              Regarding: {conversation.itemId.itemName}
            </Link>
          </div>
        </div>
        {conversation.claimId && (
          <Link href={`/claims/${conversation.claimId}`} className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-md hover:bg-blue-100 font-medium">
            View Claim
          </Link>
        )}
      </div>

      <div className="flex-1 bg-white border-x border-b rounded-b-xl overflow-hidden flex flex-col relative">
        <div className="bg-orange-50 p-2 text-center text-xs text-orange-800 border-b flex justify-center items-center">
          <Info className="w-3.5 h-3.5 mr-1" /> Protect your privacy. Do not share phone numbers or exact dorm rooms.
        </div>
        
        <ChatWindow conversationId={conversation._id} currentUserId={user._id} />
      </div>
    </div>
  );
}
