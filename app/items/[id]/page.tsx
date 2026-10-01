export const dynamic = 'force-dynamic';
import { getItemById } from "@/lib/actions/item.actions";
import { getCurrentDbUser } from "@/lib/actions/user.actions";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { MapPin, Calendar, Tag, User as UserIcon, ShieldCheck } from "lucide-react";
import ImageGallery from "@/components/items/ImageGallery";
import ClaimButton from "@/components/claims/ClaimButton";

export default async function ItemDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const item = await getItemById(resolvedParams.id);
  if (!item) notFound();

  const currentUser = await getCurrentDbUser();
  const isOwner = currentUser && currentUser._id === item.userId._id;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* Images */}
          <div className="bg-gray-100 min-h-[300px] md:min-h-full">
            <ImageGallery images={item.images || []} itemName={item.itemName} />
          </div>

          {/* Details */}
          <div className="p-8 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className={`inline-block px-3 py-1 text-xs font-bold rounded-full mb-3 ${item.type === 'LOST' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {item.type} ITEM
                </div>
                <h1 className="text-3xl font-bold mb-2 text-gray-900">{item.itemName}</h1>
              </div>
              <div className="text-right">
                <span className="text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded">{item.status}</span>
              </div>
            </div>

            <div className="space-y-4 mb-8 flex-1">
              <div className="flex items-center text-gray-700">
                <Tag className="w-5 h-5 mr-3 text-gray-400" />
                <span>{item.category}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <MapPin className="w-5 h-5 mr-3 text-gray-400" />
                <span>{item.location}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Calendar className="w-5 h-5 mr-3 text-gray-400" />
                <span>
                  {format(new Date(item.date), 'MMMM d, yyyy')} 
                  {item.approximateTime && ` at approx. ${item.approximateTime}`}
                </span>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2 text-gray-900">Description</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{item.description}</p>
              </div>

              {(item.color || item.brand || item.itemModel) && (
                <div className="pt-4 border-t grid grid-cols-2 gap-4">
                  {item.color && <div><span className="text-gray-500 text-sm block">Color</span><span className="text-gray-900">{item.color}</span></div>}
                  {item.brand && <div><span className="text-gray-500 text-sm block">Brand</span><span className="text-gray-900">{item.brand}</span></div>}
                  {item.itemModel && <div><span className="text-gray-500 text-sm block">Model</span><span className="text-gray-900">{item.itemModel}</span></div>}
                </div>
              )}

              {item.distinguishingFeatures && item.type === 'LOST' && (
                <div className="pt-4 border-t">
                  <h3 className="font-semibold text-sm text-gray-500 mb-1">Distinguishing Features</h3>
                  <p className="text-gray-900">{item.distinguishingFeatures}</p>
                </div>
              )}
            </div>

            <div className="mt-auto border-t pt-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  {item.userId?.avatar ? (
                    <img src={item.userId.avatar} alt={item.userId.name} className="w-10 h-10 rounded-full mr-3 border" />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded-full mr-3 flex items-center justify-center">
                      <UserIcon className="w-5 h-5 text-gray-500" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500">Reported by</p>
                    <p className="font-medium text-gray-900">{item.userId?.name}</p>
                  </div>
                </div>
              </div>

              {currentUser ? (
                isOwner ? (
                  <div className="bg-blue-50 text-blue-800 p-4 rounded-lg flex items-start">
                    <ShieldCheck className="w-5 h-5 mr-2 shrink-0 mt-0.5" />
                    <p className="text-sm">You reported this item. Check your dashboard to manage it or view claims.</p>
                  </div>
                ) : (
                  <ClaimButton item={item} currentUser={currentUser} />
                )
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg text-center border">
                  <p className="text-gray-600 text-sm mb-3">Sign in to contact the reporter or claim this item.</p>
                  <a href="/sign-in" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md font-medium text-sm">Sign In</a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
