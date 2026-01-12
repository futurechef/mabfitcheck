
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloudIcon, RotateCcwIcon } from './icons';
import { Compare } from './ui/compare';
import { generateModelImage } from '../services/geminiService';
import Spinner from './Spinner';
import { getFriendlyErrorMessage } from '../lib/utils';

interface StartScreenProps {
  onModelFinalized: (modelUrl: string) => void;
  onLoadSession?: () => void;
  hasSavedSession?: boolean;
}

const StartScreen: React.FC<StartScreenProps> = ({ onModelFinalized, onLoadSession, hasSavedSession }) => {
  const [userImageUrl, setUserImageUrl] = useState<string | null>(null);
  const [generatedModelUrl, setGeneratedModelUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
            setError(getFriendlyErrorMessage(err, 'Failed to create model'));
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

  return (
    <AnimatePresence mode="wait">
      {!userImageUrl ? (
        <motion.div
          key="uploader"
          className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-24 px-6"
          variants={screenVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <div className="lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="max-w-lg">
              <span className="text-xs font-sans tracking-[0.4em] uppercase text-[#B8A66F] font-bold mb-4 block">
                Michael Andrews Bespoke
              </span>
              <h1 className="text-5xl md:text-7xl font-serif font-bold text-[#3D3D3D] leading-[1.1]">
                Bespoke Fit, <br/><span className="italic">Neural Precision.</span>
              </h1>
              <p className="mt-6 text-lg text-gray-500 leading-relaxed">
                Experience the world's finest custom tailoring with AI-driven visualization. 
                Upload your portrait to create a digital twin tailored to your physique.
              </p>
              
              <div className="mt-12 flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex-1 w-full flex flex-col gap-3">
                    <label htmlFor="image-upload-start" className="w-full relative flex items-center justify-center px-8 py-5 text-sm font-bold uppercase tracking-widest text-white bg-[#1A2D4D] rounded-full cursor-pointer group hover:bg-[#2C3E50] transition-all shadow-2xl hover:shadow-indigo-500/20 active:scale-[0.98]">
                        <UploadCloudIcon className="w-5 h-5 mr-3" />
                        Start New Session
                    </label>
                    <input id="image-upload-start" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
                    <p className="text-gray-400 text-[10px] uppercase tracking-widest text-center lg:text-left">
                        Best with a clear full-body photo
                    </p>
                </div>
                
                {hasSavedSession && (
                    <button 
                        onClick={onLoadSession}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-5 bg-white border border-[#E3DCD1] text-[#3D3D3D] text-sm font-bold uppercase tracking-widest rounded-full hover:bg-[#FDFCFB] hover:border-[#B8A66F] transition-all shadow-md group active:scale-[0.98]"
                    >
                        <RotateCcwIcon className="w-5 h-5 group-hover:rotate-[-45deg] transition-transform" />
                        Resume Save
                    </button>
                )}
              </div>
              
              {error && (
                <div className="mt-6 p-4 bg-red-50 border-l-2 border-red-400 rounded-r-lg">
                    <p className="text-red-800 text-xs font-medium uppercase tracking-widest mb-1">Error Identified</p>
                    <p className="text-red-600 text-sm font-serif italic">{error}</p>
                </div>
              )}
            </div>
          </div>
          <div className="w-full lg:w-2/5 flex flex-col items-center justify-center">
            <Compare
              firstImage="https://mabsuit-479703.web.app/shirts/michael-andrews-blue-denim-shirt.png"
              secondImage="https://storage.googleapis.com/mabbucket/MABSUITapp/fabric_swatches/SHFW-0222H.jpg"
              slideMode="drag"
              className="w-full aspect-[3/4] rounded-3xl bg-[#FDFCFB] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-[#E3DCD1]"
            />
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="compare"
          className="w-full max-w-6xl mx-auto h-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-24 px-6"
          variants={screenVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <div className="md:w-1/2 flex-shrink-0 flex flex-col items-center md:items-start">
            <div className="text-center md:text-left">
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#B8A66F] mb-2 block">Normalization Complete</span>
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-[#3D3D3D] leading-tight">
                Identity <br/>Anchor Found
              </h1>
              <p className="mt-4 text-lg text-gray-500 italic font-serif">
                "We've extracted your unique proportions to ensure every bespoke item fits with technical precision."
              </p>
            </div>
            
            {isGenerating && (
              <div className="flex items-center gap-4 text-sm uppercase tracking-widest font-bold text-[#B8A66F] mt-10">
                <Spinner />
                <span>Generating Digital Twin...</span>
              </div>
            )}

            {error && 
              <div className="text-center md:text-left mt-8">
                <div className="mb-6 p-4 bg-red-50 border-l-2 border-red-400 rounded-r-lg max-w-sm">
                    <p className="text-red-800 text-xs font-bold uppercase mb-1">Tailoring Failed</p>
                    <p className="text-red-600 text-sm italic">{error}</p>
                </div>
                <button onClick={reset} className="text-xs font-bold uppercase tracking-widest text-[#3D3D3D] hover:text-[#B8A66F] transition-colors flex items-center gap-2">
                    <RotateCcwIcon className="w-4 h-4" /> Reset Workshop
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
                    className="flex-1 w-full px-8 py-4 text-xs font-bold uppercase tracking-widest text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-all active:scale-[0.98]"
                  >
                    Rescan
                  </button>
                  <button 
                    onClick={() => onModelFinalized(generatedModelUrl)}
                    className="flex-1 w-full px-8 py-4 text-xs font-bold uppercase tracking-widest text-white bg-[#1A2D4D] rounded-full hover:bg-[#2C3E50] transition-all shadow-xl active:scale-[0.98]"
                  >
                    Enter Atelier
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="md:w-1/2 w-full flex items-center justify-center">
            <div 
              className={`relative rounded-[2rem] transition-all duration-700 ease-in-out ${isGenerating ? 'animate-pulse scale-[0.98]' : ''}`}
            >
              <Compare
                firstImage={userImageUrl}
                secondImage={generatedModelUrl ?? userImageUrl}
                slideMode="drag"
                className="w-[300px] h-[450px] sm:w-[350px] sm:h-[525px] lg:w-[420px] lg:h-[630px] rounded-[2rem] bg-[#FDFCFB] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border border-[#E3DCD1]"
              />
              {isGenerating && (
                 <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px] rounded-[2rem] flex items-center justify-center overflow-hidden">
                    <div className="w-full h-2 bg-[#B8A66F22] absolute top-1/2 animate-bounce" />
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
