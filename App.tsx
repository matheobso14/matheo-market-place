
import React, { useState, useEffect } from 'react';
import { Product, SiteSettings, ViewMode, User, Order } from './types';
import AdminPanel from './components/AdminPanel';
import ProductCard from './components/ProductCard';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import Auth from './components/Auth';

const ADMIN_EMAIL = 'matheobso14@gmail.com';

// Tes réglages d'origine (NE PAS CHANGER ICI, UTILISER L'INTERFACE ADMIN)
const BASE_DEFAULTS = {
  shopName: 'Ma Boutique Perso',
  backgroundColor: '#f3f4f6', // Le gris clair d'origine
  accentColor: '#4f46e5',     // Le bleu d'origine
  textColor: '#111827'
};

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Exemple de Produit',
    price: 99.00,
    description: 'Modifiez cette annonce dans votre panneau admin.',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
    category: 'Général'
  }
];

const App: React.FC = () => {
  // 1. Chargement de l'utilisateur
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('cs_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [viewMode, setViewMode] = useState<ViewMode>('customer');

  // 2. Chargement des PRODUITS (Tes modifs d'annonces sont ici)
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('cs_products');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0) return parsed;
    }
    return DEFAULT_PRODUCTS;
  });

  // 3. Chargement des COMMANDES
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('cs_orders');
    return saved ? JSON.parse(saved) : [];
  });

  // 4. Chargement du DESIGN (Ton fond, tes couleurs, ton nom de boutique)
  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('cs_settings');
    const defaults: SiteSettings = {
      shopName: BASE_DEFAULTS.shopName,
      logoUrl: '',
      backgroundColor: BASE_DEFAULTS.backgroundColor,
      backgroundImage: '',
      accentColor: BASE_DEFAULTS.accentColor,
      textColor: BASE_DEFAULTS.textColor,
      useImageBackground: false,
      socialLinks: { facebook: '', instagram: '', twitter: '', linkedin: '', tiktok: '' }
    };

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // On fusionne pour garder tes couleurs et ton fond en priorité
        return { ...defaults, ...parsed };
      } catch (e) { return defaults; }
    }
    return defaults;
  });

  const isUserAdmin = user?.email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim();

  useEffect(() => {
    if (isUserAdmin) setViewMode('admin');
  }, [user]);

  // SAUVEGARDE AUTOMATIQUE SYSTÉMATIQUE
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

  // Appliquer ton fond (image ou couleur)
  const backgroundStyle: React.CSSProperties = settings.useImageBackground && settings.backgroundImage
    ? {
        backgroundImage: `linear-gradient(rgba(255,255,255,0.02), rgba(255,255,255,0.02)), url(${settings.backgroundImage})`,
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
    <div className="min-h-screen transition-all duration-500 pb-20" style={backgroundStyle}>
      <Navbar 
        viewMode={viewMode} 
        setViewMode={setViewMode} 
        shopName={settings.shopName}
        logoUrl={settings.logoUrl}
        accentColor={settings.accentColor}
        user={user}
        onLogout={() => { setUser(null); setViewMode('customer'); }}
        isAdmin={isUserAdmin}
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
          <div className="animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="text-center mb-16 py-10">
              <h1 className="text-5xl md:text-8xl font-black mb-4 tracking-tighter" style={{ color: settings.textColor }}>
                {settings.shopName}
              </h1>
              <p className="text-lg opacity-60 font-medium max-w-2xl mx-auto" style={{ color: settings.textColor }}>
                Découvrez notre sélection exclusive.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  isAdmin={false}
                  accentColor={settings.accentColor}
                  onOrder={addOrder}
                  user={user}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      <Chatbot products={products} shopName={settings.shopName} accentColor={settings.accentColor} />
    </div>
  );
};

export default App;
