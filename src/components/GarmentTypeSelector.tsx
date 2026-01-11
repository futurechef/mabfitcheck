import React from 'react';
import type { GarmentType } from '../types';

interface GarmentTypeSelectorProps {
    onSelected: (type: GarmentType) => void;
    onBack: () => void;
}

export const GarmentTypeSelector: React.FC<GarmentTypeSelectorProps> = ({ onSelected, onBack }) => {
    return (
        <div className="flex flex-col h-full bg-[#F9F7F4] overflow-y-auto">
            <div className="p-8 md:p-12 bg-white border-b border-[#EAEAEA] shadow-sm flex justify-between items-center">
                <div>
                    <h3 className="text-3xl font-serif text-[#1A1A1A] mb-2">Commissions</h3>
                    <p className="text-[10px] text-[#9A8A55] font-bold tracking-[0.3em] uppercase">Step 3: Intent</p>
                </div>
                <button onClick={onBack} className="text-[#666] text-[10px] font-bold uppercase tracking-widest hover:text-[#1A1A1A]">← Back</button>
            </div>

            <div className="flex-grow flex items-center justify-center p-6 md:p-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
                    {/* Shirt Only */}
                    <div
                        onClick={() => onSelected('shirt')}
                        className="group bg-white h-96 border border-[#EAEAEA] p-10 flex flex-col items-center justify-center hover:border-[#B8A66F] hover:shadow-2xl transition-all cursor-pointer relative overflow-hidden"
                    >
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-[#B8A66F] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                        <span className="text-4xl mb-6 grayscale group-hover:grayscale-0 transition-all opacity-50 group-hover:opacity-100">👔</span>
                        <h4 className="text-2xl font-serif text-[#1A1A1A] mb-2">Custom Shirt</h4>
                        <p className="text-xs text-center text-[#666] max-w-[200px] leading-relaxed">
                            Shirt only — no jacket or suit. Choose your fabric, collar, and cuff style.
                        </p>
                    </div>

                    {/* Suit Only */}
                    <div
                        onClick={() => onSelected('suit')}
                        className="group bg-white h-96 border border-[#EAEAEA] p-10 flex flex-col items-center justify-center hover:border-[#B8A66F] hover:shadow-2xl transition-all cursor-pointer relative overflow-hidden"
                    >
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-[#B8A66F] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                        <span className="text-4xl mb-6 grayscale group-hover:grayscale-0 transition-all opacity-50 group-hover:opacity-100">🕴️</span>
                        <h4 className="text-2xl font-serif text-[#1A1A1A] mb-2">Bespoke Suit</h4>
                        <p className="text-xs text-center text-[#666] max-w-[200px] leading-relaxed">
                            Commission a full bespoke suit. Select from our curated seasonal collections.
                        </p>
                    </div>

                    {/* Ensemble */}
                    <div
                        onClick={() => onSelected('both')}
                        className="group bg-[#1A1A1A] h-96 border border-[#1A1A1A] p-10 flex flex-col items-center justify-center hover:shadow-2xl transition-all cursor-pointer relative overflow-hidden"
                    >
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                        <span className="text-4xl mb-6 opacity-80">✨</span>
                        <h4 className="text-2xl font-serif text-white mb-2">Full Ensemble</h4>
                        <p className="text-xs text-center text-white/60 max-w-[200px] leading-relaxed">
                            The complete experience. Pair a custom shirt with a bespoke suit for a total look.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
