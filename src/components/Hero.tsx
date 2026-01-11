import React, { useState } from 'react';
import HowItWorksModal from './HowItWorksModal';
import { DemoWalkthrough } from './DemoWalkthrough';

interface HeroProps {
    onStart: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStart }) => {
    const [showTechModal, setShowTechModal] = useState(false);
    const [showDemoWalkthrough, setShowDemoWalkthrough] = useState(false);

    return (
        <div className="flex flex-col items-center justify-center flex-grow p-6 text-center bg-[#F9F7F4] relative overflow-hidden">
            <HowItWorksModal isOpen={showTechModal} onClose={() => setShowTechModal(false)} />
            {showDemoWalkthrough && <DemoWalkthrough onClose={() => setShowDemoWalkthrough(false)} />}

            {/* Decorative background element - Refined for brand */}
            <div className="absolute inset-0 opacity-5 pointer-events-none grayscale">
                <img
                    src="https://images.unsplash.com/photo-1594932224010-388f6a96495d?auto=format&fit=crop&q=80&w=1200"
                    alt=""
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="relative z-10 max-w-2xl space-y-12 animate-soft-in px-4">
                <div className="space-y-6">
                    <div className="flex justify-center items-center gap-6">
                        <div className="w-12 h-[1px] bg-[#B8A66F]"></div>
                        <p className="text-[#9A8A55] tracking-[0.4em] uppercase text-[10px] font-bold">The Virtual Atelier</p>
                        <div className="w-12 h-[1px] bg-[#B8A66F]"></div>
                    </div>

                    <h2 className="text-6xl md:text-8xl font-serif text-[#1A1A1A] leading-[1] tracking-tight">
                        Your Bespoke Visualization.
                    </h2>
                    <p className="text-[#444] font-body text-base md:text-lg leading-relaxed max-w-lg mx-auto italic">
                        "We use your photorealistic capture to model the world's finest fabrics directly to your silhouette. Experience your commission before a single stitch is placed."
                    </p>
                </div>

                <div className="flex flex-col items-center gap-6">
                    <button
                        onClick={onStart}
                        className="bg-[#1A1A1A] text-white px-16 py-6 text-[11px] tracking-[0.3em] uppercase font-bold shadow-2xl hover:bg-[#B8A66F] transition-all duration-500 transform hover:-translate-y-1"
                    >
                        Begin New Fitting
                    </button>

                    <div className="flex gap-4">
                        <button
                            onClick={() => setShowDemoWalkthrough(true)}
                            className="bg-white border border-[#B8A66F] text-[#B8A66F] px-8 py-3 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-[#FDFBF2] transition-all"
                        >
                            ⚡ Quick Demo Walkthrough
                        </button>
                        <button
                            onClick={() => setShowTechModal(true)}
                            className="text-[#9A8A55] text-[10px] uppercase tracking-[0.2em] font-bold border-b border-transparent hover:border-[#9A8A55] transition-all pb-1"
                        >
                            View Technical Workflow
                        </button>
                    </div>
                </div>

                <div className="pt-16">
                    <div className="h-0.5 w-8 bg-[#D1C7BD] mx-auto mb-6"></div>
                    <p className="text-[9px] text-gray-400 tracking-[0.5em] uppercase font-bold">Michael Andrews Bespoke • New York • DC</p>
                </div>
            </div>
        </div>
    );
};
