export const dynamic = 'force-dynamic';
import { getCurrentDbUser } from "@/lib/actions/user.actions";
import { Item } from "@/lib/models/Item";
import connectToDatabase from "@/lib/mongodb";
import { redirect } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";

export default async function MyReports() {
  const user = await getCurrentDbUser();
  if (!user) redirect("/sign-in");

  await connectToDatabase();
  const items = await Item.find({ userId: user._id }).sort({ createdAt: -1 });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">My Reports</h1>
        <div className="flex gap-2">
          <Link href="/items/lost/new" className="bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50 px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
            + Report Lost
          </Link>
          <Link href="/items/found/new" className="btn-asym bg-[#FF7D0C] hover:bg-[#ea6c00] text-white px-4 py-2 text-sm font-semibold transition-colors shadow-sm">
            + Report Found
          </Link>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="bg-white dark:bg-[#141416] rounded-2xl border border-neutral-200 dark:border-white/10 p-12 text-center">
          <p className="text-neutral-500 dark:text-neutral-400 font-medium">You haven't reported any items yet.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#141416] rounded-2xl border border-neutral-200 dark:border-white/10 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-neutral-50 dark:bg-[#18181c] border-b border-neutral-200 dark:border-white/10">
                <tr>
                  <th className="px-6 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Item</th>
                  <th className="px-6 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Date Reported</th>
                  <th className="px-6 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:border-white/10">
                {items.map((item: any) => (
                  <tr key={item._id} className="hover:bg-neutral-50 dark:hover:bg-white/[0.03] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 bg-neutral-100 dark:bg-[#18181c] rounded-lg mr-3 overflow-hidden border border-neutral-200 dark:border-white/10">
                          {item.images && item.images.length > 0 && <img src={item.images[0].url} alt={item.itemName} className="h-full w-full object-cover" />}
                        </div>
                        <div>
                          <p className="font-semibold text-neutral-900 dark:text-white text-sm">{item.itemName}</p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">{item.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        item.type === 'LOST' 
                          ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50' 
                          : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50'
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      {item.status}
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-500 dark:text-neutral-400">
                      {format(new Date(item.createdAt), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <Link href={`/items/${item._id}`} className="text-[#ff7d0c] dark:text-[#f79b4a] hover:underline font-semibold transition-colors">
                        View &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
