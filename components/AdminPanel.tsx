
import React, { useState, useEffect } from 'react';
import { SiteSettings, Product, Order, FontFamily, ButtonRadius } from '../types';
import { generateProductDescription } from '../geminiService';

interface AdminPanelProps {
  settings: SiteSettings;
  onUpdateSettings: (settings: Partial<SiteSettings>) => void;
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  products: Product[];
  onDeleteProduct: (id: string) => void;
  orders: Order[];
  onDeleteOrder: (id: string) => void;
  onAddOrder: (order: Order) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  settings, onUpdateSettings, onAddProduct, onUpdateProduct, products, onDeleteProduct, orders, onDeleteOrder, onAddOrder 
}) => {
  const [activeTab, setActiveTab] = useState<'config' | 'sales' | 'products' | 'design'>('sales');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({ title: '', price: '', category: 'Général', imageUrl: '' });
  const [isGenerating, setIsGenerating] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  useEffect(() => {
    setSaveStatus('saved');
    const timer = setTimeout(() => setSaveStatus('idle'), 1000);
    return () => clearTimeout(timer);
  }, [settings, products, orders]);

  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.price) || 0), 0);

  const handleSimulateSale = () => {
    if (products.length === 0) return alert("Ajoutez au moins un produit !");
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    onAddOrder({
      id: Date.now().toString(),
      productId: randomProduct.id,
      productTitle: randomProduct.title,
      price: randomProduct.price,
      customerName: "Client Test",
      customerEmail: "test@exemple.com",
      customerAddress: "123 Rue de la Boutique, Paris",
      date: new Date().toLocaleString('fr-FR')
    });
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    const description = await generateProductDescription(newProduct.title, newProduct.category);
    onAddProduct({
      id: Date.now().toString(),
      title: String(newProduct.title),
      price: parseFloat(String(newProduct.price)) || 0,
      description: String(description),
      imageUrl: newProduct.imageUrl || `https://picsum.photos/seed/${newProduct.title.replace(/\s+/g, '')}/400/300`,
      category: String(newProduct.category)
    });
    setNewProduct({ title: '', price: '', category: 'Général', imageUrl: '' });
    setIsGenerating(false);
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      onUpdateProduct(editingProduct);
      setEditingProduct(null);
    }
  };

  const resetDesign = () => {
    if(confirm("Voulez-vous réinitialiser tout le style du site ?")) {
      onUpdateSettings({
        backgroundColor: '#f3f4f6',
        accentColor: '#4f46e5',
        textColor: '#111827',
        useImageBackground: false,
        backgroundImage: '',
        fontFamily: 'modern',
        buttonRadius: 'xl'
      });
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/70 p-8 rounded-[2.5rem] backdrop-blur-md shadow-sm border border-white">
        <div>
          <h2 className="text-3xl font-black text-gray-900">Console d'Édition</h2>
          <p className="text-gray-500 font-medium">Configurez votre boutique selon vos envies.</p>
        </div>
        <div className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-sm ${saveStatus === 'saved' ? 'bg-emerald-500 text-white' : 'bg-white text-gray-400'}`}>
          <span className={`w-2 h-2 rounded-full ${saveStatus === 'saved' ? 'bg-white animate-ping' : 'bg-gray-300'}`}></span>
          {saveStatus === 'saved' ? 'Sauvegardé' : 'Prêt'}
        </div>
      </div>

      <nav className="flex flex-wrap gap-2 bg-gray-200/50 p-1.5 rounded-3xl w-fit backdrop-blur-sm">
        {[
          { id: 'sales', label: 'Ventes', icon: '💰' },
          { id: 'products', label: 'Produits', icon: '📦' },
          { id: 'design', label: 'Contenu', icon: '📝' },
          { id: 'config', label: 'Style', icon: '🎨' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-3 rounded-2xl text-xs font-black flex items-center gap-2 transition-all ${activeTab === tab.id ? 'bg-white shadow-lg text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </nav>

      {activeTab === 'design' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4">
          <section className="bg-white p-10 rounded-[3rem] shadow-xl space-y-6">
            <h3 className="text-xl font-black">Identité & Hero</h3>
            <div className="space-y-4">
               <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nom de la Boutique</label>
                <input type="text" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold" value={String(settings.shopName)} onChange={e => onUpdateSettings({ shopName: e.target.value })} />
              </div>
               <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Titre Principal</label>
                <input type="text" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold" value={String(settings.heroTitle)} onChange={e => onUpdateSettings({ heroTitle: e.target.value })} />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Sous-titre</label>
                <textarea rows={3} className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-medium resize-none" value={String(settings.heroSubtitle)} onChange={e => onUpdateSettings({ heroSubtitle: e.target.value })} />
              </div>
            </div>
          </section>

          <section className="bg-white p-10 rounded-[3rem] shadow-xl space-y-6">
            <h3 className="text-xl font-black">Réseaux Sociaux</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Instagram</label>
                  <input type="text" placeholder="URL" className="w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm" value={settings.socialLinks?.instagram || ''} onChange={e => onUpdateSettings({ socialLinks: { ...settings.socialLinks, instagram: e.target.value } })} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Facebook</label>
                  <input type="text" placeholder="URL" className="w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm" value={settings.socialLinks?.facebook || ''} onChange={e => onUpdateSettings({ socialLinks: { ...settings.socialLinks, facebook: e.target.value } })} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Twitter (X)</label>
                  <input type="text" placeholder="URL" className="w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm" value={settings.socialLinks?.twitter || ''} onChange={e => onUpdateSettings({ socialLinks: { ...settings.socialLinks, twitter: e.target.value } })} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">TikTok</label>
                  <input type="text" placeholder="URL" className="w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm" value={settings.socialLinks?.tiktok || ''} onChange={e => onUpdateSettings({ socialLinks: { ...settings.socialLinks, tiktok: e.target.value } })} />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-2xl border border-indigo-100 mt-4">
                <div>
                  <h4 className="font-black text-indigo-900 text-sm">Assistant IA Gemini</h4>
                  <p className="text-xs text-indigo-600">Affiche le chatbot de vente intelligent</p>
                </div>
                <button 
                  onClick={() => onUpdateSettings({ showChatbot: !settings.showChatbot })}
                  className={`w-14 h-8 rounded-full transition-all relative ${settings.showChatbot ? 'bg-indigo-600' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${settings.showChatbot ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      {activeTab === 'config' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4">
          <section className="bg-white p-10 rounded-[3rem] shadow-xl space-y-8">
            <h3 className="text-xl font-black">Typographie & Formes</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Style de Police</label>
                <select 
                  className="w-full px-4 py-3 bg-gray-50 border rounded-xl font-bold"
                  value={settings.fontFamily}
                  onChange={e => onUpdateSettings({ fontFamily: e.target.value as FontFamily })}
                >
                  <option value="modern">Moderne (Inter)</option>
                  <option value="elegant">Élégant (Serif)</option>
                  <option value="tech">Tech (Grotesk)</option>
                  <option value="mono">Console (Mono)</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Rayon Boutons</label>
                <select 
                  className="w-full px-4 py-3 bg-gray-50 border rounded-xl font-bold"
                  value={settings.buttonRadius}
                  onChange={e => onUpdateSettings({ buttonRadius: e.target.value as ButtonRadius })}
                >
                  <option value="none">Carré</option>
                  <option value="md">Léger</option>
                  <option value="xl">Arrondi</option>
                  <option value="full">Pilule</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Couleurs du Thème</label>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-[8px] font-bold text-gray-400 mb-1">FOND</div>
                  <input type="color" value={settings.backgroundColor} onChange={e => onUpdateSettings({ backgroundColor: e.target.value, useImageBackground: false })} className="w-full h-12 rounded-lg cursor-pointer" />
                </div>
                <div className="text-center">
                  <div className="text-[8px] font-bold text-gray-400 mb-1">ACCENT</div>
                  <input type="color" value={settings.accentColor} onChange={e => onUpdateSettings({ accentColor: e.target.value })} className="w-full h-12 rounded-lg cursor-pointer" />
                </div>
                <div className="text-center">
                  <div className="text-[8px] font-bold text-gray-400 mb-1">TEXTE</div>
                  <input type="color" value={settings.textColor} onChange={e => onUpdateSettings({ textColor: e.target.value })} className="w-full h-12 rounded-lg cursor-pointer" />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <button 
                onClick={resetDesign}
                className="text-xs font-black text-red-500 hover:text-red-700 flex items-center gap-2 uppercase tracking-tighter"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                Réinitialiser le style par défaut
              </button>
            </div>
          </section>

          <section className="bg-white p-10 rounded-[3rem] shadow-xl space-y-6">
            <h3 className="text-xl font-black">Fond & Logo</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Image de fond (URL)</label>
                <input type="text" placeholder="Ex: https://images.unsplash.com/..." className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl" value={settings.backgroundImage} onChange={e => onUpdateSettings({ backgroundImage: e.target.value, useImageBackground: !!e.target.value })} />
              </div>
              <div>
                <label className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  <span>Opacité de l'overlay sombre</span>
                  <span>{Math.round(settings.backgroundOverlayOpacity * 100)}%</span>
                </label>
                <input 
                  type="range" min="0" max="0.9" step="0.05" 
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  value={settings.backgroundOverlayOpacity} 
                  onChange={e => onUpdateSettings({ backgroundOverlayOpacity: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Logo de la boutique (URL)</label>
                <input type="text" placeholder="URL de votre logo" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl" value={settings.logoUrl} onChange={e => onUpdateSettings({ logoUrl: e.target.value })} />
              </div>
            </div>
          </section>
        </div>
      )}

      {activeTab === 'sales' && (
        <div className="bg-white rounded-[3rem] shadow-xl overflow-hidden animate-in fade-in">
           <div className="p-8 border-b flex justify-between items-center">
            <h3 className="text-2xl font-black">Activité Commerciale</h3>
            <button onClick={handleSimulateSale} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:scale-105 transition-all">Simuler une vente</button>
           </div>
           <div className="p-8 grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-6 rounded-3xl">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Revenu Total</span>
                <p className="text-4xl font-black">{totalRevenue.toFixed(2)}€</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-3xl">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Commandes</span>
                <p className="text-4xl font-black">{orders.length}</p>
              </div>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase">
                 <tr>
                   <th className="px-8 py-4">Client</th>
                   <th className="px-8 py-4">Produit</th>
                   <th className="px-8 py-4 text-right">Montant</th>
                   <th className="px-8 py-4"></th>
                 </tr>
               </thead>
               <tbody className="divide-y">
                 {orders.length > 0 ? orders.map(o => (
                   <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                     <td className="px-8 py-5">
                       <div className="font-bold text-sm">{String(o.customerName)}</div>
                       <div className="text-[10px] text-gray-400">{String(o.date)}</div>
                     </td>
                     <td className="px-8 py-5 text-sm font-medium">{String(o.productTitle)}</td>
                     <td className="px-8 py-5 text-right font-black text-emerald-600">{Number(o.price).toFixed(2)}€</td>
                     <td className="px-8 py-5 text-right">
                       <button onClick={() => onDeleteOrder(o.id)} className="text-red-400 hover:text-red-600">Supprimer</button>
                     </td>
                   </tr>
                 )) : (
                   <tr>
                     <td colSpan={4} className="px-8 py-10 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">Aucune commande enregistrée</td>
                   </tr>
                 )}
               </tbody>
             </table>
           </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-left-4">
          <section className="bg-white p-8 rounded-[2.5rem] shadow-xl h-fit sticky top-24">
            <h3 className="text-xl font-black mb-6">{editingProduct ? 'Modifier le Produit' : 'Nouveau Produit'}</h3>
            <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} className="space-y-4">
              <div>
                <label className="text-[8px] font-bold text-gray-400 uppercase ml-1">Nom du produit</label>
                <input required placeholder="Ex: Montre de luxe" className="w-full px-5 py-4 bg-gray-50 border rounded-2xl" value={editingProduct ? editingProduct.title : newProduct.title} onChange={e => editingProduct ? setEditingProduct({...editingProduct, title: e.target.value}) : setNewProduct({...newProduct, title: e.target.value})} />
              </div>
              <div>
                <label className="text-[8px] font-bold text-gray-400 uppercase ml-1">Prix (€)</label>
                <input required type="number" step="0.01" placeholder="99.99" className="w-full px-5 py-4 bg-gray-50 border rounded-2xl" value={editingProduct ? editingProduct.price : newProduct.price} onChange={e => editingProduct ? setEditingProduct({...editingProduct, price: parseFloat(e.target.value) || 0}) : setNewProduct({...newProduct, price: e.target.value})} />
              </div>
              <div>
                <label className="text-[8px] font-bold text-gray-400 uppercase ml-1">Catégorie</label>
                <input placeholder="Ex: Accessoires" className="w-full px-5 py-4 bg-gray-50 border rounded-2xl" value={editingProduct ? editingProduct.category : newProduct.category} onChange={e => editingProduct ? setEditingProduct({...editingProduct, category: e.target.value}) : setNewProduct({...newProduct, category: e.target.value})} />
              </div>
              <div>
                <label className="text-[8px] font-bold text-gray-400 uppercase ml-1">Image URL</label>
                <input placeholder="https://..." className="w-full px-5 py-4 bg-gray-50 border rounded-2xl" value={editingProduct ? editingProduct.imageUrl : newProduct.imageUrl} onChange={e => editingProduct ? setEditingProduct({...editingProduct, imageUrl: e.target.value}) : setNewProduct({...newProduct, imageUrl: e.target.value})} />
              </div>
              
              <button disabled={isGenerating} className="w-full py-5 bg-gray-900 text-white font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg disabled:opacity-50">
                {isGenerating ? 'IA Génération...' : (editingProduct ? 'Enregistrer les modifications' : 'Mettre en vente')}
              </button>
              {editingProduct && (
                <button type="button" onClick={() => setEditingProduct(null)} className="w-full py-3 text-gray-400 font-bold hover:text-gray-600">
                  Annuler l'édition
                </button>
              )}
            </form>
          </section>
          
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.length > 0 ? products.map(p => (
              <div key={p.id} className="p-6 bg-white rounded-3xl border flex items-center gap-4 hover:shadow-lg transition-all">
                <img src={p.imageUrl} className="w-20 h-20 rounded-2xl object-cover" alt="" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-black truncate text-gray-900">{String(p.title)}</h4>
                  <p className="font-black text-emerald-600">{Number(p.price).toFixed(2)}€</p>
                  <span className="text-[9px] uppercase font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">{String(p.category)}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => setEditingProduct(p)} className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                  </button>
                  <button onClick={() => onDeleteProduct(p.id)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </div>
              </div>
            )) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
