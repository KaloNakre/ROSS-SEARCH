import React from 'react';
import diuLogoShield from '../assets/diu_logo_shield.png';

export const DiuLogo = ({ variant = 'light', size = 'md', className = '' }) => {
  // variant: 'light' (white/public navbar), 'dark' (sidebar/footer), 'icon-only'

  if (variant === 'icon-only') {
    return (
      <div className={`relative inline-flex items-center justify-center ${className}`}>
        <img
          src={diuLogoShield}
          alt="DIU"
          className="h-9 w-9 object-contain rounded-full shadow-sm"
          onError={(e) => {
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
            src={diuLogoShield}
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

  // Light variant — public navbar, login/register header
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img
        src={diuLogoShield}
        alt="Daffodil International University"
        className="h-10 object-contain"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
      <div className="flex flex-col leading-tight">
        <span className="text-diu-blue font-extrabold text-sm tracking-wide">Daffodil</span>
        <span className="text-slate-600 text-[10px] font-medium">International University</span>
      </div>
    </div>
  );
};

export default DiuLogo;
