import React, { useState } from 'react';
import type { UserMeasurements } from '../types';

interface MeasurementInputProps {
    onComplete: (measurements: UserMeasurements) => void;
    onBack: () => void;
    initialValues?: UserMeasurements;
}

export const MeasurementInput: React.FC<MeasurementInputProps> = ({ onComplete, onBack, initialValues }) => {
    const [values, setValues] = useState<UserMeasurements>(initialValues || {
        chest: '',
        waist: '',
        inseam: '',
        armLength: '',
        shoulderWidth: ''
    });

    const handleChange = (field: keyof UserMeasurements, value: string) => {
        setValues(prev => ({ ...prev, [field]: value }));
    };

    const [error, setError] = useState<string | null>(null);

    const handleSubmit = () => {
        const requiredFields: (keyof UserMeasurements)[] = ['chest', 'waist', 'inseam', 'armLength', 'shoulderWidth'];
        const isValid = requiredFields.every(field => {
            const val = values[field];
            return val && val.trim() !== '';
        });

        if (isValid) {
            setError(null);
            onComplete(values);
        } else {
            setError("Please fill in all key measurements for the accurate AI fit.");
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#F9F7F4] overflow-y-auto">
            <div className="p-8 md:p-12 bg-white border-b border-[#EAEAEA] shadow-sm flex justify-between items-center">
                <div>
                    <h3 className="text-3xl font-serif text-[#1A1A1A] mb-2">Master Measurements</h3>
                    <p className="text-[10px] text-[#9A8A55] font-bold tracking-[0.3em] uppercase">Step 2: Analysis</p>
                </div>
                <button onClick={onBack} className="text-[#666] text-[10px] font-bold uppercase tracking-widest hover:text-[#1A1A1A]">← Back</button>
            </div>

            <div className="flex-grow p-6 md:p-12 max-w-4xl mx-auto w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                        <p className="text-sm text-[#666] leading-relaxed italic border-l-2 border-[#B8A66F] pl-4">
                            "To generate a truly bespoke visualization, I need to understand the constraints of your physique. These metrics will ensure the generated garment respects your actual proportions."
                        </p>

                        <div className="space-y-6">
                            {/* Chest */}
                            <div className="group">
                                <label className="block text-[10px] font-bold text-[#1A1A1A] uppercase tracking-widest mb-2 group-focus-within:text-[#B8A66F] transition-colors">Chest (Inches)</label>
                                <input
                                    type="number"
                                    value={values.chest}
                                    onChange={(e) => handleChange('chest', e.target.value)}
                                    placeholder="e.g. 40"
                                    className="w-full bg-white border-b border-[#EAEAEA] py-4 text-xl font-serif text-[#1A1A1A] focus:outline-none focus:border-[#B8A66F] transition-all placeholder:text-gray-200"
                                />
                            </div>
                            {/* Waist */}
                            <div className="group">
                                <label className="block text-[10px] font-bold text-[#1A1A1A] uppercase tracking-widest mb-2 group-focus-within:text-[#B8A66F] transition-colors">Waist (Inches)</label>
                                <input
                                    type="number"
                                    value={values.waist}
                                    onChange={(e) => handleChange('waist', e.target.value)}
                                    placeholder="e.g. 34"
                                    className="w-full bg-white border-b border-[#EAEAEA] py-4 text-xl font-serif text-[#1A1A1A] focus:outline-none focus:border-[#B8A66F] transition-all placeholder:text-gray-200"
                                />
                            </div>
                            {/* Shoulders */}
                            <div className="group">
                                <label className="block text-[10px] font-bold text-[#1A1A1A] uppercase tracking-widest mb-2 group-focus-within:text-[#B8A66F] transition-colors">Shoulder Width (Inches)</label>
                                <input
                                    type="number"
                                    value={values.shoulderWidth}
                                    onChange={(e) => handleChange('shoulderWidth', e.target.value)}
                                    placeholder="e.g. 18"
                                    className="w-full bg-white border-b border-[#EAEAEA] py-4 text-xl font-serif text-[#1A1A1A] focus:outline-none focus:border-[#B8A66F] transition-all placeholder:text-gray-200"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-[#FDFBF2] p-6 rounded-sm border border-[#EAEAEA]">
                            <h4 className="text-[10px] font-bold text-[#9A8A55] uppercase tracking-widest mb-2">Guide</h4>
                            <p className="text-xs text-[#666] leading-relaxed">
                                Measure over a shirt. Keep the tape measure comfortable, not tight.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {/* Arm */}
                            <div className="group">
                                <label className="block text-[10px] font-bold text-[#1A1A1A] uppercase tracking-widest mb-2 group-focus-within:text-[#B8A66F] transition-colors">Arm Length (Inches)</label>
                                <input
                                    type="number"
                                    value={values.armLength}
                                    onChange={(e) => handleChange('armLength', e.target.value)}
                                    placeholder="e.g. 25"
                                    className="w-full bg-white border-b border-[#EAEAEA] py-4 text-xl font-serif text-[#1A1A1A] focus:outline-none focus:border-[#B8A66F] transition-all placeholder:text-gray-200"
                                />
                            </div>
                            {/* Inseam */}
                            <div className="group">
                                <label className="block text-[10px] font-bold text-[#1A1A1A] uppercase tracking-widest mb-2 group-focus-within:text-[#B8A66F] transition-colors">Inseam (Inches)</label>
                                <input
                                    type="number"
                                    value={values.inseam}
                                    onChange={(e) => handleChange('inseam', e.target.value)}
                                    placeholder="e.g. 32"
                                    className="w-full bg-white border-b border-[#EAEAEA] py-4 text-xl font-serif text-[#1A1A1A] focus:outline-none focus:border-[#B8A66F] transition-all placeholder:text-gray-200"
                                />
                            </div>

                            {error && (
                                <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-[10px] font-bold tracking-wide uppercase text-center">
                                    {error}
                                </div>
                            )}

                            <div className="flex gap-4 mt-8">
                                <button
                                    onClick={() => {
                                        // Pass empty/partial measurements
                                        onComplete(values);
                                    }}
                                    className="flex-1 bg-white border border-[#EAEAEA] text-[#666] py-5 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-gray-50 hover:text-[#1A1A1A] transition-all"
                                >
                                    Skip
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="flex-[2] bg-[#1A1A1A] text-white py-5 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#B8A66F] transition-all shadow-xl"
                                >
                                    Confirm Sizing
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
