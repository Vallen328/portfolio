"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface BrandLogoProps {
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  ariaLabel?: string;
}

export function BrandLogo({ onClick, ariaLabel = "Go to home" }: BrandLogoProps) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.05, rotate: 2 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="relative flex items-center justify-center cursor-pointer group outline-none"
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick(e as unknown as React.MouseEvent<HTMLDivElement>);
        }
      }}
    >
      {/* Premium logo container - Desktop: 40px, Mobile: 34px */}
      <div className="relative h-10 w-10 md:h-[34px] md:w-[34px] flex items-center justify-center rounded-lg transition-all duration-300">
        {/* Logo Image - maximizes container space */}
        <Image
          src="/logo.svg"
          alt={ariaLabel}
          width={40}
          height={40}
          priority
          quality={100}
          className="h-full w-full object-contain object-center"
        />

        {/* Premium glow effect - elegant and subtle */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-primary/0 via-primary/0 to-white/0 group-hover:from-primary/5 group-hover:via-primary/8 group-hover:to-white/10 dark:group-hover:to-white/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Soft focus glow backdrop */}
        <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-lg shadow-primary/0 group-hover:shadow-primary/10 dark:group-hover:shadow-white/5" />

        {/* Refined border ring on hover */}
        <div className="absolute inset-0 rounded-lg ring-1 ring-transparent group-hover:ring-white/20 dark:group-hover:ring-white/30 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none" />
      </div>
    </motion.div>
  );
}
