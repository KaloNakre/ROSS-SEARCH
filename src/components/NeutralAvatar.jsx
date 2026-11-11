import React from 'react';
import { User, ImageOff } from 'lucide-react';

export const NeutralAvatar = ({
  src = null,
  alt = "Neutral User Placeholder",
  size = "md", // "sm", "md", "lg", "xl", "card"
  showLabel = false,
  className = ""
}) => {
  const sizeMap = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-16 h-16 text-base",
    xl: "w-28 h-28 text-lg",
    card: "w-36 h-36 text-base"
  };

  const iconSizeMap = {
    sm: 16,
    md: 20,
    lg: 28,
    xl: 44,
    card: 52
  };

  // If a user has uploaded a custom image:
  if (src) {
    return (
      <div className={`relative rounded-xl overflow-hidden border-2 border-diu-blue/20 bg-slate-100 flex items-center justify-center shrink-0 ${sizeMap[size]} ${className}`}>
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // Strictly neutral empty placeholder (no stock portraits or generated humans)
  return (
    <div
      className={`relative rounded-xl border border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-slate-400 shrink-0 select-none ${sizeMap[size]} ${className}`}
      title="No profile photo uploaded"
    >
      <User size={iconSizeMap[size]} className="text-slate-400 stroke-[1.5]" />
      {showLabel && (
        <span className="text-[11px] font-medium text-slate-400 mt-1 flex items-center gap-1">
          <ImageOff size={12} /> No Image
        </span>
      )}
    </div>
  );
};

export default NeutralAvatar;

