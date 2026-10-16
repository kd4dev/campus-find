"use client";

import { useState } from "react";
import Link from "next/link";
import { Laptop, Key, CreditCard, Backpack, Glasses, ArrowRight, Search, MapPin } from "lucide-react";

interface CategoryData {
  id: string;
  name: string;
  icon: any;
  count: number;
  examples: string[];
  recentItem: {
    name: string;
    location: string;
    time: string;
    status: string;
  };
}

const CATEGORIES: CategoryData[] = [
  {
    id: "ELECTRONICS",
    name: "Electronics",
    icon: Laptop,
    count: 24,
    examples: ["AirPods Pro", "MacBook Chargers", "TI-84 Plus", "iPad Air"],
    recentItem: {
      name: "Sony Noise-Cancelling Headphones",
      location: "Library West, Cubicle 12",
      time: "45m ago",
      status: "FOUND"
    }
  },
  {
    id: "KEYS",
    name: "Keys & Dorm Fobs",
    icon: Key,
    count: 18,
    examples: ["Brass Room Keys", "Car Key Fobs", "Bike U-Lock Keys", "Lanyards"],
    recentItem: {
      name: "Blue Lanyard with 3 Room Keys",
      location: "Recreation Center Locker Room",
      time: "1h ago",
      status: "FOUND"
    }
  },
  {
    id: "CARDS",
    name: "IDs & Wallets",
    icon: CreditCard,
    count: 15,
    examples: ["Campus Student IDs", "Driver's Licenses", "Leather Wallets", "Transit Passes"],
    recentItem: {
      name: "Student ID (Freshman Dorm Resident)",
      location: "Dining Commons Tray Return",
      time: "2h ago",
      status: "FOUND"
    }
  },
  {
    id: "BAGS",
    name: "Bags & Backpacks",
    icon: Backpack,
    count: 12,
    examples: ["North Face Bookbags", "Gym Totes", "Laptop Sleeves", "Duffle Bags"],
    recentItem: {
      name: "Black Herschel Backpack",
      location: "Science Lecture Hall B",
      time: "3h ago",
      status: "LOST"
    }
  },
  {
    id: "OTHER",
    name: "Apparel & Personal Gear",
    icon: Glasses,
    count: 29,
    examples: ["Hydro Flasks", "Ray-Ban Sunglasses", "Winter Jackets", "Watches"],
    recentItem: {
      name: "Stainless Steel Stanley Cup (Sage)",
      location: "Student Union Lounge",
      time: "10m ago",
      status: "FOUND"
    }
  }
];

export default function CategoryExplorer() {
  const [selectedCat, setSelectedCat] = useState<string>("ELECTRONICS");

  const current = CATEGORIES.find((c) => c.id === selectedCat) || CATEGORIES[0];

  return (
    <section className="py-20 px-4 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            Campus Catalog
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-4 tracking-tight">
            Browse by item category.
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
            Filter active listings across high-traffic campus zones.
          </p>
        </div>

        <Link
          href="/items"
          className="inline-flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
        >
          <Search className="w-4 h-4 mr-1.5" />
          <span>View all campus categories &rarr;</span>
        </Link>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2.5 mb-8">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCat === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-md scale-105"
                  : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{cat.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                isActive 
                  ? "bg-white/20 dark:bg-slate-900/20 text-white dark:text-slate-950" 
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
              }`}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Category Spotlight Display Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
              Most frequently reported
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {current.count} listings reported this semester
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Common {current.name} on Campus
          </h3>

          <div className="flex flex-wrap gap-2 pt-1">
            {current.examples.map((ex, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium"
              >
                {ex}
              </span>
            ))}
          </div>
        </div>

        {/* Live Snippet Box */}
        <div className="w-full md:w-auto p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 shrink-0 min-w-[280px]">
          <div className="flex items-center justify-between text-[11px] mb-2">
            <span className="font-semibold text-slate-500 dark:text-slate-400">Latest Report</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              current.recentItem.status === "FOUND"
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                : "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
            }`}>
              {current.recentItem.status}
            </span>
          </div>

          <p className="font-bold text-sm text-slate-900 dark:text-white mb-1">
            {current.recentItem.name}
          </p>

          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center mb-3">
            <MapPin className="w-3 h-3 mr-1 text-slate-400 shrink-0" />
            <span className="truncate">{current.recentItem.location}</span>
          </p>

          <Link
            href="/items"
            className="block text-center py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            Filter {current.name} on Board &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
