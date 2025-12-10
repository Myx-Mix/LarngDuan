import React from 'react';
import { CartItem } from '../types';
import { Trash2, Minus, Plus, CreditCard } from 'lucide-react';
import { TAX_RATE } from '../constants';

interface CartSidebarProps {
  cart: CartItem[];
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  onCheckout: () => void;
  clearCart: () => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({
  cart,
  updateQuantity,
  removeFromCart,
  onCheckout,
  clearCart,
}) => {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 border-l border-slate-200 bg-white">
        <div className="bg-yellow-50 p-6 rounded-full mb-4">
          <CreditCard size={48} className="text-yellow-500" />
        </div>
        <p className="text-lg font-medium">Cart is empty</p>
        <p className="text-sm">Select services to start</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-200 shadow-xl z-20">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <h2 className="font-bold text-lg text-slate-800">Current Job</h2>
        <button 
          onClick={clearCart}
          className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 hover:bg-red-50 rounded"
        >
          Clear All
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {cart.map((item) => (
          <div key={item.id} className="flex gap-3 bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
            <img src={item.image} alt={item.name} className="w-16 h-16 rounded-md object-cover bg-slate-100" />
            <div className="flex-1 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-slate-800 text-sm leading-tight">{item.name}</h4>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              
              <div className="flex justify-between items-end mt-2">
                <div className="flex items-center bg-slate-50 rounded-md border border-slate-200 shadow-sm h-7">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="px-2 h-full hover:bg-slate-200 text-slate-600 rounded-l-md"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="px-2 text-xs font-semibold w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="px-2 h-full hover:bg-slate-200 text-slate-600 rounded-r-md"
                  >
                    <Plus size={12} />
                  </button>
                </div>
                <span className="font-bold text-slate-700 text-sm">
                  ฿{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 bg-slate-50 border-t border-slate-200">
        <div className="space-y-2 text-sm mb-6">
          <div className="flex justify-between text-slate-500">
            <span>Subtotal</span>
            <span>฿{subtotal.toFixed(2)}</span>
          </div>
          {TAX_RATE > 0 && (
            <div className="flex justify-between text-slate-500">
              <span>VAT ({(TAX_RATE * 100).toFixed(0)}%)</span>
              <span>฿{tax.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-xl font-black text-slate-800 pt-2 border-t border-slate-200">
            <span>Total</span>
            <span>฿{total.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={onCheckout}
          className="w-full bg-black hover:bg-slate-800 text-yellow-400 font-bold py-4 rounded-lg shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 uppercase tracking-wide border-2 border-yellow-400"
        >
          <CreditCard size={20} />
          Pay ฿{total.toFixed(2)}
        </button>
      </div>
    </div>
  );
};