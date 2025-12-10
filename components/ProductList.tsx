import React, { useState } from 'react';
import { Product } from '../types';
import { Plus, CarFront, Search, Pencil } from 'lucide-react';
import { CarLookupModal } from './CarLookupModal';

interface ProductListProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onEditProduct: (product: Product) => void;
}

export const ProductList: React.FC<ProductListProps> = ({ 
  products, 
  onAddToCart,
  onEditProduct
}) => {
  const [isLookupOpen, setIsLookupOpen] = useState(false);

  const handleSizeSelection = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      onAddToCart(product);
    } else {
      console.warn("Product ID from lookup not found in catalog:", productId);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6 overflow-y-auto h-full content-start pb-24">
        
        {/* Smart Car Selector Card */}
        <button
          onClick={() => setIsLookupOpen(true)}
          className="bg-slate-900 border-2 border-slate-900 rounded-xl overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col h-full min-h-[250px] relative text-left"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <CarFront size={120} className="text-white" />
          </div>
          
          <div className="h-32 bg-yellow-400 flex items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
             <Search size={48} className="text-black relative z-10" />
          </div>

          <div className="p-5 flex flex-col flex-grow text-white">
            <h3 className="font-black text-xl mb-1 italic tracking-wide uppercase">Smart Select</h3>
            <p className="text-sm text-slate-300 mb-4 leading-relaxed">
              Don't know the size? Identify price by brand & model.
            </p>
            <div className="mt-auto flex items-center gap-2 text-yellow-400 font-bold text-sm uppercase tracking-wider group-hover:underline decoration-2 underline-offset-4">
              <span>Lookup Vehicle</span>
              <CarFront size={16} />
            </div>
          </div>
        </button>

        {/* Dynamic Products */}
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-yellow-400 transition-all group flex flex-col h-full min-h-[250px] relative"
          >
            {/* Edit Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditProduct(product);
              }}
              className="absolute top-2 left-2 z-10 bg-white/80 hover:bg-white text-slate-500 hover:text-blue-600 p-2 rounded-full shadow-sm backdrop-blur-sm transition-colors border border-slate-100"
              title="Edit Product"
            >
              <Pencil size={14} />
            </button>

            <div 
              className="h-32 bg-white overflow-hidden relative p-4 flex items-center justify-center cursor-pointer"
              onClick={() => onAddToCart(product)}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute top-2 right-2 bg-yellow-400 text-black rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                <Plus size={16} className="text-black" />
              </div>
            </div>
            <div 
              className="p-4 flex flex-col flex-grow border-t border-slate-50 cursor-pointer"
              onClick={() => onAddToCart(product)}
            >
              <h3 className="font-bold text-slate-800 text-sm mb-1">{product.name}</h3>
              <span className="text-xs text-slate-500 uppercase tracking-wide mb-auto font-semibold">
                {product.category}
              </span>
              <div className="mt-3 font-black text-lg text-slate-900">
                ฿{product.price.toFixed(2)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <CarLookupModal 
        isOpen={isLookupOpen} 
        onClose={() => setIsLookupOpen(false)}
        onSelectSize={handleSizeSelection}
      />
    </>
  );
};