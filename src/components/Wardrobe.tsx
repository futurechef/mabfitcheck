import React, { useEffect, useState } from 'react';
import type { WardrobeItem } from '../types';
import { trackEvent, getUserDesigns, deleteDesign, toggleDesignFavorite } from '../services/firebase';

interface WardrobeProps {
    userId: string;
}

export const Wardrobe: React.FC<WardrobeProps> = ({ userId }) => {
    const [designs, setDesigns] = useState<WardrobeItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<WardrobeItem | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadWardrobe();
    }, [userId]);

    const loadWardrobe = async () => {
        setLoading(true);
        try {
            const fetched = await getUserDesigns(userId);
            setDesigns(fetched);
        } catch (error) {
            console.error("Failed to load wardrobe", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to remove this design from your wardrobe?")) {
            try {
                await deleteDesign(userId, id);
                setDesigns(prev => prev.filter(d => d.id !== id));
                trackEvent('delete_design', { id });
            } catch (error) {
                console.error("Delete failed", error);
            }
        }
    };

    const toggleFavorite = async (id: string, isFav: boolean, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await toggleDesignFavorite(userId, id, !isFav);
            setDesigns(prev => prev.map(d => d.id === id ? { ...d, isFavorite: !isFav } : d));
            trackEvent('toggle_favorite_wardrobe', { id });
        } catch (error) {
            console.error("Favorite toggle failed", error);
        }
    };

    const openDetails = (item: WardrobeItem) => {
        setSelectedItem(item);
        trackEvent('view_design_details', { id: item.id, type: item.type });
    };

    const formatDate = (date: any) => {
        const d = date?.toDate ? date.toDate() : new Date(date);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    if (loading) {
        return <div className="flex h-full items-center justify-center"><div className="animate-spin h-8 w-8 border-2 border-[#B8A66F] rounded-full border-t-transparent"></div></div>;
    }

    return (
        <div className="flex flex-col h-full bg-[#F9F7F4] overflow-y-auto">
            <div className="p-8 md:p-12 bg-white border-b border-[#EAEAEA] shadow-sm flex justify-between items-end">
                <div>
                    <h3 className="text-4xl font-serif text-[#1A1A1A] mb-2">Your Wardrobe</h3>
                    <p className="text-[10px] text-[#9A8A55] font-bold tracking-[0.3em] uppercase">Visualized Commissions & Future Look</p>
                </div>
                <div className="text-right hidden md:block">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Items Collected</p>
                    <p className="text-2xl font-serif text-[#1A1A1A]">{designs.length}</p>
                </div>
            </div>

            <div className="p-6 md:p-12 max-w-7xl mx-auto w-full">
                {designs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center bg-white border border-[#EEE] p-12 shadow-sm">
                        <div className="w-24 h-24 rounded-full bg-[#FDFBF9] flex items-center justify-center shadow-inner mb-8 text-4xl">🧵</div>
                        <h4 className="text-3xl font-serif text-[#1A1A1A] mb-4">Your collection is empty</h4>
                        <p className="text-base text-[#666] max-w-sm mx-auto mb-10 leading-relaxed italic">
                            Begin a new session in the Atelier to visualize your bespoke commissions and track your custom configurations.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 pb-24">
                        {designs.filter(d => !d['deleted']).map((design) => (
                            <div
                                key={design.id}
                                onClick={() => openDetails(design)}
                                className="bg-white border border-[#EAEAEA] shadow-sm overflow-hidden group hover:shadow-2xl hover:border-[#B8A66F] transition-all cursor-pointer flex flex-col"
                            >
                                <div className="aspect-[3/4] relative overflow-hidden bg-[#F0F0F0]">
                                    <img src={design.imageUrl} alt={design.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />

                                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
                                        <div className="bg-[#1A1A1A]/90 backdrop-blur-sm px-3 py-1 text-[9px] font-bold tracking-[0.2em] uppercase text-[#B8A66F] border border-[#B8A66F]/50">
                                            {design.type}
                                        </div>
                                        <button
                                            onClick={(e) => toggleFavorite(design.id, !!design.isFavorite, e)}
                                            className={`w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center pointer-events-auto transition-transform hover:scale-110 ${design.isFavorite ? 'text-red-500' : 'text-gray-300'}`}
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill={design.isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
                                                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 000-7.78z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="p-8 flex-grow flex flex-col">
                                    <div className="flex justify-between items-start mb-3">
                                        <h5 className="font-serif text-2xl text-[#1A1A1A] group-hover:text-[#9A8A55] transition-colors line-clamp-2">{design.name}</h5>
                                        <button onClick={(e) => handleDelete(design.id, e)} className="text-gray-300 hover:text-red-500 transition-colors p-1">✕</button>
                                    </div>

                                    <div className="mt-auto space-y-4 pt-6 border-t border-[#F9F7F4]">
                                        <div className="flex justify-between items-center text-[10px] font-bold tracking-widest uppercase">
                                            <span className="text-gray-400">Captured</span>
                                            <span className="text-[#1A1A1A]">{formatDate(design.createdAt)}</span>
                                        </div>
                                        {design.suitData && (
                                            <div className="flex justify-between items-center text-[10px] font-bold tracking-widest uppercase">
                                                <span className="text-gray-400">Commission Price</span>
                                                <span className="text-[#B8A66F]">{design.suitData.price}</span>
                                            </div>
                                        )}
                                        <button className="w-full bg-[#1A1A1A] text-white py-3 text-[10px] font-bold tracking-[0.2em] uppercase group-hover:bg-[#B8A66F] transition-all shadow-md">
                                            See Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {selectedItem && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-[#0A0A0A]/95 backdrop-blur-md" onClick={() => setSelectedItem(null)}></div>
                    <div className="relative bg-white w-full max-w-6xl max-h-full overflow-y-auto flex flex-col md:flex-row shadow-2xl overflow-hidden rounded-sm">
                        <button onClick={() => setSelectedItem(null)} className="absolute top-6 right-6 z-20 bg-white/10 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all font-bold">✕</button>
                        <div className="w-full md:w-3/5 bg-gray-50 flex items-center justify-center">
                            <img src={selectedItem.imageUrl} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="w-full md:w-2/5 p-10 md:p-16 flex flex-col bg-[#FDFCFB]">
                            <div className="mb-12">
                                <p className="text-[11px] font-bold text-[#B8A66F] tracking-[0.4em] uppercase mb-3">Visualization Record</p>
                                <h4 className="text-4xl font-serif text-[#1A1A1A] leading-tight mb-4">{selectedItem.name}</h4>
                                <div className="h-0.5 w-16 bg-[#B8A66F]"></div>
                            </div>
                            <div className="space-y-10 flex-grow">
                                {selectedItem.shirtConfig && (
                                    <div className="space-y-6">
                                        <h6 className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase border-b border-[#EEE] pb-2">Bespoke Shirt</h6>
                                        <p className="text-lg font-serif text-[#1A1A1A] capitalize">{selectedItem.shirtConfig.fabric.name} | {selectedItem.shirtConfig.style.collar}</p>
                                    </div>
                                )}
                                {selectedItem.suitData && (
                                    <div className="space-y-6 pt-6 border-t border-[#EEE]">
                                        <h6 className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase border-b border-[#EEE] pb-2">Commissioned Suit</h6>
                                        <p className="text-base font-serif text-[#1A1A1A]">{selectedItem.suitData.fabricType} - {selectedItem.suitData.price}</p>
                                    </div>
                                )}
                            </div>
                            <div className="mt-16 space-y-4">
                                <button className="w-full bg-[#1A1A1A] text-white py-5 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#B8A66F] transition-all shadow-xl">Initiate Commission</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
