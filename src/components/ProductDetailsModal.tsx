import React from 'react';
import type { SuitData } from '../types';

interface ProductDetailsModalProps {
    product: SuitData; // Can be expanded for Shirts too
    isOpen: boolean;
    onClose: () => void;
    onSelect?: () => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ product, isOpen, onClose, onSelect }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-[#0A0A0A]/90 backdrop-blur-md" onClick={onClose}></div>

            <div className="relative bg-[#FDFCFB] w-full max-w-6xl max-h-full overflow-hidden flex flex-col md:flex-row shadow-2xl rounded-sm">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-20 text-[#1A1A1A] bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-[#B8A66F] hover:text-white transition-all font-bold"
                >
                    ✕
                </button>

                {/* Product Image */}
                <div className="w-full md:w-1/2 bg-[#F0F0F0] overflow-hidden">
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                </div>

                {/* Content */}
                <div className="w-full md:w-1/2 p-10 md:p-16 overflow-y-auto flex flex-col">
                    <div className="mb-12">
                        <p className="text-[11px] font-bold text-[#B8A66F] tracking-[0.4em] uppercase mb-3">{product.productionType} Collection</p>
                        <h3 className="text-4xl font-serif text-[#1A1A1A] leading-tight mb-4">{product.name}</h3>
                        <div className="h-0.5 w-16 bg-[#B8A66F]"></div>
                    </div>

                    <div className="grid grid-cols-2 gap-y-10 mb-12 flex-grow">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Commission Price</p>
                            <p className="text-2xl font-serif text-[#1A1A1A]">{product.price}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Lead Time</p>
                            <p className="text-lg font-serif text-[#1A1A1A]">{product.productionTime}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Fabric Composition</p>
                            <p className="text-sm font-body text-[#444] leading-relaxed">{product.fabricType} from {product.fabricMill}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Construction</p>
                            <p className="text-sm font-body text-[#444]">{product.buttonCount}-Button {product.lapelStyle}</p>
                        </div>
                        <div className="col-span-2 space-y-1 pt-4 border-t border-[#EEE]">
                            <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Master Tailor's Note</p>
                            <p className="text-sm font-body text-[#666] leading-relaxed italic">{product.description}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {onSelect && (
                            <button
                                onClick={() => { onSelect(); onClose(); }}
                                className="w-full bg-[#1A1A1A] text-white py-5 text-[11px] font-bold tracking-[0.3em] uppercase hover:bg-[#B8A66F] transition-all shadow-xl"
                            >
                                Select for Try-On
                            </button>
                        )}
                        <a
                            href={product.productUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="block w-full text-center border border-[#EAEAEA] py-4 text-[10px] font-bold tracking-[0.2em] uppercase text-[#1A1A1A] hover:bg-white hover:text-[#B8A66F] transition-all"
                        >
                            Learn More at MichaelAndrews.com
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};
