import React from 'react';
import type { SuitData } from '../types';

interface ProcessingProps {
    selectedSuit: SuitData | null;
}

export const Processing: React.FC<ProcessingProps> = ({ selectedSuit }) => {
    return (
        <div className="flex flex-col items-center justify-center flex-grow bg-[#F9F7F4]">
            <div className="text-center space-y-8 max-w-lg px-6">
                <div className="relative w-24 h-24 mx-auto">
                    <div className="absolute inset-0 border-4 border-[#EAEAEA] rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-[#B8A66F] rounded-full border-t-transparent animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-2xl">✨</div>
                </div>

                <div>
                    <h3 className="text-3xl font-serif text-[#1A1A1A] mb-4">Julien is at work</h3>
                    <p className="text-sm text-[#666] leading-relaxed italic">
                        "I am currently draping the {selectedSuit ? selectedSuit.name : 'custom fabric'} onto your silhouette. I'm paying close attention to the shoulder slope and sleeve pitch to ensure a bespoke visualization."
                    </p>
                </div>

                <div className="pt-8 space-y-2">
                    <div className="w-full h-1 bg-[#EAEAEA] rounded-full overflow-hidden">
                        <div className="h-full bg-[#1A1A1A] w-1/2 animate-pulse"></div>
                    </div>
                    <p className="text-[9px] font-bold text-[#9A8A55] uppercase tracking-widest">Rendering Physics & Lighting</p>
                </div>
            </div>
        </div>
    );
};
