export const dynamic = 'force-dynamic';

import { getCurrentDbUser } from "@/lib/actions/user.actions";
import { Item } from "@/lib/models/Item";
import { Claim } from "@/lib/models/Claim";
import connectToDatabase from "@/lib/mongodb";
import { redirect } from "next/navigation";
import { User as UserIcon, Mail, Phone, Calendar, ShieldCheck, MapPin } from "lucide-react";
import { format } from "date-fns";

export default async function ProfilePage() {
  const user = await getCurrentDbUser();
  if (!user) redirect("/sign-in");

  await connectToDatabase();

  const reportsCount = await Item.countDocuments({ userId: user._id });
  const successfulReturns = await Claim.countDocuments({
    $or: [{ claimantId: user._id }, { finderId: user._id }],
    status: "COMPLETED"
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Your Profile</h1>

      <div className="bg-white rounded-2xl border shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden mb-8">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600"></div>
        <div className="px-8 pb-8 relative">
          <div className="flex justify-between items-end mb-6 -mt-12">
            <div className="relative">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-white object-cover" />
              ) : (
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-3xl">
                  {user.name?.charAt(0)}
                </div>
              )}
            </div>
            {/* The user requested ability to update profile, but without a full form, we can just say "Manage Account in Clerk" or similar for MVP */}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                <div className="flex items-center text-gray-500 mt-1 text-sm">
                  <Mail className="w-4 h-4 mr-1.5" /> {user.email}
                </div>
                {user.college && (
                  <div className="flex items-center text-gray-500 mt-1 text-sm">
                    <MapPin className="w-4 h-4 mr-1.5" /> {user.college}
                  </div>
                )}
                {user.phone && (
                  <div className="flex items-center text-gray-500 mt-1 text-sm">
                    <Phone className="w-4 h-4 mr-1.5" /> {user.phone}
                  </div>
                )}
                <div className="flex items-center text-gray-500 mt-1 text-sm">
                  <Calendar className="w-4 h-4 mr-1.5" /> Joined {format(new Date(user.createdAt), 'MMMM yyyy')}
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.role === 'ADMIN' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                  {user.role}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border flex gap-6 items-center justify-around text-center">
              <div>
                <p className="text-3xl font-bold text-gray-900">{reportsCount}</p>
                <p className="text-sm text-gray-500 font-medium">Items Reported</p>
              </div>
              <div className="w-px h-12 bg-gray-200"></div>
              <div>
                <p className="text-3xl font-bold text-green-600">{successfulReturns}</p>
                <p className="text-sm text-gray-500 font-medium flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 mr-1" /> Returned
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 text-blue-800 p-4 rounded-lg flex items-start border border-blue-100">
        <ShieldCheck className="w-5 h-5 mr-3 shrink-0 mt-0.5" />
        <p className="text-sm">
          To update your name or profile picture, click your avatar in the top right corner and select "Manage account".
        </p>
      </div>
    </div>
  );
}
