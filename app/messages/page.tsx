export const dynamic = 'force-dynamic';
import { getUserConversations, getConversationByClaimId } from "@/lib/actions/message.actions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentDbUser } from "@/lib/actions/user.actions";
import { MessageSquare, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default async function MessagesList({ searchParams }: { searchParams: Promise<{ claimId?: string }> }) {
  const user = await getCurrentDbUser();
  if (!user) redirect("/sign-in");

  const resolvedParams = await searchParams;

  // If redirected from a claim
  if (resolvedParams.claimId) {
    const conv = await getConversationByClaimId(resolvedParams.claimId);
    if (conv) {
      redirect(`/messages/${conv._id}`);
    }
  }

  const conversations = await getUserConversations();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Messages</h1>
      
      {conversations.length === 0 ? (
        <div className="text-center py-16 bg-white border rounded-xl">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No messages yet</h3>
          <p className="text-gray-500 mt-1">When you claim an item or someone claims yours, chats will appear here.</p>
        </div>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden divide-y">
          {conversations.map((conv: any) => {
            const otherParticipant = conv.participants.find((p: any) => p._id !== user._id);
            return (
              <Link href={`/messages/${conv._id}`} key={conv._id} className="block hover:bg-gray-50 transition-colors p-4">
                <div className="flex items-start">
                  {otherParticipant?.avatar ? (
                    <img src={otherParticipant.avatar} alt={otherParticipant.name} className="w-12 h-12 rounded-full mr-4 border" />
                  ) : (
                    <div className="w-12 h-12 rounded-full mr-4 bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      {otherParticipant?.name?.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-sm font-bold text-gray-900 truncate">{otherParticipant?.name}</h3>
                      {conv.lastMessageAt && (
                        <span className="text-xs text-gray-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatDistanceToNow(new Date(conv.lastMessageAt), { addSuffix: true })}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-blue-600 mb-1 line-clamp-1 flex items-center">
                      <span className="bg-blue-100 px-2 py-0.5 rounded mr-2">Item</span> {conv.itemId?.itemName}
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-1">
                      {conv.lastMessage || "No messages yet. Say hi!"}
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  );
}
