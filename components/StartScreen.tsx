
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloudIcon, RotateCcwIcon, SaveIcon } from './icons';
import { Compare } from './ui/compare';
import { generateModelImage } from '../services/geminiService';
import Spinner from './Spinner';
import { getFriendlyErrorMessage } from '../lib/utils';

// Global types for AI Studio environment
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    readonly aistudio: AIStudio;
  }
}

interface StartScreenProps {
  onModelFinalized: (modelUrl: string) => void;
  onLoadSession?: () => void;
  hasSavedSession?: boolean;
}

const StartScreen: React.FC<StartScreenProps> = ({ onModelFinalized, onLoadSession, hasSavedSession }) => {
  const [hasKey, setHasKey] = useState<boolean | null>(null);
  const [userImageUrl, setUserImageUrl] = useState<string | null>(null);
  const [generatedModelUrl, setGeneratedModelUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkKey = async () => {
      const selected = await window.aistudio.hasSelectedApiKey();
      setHasKey(selected);
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    await window.aistudio.openSelectKey();
    // Proceed regardless of race condition as per instructions
    setHasKey(true);
  };

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
        setError('Please select an image file.');
        return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        setUserImageUrl(dataUrl);
        setIsGenerating(true);
        setGeneratedModelUrl(null);
        setError(null);
        try {
            const result = await generateModelImage(file);
            setGeneratedModelUrl(result);
        } catch (err) {
            const errMsg = getFriendlyErrorMessage(err, 'Failed to create model');
            setError(errMsg);
            
            // If the error suggests key issues, re-prompt key selection
            if (errMsg.includes("Requested entity was not found")) {
                setHasKey(false);
            }
            setUserImageUrl(null);
        } finally {
            setIsGenerating(false);
        }
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const reset = () => {
    setUserImageUrl(null);
    setGeneratedModelUrl(null);
    setIsGenerating(false);
    setError(null);
  };

  const screenVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  };

  if (hasKey === false) {
    return (
        <motion.div
            className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center p-12 bg-white rounded-[2.5rem] shadow-2xl border border-[#E3DCD1] text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <span className="text-xs font-sans tracking-[0.4em] uppercase text-[#B8A66F] font-bold mb-6 block">
                Access Restricted
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#3D3D3D] mb-6">
                Connect to the Atelier
            </h1>
            <p className="text-lg text-gray-500 font-serif italic mb-10 leading-relaxed">
                "Our Neural Atelier requires a valid Gemini 3 Pro API Key to process world-class bespoke visualizations with 1K resolution."
            </p>
            <button 
                onClick={handleSelectKey}
                className="px-12 py-5 bg-[#1A2D4D] text-white text-sm font-bold uppercase tracking-widest rounded-full hover:bg-[#2C3E50] transition-all shadow-xl active:scale-95 flex items-center gap-3"
            >
                <SaveIcon className="w-5 h-5" />
                Select API Key
            </button>
            <p className="mt-8 text-xs text-gray-400 font-sans">
                A paid project is required. Visit <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener" className="underline hover:text-[#B8A66F]">Google Billing Docs</a> for more information.
            </p>
        </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {!userImageUrl ? (
        <motion.div
          key="uploader"
          className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 px-6"
          variants={screenVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <div className="lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="max-w-xl">
              <span className="text-xs font-sans tracking-[0.4em] uppercase text-[#B8A66F] font-bold mb-6 block">
                Gemini 3 Pro Atelier · New York
              </span>
              <h1 className="text-6xl md:text-7xl font-serif font-bold text-[#3D3D3D] leading-[1.05] mb-6">
                Exceptional <br/><span className="italic text-[#B8A66F]">Precision</span>
              </h1>
              <p className="text-xl text-gray-500 leading-relaxed font-serif italic mb-10">
                "Harnessing the world's most capable multimodal model for bespoke visualization."
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5 items-stretch sm:items-center">
                <div className="flex-1 flex flex-col gap-3">
                    <label htmlFor="image-upload-start" className="w-full relative flex items-center justify-center px-10 py-5 text-sm font-bold uppercase tracking-widest text-white bg-[#1A2D4D] rounded-full cursor-pointer group hover:bg-[#2C3E50] transition-all shadow-xl hover:shadow-[#1A2D4D]/20 active:scale-[0.98]">
                    <UploadCloudIcon className="w-5 h-5 mr-3" />
                    Create Digital Twin
                    </label>
                    <input id="image-upload-start" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
                </div>
                
                {hasSavedSession && (
                    <button 
                        onClick={onLoadSession}
                        className="flex items-center justify-center gap-2 px-10 py-5 bg-white border border-[#E3DCD1] text-[#3D3D3D] text-sm font-bold uppercase tracking-widest rounded-full hover:bg-[#FDFCFB] hover:border-[#B8A66F] transition-all shadow-md group active:scale-[0.98]"
                    >
                        <RotateCcwIcon className="w-5 h-5 group-hover:rotate-[-45deg] transition-transform" />
                        Resume Save
                    </button>
                )}
              </div>
              
              <p className="mt-6 text-gray-400 text-[11px] uppercase tracking-widest font-bold">
                1K Multimodal Synthesis via Gemini 3 Pro
              </p>
              
              {error && (
                <div className="mt-8 p-4 bg-red-50 border-l-2 border-red-400 rounded-r-xl">
                  <p className="text-red-800 text-xs font-bold uppercase tracking-widest mb-1">Tailoring Exception</p>
                  <p className="text-red-600 text-sm font-serif italic">{error}</p>
                </div>
              )}
            </div>
          </div>
          <div className="w-full lg:w-2/5 flex flex-col items-center justify-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-[#B8A66F]/10 rounded-[2.5rem] blur-2xl group-hover:bg-[#B8A66F]/15 transition-all duration-700" />
              <Compare
                firstImage="https://mabsuit-479703.web.app/shirts/michael-andrews-blue-denim-shirt.png"
                secondImage="https://storage.googleapis.com/mabbucket/MABSUITapp/fabric_swatches/SHFW-0222H.jpg"
                slideMode="drag"
                className="w-full aspect-[3/4] rounded-[2rem] bg-[#FDFCFB] shadow-2xl border border-[#E3DCD1] relative z-10"
              />
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="compare"
          className="w-full max-w-6xl mx-auto h-full flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 px-6"
          variants={screenVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <div className="md:w-1/2 flex-shrink-0 flex flex-col items-center md:items-start">
            <div className="text-center md:text-left">
              <span className="text-[11px] uppercase tracking-[0.4em] font-bold text-[#B8A66F] mb-4 block">Anchor Point Verified</span>
              <h1 className="text-5xl md:text-7xl font-serif font-bold text-[#3D3D3D] leading-none mb-6">
                Professional <br/><span className="italic">Excellence.</span>
              </h1>
              <p className="text-xl text-gray-500 font-serif italic max-w-md">
                "We have extracted your anatomical proportions using multimodal reasoning to guarantee world-class bespoke fit."
              </p>
            </div>
            
            {isGenerating && (
              <div className="flex items-center gap-4 text-sm uppercase tracking-widest font-bold text-[#B8A66F] mt-12 bg-white px-6 py-3 rounded-full shadow-sm border border-[#B8A66F11]">
                <Spinner />
                <span>Crafting Digital Twin...</span>
              </div>
            )}

            {error && 
              <div className="text-center md:text-left mt-10">
                <div className="mb-6 p-5 bg-red-50 border-l-2 border-red-400 rounded-r-2xl max-w-sm">
                  <p className="text-red-800 text-xs font-bold uppercase tracking-widest mb-1">Normalization Error</p>
                  <p className="text-red-600 text-sm italic">{error}</p>
                </div>
                <button onClick={reset} className="text-xs font-bold uppercase tracking-widest text-[#3D3D3D] hover:text-[#B8A66F] transition-colors flex items-center gap-2">
                  <RotateCcwIcon className="w-4 h-4" /> Restart Scan
                </button>
              </div>
            }
            
            <AnimatePresence>
              {generatedModelUrl && !isGenerating && !error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col sm:flex-row items-center gap-4 mt-12 w-full max-w-md"
                >
                  <button 
                    onClick={reset}
                    className="flex-1 w-full px-10 py-5 text-xs font-bold uppercase tracking-widest text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-all active:scale-[0.98]"
                  >
                    Rescan
                  </button>
                  <button 
                    onClick={() => onModelFinalized(generatedModelUrl)}
                    className="flex-1 w-full px-10 py-5 text-xs font-bold uppercase tracking-widest text-white bg-[#1A2D4D] rounded-full hover:bg-[#2C3E50] transition-all shadow-xl active:scale-[0.98]"
                  >
                    Enter Atelier
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="md:w-1/2 w-full flex items-center justify-center">
            <div 
              className={`relative rounded-[2.5rem] transition-all duration-1000 ease-in-out ${isGenerating ? 'animate-pulse scale-[0.98]' : 'hover:scale-[1.01]'}`}
            >
              <Compare
                firstImage={userImageUrl}
                secondImage={generatedModelUrl ?? userImageUrl}
                slideMode="drag"
                className="w-[320px] h-[480px] sm:w-[380px] sm:h-[570px] lg:w-[450px] lg:h-[675px] rounded-[2.5rem] bg-[#FDFCFB] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] border border-[#E3DCD1] relative z-10"
              />
              {isGenerating && (
                <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px] rounded-[2.5rem] z-20 flex items-center justify-center overflow-hidden pointer-events-none">
                  <div className="w-full h-1 bg-[#B8A66F44] absolute top-1/2 animate-bounce" />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StartScreen;
