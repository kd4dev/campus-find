"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon, Laptop, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={containerRef}>
      <motion.button
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Toggle theme"
        aria-expanded={open}
        className="cursor-pointer p-2 rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:text-white dark:hover:bg-white/[0.06] transition-colors border border-neutral-200/80 dark:border-white/10 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#ff7d0c]/40"
      >
        <AnimatePresence mode="wait" initial={false}>
          {resolvedTheme === "dark" ? (
            <motion.div
              key="moon"
              initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.18 }}
            >
              <Moon className="w-4 h-4 text-[#f79b4a]" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ rotate: 90, opacity: 0, scale: 0.7 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -90, opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.18 }}
            >
              <Sun className="w-4 h-4 text-amber-500" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-36 rounded-2xl bg-white dark:bg-[#141416] border border-neutral-200/80 dark:border-white/10 shadow-xl p-1.5 z-50 overflow-hidden"
          >
            <button
              onClick={() => {
                setTheme("light");
                setOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl transition-colors cursor-pointer ${
                theme === "light"
                  ? "bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-[#f79b4a]"
                  : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-white/5"
              }`}
            >
              <span className="flex items-center gap-2">
                <Sun className="w-3.5 h-3.5 text-amber-500" /> Light
              </span>
              {theme === "light" && <Check className="w-3.5 h-3.5 text-orange-600 dark:text-[#f79b4a]" />}
            </button>

            <button
              onClick={() => {
                setTheme("dark");
                setOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl transition-colors cursor-pointer ${
                theme === "dark"
                  ? "bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-[#f79b4a]"
                  : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-white/5"
              }`}
            >
              <span className="flex items-center gap-2">
                <Moon className="w-3.5 h-3.5 text-[#f79b4a]" /> Dark
              </span>
              {theme === "dark" && <Check className="w-3.5 h-3.5 text-orange-600 dark:text-[#f79b4a]" />}
            </button>

            <button
              onClick={() => {
                setTheme("system");
                setOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl transition-colors cursor-pointer ${
                theme === "system"
                  ? "bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-[#f79b4a]"
                  : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-white/5"
              }`}
            >
              <span className="flex items-center gap-2">
                <Laptop className="w-3.5 h-3.5 text-neutral-400" /> System
              </span>
              {theme === "system" && <Check className="w-3.5 h-3.5 text-orange-600 dark:text-[#f79b4a]" />}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
