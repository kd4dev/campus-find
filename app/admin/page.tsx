export const dynamic = 'force-dynamic';

import { getCurrentDbUser } from "@/lib/actions/user.actions";
import connectToDatabase from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { Item } from "@/lib/models/Item";
import { Claim } from "@/lib/models/Claim";
import { Report } from "@/lib/models/Report";
import { redirect } from "next/navigation";
import { ShieldAlert, Users, Package, FileCheck, Flag } from "lucide-react";
import AdminReportsList from "@/components/admin/AdminReportsList";

export default async function AdminDashboard() {
  const user = await getCurrentDbUser();
  if (!user || user.role !== 'ADMIN') redirect("/");

  await connectToDatabase();

  const totalUsers = await User.countDocuments();
  const totalItems = await Item.countDocuments();
  const activeClaims = await Claim.countDocuments({ status: { $nin: ["COMPLETED", "REJECTED", "CANCELLED"] } });
  const completedClaims = await Claim.countDocuments({ status: "COMPLETED" });
  const pendingReportsCount = await Report.countDocuments({ status: "PENDING" });

  const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);
  const reports = await Report.find({})
    .populate("reporterId", "name email avatar")
    .populate("itemId", "itemName type location status")
    .sort({ createdAt: -1 })
    .limit(20);

  const parsedReports = JSON.parse(JSON.stringify(reports));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center text-neutral-900 dark:text-white tracking-tight">
        <ShieldAlert className="w-8 h-8 mr-3 text-rose-600 dark:text-rose-400" /> 
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-12">
        <div className="bg-white dark:bg-[#141416] p-6 rounded-2xl border border-neutral-200 dark:border-white/10 shadow-sm">
          <div className="flex items-center text-[#ff7d0c] dark:text-[#f79b4a] mb-2">
            <Users className="w-5 h-5 mr-2" />
            <h3 className="font-semibold text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Total Users</h3>
          </div>
          <p className="text-3xl font-bold text-neutral-900 dark:text-white">{totalUsers}</p>
        </div>

        <div className="bg-white dark:bg-[#141416] p-6 rounded-2xl border border-neutral-200 dark:border-white/10 shadow-sm">
          <div className="flex items-center text-purple-600 dark:text-purple-400 mb-2">
            <Package className="w-5 h-5 mr-2" />
            <h3 className="font-semibold text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Total Items</h3>
          </div>
          <p className="text-3xl font-bold text-neutral-900 dark:text-white">{totalItems}</p>
        </div>

        <div className="bg-white dark:bg-[#141416] p-6 rounded-2xl border border-neutral-200 dark:border-white/10 shadow-sm">
          <div className="flex items-center text-amber-600 dark:text-amber-400 mb-2">
            <ShieldAlert className="w-5 h-5 mr-2" />
            <h3 className="font-semibold text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Active Claims</h3>
          </div>
          <p className="text-3xl font-bold text-neutral-900 dark:text-white">{activeClaims}</p>
        </div>

        <div className="bg-white dark:bg-[#141416] p-6 rounded-2xl border border-neutral-200 dark:border-white/10 shadow-sm">
          <div className="flex items-center text-emerald-600 dark:text-emerald-400 mb-2">
            <FileCheck className="w-5 h-5 mr-2" />
            <h3 className="font-semibold text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Returns</h3>
          </div>
          <p className="text-3xl font-bold text-neutral-900 dark:text-white">{completedClaims}</p>
        </div>

        <div className="bg-white dark:bg-[#141416] p-6 rounded-2xl border border-neutral-200 dark:border-white/10 shadow-sm">
          <div className="flex items-center text-rose-600 dark:text-rose-400 mb-2">
            <Flag className="w-5 h-5 mr-2" />
            <h3 className="font-semibold text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Open Reports</h3>
          </div>
          <p className="text-3xl font-bold text-neutral-900 dark:text-white">{pendingReportsCount}</p>
        </div>
      </div>

      {/* Moderation / Reports Section */}
      <div className="bg-white dark:bg-[#141416] rounded-2xl border border-neutral-200 dark:border-white/10 shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-[#18181c] flex justify-between items-center">
          <h2 className="font-bold text-lg text-neutral-900 dark:text-white flex items-center">
            <Flag className="w-5 h-5 text-rose-600 dark:text-rose-400 mr-2" />
            Reported Listings & Flagged Content
          </h2>
          <span className="text-xs bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50 font-bold px-2.5 py-0.5 rounded-full">
            {pendingReportsCount} pending
          </span>
        </div>
        <AdminReportsList initialReports={parsedReports} />
      </div>

      {/* Recent Users */}
      <div className="bg-white dark:bg-[#141416] rounded-2xl border border-neutral-200 dark:border-white/10 shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-[#18181c]">
          <h2 className="font-bold text-lg text-neutral-900 dark:text-white">Recent Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-neutral-200 dark:border-white/10 bg-neutral-50/50 dark:bg-[#18181c]/60">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-white/10">
              {recentUsers.map((u: any) => (
                <tr key={u._id} className="hover:bg-neutral-50 dark:hover:bg-white/[0.03] transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-neutral-900 dark:text-white">{u.name}</td>
                  <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-300">{u.email}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      u.role === 'ADMIN' 
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50' 
                        : 'bg-neutral-100 text-neutral-700 dark:bg-[#18181c] dark:text-neutral-300 border border-neutral-200 dark:border-white/10'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
