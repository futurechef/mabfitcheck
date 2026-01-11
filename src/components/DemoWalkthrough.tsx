import React, { useState } from 'react';
import { SUITS } from '../constants';
import { FABRIC_SWATCHES } from '../constants/fabricSwatches';
import type { SuitData } from '../types';
import type { FabricSwatch } from '../constants/fabricSwatches';

/**
 * Demo Walkthrough Component
 * 
 * A quick, backend-free demonstration of the MAB Virtual Atelier.
 * Uses full Cloud Storage URLs for all assets - no API calls required.
 * Perfect for fast demos, showcases, or testing without backend setup.
 */

// Demo user photo (using a placeholder from Cloud Storage or a demo image)
const DEMO_USER_PHOTO = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80';

// Demo generated result images (using suit images as placeholders)
const DEMO_RESULT_SUIT = 'https://storage.googleapis.com/mabbucket/MABSUITapp/suits/00111_02402_main_navy-blue-solid-super-110s-two-button-bespoke-suit-410x470.png';
const DEMO_RESULT_SHIRT = 'https://storage.googleapis.com/mabbucket/MABSUITapp/suits/00781_01969_main_cream-plain-weave-bespoke-suit-410x470.png';
const DEMO_RESULT_BOTH = 'https://storage.googleapis.com/mabbucket/MABSUITapp/suits/00013_02407_main_navy-blue-signature-two-button-bespoke-suit-410x470.png';

interface DemoWalkthroughProps {
    onClose: () => void;
}

export const DemoWalkthrough: React.FC<DemoWalkthroughProps> = ({ onClose }) => {
    const [step, setStep] = useState<'overview' | 'suits' | 'shirts' | 'fabrics' | 'result'>('overview');
    const [selectedSuit, setSelectedSuit] = useState<SuitData | null>(null);
    const [selectedFabric, setSelectedFabric] = useState<FabricSwatch | null>(null);

    // Sample suits for demo (first 6 from catalog)
    const demoSuits = SUITS.slice(0, 6);
    
    // Sample fabrics for demo (first 12 from catalog)
    const demoFabrics = FABRIC_SWATCHES.slice(0, 12);

    const handleSuitSelect = (suit: SuitData) => {
        setSelectedSuit(suit);
        setStep('result');
    };

    const handleFabricSelect = (fabric: FabricSwatch) => {
        setSelectedFabric(fabric);
        setStep('result');
    };

    return (
        <div className="fixed inset-0 bg-[#F9F7F4] z-[200] overflow-y-auto">
            {/* Header */}
            <header className="bg-white border-b border-[#EAEAEA] sticky top-0 z-10 px-6 py-4 flex justify-between items-center shadow-sm">
                <div>
                    <h1 className="text-2xl font-serif text-[#1A1A1A]">Demo Walkthrough</h1>
                    <p className="text-xs text-[#9A8A55] uppercase tracking-widest">Quick Preview • No Backend Required</p>
                </div>
                <button
                    onClick={onClose}
                    className="text-[#666] hover:text-[#1A1A1A] text-sm uppercase tracking-widest"
                >
                    Close
                </button>
            </header>

            <div className="max-w-7xl mx-auto p-6 md:p-12">
                {/* Navigation Steps */}
                <div className="flex justify-center gap-4 mb-12">
                    {[
                        { id: 'overview', label: 'Overview' },
                        { id: 'suits', label: 'Suits' },
                        { id: 'shirts', label: 'Fabrics' },
                        { id: 'result', label: 'Result' },
                    ].map((s) => (
                        <button
                            key={s.id}
                            onClick={() => setStep(s.id as any)}
                            className={`px-6 py-2 text-xs uppercase tracking-widest transition-all ${
                                step === s.id
                                    ? 'bg-[#1A1A1A] text-white'
                                    : 'bg-white text-[#666] hover:bg-[#F5F5F5] border border-[#EAEAEA]'
                            }`}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>

                {/* Step Content */}
                {step === 'overview' && (
                    <div className="space-y-12">
                        <div className="text-center space-y-6">
                            <h2 className="text-4xl font-serif text-[#1A1A1A]">Quick Demo Walkthrough</h2>
                            <p className="text-lg text-[#666] max-w-2xl mx-auto">
                                Explore our virtual atelier with full Cloud Storage URLs. No backend setup required - all assets load directly from Google Cloud Storage.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-white p-8 border border-[#EAEAEA] text-center space-y-4">
                                <div className="text-4xl mb-4">👔</div>
                                <h3 className="text-xl font-serif">29 Bespoke Suits</h3>
                                <p className="text-sm text-[#666]">
                                    Browse our complete suit collection with high-resolution images from Cloud Storage
                                </p>
                                <button
                                    onClick={() => setStep('suits')}
                                    className="mt-4 bg-[#1A1A1A] text-white px-6 py-2 text-xs uppercase tracking-widest hover:bg-[#B8A66F] transition-all"
                                >
                                    View Suits
                                </button>
                            </div>

                            <div className="bg-white p-8 border border-[#EAEAEA] text-center space-y-4">
                                <div className="text-4xl mb-4">🧵</div>
                                <h3 className="text-xl font-serif">112 Fabric Swatches</h3>
                                <p className="text-sm text-[#666]">
                                    Explore premium fabrics from Holland & Sherry, Scabal, Dormeuil, and more
                                </p>
                                <button
                                    onClick={() => setStep('shirts')}
                                    className="mt-4 bg-[#1A1A1A] text-white px-6 py-2 text-xs uppercase tracking-widest hover:bg-[#B8A66F] transition-all"
                                >
                                    View Fabrics
                                </button>
                            </div>

                            <div className="bg-white p-8 border border-[#EAEAEA] text-center space-y-4">
                                <div className="text-4xl mb-4">⚡</div>
                                <h3 className="text-xl font-serif">Instant Loading</h3>
                                <p className="text-sm text-[#666]">
                                    All assets use full Cloud Storage URLs for fast, direct access - no backend processing
                                </p>
                                <button
                                    onClick={() => setStep('result')}
                                    className="mt-4 bg-[#1A1A1A] text-white px-6 py-2 text-xs uppercase tracking-widest hover:bg-[#B8A66F] transition-all"
                                >
                                    View Result
                                </button>
                            </div>
                        </div>

                        <div className="bg-[#FDFBF2] border border-[#B8A66F] p-6 rounded-sm">
                            <h4 className="font-serif text-lg mb-2 text-[#1A1A1A]">✨ Demo Mode Features</h4>
                            <ul className="space-y-2 text-sm text-[#666]">
                                <li>✅ All images load directly from Cloud Storage (full URLs)</li>
                                <li>✅ No Firebase or Gemini API required</li>
                                <li>✅ Fast, instant loading</li>
                                <li>✅ Perfect for demonstrations and testing</li>
                                <li>✅ Works offline once images are cached</li>
                            </ul>
                        </div>
                    </div>
                )}

                {step === 'suits' && (
                    <div className="space-y-8">
                        <div className="text-center">
                            <h2 className="text-4xl font-serif text-[#1A1A1A] mb-4">Bespoke Suit Collection</h2>
                            <p className="text-[#666]">
                                {SUITS.length} suits with full Cloud Storage URLs • Click any suit to see result preview
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {demoSuits.map((suit) => (
                                <button
                                    key={suit.id}
                                    onClick={() => handleSuitSelect(suit)}
                                    className="group bg-white border border-[#EAEAEA] hover:border-[#B8A66F] transition-all text-left overflow-hidden"
                                >
                                    <div className="relative aspect-[3/4] overflow-hidden bg-slate-900">
                                        <img
                                            src={suit.imageUrl}
                                            alt={suit.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="p-4 space-y-2">
                                        <p className="text-xs uppercase tracking-widest text-[#9A8A55] font-bold">
                                            {suit.category}
                                        </p>
                                        <h3 className="font-serif text-lg text-[#1A1A1A] group-hover:text-[#B8A66F] transition-colors">
                                            {suit.name}
                                        </h3>
                                        <p className="text-sm text-[#666]">{suit.price} • {suit.productionTime}</p>
                                        <p className="text-xs text-[#999] italic">Click to see result</p>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-sm">
                            <p className="text-sm text-blue-800">
                                <strong>Demo Note:</strong> All suit images load directly from{' '}
                                <code className="bg-blue-100 px-1 rounded">storage.googleapis.com/mabbucket</code>
                            </p>
                        </div>
                    </div>
                )}

                {step === 'shirts' && (
                    <div className="space-y-8">
                        <div className="text-center">
                            <h2 className="text-4xl font-serif text-[#1A1A1A] mb-4">Fabric Swatch Library</h2>
                            <p className="text-[#666]">
                                {FABRIC_SWATCHES.length} premium fabrics organized by mill • Full Cloud Storage URLs
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {demoFabrics.map((fabric) => (
                                <button
                                    key={fabric.id}
                                    onClick={() => handleFabricSelect(fabric)}
                                    className="group bg-white border border-[#EAEAEA] hover:border-[#B8A66F] transition-all overflow-hidden"
                                >
                                    <div className="relative aspect-square overflow-hidden bg-slate-100">
                                        <img
                                            src={fabric.imageUrl}
                                            alt={fabric.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-3 space-y-1">
                                        <p className="text-xs font-bold text-[#1A1A1A] truncate">{fabric.name}</p>
                                        <p className="text-[10px] text-[#9A8A55] uppercase tracking-widest">{fabric.mill}</p>
                                        <p className="text-[10px] text-[#999]">{fabric.pattern} • {fabric.color}</p>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="bg-amber-50 border border-amber-200 p-4 rounded-sm">
                            <p className="text-sm text-amber-800">
                                <strong>Mill Organization:</strong> Holland & Sherry (27) • Scabal (23) • Dormeuil (13) • Loro Piana (3) • Other (46)
                            </p>
                        </div>
                    </div>
                )}

                {step === 'result' && (
                    <div className="space-y-8">
                        <div className="text-center">
                            <h2 className="text-4xl font-serif text-[#1A1A1A] mb-4">Demo Result Preview</h2>
                            <p className="text-[#666]">
                                Example visualization using static demo images • Full production flow uses Gemini 3 Pro Image
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-2xl font-serif text-[#1A1A1A] mb-4">
                                        {selectedSuit ? selectedSuit.name : selectedFabric ? `${selectedFabric.name} Shirt` : 'Demo Result'}
                                    </h3>
                                    {selectedSuit && (
                                        <div className="space-y-2 text-sm text-[#666]">
                                            <p><strong>Price:</strong> {selectedSuit.price}</p>
                                            <p><strong>Production:</strong> {selectedSuit.productionTime}</p>
                                            <p><strong>Fabric:</strong> {selectedSuit.fabricType}</p>
                                            <p><strong>Pattern:</strong> {selectedSuit.pattern}</p>
                                        </div>
                                    )}
                                    {selectedFabric && (
                                        <div className="space-y-2 text-sm text-[#666]">
                                            <p><strong>Mill:</strong> {selectedFabric.mill}</p>
                                            <p><strong>Pattern:</strong> {selectedFabric.pattern}</p>
                                            <p><strong>Color:</strong> {selectedFabric.color}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="bg-[#FDFBF2] border border-[#B8A66F] p-4 rounded-sm">
                                    <h4 className="font-bold text-sm mb-2 uppercase tracking-widest text-[#9A8A55]">
                                        Demo Mode Information
                                    </h4>
                                    <p className="text-xs text-[#666] leading-relaxed">
                                        This is a static preview. In the full app, Gemini 3 Pro Image generates photorealistic 
                                        visualizations using your uploaded photo. All assets in this demo use full Cloud Storage URLs 
                                        for instant loading without backend processing.
                                    </p>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setStep('overview')}
                                        className="flex-1 bg-white border border-[#EAEAEA] text-[#666] py-3 text-xs uppercase tracking-widest hover:bg-[#F5F5F5] transition-all"
                                    >
                                        Back to Overview
                                    </button>
                                    {!selectedSuit && (
                                        <button
                                            onClick={() => setStep('suits')}
                                            className="flex-1 bg-[#1A1A1A] text-white py-3 text-xs uppercase tracking-widest hover:bg-[#B8A66F] transition-all"
                                        >
                                            Try Suits
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="relative">
                                <div className="aspect-[3/4] bg-slate-900 overflow-hidden border-2 border-[#EAEAEA] shadow-2xl">
                                    <img
                                        src={selectedSuit ? DEMO_RESULT_SUIT : selectedFabric ? DEMO_RESULT_SHIRT : DEMO_RESULT_BOTH}
                                        alt="Demo result"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 text-[10px] uppercase tracking-widest">
                                    Demo Preview
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-white border border-[#EAEAEA] p-6">
                                <h4 className="font-serif text-lg mb-2">Full URLs</h4>
                                <p className="text-xs text-[#666]">
                                    All images use complete Cloud Storage URLs for direct access
                                </p>
                            </div>
                            <div className="bg-white border border-[#EAEAEA] p-6">
                                <h4 className="font-serif text-lg mb-2">No Backend</h4>
                                <p className="text-xs text-[#666]">
                                    Demo mode works without Firebase or Gemini API setup
                                </p>
                            </div>
                            <div className="bg-white border border-[#EAEAEA] p-6">
                                <h4 className="font-serif text-lg mb-2">Fast Loading</h4>
                                <p className="text-xs text-[#666]">
                                    Instant access to all assets via CDN distribution
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
