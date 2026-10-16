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
      <div className="bg-white dark:bg-[#141416] rounded-2xl shadow-sm border border-slate-200 dark:border-white/10 overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* Images */}
          <div className="bg-slate-100 dark:bg-[#0e0e11] min-h-[300px] md:min-h-full">
            <ImageGallery images={item.images || []} itemName={item.itemName} />
          </div>

          {/* Details */}
          <div className="p-8 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className={`inline-block px-3 py-1 text-xs font-bold rounded-full mb-3 ${
                  item.type === 'LOST' 
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 dark:border dark:border-rose-800/60' 
                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border dark:border-emerald-800/60'
                }`}>
                  {item.type} ITEM
                </div>
                <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white tracking-tight">{item.itemName}</h1>
              </div>
              <div className="text-right">
                <span className="text-xs bg-slate-100 dark:bg-[#1f1f23] text-slate-700 dark:text-neutral-300 border border-slate-200 dark:border-white/10 px-2.5 py-1 rounded-md font-semibold">
                  {item.status}
                </span>
              </div>
            </div>

            <div className="space-y-4 mb-8 flex-1">
              <div className="flex items-center text-slate-700 dark:text-slate-300">
                <Tag className="w-5 h-5 mr-3 text-slate-400 dark:text-slate-500 shrink-0" />
                <span>{item.category}</span>
              </div>
              <div className="flex items-center text-slate-700 dark:text-slate-300">
                <MapPin className="w-5 h-5 mr-3 text-slate-400 dark:text-slate-500 shrink-0" />
                <span>{item.location}</span>
              </div>
              <div className="flex items-center text-slate-700 dark:text-slate-300">
                <Calendar className="w-5 h-5 mr-3 text-slate-400 dark:text-slate-500 shrink-0" />
                <span>
                  {item.date ? format(new Date(item.date), 'MMMM d, yyyy') : 'Recently'} 
                  {item.approximateTime && ` at approx. ${item.approximateTime}`}
                </span>
              </div>
              
              <div className="pt-4 border-t border-slate-200 dark:border-white/10">
                <h3 className="font-semibold mb-2 text-slate-900 dark:text-white">Description</h3>
                <p className="text-slate-600 dark:text-neutral-300 whitespace-pre-wrap text-sm leading-relaxed">{item.description}</p>
              </div>

              {(item.color || item.brand || item.itemModel) && (
                <div className="pt-4 border-t border-slate-200 dark:border-white/10 grid grid-cols-2 gap-4">
                  {item.color && <div><span className="text-slate-500 dark:text-neutral-400 text-xs block mb-0.5">Color</span><span className="text-slate-900 dark:text-slate-100 text-sm font-medium">{item.color}</span></div>}
                  {item.brand && <div><span className="text-slate-500 dark:text-neutral-400 text-xs block mb-0.5">Brand</span><span className="text-slate-900 dark:text-slate-100 text-sm font-medium">{item.brand}</span></div>}
                  {item.itemModel && <div><span className="text-slate-500 dark:text-neutral-400 text-xs block mb-0.5">Model</span><span className="text-slate-900 dark:text-slate-100 text-sm font-medium">{item.itemModel}</span></div>}
                </div>
              )}

              {item.distinguishingFeatures && item.type === 'LOST' && (
                <div className="pt-4 border-t border-slate-200 dark:border-white/10">
                  <h3 className="font-semibold text-xs text-slate-500 dark:text-neutral-400 mb-1">Distinguishing Features</h3>
                  <p className="text-slate-900 dark:text-slate-100 text-sm">{item.distinguishingFeatures}</p>
                </div>
              )}
            </div>

            <div className="mt-auto border-t border-slate-200 dark:border-white/10 pt-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  {item.userId?.avatar ? (
                    <img src={item.userId.avatar} alt={item.userId.name} className="w-10 h-10 rounded-full mr-3 border border-slate-200 dark:border-white/10 object-cover" />
                  ) : (
                    <div className="w-10 h-10 bg-slate-100 dark:bg-[#18181c] rounded-full mr-3 flex items-center justify-center text-slate-500 dark:text-neutral-400 border border-slate-200 dark:border-white/10">
                      <UserIcon className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-slate-500 dark:text-neutral-400">Reported by</p>
                    <p className="font-medium text-slate-900 dark:text-white text-sm">{item.userId?.name || 'College Student'}</p>
                  </div>
                </div>

                {!isOwner && (
                  <ReportItemModal itemId={item._id} itemName={item.itemName} />
                )}
              </div>

              {currentUser ? (
                isOwner ? (
                  <div className="bg-orange-50/80 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-500/30 p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <ShieldCheck className="w-5 h-5 mr-2 text-[#ff7d0c] dark:text-[#f79b4a] shrink-0" />
                        <span className="font-semibold text-orange-950 dark:text-[#f79b4a] text-sm">You reported this item</span>
                      </div>
                      {itemClaims.length > 0 && (
                        <span className="text-xs bg-orange-200 dark:bg-orange-950/60 text-orange-900 dark:text-[#f79b4a] font-bold px-2.5 py-0.5 rounded-full border border-orange-300 dark:border-orange-500/30">
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
                            <div key={c._id} className="bg-white dark:bg-[#18181c] p-3 rounded-lg border border-orange-100 dark:border-white/10 flex items-center justify-between shadow-sm">
                              <div>
                                <p className="text-xs text-slate-500 dark:text-neutral-400">From <span className="font-semibold text-slate-800 dark:text-slate-200">{otherParty?.name || 'Student'}</span></p>
                                <p className="text-xs text-slate-600 dark:text-neutral-300 mt-0.5">Status: <span className="font-medium text-[#ff7d0c] dark:text-[#f79b4a]">{c.status}</span></p>
                              </div>
                              <Link 
                                href={`/claims/${c._id}`}
                                className="btn-asym bg-[#FF7D0C] hover:bg-[#ea6c00] text-white text-xs font-semibold px-3.5 py-1.5 transition-colors shadow-sm"
                              >
                                Open Claim & Chat
                              </Link>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-orange-900/80 dark:text-[#f79b4a]/90 mt-1">
                        Your listing is visible on campus. When someone responds or claims it, you'll see them here and receive a notification.
                      </p>
                    )}
                  </div>
                ) : userClaim ? (
                  <div className="bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-500/30 p-4 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-amber-900 dark:text-amber-200">You have an ongoing claim</span>
                      <span className="text-xs bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded font-bold">{userClaim.status}</span>
                    </div>
                    <Link
                      href={`/claims/${userClaim._id}`}
                      className="w-full block text-center btn-asym bg-[#FF7D0C] hover:bg-[#ea6c00] text-white font-medium py-2.5 text-sm transition-colors shadow-sm"
                    >
                      Open Your Claim & Chat
                    </Link>
                  </div>
                ) : (
                  <ClaimButton item={item} currentUser={currentUser} />
                )
              ) : (
                <div className="bg-slate-50 dark:bg-[#18181c] p-4 rounded-xl text-center border border-slate-200 dark:border-white/10">
                  <p className="text-slate-600 dark:text-neutral-300 text-sm mb-3">Sign in to contact the reporter or claim this item.</p>
                  <a href="/sign-in" className="inline-block btn-asym bg-[#FF7D0C] hover:bg-[#ea6c00] text-white px-6 py-2 font-medium text-sm transition-colors shadow-sm">Sign In</a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
