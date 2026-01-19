
import React, { useState } from 'react';
import { User, SiteSettings } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
  settings: SiteSettings;
  adminEmail: string;
}

interface RegisteredUser extends User {
  password: string;
}

const Auth: React.FC<AuthProps> = ({ onLogin, settings, adminEmail }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const getRegisteredUsers = (): RegisteredUser[] => {
    try {
      const users = localStorage.getItem('cs_registered_users');
      return users ? JSON.parse(users) : [];
    } catch (e) {
      return [];
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const users = getRegisteredUsers();
    const emailLower = formData.email.trim().toLowerCase();
    const passwordTrimmed = formData.password.trim();

    if (isLogin) {
      const user = users.find(u => u.email.trim().toLowerCase() === emailLower);
      if (!user) {
        setError("Ce compte n'existe pas encore. Inscrivez-vous !");
        return;
      }
      if (user.password.trim() !== passwordTrimmed) {
        setError("Mot de passe incorrect.");
        return;
      }
      onLogin({ username: user.username, email: user.email });
    } else {
      const alreadyExists = users.some(u => u.email.trim().toLowerCase() === emailLower);
      if (alreadyExists) {
        setError("Cet email est déjà utilisé.");
        return;
      }
      if (passwordTrimmed.length < 4) {
        setError("Mot de passe trop court (4 min).");
        return;
      }

      const newUser: RegisteredUser = {
        username: formData.username.trim() || (emailLower === adminEmail.toLowerCase() ? 'Administrateur' : 'Client'),
        email: emailLower,
        password: passwordTrimmed
      };

      const updatedUsers = [...users, newUser];
      localStorage.setItem('cs_registered_users', JSON.stringify(updatedUsers));
      onLogin({ username: newUser.username, email: newUser.email });
    }
  };

  const backgroundStyle: React.CSSProperties = settings.useImageBackground && settings.backgroundImage
    ? {
        backgroundImage: `url(${settings.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {
        backgroundColor: settings.backgroundColor
      };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden" style={backgroundStyle}>
      {/* Overlay pour la lisibilité */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]"></div>

      <div className="max-w-[440px] w-full relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-8">
          {settings.logoUrl ? (
            <img src={settings.logoUrl} alt={settings.shopName} className="h-16 mx-auto mb-4 drop-shadow-lg" />
          ) : (
            <div 
              className="w-20 h-20 rounded-3xl flex items-center justify-center text-white text-4xl font-black mx-auto mb-4 shadow-2xl rotate-3"
              style={{ backgroundColor: settings.accentColor }}
            >
              {settings.shopName.charAt(0)}
            </div>
          )}
          <h1 className="text-4xl font-black text-gray-900 tracking-tight drop-shadow-sm">{settings.shopName}</h1>
          <p className="text-gray-600 font-bold mt-2 opacity-80">
            {isLogin ? 'Content de vous revoir !' : 'Rejoignez-nous aujourd\'hui'}
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-xl p-8 sm:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/50">
          <div className="flex p-1.5 bg-gray-200/50 rounded-2xl mb-8">
            <button 
              type="button"
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`flex-1 py-3 text-xs font-black rounded-xl transition-all ${isLogin ? 'bg-white shadow-md text-gray-900 scale-[1.02]' : 'text-gray-500 hover:text-gray-700'}`}
            >
              CONNEXION
            </button>
            <button 
              type="button"
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`flex-1 py-3 text-xs font-black rounded-xl transition-all ${!isLogin ? 'bg-white shadow-md text-gray-900 scale-[1.02]' : 'text-gray-500 hover:text-gray-700'}`}
            >
              INSCRIPTION
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-xl text-xs font-bold animate-in slide-in-from-top-2">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                {error}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-1">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nom Complet</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                  </span>
                  <input 
                    type="text" 
                    required
                    placeholder="Ex: Jean Dupont"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 focus:bg-white outline-none font-bold transition-all shadow-inner"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-1">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Adresse Email</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206"></path></svg>
                </span>
                <input 
                  type="email" 
                  required
                  placeholder="nom@exemple.com"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 focus:bg-white outline-none font-bold transition-all shadow-inner"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mot de passe</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 118 0v4h-8z"></path></svg>
                </span>
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 focus:bg-white outline-none font-bold transition-all shadow-inner"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L5.136 5.136m13.727 13.727L14.122 14.122M19.542 12c-1.274 4.057-5.064 7-9.542 7-1.447 0-2.812-.309-4.043-.865m13.585-6.135A9.959 9.959 0 0121.542 12c-1.274 4.057-5.064 7-9.542 7-1.447 0-2.812-.309-4.043-.865m13.585-6.135L19.542 12m0 0a9.96 9.96 0 00-1.564-3.029m-5.858-.908L5.136 5.136"></path></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                  )}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-5 rounded-[1.5rem] text-white font-black text-sm shadow-xl active:scale-95 transition-all mt-4 hover:brightness-110"
              style={{ backgroundColor: settings.accentColor, boxShadow: `0 10px 30px ${settings.accentColor}40` }}
            >
              {isLogin ? 'SE CONNECTER MAINTENANT' : 'CRÉER MON COMPTE'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400 font-bold">
              {isLogin ? "Pas encore de compte ?" : "Déjà membre ?"}
              <button 
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="ml-2 transition-colors font-black"
                style={{ color: settings.accentColor }}
              >
                {isLogin ? "Inscrivez-vous gratuitement" : "Connectez-vous ici"}
              </button>
            </p>
          </div>
        </div>
        
        {/* Footer auth discret */}
        <p className="mt-8 text-center text-gray-600/60 text-[10px] font-black uppercase tracking-[0.2em]">
          &copy; {new Date().getFullYear()} {settings.shopName} • Sécurisé par CustomShop IA
        </p>
      </div>
    </div>
  );
};

export default Auth;
