
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StartScreen from './components/StartScreen';
import Canvas from './components/Canvas';
import WardrobePanel from './components/WardrobeModal';
import OutfitStack from './components/OutfitStack';
import { generateVirtualTryOnImage, generatePoseVariation, generateJacketRemovalImage } from './services/geminiService';
import { OutfitLayer, WardrobeItem, ClothingTarget } from './types';
import { ChevronDownIcon, ChevronUpIcon, SaveIcon, ShirtIcon, PlusIcon } from './components/icons';
import { defaultWardrobe } from './wardrobe';
import { getFriendlyErrorMessage } from './lib/utils';
import Spinner from './components/Spinner';
import Header from './components/Header';
import HowItWorksModal from './components/HowItWorksModal';

const POSE_INSTRUCTIONS = [
  "Full frontal view, hands on hips",
  "Slightly turned, 3/4 view",
  "Side profile view",
  "Jumping in the air, mid-action shot",
  "Walking towards camera",
  "Leaning against a wall",
];

const LOCAL_STORAGE_KEY = 'mab_bespoke_session_v4';

const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);

    mediaQueryList.addEventListener('change', listener);
    
    if (mediaQueryList.matches !== matches) {
      setMatches(mediaQueryList.matches);
    }

    return () => {
      mediaQueryList.removeEventListener('change', listener);
    };
  }, [query, matches]);

  return matches;
};


const App: React.FC = () => {
  const [modelImageUrl, setModelImageUrl] = useState<string | null>(null);
  const [outfitHistory, setOutfitHistory] = useState<OutfitLayer[]>([]);
  const [currentOutfitIndex, setCurrentOutfitIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [currentPoseIndex, setCurrentPoseIndex] = useState(0);
  const [isSheetCollapsed, setIsSheetCollapsed] = useState(true);
  const [wardrobe, setWardrobe] = useState<WardrobeItem[]>(defaultWardrobe);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [activeTarget, setActiveTarget] = useState<ClothingTarget>('shirt');
  const [tailorNotes, setTailorNotes] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [editingLayerIndex, setEditingLayerIndex] = useState<number | null>(null);
  
  const isMobile = useMediaQuery('(max-width: 767px)');

  // Persistence logic
  const saveSession = useCallback(() => {
    const sessionData = {
      modelImageUrl,
      outfitHistory,
      currentOutfitIndex,
      currentPoseIndex,
      activeTarget,
      tailorNotes,
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sessionData));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  }, [modelImageUrl, outfitHistory, currentOutfitIndex, currentPoseIndex, activeTarget, tailorNotes]);

  const loadSession = useCallback(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setModelImageUrl(data.modelImageUrl);
        setOutfitHistory(data.outfitHistory);
        setCurrentOutfitIndex(data.currentOutfitIndex);
        setCurrentPoseIndex(data.currentPoseIndex);
        setActiveTarget(data.activeTarget || 'shirt');
        setTailorNotes(data.tailorNotes || '');
      } catch (e) {
        console.error("Failed to load session", e);
      }
    }
  }, []);

  const activeOutfitLayers = useMemo(() => 
    outfitHistory.slice(0, currentOutfitIndex + 1), 
    [outfitHistory, currentOutfitIndex]
  );
  
  const activeGarmentIds = useMemo(() => 
    activeOutfitLayers.map(layer => layer.garment?.id).filter(Boolean) as string[], 
    [activeOutfitLayers]
  );
  
  const displayImageUrl = useMemo(() => {
    if (outfitHistory.length === 0) return modelImageUrl;
    const currentLayer = outfitHistory[currentOutfitIndex];
    if (!currentLayer) return modelImageUrl;

    const poseInstruction = POSE_INSTRUCTIONS[currentPoseIndex];
    return currentLayer.poseImages[poseInstruction] ?? Object.values(currentLayer.poseImages)[0];
  }, [outfitHistory, currentOutfitIndex, currentPoseIndex, modelImageUrl]);

  const availablePoseKeys = useMemo(() => {
    if (outfitHistory.length === 0) return [];
    const currentLayer = outfitHistory[currentOutfitIndex];
    return currentLayer ? Object.keys(currentLayer.poseImages) : [];
  }, [outfitHistory, currentOutfitIndex]);

  const handleModelFinalized = (url: string) => {
    setModelImageUrl(url);
    setOutfitHistory([{
      garment: null,
      poseImages: { [POSE_INSTRUCTIONS[0]]: url }
    }]);
    setCurrentOutfitIndex(0);
  };

  const handleStartOver = () => {
    if (confirm("Are you sure you want to start over? This will clear your current session.")) {
        setModelImageUrl(null);
        setOutfitHistory([]);
        setCurrentOutfitIndex(0);
        setIsLoading(false);
        setLoadingMessage('');
        setError(null);
        setCurrentPoseIndex(0);
        setIsSheetCollapsed(true);
        setWardrobe(defaultWardrobe);
        setTailorNotes('');
        setEditingLayerIndex(null);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  const handleRemoveJacket = useCallback(async () => {
      if (!displayImageUrl || isLoading) return;
      
      setError(null);
      setIsLoading(true);
      setLoadingMessage("Removing suit jacket...");

      try {
          const newImageUrl = await generateJacketRemovalImage(displayImageUrl);
          const currentPoseInstruction = POSE_INSTRUCTIONS[currentPoseIndex];
          
          const newLayer: OutfitLayer = {
              garment: null,
              target: 'jacket',
              action: 'remove_jacket',
              poseImages: { [currentPoseInstruction]: newImageUrl }
          };

          setOutfitHistory(prev => {
              const newHistory = prev.slice(0, currentOutfitIndex + 1);
              return [...newHistory, newLayer];
          });
          setCurrentOutfitIndex(prev => prev + 1);
          if (isMobile) setIsSheetCollapsed(true);
      } catch (err) {
          setError(getFriendlyErrorMessage(err, 'Failed to remove jacket'));
      } finally {
          setIsLoading(false);
          setLoadingMessage('');
      }
  }, [displayImageUrl, isLoading, currentPoseIndex, currentOutfitIndex, isMobile]);

  const handleGarmentSelect = useCallback(async (garmentSource: File | string, garmentInfo: WardrobeItem) => {
    if (!displayImageUrl || isLoading || !modelImageUrl) return;

    // Check if we are replacing an existing layer
    if (editingLayerIndex !== null && editingLayerIndex > 0) {
      const targetLayer = outfitHistory[editingLayerIndex];
      if (targetLayer.garment?.id === garmentInfo.id) {
          setEditingLayerIndex(null);
          return;
      }

      setError(null);
      setIsLoading(true);
      setLoadingMessage(`Updating ${garmentInfo.category}...`);

      try {
        const newHistory = [...outfitHistory];
        const currentPoseInstruction = POSE_INSTRUCTIONS[currentPoseIndex];
        
        // 1. Regenerate the target layer using the base image of the previous layer
        const previousLayerOutput = Object.values(newHistory[editingLayerIndex - 1].poseImages)[0];
        const updatedTargetImage = await generateVirtualTryOnImage(previousLayerOutput, garmentSource, activeTarget);
        
        newHistory[editingLayerIndex] = {
            ...newHistory[editingLayerIndex],
            garment: garmentInfo,
            target: activeTarget,
            poseImages: { [currentPoseInstruction]: updatedTargetImage }
        };

        // 2. Cascading regeneration for subsequent layers
        let cascadeSource = updatedTargetImage;
        for (let i = editingLayerIndex + 1; i <= currentOutfitIndex; i++) {
            setLoadingMessage(`Regenerating ${newHistory[i].garment?.name || 'outfit'}...`);
            const garmentToReapply = newHistory[i].garment;
            const targetToReapply = newHistory[i].target || 'shirt';
            if (garmentToReapply) {
                const regenerated = await generateVirtualTryOnImage(cascadeSource, garmentToReapply.url, targetToReapply);
                newHistory[i] = {
                    ...newHistory[i],
                    poseImages: { [currentPoseInstruction]: regenerated }
                };
                cascadeSource = regenerated;
            } else if (newHistory[i].action === 'remove_jacket') {
                const regenerated = await generateJacketRemovalImage(cascadeSource);
                newHistory[i] = {
                    ...newHistory[i],
                    poseImages: { [currentPoseInstruction]: regenerated }
                };
                cascadeSource = regenerated;
            }
        }

        setOutfitHistory(newHistory);
        setEditingLayerIndex(null);
        if (isMobile) setIsSheetCollapsed(true);
      } catch (err) {
        setError(getFriendlyErrorMessage(err, 'Failed to update garment'));
      } finally {
        setIsLoading(false);
        setLoadingMessage('');
      }
      return;
    }

    const nextLayer = outfitHistory[currentOutfitIndex + 1];
    if (nextLayer && nextLayer.garment?.id === garmentInfo.id && nextLayer.target === activeTarget) {
        setCurrentOutfitIndex(prev => prev + 1);
        setCurrentPoseIndex(0);
        if (isMobile) setIsSheetCollapsed(true);
        return;
    }

    setError(null);
    setIsLoading(true);
    setLoadingMessage(`Applying ${garmentInfo.name} to ${activeTarget}...`);

    try {
      const newImageUrl = await generateVirtualTryOnImage(displayImageUrl, garmentSource, activeTarget);
      const currentPoseInstruction = POSE_INSTRUCTIONS[currentPoseIndex];
      
      const newLayer: OutfitLayer = { 
        garment: garmentInfo,
        target: activeTarget,
        poseImages: { [currentPoseInstruction]: newImageUrl } 
      };

      setOutfitHistory(prevHistory => {
        const newHistory = prevHistory.slice(0, currentOutfitIndex + 1);
        return [...newHistory, newLayer];
      });
      setCurrentOutfitIndex(prev => prev + 1);
      
      setWardrobe(prev => {
        if (prev.find(item => item.id === garmentInfo.id)) {
            return prev;
        }
        return [...prev, garmentInfo];
      });

      if (isMobile) setIsSheetCollapsed(true);
    } catch (err) {
      setError(getFriendlyErrorMessage(err, 'Failed to apply garment'));
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [displayImageUrl, isLoading, modelImageUrl, currentPoseIndex, outfitHistory, currentOutfitIndex, activeTarget, isMobile, editingLayerIndex]);

  const handleRemoveLastGarment = () => {
    if (currentOutfitIndex > 0) {
      setCurrentOutfitIndex(prevIndex => prevIndex - 1);
      setCurrentPoseIndex(0);
      setEditingLayerIndex(null);
    }
  };

  const handleEditLayer = (index: number) => {
    if (index === 0) return; // Cannot "replace" the base model layer
    setEditingLayerIndex(index);
    const layer = outfitHistory[index];
    if (layer.target) {
        setActiveTarget(layer.target);
    }
    if (isMobile) setIsSheetCollapsed(false);
  };
  
  const handlePoseSelect = useCallback(async (newIndex: number) => {
    if (isLoading || outfitHistory.length === 0 || newIndex === currentPoseIndex) return;
    
    const poseInstruction = POSE_INSTRUCTIONS[newIndex];
    const currentLayer = outfitHistory[currentOutfitIndex];

    if (currentLayer.poseImages[poseInstruction]) {
      setCurrentPoseIndex(newIndex);
      return;
    }

    const baseImageForPoseChange = Object.values(currentLayer.poseImages)[0];
    if (!baseImageForPoseChange) return;

    setError(null);
    setIsLoading(true);
    setLoadingMessage(`Changing pose...`);
    
    const prevPoseIndex = currentPoseIndex;
    setCurrentPoseIndex(newIndex);

    try {
      const newImageUrl = await generatePoseVariation(baseImageForPoseChange, poseInstruction);
      setOutfitHistory(prevHistory => {
        const newHistory = [...prevHistory];
        const updatedLayer = newHistory[currentOutfitIndex];
        updatedLayer.poseImages[poseInstruction] = newImageUrl;
        return newHistory;
      });
    } catch (err) {
      setError(getFriendlyErrorMessage(err, 'Failed to change pose'));
      setCurrentPoseIndex(prevPoseIndex);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [currentPoseIndex, outfitHistory, isLoading, currentOutfitIndex]);

  const viewVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
  };

  return (
    <div className="font-sans min-h-screen flex flex-col bg-[#F5F2ED]">
      <Header onShowHowItWorks={() => setIsHowItWorksOpen(true)} />
      <HowItWorksModal isOpen={isHowItWorksOpen} onClose={() => setIsHowItWorksOpen(false)} />
      
      <main className="flex-grow flex flex-col relative overflow-hidden">
        <AnimatePresence mode="wait">
          {!modelImageUrl ? (
            <motion.div
              key="start-screen"
              className="w-full flex-grow flex items-start sm:items-center justify-center p-4"
              variants={viewVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              <StartScreen 
                onModelFinalized={handleModelFinalized} 
                onLoadSession={loadSession}
                hasSavedSession={!!localStorage.getItem(LOCAL_STORAGE_KEY)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="main-app"
              className="relative flex flex-col flex-grow bg-white overflow-hidden"
              variants={viewVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              <div className="flex-grow relative flex flex-col md:flex-row overflow-hidden">
                <div className="w-full h-full flex-grow flex items-center justify-center bg-[#FDFCFB] relative overflow-hidden">
                  <Canvas 
                    displayImageUrl={displayImageUrl}
                    onStartOver={handleStartOver}
                    isLoading={isLoading}
                    loadingMessage={loadingMessage}
                    onSelectPose={handlePoseSelect}
                    poseInstructions={POSE_INSTRUCTIONS}
                    currentPoseIndex={currentPoseIndex}
                    availablePoseKeys={availablePoseKeys}
                  />
                  
                  {/* Floating Action Icons for Mobile */}
                  <div className="absolute top-4 right-4 z-40 flex flex-col items-end gap-3">
                    <button 
                        onClick={saveSession}
                        disabled={isLoading}
                        className="flex items-center justify-center bg-[#1A2D4D] text-white w-12 h-12 md:w-auto md:px-5 md:py-2.5 rounded-full shadow-lg hover:bg-[#2C3E50] transition-all active:scale-95 disabled:opacity-50"
                        title="Save Session"
                    >
                        {saveSuccess ? (
                            <span className="text-[10px] font-bold uppercase tracking-widest hidden md:flex items-center gap-2">
                              <SaveIcon className="w-4 h-4" /> Progress Saved
                            </span>
                        ) : (
                            <>
                                <SaveIcon className="w-5 h-5 md:w-4 md:h-4" />
                                <span className="text-xs font-bold uppercase tracking-widest hidden md:inline ml-2">Save Session</span>
                            </>
                        )}
                        {saveSuccess && isMobile && <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />}
                    </button>
                    
                    {isMobile && (
                      <button 
                          onClick={() => setIsSheetCollapsed(false)}
                          className="flex items-center justify-center bg-[#B8A66F] text-white w-12 h-12 rounded-full shadow-lg active:scale-95"
                          title="Open Wardrobe"
                      >
                          <PlusIcon className="w-6 h-6" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Wardrobe Drawer / Sidebar */}
                <aside 
                  className={`
                    absolute md:relative bottom-0 right-0 w-full md:w-1/3 md:max-w-sm bg-white shadow-2xl md:shadow-none 
                    flex flex-col border-t md:border-t-0 md:border-l border-gray-100 
                    transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
                    ${isMobile ? (isSheetCollapsed ? 'h-0 opacity-0 translate-y-full' : 'h-[85vh] opacity-100 translate-y-0') : 'h-full'} 
                    z-50 rounded-t-[2.5rem] md:rounded-none overflow-hidden
                  `}
                >
                    {isMobile && (
                      <div className="w-full h-8 flex items-center justify-center flex-shrink-0 cursor-pointer" onClick={() => setIsSheetCollapsed(true)}>
                        <div className="w-12 h-1 bg-gray-200 rounded-full" />
                      </div>
                    )}
                    
                    <div className="p-6 pb-24 overflow-y-auto flex-grow flex flex-col gap-8 custom-scrollbar bg-white">
                      {isMobile && (
                        <div className="flex items-center justify-between mb-2">
                          <h2 className="text-3xl font-serif text-[#3D3D3D]">Atelier</h2>
                          <button onClick={() => setIsSheetCollapsed(true)} className="p-2 text-gray-400">
                             <ChevronDownIcon className="w-6 h-6" />
                          </button>
                        </div>
                      )}

                      {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
                          <p className="text-sm font-bold uppercase tracking-widest">System Error</p>
                          <p className="text-xs">{error}</p>
                        </div>
                      )}

                      <OutfitStack 
                        outfitHistory={activeOutfitLayers}
                        onRemoveLastGarment={handleRemoveLastGarment}
                        onEditLayer={handleEditLayer}
                        editingLayerIndex={editingLayerIndex}
                      />

                      {/* Tailor Notes Section */}
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-serif tracking-wider text-[#3D3D3D]">Tailor Notes</h2>
                            <span className="text-[10px] uppercase tracking-widest text-[#B8A66F] font-bold">Confidential</span>
                        </div>
                        <div className="relative group">
                          <textarea
                            value={tailorNotes}
                            onChange={(e) => setTailorNotes(e.target.value)}
                            placeholder="Fit adjustments, fabric preferences, or styling advice..."
                            className="w-full min-h-[120px] p-4 text-sm font-sans bg-[#FFFDF9] border border-[#E3DCD1] rounded-xl focus:ring-2 focus:ring-[#B8A66F33] focus:border-[#B8A66F] focus:outline-none placeholder:italic placeholder:text-gray-300 transition-all shadow-inner custom-scrollbar resize-none"
                          />
                          <div className="absolute bottom-3 right-3 opacity-20 group-focus-within:opacity-50 transition-opacity">
                            <ShirtIcon className="w-4 h-4 text-[#B8A66F]" />
                          </div>
                        </div>
                      </div>

                      <WardrobePanel
                        onGarmentSelect={handleGarmentSelect}
                        activeGarmentIds={activeGarmentIds}
                        isLoading={isLoading}
                        wardrobe={wardrobe}
                        activeTarget={activeTarget}
                        onTargetChange={setActiveTarget}
                        editingLayerIndex={editingLayerIndex}
                        activeOutfitLayers={activeOutfitLayers}
                        onRemoveJacket={handleRemoveJacket}
                      />
                    </div>
                </aside>
                
                {/* Backdrop for mobile drawer */}
                {isMobile && !isSheetCollapsed && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsSheetCollapsed(true)}
                    className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40"
                  />
                )}
              </div>

              <AnimatePresence>
                {isLoading && (
                  <motion.div
                    className="fixed inset-0 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center z-[100]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="scale-125 md:scale-150">
                      <Spinner />
                    </div>
                    {loadingMessage && (
                      <p className="text-xl md:text-2xl font-serif text-[#3D3D3D] mt-8 text-center px-8 italic max-w-lg">{loadingMessage}</p>
                    )}
                    <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.4em] text-[#B8A66F] animate-pulse">Neural Threading in Progress</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;
