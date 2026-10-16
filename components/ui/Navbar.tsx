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
    { href: "/items", label: "Find Items", icon: <Search className="w-3.5 h-3.5 mr-1.5" /> },
    { href: "/items/lost/new", label: "Report Lost", icon: <PlusCircle className="w-3.5 h-3.5 mr-1.5" /> },
    { href: "/items/found/new", label: "Report Found", icon: <PlusCircle className="w-3.5 h-3.5 mr-1.5" /> },
  ];

  return (
    <nav className="fixed top-0 w-full bg-white/80 dark:bg-[#080c14]/90 backdrop-blur-xl border-b border-gray-200/80 dark:border-slate-800/80 dark:border-t dark:border-t-blue-500/20 z-50 transition-colors shadow-sm dark:shadow-[0_4px_30px_-5px_rgba(0,0,0,0.7)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Brand Logo & Emblem Mark */}
          <div className="flex items-center space-x-6">
            <Link 
              href="/" 
              className="flex items-center space-x-3 group cursor-pointer"
            >
              {/* Bespoke CampusFind Logo Emblem */}
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[1.5px] shadow-[0_2px_10px_rgba(59,130,246,0.3)] dark:shadow-[0_0_20px_-3px_rgba(59,130,246,0.6)] group-hover:shadow-[0_0_25px_rgba(59,130,246,0.75)] transition-all duration-300">
                <div className="w-full h-full rounded-[10px] bg-white dark:bg-[#0b1120] flex items-center justify-center relative overflow-hidden">
                  {/* Subtle interior gradient sweep */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-500/10 dark:from-blue-500/25 dark:to-cyan-400/20" />
                  
                  {/* Custom Modern Beacon Vector Icon */}
                  <svg 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    className="w-5 h-5 text-blue-600 dark:text-cyan-400 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-6deg] drop-shadow-sm"
                  >
                    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                    <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="11" cy="11" r="2.5" fill="currentColor" className="opacity-90 animate-pulse" />
                    <path d="M19 4L19.8 6.2L22 7L19.8 7.8L19 10L18.2 7.8L16 7L18.2 6.2Z" fill="url(#cf-sparkle-grad)" />
                    <defs>
                      <linearGradient id="cf-sparkle-grad" x1="16" y1="4" x2="22" y2="10" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#38BDF8" />
                        <stop offset="1" stopColor="#818CF8" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>

              {/* Brand Typography with Network Beacon */}
              <div className="flex flex-col">
                <div className="flex items-center space-x-1.5">
                  <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                    Campus<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 dark:from-blue-400 dark:via-cyan-300 dark:to-indigo-300">Find</span>
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.9)] inline-block" title="Live Campus Network Active" />
                </div>
                <span className="hidden xl:block text-[9px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300 -mt-0.5">
                  Verified Handover
                </span>
              </div>
            </Link>
            
            {/* Desktop Navigation Links with Aceternity Animated Active Pill */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-4 py-1.5 rounded-full text-xs font-semibold flex items-center transition-colors z-10 ${
                      isActive
                        ? "text-blue-700 dark:text-blue-300"
                        : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="navbar-active-pill"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="absolute inset-0 rounded-full bg-blue-50/90 dark:bg-blue-950/70 border border-blue-200/80 dark:border-blue-800/70 dark:shadow-[0_0_15px_-3px_rgba(59,130,246,0.35)] -z-10"
                      />
                    )}
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Action Icons & Auth */}
          <div className="hidden md:flex items-center space-x-2.5">
            {/* Theme Toggle */}
            <ThemeToggle />

            {isSignedIn ? (
              <>
                <Link 
                  href="/dashboard" 
                  className={`p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/70 transition-colors ${
                    pathname === '/dashboard' ? 'bg-gray-100 dark:bg-slate-800/80 dark:border dark:border-slate-700/60 text-gray-900 dark:text-white' : ''
                  }`}
                  title="Dashboard"
                >
                  <LayoutDashboard className="w-5 h-5" />
                </Link>
                <Link 
                  href="/messages" 
                  className={`p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/70 transition-colors ${
                    pathname.startsWith('/messages') ? 'bg-gray-100 dark:bg-slate-800/80 dark:border dark:border-slate-700/60 text-gray-900 dark:text-white' : ''
                  }`}
                  title="Messages"
                >
                  <MessageSquare className="w-5 h-5" />
                </Link>
                <Link 
                  href="/notifications" 
                  className={`p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/70 transition-colors relative ${
                    pathname === '/notifications' ? 'bg-gray-100 dark:bg-slate-800/80 dark:border dark:border-slate-700/60 text-gray-900 dark:text-white' : ''
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
                  className="text-gray-700 hover:text-gray-900 dark:text-slate-300 dark:hover:text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800/70 transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  href="/sign-up" 
                  className="relative inline-flex items-center justify-center p-[1px] overflow-hidden rounded-full font-medium transition-all hover:scale-105 active:scale-95 shadow-sm dark:shadow-[0_0_20px_-3px_rgba(59,130,246,0.5)] group cursor-pointer"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-400 rounded-full group-hover:opacity-90" />
                  <span className="relative px-4 py-1.5 rounded-full bg-slate-900 dark:bg-blue-600 text-white text-xs font-bold transition-all flex items-center">
                    Sign Up
                  </span>
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
            className="md:hidden bg-white/95 dark:bg-[#0c1322]/98 backdrop-blur-md border-b border-gray-200 dark:border-slate-800/80 overflow-hidden shadow-xl"
          >
            <div className="px-4 pt-3 pb-5 space-y-1.5">
              <Link href="/items" className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800/70 rounded-xl transition-colors">Find Items</Link>
              <Link href="/items/lost/new" className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800/70 rounded-xl transition-colors">Report Lost</Link>
              <Link href="/items/found/new" className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800/70 rounded-xl transition-colors">Report Found</Link>
              {isSignedIn ? (
                <>
                  <Link href="/dashboard" className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800/70 rounded-xl transition-colors">Dashboard</Link>
                  <Link href="/messages" className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800/70 rounded-xl transition-colors">Messages</Link>
                  <Link href="/notifications" className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800/70 rounded-xl transition-colors flex items-center justify-between">
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
                  <Link href="/sign-in" className="block text-center px-4 py-2 text-sm font-medium border border-gray-200 dark:border-slate-700/80 text-gray-800 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800/60 rounded-xl transition-colors">Sign In</Link>
                  <Link href="/sign-up" className="block text-center px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-sm dark:shadow-[0_0_15px_-3px_rgba(59,130,246,0.5)] transition-all">Sign Up</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

