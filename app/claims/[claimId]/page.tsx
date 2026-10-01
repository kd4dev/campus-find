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

  const isClaimant = currentUser._id === claim.claimantId._id;
  const isFinder = currentUser._id === claim.finderId._id;

  if (!isClaimant && !isFinder && currentUser.role !== 'ADMIN') {
    return <div className="p-8 text-center text-red-500">Unauthorized access to this claim.</div>;
  }

  const role = isClaimant ? 'CLAIMANT' : 'FINDER';

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/dashboard" className="text-gray-500 hover:text-gray-900 text-sm flex items-center mb-2">
          Dashboard <ChevronRight className="w-4 h-4 mx-1" /> Claims <ChevronRight className="w-4 h-4 mx-1" /> {claim.itemId.itemName}
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Claim Workflow</h1>
        <p className="text-gray-600 mt-1">Item: <Link href={`/items/${claim.itemId._id}`} className="text-blue-600 hover:underline">{claim.itemId.itemName}</Link></p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <ShieldCheck className="w-6 h-6 mr-2 text-blue-600" /> Current Status: 
              <span className="ml-2 px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">{claim.status}</span>
            </h2>
            
            <ClaimWorkflow claim={claim} role={role} />
          </div>
        </div>

        <div>
          <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-4 border-b pb-2">People Involved</h3>
            
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-1">CLAIMANT</p>
              <div className="flex items-center">
                {claim.claimantId.avatar ? (
                  <img src={claim.claimantId.avatar} className="w-8 h-8 rounded-full mr-2" />
                ) : (
                  <div className="w-8 h-8 bg-gray-200 rounded-full mr-2" />
                )}
                <span className="text-gray-900">{claim.claimantId.name} {isClaimant ? "(You)" : ""}</span>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">FINDER</p>
              <div className="flex items-center">
                {claim.finderId.avatar ? (
                  <img src={claim.finderId.avatar} className="w-8 h-8 rounded-full mr-2" />
                ) : (
                  <div className="w-8 h-8 bg-gray-200 rounded-full mr-2" />
                )}
                <span className="text-gray-900">{claim.finderId.name} {isFinder ? "(You)" : ""}</span>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t">
              <Link href={`/messages?claimId=${claim._id}`} className="w-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-md transition-colors text-sm font-medium">
                <MessageSquare className="w-4 h-4 mr-2" /> Open Private Chat
              </Link>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6">
            <h3 className="font-bold text-blue-800 mb-2">Safety Tips</h3>
            <ul className="text-sm text-blue-700 space-y-2 list-disc pl-4">
              <li>Do not share personal phone numbers. Use the built-in chat.</li>
              <li>Always meet in a public, well-lit place on campus.</li>
              <li>Verify the OTP correctly before physically handing over the item.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
