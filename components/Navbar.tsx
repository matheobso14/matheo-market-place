
import React from 'react';
import { ViewMode, User, SiteSettings } from '../types';

interface NavbarProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  shopName: string;
  logoUrl?: string;
  accentColor: string;
  user: User | null;
  onLogout: () => void;
  isAdmin: boolean;
  settings: SiteSettings;
}

const Navbar: React.FC<NavbarProps> = ({ viewMode, setViewMode, shopName, logoUrl, accentColor, user, onLogout, isAdmin, settings }) => {
  const getRadius = () => {
    switch(settings.buttonRadius) {
      case 'none': return '0';
      case 'md': return '8px';
      case 'xl': return '16px';
      case 'full': return '9999px';
      default: return '12px';
    }
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-gray-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-4">
            {logoUrl ? (
              <img src={logoUrl} alt={shopName} className="h-10 w-auto object-contain" />
            ) : (
              <div 
                className="w-10 h-10 flex items-center justify-center text-white font-black shadow-lg"
                style={{ backgroundColor: accentColor, borderRadius: '12px' }}
              >
                {shopName.charAt(0)}
              </div>
            )}
            <span className="text-2xl font-black text-gray-900 tracking-tight">
              {shopName}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {isAdmin && (
              <button
                onClick={() => setViewMode(viewMode === 'customer' ? 'admin' : 'customer')}
                className="px-5 py-2.5 text-xs font-black transition-all duration-300 shadow-sm border border-gray-200 bg-white hover:bg-gray-50 active:scale-95 flex items-center gap-2"
                style={{ borderRadius: getRadius() }}
              >
                {viewMode === 'customer' ? (
                  <>
                    <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    <span className="hidden sm:inline">ÉDITEUR</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    <span className="hidden sm:inline">VOIR BOUTIQUE</span>
                  </>
                )}
              </button>
            )}
            
            <div className="h-8 w-px bg-gray-200 mx-2 hidden sm:block"></div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[10px] font-black text-gray-900 leading-none">{user?.username}</span>
                <span className="text-[9px] text-gray-400 font-bold uppercase mt-1 tracking-widest">{isAdmin ? 'Propriétaire' : 'Client'}</span>
              </div>
              <button 
                onClick={onLogout}
                className="p-2.5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                title="Déconnexion"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;