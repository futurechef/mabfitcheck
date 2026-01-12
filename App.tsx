
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
import { generateVirtualTryOnImage, generatePoseVariation } from './services/geminiService';
import { OutfitLayer, WardrobeItem } from './types';
import { ChevronDownIcon, ChevronUpIcon, SaveIcon } from './components/icons';
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

const LOCAL_STORAGE_KEY = 'mab_bespoke_session';

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
  const [isSheetCollapsed, setIsSheetCollapsed] = useState(false);
  const [wardrobe, setWardrobe] = useState<WardrobeItem[]>(defaultWardrobe);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [activeTarget, setActiveTarget] = useState<'shirt' | 'suit'>('shirt');
  const [tailorNotes, setTailorNotes] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  
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
        setIsSheetCollapsed(false);
        setWardrobe(defaultWardrobe);
        setTailorNotes('');
        localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  const handleGarmentSelect = useCallback(async (garmentSource: File | string, garmentInfo: WardrobeItem) => {
    if (!displayImageUrl || isLoading) return;

    const nextLayer = outfitHistory[currentOutfitIndex + 1];
    if (nextLayer && nextLayer.garment?.id === garmentInfo.id && nextLayer.target === activeTarget) {
        setCurrentOutfitIndex(prev => prev + 1);
        setCurrentPoseIndex(0);
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
    } catch (err) {
      setError(getFriendlyErrorMessage(err, 'Failed to apply garment'));
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [displayImageUrl, isLoading, currentPoseIndex, outfitHistory, currentOutfitIndex, activeTarget]);

  const handleRemoveLastGarment = () => {
    if (currentOutfitIndex > 0) {
      setCurrentOutfitIndex(prevIndex => prevIndex - 1);
      setCurrentPoseIndex(0);
    }
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
    <div className="font-sans min-h-screen flex flex-col bg-white">
      <Header onShowHowItWorks={() => setIsHowItWorksOpen(true)} />
      <HowItWorksModal isOpen={isHowItWorksOpen} onClose={() => setIsHowItWorksOpen(false)} />
      
      <main className="flex-grow flex flex-col">
        <AnimatePresence mode="wait">
          {!modelImageUrl ? (
            <motion.div
              key="start-screen"
              className="w-full flex-grow flex items-start sm:items-center justify-center bg-gray-50 p-4"
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
              className="relative flex flex-col h-[calc(100vh-4rem)] bg-white overflow-hidden"
              variants={viewVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              <div className="flex-grow relative flex flex-col md:flex-row overflow-hidden">
                <div className="w-full h-full flex-grow flex items-center justify-center bg-white relative overflow-hidden">
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
                  
                  {/* Save Floating Action */}
                  <div className="absolute top-4 right-4 z-40 flex flex-col items-end gap-2">
                    <button 
                        onClick={saveSession}
                        disabled={isLoading}
                        className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-full shadow-lg hover:bg-gray-700 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {saveSuccess ? (
                            <span className="text-xs font-bold uppercase tracking-widest">Saved!</span>
                        ) : (
                            <>
                                <SaveIcon className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-widest">Save Session</span>
                            </>
                        )}
                    </button>
                  </div>
                </div>

                <aside 
                  className={`absolute md:relative md:flex-shrink-0 bottom-0 right-0 h-auto md:h-full w-full md:w-1/3 md:max-w-sm bg-white shadow-2xl md:shadow-none flex flex-col border-t md:border-t-0 md:border-l border-gray-200 transition-transform duration-500 ease-in-out ${isSheetCollapsed ? 'translate-y-[calc(100%-4.5rem)]' : 'translate-y-0'} md:translate-y-0 z-50`}
                >
                    <button 
                      onClick={() => setIsSheetCollapsed(!isSheetCollapsed)} 
                      className="md:hidden w-full h-8 flex items-center justify-center bg-gray-50 border-b border-gray-100"
                    >
                      {isSheetCollapsed ? <ChevronUpIcon className="w-5 h-5 text-gray-400" /> : <ChevronDownIcon className="w-5 h-5 text-gray-400" />}
                    </button>
                    
                    <div className="p-4 md:p-6 pb-12 overflow-y-auto flex-grow flex flex-col gap-8 custom-scrollbar">
                      {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
                          <p className="text-sm font-bold">System Alert</p>
                          <p className="text-xs">{error}</p>
                        </div>
                      )}

                      <OutfitStack 
                        outfitHistory={activeOutfitLayers}
                        onRemoveLastGarment={handleRemoveLastGarment}
                      />

                      {/* Tailor Notes Section */}
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-serif tracking-wider text-gray-800">Tailor Notes</h2>
                            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Client Copy</span>
                        </div>
                        <textarea
                          value={tailorNotes}
                          onChange={(e) => setTailorNotes(e.target.value)}
                          placeholder="Note fit adjustments, fabric preferences, or styling advice for the client..."
                          className="w-full min-h-[120px] p-4 text-sm font-sans bg-[#fffaf0] border border-[#e3dcd1] rounded-xl focus:ring-2 focus:ring-gray-200 focus:outline-none placeholder:italic placeholder:text-gray-400 transition-all shadow-inner"
                        />
                      </div>

                      <WardrobePanel
                        onGarmentSelect={handleGarmentSelect}
                        activeGarmentIds={activeGarmentIds}
                        isLoading={isLoading}
                        wardrobe={wardrobe}
                        activeTarget={activeTarget}
                        onTargetChange={setActiveTarget}
                      />
                    </div>
                </aside>
              </div>

              <AnimatePresence>
                {isLoading && isMobile && (
                  <motion.div
                    className="fixed inset-0 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center z-[100]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Spinner />
                    {loadingMessage && (
                      <p className="text-lg font-serif text-gray-700 mt-4 text-center px-4 italic">{loadingMessage}</p>
                    )}
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
