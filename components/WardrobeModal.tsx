
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useMemo } from 'react';
import type { WardrobeItem, OutfitLayer, ClothingTarget } from '../types';
import { UploadCloudIcon, CheckCircleIcon, Trash2Icon } from './icons';

interface WardrobePanelProps {
  onGarmentSelect: (garmentSource: File | string, garmentInfo: WardrobeItem) => void;
  activeGarmentIds: string[];
  isLoading: boolean;
  wardrobe: WardrobeItem[];
  activeTarget: ClothingTarget;
  onTargetChange: (target: ClothingTarget) => void;
  editingLayerIndex: number | null;
  activeOutfitLayers: OutfitLayer[];
  onRemoveJacket: () => void;
}

const WardrobePanel: React.FC<WardrobePanelProps> = ({ 
    onGarmentSelect, 
    activeGarmentIds, 
    isLoading, 
    wardrobe, 
    activeTarget, 
    onTargetChange,
    editingLayerIndex,
    activeOutfitLayers,
    onRemoveJacket
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

    // Track which items are applied specifically as shirt or suit
    const garmentStatusMap = useMemo(() => {
        const map: Record<string, ClothingTarget> = {};
        activeOutfitLayers.forEach(layer => {
            if (layer.garment && layer.target) {
                map[layer.garment.id] = layer.target;
            }
        });
        return map;
    }, [activeOutfitLayers]);

    const handleGarmentClick = (item: WardrobeItem) => {
        if (isLoading) return;
        
        // If not editing, and item is already active in any layer, don't allow duplicate push
        if (editingLayerIndex === null && activeGarmentIds.includes(item.id)) return;
        
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
                category: activeTarget === 'suit' ? 'Suit' : (activeTarget === 'jacket' ? 'Jacket' : (activeTarget === 'trousers' ? 'Trousers' : 'Shirt'))
            };
            onGarmentSelect(file, customGarmentInfo);
        }
    };

  return (
    <div className="pt-4 md:pt-8 border-t border-[#E3DCD1] flex flex-col gap-5 md:gap-6">
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl md:text-2xl font-serif tracking-wider text-[#3D3D3D]">
                    {editingLayerIndex !== null ? 'Replace Piece' : 'Catalog'}
                </h2>
                {activeTarget === 'jacket' && (
                    <button 
                        onClick={onRemoveJacket}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-red-100 text-red-500 hover:bg-red-50 transition-all text-[10px] font-bold uppercase tracking-widest disabled:opacity-50"
                    >
                        <Trash2Icon className="w-3.5 h-3.5" />
                        Remove Jacket
                    </button>
                )}
            </div>
            
            <div className="flex bg-[#E3DCD144] rounded-xl p-1 gap-1 overflow-x-auto no-scrollbar">
                {(['shirt', 'jacket', 'trousers', 'suit'] as ClothingTarget[]).map((t) => (
                    <button 
                        key={t}
                        onClick={() => onTargetChange(t)}
                        className={`px-3 py-2 text-[10px] font-bold rounded-lg transition-all uppercase tracking-widest whitespace-nowrap flex-1 ${activeTarget === t ? 'bg-[#3D3D3D] text-white shadow-md' : 'text-gray-500 hover:text-[#3D3D3D]'}`}
                    >
                        {t}
                    </button>
                ))}
            </div>
        </div>

        {/* Category Pill Navigation */}
        <div className="flex overflow-x-auto pb-1 gap-2 scrollbar-hide no-scrollbar -mx-6 px-6">
            {categories.map(cat => (
                <button 
                    key={cat} 
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 md:px-5 py-2 rounded-full text-[10px] uppercase tracking-[0.1em] md:tracking-[0.2em] font-bold whitespace-nowrap transition-all border ${selectedCategory === cat ? 'bg-[#B8A66F] text-white border-[#B8A66F] shadow-sm' : 'bg-white text-gray-400 border-[#E3DCD1] hover:border-[#B8A66F]'}`}
                >
                    {cat}
                </button>
            ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
            {filteredWardrobe.map((item) => {
            const isActive = activeGarmentIds.includes(item.id);
            const appliedType = garmentStatusMap[item.id];
            
            return (
                <button
                key={item.id}
                onClick={() => handleGarmentClick(item)}
                disabled={isLoading || (editingLayerIndex === null && isActive)}
                className={`relative aspect-square border border-[#E3DCD1] rounded-2xl overflow-hidden transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#B8A66F] group disabled:opacity-60 disabled:cursor-not-allowed ${(!isActive || editingLayerIndex !== null) ? 'hover:shadow-lg md:hover:-translate-y-1' : ''}`}
                aria-label={`Select ${item.name}`}
                >
                <img src={item.url} alt={item.name} className="w-full h-full object-cover transition-all duration-700 ease-in-out" />
                
                {/* Specific Status Labels */}
                {appliedType && (
                    <div className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest text-white shadow-sm z-10 ${appliedType === 'shirt' ? 'bg-[#1A2D4D]' : 'bg-[#3D3D3D]'}`}>
                        {appliedType}
                    </div>
                )}

                <div className="absolute inset-0 bg-[#3D3D3D]/50 flex items-center justify-center opacity-0 md:group-hover:opacity-100 transition-opacity backdrop-blur-[1px]">
                    <p className="text-white text-[9px] md:text-[10px] font-bold text-center px-3 leading-tight uppercase tracking-widest">{item.name}</p>
                </div>
                {isActive && (
                    <div className="absolute inset-0 bg-[#B8A66F]/80 flex items-center justify-center backdrop-blur-sm">
                        <CheckCircleIcon className="w-8 h-8 text-white" />
                    </div>
                )}
                </button>
            );
            })}
            <label htmlFor="custom-garment-upload" className={`relative aspect-square border-2 border-dashed border-[#E3DCD1] rounded-2xl flex flex-col items-center justify-center text-gray-400 transition-all ${isLoading ? 'cursor-not-allowed bg-gray-50' : 'hover:border-[#B8A66F] hover:text-[#B8A66F] hover:bg-[#FDFCFB] cursor-pointer hover:shadow-inner'}`}>
                <UploadCloudIcon className="w-6 h-6 mb-1.5"/>
                <span className="text-[10px] text-center font-bold tracking-[0.2em] uppercase">Add New</span>
                <input id="custom-garment-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp, image/avif, image/heic, image/heif" onChange={handleFileChange} disabled={isLoading}/>
            </label>
        </div>
        
        {filteredWardrobe.length === 0 && selectedCategory !== 'All' && (
             <p className="text-center text-[10px] uppercase tracking-widest text-gray-400 mt-6 font-bold">End of Thread</p>
        )}
        {error && <p className="text-red-500 text-xs mt-2 text-center font-bold">{error}</p>}
    </div>
  );
};

export default WardrobePanel;
