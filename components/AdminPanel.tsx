
import React, { useState, useEffect } from 'react';
import { SiteSettings, Product, Order } from '../types';
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
  const [activeTab, setActiveTab] = useState<'config' | 'sales' | 'products'>('sales');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({ title: '', price: '', category: 'Général', imageUrl: '' });
  const [isGenerating, setIsGenerating] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Petit flash vert pour dire "C'est enregistré !"
  useEffect(() => {
    setSaveStatus('saved');
    const timer = setTimeout(() => setSaveStatus('idle'), 1000);
    return () => clearTimeout(timer);
  }, [settings, products, orders]);

  const totalRevenue = orders.reduce((sum, o) => sum + o.price, 0);

  const handleSimulateSale = () => {
    if (products.length === 0) {
      alert("Ajoutez au moins un produit pour simuler une vente !");
      return;
    }

    const randomProduct = products[Math.floor(Math.random() * products.length)];
    const names = ["Alice Martin", "Thomas Durand", "Sophie Bernard", "Nicolas Petit", "Emma Leroy"];
    const addresses = ["12 rue de la Paix, 75002 Paris", "45 avenue Foch, 69006 Lyon", "8 bis rue du Commerce, 33000 Bordeaux", "102 boulevard Haussmann, 75008 Paris"];
    
    const fakeOrder: Order = {
      id: Date.now().toString(),
      productId: randomProduct.id,
      productTitle: randomProduct.title,
      price: randomProduct.price,
      customerName: names[Math.floor(Math.random() * names.length)],
      customerEmail: `client${Math.floor(Math.random() * 1000)}@exemple.com`,
      customerAddress: addresses[Math.floor(Math.random() * addresses.length)],
      date: new Date().toLocaleString('fr-FR')
    };

    onAddOrder(fakeOrder);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    const description = await generateProductDescription(newProduct.title, newProduct.category);
    const product: Product = {
      id: Date.now().toString(),
      title: newProduct.title,
      price: parseFloat(newProduct.price) || 0,
      description,
      imageUrl: newProduct.imageUrl || `https://picsum.photos/seed/${newProduct.title}/400/300`,
      category: newProduct.category
    };
    onAddProduct(product);
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

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/50 p-6 rounded-[2rem] backdrop-blur-sm border border-white/50">
        <div>
          <h2 className="text-3xl font-black text-gray-900">Panneau de Contrôle</h2>
          <p className="text-gray-500 font-medium">Tes réglages pour {settings.shopName}.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${saveStatus === 'saved' ? 'bg-emerald-500 text-white scale-105' : 'bg-white text-gray-400 opacity-60'}`}>
            <span className={`w-2 h-2 rounded-full ${saveStatus === 'saved' ? 'bg-white animate-ping' : 'bg-gray-300'}`}></span>
            {saveStatus === 'saved' ? 'Modifications Enregistrées' : 'Prêt'}
          </div>
        </div>
      </div>

      <div className="flex bg-gray-200/50 p-1.5 rounded-2xl w-fit shadow-inner backdrop-blur-sm">
        {[
          { id: 'sales', label: 'Mes Ventes', icon: '💰' },
          { id: 'products', label: 'Mes Produits', icon: '📦' },
          { id: 'config', label: 'Mon Design', icon: '🎨' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-8 py-4 rounded-xl text-sm font-black flex items-center gap-2 transition-all ${activeTab === tab.id ? 'bg-white shadow-xl text-gray-900 scale-105' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'sales' && (
        <div className="grid grid-cols-1 gap-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center mb-2 px-2">
            <h3 className="text-xl font-black">Performance Commerciale</h3>
            <button 
              onClick={handleSimulateSale}
              className="flex items-center gap-2 px-5 py-3 bg-indigo-50 text-indigo-600 rounded-2xl text-xs font-black hover:bg-indigo-100 transition-all active:scale-95 border border-indigo-100 shadow-sm"
            >
              <span>🧪</span>
              SIMULER UNE VENTE
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Caisse</span>
              <p className="text-4xl font-black text-gray-900 mt-2">{totalRevenue.toFixed(2)}€</p>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Commandes</span>
              <p className="text-4xl font-black text-gray-900 mt-2">{orders.length}</p>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    <th className="px-8 py-5">Client / Date</th>
                    <th className="px-8 py-5">Article</th>
                    <th className="px-8 py-5">Adresse de Livraison</th>
                    <th className="px-8 py-5 text-right">Prix</th>
                    <th className="px-8 py-5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="font-black text-gray-900">{order.customerName}</div>
                        <div className="text-[10px] text-gray-400 font-bold">{order.date}</div>
                        <div className="text-xs text-indigo-500 font-bold">{order.customerEmail}</div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-black text-gray-600 uppercase">
                          {order.productTitle}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-start gap-2 max-w-[250px]">
                          <svg className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                          <span className="text-xs text-gray-600 font-medium leading-relaxed">{order.customerAddress}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right font-black text-emerald-600">{order.price.toFixed(2)}€</td>
                      <td className="px-8 py-6">
                        <button onClick={() => onDeleteOrder(order.id)} className="p-2 text-gray-300 hover:text-red-500 transition-all">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-20 text-center text-gray-400 font-bold italic">
                        Aucune vente pour le moment.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-left-4 duration-500">
          <div className="lg:col-span-1">
            <section className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 sticky top-24">
              <h3 className="text-xl font-black mb-6">
                {editingProduct ? '📝 Modifier l\'annonce' : '🚀 Nouvelle annonce'}
              </h3>
              <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} className="space-y-4">
                <input required placeholder="Nom du produit" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none font-bold" value={editingProduct ? editingProduct.title : newProduct.title} onChange={e => editingProduct ? setEditingProduct({...editingProduct, title: e.target.value}) : setNewProduct({...newProduct, title: e.target.value})} />
                <input required type="number" step="0.01" placeholder="Prix (€)" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none font-bold" value={editingProduct ? editingProduct.price : newProduct.price} onChange={e => editingProduct ? setEditingProduct({...editingProduct, price: parseFloat(e.target.value)}) : setNewProduct({...newProduct, price: e.target.value})} />
                <input placeholder="Lien image (URL)" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none font-medium" value={editingProduct ? editingProduct.imageUrl : newProduct.imageUrl} onChange={e => editingProduct ? setEditingProduct({...editingProduct, imageUrl: e.target.value}) : setNewProduct({...newProduct, imageUrl: e.target.value})} />
                <button disabled={isGenerating} className="w-full py-5 bg-gray-900 text-white font-black rounded-2xl shadow-xl active:scale-95 transition-all">
                  {isGenerating ? 'IA en cours...' : (editingProduct ? 'Enregistrer' : 'Mettre en vente')}
                </button>
                {editingProduct && (
                  <button type="button" onClick={() => setEditingProduct(null)} className="w-full py-3 bg-gray-100 text-gray-500 font-black rounded-2xl">Annuler</button>
                )}
              </form>
            </section>
          </div>
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.map(p => (
                <div key={p.id} className="p-5 bg-white rounded-3xl border border-gray-100 flex items-center gap-5 shadow-sm hover:shadow-md transition-all">
                  <img src={p.imageUrl} className="w-16 h-16 rounded-2xl object-cover" alt="" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-gray-900 truncate">{p.title}</h4>
                    <p className="text-emerald-600 font-black">{p.price.toFixed(2)}€</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingProduct(p)} className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    </button>
                    <button onClick={() => onDeleteProduct(p.id)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'config' && (
        <section className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase mb-3 tracking-[0.2em] ml-1">Nom du Site</label>
                <input type="text" className="w-full px-7 py-5 bg-gray-50 border border-gray-200 rounded-[2rem] outline-none font-black text-2xl" value={settings.shopName} onChange={e => onUpdateSettings({ shopName: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase mb-3 tracking-[0.2em] ml-1">Couleur Fond</label>
                  <input type="color" className="w-full h-16 bg-transparent border-none cursor-pointer" value={settings.backgroundColor} onChange={e => onUpdateSettings({ backgroundColor: e.target.value, useImageBackground: false })} />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase mb-3 tracking-[0.2em] ml-1">Couleur Accent</label>
                  <input type="color" className="w-full h-16 bg-transparent border-none cursor-pointer" value={settings.accentColor} onChange={e => onUpdateSettings({ accentColor: e.target.value })} />
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase mb-3 tracking-[0.2em] ml-1">Image de Fond (Lien)</label>
                <input type="text" placeholder="https://..." className="w-full px-7 py-5 bg-gray-50 border border-gray-200 rounded-[2rem] outline-none font-medium" value={settings.backgroundImage} onChange={e => onUpdateSettings({ backgroundImage: e.target.value, useImageBackground: true })} />
              </div>
              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase mb-3 tracking-[0.2em] ml-1">Logo (Lien)</label>
                <input type="text" className="w-full px-7 py-5 bg-gray-50 border border-gray-200 rounded-[2rem] outline-none font-medium" value={settings.logoUrl} onChange={e => onUpdateSettings({ logoUrl: e.target.value })} />
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default AdminPanel;
