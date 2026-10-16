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
      <h1 className="text-3xl font-bold mb-8 flex items-center text-slate-900 dark:text-white tracking-tight">
        <ShieldAlert className="w-8 h-8 mr-3 text-rose-600 dark:text-rose-400" /> 
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-12">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center text-blue-600 dark:text-blue-400 mb-2">
            <Users className="w-5 h-5 mr-2" />
            <h3 className="font-semibold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Users</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{totalUsers}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center text-purple-600 dark:text-purple-400 mb-2">
            <Package className="w-5 h-5 mr-2" />
            <h3 className="font-semibold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Items</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{totalItems}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center text-amber-600 dark:text-amber-400 mb-2">
            <ShieldAlert className="w-5 h-5 mr-2" />
            <h3 className="font-semibold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Active Claims</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{activeClaims}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center text-emerald-600 dark:text-emerald-400 mb-2">
            <FileCheck className="w-5 h-5 mr-2" />
            <h3 className="font-semibold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Returns</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{completedClaims}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center text-rose-600 dark:text-rose-400 mb-2">
            <Flag className="w-5 h-5 mr-2" />
            <h3 className="font-semibold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Open Reports</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{pendingReportsCount}</p>
        </div>
      </div>

      {/* Moderation / Reports Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex justify-between items-center">
          <h2 className="font-bold text-lg text-slate-900 dark:text-white flex items-center">
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
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
          <h2 className="font-bold text-lg text-slate-900 dark:text-white">Recent Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentUsers.map((u: any) => (
                <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">{u.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{u.email}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      u.role === 'ADMIN' 
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50' 
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
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
