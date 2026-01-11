import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { PhotoCapture } from './components/PhotoCapture';
import { ValidationFeedback } from './components/ValidationFeedback';
import { MeasurementInput } from './components/MeasurementInput';
import { GarmentTypeSelector } from './components/GarmentTypeSelector';
import { ShirtSelector } from './components/ShirtSelector';
import { ShirtStyleSelector } from './components/ShirtStyleSelector';
import { ShirtFabricSelector } from './components/ShirtFabricSelector';
import { SuitSelector } from './components/SuitSelector';
import { Processing } from './components/Processing';
import { ResultView } from './components/ResultView';
import { Hero } from './components/Hero';
import { Wardrobe } from './components/Wardrobe';
import { Profile } from './components/Profile';
import { AssetCatalog } from './components/AssetCatalog';
import type { SuitData, AppStep, UserMeasurements, PhotoValidationResult, GarmentType, ShirtData } from './types';
import type { ShirtConfiguration, ShirtStyle, FabricSwatch } from './constants/fabricSwatches';
import { generateTryOnImage, validateUserPhoto } from './services/geminiService';
import { saveDesignToFirebase, signInWithGoogle, signInAsGuest, trackEvent, auth, updateUserMeasurements } from './services/firebase';
import { onAuthStateChanged, type User, signOut } from 'firebase/auth';

export default function App() {
    const [activeView, setActiveView] = useState<'home' | 'design' | 'wardrobe' | 'profile' | 'catalog'>('home');
    const [step, setStep] = useState<AppStep>('HERO');
    const [user, setUser] = useState<User | null>(null);

    // Bespoke Session State
    const [userImage, setUserImage] = useState<string | null>(null);
    const [validationResult, setValidationResult] = useState<PhotoValidationResult | null>(null);
    const [measurements, setMeasurements] = useState<UserMeasurements | null>(null);
    const [garmentType, setGarmentType] = useState<GarmentType | null>(null);
    const [shirtConfig, setShirtConfig] = useState<ShirtConfiguration | null>(null);
    const [selectedSuit, setSelectedSuit] = useState<SuitData | null>(null);

    // Results State
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isValidating, setIsValidating] = useState(false);

    // Auth
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (u) => {
            setUser(u);
        });
        return () => unsubscribe();
    }, []);

    // FLOW HANDLERS
    const handleStart = async () => {
        if (!user) {
            // Auto-login as guest if not signed in for friction-less start
            // Or prompt? Let's just prompt or start flow and require auth later?
            // Requirement says "add users... can be guest".
            // Let's create guest session silently or via prompt?
            // Better: Allow them to start, but require auth/guest before saving/uploading?
            // Or just create guest now.
            const guest = await signInAsGuest();
            if (guest) {
                setActiveView('design');
                setStep('CAPTURE');
                trackEvent('flow_start');
            }
        } else {
            setActiveView('design');
            setStep('CAPTURE');
            trackEvent('flow_start');
        }
    };

    const handleImageCaptured = async (base64Image: string) => {
        setUserImage(base64Image);
        setIsValidating(true);
        trackEvent('photo_uploaded');

        try {
            const result = await validateUserPhoto(base64Image);
            setValidationResult(result);
            setStep('VALIDATION_FEEDBACK');
            trackEvent('photo_validated', { ready: result.overall.ready });
        } catch (e) {
            console.error(e);
            setStep('MEASUREMENTS');
        } finally {
            setIsValidating(false);
        }
    };

    const handleValidationSuccess = () => {
        setStep('MEASUREMENTS');
        trackEvent('validation_proceed');
    };

    const handleMeasurementsComplete = async (m: UserMeasurements) => {
        setMeasurements(m);
        if (user) {
            try {
                // Clean undefined values preventing Firestore error
                const cleanMeasurements = Object.fromEntries(
                    Object.entries(m).filter(([_, v]) => v !== undefined && v !== '')
                );
                await updateUserMeasurements(user.uid, cleanMeasurements);
            } catch (e) {
                console.error("Failed to sync measurements:", e);
            }
        }
        setStep('SELECT_GARMENT_TYPE');
        trackEvent('measurements_active');
    };

    const handleGarmentTypeSelected = (type: GarmentType) => {
        setGarmentType(type);
        trackEvent('garment_type_selected', { type });

        if (type === 'suit') setStep('SELECT_SUIT');
        else setStep('SELECT_SHIRT'); // Go to shirt catalog first
    };

    // Handler for selecting a pre-designed shirt product
    const handleShirtProductSelected = (shirt: ShirtData) => {
        // Create a ShirtConfiguration from the ShirtData
        const config: ShirtConfiguration = {
            style: {
                collar: shirt.collarStyle,
                cuff: shirt.cuffStyle,
                front: shirt.frontStyle,
                back: 'plain'
            },
            fabric: {
                id: shirt.id,
                name: shirt.fabricType,
                mill: 'Other',
                imageUrl: shirt.imageUrl,
                pattern: shirt.pattern,
                color: shirt.baseColor
            }
        };
        setShirtConfig(config);
        trackEvent('shirt_product_selected', { shirt: shirt.name });

        if (garmentType === 'both') {
            setStep('SELECT_SUIT');
        } else {
            handleGenerate(null, config);
        }
    };

    const handleShirtStyleSelected = (style: ShirtStyle) => {
        // Store style in a partial config - fabric will be added in next step
        setShirtConfig({ style, fabric: { id: '', name: '', mill: 'Other', imageUrl: '', pattern: '', color: '' } });
        setStep('SELECT_SHIRT_FABRIC');
        trackEvent('shirt_style_selected', { collar: style.collar });
    };

    const handleFabricSelected = (fabric: FabricSwatch, styleOverride?: ShirtStyle) => {
        const defaultStyle: ShirtStyle = { collar: 'spread', cuff: 'barrel', front: 'placket', back: 'plain' };
        const config = styleOverride
            ? { style: styleOverride, fabric }
            : (shirtConfig ? { ...shirtConfig, fabric } : { style: defaultStyle, fabric });

        setShirtConfig(config);
        trackEvent('fabric_selected', { fabric: fabric.name });

        if (garmentType === 'both') {
            setStep('SELECT_SUIT');
        } else {
            handleGenerate(null, config);
        }
    };

    const handleSuitSelected = (suit: SuitData) => {
        setSelectedSuit(suit);
        if (!garmentType) setGarmentType('suit');
        trackEvent('suit_selected', { suit: suit.name });
        handleGenerate(suit, shirtConfig || undefined);
    };

    const handleGenerate = async (suit: SuitData | null, config?: ShirtConfiguration) => {
        let currentUser = user;
        if (!currentUser) {
            // Auto-sign in as guest if not yet authenticated
            currentUser = await signInAsGuest();
            if (!currentUser) {
                alert("Please sign in to generate your customized look.");
                return;
            }
        }

        setStep('PROCESSING');
        setError(null);

        try {
            // Debug: Track userImage state before generation
            console.log('[App] Generating with userImage:', !!userImage, 'suit:', suit?.name, 'config:', config?.fabric?.name);

            // geminiService handles null userImage with a fallback
            const resultImage = await generateTryOnImage(userImage, suit, config, measurements || undefined);

            if (resultImage) {
                setGeneratedImage(resultImage);

                // Save to Firebase under user profile
                const designId = Date.now().toString();
                await saveDesignToFirebase(currentUser.uid, resultImage, {
                    designId,
                    name: suit ? suit.name : (config?.fabric.name || 'Custom Shirt'),
                    type: (suit && config) ? 'both' : (suit ? 'suit' : 'shirt'),
                    shirtConfig: config,
                    suitData: suit || undefined,
                    measurements: measurements || undefined,
                });

                setStep('RESULT');
                trackEvent('generation_success');
            } else {
                throw new Error("Failed to generate visualization");
            }
        } catch (e: any) {
            console.error("Generation Error:", e);
            setError(e.message);
            // Fallback to previous selection step
            if (suit) setStep('SELECT_SUIT');
            else if (config) setStep('SELECT_SHIRT_FABRIC');
            else setStep('SELECT_GARMENT_TYPE');

            trackEvent('generation_error', { error: e.message });
        }
    };

    const handleNavigate = async (view: 'home' | 'design' | 'wardrobe' | 'profile' | 'catalog') => {
        setActiveView(view);
        if (view === 'design') {
            // Ensure guest sign-in if not authenticated
            if (!user) {
                await signInAsGuest();
            }
            // Directly show suit catalog when user clicks Design
            if (!garmentType) setGarmentType('suit');
            setStep('SELECT_SUIT');
        }
        trackEvent('navigate', { to: view });
    };

    const handleReset = () => {
        setStep('HERO');
        setUserImage(null);
        setValidationResult(null);
        setShirtConfig(null);
        setSelectedSuit(null);
        setGeneratedImage(null);
    };

    const renderContent = () => {
        if (activeView === 'home') return <Hero onStart={handleStart} />;
        if (activeView === 'catalog') return <AssetCatalog onBack={() => setActiveView('home')} />;
        if (activeView === 'wardrobe') return user ? <Wardrobe userId={user.uid} /> : <Hero onStart={handleStart} />;
        if (activeView === 'profile') return (
            <Profile
                user={user}
                onUpdateMeasurements={() => { setActiveView('design'); setStep('MEASUREMENTS'); }}
                onSignOut={() => signOut(auth)}
            />
        );

        // Design Atelier Flow
        switch (step) {
            case 'HERO': return <Hero onStart={handleStart} />;
            case 'CAPTURE': return <PhotoCapture onImageCaptured={handleImageCaptured} isValidating={isValidating} />;
            case 'VALIDATION_FEEDBACK': return validationResult ? (
                <ValidationFeedback
                    result={validationResult}
                    userImage={userImage!}
                    onContinue={handleValidationSuccess}
                    onRetake={() => setStep('CAPTURE')}
                />
            ) : null;
            case 'MEASUREMENTS': return <MeasurementInput onComplete={handleMeasurementsComplete} onBack={handleReset} initialValues={measurements || undefined} />;
            case 'SELECT_GARMENT_TYPE': return <GarmentTypeSelector onSelected={handleGarmentTypeSelected} onBack={() => setStep('MEASUREMENTS')} />;
            case 'SELECT_SHIRT': return (
                <ShirtSelector
                    onShirtSelected={handleShirtProductSelected}
                    onCustomize={() => setStep('SELECT_SHIRT_STYLE')}
                    onBack={() => setStep('SELECT_GARMENT_TYPE')}
                />
            );
            case 'SELECT_SHIRT_STYLE': return <ShirtStyleSelector onStyleSelected={handleShirtStyleSelected} onBack={() => setStep('SELECT_SHIRT')} />;
            case 'SELECT_SHIRT_FABRIC': return <ShirtFabricSelector onFabricSelected={handleFabricSelected} onBack={() => setStep('SELECT_SHIRT_STYLE')} />;
            case 'SELECT_SUIT': return <SuitSelector onSuitSelected={handleSuitSelected} onBack={() => setStep('SELECT_GARMENT_TYPE')} />;
            case 'PROCESSING': return <Processing selectedSuit={selectedSuit} />;
            case 'RESULT': return generatedImage ? (
                <ResultView
                    originalImage={userImage}
                    generatedImage={generatedImage}
                    suit={selectedSuit || { name: 'Custom Shirt', description: shirtConfig?.fabric.name } as any}
                    onRetake={() => setStep('CAPTURE')}
                    onTryAnother={() => setStep('SELECT_GARMENT_TYPE')}
                    onPairWithSuit={!selectedSuit ? () => { setGarmentType('both'); setStep('SELECT_SUIT'); } : undefined}
                />
            ) : null;
            default: return <Hero onStart={handleStart} />;
        }
    };

    return (
        <Layout
            onReset={handleReset}
            onNavigate={handleNavigate}
            onSignIn={signInWithGoogle}
            activeView={activeView}
            userContext={user ? { name: user.displayName || "Guest Client", avatar: user.photoURL || undefined, isGuest: user.isAnonymous } : undefined}
        >
            {/* Error Toast */}
            {error && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] bg-red-600 text-white px-6 py-3 rounded-sm shadow-xl flex items-center gap-4">
                    <span className="text-sm">{error}</span>
                    <button onClick={() => setError(null)} className="text-white/80 hover:text-white text-lg">×</button>
                </div>
            )}
            {renderContent()}
        </Layout>
    );
}
