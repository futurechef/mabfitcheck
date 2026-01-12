
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { RotateCcwIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon } from './icons';
import Spinner from './Spinner';
import { AnimatePresence, motion } from 'framer-motion';

interface CanvasProps {
  displayImageUrl: string | null;
  onStartOver: () => void;
  isLoading: boolean;
  loadingMessage: string;
  onSelectPose: (index: number) => void;
  poseInstructions: string[];
  currentPoseIndex: number;
  availablePoseKeys: string[];
}

const Canvas: React.FC<CanvasProps> = ({ displayImageUrl, onStartOver, isLoading, loadingMessage, onSelectPose, poseInstructions, currentPoseIndex, availablePoseKeys }) => {
  const [isPoseMenuOpen, setIsPoseMenuOpen] = useState(false);
  
  const handlePreviousPose = () => {
    if (isLoading || availablePoseKeys.length <= 1) return;

    const currentPoseInstruction = poseInstructions[currentPoseIndex];
    const currentIndexInAvailable = availablePoseKeys.indexOf(currentPoseInstruction);
    
    // Fallback if current pose not in available list (shouldn't happen)
    if (currentIndexInAvailable === -1) {
        onSelectPose((currentPoseIndex - 1 + poseInstructions.length) % poseInstructions.length);
        return;
    }

    const prevIndexInAvailable = (currentIndexInAvailable - 1 + availablePoseKeys.length) % availablePoseKeys.length;
    const prevPoseInstruction = availablePoseKeys[prevIndexInAvailable];
    const newGlobalPoseIndex = poseInstructions.indexOf(prevPoseInstruction);
    
    if (newGlobalPoseIndex !== -1) {
        onSelectPose(newGlobalPoseIndex);
    }
  };

  const handleNextPose = () => {
    if (isLoading) return;

    const currentPoseInstruction = poseInstructions[currentPoseIndex];
    const currentIndexInAvailable = availablePoseKeys.indexOf(currentPoseInstruction);

    // Fallback or if there are no generated poses yet
    if (currentIndexInAvailable === -1 || availablePoseKeys.length === 0) {
        onSelectPose((currentPoseIndex + 1) % poseInstructions.length);
        return;
    }
    
    const nextIndexInAvailable = currentIndexInAvailable + 1;
    if (nextIndexInAvailable < availablePoseKeys.length) {
        // There is another generated pose, navigate to it
        const nextPoseInstruction = availablePoseKeys[nextIndexInAvailable];
        const newGlobalPoseIndex = poseInstructions.indexOf(nextPoseInstruction);
        if (newGlobalPoseIndex !== -1) {
            onSelectPose(newGlobalPoseIndex);
        }
    } else {
        // At the end of generated poses, generate the next one from the master list
        const newGlobalPoseIndex = (currentPoseIndex + 1) % poseInstructions.length;
        onSelectPose(newGlobalPoseIndex);
    }
  };
  
  return (
    <div className="w-full h-full flex items-center justify-center p-2 md:p-8 relative group">
      {/* Start Over Button - Moved to bottom-left on mobile to avoid save icon collision */}
      <button 
          onClick={onStartOver}
          className="absolute bottom-6 md:top-6 left-6 z-30 flex items-center justify-center bg-white/80 border border-[#E3DCD1] text-[#3D3D3D] font-bold py-2 px-4 md:px-5 rounded-full transition-all duration-300 ease-in-out hover:bg-white hover:border-[#B8A66F] hover:shadow-lg active:scale-95 text-[10px] uppercase tracking-widest backdrop-blur-md shadow-sm"
      >
          <RotateCcwIcon className="w-4 h-4 md:mr-2" />
          <span className="hidden md:inline">Reset Workshop</span>
      </button>

      {/* Image Display or Placeholder */}
      <div className="relative w-full h-full flex items-center justify-center max-w-4xl mx-auto">
        {displayImageUrl ? (
          <img
            key={displayImageUrl} // Use key to force re-render and trigger animation on image change
            src={displayImageUrl}
            alt="Michael Andrews virtual try-on model"
            className="max-w-full max-h-full object-contain transition-all duration-1000 animate-fade-in rounded-3xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] grayscale-[0.02] group-hover:grayscale-0"
          />
        ) : (
            <div className="w-[320px] h-[480px] md:w-[450px] md:h-[650px] bg-[#FDFCFB] border border-[#E3DCD1] rounded-[2rem] flex flex-col items-center justify-center shadow-inner">
              <Spinner />
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#B8A66F] mt-6">Initializing Atelier</p>
            </div>
        )}
      </div>

      {/* Pose Controls - Integrated & Persistent on Mobile */}
      {displayImageUrl && !isLoading && (
        <div 
          className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-30 transition-all duration-500"
        >
          {/* Pose popover menu */}
          <AnimatePresence>
              {isPoseMenuOpen && (
                  <>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-30 bg-black/5 md:bg-transparent pointer-events-auto"
                        onClick={() => setIsPoseMenuOpen(false)}
                    />
                    <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 15, scale: 0.98 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-[280px] bg-white rounded-[1.5rem] p-3 border border-[#E3DCD1] shadow-2xl z-40"
                    >
                        <div className="flex items-center justify-between px-3 pb-2 mb-2 border-b border-[#E3DCD1]/50">
                            <span className="text-[10px] uppercase tracking-widest font-bold text-[#B8A66F]">Change Perspective</span>
                        </div>
                        <div className="grid grid-cols-1 gap-1 max-h-[40vh] overflow-y-auto custom-scrollbar">
                            {poseInstructions.map((pose, index) => (
                                <button
                                    key={pose}
                                    onClick={() => {
                                        onSelectPose(index);
                                        setIsPoseMenuOpen(false);
                                    }}
                                    disabled={isLoading || index === currentPoseIndex}
                                    className={`w-full text-left text-[11px] font-bold uppercase tracking-widest p-3 rounded-xl transition-all ${index === currentPoseIndex ? 'bg-[#3D3D3D] text-white' : 'text-[#3D3D3D] hover:bg-gray-100/70 hover:text-[#B8A66F]'}`}
                                >
                                    {pose}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                  </>
              )}
          </AnimatePresence>
          
          <div className="flex items-center justify-center gap-1 md:gap-3 bg-white/90 backdrop-blur-xl rounded-full p-1.5 md:p-2 border border-[#E3DCD1] shadow-xl">
            <button 
              onClick={handlePreviousPose}
              aria-label="Previous perspective"
              className="p-2 md:p-3 rounded-full hover:bg-gray-100 text-[#3D3D3D] active:scale-90 transition-all disabled:opacity-20"
              disabled={isLoading || availablePoseKeys.length <= 1}
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <button 
                onClick={() => setIsPoseMenuOpen(!isPoseMenuOpen)}
                className="px-3 md:px-6 flex flex-col items-center justify-center min-w-[140px] md:min-w-[180px]"
            >
              <span className="text-[8px] uppercase tracking-[0.2em] text-[#B8A66F] font-bold mb-0.5 flex items-center gap-1">
                  Perspectives <ChevronUpIcon className={`w-2 h-2 transition-transform ${isPoseMenuOpen ? 'rotate-180' : ''}`} />
              </span>
              <span className="text-[10px] md:text-[11px] font-bold text-[#3D3D3D] uppercase tracking-widest truncate max-w-[120px] md:max-w-none">
                {poseInstructions[currentPoseIndex]}
              </span>
            </button>
            <button 
              onClick={handleNextPose}
              aria-label="Next perspective"
              className="p-2 md:p-3 rounded-full hover:bg-gray-100 text-[#3D3D3D] active:scale-90 transition-all disabled:opacity-20"
              disabled={isLoading}
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Canvas;
