import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
    onReset: () => void;
    onNavigate?: (view: 'home' | 'design' | 'wardrobe' | 'profile' | 'catalog') => void;
    onSignIn?: () => void;
    activeView?: 'home' | 'design' | 'wardrobe' | 'profile' | 'catalog';
    userContext?: {
        name: string;
        avatar?: string;
        isGuest?: boolean;
    };
}

export const Layout: React.FC<LayoutProps> = ({ children, onReset, onNavigate, onSignIn, activeView = 'design', userContext }) => {
    return (
        <div className="min-h-screen flex flex-col bg-[#F9F7F4] text-[#1A1A1A] font-sans">
            {/* Top Brand Header - Simplified & Professional */}
            <header className="px-6 py-4 flex items-center justify-between border-b border-[#2D2D2D] bg-[#1A1A1A] sticky top-0 z-50">
                <div className="w-10"></div>
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate?.('home')}>
                    <img
                        src="https://cdn-ilecmfd.nitrocdn.com/DcXmyVKHfbpwlGkJPFNhlqXAuyEWsVzG/assets/images/optimized/rev-7ac1cd2/www.michaelandrews.com/wp-content/themes/michaelandrews/public/img/michael-andrews-logo.png"
                        alt="Michael Andrews Bespoke"
                        className="h-5 md:h-7 w-auto object-contain brightness-0 invert"
                    />
                </div>
                <div>
                    {userContext && !userContext.isGuest ? (
                        <div className="w-8 h-8 rounded-full bg-[#F5F1E8] border border-[#D1C7BD] overflow-hidden flex items-center justify-center cursor-pointer shadow-sm" onClick={() => onNavigate?.('profile')}>
                            {userContext.avatar ? <img src={userContext.avatar} className="w-full h-full object-cover" /> : <span className="text-[10px] font-bold text-[#9A8A55]">{userContext.name.charAt(0)}</span>}
                        </div>
                    ) : (
                        <button
                            onClick={onSignIn}
                            className="text-[10px] font-bold text-[#B8A66F] tracking-[0.2em] uppercase border border-[#B8A66F] px-4 py-2 hover:bg-[#B8A66F] hover:text-white transition-all shadow-sm"
                        >
                            Sign In
                        </button>
                    )}
                </div>
            </header>

            {/* User Context Header - Improved Contrast & Clarity */}
            {userContext && activeView === 'design' && (
                <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-[#EAEAEA] shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#FDFBF2] overflow-hidden border border-[#D1C7BD]">
                            {userContext.avatar ? (
                                <img src={userContext.avatar} alt={userContext.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-[#9A8A55] font-bold text-sm">
                                    {userContext.name.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="text-[9px] font-bold text-[#9A8A55] tracking-[0.2em] uppercase mb-0.5">Active Session</div>
                            <div className="text-base font-serif font-bold text-[#1A1A1A] leading-tight">{userContext.name}</div>
                        </div>
                    </div>
                    <button
                        onClick={() => onReset()}
                        className="text-[10px] font-bold text-[#666666] tracking-widest uppercase border-b-2 border-[#E5E5E5] hover:text-[#B8A66F] hover:border-[#B8A66F] transition-all pb-1"
                    >
                        New Fitting
                    </button>
                </div>
            )}

            {/* Main Content Area */}
            <main className="flex-grow flex flex-col relative overflow-hidden bg-[#FDFCFB]">
                {children}
            </main>

            {/* Improved Bottom Navigation - HOME | DESIGN | WARDROBE | PROFILE */}
            <nav className="bg-white border-t border-[#E5E5E5] px-6 py-4 flex justify-around items-center sticky bottom-0 z-50 shadow-[0_-8px_30px_rgba(0,0,0,0.06)]">
                <button
                    onClick={() => onNavigate?.('home')}
                    className={`flex flex-col items-center gap-1.5 transition-all group ${activeView === 'home' ? 'text-[#9A8A55]' : 'text-gray-400'}`}
                >
                    <div className={`p-1.5 rounded-lg transition-all ${activeView === 'home' ? 'bg-[#FDFBF2]' : 'group-hover:bg-gray-50'}`}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill={activeView === 'home' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                    </div>
                    <span className={`text-[9px] font-bold uppercase tracking-[0.1em] ${activeView === 'home' ? 'opacity-100' : 'opacity-60'}`}>Home</span>
                </button>
                <button
                    onClick={() => onNavigate?.('design')}
                    className={`flex flex-col items-center gap-1.5 transition-all group ${activeView === 'design' ? 'text-[#9A8A55]' : 'text-gray-400'}`}
                >
                    <div className={`p-1.5 rounded-lg transition-all ${activeView === 'design' ? 'bg-[#FDFBF2]' : 'group-hover:bg-gray-50'}`}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /><path d="M12 22V17" /></svg>
                    </div>
                    <span className={`text-[9px] font-bold uppercase tracking-[0.1em] ${activeView === 'design' ? 'opacity-100 font-extrabold' : 'opacity-60'}`}>Design</span>
                </button>
                <button
                    onClick={() => onNavigate?.('wardrobe')}
                    className={`flex flex-col items-center gap-1.5 transition-all group ${activeView === 'wardrobe' ? 'text-[#9A8A55]' : 'text-gray-400'}`}
                >
                    <div className={`p-1.5 rounded-lg transition-all ${activeView === 'wardrobe' ? 'bg-[#FDFBF2]' : 'group-hover:bg-gray-50'}`}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill={activeView === 'wardrobe' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.62 1.96V21a1 1 0 001 1h18a1 1 0 001-1V5.42a2 2 0 00-1.62-1.96z" /><path d="M12 22V7" /><path d="M12 7l4 2" /><path d="M12 7l-4 2" /></svg>
                    </div>
                    <span className={`text-[9px] font-bold uppercase tracking-[0.1em] ${activeView === 'wardrobe' ? 'opacity-100' : 'opacity-60'}`}>Wardrobe</span>
                </button>
                <button
                    onClick={() => onNavigate?.('profile')}
                    className={`flex flex-col items-center gap-1.5 transition-all group ${activeView === 'profile' ? 'text-[#9A8A55]' : 'text-gray-400'}`}
                >
                    <div className={`p-1.5 rounded-lg transition-all ${activeView === 'profile' ? 'bg-[#FDFBF2]' : 'group-hover:bg-gray-50'}`}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill={activeView === 'profile' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                    </div>
                    <span className={`text-[9px] font-bold uppercase tracking-[0.1em] ${activeView === 'profile' ? 'opacity-100' : 'opacity-60'}`}>Profile</span>
                </button>
                <button
                    onClick={() => onNavigate?.('catalog')}
                    className={`flex flex-col items-center gap-1.5 transition-all group ${activeView === 'catalog' ? 'text-[#9A8A55]' : 'text-gray-400'}`}
                >
                    <div className={`p-1.5 rounded-lg transition-all ${activeView === 'catalog' ? 'bg-[#FDFBF2]' : 'group-hover:bg-gray-50'}`}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h7v7H3z" /><path d="M14 3h7v7h-7z" /><path d="M14 14h7v7h-7z" /><path d="M3 14h7v7H3z" /></svg>
                    </div>
                    <span className={`text-[9px] font-bold uppercase tracking-[0.1em] ${activeView === 'catalog' ? 'opacity-100' : 'opacity-60'}`}>Catalog</span>
                </button>
            </nav>
        </div>
    );
};