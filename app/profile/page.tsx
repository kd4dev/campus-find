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
      <h1 className="text-3xl font-bold mb-8 text-neutral-900 dark:text-white tracking-tight">Your Profile</h1>

      <div className="bg-white dark:bg-[#141416] rounded-2xl border border-neutral-200 dark:border-white/10 shadow-sm overflow-hidden mb-8 transition-colors">
        <div className="h-32 bg-gradient-to-r from-[#FF7D0C] via-amber-500 to-orange-400"></div>
        <div className="px-8 pb-8 relative">
          <div className="flex justify-between items-end mb-6 -mt-12">
            <div className="relative">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full border-4 border-white dark:border-[#141416] shadow-md bg-white dark:bg-[#141416] object-cover" />
              ) : (
                <div className="w-24 h-24 rounded-full border-4 border-white dark:border-[#141416] shadow-md bg-orange-100 dark:bg-orange-950/80 flex items-center justify-center text-[#ff7d0c] dark:text-[#f79b4a] font-bold text-3xl">
                  {user.name?.charAt(0)}
                </div>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">{user.name}</h2>
                <div className="flex items-center text-neutral-500 dark:text-neutral-400 mt-1 text-sm">
                  <Mail className="w-4 h-4 mr-1.5" /> {user.email}
                </div>
                {user.college && (
                  <div className="flex items-center text-neutral-500 dark:text-neutral-400 mt-1 text-sm">
                    <MapPin className="w-4 h-4 mr-1.5" /> {user.college}
                  </div>
                )}
                {user.phone && (
                  <div className="flex items-center text-neutral-500 dark:text-neutral-400 mt-1 text-sm">
                    <Phone className="w-4 h-4 mr-1.5" /> {user.phone}
                  </div>
                )}
                <div className="flex items-center text-neutral-500 dark:text-neutral-400 mt-1 text-sm">
                  <Calendar className="w-4 h-4 mr-1.5" /> Joined {format(new Date(user.createdAt), 'MMMM yyyy')}
                </div>
              </div>
              
              <div className="pt-4 border-t border-neutral-200 dark:border-white/10">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  user.role === 'ADMIN' 
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50' 
                    : 'bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-[#f79b4a] border border-orange-200 dark:border-orange-500/30'
                }`}>
                  {user.role}
                </span>
              </div>
            </div>

            <div className="bg-neutral-50 dark:bg-[#18181c] rounded-xl p-6 border border-neutral-200 dark:border-white/10 flex gap-6 items-center justify-around text-center">
              <div>
                <p className="text-3xl font-bold text-neutral-900 dark:text-white">{reportsCount}</p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">Items Reported</p>
              </div>
              <div className="w-px h-12 bg-neutral-200 dark:bg-white/10"></div>
              <div>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{successfulReturns}</p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 mr-1" /> Returned
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-orange-50 dark:bg-orange-950/40 text-orange-800 dark:text-[#f79b4a] p-4 rounded-xl flex items-start border border-orange-200 dark:border-orange-500/30">
        <ShieldCheck className="w-5 h-5 mr-3 shrink-0 mt-0.5" />
        <p className="text-sm">
          To update your name or profile picture, click your avatar in the top right corner and select "Manage account".
        </p>
      </div>
    </div>
  );
}
