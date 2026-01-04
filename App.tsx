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
import { Plus, ChevronUp, ChevronDown } from 'lucide-react';

import { ServiceOptionModal } from './components/ServiceOptionModal';

export default function App() {
  // --- State ---
  const [currentView, setCurrentView] = useState<'POS' | 'DASHBOARD'>('POS');
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

  // Data State
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [serviceModal, setServiceModal] = useState<{ isOpen: boolean; product: Product | null }>({
    isOpen: false,
    product: null
  });

  // --- Initialize Data on Load ---
  useEffect(() => {
    // Start with empty transactions
    setTransactions([]);
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

  // Intercept click to show options
  const handleProductClick = (product: Product) => {
    setServiceModal({ isOpen: true, product });
  };

  const handleServiceConfirm = (
    product: Product,
    option: 'standard' | 'deep_clean' | 'full_set',
    priceAdjustment: number,
    nameSuffix: string
  ) => {
    // Create a unique ID for the variant if it's not standard
    // e.g. w-xl-deep_clean
    const variantId = option === 'standard' ? product.id : `${product.id}-${option}`;

    const productVariant: Product = {
      ...product,
      id: variantId,
      name: product.name + nameSuffix,
      price: product.price + priceAdjustment
    };

    addToCart(productVariant);
  };

  const addToCart = (product: Product) => {
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
          <div className="flex w-full h-[calc(100vh-64px)] relative">
            {/* Left: Product Grid */}
            <div className="flex-1 h-full overflow-hidden bg-slate-50 relative group">
              <div className="absolute inset-0 overflow-y-auto pb-24 md:pb-0">
                <ProductList
                  products={products}
                  onAddToCart={handleProductClick}
                  onEditProduct={handleEditProduct}
                />
              </div>
              {/* Floating Add Button - Positioned absolute relative to this container */}
              <button
                onClick={handleAddProduct}
                className="absolute bottom-24 right-4 md:bottom-8 md:right-8 z-30 w-14 h-14 md:w-16 md:h-16 bg-black text-yellow-400 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform hover:shadow-yellow-400/20 border-4 border-yellow-400"
                title="Add Custom Product"
              >
                <Plus size={32} strokeWidth={3} />
              </button>
            </div>

            {/* Desktop: Cart Sidebar */}
            <div className="hidden md:flex w-96 h-full flex-shrink-0 border-l border-slate-200">
              <CartSidebar
                cart={cart}
                updateQuantity={handleUpdateQuantity}
                removeFromCart={handleRemoveFromCart}
                clearCart={handleClearCart}
                onCheckout={handleInitiateCheckout}
              />
            </div>

            {/* Mobile: Cart Latch/BottomSheet */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.15)] rounded-t-2xl transition-all duration-300 ease-in-out flex flex-col"
              style={{ height: isMobileCartOpen ? '85vh' : 'auto' }}
            >
              {/* Latch Header */}
              <button
                onClick={() => setIsMobileCartOpen(!isMobileCartOpen)}
                className="w-full bg-slate-900 text-white p-4 flex items-center justify-between rounded-t-2xl active:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="bg-yellow-400 text-black font-bold rounded-full w-8 h-8 flex items-center justify-center">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)}
                    </div>
                  </div>
                  <span className="font-bold text-lg">Current Order</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-bold text-xl text-yellow-400">฿{calculateTotal().toFixed(2)}</span>
                  {isMobileCartOpen ? <ChevronDown className="text-slate-400" /> : <ChevronUp className="text-slate-400" />}
                </div>
              </button>

              {/* Cart Content (Visible when expanded) */}
              <div className="flex-1 overflow-hidden bg-white">
                {isMobileCartOpen && (
                  <CartSidebar
                    cart={cart}
                    updateQuantity={handleUpdateQuantity}
                    removeFromCart={handleRemoveFromCart}
                    clearCart={handleClearCart}
                    onCheckout={() => {
                      handleInitiateCheckout();
                      setIsMobileCartOpen(false);
                    }}
                  />
                )}
              </div>
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
      <ServiceOptionModal
        isOpen={serviceModal.isOpen}
        onClose={() => setServiceModal({ ...serviceModal, isOpen: false })}
        product={serviceModal.product}
        onConfirm={handleServiceConfirm}
      />

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