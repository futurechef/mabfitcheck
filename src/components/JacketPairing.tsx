import React from 'react';
import { SuitSelector } from './SuitSelector';
import type { SuitData } from '../types';
import type { ShirtConfiguration } from '../constants/fabricSwatches';

interface JacketPairingProps {
    shirtConfig: ShirtConfiguration;
    onComplete: (suit: SuitData) => void;
    onBack: () => void;
}

export const JacketPairing: React.FC<JacketPairingProps> = ({ shirtConfig, onComplete, onBack }) => {
    // Reuse SuitSelector but maybe with a header change?
    // For now just wrap it.
    return (
        <div className="h-full flex flex-col">
            <div className="p-4 bg-gray-50 text-center border-b border-[#EAEAEA]">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#B8A66F]">Pairing with: {shirtConfig.fabric.name}</p>
            </div>
            <div className="flex-grow overflow-hidden">
                <SuitSelector onSuitSelected={onComplete} onBack={onBack} />
            </div>
        </div>
    );
};
