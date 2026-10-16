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
        "grid md:auto-rows-[20rem] grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto",
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
        "row-span-1 rounded-3xl group/bento hover:shadow-xl transition duration-300 p-6 bg-white border border-gray-200/80 justify-between flex flex-col space-y-4 relative overflow-hidden",
        className
      )}
    >
      {/* Subtle background glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-indigo-50/20 to-purple-50/40 opacity-0 group-hover/bento:opacity-100 transition duration-500 pointer-events-none" />

      {header}

      <div className="group-hover/bento:translate-x-1 transition duration-200 relative z-10">
        <div className="flex items-center justify-between mb-2">
          {icon}
          {badge && (
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
              {badge}
            </span>
          )}
        </div>
        <div className="font-bold text-gray-900 text-lg mb-1 tracking-tight">
          {title}
        </div>
        <div className="font-normal text-gray-500 text-sm leading-relaxed">
          {description}
        </div>
      </div>
    </motion.div>
  );
};
