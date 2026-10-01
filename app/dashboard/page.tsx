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
      <h1 className="text-3xl font-bold mb-8">Welcome back, {dbUser.name}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Your Reports</p>
            <p className="text-2xl font-bold">{lostCount + foundCount}</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
            <PackageSearch className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Active Claims</p>
            <p className="text-2xl font-bold">{activeClaims}</p>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg text-orange-600">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Returned Items</p>
            <p className="text-2xl font-bold">{returnedItems}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg text-green-600">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Quick Actions</p>
            <div className="flex gap-2 mt-2">
              <Link href="/items/lost/new" className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200">Lost</Link>
              <Link href="/items/found/new" className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200">Found</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Recent Reports</h2>
            <Link href="/dashboard/reports" className="text-blue-600 text-sm hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            <p className="text-gray-500 text-sm">No recent reports found.</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Recent Claims</h2>
            <Link href="/dashboard/claims" className="text-blue-600 text-sm hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            <p className="text-gray-500 text-sm">No active claims.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
