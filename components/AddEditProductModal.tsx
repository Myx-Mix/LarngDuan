import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../types';
import { X, Upload, Check, Image as ImageIcon } from 'lucide-react';

interface AddEditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  editingProduct?: Product | null;
}

export const AddEditProductModal: React.FC<AddEditProductModalProps> = ({ 
  isOpen, onClose, onSave, editingProduct 
}) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Wash');
  const [image, setImage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (editingProduct) {
        setName(editingProduct.name);
        setPrice(editingProduct.price.toString());
        setCategory(editingProduct.category);
        setImage(editingProduct.image);
      } else {
        setName('');
        setPrice('');
        setCategory('Wash');
        setImage('');
      }
    }
  }, [isOpen, editingProduct]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    const newProduct: Product = {
      id: editingProduct ? editingProduct.id : `custom-${Date.now()}`,
      name,
      price: parseFloat(price),
      category,
      image: image || 'https://cdn-icons-png.flaticon.com/512/2554/2554978.png', // Default fallback
    };

    onSave(newProduct);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
          <h2 className="font-bold text-lg">
            {editingProduct ? 'Edit Product' : 'New Product Category'}
          </h2>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          {/* Image Upload */}
          <div className="flex flex-col items-center gap-4">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-32 h-32 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:border-yellow-400 hover:bg-yellow-50 transition-all overflow-hidden relative group bg-slate-50"
            >
              {image ? (
                <img src={image} alt="Preview" className="w-full h-full object-contain" />
              ) : (
                <div className="text-center text-slate-400">
                  <Upload size={24} className="mx-auto mb-1" />
                  <span className="text-xs font-medium">Upload Image</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ImageIcon className="text-white" />
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange}
            />
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()}
              className="text-sm font-bold text-slate-600 hover:text-slate-900 underline"
            >
              {image ? 'Change Image' : 'Select Image File'}
            </button>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Product / Category Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Size XL, Detailing, Wax..."
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Price (฿)</label>
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                  required
                />
              </div>
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Group</label>
                 <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Wash"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-yellow-400 py-3 rounded-xl font-bold text-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 border-2 border-yellow-400"
          >
            <Check size={20} />
            {editingProduct ? 'Save Changes' : 'Create Product'}
          </button>
        </form>
      </div>
    </div>
  );
};
