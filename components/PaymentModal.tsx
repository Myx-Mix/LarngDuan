import React, { useState, useEffect } from 'react';
import { X, CheckCircle, DollarSign, Wallet, Smartphone } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  onComplete: (tendered: number, change: number, paymentMethod: 'CASH' | 'QR') => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  total,
  onComplete,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'QR'>('CASH');
  const [tendered, setTendered] = useState<string>('');
  const [change, setChange] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setPaymentMethod('CASH');
      setTendered('');
      setChange(null);
    }
  }, [isOpen]);

  // Auto-fill exact amount when QR is selected
  useEffect(() => {
    if (paymentMethod === 'QR') {
      setTendered(total.toString());
    }
  }, [paymentMethod, total]);

  const numericTendered = parseFloat(tendered);
  const isValid = !isNaN(numericTendered) && numericTendered >= total;

  useEffect(() => {
    if (!isNaN(numericTendered)) {
      setChange(numericTendered - total);
    } else {
      setChange(null);
    }
  }, [numericTendered, total]);

  const handleQuickAmount = (amount: number) => {
    setTendered(amount.toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid && change !== null) {
      onComplete(numericTendered, change, paymentMethod);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-bold text-lg text-slate-800">Complete Payment</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="text-center">
            <p className="text-slate-500 text-sm mb-1">Total Amount Due</p>
            <div className="text-4xl font-black text-slate-900">
              ฿{total.toFixed(2)}
            </div>
          </div>

          {/* Payment Method Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('CASH')}
                className={`py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${paymentMethod === 'CASH'
                  ? 'bg-emerald-500 text-white shadow-lg transform scale-105'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
              >
                <Wallet size={20} />
                Cash
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('QR')}
                className={`py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${paymentMethod === 'QR'
                  ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
              >
                <Smartphone size={20} />
                QR Code
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {paymentMethod === 'CASH' ? 'Cash Tendered' : 'Amount (Auto-filled)'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-slate-400 font-bold text-lg">฿</span>
              </div>
              <input
                type="number"
                step="0.01"
                value={tendered}
                onChange={(e) => setTendered(e.target.value)}
                disabled={paymentMethod === 'QR'}
                className={`block w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-lg font-semibold ${paymentMethod === 'QR' ? 'bg-slate-100 cursor-not-allowed' : ''
                  }`}
                placeholder="0.00"
                autoFocus={paymentMethod === 'CASH'}
              />
            </div>
          </div>

          {/* Quick Cash Suggestions (Thai Baht: 100, 500, 1000) - Only show for CASH */}
          {paymentMethod === 'CASH' && (
            <div className="grid grid-cols-4 gap-2">
              {[100, 500, 1000].map((amt) => {
                if (amt < total && amt !== 1000) return null; // Logic to hide smaller bills if total is large
                return (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleQuickAmount(amt)}
                    className="py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-md transition-colors"
                  >
                    ฿{amt}
                  </button>
                )
              })}
              <button
                type="button"
                onClick={() => handleQuickAmount(Math.ceil(total))}
                className="py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-md transition-colors"
              >
                Exact
              </button>
            </div>
          )}

          <div className={`p-4 rounded-lg transition-all ${change !== null && change >= 0 ? 'bg-emerald-50 border border-emerald-100' : 'bg-slate-50 border border-slate-100'
            }`}>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 font-medium">Change Due:</span>
              <span className={`text-xl font-bold ${change !== null && change >= 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                {change !== null && change >= 0 ? `฿${change.toFixed(2)}` : '--'}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={!isValid}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${isValid
              ? 'bg-black hover:bg-slate-800 text-yellow-400 border-2 border-yellow-400 shadow-lg transform hover:-translate-y-0.5'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
          >
            <CheckCircle size={20} />
            Finalize Transaction
          </button>
        </form>
      </div>
    </div>
  );
};