import React from 'react';
import type { PhotoValidationResult } from '../types';

interface ValidationFeedbackProps {
    result: PhotoValidationResult;
    userImage: string;
    onContinue: () => void;
    onRetake: () => void;
}

export const ValidationFeedback: React.FC<ValidationFeedbackProps> = ({ result, userImage, onContinue, onRetake }) => {
    const getScoreColor = (score: number) => {
        if (score >= 8) return 'text-green-600';
        if (score >= 6) return 'text-amber-500';
        return 'text-red-500';
    };

    return (
        <div className="flex flex-col h-full bg-[#F9F7F4] overflow-y-auto">
            <div className="bg-white px-6 pt-10 pb-8 border-b border-[#EAEAEA] shadow-sm text-center">
                <h3 className="text-4xl font-serif text-[#1A1A1A] mb-3">Julien's Analysis</h3>
                <p className="text-[10px] text-[#9A8A55] font-bold tracking-[0.3em] uppercase">Photo Quality Assessment</p>
            </div>

            <div className="flex-grow p-6 md:p-12 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Photo View */}
                <div className="bg-white p-4 border border-[#EEE] shadow-2xl relative">
                    <img src={userImage} alt="Captured Silhouette" className="w-full h-auto aspect-[3/4] object-cover" />
                    {!result.overall.ready && (
                        <div className="absolute inset-0 bg-red-500/10 border-4 border-red-500/50 flex items-center justify-center">
                            <div className="bg-red-600 text-white px-6 py-2 text-[10px] font-bold tracking-[0.2em] uppercase shadow-xl">
                                Attention Required
                            </div>
                        </div>
                    )}
                </div>

                {/* Feedback Panel */}
                <div className="space-y-10">
                    <div className={`p-8 rounded-sm shadow-sm border-l-4 ${result.overall.ready ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
                        <h4 className={`text-xl font-serif mb-2 ${result.overall.ready ? 'text-green-800' : 'text-red-800'}`}>
                            {result.overall.ready ? 'Excellent Silhouette' : 'Refinement Needed'}
                        </h4>
                        <p className={`text-sm leading-relaxed ${result.overall.ready ? 'text-green-700' : 'text-red-700'}`}>
                            {result.overall.message}
                        </p>
                    </div>

                    <div className="space-y-6">
                        {[
                            { label: 'Lighting', ...result.lighting },
                            { label: 'Pose & Posture', ...result.pose },
                            { label: 'Background', ...result.background },
                        ].map((metric) => (
                            <div key={metric.label} className="bg-white p-6 border border-[#EAEAEA] flex justify-between items-center group hover:border-[#B8A66F] transition-all">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">{metric.label}</p>
                                    <p className="text-sm text-[#444] leading-relaxed italic">{metric.feedback}</p>
                                </div>
                                <div className={`text-3xl font-serif ${getScoreColor(metric.score)}`}>
                                    {metric.score}/10
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-8 flex flex-col gap-3">
                        <button
                            onClick={onContinue}
                            className={`w-full py-4 text-[11px] font-bold tracking-[0.2em] uppercase transition-all shadow-xl font-sans ${result.overall.ready
                                    ? 'bg-[#1A1A1A] text-white hover:bg-[#B8A66F]'
                                    : 'bg-amber-500 text-white hover:bg-amber-600'
                                }`}
                        >
                            {result.overall.ready ? 'Continue to Sizing →' : 'Continue Anyway →'}
                        </button>
                        <button
                            onClick={onRetake}
                            className="w-full py-4 border border-[#1A1A1A] text-[#1A1A1A] text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-gray-50 transition-all font-sans"
                        >
                            {result.overall.ready ? 'Retake Photo' : 'Fix & Retake'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
