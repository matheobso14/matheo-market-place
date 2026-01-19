
import React from 'react';
import { ViewMode, User } from '../types';

interface NavbarProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  shopName: string;
  logoUrl?: string;
  accentColor: string;
  user: User | null;
  onLogout: () => void;
  isAdmin: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ viewMode, setViewMode, shopName, logoUrl, accentColor, user, onLogout, isAdmin }) => {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img src={logoUrl} alt={shopName} className="h-8 w-auto object-contain" />
            ) : (
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: accentColor }}
              >
                S
              </div>
            )}
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              {shopName}
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {isAdmin && (
              <button
                onClick={() => setViewMode(viewMode === 'customer' ? 'admin' : 'customer')}
                className="px-3 py-2 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 shadow-sm border border-gray-200 bg-white hover:bg-gray-50 active:scale-95 flex items-center gap-2"
              >
                {viewMode === 'customer' ? (
                  <>
                    <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    <span className="hidden sm:inline">Mode Éditeur</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    <span className="hidden sm:inline">Voir Boutique</span>
                  </>
                )}
              </button>
            )}
            
            <div className="h-8 w-px bg-gray-200 mx-1 hidden sm:block"></div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:flex flex-col items-end">
                <div className="flex items-center gap-1">
                  {isAdmin && <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 text-[8px] font-black uppercase">Admin</span>}
                  <span className="text-xs font-bold text-gray-900 leading-none">{user?.username}</span>
                </div>
                <span className="text-[10px] text-gray-400 leading-none">{user?.email}</span>
              </div>
              <button 
                onClick={onLogout}
                className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
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
