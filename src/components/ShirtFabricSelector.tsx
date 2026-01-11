import React, { useState } from 'react';
import { FABRIC_SWATCHES, getAllMills, type FabricSwatch, type FabricMill } from '../constants/fabricSwatches';

interface ShirtFabricSelectorProps {
    onFabricSelected: (fabric: FabricSwatch) => void;
    onBack: () => void;
}

export const ShirtFabricSelector: React.FC<ShirtFabricSelectorProps> = ({ onFabricSelected, onBack }) => {
    const [selectedMill, setSelectedMill] = useState<FabricMill | 'All'>('All');
    const [selectedPattern, setSelectedPattern] = useState<string>('All');

    const mills = getAllMills();
    const patterns = ['All', 'Solid', 'Twill', 'Herringbone', 'Pinstripe', 'Birdseye', 'Sharkskin', 'Glen Plaid', 'Flannel'];

    const filteredFabrics = FABRIC_SWATCHES.filter(fabric => {
        const millMatch = selectedMill === 'All' || fabric.mill === selectedMill;
        const patternMatch = selectedPattern === 'All' || fabric.pattern === selectedPattern;
        return millMatch && patternMatch;
    });

    return (
        <div className="flex flex-col h-full bg-[#F9F7F4] overflow-y-auto">
            <div className="p-8 md:p-12 bg-white border-b border-[#EAEAEA] shadow-sm flex justify-between items-center">
                <div>
                    <h3 className="text-3xl font-serif text-[#1A1A1A] mb-2">Fabric Selection</h3>
                    <p className="text-[10px] text-[#9A8A55] font-bold tracking-[0.3em] uppercase">
                        {FABRIC_SWATCHES.length} Premium Fabrics from World-Class Mills
                    </p>
                </div>
                <button onClick={onBack} className="text-[#666] text-[10px] font-bold uppercase tracking-widest hover:text-[#1A1A1A]">← Back</button>
            </div>

            <div className="p-6 md:p-12 max-w-7xl mx-auto w-full">
                {/* Mill Filter */}
                <div className="mb-6">
                    <p className="text-[9px] font-bold text-[#9A8A55] uppercase tracking-widest mb-3">Filter by Mill</p>
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={() => setSelectedMill('All')}
                            className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all ${selectedMill === 'All'
                                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                                    : 'bg-white text-[#666] border-[#EAEAEA] hover:border-[#B8A66F]'
                                }`}
                        >
                            All Mills
                        </button>
                        {mills.map(mill => (
                            <button
                                key={mill}
                                onClick={() => setSelectedMill(mill)}
                                className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all ${selectedMill === mill
                                        ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                                        : 'bg-white text-[#666] border-[#EAEAEA] hover:border-[#B8A66F]'
                                    }`}
                            >
                                {mill}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Pattern Filter */}
                <div className="mb-8">
                    <p className="text-[9px] font-bold text-[#9A8A55] uppercase tracking-widest mb-3">Filter by Pattern</p>
                    <div className="flex gap-2 flex-wrap">
                        {patterns.map(pattern => (
                            <button
                                key={pattern}
                                onClick={() => setSelectedPattern(pattern)}
                                className={`px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest border transition-all ${selectedPattern === pattern
                                        ? 'bg-[#B8A66F] text-white border-[#B8A66F]'
                                        : 'bg-white text-[#666] border-[#EAEAEA] hover:border-[#B8A66F]'
                                    }`}
                            >
                                {pattern}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-6 flex justify-between items-center">
                    <p className="text-sm text-[#666]">
                        Showing <span className="font-bold text-[#1A1A1A]">{filteredFabrics.length}</span> fabrics
                    </p>
                </div>

                {/* Fabric Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {filteredFabrics.map(fabric => (
                        <div
                            key={fabric.id}
                            onClick={() => onFabricSelected(fabric)}
                            className="group cursor-pointer bg-white border border-[#EAEAEA] hover:border-[#B8A66F] transition-all p-4 flex flex-col items-center text-center gap-3 hover:shadow-xl"
                        >
                            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-md group-hover:scale-110 transition-transform">
                                <img
                                    src={fabric.imageUrl}
                                    alt={fabric.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        // Fallback if image fails to load
                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80x80?text=Fabric';
                                    }}
                                />
                            </div>
                            <div>
                                <h5 className="font-serif text-[#1A1A1A] text-sm leading-tight">{fabric.name}</h5>
                                <p className="text-[8px] text-[#B8A66F] uppercase tracking-widest mt-1 font-bold">{fabric.mill}</p>
                                <p className="text-[9px] text-[#999] mt-0.5">{fabric.pattern} • {fabric.color}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredFabrics.length === 0 && (
                    <div className="text-center py-16 text-[#999]">
                        <p className="text-lg font-serif">No fabrics match your filters</p>
                        <p className="text-sm mt-2">Try adjusting your selection</p>
                    </div>
                )}
            </div>
        </div>
    );
};
