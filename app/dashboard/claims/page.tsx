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
      <h1 className="text-3xl font-bold mb-8">My Claims</h1>

      {claims.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center flex flex-col items-center">
          <ShieldCheck className="w-12 h-12 text-gray-300 mb-4" />
          <p className="text-gray-500 font-medium">You have no active claims.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {claims.map((claim: any) => {
            const isClaimant = claim.claimantId.toString() === user._id.toString();
            const role = isClaimant ? 'Claimant' : 'Finder';
            
            return (
              <div key={claim._id} className="bg-white rounded-xl border shadow-sm p-5 flex flex-col hover:border-blue-300 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-2 py-1 text-xs font-bold rounded ${isClaimant ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'}`}>
                    {role.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500">
                    {format(new Date(claim.updatedAt), 'MMM d, yyyy')}
                  </span>
                </div>
                
                <h3 className="font-bold text-lg mb-1">{claim.itemId?.itemName || 'Unknown Item'}</h3>
                
                <div className="mb-4 text-sm text-gray-600 flex-1">
                  <p className="mb-1"><span className="font-medium">Status:</span> {claim.status}</p>
                </div>
                
                <Link href={`/claims/${claim._id}`} className="mt-auto block w-full text-center bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 rounded-md font-medium text-sm transition-colors">
                  View Claim Workflow
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
