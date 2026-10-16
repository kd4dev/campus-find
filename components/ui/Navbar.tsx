"use client";

import Link from "next/link";
import { useAuth, UserButton } from "@clerk/nextjs";
import { Menu, Search, PlusCircle, Bell, MessageSquare, LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { isSignedIn } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!isSignedIn) return;

    const checkUnread = async () => {
      try {
        const res = await fetch("/api/notifications/count");
        if (res.ok) {
          const data = await res.json();
          setUnreadCount(data.count || 0);
        }
      } catch (e) {
        // ignore error
      }
    };

    checkUnread();
    const interval = setInterval(checkUnread, 15000);
    return () => clearInterval(interval);
  }, [isSignedIn]);

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              CampusFind
            </Link>
            
            <div className="hidden md:flex ml-8 space-x-6">
              <Link href="/items" className="text-gray-600 hover:text-gray-900 flex items-center">
                <Search className="w-4 h-4 mr-1" /> Find Items
              </Link>
              <Link href="/items/lost/new" className="text-gray-600 hover:text-gray-900 flex items-center">
                <PlusCircle className="w-4 h-4 mr-1" /> Report Lost
              </Link>
              <Link href="/items/found/new" className="text-gray-600 hover:text-gray-900 flex items-center">
                <PlusCircle className="w-4 h-4 mr-1" /> Report Found
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isSignedIn ? (
              <>
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 p-1" title="Dashboard">
                  <LayoutDashboard className="w-5 h-5" />
                </Link>
                <Link href="/messages" className="text-gray-600 hover:text-gray-900 p-1" title="Messages">
                  <MessageSquare className="w-5 h-5" />
                </Link>
                <Link href="/notifications" className="text-gray-600 hover:text-gray-900 p-1 relative" title="Notifications">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
                  )}
                </Link>
                <UserButton />
              </>
            ) : (
              <>
                <Link href="/sign-in" className="text-gray-600 hover:text-gray-900 font-medium">
                  Sign In
                </Link>
                <Link href="/sign-up" className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-600 hover:text-gray-900">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/items" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md">Find Items</Link>
            <Link href="/items/lost/new" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md">Report Lost</Link>
            <Link href="/items/found/new" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md">Report Found</Link>
            {isSignedIn ? (
              <>
                <Link href="/dashboard" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md">Dashboard</Link>
                <Link href="/messages" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md">Messages</Link>
                <Link href="/notifications" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md flex items-center justify-between">
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                <div className="px-3 py-2">
                  <UserButton />
                </div>
              </>
            ) : (
              <>
                <Link href="/sign-in" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md">Sign In</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
