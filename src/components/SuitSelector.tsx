import React, { useState } from 'react';
import { SUITS } from '../constants';
import type { SuitData } from '../types';
import { ProductDetailsModal } from './ProductDetailsModal';

interface SuitSelectorProps {
  onSuitSelected: (suit: SuitData) => void;
  onBack: () => void;
}

export const SuitSelector: React.FC<SuitSelectorProps> = ({ onSuitSelected, onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Navy Blues');
  const [detailProduct, setDetailProduct] = useState<SuitData | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const categories = Array.from(new Set(SUITS.map((s: SuitData) => s.category)));
  const filteredSuits = SUITS.filter((s: SuitData) => s.category === selectedCategory);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newFavs = new Set(favorites);
    if (newFavs.has(id)) newFavs.delete(id);
    else newFavs.add(id);
    setFavorites(newFavs);
  };

  return (
    <div className="flex flex-col h-full bg-[#F9F7F4]">
      {/* Immersive Header */}
      <div className="bg-white px-6 pt-10 pb-6 border-b border-[#EAEAEA] shadow-sm flex justify-between items-end">
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-4xl font-serif text-[#1A1A1A]">Curated Commissions</h3>
            <p className="text-[10px] text-[#9A8A55] font-bold tracking-[0.2em] uppercase">Step 2: Selection</p>
          </div>
          <div className="flex gap-8 overflow-x-auto pb-2 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-[10px] font-bold tracking-[0.2em] uppercase whitespace-nowrap pb-2 border-b-2 transition-all ${selectedCategory === cat ? 'border-[#B8A66F] text-[#B8A66F]' : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <button onClick={onBack} className="mb-4 text-[#666] hover:text-[#1A1A1A] text-[10px] font-bold uppercase tracking-widest border-b border-transparent hover:border-[#B8A66F] pb-1 transition-all">← Back</button>
      </div>

      {/* Grid */}
      <div className="flex-grow p-6 md:p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-20">
          {filteredSuits.map((suit: SuitData) => (
            <div
              key={suit.id}
              className="bg-white border border-[#EAEAEA] group hover:border-[#B8A66F] transition-all duration-500 shadow-sm hover:shadow-2xl relative overflow-hidden flex flex-col cursor-pointer"
              onClick={() => onSuitSelected(suit)}
            >
              <div className="aspect-[3/4] relative overflow-hidden bg-[#F0F0F0]">
                <img src={suit.imageUrl} alt={suit.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />

                {/* Floating Actions */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                  <button
                    onClick={(e) => toggleFavorite(suit.id, e)}
                    className={`w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform ${favorites.has(suit.id) ? 'text-red-500' : 'text-gray-400'}`}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill={favorites.has(suit.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 000-7.78z" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setDetailProduct(suit); }}
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform text-gray-400 hover:text-[#B8A66F]"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-5 flex-grow flex flex-col border-t border-[#F9F7F4]">
                <h4 className="text-base font-serif text-[#1A1A1A] mb-1 leading-tight line-clamp-2">{suit.name}</h4>
                <div className="mt-auto pt-4 flex justify-between items-baseline">
                  <span className="text-[10px] font-bold text-[#9A8A55] tracking-widest uppercase">{suit.fabricMill}</span>
                  <span className="text-sm font-serif text-[#1A1A1A] font-bold">{suit.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ProductDetailsModal
        product={detailProduct!}
        isOpen={!!detailProduct}
        onClose={() => setDetailProduct(null)}
        onSelect={() => onSuitSelected(detailProduct!)}
      />
    </div>
  );
};
