export const dynamic = 'force-dynamic';
import { getItems } from "@/lib/actions/item.actions";
import Link from "next/link";
import { Search, MapPin, Calendar, Tag } from "lucide-react";
import { format } from "date-fns";

export default async function BrowseItems({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedParams = await searchParams;
  const type = typeof resolvedParams.type === 'string' ? resolvedParams.type : undefined;
  const category = typeof resolvedParams.category === 'string' ? resolvedParams.category : undefined;
  
  const items = await getItems({ type, category });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Browse Items</h1>
          <p className="text-gray-500">Search for lost or found items on campus.</p>
        </div>
        
        <div className="flex gap-2">
          <Link href="/items?type=LOST" className={`px-4 py-2 rounded-full border ${type === 'LOST' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900 hover:bg-gray-50'}`}>Lost</Link>
          <Link href="/items?type=FOUND" className={`px-4 py-2 rounded-full border ${type === 'FOUND' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900 hover:bg-gray-50'}`}>Found</Link>
          <Link href="/items" className={`px-4 py-2 rounded-full border ${!type ? 'bg-gray-900 text-white' : 'bg-white text-gray-900 hover:bg-gray-50'}`}>All</Link>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No items found</h3>
          <p className="text-gray-500 mt-1">Try adjusting your filters or check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item: any) => (
            <Link href={`/items/${item._id}`} key={item._id} className="group bg-white rounded-xl border overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              <div className="aspect-square bg-gray-100 relative overflow-hidden">
                {item.images && item.images.length > 0 ? (
                  <img src={item.images[0].url} alt={item.itemName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                )}
                <div className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded shadow-sm ${item.type === 'LOST' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                  {item.type}
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{item.itemName}</h3>
                <div className="text-sm text-gray-500 flex items-center mt-2">
                  <Tag className="w-3.5 h-3.5 mr-1" /> {item.category}
                </div>
                <div className="text-sm text-gray-500 flex items-center mt-1">
                  <MapPin className="w-3.5 h-3.5 mr-1" /> <span className="line-clamp-1">{item.location}</span>
                </div>
                <div className="text-sm text-gray-500 flex items-center mt-1 mb-3">
                  <Calendar className="w-3.5 h-3.5 mr-1" /> {format(new Date(item.date), 'MMM d, yyyy')}
                </div>
                <div className="mt-auto pt-3 border-t flex items-center justify-between">
                  <div className="flex items-center">
                    {item.userId?.avatar ? (
                      <img src={item.userId.avatar} alt={item.userId.name} className="w-6 h-6 rounded-full mr-2" />
                    ) : (
                      <div className="w-6 h-6 bg-blue-100 rounded-full mr-2 flex items-center justify-center text-blue-600 text-xs">
                        {item.userId?.name?.charAt(0) || '?'}
                      </div>
                    )}
                    <span className="text-xs text-gray-600 truncate">{item.userId?.name}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
