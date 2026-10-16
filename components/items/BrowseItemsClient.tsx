"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { 
  Search, 
  MapPin, 
  Calendar, 
  Tag, 
  ArrowRight, 
  X, 
  SlidersHorizontal, 
  ArrowUpDown, 
  Sparkles,
  Laptop,
  CreditCard,
  Key,
  Backpack,
  FileText,
  BookOpen,
  Shirt,
  Building2,
  CheckCircle2,
  RotateCcw
} from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

interface ItemUser {
  _id?: string;
  name?: string;
  avatar?: string;
}

interface ItemData {
  _id: string;
  itemName: string;
  type: "LOST" | "FOUND";
  category: string;
  description: string;
  location: string;
  date: string | Date;
  approximateTime?: string;
  color?: string;
  brand?: string;
  itemModel?: string;
  status: "ACTIVE" | "CLAIM_PENDING" | "RESOLVED" | "CLOSED";
  images?: { url: string; publicId: string }[];
  userId?: ItemUser;
  createdAt: string | Date;
}

interface BrowseItemsClientProps {
  initialItems: ItemData[];
  initialType?: string;
  initialCategory?: string;
  initialSearch?: string;
}

const CATEGORY_CONFIG: { id: string; label: string; icon: any }[] = [
  { id: "ALL", label: "All Categories", icon: Sparkles },
  { id: "Electronics", label: "Electronics", icon: Laptop },
  { id: "Wallet", label: "Wallets", icon: CreditCard },
  { id: "ID Card", label: "Campus IDs", icon: CreditCard },
  { id: "Keys", label: "Keys & Fobs", icon: Key },
  { id: "Bag", label: "Bags & Backpacks", icon: Backpack },
  { id: "Documents", label: "Documents", icon: FileText },
  { id: "Books", label: "Books & Notes", icon: BookOpen },
  { id: "Clothing", label: "Clothing", icon: Shirt },
  { id: "Accessories", label: "Accessories", icon: Tag },
  { id: "Stationery", label: "Stationery", icon: BookOpen },
  { id: "Other", label: "Other Items", icon: Tag },
];

const POPULAR_ZONES = [
  "All Campus Zones",
  "Library",
  "Student Union",
  "Cafeteria",
  "Sports Complex",
  "Science Block",
  "Hostel / Dorms",
  "Lecture Hall"
];

export default function BrowseItemsClient({
  initialItems,
  initialType,
  initialCategory,
  initialSearch = "",
}: BrowseItemsClientProps) {
  const [items] = useState<ItemData[]>(initialItems);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedType, setSelectedType] = useState<"ALL" | "LOST" | "FOUND">(
    initialType?.toUpperCase() === "LOST" ? "LOST" : initialType?.toUpperCase() === "FOUND" ? "FOUND" : "ALL"
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategory || "ALL"
  );
  const [selectedZone, setSelectedZone] = useState<string>("All Campus Zones");
  const [sortBy, setSortBy] = useState<"NEWEST" | "OLDEST" | "NAME">("NEWEST");

  // Sync state if initial props change
  useEffect(() => {
    if (initialType) {
      const t = initialType.toUpperCase();
      if (t === "LOST" || t === "FOUND") setSelectedType(t);
    }
  }, [initialType]);

  useEffect(() => {
    if (initialCategory) setSelectedCategory(initialCategory);
  }, [initialCategory]);

  // Dynamic counts for quick overview
  const totalCount = items.length;
  const lostCount = useMemo(() => items.filter((i) => i.type === "LOST").length, [items]);
  const foundCount = useMemo(() => items.filter((i) => i.type === "FOUND").length, [items]);

  // Filtered & sorted items
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // 1. Type filter
        if (selectedType !== "ALL" && item.type !== selectedType) {
          return false;
        }

        // 2. Category filter
        if (selectedCategory !== "ALL" && item.category.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }

        // 3. Zone / Location filter
        if (selectedZone !== "All Campus Zones") {
          const zoneKey = selectedZone.toLowerCase();
          const itemLoc = (item.location || "").toLowerCase();
          if (!itemLoc.includes(zoneKey)) {
            return false;
          }
        }

        // 4. Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const nameMatch = (item.itemName || "").toLowerCase().includes(q);
          const descMatch = (item.description || "").toLowerCase().includes(q);
          const locMatch = (item.location || "").toLowerCase().includes(q);
          const catMatch = (item.category || "").toLowerCase().includes(q);
          const brandMatch = (item.brand || "").toLowerCase().includes(q);
          const modelMatch = (item.itemModel || "").toLowerCase().includes(q);
          const colorMatch = (item.color || "").toLowerCase().includes(q);

          if (!nameMatch && !descMatch && !locMatch && !catMatch && !brandMatch && !modelMatch && !colorMatch) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "NEWEST") {
          return new Date(b.date || b.createdAt).getTime() - new Date(a.date || a.createdAt).getTime();
        }
        if (sortBy === "OLDEST") {
          return new Date(a.date || a.createdAt).getTime() - new Date(b.date || b.createdAt).getTime();
        }
        if (sortBy === "NAME") {
          return a.itemName.localeCompare(b.itemName);
        }
        return 0;
      });
  }, [items, selectedType, selectedCategory, selectedZone, searchQuery, sortBy]);

  const hasActiveFilters = 
    searchQuery.trim() !== "" || 
    selectedType !== "ALL" || 
    selectedCategory !== "ALL" || 
    selectedZone !== "All Campus Zones" ||
    sortBy !== "NEWEST";

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedType("ALL");
    setSelectedCategory("ALL");
    setSelectedZone("All Campus Zones");
    setSortBy("NEWEST");
  };

  return (
    <div className="space-y-8">
      {/* Search & Top Action Bar */}
      <div className="bg-white dark:bg-[#141416] rounded-3xl border border-gray-200/80 dark:border-white/10 p-4 sm:p-6 shadow-sm dark:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Live Search Input */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-neutral-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by item name, brand, location, color, or model..."
              className="w-full pl-11 pr-10 py-3 rounded-2xl bg-gray-50 dark:bg-[#141416] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 text-sm border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-[#ff7d0c]/30 focus:border-[#ff7d0c] dark:focus:border-[#f79b4a] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-neutral-500 dark:hover:text-neutral-300 p-1 rounded-full cursor-pointer transition-colors"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Type Segmented Switch */}
          <div className="flex bg-gray-100 dark:bg-[#141416] p-1 rounded-2xl border border-gray-200/70 dark:border-white/10 shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setSelectedType("ALL")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                selectedType === "ALL"
                  ? "bg-white dark:bg-[#202025] text-gray-900 dark:text-white shadow-sm dark:shadow-[0_2px_10px_rgba(0,0,0,0.4)]"
                  : "text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <span>All Items</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-200/60 dark:bg-[#2a2a30] text-gray-700 dark:text-neutral-300">
                {totalCount}
              </span>
            </button>

            <button
              onClick={() => setSelectedType("LOST")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                selectedType === "LOST"
                  ? "bg-rose-500 text-white shadow-sm dark:shadow-[0_0_15px_-3px_rgba(244,63,94,0.45)]"
                  : "text-gray-600 dark:text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span>Lost</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                selectedType === "LOST" ? "bg-rose-600 text-white" : "bg-gray-200/60 dark:bg-[#2a2a30] text-gray-700 dark:text-neutral-300"
              }`}>
                {lostCount}
              </span>
            </button>

            <button
              onClick={() => setSelectedType("FOUND")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                selectedType === "FOUND"
                  ? "bg-emerald-600 text-white shadow-sm dark:shadow-[0_0_15px_-3px_rgba(16,185,129,0.45)]"
                  : "text-gray-600 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Found</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                selectedType === "FOUND" ? "bg-emerald-700 text-white" : "bg-gray-200/60 dark:bg-[#2a2a30] text-gray-700 dark:text-neutral-300"
              }`}>
                {foundCount}
              </span>
            </button>
          </div>

          {/* Zone Selector & Sort Options */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Campus Zone Select */}
            <div className="relative">
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="appearance-none bg-gray-50 dark:bg-[#141416] text-gray-800 dark:text-neutral-200 text-xs font-semibold px-3.5 py-2.5 pr-8 rounded-xl border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-[#ff7d0c]/30 cursor-pointer"
              >
                {POPULAR_ZONES.map((zone) => (
                  <option key={zone} value={zone} className="dark:bg-[#141416]">
                    {zone}
                  </option>
                ))}
              </select>
              <Building2 className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-neutral-500 pointer-events-none" />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none bg-gray-50 dark:bg-[#141416] text-gray-800 dark:text-neutral-200 text-xs font-semibold px-3.5 py-2.5 pr-8 rounded-xl border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-[#ff7d0c]/30 cursor-pointer"
              >
                <option value="NEWEST" className="dark:bg-[#141416]">Newest First</option>
                <option value="OLDEST" className="dark:bg-[#141416]">Oldest First</option>
                <option value="NAME" className="dark:bg-[#141416]">Alphabetical (A-Z)</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-neutral-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Category Pills Carousel */}
        <div className="mt-5 pt-4 border-t border-gray-100 dark:border-white/10">
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORY_CONFIG.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory.toLowerCase() === cat.id.toLowerCase();
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 flex items-center space-x-1.5 cursor-pointer ${
                    isSelected
                      ? "bg-neutral-900 text-white dark:bg-[#FF7D0C] dark:text-white shadow-sm dark:shadow-[0_0_15px_-2px_rgba(255,125,12,0.4)]"
                      : "bg-neutral-100/80 dark:bg-[#141416] text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/70 dark:hover:bg-[#18181c] border border-transparent dark:border-white/5"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Filters Bar */}
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.15 }}
              className="mt-4 pt-3 border-t border-neutral-100 dark:border-white/10 flex flex-wrap items-center gap-2 text-xs"
            >
              <span className="text-neutral-500 dark:text-neutral-400 font-medium">
                Active filters ({filteredItems.length} {filteredItems.length === 1 ? "match" : "matches"}):
              </span>

              {searchQuery && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-[#f79b4a] border border-orange-200 dark:border-orange-500/30">
                  Search: "{searchQuery}"
                  <button onClick={() => setSearchQuery("")} className="ml-1.5 hover:text-orange-900 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedType !== "ALL" && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-[#18181c] text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-white/10">
                  Type: {selectedType}
                  <button onClick={() => setSelectedType("ALL")} className="ml-1.5 hover:text-neutral-900 dark:hover:text-white cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedCategory !== "ALL" && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-[#18181c] text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-white/10">
                  Category: {selectedCategory}
                  <button onClick={() => setSelectedCategory("ALL")} className="ml-1.5 hover:text-neutral-900 dark:hover:text-white cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedZone !== "All Campus Zones" && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-[#18181c] text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-white/10">
                  Zone: {selectedZone}
                  <button onClick={() => setSelectedZone("All Campus Zones")} className="ml-1.5 hover:text-neutral-900 dark:hover:text-white cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              <button
                onClick={handleResetFilters}
                className="inline-flex items-center text-orange-600 dark:text-[#f79b4a] hover:underline font-semibold ml-auto cursor-pointer"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Reset all
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results Header / Status Bar */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-neutral-400 px-1">
        <span>
          Showing <strong className="text-gray-900 dark:text-white font-bold">{filteredItems.length}</strong> active {filteredItems.length === 1 ? "item" : "items"}
        </span>
        <span>
          Verified handover protection active
        </span>
      </div>

      {/* Grid or Empty State */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#141416] rounded-3xl border border-gray-200/80 dark:border-white/10 shadow-sm max-w-lg mx-auto p-8">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 dark:bg-orange-950/50 text-[#ff7d0c] dark:text-[#f79b4a] flex items-center justify-center mx-auto mb-4 border border-orange-100 dark:border-orange-500/30">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">No matching items found</h3>
          <p className="text-gray-500 dark:text-neutral-400 text-xs md:text-sm mt-1 max-w-sm mx-auto leading-relaxed">
            {hasActiveFilters 
              ? "We couldn't find any items matching your active search terms or category filters."
              : "No items are currently active on the board."}
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5">
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="w-full sm:w-auto text-xs bg-gray-100 hover:bg-gray-200 dark:bg-[#18181c] dark:hover:bg-[#202025] text-gray-800 dark:text-neutral-200 px-4 py-2.5 rounded-xl font-semibold transition-colors cursor-pointer"
              >
                Clear all filters
              </button>
            )}
            <Link
              href="/items/lost/new"
              className="w-full sm:w-auto text-xs bg-gray-900 dark:bg-[#202025] text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-[#282830] transition-colors"
            >
              Report Lost Item
            </Link>
            <Link
              href="/items/found/new"
              className="btn-asym w-full sm:w-auto text-xs bg-[#FF7D0C] text-white px-4 py-2.5 font-bold hover:bg-[#ea6c00] transition-colors"
            >
              Report Found Item
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <Link 
              href={`/items/${item._id}`} 
              key={item._id} 
              className="group bg-white dark:bg-[#141416] rounded-2xl border border-gray-200/80 dark:border-white/10 overflow-hidden hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-orange-500/5 hover:border-orange-300 dark:hover:border-[#ff7d0c]/50 transition-all duration-300 flex flex-col hover:-translate-y-1"
            >
              <div className="aspect-square bg-gray-100 dark:bg-[#1a1a1e] relative overflow-hidden">
                {item.images && item.images.length > 0 ? (
                  <img 
                    src={item.images[0].url} 
                    alt={item.itemName} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-neutral-500 bg-gray-50 dark:bg-[#18181c]">
                    <Search className="w-8 h-8 opacity-40 mb-1" />
                    <span className="text-xs">No Photo Available</span>
                  </div>
                )}
                
                {/* Type Badge */}
                <div className={`absolute top-3 right-3 px-2.5 py-1 text-[11px] font-black tracking-wide rounded-full shadow-sm ${
                  item.type === 'LOST' 
                    ? 'bg-red-500 text-white shadow-red-500/30' 
                    : 'bg-emerald-600 text-white shadow-emerald-600/30'
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
                <h3 className="font-bold text-base text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-[#f79b4a] transition-colors line-clamp-1">
                  {item.itemName}
                </h3>
                
                <div className="text-xs text-gray-500 dark:text-neutral-400 flex items-center mt-2.5">
                  <Tag className="w-3.5 h-3.5 mr-1.5 text-[#FF7D0C] dark:text-[#f79b4a] shrink-0" /> 
                  <span className="font-medium text-gray-700 dark:text-neutral-300">{item.category}</span>
                </div>

                <div className="text-xs text-gray-500 dark:text-neutral-400 flex items-center mt-1.5">
                  <MapPin className="w-3.5 h-3.5 mr-1.5 text-gray-400 shrink-0" /> 
                  <span className="truncate">{item.location}</span>
                </div>

                <div className="text-xs text-gray-500 dark:text-neutral-400 flex items-center mt-1.5 mb-4">
                  <Calendar className="w-3.5 h-3.5 mr-1.5 text-gray-400 shrink-0" /> 
                  <span>{item.date ? format(new Date(item.date), 'MMM d, yyyy') : 'Recently'}</span>
                </div>

                <div className="mt-auto pt-3 border-t border-gray-100 dark:border-white/10 flex items-center justify-between">
                  <div className="flex items-center min-w-0">
                    {item.userId?.avatar ? (
                      <img src={item.userId.avatar} alt={item.userId.name} className="w-5 h-5 rounded-full mr-2 object-cover border border-gray-200 dark:border-white/10" />
                    ) : (
                      <div className="w-5 h-5 bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-[#f79b4a] rounded-full mr-2 flex items-center justify-center text-[10px] font-bold">
                        {item.userId?.name?.charAt(0) || '?'}
                      </div>
                    )}
                    <span className="text-xs text-gray-600 dark:text-neutral-400 truncate">{item.userId?.name || 'Student'}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-orange-600 dark:group-hover:text-[#f79b4a] group-hover:translate-x-1 transition-all shrink-0" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
