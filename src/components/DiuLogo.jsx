import React from 'react';

export const DiuLogo = ({ variant = 'light', size = 'md', className = '' }) => {
  // variant: 'light' (white background), 'dark' (dark navy background), 'icon-only'
  
  if (variant === 'icon-only') {
    return (
      <div className={`relative inline-flex items-center justify-center ${className}`}>
        <img
          src="/assets/diu_logo_sidebar.png"
          alt="DIU"
          className="h-9 w-9 object-contain rounded-full shadow-sm"
          onError={(e) => {
            // Fallback SVG if image not found
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
    );
  }

  if (variant === 'dark') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="w-10 h-10 rounded-full bg-white/10 p-1 flex items-center justify-center shrink-0 border border-white/20">
          <img
            src="/assets/diu_logo_sidebar.png"
            alt="DIU Shield"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-white font-extrabold tracking-wider text-base uppercase leading-tight">
            ROSS-SEARCH
          </span>
          <span className="text-blue-200/70 text-[10px] font-medium tracking-tight">
            Daffodil Int. University
          </span>
        </div>
      </div>
    );
  }

  // Light variant (as on Landing Page and Registration headers)
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img
        src="/assets/diu_logo_light.png"
        alt="Daffodil International University"
        className="h-10 object-contain"
      />
    </div>
  );
};

export default DiuLogo;

