import React, { useState, useEffect } from 'react';
import { Product, CartItem, Transaction } from './types';
import { MOCK_PRODUCTS, TAX_RATE } from './constants';
import { Navbar } from './components/Navbar';
import { ProductList } from './components/ProductList';
import { CartSidebar } from './components/CartSidebar';
import { PaymentModal } from './components/PaymentModal';
import { Dashboard } from './components/Dashboard';
import { AddEditProductModal } from './components/AddEditProductModal';
import { recordTransactionToSheet } from './services/sheetsService';
import { Plus } from 'lucide-react';

export default function App() {
  // --- State ---
  const [currentView, setCurrentView] = useState<'POS' | 'DASHBOARD'>('POS');

  // Data State
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  // --- Initialize Data on Load ---
  useEffect(() => {
    // Generate mock data representing 1 year of sales history
    const data: Transaction[] = [];
    const today = new Date();
    const startDate = new Date();
    startDate.setFullYear(today.getFullYear() - 1);

    let loopDate = new Date(startDate);
    let dayIndex = 0;

    while (loopDate <= today) {
      const month = loopDate.getMonth(); // 0 = Jan, 11 = Dec
      const dayOfWeek = loopDate.getDay(); // 0 = Sun, 6 = Sat

      let dailyBaseOrders = 0;

      if (month >= 5 && month <= 9) {
        dailyBaseOrders = 3 + Math.random() * 5;
      } else if (month >= 10 || month <= 1) {
        dailyBaseOrders = 10 + Math.random() * 10;
      } else {
        dailyBaseOrders = 6 + Math.random() * 6;
      }

      if (dayOfWeek === 0 || dayOfWeek === 6 || dayOfWeek === 5) {
        dailyBaseOrders *= 1.5;
      }

      const orderCount = Math.floor(dailyBaseOrders);

      for (let i = 0; i < orderCount; i++) {
        const itemCount = Math.random() > 0.8 ? 2 : 1;
        const items: CartItem[] = [];

        for (let j = 0; j < itemCount; j++) {
          const product = MOCK_PRODUCTS[Math.floor(Math.random() * MOCK_PRODUCTS.length)];
          items.push({ ...product, quantity: 1 });
        }

        const subtotal = items.reduce((sum, item) => sum + item.price, 0);
        const total = subtotal;

        const time = new Date(loopDate);
        time.setHours(8 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 60));

        data.push({
          id: `sim-${dayIndex}-${i}-${Math.random().toString(36).substr(2, 5)}`,
          items,
          subtotal,
          tax: 0,
          total,
          tendered: total,
          change: 0,
          timestamp: time.getTime(),
          paymentMethod: 'CASH',
        });
      }

      loopDate.setDate(loopDate.getDate() + 1);
      dayIndex++;
    }

    data.sort((a, b) => a.timestamp - b.timestamp);
    setTransactions(data);
  }, []);

  // --- Product Management Logic ---
  const handleAddProduct = () => {
    setProductToEdit(null);
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setProductToEdit(product);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (product: Product) => {
    setProducts(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        return prev.map(p => p.id === product.id ? product : p);
      }
      return [...prev, product];
    });
    setIsProductModalOpen(false);
    setProductToEdit(null);
  };

  // --- Cart Logic ---
  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity + delta };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // --- Checkout Logic ---
  const calculateTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = subtotal + (subtotal * TAX_RATE);
    return Math.round(total * 100) / 100;
  };

  const handleInitiateCheckout = () => {
    setIsPaymentModalOpen(true);
  };

  const handleCompleteTransaction = (tendered: number, change: number, paymentMethod: 'CASH' | 'QR') => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * TAX_RATE;
    const totalRaw = subtotal + tax;
    const total = Math.round(totalRaw * 100) / 100;

    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      items: [...cart],
      subtotal,
      tax,
      total,
      tendered,
      change,
      timestamp: Date.now(),
      paymentMethod,
    };

    setTransactions((prev) => [...prev, newTransaction]);
    setCart([]);
    setIsPaymentModalOpen(false);

    recordTransactionToSheet(newTransaction);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar
        currentView={currentView}
        setView={setCurrentView}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
      />

      <main className="flex-1 flex overflow-hidden">
        {currentView === 'POS' ? (
          <div className="flex w-full h-[calc(100vh-64px)]">
            {/* Left: Product Grid */}
            <div className="flex-1 overflow-hidden bg-slate-50 relative group">
              <div className="absolute inset-0 overflow-y-auto">
                <ProductList
                  products={products}
                  onAddToCart={handleAddToCart}
                  onEditProduct={handleEditProduct}
                />
              </div>
              {/* Floating Add Button - Positioned absolute relative to this container */}
              <button
                onClick={handleAddProduct}
                className="absolute bottom-8 right-8 z-30 w-16 h-16 bg-black text-yellow-400 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform hover:shadow-yellow-400/20 border-4 border-yellow-400"
                title="Add Custom Product"
              >
                <Plus size={32} strokeWidth={3} />
              </button>
            </div>

            {/* Right: Cart Sidebar */}
            <div className="w-96 h-full flex-shrink-0">
              <CartSidebar
                cart={cart}
                updateQuantity={handleUpdateQuantity}
                removeFromCart={handleRemoveFromCart}
                clearCart={handleClearCart}
                onCheckout={handleInitiateCheckout}
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <Dashboard
              transactions={transactions}
            />
          </div>
        )}
      </main>

      {/* Modals */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        total={calculateTotal()}
        onComplete={handleCompleteTransaction}
      />

      <AddEditProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleSaveProduct}
        editingProduct={productToEdit}
      />
    </div>
  );
}