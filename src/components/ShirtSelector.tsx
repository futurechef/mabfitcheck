import React, { useState } from 'react';
import { SHIRTS, getAllShirtCategories } from '../constants/shirts';
import type { ShirtData } from '../types';
import type { FabricSwatch } from '../constants/fabricSwatches';

interface ShirtSelectorProps {
    onShirtSelected: (shirt: ShirtData, customFabric?: FabricSwatch) => void;
    onCustomize: () => void; // For "Design Your Own" flow
    onBack: () => void;
}

export const ShirtSelector: React.FC<ShirtSelectorProps> = ({ onShirtSelected, onCustomize, onBack }) => {
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [selectedProductionType, setSelectedProductionType] = useState<string>('All');

    const categories = ['All', ...getAllShirtCategories()];
    const productionTypes = ['All', 'Bespoke', 'Made-to-Measure'];

    const filteredShirts = SHIRTS.filter(shirt => {
        const categoryMatch = selectedCategory === 'All' || shirt.category === selectedCategory;
        const productionMatch = selectedProductionType === 'All' || shirt.productionType === selectedProductionType;
        return categoryMatch && productionMatch;
    });

    return (
        <div className="flex flex-col h-full bg-[#F9F7F4] overflow-y-auto">
            {/* Header */}
            <div className="p-8 md:p-12 bg-white border-b border-[#EAEAEA] shadow-sm">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-3xl font-serif text-[#1A1A1A] mb-2">Bespoke Shirts</h3>
                        <p className="text-[10px] text-[#9A8A55] font-bold tracking-[0.3em] uppercase">
                            {SHIRTS.length} Curated Designs from $175
                        </p>
                    </div>
                    <button
                        onClick={onBack}
                        className="text-[#666] text-[10px] font-bold uppercase tracking-widest hover:text-[#1A1A1A]"
                    >
                        ← Back
                    </button>
                </div>
            </div>

            <div className="p-6 md:p-12 max-w-7xl mx-auto w-full">
                {/* Design Your Own CTA */}
                <div
                    onClick={onCustomize}
                    className="mb-8 p-6 bg-gradient-to-r from-[#1A1A1A] to-[#333] text-white cursor-pointer hover:from-[#B8A66F] hover:to-[#9A8A55] transition-all group"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-lg font-serif mb-1">Design Your Own Shirt</h4>
                            <p className="text-[10px] tracking-widest uppercase opacity-70">
                                Choose from 112 fabrics • Customize collar, cuff & style
                            </p>
                        </div>
                        <div className="text-3xl group-hover:translate-x-2 transition-transform">→</div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-6 mb-8">
                    {/* Category Filter */}
                    <div>
                        <p className="text-[9px] font-bold text-[#9A8A55] uppercase tracking-widest mb-3">Category</p>
                        <div className="flex gap-2 flex-wrap">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all ${selectedCategory === cat
                                        ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                                        : 'bg-white text-[#666] border-[#EAEAEA] hover:border-[#B8A66F]'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Production Type Filter */}
                    <div>
                        <p className="text-[9px] font-bold text-[#9A8A55] uppercase tracking-widest mb-3">Type</p>
                        <div className="flex gap-2 flex-wrap">
                            {productionTypes.map(type => (
                                <button
                                    key={type}
                                    onClick={() => setSelectedProductionType(type)}
                                    className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all ${selectedProductionType === type
                                        ? 'bg-[#B8A66F] text-white border-[#B8A66F]'
                                        : 'bg-white text-[#666] border-[#EAEAEA] hover:border-[#B8A66F]'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-6">
                    <p className="text-sm text-[#666]">
                        Showing <span className="font-bold text-[#1A1A1A]">{filteredShirts.length}</span> shirts
                    </p>
                </div>

                {/* Shirt Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredShirts.map(shirt => (
                        <div
                            key={shirt.id}
                            onClick={() => onShirtSelected(shirt)}
                            className="group cursor-pointer bg-white border border-[#EAEAEA] hover:border-[#B8A66F] transition-all hover:shadow-xl overflow-hidden"
                        >
                            {/* Image */}
                            <div className="aspect-square bg-[#F5F5F5] relative overflow-hidden">
                                <img
                                    src={shirt.imageUrl}
                                    alt={shirt.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=Shirt';
                                    }}
                                />
                                {/* Production Badge */}
                                <div className={`absolute top-4 left-4 px-3 py-1 text-[8px] font-bold uppercase tracking-widest ${shirt.productionType === 'Bespoke'
                                    ? 'bg-[#1A1A1A] text-white'
                                    : 'bg-[#B8A66F] text-white'
                                    }`}>
                                    {shirt.productionType}
                                </div>
                                {/* Category Badge */}
                                <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 text-[8px] font-bold uppercase tracking-widest text-[#666]">
                                    {shirt.category}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <h4 className="font-serif text-lg text-[#1A1A1A] mb-2 leading-tight">
                                    {shirt.name}
                                </h4>
                                <p className="text-sm text-[#666] mb-4 line-clamp-2">
                                    {shirt.description}
                                </p>

                                {/* Details */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="px-2 py-1 bg-[#F5F5F5] text-[9px] font-bold uppercase tracking-widest text-[#666]">
                                        {shirt.collarStyle} Collar
                                    </span>
                                    <span className="px-2 py-1 bg-[#F5F5F5] text-[9px] font-bold uppercase tracking-widest text-[#666]">
                                        {shirt.cuffStyle} Cuff
                                    </span>
                                    <span className="px-2 py-1 bg-[#F5F5F5] text-[9px] font-bold uppercase tracking-widest text-[#666]">
                                        {shirt.pattern}
                                    </span>
                                </div>

                                {/* Price & Time */}
                                <div className="flex justify-between items-end pt-4 border-t border-[#EAEAEA]">
                                    <div>
                                        <p className="text-2xl font-serif text-[#1A1A1A]">{shirt.price}</p>
                                        <p className="text-[9px] text-[#999] uppercase tracking-widest">{shirt.productionTime}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#1A1A1A] text-white group-hover:bg-[#B8A66F] transition-colors">
                                        →
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredShirts.length === 0 && (
                    <div className="text-center py-16 text-[#999]">
                        <p className="text-lg font-serif">No shirts match your filters</p>
                        <p className="text-sm mt-2">Try adjusting your selection</p>
                    </div>
                )}
            </div>
        </div>
    );
};
