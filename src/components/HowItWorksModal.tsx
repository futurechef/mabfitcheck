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
            icon: <CameraIcon className="w-6 h-6 text-indigo-500" />,
            description: "When you upload a photo, our system uses Gemini 2.5 Flash to extract your unique physiological features. It creates a 'Digital Twin'—a clean studio model that preserves your likeness, body type, and hair while normalizing the background for consistent styling."
        },
        {
            title: "2. Multimodal Fusion",
            icon: <LayersIcon className="w-6 h-6 text-cyan-500" />,
            description: "Instead of simple overlays, we send both your Model photo and the Garment photo to Gemini simultaneously. The model acts as a 'Spatial Anchor' while the garment acts as a 'Texture Source'. Gemini performs a complex neural swap, realistically fitting the garment to your body's specific contours."
        },
        {
            title: "3. Contextual Rendering",
            icon: <ShirtIcon className="w-6 h-6 text-pink-500" />,
            description: "Our prompts instruct the AI to calculate physics-based lighting and fabric draping. It ensures that the folds of the shirt or the shadows of a jacket match the lighting conditions of your original studio backdrop, resulting in a photorealistic composite."
        },
        {
            title: "4. Neural Pose Synthesis",
            icon: <SparklesIcon className="w-6 h-6 text-amber-500" />,
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
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative p-6 md:p-10 border-b border-gray-100">
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <XIcon className="w-5 h-5 text-gray-400" />
                            </button>
                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-2">Technical Workflow</h2>
                            <p className="text-gray-500 font-medium">How we generate accurate images from multiple photos.</p>
                        </div>

                        <div className="p-6 md:p-10 max-h-[60vh] overflow-y-auto space-y-8">
                            {steps.map((step, idx) => (
                                <div key={idx} className="flex gap-5">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100">
                                        {step.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800 mb-1">{step.title}</h3>
                                        <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-6 bg-gray-50 flex justify-end">
                            <button
                                onClick={onClose}
                                className="px-6 py-2 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
                            >
                                Got it
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default HowItWorksModal;
