export const dynamic = 'force-dynamic';
import { getItems } from "@/lib/actions/item.actions";
import Link from "next/link";
import { Search, MapPin, Calendar, Tag, ArrowRight } from "lucide-react";
import { format } from "date-fns";

export default async function BrowseItems({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedParams = await searchParams;
  const type = typeof resolvedParams.type === 'string' ? resolvedParams.type : undefined;
  const category = typeof resolvedParams.category === 'string' ? resolvedParams.category : undefined;
  
  const items = await getItems({ type, category });

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 transition-colors">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-100 dark:border-blue-900/50">
            Live Campus Directory
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight mt-2">
            Campus Lost & Found
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Browse active items reported by students across campus. Items remain visible until resolved.
          </p>
        </div>
        
        <div className="flex bg-gray-100 dark:bg-slate-900 p-1.5 rounded-full border border-gray-200/80 dark:border-slate-800">
          <Link 
            href="/items" 
            className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
              !type 
                ? 'bg-white dark:bg-slate-800 text-gray-900 dark:text-white shadow-sm' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            All Items
          </Link>
          <Link 
            href="/items?type=LOST" 
            className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
              type === 'LOST' 
                ? 'bg-red-500 text-white shadow-sm' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Lost Only
          </Link>
          <Link 
            href="/items?type=FOUND" 
            className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
              type === 'FOUND' 
                ? 'bg-emerald-600 text-white shadow-sm' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Found Only
          </Link>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm max-w-lg mx-auto p-8">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-500 dark:text-blue-400 flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">No matching items found</h3>
          <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm mt-1 max-w-sm mx-auto">
            {type ? `No ${type.toLowerCase()} items currently on the board.` : "No items reported yet."} Try adjusting your filters or check back shortly.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/items/lost/new" className="text-xs bg-gray-900 dark:bg-slate-800 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-slate-700 transition-colors">
              Report Lost Item
            </Link>
            <Link href="/items/found/new" className="text-xs bg-blue-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors">
              Report Found Item
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item: any) => (
            <Link 
              href={`/items/${item._id}`} 
              key={item._id} 
              className="group bg-white dark:bg-slate-900/90 rounded-2xl border border-gray-200/80 dark:border-slate-800/80 overflow-hidden hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-blue-500/5 hover:border-blue-300 dark:hover:border-blue-500/40 transition-all duration-300 flex flex-col hover:-translate-y-1"
            >
              <div className="aspect-square bg-gray-100 dark:bg-slate-800 relative overflow-hidden">
                {item.images && item.images.length > 0 ? (
                  <img 
                    src={item.images[0].url} 
                    alt={item.itemName} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-slate-500 bg-gray-50 dark:bg-slate-800/60">
                    <Search className="w-8 h-8 opacity-40 mb-1" />
                    <span className="text-xs">No Photo Available</span>
                  </div>
                )}
                
                {/* Type Badge */}
                <div className={`absolute top-3 right-3 px-2.5 py-1 text-[11px] font-black tracking-wide rounded-full shadow-sm ${
                  item.type === 'LOST' ? 'bg-red-500 text-white' : 'bg-emerald-600 text-white'
                }`}>
                  {item.type}
                </div>

                {/* Status Badge */}
                {item.status === 'CLAIM_PENDING' && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 text-[11px] font-bold rounded-full shadow-md bg-amber-500 text-white flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    <span>Claim in Progress</span>
                  </div>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-base text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                  {item.itemName}
                </h3>
                
                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-2.5">
                  <Tag className="w-3.5 h-3.5 mr-1.5 text-blue-500 shrink-0" /> 
                  <span className="font-medium text-gray-700 dark:text-gray-300">{item.category}</span>
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1.5">
                  <MapPin className="w-3.5 h-3.5 mr-1.5 text-gray-400 shrink-0" /> 
                  <span className="truncate">{item.location}</span>
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1.5 mb-4">
                  <Calendar className="w-3.5 h-3.5 mr-1.5 text-gray-400 shrink-0" /> 
                  <span>{format(new Date(item.date), 'MMM d, yyyy')}</span>
                </div>

                <div className="mt-auto pt-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center min-w-0">
                    {item.userId?.avatar ? (
                      <img src={item.userId.avatar} alt={item.userId.name} className="w-5 h-5 rounded-full mr-2 object-cover border border-gray-200 dark:border-slate-700" />
                    ) : (
                      <div className="w-5 h-5 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-full mr-2 flex items-center justify-center text-[10px] font-bold">
                        {item.userId?.name?.charAt(0) || '?'}
                      </div>
                    )}
                    <span className="text-xs text-gray-600 dark:text-gray-400 truncate">{item.userId?.name || 'Student'}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all shrink-0" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
