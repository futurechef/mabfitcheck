
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
    <header className="w-full py-4 px-4 md:px-8 bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
            <ShirtIcon className="w-6 h-6 text-gray-700" />
            <div className="flex flex-col">
                <h1 className="text-lg md:text-xl font-serif font-bold tracking-tight text-gray-900 leading-none">
                  Michael Andrews
                </h1>
                <span className="text-[10px] md:text-xs font-sans tracking-[0.2em] uppercase text-gray-500 font-medium">
                  Bespoke Fit Check
                </span>
            </div>
        </div>
        <button 
          onClick={onShowHowItWorks}
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors px-3 py-1.5 rounded-full hover:bg-gray-100"
        >
          <InfoIcon className="w-4 h-4" />
          <span className="hidden sm:inline">How it works</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
