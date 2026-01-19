
import React, { useState } from 'react';
import { Product, Order, User, SiteSettings } from '../types';

interface ProductCardProps {
  product: Product;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
  onOrder?: (order: Order) => void;
  accentColor: string;
  user?: User;
  settings: SiteSettings;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isAdmin, onDelete, onOrder, accentColor, user, settings }) => {
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false);
  const [orderInfo, setOrderInfo] = useState({
    name: user?.username || '',
    email: user?.email || '',
    address: ''
  });

  const getRadius = () => {
    switch(settings.buttonRadius) {
      case 'none': return '0';
      case 'md': return '8px';
      case 'xl': return '24px';
      case 'full': return '9999px';
      default: return '24px';
    }
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onOrder) return;

    const newOrder: Order = {
      id: Date.now().toString(),
      productId: product.id,
      productTitle: product.title,
      price: product.price,
      customerName: orderInfo.name,
      customerEmail: orderInfo.email,
      customerAddress: orderInfo.address,
      date: new Date().toLocaleString('fr-FR')
    };

    onOrder(newOrder);
    setIsOrdered(true);
    setTimeout(() => {
      setShowOrderForm(false);
      setIsOrdered(false);
    }, 2000);
  };

  return (
    <div className={`group relative bg-white rounded-[2rem] overflow-hidden transition-all duration-300 ${isAdmin ? 'shadow-sm' : 'shadow-xl hover:shadow-2xl hover:-translate-y-2'}`}>
      <div className="aspect-[4/3] w-full overflow-hidden bg-gray-50">
        <img src={product.imageUrl} alt={product.title} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur rounded-full text-[10px] font-black text-gray-800 shadow-sm uppercase tracking-widest">
            {product.category}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-900">{product.title}</h3>
          <span className="text-lg font-black" style={{ color: accentColor }}>{product.price.toFixed(2)}€</span>
        </div>
        <p className="text-gray-500 text-sm line-clamp-2 mb-6 h-10 leading-relaxed">{product.description}</p>

        <button 
          onClick={() => setShowOrderForm(true)}
          className="w-full py-4 text-white font-black text-sm transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2"
          style={{ backgroundColor: accentColor, borderRadius: getRadius() }}
        >
          Acheter maintenant
        </button>
      </div>

      {showOrderForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative">
            <button onClick={() => setShowOrderForm(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>

            {isOrdered ? (
              <div className="text-center py-10 animate-in zoom-in duration-500">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h3 className="text-2xl font-black text-gray-900">Commande passée !</h3>
                <p className="text-gray-500 mt-2 font-medium">Nous préparons votre colis.</p>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-black text-gray-900 mb-2">Finaliser l'achat</h3>
                <p className="text-gray-500 text-sm mb-6">Article : <span className="font-black" style={{ color: accentColor }}>{product.title}</span></p>
                
                <form onSubmit={handleOrderSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Nom complet</label>
                    <input required type="text" className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none" value={orderInfo.name} onChange={e => setOrderInfo({...orderInfo, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Adresse de livraison</label>
                    <textarea required rows={3} className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none resize-none" placeholder="Ex: 42 rue de la Paix, 75000 Paris" value={orderInfo.address} onChange={e => setOrderInfo({...orderInfo, address: e.target.value})} />
                  </div>
                  <div className="pt-2">
                    <button type="submit" className="w-full py-5 text-white font-black text-sm shadow-xl transition-all active:scale-95" style={{ backgroundColor: accentColor, borderRadius: getRadius() }}>
                      Confirmer la commande ({product.price.toFixed(2)}€)
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;