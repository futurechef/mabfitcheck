
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { OutfitLayer } from '../types';
import { Trash2Icon, RotateCcwIcon, ShirtIcon } from './icons';

interface OutfitStackProps {
  outfitHistory: OutfitLayer[];
  onRemoveLastGarment: () => void;
  onEditLayer: (index: number) => void;
  editingLayerIndex: number | null;
}

const OutfitStack: React.FC<OutfitStackProps> = ({ outfitHistory, onRemoveLastGarment, onEditLayer, editingLayerIndex }) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b border-[#E3DCD1] pb-3 mb-4">
        <h2 className="text-2xl font-serif tracking-wider text-[#3D3D3D]">Outfit Stack</h2>
        <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">{outfitHistory.length} Layers</span>
      </div>
      <div className="space-y-3">
        {outfitHistory.map((layer, index) => (
          <div
            key={`${layer.garment?.id || (layer.action === 'remove_jacket' ? 'remove_jacket' : 'base')}-${index}`}
            className={`flex items-center justify-between p-3 rounded-xl animate-fade-in border transition-all group ${editingLayerIndex === index ? 'bg-[#FDFCFB] border-[#B8A66F] shadow-md ring-2 ring-[#B8A66F33]' : 'bg-white/60 border-[#E3DCD1] shadow-sm hover:shadow-md'}`}
          >
            <div className="flex items-center overflow-hidden flex-grow cursor-pointer" onClick={() => onEditLayer(index)}>
                <span className={`flex-shrink-0 flex items-center justify-center w-6 h-6 mr-4 text-[10px] font-bold rounded-full border transition-colors ${editingLayerIndex === index ? 'text-white bg-[#B8A66F] border-[#B8A66F]' : 'text-[#B8A66F] bg-[#B8A66F11] border-[#B8A66F33]'}`}>
                  {index + 1}
                </span>
                {layer.garment ? (
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden mr-4 border border-[#E3DCD1]">
                      <img src={layer.garment.url} alt={layer.garment.name} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500" />
                    </div>
                ) : layer.action === 'remove_jacket' ? (
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center mr-4 border border-red-100">
                      <ShirtIcon className="w-6 h-6 text-red-300" />
                    </div>
                ) : null}
                <div className="flex flex-col overflow-hidden">
                    <span className="font-bold text-[#3D3D3D] truncate text-sm uppercase tracking-wide">
                      {layer.garment ? layer.garment.name : (layer.action === 'remove_jacket' ? 'Jacket Removed' : 'Digital Twin Base')}
                    </span>
                    <div className="flex items-center gap-2">
                        {layer.target && (
                            <span className="text-[9px] uppercase tracking-[0.2em] text-[#B8A66F] font-bold mt-0.5">
                                {layer.target} Piece
                            </span>
                        )}
                        {index > 0 && editingLayerIndex !== index && layer.garment && (
                            <span className="text-[8px] uppercase tracking-widest text-gray-400 font-bold mt-0.5 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                • Replace Piece
                            </span>
                        )}
                        {editingLayerIndex === index && (
                             <span className="text-[8px] uppercase tracking-widest text-[#B8A66F] font-bold mt-0.5 animate-pulse">
                                • Editing...
                             </span>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-1">
                {index > 0 && layer.garment && (
                    <button
                        onClick={() => onEditLayer(index)}
                        className={`p-2 rounded-lg transition-colors ${editingLayerIndex === index ? 'text-[#B8A66F] bg-[#B8A66F11]' : 'text-gray-400 hover:text-[#B8A66F] hover:bg-[#FDFCFB]'}`}
                        title="Replace Piece"
                    >
                        <RotateCcwIcon className="w-5 h-5" />
                    </button>
                )}
                {index > 0 && index === outfitHistory.length - 1 && (
                <button
                    onClick={onRemoveLastGarment}
                    className="flex-shrink-0 text-gray-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50"
                    aria-label={`Remove ${layer.garment?.name || 'action'}`}
                >
                    <Trash2Icon className="w-5 h-5" />
                </button>
                )}
            </div>
          </div>
        ))}
        {outfitHistory.length === 1 && (
            <div className="text-center py-6 px-4 border-2 border-dashed border-[#E3DCD1] rounded-2xl bg-[#FFFDF9]/50">
              <p className="text-[11px] uppercase tracking-widest text-gray-400 font-bold">Build your silhouette layer by layer below</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default OutfitStack;
