export const dynamic = 'force-dynamic';
import { getCurrentDbUser } from "@/lib/actions/user.actions";
import { Claim } from "@/lib/models/Claim";
import connectToDatabase from "@/lib/mongodb";
import { redirect } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { ShieldCheck } from "lucide-react";

export default async function MyClaims() {
  const user = await getCurrentDbUser();
  if (!user) redirect("/sign-in");

  await connectToDatabase();
  const claims = await Claim.find({
    $or: [{ claimantId: user._id }, { finderId: user._id }]
  }).populate("itemId", "itemName images type").sort({ updatedAt: -1 });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-slate-900 dark:text-white tracking-tight">My Claims</h1>

      {claims.length === 0 ? (
        <div className="bg-white dark:bg-[#141416] rounded-2xl border border-slate-200 dark:border-white/10 p-12 text-center flex flex-col items-center">
          <ShieldCheck className="w-12 h-12 text-slate-300 dark:text-neutral-600 mb-4" />
          <p className="text-slate-500 dark:text-neutral-400 font-medium">You have no active claims.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {claims.map((claim: any) => {
            const isClaimant = claim.claimantId.toString() === user._id.toString();
            const role = isClaimant ? 'Claimant' : 'Finder';
            
            return (
              <div key={claim._id} className="bg-white dark:bg-[#141416] rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm p-6 flex flex-col hover:border-[#ff7d0c]/50 dark:hover:border-[#ff7d0c]/50 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                    isClaimant 
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 dark:border dark:border-purple-800/60' 
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 dark:border dark:border-amber-800/60'
                  }`}>
                    {role.toUpperCase()}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-neutral-400">
                    {format(new Date(claim.updatedAt), 'MMM d, yyyy')}
                  </span>
                </div>
                
                <h3 className="font-bold text-lg mb-1 text-slate-900 dark:text-white">{claim.itemId?.itemName || 'Unknown Item'}</h3>
                
                <div className="mb-6 text-sm text-slate-600 dark:text-neutral-300 flex-1">
                  <p className="mb-1"><span className="font-medium text-slate-700 dark:text-neutral-200">Status:</span> {claim.status}</p>
                </div>
                
                <Link href={`/claims/${claim._id}`} className="mt-auto block w-full text-center bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/40 dark:hover:bg-orange-900/60 text-orange-700 dark:text-[#f79b4a] border border-orange-200 dark:border-orange-500/30 py-2.5 rounded-lg font-medium text-sm transition-colors">
                  View Claim Workflow &rarr;
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
