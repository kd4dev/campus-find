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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Reports</h1>
        <div className="flex gap-2">
          <Link href="/items/lost/new" className="bg-gray-100 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200">Report Lost</Link>
          <Link href="/items/found/new" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">Report Found</Link>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <p className="text-gray-500 mb-4">You haven't reported any items yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Item</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date Reported</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.map((item: any) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded mr-3 overflow-hidden">
                        {item.images && item.images.length > 0 && <img src={item.images[0].url} className="h-full w-full object-cover" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.itemName}</p>
                        <p className="text-xs text-gray-500">{item.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <span className={`px-2 py-1 rounded text-xs ${item.type === 'LOST' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {item.status}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {format(new Date(item.createdAt), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <Link href={`/items/${item._id}`} className="text-blue-600 hover:text-blue-900 mr-4">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
