import React, { useState } from 'react';
import type { ShirtStyle } from '../constants/fabricSwatches';

interface ShirtStyleSelectorProps {
    onStyleSelected: (style: ShirtStyle) => void;
    onBack: () => void;
}

export const ShirtStyleSelector: React.FC<ShirtStyleSelectorProps> = ({ onStyleSelected, onBack }) => {
    const [selectedCollar, setSelectedCollar] = useState('spread');
    const [selectedCuff, setSelectedCuff] = useState('barrel');
    const [selectedFront, _setSelectedFront] = useState('placket');

    const handleConfirm = () => {
        onStyleSelected({
            collar: selectedCollar,
            cuff: selectedCuff,
            front: selectedFront,
            back: 'plain'
        });
    };

    return (
        <div className="flex flex-col h-full bg-[#F9F7F4] overflow-y-auto">
            <div className="p-8 md:p-12 bg-white border-b border-[#EAEAEA] shadow-sm flex justify-between items-center">
                <div>
                    <h3 className="text-3xl font-serif text-[#1A1A1A] mb-2">Shirt Configuration</h3>
                    <p className="text-[10px] text-[#9A8A55] font-bold tracking-[0.3em] uppercase">Step 4: Construction</p>
                </div>
                <button onClick={onBack} className="text-[#666] text-[10px] font-bold uppercase tracking-widest hover:text-[#1A1A1A]">← Back</button>
            </div>

            <div className="flex-grow p-6 md:p-12 max-w-4xl mx-auto w-full space-y-12">
                {/* Collar Section */}
                <section>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-8 h-[1px] bg-[#B8A66F]"></div>
                        <h4 className="text-[10px] font-bold text-[#1A1A1A] uppercase tracking-widest">Select Collar</h4>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {['spread', 'cutaway', 'button-down', 'wing'].map(collar => (
                            <button
                                key={collar}
                                onClick={() => setSelectedCollar(collar)}
                                className={`p - 6 border text - center transition - all ${selectedCollar === collar ? 'border-[#B8A66F] bg-[#FDFBF2]' : 'border-[#EAEAEA] bg-white hover:border-gray-300'} `}
                            >
                                <div className="text-2xl mb-2">👔</div>
                                <span className="text-sm font-serif capitalize text-[#1A1A1A]">{collar.replace('-', ' ')}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Cuff Section */}
                <section>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-8 h-[1px] bg-[#B8A66F]"></div>
                        <h4 className="text-[10px] font-bold text-[#1A1A1A] uppercase tracking-widest">Select Cuff</h4>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {['barrel', 'french', 'convertible'].map(cuff => (
                            <button
                                key={cuff}
                                onClick={() => setSelectedCuff(cuff)}
                                className={`p - 6 border text - center transition - all ${selectedCuff === cuff ? 'border-[#B8A66F] bg-[#FDFBF2]' : 'border-[#EAEAEA] bg-white hover:border-gray-300'} `}
                            >
                                <span className="text-sm font-serif capitalize text-[#1A1A1A]">{cuff}</span>
                            </button>
                        ))}
                    </div>
                </section>

                <button
                    onClick={handleConfirm}
                    className="w-full bg-[#1A1A1A] text-white py-5 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#B8A66F] transition-all shadow-xl"
                >
                    Select Fabrics →
                </button>
            </div>
        </div>
    );
};
