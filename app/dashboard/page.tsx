export const dynamic = 'force-dynamic';
import { getCurrentDbUser } from "@/lib/actions/user.actions";
import { Item } from "@/lib/models/Item";
import { Claim } from "@/lib/models/Claim";
import { Message } from "@/lib/models/Message";
import connectToDatabase from "@/lib/mongodb";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PackageSearch, Inbox, CheckCircle, ShieldAlert } from "lucide-react";

export default async function Dashboard() {
  const dbUser = await getCurrentDbUser();
  if (!dbUser) redirect("/sign-in");

  await connectToDatabase();

  const lostCount = await Item.countDocuments({ userId: dbUser._id, type: "LOST" });
  const foundCount = await Item.countDocuments({ userId: dbUser._id, type: "FOUND" });
  
  const activeClaims = await Claim.countDocuments({
    $or: [{ claimantId: dbUser._id }, { finderId: dbUser._id }],
    status: { $nin: ["COMPLETED", "CANCELLED", "REJECTED"] }
  });

  const returnedItems = await Claim.countDocuments({
    $or: [{ claimantId: dbUser._id }, { finderId: dbUser._id }],
    status: "COMPLETED"
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-slate-900 dark:text-white tracking-tight">Welcome back, {dbUser.name}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white dark:bg-[#141416] p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-neutral-400 mb-1">Your Reports</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{lostCount + foundCount}</p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-950/40 p-3 rounded-xl text-[#ff7d0c] dark:text-[#f79b4a] border border-orange-100 dark:border-orange-500/30">
            <PackageSearch className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#141416] p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-neutral-400 mb-1">Active Claims</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{activeClaims}</p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/40 p-3 rounded-xl text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-500/30">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#141416] p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-neutral-400 mb-1">Returned Items</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{returnedItems}</p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/30">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#141416] p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-neutral-400 mb-1">Quick Actions</p>
            <div className="flex gap-2 mt-2">
              <Link href="/items/lost/new" className="text-xs font-semibold bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50 px-3 py-1.5 rounded-lg transition-colors">
                + Lost
              </Link>
              <Link href="/items/found/new" className="text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50 px-3 py-1.5 rounded-lg transition-colors">
                + Found
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-[#141416] rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Reports</h2>
            <Link href="/dashboard/reports" className="text-[#ff7d0c] dark:text-[#f79b4a] text-sm hover:underline font-medium">View All &rarr;</Link>
          </div>
          <div className="space-y-4">
            <p className="text-slate-500 dark:text-neutral-400 text-sm">No recent reports found.</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#141416] rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Claims</h2>
            <Link href="/dashboard/claims" className="text-[#ff7d0c] dark:text-[#f79b4a] text-sm hover:underline font-medium">View All &rarr;</Link>
          </div>
          <div className="space-y-4">
            <p className="text-slate-500 dark:text-neutral-400 text-sm">No active claims.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
