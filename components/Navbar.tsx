import React from 'react';
import { LayoutGrid, ShoppingBag, PieChart } from 'lucide-react';

interface NavbarProps {
  currentView: 'POS' | 'DASHBOARD';
  setView: (view: 'POS' | 'DASHBOARD') => void;
  cartCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setView, cartCount }) => {
  return (
    <nav className="h-14 md:h-16 bg-yellow-400 border-b border-yellow-500 flex items-center justify-between px-3 md:px-6 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-3">
        {/* Logo Text Only */}
        <span className="text-xl md:text-2xl font-black italic tracking-tighter text-slate-900 uppercase" style={{ fontFamily: 'Impact, sans-serif', transform: 'skewX(-5deg)' }}>
          LarngDuan
        </span>
      </div>

      <div className="flex gap-2 md:gap-4">
        <button
          onClick={() => setView('POS')}
          className={`flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl transition-all ${currentView === 'POS'
              ? 'bg-black text-yellow-400 font-bold shadow-lg transform scale-105'
              : 'text-slate-900 hover:bg-black/5 font-semibold'
            }`}
        >
          <LayoutGrid size={18} className="md:w-5 md:h-5" />
          <span className="text-sm md:text-base">Services</span>
          {cartCount > 0 && (
            <span className={`text-[10px] md:text-xs px-1.5 py-0.5 rounded-full font-bold ${currentView === 'POS' ? 'bg-yellow-400 text-black' : 'bg-black text-yellow-400'
              }`}>
              {cartCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setView('DASHBOARD')}
          className={`flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl transition-all ${currentView === 'DASHBOARD'
              ? 'bg-black text-yellow-400 font-bold shadow-lg transform scale-105'
              : 'text-slate-900 hover:bg-black/5 font-semibold'
            }`}
        >
          <PieChart size={18} className="md:w-5 md:h-5" />
          <span className="text-sm md:text-base">Stats</span>
        </button>
      </div>
    </nav>
  );
};