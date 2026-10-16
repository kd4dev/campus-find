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
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">My Reports</h1>
        <div className="flex gap-2">
          <Link href="/items/lost/new" className="bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50 px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
            + Report Lost
          </Link>
          <Link href="/items/found/new" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm">
            + Report Found
          </Link>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
          <p className="text-slate-500 dark:text-slate-400 font-medium">You haven't reported any items yet.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Item</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date Reported</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {items.map((item: any) => (
                  <tr key={item._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 bg-slate-100 dark:bg-slate-800 rounded-lg mr-3 overflow-hidden border border-slate-200 dark:border-slate-700">
                          {item.images && item.images.length > 0 && <img src={item.images[0].url} alt={item.itemName} className="h-full w-full object-cover" />}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white text-sm">{item.itemName}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{item.location}</p>
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
                    <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                      {item.status}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                      {format(new Date(item.createdAt), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <Link href={`/items/${item._id}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold transition-colors">
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
