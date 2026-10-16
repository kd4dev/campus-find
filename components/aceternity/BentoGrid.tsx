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
        "row-span-1 rounded-3xl group/bento hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-blue-500/5 transition duration-300 p-6 bg-white dark:bg-slate-900/90 border border-gray-200/80 dark:border-slate-800/80 justify-between flex flex-col space-y-4 relative overflow-hidden backdrop-blur-xs",
        className
      )}
    >
      {/* Subtle background glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50 dark:from-blue-950/30 dark:via-indigo-950/20 dark:to-purple-950/30 opacity-0 group-hover/bento:opacity-100 transition duration-500 pointer-events-none" />

      {header}

      <div className="group-hover/bento:translate-x-1 transition duration-200 relative z-10">
        <div className="flex items-center justify-between mb-3">
          {icon}
          {badge && (
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-100 dark:border-blue-900/50">
              {badge}
            </span>
          )}
        </div>
        <div className="font-bold text-gray-900 dark:text-white text-lg mb-1 tracking-tight">
          {title}
        </div>
        <div className="font-normal text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
          {description}
        </div>
      </div>
    </motion.div>
  );
};
