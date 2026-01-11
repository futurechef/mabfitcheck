import React from 'react';
import type { SuitData } from '../types';

interface ResultViewProps {
    originalImage: string | null;
    generatedImage: string;
    suit?: SuitData | null;
    onRetake: () => void;
    onTryAnother: () => void;
    onPairWithSuit?: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
    originalImage: _originalImage,
    generatedImage,
    suit,
    onRetake,
    onTryAnother,
    onPairWithSuit
}) => {
    return (
        <div className="flex flex-col h-full bg-[#F9F7F4] overflow-y-auto">
            {/* Portfolio Display Area */}
            <div className="flex-grow flex items-center justify-center p-6 md:p-12 bg-[#111]">
                <div className="relative max-w-2xl w-full aspect-[3/4] shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)] border-[12px] md:border-[20px] border-white group">
                    <img
                        src={generatedImage}
                        alt="Bespoke Try-on Result"
                        className="w-full h-full object-contain bg-black"
                    />

                    {/* Brand Overlay */}
                    <div className="absolute inset-0 border border-white/10 pointer-events-none"></div>
                    <div className="absolute top-6 left-6 flex items-center gap-3">
                        <div className="bg-[#B8A66F] w-10 h-0.5"></div>
                        <span className="text-[10px] text-white font-bold tracking-[0.4em] uppercase opacity-70">Michael Andrews Bespoke</span>
                    </div>

                    <div className="absolute bottom-6 right-6 bg-white/10 backdrop-blur-md px-4 py-2 text-[9px] tracking-[0.2em] font-bold text-white uppercase border border-white/20">
                        Julien LeGallou AI
                    </div>
                </div>
            </div>

            {/* Action Gallery */}
            <div className="bg-white border-t border-[#EAEAEA] shadow-2xl p-10 flex flex-col items-center">
                <div className="text-center mb-10 max-w-xl">
                    <p className="text-[11px] font-bold text-[#9A8A55] tracking-[0.3em] uppercase mb-3">Custom Visualization Complete</p>
                    <h3 className="text-4xl font-serif text-[#1A1A1A] leading-tight mb-4">
                        {suit ? suit.name : 'Your Custom Bespoke Shirt'}
                    </h3>
                    <p className="text-sm text-[#777] leading-relaxed italic">
                        "Every detail has been tailored to your silhouette. This visualization represents our projection for your master commission."
                    </p>
                </div>

                <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-1 md:col-span-2 space-y-4">
                        {onPairWithSuit && (
                            <button
                                onClick={onPairWithSuit}
                                className="w-full bg-[#1A1A1A] text-white py-6 flex items-center justify-center gap-4 group transition-all shadow-xl hover:bg-[#B8A66F]"
                            >
                                <span className="font-bold text-[11px] tracking-[0.3em] uppercase">Complete the Look with a Suit</span>
                                <svg className="w-4 h-4 transform transition-transform group-hover:translate-x-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                            </button>
                        )}
                    </div>

                    <a
                        href={generatedImage}
                        download={`mab-commission-${suit?.id || 'shirt'}.png`}
                        className="flex items-center justify-center border border-[#EAEAEA] text-[#1A1A1A] py-5 text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-gray-50 transition-all font-sans"
                    >
                        Download Portfolio
                    </a>

                    <button
                        onClick={onTryAnother}
                        className="flex items-center justify-center border border-[#EAEAEA] text-[#1A1A1A] py-5 text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-gray-50 transition-all font-sans"
                    >
                        New Bespoke Session
                    </button>

                    <div className="col-span-1 md:col-span-2 pt-6 text-center">
                        <button
                            onClick={onRetake}
                            className="text-gray-400 hover:text-[#B8A66F] text-[9px] font-bold tracking-[0.3em] uppercase transition-all pb-1 border-b border-transparent hover:border-[#B8A66F]"
                        >
                            Adjust Fitting Photo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
