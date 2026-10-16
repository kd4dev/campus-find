export const dynamic = 'force-dynamic';
import { getItemById } from "@/lib/actions/item.actions";
import { getCurrentDbUser } from "@/lib/actions/user.actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { MapPin, Calendar, Tag, User as UserIcon, ShieldCheck } from "lucide-react";
import ImageGallery from "@/components/items/ImageGallery";
import ClaimButton from "@/components/claims/ClaimButton";
import ReportItemModal from "@/components/items/ReportItemModal";
import { Claim } from "@/lib/models/Claim";
import connectToDatabase from "@/lib/mongodb";

export default async function ItemDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const item = await getItemById(resolvedParams.id);
  if (!item) notFound();

  let currentUser = null;
  try {
    currentUser = await getCurrentDbUser();
  } catch (err) {
    console.error("Error fetching current user in item details:", err);
  }
  const rawItemUserId = (item.userId?._id || item.userId)?.toString();
  const currentUserId = currentUser?._id?.toString();
  const isOwner = Boolean(currentUserId && rawItemUserId && currentUserId === rawItemUserId);

  let itemClaims: any[] = [];
  let userClaim: any = null;
  if (currentUser) {
    try {
      await connectToDatabase();
      if (isOwner) {
        const rawClaims = await Claim.find({ itemId: item._id })
          .populate("claimantId", "name avatar")
          .populate("finderId", "name avatar")
          .sort({ updatedAt: -1 });
        itemClaims = JSON.parse(JSON.stringify(rawClaims));
      } else {
        const foundClaim = await Claim.findOne({
          itemId: item._id,
          $or: [{ claimantId: currentUser._id }, { finderId: currentUser._id }]
        });
        if (foundClaim) {
          userClaim = JSON.parse(JSON.stringify(foundClaim));
        }
      }
    } catch (claimErr) {
      console.error("Error fetching claims for item:", claimErr);
    }
  }

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
                  {item.date ? format(new Date(item.date), 'MMMM d, yyyy') : 'Recently'} 
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
                    <p className="font-medium text-gray-900">{item.userId?.name || 'College Student'}</p>
                  </div>
                </div>

                {!isOwner && (
                  <ReportItemModal itemId={item._id} itemName={item.itemName} />
                )}
              </div>

              {currentUser ? (
                isOwner ? (
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <ShieldCheck className="w-5 h-5 mr-2 text-blue-600 shrink-0" />
                        <span className="font-semibold text-blue-900 text-sm">You reported this item</span>
                      </div>
                      {itemClaims.length > 0 && (
                        <span className="text-xs bg-blue-200 text-blue-900 font-bold px-2 py-0.5 rounded-full">
                          {itemClaims.length} Response{itemClaims.length > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>

                    {itemClaims.length > 0 ? (
                      <div className="space-y-2 mt-2">
                        {itemClaims.map((c: any) => {
                          const isClaimant = c.claimantId?._id?.toString() === currentUserId;
                          const otherParty = isClaimant ? c.finderId : c.claimantId;
                          return (
                            <div key={c._id} className="bg-white p-3 rounded-lg border border-blue-100 flex items-center justify-between shadow-sm">
                              <div>
                                <p className="text-xs text-gray-500">From <span className="font-semibold text-gray-800">{otherParty?.name || 'Student'}</span></p>
                                <p className="text-xs text-gray-600 mt-0.5">Status: <span className="font-medium text-blue-600">{c.status}</span></p>
                              </div>
                              <Link 
                                href={`/claims/${c._id}`}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-md transition-colors"
                              >
                                Open Claim & Chat
                              </Link>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-blue-700 mt-1">
                        Your listing is visible on campus. When someone responds or claims it, you'll see them here and receive a notification.
                      </p>
                    )}
                  </div>
                ) : userClaim ? (
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-amber-900">You have an ongoing claim</span>
                      <span className="text-xs bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-bold">{userClaim.status}</span>
                    </div>
                    <Link
                      href={`/claims/${userClaim._id}`}
                      className="w-full block text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-md text-sm transition-colors shadow-sm"
                    >
                      Open Your Claim & Chat
                    </Link>
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
