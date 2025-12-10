import React, { useState } from 'react';
import { X, Search, ChevronRight, CarFront, ArrowLeft } from 'lucide-react';
import { CAR_DATABASE, CarBrand, CarModel } from '../constants/carData';

interface CarLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSize: (size: string) => void;
}

export const CarLookupModal: React.FC<CarLookupModalProps> = ({ isOpen, onClose, onSelectSize }) => {
  const [selectedBrand, setSelectedBrand] = useState<CarBrand | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const handleClose = () => {
    setSelectedBrand(null);
    setSearchQuery('');
    onClose();
  };

  const handleSelectModel = (model: CarModel) => {
    let productId = '';
    switch (model.size) {
      case 'S': productId = 'w-s'; break;
      case 'M': productId = 'w-m'; break;
      case 'XL': productId = 'w-xl'; break;
      case 'XXL': productId = 'w-xxl'; break;
      case 'XXX': productId = 'w-xxx'; break;
      default: productId = 'w-m';
    }
    
    onSelectSize(productId);
    handleClose();
  };

  const filteredBrands = CAR_DATABASE.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.models.some(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
             {selectedBrand ? (
               <button 
                 onClick={() => setSelectedBrand(null)}
                 className="p-1 hover:bg-white/20 rounded-full transition-colors"
               >
                 <ArrowLeft size={24} />
               </button>
             ) : (
               <div className="p-2 bg-yellow-400 rounded-lg text-black">
                 <CarFront size={24} />
               </div>
             )}
             <div>
               <h2 className="text-xl font-bold">
                 {selectedBrand ? selectedBrand.name : 'Select Vehicle'}
               </h2>
               <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">
                 {selectedBrand ? 'Choose Model' : 'Identify Size'}
               </p>
             </div>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Search Bar */}
        {!selectedBrand && (
          <div className="p-4 border-b border-slate-100 bg-slate-50 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Search brand or model..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-lg"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-50 custom-scrollbar">
          
          {selectedBrand ? (
            // --- Model List ---
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {selectedBrand.models.map((model, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectModel(model)}
                  className="bg-white p-2 pr-4 rounded-xl border border-slate-200 shadow-sm hover:border-yellow-400 hover:shadow-md transition-all flex items-center gap-3 group text-left overflow-hidden h-24"
                >
                  <div className="w-24 h-20 flex-shrink-0 bg-white flex items-center justify-center">
                    <img 
                      src={model.image} 
                      alt={model.name} 
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" 
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-800 text-base truncate">{model.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-400 font-medium uppercase">Size</span>
                      <span className="bg-slate-100 text-slate-900 px-2 py-0.5 rounded text-xs font-bold border border-slate-200">{model.size}</span>
                    </div>
                  </div>
                  <div className="bg-yellow-50 text-yellow-600 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                    <ChevronRight size={18} />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            // --- Brand Grid ---
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredBrands.length > 0 ? (
                filteredBrands.map((brand, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedBrand(brand)}
                    className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-yellow-400 transition-all flex flex-col items-center gap-3 group"
                  >
                    <div className="w-20 h-20 p-2 bg-white rounded-lg flex items-center justify-center border border-slate-100 group-hover:border-yellow-400 transition-colors">
                      <img 
                        src={brand.logo} 
                        alt={brand.name} 
                        className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300" 
                        loading="lazy"
                      />
                    </div>
                    <span className="font-bold text-slate-700 group-hover:text-slate-900">{brand.name}</span>
                  </button>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-slate-400">
                  <Search size={48} className="mb-4 opacity-20" />
                  <p>No brands found matching "{searchQuery}"</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
