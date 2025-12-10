import React from 'react';
import { LayoutGrid, ShoppingBag, PieChart } from 'lucide-react';

interface NavbarProps {
  currentView: 'POS' | 'DASHBOARD';
  setView: (view: 'POS' | 'DASHBOARD') => void;
  cartCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setView, cartCount }) => {
  return (
    <nav className="h-16 bg-yellow-400 border-b border-yellow-500 flex items-center justify-between px-6 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-3">
        {/* Logo Text Only */}
        <span className="text-2xl font-black italic tracking-tighter text-slate-900 uppercase" style={{ fontFamily: 'Impact, sans-serif', transform: 'skewX(-5deg)' }}>
          LarngDuan
        </span>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setView('POS')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
            currentView === 'POS'
              ? 'bg-black text-yellow-400 font-bold shadow-lg transform scale-105'
              : 'text-slate-900 hover:bg-black/5 font-semibold'
          }`}
        >
          <LayoutGrid size={20} />
          <span>Services</span>
          {cartCount > 0 && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
              currentView === 'POS' ? 'bg-yellow-400 text-black' : 'bg-black text-yellow-400'
            }`}>
              {cartCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setView('DASHBOARD')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
            currentView === 'DASHBOARD'
              ? 'bg-black text-yellow-400 font-bold shadow-lg transform scale-105'
              : 'text-slate-900 hover:bg-black/5 font-semibold'
          }`}
        >
          <PieChart size={20} />
          <span>Stats</span>
        </button>
      </div>
    </nav>
  );
};