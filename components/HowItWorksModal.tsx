
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, ShirtIcon, SparklesIcon, LayersIcon, CameraIcon } from './icons';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  const steps = [
    {
      title: "1. Identity Anchoring",
      icon: <CameraIcon className="w-6 h-6 text-[#1A2D4D]" />,
      description: "When you upload a photo, our system uses Gemini 3 Pro to extract your unique physiological features. It creates a 'Digital Twin'—a clean studio model that preserves your likeness, body type, and hair while normalizing the background for consistent styling."
    },
    {
      title: "2. Multimodal Fusion",
      icon: <LayersIcon className="w-6 h-6 text-[#B8A66F]" />,
      description: "Instead of simple overlays, we send both your Model photo and the Garment photo to Gemini simultaneously. The model acts as a 'Spatial Anchor' while the garment acts as a 'Texture Source'. Gemini performs a complex neural swap, realistically fitting the garment to your body's specific contours."
    },
    {
      title: "3. Contextual Rendering",
      icon: <ShirtIcon className="w-6 h-6 text-[#6B7D5B]" />,
      description: "Our prompts instruct the AI to calculate physics-based lighting and fabric draping. It ensures that the folds of the shirt or the shadows of a jacket match the lighting conditions of your original studio backdrop, resulting in a photorealistic composite."
    },
    {
      title: "4. Neural Pose Synthesis",
      icon: <SparklesIcon className="w-6 h-6 text-[#3D3D3D]" />,
      description: "To show you different angles, we don't just crop. We use your current look as a reference and ask Gemini to 'hallucinate' your identity and outfit from a new perspective, maintaining 100% consistency across 3D rotations."
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#3D3D3D]/60 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-[#FDFCFB] rounded-[2.5rem] w-full max-w-3xl overflow-hidden shadow-3xl border border-[#E3DCD1]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative p-10 md:p-14 border-b border-[#E3DCD1]">
              <button 
                onClick={onClose}
                className="absolute top-10 right-10 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <XIcon className="w-6 h-6 text-gray-400" />
              </button>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#3D3D3D] mb-4">Neural Atelier</h2>
              <p className="text-[#B8A66F] font-bold uppercase tracking-[0.2em] text-xs">A world-class technical workflow.</p>
            </div>
            
            <div className="p-10 md:p-14 max-h-[60vh] overflow-y-auto space-y-12 custom-scrollbar">
              {steps.map((step, idx) => (
                <div key={idx} className="flex gap-8 group">
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white flex items-center justify-center border border-[#E3DCD1] shadow-sm group-hover:border-[#B8A66F] transition-all duration-500 group-hover:shadow-lg">
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#3D3D3D] mb-2 uppercase tracking-wide">{step.title}</h3>
                    <p className="text-gray-500 leading-relaxed font-serif italic text-lg">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-8 bg-white flex justify-end">
              <button 
                onClick={onClose}
                className="px-12 py-4 bg-[#3D3D3D] text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-[#1A2D4D] transition-colors shadow-xl"
              >
                Enter Atelier
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HowItWorksModal;
