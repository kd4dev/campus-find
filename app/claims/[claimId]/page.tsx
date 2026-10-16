export const dynamic = 'force-dynamic';
import { getClaimById } from "@/lib/actions/claim.actions";
import { getCurrentDbUser } from "@/lib/actions/user.actions";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, MessageSquare, ChevronRight } from "lucide-react";
import ClaimWorkflow from "@/components/claims/ClaimWorkflow";

export default async function ClaimDetails({ params }: { params: Promise<{ claimId: string }> }) {
  const resolvedParams = await params;
  const claim = await getClaimById(resolvedParams.claimId);
  if (!claim) notFound();

  const currentUser = await getCurrentDbUser();
  if (!currentUser) redirect("/sign-in");

  const claimantIdStr = (claim.claimantId?._id || claim.claimantId)?.toString();
  const finderIdStr = (claim.finderId?._id || claim.finderId)?.toString();
  const currentUserIdStr = currentUser._id?.toString();

  const isClaimant = currentUserIdStr === claimantIdStr;
  const isFinder = currentUserIdStr === finderIdStr;

  if (!isClaimant && !isFinder && currentUser.role !== 'ADMIN') {
    return <div className="p-8 text-center text-rose-500 dark:text-rose-400 font-medium">Unauthorized access to this claim.</div>;
  }

  const role = isClaimant ? 'CLAIMANT' : 'FINDER';
  const itemName = claim.itemId?.itemName || "Unknown Item";
  const itemId = claim.itemId?._id || claim.itemId;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/dashboard" className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white text-sm flex items-center mb-2 transition-colors">
          Dashboard <ChevronRight className="w-4 h-4 mx-1" /> Claims <ChevronRight className="w-4 h-4 mx-1" /> {itemName}
        </Link>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">Claim Workflow</h1>
        {itemId && (
          <p className="text-neutral-600 dark:text-neutral-400 mt-1 text-sm">
            Item: <Link href={`/items/${itemId}`} className="text-[#ff7d0c] dark:text-[#f79b4a] hover:underline font-medium">{itemName}</Link>
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-[#141416] rounded-2xl shadow-sm border border-neutral-200 dark:border-white/10 p-6 mb-6">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6 flex items-center">
              <ShieldCheck className="w-6 h-6 mr-2 text-[#ff7d0c] dark:text-[#f79b4a]" /> Current Status: 
              <span className="ml-2 px-3 py-1 bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-[#f79b4a] border border-orange-200 dark:border-orange-500/30 text-xs font-bold rounded-full">
                {claim.status}
              </span>
            </h2>
            
            <ClaimWorkflow claim={claim} role={role} />
          </div>
        </div>

        <div>
          <div className="bg-white dark:bg-[#141416] rounded-2xl shadow-sm border border-neutral-200 dark:border-white/10 p-6 mb-6">
            <h3 className="font-bold text-neutral-900 dark:text-white mb-4 border-b border-neutral-200 dark:border-white/10 pb-2">People Involved</h3>
            
            <div className="mb-4">
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1 font-semibold">CLAIMANT</p>
              <div className="flex items-center">
                {claim.claimantId?.avatar ? (
                  <img src={claim.claimantId.avatar} className="w-8 h-8 rounded-full mr-2 border border-neutral-200 dark:border-white/10 object-cover" alt="Claimant" />
                ) : (
                  <div className="w-8 h-8 bg-neutral-200 dark:bg-[#18181c] rounded-full mr-2" />
                )}
                <span className="text-neutral-900 dark:text-neutral-100 text-sm font-medium">{claim.claimantId?.name || "Claimant"} {isClaimant ? "(You)" : ""}</span>
              </div>
            </div>

            <div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1 font-semibold">FINDER</p>
              <div className="flex items-center">
                {claim.finderId?.avatar ? (
                  <img src={claim.finderId.avatar} className="w-8 h-8 rounded-full mr-2 border border-neutral-200 dark:border-white/10 object-cover" alt="Finder" />
                ) : (
                  <div className="w-8 h-8 bg-neutral-200 dark:bg-[#18181c] rounded-full mr-2" />
                )}
                <span className="text-neutral-900 dark:text-neutral-100 text-sm font-medium">{claim.finderId?.name || "Finder"} {isFinder ? "(You)" : ""}</span>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-white/10">
              <Link href={`/messages?claimId=${claim._id}`} className="w-full flex items-center justify-center bg-neutral-100 hover:bg-neutral-200 dark:bg-[#18181c] dark:hover:bg-[#202025] text-neutral-800 dark:text-neutral-100 border border-neutral-200 dark:border-white/10 py-2.5 rounded-lg transition-colors text-sm font-medium">
                <MessageSquare className="w-4 h-4 mr-2" /> Open Private Chat
              </Link>
            </div>
          </div>
          
          <div className="bg-orange-50/80 dark:bg-orange-950/20 rounded-2xl border border-orange-200 dark:border-orange-500/30 p-6">
            <h3 className="font-bold text-orange-950 dark:text-[#f79b4a] mb-2 text-sm">Safety Tips</h3>
            <ul className="text-xs text-orange-900/80 dark:text-neutral-300 space-y-2 list-disc pl-4 leading-relaxed">
              <li>Do not share personal phone numbers. Use the built-in encrypted chat.</li>
              <li>Always meet in a public, well-lit place on campus (e.g. Student Center).</li>
              <li>Verify the secure OTP correctly before physically handing over the item.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
