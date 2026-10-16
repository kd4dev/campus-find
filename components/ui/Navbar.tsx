"use client";

import Link from "next/link";
import { useAuth, UserButton } from "@clerk/nextjs";
import { Menu, X, Search, PlusCircle, Bell, MessageSquare, LayoutDashboard, ArrowUpRight } from "lucide-react";
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
    <nav className="fixed top-0 w-full bg-white/85 dark:bg-[#0a0e17]/90 backdrop-blur-md border-b border-neutral-200/80 dark:border-white/10 z-50 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* ChaiCode-Style Brand Logo: Clean Monochrome + Signature #FF7D0C Accent */}
          <div className="flex items-center space-x-6">
            <Link 
              href="/" 
              className="flex items-center space-x-2.5 group cursor-pointer"
            >
              {/* Minimalist Rocking Search Beacon Icon */}
              <motion.div
                className="relative flex items-center justify-center size-9 rounded-xl border border-neutral-200/90 dark:border-white/10 bg-neutral-100/70 dark:bg-white/[0.04] text-neutral-900 dark:text-white transition-all group-hover:border-[#FF7D0C]/50"
                animate={{ rotate: [-2.5, 2.5, -2.5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-neutral-900 dark:text-white transition-transform group-hover:scale-105">
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                  <path d="M16.5 16.5L20.5 20.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                  {/* Signature ChaiCode Orange Beacon Dot */}
                  <circle cx="11" cy="11" r="2.5" fill="#FF7D0C" className="dark:fill-[#f79b4a]" />
                </svg>
              </motion.div>

              {/* Wordmark with Signature ChaiCode Bouncing Dot */}
              <div className="flex items-center space-x-1">
                <span className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                  CampusFind
                </span>
                <span 
                  className="w-2 h-2 rounded-full bg-[#FF7D0C] dark:bg-[#f79b4a] inline-block motion-safe:animate-chai-bounce"
                  title="Campus Live Network"
                />
              </div>
            </Link>
            
            {/* Desktop Navigation Links with Warm Chai Pill */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-4 py-1.5 rounded-full text-xs font-semibold flex items-center transition-colors z-10 ${
                      isActive
                        ? "text-orange-600 dark:text-[#f79b4a]"
                        : "text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:bg-neutral-100/70 dark:hover:bg-white/[0.05]"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="navbar-active-pill"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="absolute inset-0 rounded-full bg-orange-500/10 dark:bg-orange-500/15 border border-orange-500/25 dark:border-orange-400/20 shadow-xs -z-10"
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
                  className={`p-2 rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:text-white dark:hover:bg-white/[0.06] transition-colors ${
                    pathname === '/dashboard' ? 'bg-neutral-100 dark:bg-white/[0.08] dark:border dark:border-white/10 text-neutral-900 dark:text-white' : ''
                  }`}
                  title="Dashboard"
                >
                  <LayoutDashboard className="w-5 h-5" />
                </Link>
                <Link 
                  href="/messages" 
                  className={`p-2 rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:text-white dark:hover:bg-white/[0.06] transition-colors ${
                    pathname.startsWith('/messages') ? 'bg-neutral-100 dark:bg-white/[0.08] dark:border dark:border-white/10 text-neutral-900 dark:text-white' : ''
                  }`}
                  title="Messages"
                >
                  <MessageSquare className="w-5 h-5" />
                </Link>
                <Link 
                  href="/notifications" 
                  className={`p-2 rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:text-white dark:hover:bg-white/[0.06] transition-colors relative ${
                    pathname === '/notifications' ? 'bg-neutral-100 dark:bg-white/[0.08] dark:border dark:border-white/10 text-neutral-900 dark:text-white' : ''
                  }`}
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#FF7D0C] rounded-full ring-2 ring-white dark:ring-[#0a0e17] animate-pulse" />
                  )}
                </Link>
                <div className="pl-2 border-l border-neutral-200 dark:border-white/10">
                  <UserButton />
                </div>
              </>
            ) : (
              <>
                <Link 
                  href="/sign-in" 
                  className="text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white text-xs font-semibold px-3.5 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/[0.06] transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  href="/sign-up" 
                  className="btn-asym bg-neutral-900 text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-neutral-200 text-xs px-4 py-2 font-bold transition-all shadow-sm flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <span>Sign Up</span>
                  <ArrowUpRight className="w-3.5 h-3.5 -ml-0.5" />
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

