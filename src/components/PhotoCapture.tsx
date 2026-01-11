import React, { useRef, useState, useEffect } from 'react';

interface PhotoCaptureProps {
    onImageCaptured: (base64: string) => void;
    isValidating?: boolean;
}

export const PhotoCapture: React.FC<PhotoCaptureProps> = ({ onImageCaptured, isValidating }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [isDragging, setIsDragging] = useState(false);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [countdown, setCountdown] = useState<number | null>(null);
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);

    useEffect(() => {
        if (isCameraOpen && stream && videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(e => console.error("Error playing video:", e));
        }
    }, [isCameraOpen, stream]);

    const startCamera = async (mode: 'user' | 'environment' = facingMode) => {
        try {
            // Stop existing stream first
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: mode, width: { ideal: 1280 }, height: { ideal: 720 } }
            });
            setStream(mediaStream);
            setFacingMode(mode);
            setIsCameraOpen(true);
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("Unable to access camera. Please check permissions.");
        }
    };

    const flipCamera = () => {
        const newMode = facingMode === 'user' ? 'environment' : 'user';
        startCamera(newMode);
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setIsCameraOpen(false);
    };

    const takePhoto = () => {
        setCountdown(3);
        let count = 3;
        const timer = setInterval(() => {
            count--;
            if (count > 0) {
                setCountdown(count);
            } else {
                clearInterval(timer);
                setCountdown(null);
                captureFrame();
            }
        }, 1000);
    };

    const captureFrame = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            if (context) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                // Only mirror for front-facing camera
                if (facingMode === 'user') {
                    context.translate(canvas.width, 0);
                    context.scale(-1, 1);
                }
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageBase64 = canvas.toDataURL('image/jpeg', 0.9);
                stopCamera();
                onImageCaptured(imageBase64);
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    const processFile = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            onImageCaptured(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => setIsDragging(false);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    if (isCameraOpen) {
        return (
            <div className="fixed inset-0 bg-[#0A0A0A] z-[100] flex flex-col items-center justify-center">
                <div className="relative w-full h-[calc(100%-80px)] max-w-4xl bg-black overflow-hidden shadow-2xl">
                    <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-cover ${facingMode === 'user' ? 'transform -scale-x-100' : ''}`} />
                    <canvas ref={canvasRef} className="hidden" />
                    <div className="absolute inset-0 pointer-events-none border-[20px] border-black/40">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] border border-white/30 rounded-sm"></div>
                        <div className="absolute bottom-24 left-0 w-full text-center text-white/60 text-[10px] tracking-[0.3em] uppercase">
                            Center Your Silhouette in Frame
                        </div>
                        {countdown !== null && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                                <span className="text-[10rem] text-white font-serif font-bold italic animate-pulse">{countdown}</span>
                            </div>
                        )}
                    </div>

                    <div className="absolute bottom-6 left-0 w-full flex justify-center items-center gap-8 pointer-events-auto pb-safe">
                        <button onClick={stopCamera} className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all border border-white/20">✕</button>
                        <button onClick={takePhoto} disabled={countdown !== null} className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center transition-all active:scale-95 group">
                            <div className="w-14 h-14 bg-white rounded-full group-hover:scale-90 transition-transform"></div>
                        </button>
                        <button onClick={flipCamera} className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all border border-white/20" title="Flip Camera">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col flex-grow bg-[#F9F7F4] overflow-y-auto">
            {/* Premium Header */}
            <div className="p-8 md:p-12 text-center bg-white border-b border-[#EAEAEA] shadow-sm">
                <h3 className="text-4xl font-serif text-[#1A1A1A] mb-4">Capture Your Silhouette</h3>
                <p className="text-sm text-[#666] max-w-2xl mx-auto leading-relaxed italic">
                    "We use your photo to create personalized, photorealistic try-ons of your custom pieces. Let's start with a clear, full-body capture to ensure the perfect virtual fit."
                </p>
            </div>

            <div className="flex-grow p-6 md:p-12 max-w-4xl mx-auto w-full flex flex-col items-center gap-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                    {/* Camera Option */}
                    <button
                        onClick={() => startCamera()}
                        disabled={isValidating}
                        className="group relative h-80 border-2 border-[#EAEAEA] hover:border-[#B8A66F] bg-white transition-all duration-500 flex flex-col items-center justify-center gap-6 shadow-sm hover:shadow-2xl overflow-hidden"
                    >
                        <div className="w-20 h-20 rounded-full bg-[#FDFBF2] group-hover:bg-[#B8A66F] flex items-center justify-center transition-all duration-500">
                            <svg className="w-10 h-10 text-[#B8A66F] group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <circle cx="12" cy="13" r="3" strokeWidth={1} />
                            </svg>
                        </div>
                        <div className="text-center">
                            <span className="block text-xl font-serif text-[#1A1A1A]">Digital Fitting</span>
                            <span className="text-[10px] text-[#9A8A55] tracking-[0.2em] font-bold uppercase">Use Camera</span>
                        </div>
                        {isValidating && (
                            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                                <div className="w-8 h-8 border-2 border-[#B8A66F] border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-[10px] font-bold tracking-widest text-[#B8A66F] uppercase">Julien is Validating...</p>
                            </div>
                        )}
                    </button>

                    {/* Upload Option */}
                    <div
                        className={`
                    group relative h-80 border-2 border-dashed transition-all duration-500
                    flex flex-col items-center justify-center gap-6 cursor-pointer bg-white shadow-sm hover:shadow-2xl
                    ${isDragging ? 'border-[#B8A66F] bg-[#FDFBF2]' : 'border-[#EAEAEA] hover:border-[#B8A66F]'}
                    ${isValidating ? 'opacity-50 pointer-events-none' : ''}
                `}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => inputRef.current?.click()}
                    >
                        <div className="w-20 h-20 rounded-full bg-gray-50 group-hover:bg-[#B8A66F] flex items-center justify-center transition-all duration-500">
                            <svg className="w-10 h-10 text-gray-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                        </div>
                        <div className="text-center">
                            <span className="block text-xl font-serif text-[#1A1A1A]">Upload Silhouette</span>
                            <span className="text-[10px] text-[#9A8A55] tracking-[0.2em] font-bold uppercase">Drag & Drop</span>
                        </div>
                        <input type="file" ref={inputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                    </div>
                </div>

                {/* Guidance Checklist */}
                <div className="w-full bg-white p-10 border border-[#EAEAEA] shadow-inner mb-12">
                    <h4 className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#9A8A55] mb-8 text-center">Bespoke Fitting Requirements</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-10 h-10 rounded-sm bg-[#FDFBF2] flex items-center justify-center text-xl">💡</div>
                            <div>
                                <p className="text-[10px] font-bold text-[#1A1A1A] tracking-widest uppercase mb-1">Excellent Lighting</p>
                                <p className="text-xs text-[#777]">Ensure front-on lighting with no heavy shadows.</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-10 h-10 rounded-sm bg-[#FDFBF2] flex items-center justify-center text-xl">👤</div>
                            <div>
                                <p className="text-[10px] font-bold text-[#1A1A1A] tracking-widest uppercase mb-1">Full Body Visible</p>
                                <p className="text-xs text-[#777]">Include head to toe for accurate proportions.</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-10 h-10 rounded-sm bg-[#FDFBF2] flex items-center justify-center text-xl">🖼️</div>
                            <div>
                                <p className="text-[10px] font-bold text-[#1A1A1A] tracking-widest uppercase mb-1">Neutral Background</p>
                                <p className="text-xs text-[#777]">A clean wall helps the AI define your fit.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
