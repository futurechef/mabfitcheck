
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useMemo } from 'react';
import type { WardrobeItem } from '../types';
import { UploadCloudIcon, CheckCircleIcon } from './icons';

interface WardrobePanelProps {
  onGarmentSelect: (garmentSource: File | string, garmentInfo: WardrobeItem) => void;
  activeGarmentIds: string[];
  isLoading: boolean;
  wardrobe: WardrobeItem[];
  activeTarget: 'shirt' | 'suit';
  onTargetChange: (target: 'shirt' | 'suit') => void;
}

const WardrobePanel: React.FC<WardrobePanelProps> = ({ 
    onGarmentSelect, 
    activeGarmentIds, 
    isLoading, 
    wardrobe, 
    activeTarget, 
    onTargetChange 
}) => {
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    const categories = useMemo(() => {
        const mills = Array.from(new Set(wardrobe.map(item => item.mill).filter(Boolean))) as string[];
        const mainCategories = ['All', 'Suits', 'Shirts'];
        return [...mainCategories, ...mills];
    }, [wardrobe]);

    const filteredWardrobe = useMemo(() => {
        if (selectedCategory === 'All') return wardrobe;
        if (selectedCategory === 'Suits') return wardrobe.filter(item => item.category === 'Suit');
        if (selectedCategory === 'Shirts') return wardrobe.filter(item => item.category === 'Shirt');
        return wardrobe.filter(item => item.mill === selectedCategory);
    }, [wardrobe, selectedCategory]);

    const handleGarmentClick = (item: WardrobeItem) => {
        if (isLoading || activeGarmentIds.includes(item.id)) return;
        setError(null);
        onGarmentSelect(item.url, item);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (!file.type.startsWith('image/')) {
                setError('Please select an image file.');
                return;
            }
            const customGarmentInfo: WardrobeItem = {
                id: `custom-${Date.now()}`,
                name: file.name,
                url: URL.createObjectURL(file),
                type: 'product',
                category: activeTarget === 'shirt' ? 'Shirt' : 'Suit'
            };
            onGarmentSelect(file, customGarmentInfo);
        }
    };

  return (
    <div className="pt-6 border-t border-gray-400/50 flex flex-col gap-4">
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif tracking-wider text-gray-800">Catalog</h2>
            <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
                <button 
                    onClick={() => onTargetChange('shirt')}
                    className={`px-3 py-1 text-[10px] md:text-xs font-bold rounded-md transition-all ${activeTarget === 'shirt' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    TO SHIRT
                </button>
                <button 
                    onClick={() => onTargetChange('suit')}
                    className={`px-3 py-1 text-[10px] md:text-xs font-bold rounded-md transition-all ${activeTarget === 'suit' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    TO SUIT
                </button>
            </div>
        </div>

        {/* Category Pill Navigation */}
        <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide no-scrollbar -mx-2 px-2">
            {categories.map(cat => (
                <button 
                    key={cat} 
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold whitespace-nowrap transition-all border ${selectedCategory === cat ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'}`}
                >
                    {cat}
                </button>
            ))}
        </div>

        <div className="grid grid-cols-3 gap-3">
            {filteredWardrobe.map((item) => {
            const isActive = activeGarmentIds.includes(item.id);
            return (
                <button
                key={item.id}
                onClick={() => handleGarmentClick(item)}
                disabled={isLoading || isActive}
                className="relative aspect-square border rounded-lg overflow-hidden transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 group disabled:opacity-60 disabled:cursor-not-allowed"
                aria-label={`Select ${item.name}`}
                >
                <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-[10px] font-bold text-center p-1 leading-tight">{item.name}</p>
                </div>
                {isActive && (
                    <div className="absolute inset-0 bg-gray-900/70 flex items-center justify-center">
                        <CheckCircleIcon className="w-8 h-8 text-white" />
                    </div>
                )}
                </button>
            );
            })}
            <label htmlFor="custom-garment-upload" className={`relative aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-gray-500 transition-colors ${isLoading ? 'cursor-not-allowed bg-gray-100' : 'hover:border-gray-400 hover:text-gray-600 cursor-pointer'}`}>
                <UploadCloudIcon className="w-6 h-6 mb-1"/>
                <span className="text-[10px] text-center font-bold">UPLOAD</span>
                <input id="custom-garment-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp, image/avif, image/heic, image/heif" onChange={handleFileChange} disabled={isLoading}/>
            </label>
        </div>
        
        {filteredWardrobe.length === 0 && selectedCategory !== 'All' && (
             <p className="text-center text-sm text-gray-500 mt-4">No items in this category.</p>
        )}
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
    </div>
  );
};

export default WardrobePanel;
