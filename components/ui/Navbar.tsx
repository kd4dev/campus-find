"use client";

import Link from "next/link";
import { useAuth, UserButton } from "@clerk/nextjs";
import { Menu, X, Search, PlusCircle, Bell, MessageSquare, LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/theme/ThemeToggle";

export default function Navbar() {
  const { isSignedIn } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

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
    const interval = setInterval(checkUnread, 12000);
    return () => clearInterval(interval);
  }, [isSignedIn]);

  const navLinks = [
    { href: "/items", label: "Find Items", icon: <Search className="w-4 h-4 mr-1.5" /> },
    { href: "/items/lost/new", label: "Report Lost", icon: <PlusCircle className="w-4 h-4 mr-1.5" /> },
    { href: "/items/found/new", label: "Report Found", icon: <PlusCircle className="w-4 h-4 mr-1.5" /> },
  ];

  return (
    <nav className="fixed top-0 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200/80 dark:border-slate-800/80 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-6">
            <Link 
              href="/" 
              className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 tracking-tight"
            >
              CampusFind
            </Link>
            
            <div className="hidden md:flex space-x-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3.5 py-1.5 rounded-full text-sm font-medium flex items-center transition-all ${
                      isActive
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-slate-800/60"
                    }`}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-2.5">
            {/* Theme Toggle */}
            <ThemeToggle />

            {isSignedIn ? (
              <>
                <Link 
                  href="/dashboard" 
                  className={`p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-slate-800 transition-colors ${
                    pathname === '/dashboard' ? 'bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white' : ''
                  }`}
                  title="Dashboard"
                >
                  <LayoutDashboard className="w-5 h-5" />
                </Link>
                <Link 
                  href="/messages" 
                  className={`p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-slate-800 transition-colors ${
                    pathname.startsWith('/messages') ? 'bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white' : ''
                  }`}
                  title="Messages"
                >
                  <MessageSquare className="w-5 h-5" />
                </Link>
                <Link 
                  href="/notifications" 
                  className={`p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-slate-800 transition-colors relative ${
                    pathname === '/notifications' ? 'bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white' : ''
                  }`}
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
                  )}
                </Link>
                <div className="pl-2 border-l border-gray-200 dark:border-slate-800">
                  <UserButton />
                </div>
              </>
            ) : (
              <>
                <Link 
                  href="/sign-in" 
                  className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  href="/sign-up" 
                  className="bg-gray-900 text-white dark:bg-blue-600 dark:hover:bg-blue-500 text-sm px-4 py-2 rounded-full font-medium hover:bg-gray-800 transition-all hover:scale-105 active:scale-95 shadow-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu and theme toggle */}
          <div className="flex items-center space-x-2 md:hidden">
            <ThemeToggle />
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 overflow-hidden"
          >
            <div className="px-4 pt-3 pb-5 space-y-1.5">
              <Link href="/items" className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl">Find Items</Link>
              <Link href="/items/lost/new" className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl">Report Lost</Link>
              <Link href="/items/found/new" className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl">Report Found</Link>
              {isSignedIn ? (
                <>
                  <Link href="/dashboard" className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl">Dashboard</Link>
                  <Link href="/messages" className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl">Messages</Link>
                  <Link href="/notifications" className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl flex items-center justify-between">
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
                <div className="pt-2 flex flex-col gap-2">
                  <Link href="/sign-in" className="block text-center px-4 py-2 text-sm font-medium border border-gray-200 dark:border-slate-800 text-gray-800 dark:text-gray-200 rounded-xl">Sign In</Link>
                  <Link href="/sign-up" className="block text-center px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-xl">Sign Up</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
