export const dynamic = 'force-dynamic';

import { getCurrentDbUser } from "@/lib/actions/user.actions";
import connectToDatabase from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { Item } from "@/lib/models/Item";
import { Claim } from "@/lib/models/Claim";
import { redirect } from "next/navigation";
import { ShieldAlert, Users, Package, FileCheck } from "lucide-react";

export default async function AdminDashboard() {
  const user = await getCurrentDbUser();
  if (!user || user.role !== 'ADMIN') redirect("/");

  await connectToDatabase();

  const totalUsers = await User.countDocuments();
  const totalItems = await Item.countDocuments();
  const activeClaims = await Claim.countDocuments({ status: { $nin: ["COMPLETED", "REJECTED", "CANCELLED"] } });
  const completedClaims = await Claim.countDocuments({ status: "COMPLETED" });

  const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center">
        <ShieldAlert className="w-8 h-8 mr-3 text-red-600" /> 
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="flex items-center text-blue-600 mb-2">
            <Users className="w-5 h-5 mr-2" />
            <h3 className="font-semibold">Total Users</h3>
          </div>
          <p className="text-3xl font-bold">{totalUsers}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="flex items-center text-purple-600 mb-2">
            <Package className="w-5 h-5 mr-2" />
            <h3 className="font-semibold">Total Items</h3>
          </div>
          <p className="text-3xl font-bold">{totalItems}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="flex items-center text-orange-600 mb-2">
            <ShieldAlert className="w-5 h-5 mr-2" />
            <h3 className="font-semibold">Active Claims</h3>
          </div>
          <p className="text-3xl font-bold">{activeClaims}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="flex items-center text-green-600 mb-2">
            <FileCheck className="w-5 h-5 mr-2" />
            <h3 className="font-semibold">Successful Returns</h3>
          </div>
          <p className="text-3xl font-bold">{completedClaims}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h2 className="font-bold text-lg">Recent Users</h2>
        </div>
        <table className="w-full text-left">
          <thead className="border-b">
            <tr>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {recentUsers.map((u: any) => (
              <tr key={u._id}>
                <td className="px-6 py-4 text-sm font-medium">{u.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 rounded text-xs ${u.role === 'ADMIN' ? 'bg-red-100 text-red-800' : 'bg-gray-100'}`}>
                    {u.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
