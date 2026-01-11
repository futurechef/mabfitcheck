import React, { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import type { UserProfile } from '../types';
import { getUserProfile } from '../services/firebase';

interface ProfileProps {
    user: User | null;
    onUpdateMeasurements: () => void;
    onSignOut: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, onUpdateMeasurements, onSignOut }) => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            loadProfile(user.uid);
        }
    }, [user]);

    const loadProfile = async (uid: string) => {
        setLoading(true);
        try {
            const p = await getUserProfile(uid);
            setProfile(p);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const measurements = profile?.measurements;

    return (
        <div className="flex flex-col h-full bg-[#F9F7F4] overflow-y-auto">
            <div className="p-10 bg-white border-b border-[#EAEAEA] shadow-sm">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8">
                    <div className="w-24 h-24 rounded-full bg-[#FDFBF2] border-2 border-[#B8A66F] overflow-hidden shadow-xl">
                        {user?.photoURL ? (
                            <img src={user.photoURL} className="w-full h-full object-cover" alt="" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-3xl text-[#9A8A55] font-serif">
                                {user?.displayName?.charAt(0) || 'G'}
                            </div>
                        )}
                    </div>
                    <div className="text-center md:text-left space-y-2">
                        <h3 className="text-4xl font-serif text-[#1A1A1A]">{profile?.displayName || user?.displayName || 'Guest Client'}</h3>
                        <p className="text-[10px] text-[#9A8A55] font-bold tracking-[0.3em] uppercase">Bespoke Profile & Preferences</p>
                        {profile?.isGuest && <p className="text-xs text-amber-600 bg-amber-50 inline-block px-2 py-1 rounded">Guest Account</p>}
                    </div>
                    <div className="md:ml-auto">
                        <button
                            onClick={onSignOut}
                            className="text-[10px] font-bold text-[#666] tracking-[0.2em] uppercase border border-[#EAEAEA] px-6 py-2 hover:border-red-200 hover:text-red-500 transition-all font-sans"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-6 md:p-12 max-w-5xl mx-auto w-full space-y-12">
                <div className="flex justify-between items-end">
                    <h4 className="text-xl font-serif text-[#1A1A1A]">Master Measurements</h4>
                    <button onClick={onUpdateMeasurements} className="text-[10px] font-bold text-[#B8A66F] tracking-[0.1em] uppercase hover:underline">Edit Data</button>
                </div>

                {loading ? (
                    <div className="text-center p-10 text-gray-400">Loading profile data...</div>
                ) : (
                    <section className="bg-white border border-[#EAEAEA] shadow-sm overflow-hidden p-8">
                        {measurements ? (
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                                {Object.entries(measurements).map(([key, value]) => (
                                    <div key={key}>
                                        <p className="text-[9px] font-bold text-[#9A8A55] uppercase tracking-[0.2em] mb-2">{key.replace(/([A-Z])/g, ' $1')}</p>
                                        <p className="text-2xl font-serif text-[#1A1A1A]">{value || '--'}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center space-y-6">
                                <p className="text-sm text-[#777] italic">No master measurements recorded.</p>
                                <button onClick={onUpdateMeasurements} className="bg-[#1A1A1A] text-white px-8 py-3 text-[10px] font-bold uppercase tracking-[0.2em]">Record Measurements</button>
                            </div>
                        )}
                    </section>
                )}
            </div>
        </div>
    );
};
