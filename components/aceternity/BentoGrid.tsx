"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[19rem] grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
  badge,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: string;
}) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "row-span-1 rounded-3xl group/bento hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-[0_0_30px_-5px_rgba(255,125,12,0.15)] transition duration-300 p-6 bg-white dark:bg-[#141416] border border-gray-200/80 dark:border-white/10 dark:hover:border-[#ff7d0c]/40 justify-between flex flex-col space-y-4 relative overflow-hidden backdrop-blur-xs",
        className
      )}
    >
      {/* Subtle background glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/40 via-amber-50/20 to-transparent dark:from-orange-950/20 dark:via-transparent dark:to-transparent opacity-0 group-hover/bento:opacity-100 transition duration-500 pointer-events-none" />

      {header}

      <div className="group-hover/bento:translate-x-1 transition duration-200 relative z-10">
        <div className="flex items-center justify-between mb-3">
          {icon}
          {badge && (
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-[#f79b4a] border border-orange-200 dark:border-orange-500/30">
              {badge}
            </span>
          )}
        </div>
        <div className="font-bold text-gray-900 dark:text-white text-lg mb-1 tracking-tight">
          {title}
        </div>
        <div className="font-normal text-gray-500 dark:text-neutral-400 text-sm leading-relaxed">
          {description}
        </div>
      </div>
    </motion.div>
  );
};
