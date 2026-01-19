
import React, { useState, useEffect } from 'react';
import { Product, SiteSettings, ViewMode, User, Order } from './types';
import AdminPanel from './components/AdminPanel';
import ProductCard from './components/ProductCard';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import Auth from './components/Auth';

const ADMIN_EMAIL = 'matheobso14@gmail.com';

const DEFAULT_SETTINGS: SiteSettings = {
  shopName: 'Ma Boutique Perso',
  heroTitle: 'Bienvenue dans notre univers',
  heroSubtitle: 'Découvrez notre sélection exclusive de produits haut de gamme.',
  logoUrl: '',
  backgroundColor: '#f3f4f6',
  backgroundImage: '',
  backgroundOverlayOpacity: 0.1,
  accentColor: '#4f46e5',
  textColor: '#111827',
  useImageBackground: false,
  fontFamily: 'modern',
  buttonRadius: 'xl',
  footerText: '© 2024 - Tous droits réservés',
  showChatbot: true,
  socialLinks: { facebook: '', instagram: '', twitter: '', linkedin: '', tiktok: '' }
};

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Exemple de Produit',
    price: 99.00,
    description: 'Ceci est une description générée par défaut. Modifiez-la dans le panneau admin.',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
    category: 'Général'
  }
];

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('cs_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [viewMode, setViewMode] = useState<ViewMode>('customer');

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('cs_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.length > 0 ? parsed : DEFAULT_PRODUCTS;
      } catch(e) { return DEFAULT_PRODUCTS; }
    }
    return DEFAULT_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('cs_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('cs_settings');
    if (saved) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      } catch (e) { return DEFAULT_SETTINGS; }
    }
    return DEFAULT_SETTINGS;
  });

  const isUserAdmin = user?.email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim();

  useEffect(() => {
    if (isUserAdmin) setViewMode('admin');
  }, [user]);

  useEffect(() => { localStorage.setItem('cs_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('cs_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('cs_settings', JSON.stringify(settings)); }, [settings]);
  useEffect(() => {
    if (user) localStorage.setItem('cs_user', JSON.stringify(user));
    else localStorage.removeItem('cs_user');
  }, [user]);

  const addProduct = (product: Product) => setProducts(prev => [product, ...prev]);
  const updateProduct = (updated: Product) => setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
  const deleteProduct = (id: string) => setProducts(prev => prev.filter(p => p.id !== id));
  const addOrder = (order: Order) => setOrders(prev => [order, ...prev]);
  const deleteOrder = (id: string) => setOrders(prev => prev.filter(o => o.id !== id));
  const updateSettings = (newSettings: Partial<SiteSettings>) => setSettings(prev => ({ ...prev, ...newSettings }));

  const fontClass = `font-${settings.fontFamily}`;

  const backgroundStyle: React.CSSProperties = settings.useImageBackground && settings.backgroundImage
    ? {
        backgroundImage: `linear-gradient(rgba(0,0,0,${settings.backgroundOverlayOpacity}), rgba(0,0,0,${settings.backgroundOverlayOpacity})), url(${settings.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }
    : {
        backgroundColor: settings.backgroundColor
      };

  if (!user) {
    return <Auth onLogin={setUser} settings={settings} adminEmail={ADMIN_EMAIL} />;
  }

  return (
    <div className={`min-h-screen ${fontClass} transition-all duration-500`} style={backgroundStyle}>
      <Navbar 
        viewMode={viewMode} 
        setViewMode={setViewMode} 
        shopName={settings.shopName}
        logoUrl={settings.logoUrl}
        accentColor={settings.accentColor}
        user={user}
        onLogout={() => { setUser(null); setViewMode('customer'); }}
        isAdmin={isUserAdmin}
        settings={settings}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {viewMode === 'admin' && isUserAdmin ? (
          <AdminPanel 
            settings={settings} 
            onUpdateSettings={updateSettings} 
            onAddProduct={addProduct}
            onUpdateProduct={updateProduct}
            products={products}
            onDeleteProduct={deleteProduct}
            orders={orders}
            onDeleteOrder={deleteOrder}
            onAddOrder={addOrder}
          />
        ) : (
          <div className="animate-in fade-in slide-in-from-top-4 duration-1000">
            <div className="text-center mb-16 py-20 px-4">
              <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter leading-tight" style={{ color: settings.textColor }}>
                {settings.heroTitle}
              </h1>
              <p className="text-xl md:text-2xl opacity-80 font-medium max-w-3xl mx-auto" style={{ color: settings.textColor }}>
                {settings.heroSubtitle}
              </p>
              <div className="mt-10 flex justify-center gap-4">
                 <button 
                  onClick={() => document.getElementById('products-grid')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 font-bold text-white shadow-xl hover:scale-105 active:scale-95 transition-all"
                  style={{ backgroundColor: settings.accentColor, borderRadius: settings.buttonRadius === 'none' ? '0' : settings.buttonRadius === 'md' ? '8px' : settings.buttonRadius === 'xl' ? '24px' : '9999px' }}
                >
                  Découvrir la collection
                </button>
              </div>
            </div>
            
            <div id="products-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-20">
              {products.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  isAdmin={false}
                  accentColor={settings.accentColor}
                  onOrder={addOrder}
                  user={user}
                  settings={settings}
                />
              ))}
            </div>

            <footer className="mt-20 py-10 border-t text-center opacity-60" style={{ color: settings.textColor, borderColor: `${settings.textColor}20` }}>
              <p className="text-sm font-bold uppercase tracking-widest">{settings.footerText}</p>
              <div className="flex justify-center gap-6 mt-6">
                {Object.entries(settings.socialLinks).map(([name, url]) => url && (
                  <a key={name} href={url} target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity">
                    <span className="capitalize">{name}</span>
                  </a>
                ))}
              </div>
            </footer>
          </div>
        )}
      </main>

      {settings.showChatbot && (
        <Chatbot products={products} shopName={settings.shopName} accentColor={settings.accentColor} settings={settings} />
      )}
    </div>
  );
};

export default App;