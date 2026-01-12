
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { ShirtIcon, InfoIcon } from './icons';

interface HeaderProps {
  onShowHowItWorks: () => void;
}

const Header: React.FC<HeaderProps> = ({ onShowHowItWorks }) => {
  return (
    <header className="w-full py-3 md:py-5 px-4 md:px-8 bg-white border-b border-[#E3DCD1] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3 md:gap-4">
            <div className="bg-[#B8A66F] p-1.5 md:p-2 rounded-lg shadow-sm flex-shrink-0">
              <ShirtIcon className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <div className="flex flex-col">
                <h1 className="text-lg md:text-2xl font-serif font-bold tracking-tight text-[#3D3D3D] leading-none uppercase">
                  Michael Andrews
                </h1>
                <span className="text-[8px] md:text-xs font-sans tracking-[0.2em] md:tracking-[0.3em] uppercase text-[#B8A66F] font-bold mt-0.5 md:mt-1">
                  Bespoke · New York
                </span>
            </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden lg:inline text-[10px] uppercase tracking-widest text-gray-400 font-bold mr-4">
            New York's Best Bespoke Tailor
          </span>
          <button 
            onClick={onShowHowItWorks}
            className="flex items-center justify-center w-8 h-8 md:w-auto md:gap-2 md:px-4 md:py-2 rounded-full border border-gray-100 hover:border-[#B8A66F] text-[#3D3D3D] hover:text-[#B8A66F] transition-all"
            title="Our Workflow"
          >
            <InfoIcon className="w-5 h-5 md:w-4 md:h-4" />
            <span className="hidden sm:inline text-xs font-bold uppercase tracking-widest">Our Workflow</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
