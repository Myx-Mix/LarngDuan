import React, { useState, useRef } from 'react';
import { Transaction } from '../types';
import { generateSalesInsight } from '../services/geminiService';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Sparkles, ShoppingBag, TrendingUp, History, ChevronLeft, ChevronRight, Calendar, ArrowUpRight, ArrowDownRight, Loader2, MousePointerClick } from 'lucide-react';
import { SalesDetailModal } from './SalesDetailModal';

interface DashboardProps {
  transactions: Transaction[];
}

export const Dashboard: React.FC<DashboardProps> = ({ transactions }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Detail Modal State
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // --- Carousel Logic ---
  const slides = ['Weekly', 'Monthly', 'Yearly'] as const;
  
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  
  // Touch/Swipe handlers
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) nextSlide();
    if (isRightSwipe) prevSlide();

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // --- Sales Metrics Calculation ---
  const getSalesData = (period: string) => {
    const now = new Date();
    const startOfPeriod = new Date();
    
    // Mock "Last Year" data constant to show YoY functionality
    let previousYearSales = 0; 
    let label = "";

    if (period === 'Weekly') {
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
      startOfPeriod.setDate(diff);
      startOfPeriod.setHours(0, 0, 0, 0);
      previousYearSales = 15000; 
      label = "vs same week last year";
    } else if (period === 'Monthly') {
      startOfPeriod.setDate(1);
      startOfPeriod.setHours(0, 0, 0, 0);
      previousYearSales = 65000;
      label = "vs same month last year";
    } else {
      startOfPeriod.setMonth(0, 1);
      startOfPeriod.setHours(0, 0, 0, 0);
      previousYearSales = 800000;
      label = "vs last year";
    }

    const currentSales = transactions
      .filter(t => t.timestamp >= startOfPeriod.getTime())
      .reduce((sum, t) => sum + t.total, 0);

    const percentage = previousYearSales === 0 
      ? 100 
      : ((currentSales - previousYearSales) / previousYearSales) * 100;

    return { currentSales, percentage, label };
  };

  const currentMetric = getSalesData(slides[currentSlide]);

  // --- General Metrics ---
  const totalRevenue = transactions.reduce((sum, t) => sum + t.total, 0);
  const itemsSold = transactions.reduce((sum, t) => sum + t.items.reduce((is, i) => is + i.quantity, 0), 0);
  const avgOrderValue = transactions.length > 0 ? totalRevenue / transactions.length : 0;

  // --- Chart Data (By Product Name now, since Category is all 'Wash') ---
  const productSales: Record<string, number> = {};
  transactions.forEach(t => {
    t.items.forEach(i => {
      // Group by Product Name instead of Category
      productSales[i.name] = (productSales[i.name] || 0) + (i.price * i.quantity);
    });
  });
  
  const chartData = Object.keys(productSales).map(key => ({
    name: key.replace('Size ', ''), // Shorten name for chart x-axis
    sales: productSales[key]
  })).sort((a, b) => b.sales - a.sales); // Sort by highest sales

  const handleGenerateInsight = async () => {
    setLoadingInsight(true);
    setInsight(null);
    // Limit to last 50 transactions for AI context window efficiency
    const recentTransactions = transactions.slice(-50);
    const result = await generateSalesInsight(recentTransactions);
    setInsight(result);
    setLoadingInsight(false);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h2 className="text-4xl font-black italic text-slate-900 tracking-tighter uppercase" style={{fontFamily: 'Impact, sans-serif', transform: 'skewX(-5deg)'}}>
            Dashboard
          </h2>
          <p className="text-slate-500 mt-1 font-medium">Performance Overview</p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={handleGenerateInsight}
            disabled={loadingInsight || transactions.length === 0}
            className="flex items-center gap-2 bg-black text-yellow-400 border-2 border-yellow-400 px-5 py-2.5 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase font-bold tracking-wide text-sm"
          >
            {loadingInsight ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Sparkles size={18} />
            )}
            <span>{loadingInsight ? 'Analyzing...' : 'AI Insights'}</span>
          </button>
        </div>
      </div>

      {insight && (
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 p-6 rounded-2xl animate-in fade-in slide-in-from-top-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
             <Sparkles size={120} className="text-yellow-600" />
          </div>
          <div className="flex items-start gap-4 relative z-10">
            <div className="bg-yellow-400 p-2 rounded-lg shadow-sm text-black">
               <Sparkles size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-2">Gemini Analysis</h3>
              <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">{insight}</p>
            </div>
          </div>
        </div>
      )}

      {/* Swipeable Sales Carousel */}
      <div className="relative group">
        <div 
          className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-200 cursor-pointer hover:shadow-yellow-400/20 transition-all hover:-translate-y-1 active:scale-[0.99]"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onClick={() => setIsDetailModalOpen(true)}
        >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400 rounded-full blur-[100px] opacity-20 -mr-16 -mt-16 pointer-events-none"></div>

            <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full w-fit backdrop-blur-md">
                        <Calendar size={16} className="text-yellow-400" />
                        <span className="text-sm font-semibold tracking-wide uppercase text-yellow-100">{slides[currentSlide]} Overview</span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                       <span className="text-xs text-yellow-400 font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                          <MousePointerClick size={14} />
                          Click to View
                       </span>
                       {/* Navigation Dots */}
                       <div className="flex gap-2">
                           {slides.map((_, idx) => (
                               <div
                                   key={idx}
                                   className={`w-2 h-2 rounded-full transition-all ${currentSlide === idx ? 'bg-yellow-400 w-6' : 'bg-white/30'}`}
                               />
                           ))}
                       </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-end gap-4 animate-in fade-in slide-in-from-right-4 duration-300" key={currentSlide}>
                    <div>
                        <div className="text-slate-400 text-sm font-medium mb-1 uppercase tracking-wider">Total Sales</div>
                        <div className="text-5xl md:text-6xl font-black tracking-tight text-white">
                            ฿{currentMetric.currentSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                    </div>

                    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl backdrop-blur-md border ${
                        currentMetric.percentage >= 0 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                            : 'bg-red-500/10 border-red-500/20 text-red-400'
                    }`}>
                        {currentMetric.percentage >= 0 ? <ArrowUpRight size={24} /> : <ArrowDownRight size={24} />}
                        <div>
                            <div className="text-2xl font-bold leading-none">
                                {Math.abs(currentMetric.percentage).toFixed(1)}%
                            </div>
                            <div className="text-xs opacity-80 font-medium">
                                {currentMetric.label}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop Navigation Arrows (stopPropagation to prevent opening modal when clicking arrows) */}
            <button 
                onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 hidden md:block z-20"
            >
                <ChevronLeft size={24} />
            </button>
            <button 
                onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 hidden md:block z-20"
            >
                <ChevronRight size={24} />
            </button>
        </div>
      </div>

      {/* Sales Detail Modal */}
      <SalesDetailModal 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)} 
        type={slides[currentSlide]}
        transactions={transactions}
      />

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Orders" 
          value={transactions.length.toString()} 
          icon={<ShoppingBag className="text-blue-500" />} 
          subtext="Lifetime volume"
        />
        <StatCard 
          title="Avg. Order Value" 
          value={`฿${avgOrderValue.toFixed(2)}`} 
          icon={<TrendingUp className="text-purple-500" />} 
          subtext="Per transaction"
        />
        <StatCard 
          title="Services Performed" 
          value={itemsSold.toString()} 
          icon={<Sparkles className="text-yellow-500" />} 
          subtext="Total items sold"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-96">
        {/* Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="font-bold text-slate-800 mb-6 uppercase tracking-wide text-sm">Sales by Product</h3>
          <div className="flex-1 w-full min-h-0">
             <ResponsiveContainer width="100%" height="100%" key={transactions.length}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 500}} dy={10} interval={0} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} tickFormatter={(value) => `฿${value}`} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px'}} 
                  formatter={(value: number) => [`฿${value.toFixed(2)}`, 'Sales']}
                />
                <Bar dataKey="sales" fill="#1e293b" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions List */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 uppercase tracking-wide text-sm">
            <History size={18} className="text-slate-400" />
            Recent Activity
          </h3>
          <div className="overflow-y-auto flex-1 pr-2 space-y-3 custom-scrollbar">
            {transactions.slice().reverse().slice(0, 100).map((t) => (
              <div key={t.id} className="flex justify-between items-center p-4 hover:bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all group">
                <div>
                   <div className="text-sm font-bold text-slate-900 group-hover:text-yellow-600 transition-colors">Order #{t.id.slice(-5)}</div>
                   <div className="text-xs text-slate-500 font-medium">{new Date(t.timestamp).toLocaleDateString()} {new Date(t.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                </div>
                <div className="text-right">
                   <div className="text-sm font-black text-slate-900">฿{t.total.toFixed(2)}</div>
                   <div className="text-xs text-slate-400 font-medium">{t.items.length} items</div>
                </div>
              </div>
            ))}
            {transactions.length === 0 && (
               <div className="flex flex-col items-center justify-center h-full text-slate-400 pb-8">
                  <div className="bg-slate-50 p-4 rounded-full mb-3">
                     <History size={32} className="opacity-50" />
                  </div>
                  <p className="font-medium">No transactions yet</p>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{title: string, value: string, icon: React.ReactNode, subtext?: string}> = ({title, value, icon, subtext}) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all group">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-yellow-50 transition-colors">{icon}</div>
    </div>
    <div className="text-3xl font-black text-slate-900 mb-1">{value}</div>
    <div className="text-sm text-slate-500 font-bold uppercase tracking-wide">{title}</div>
    {subtext && <div className="text-xs text-slate-400 mt-2 font-medium">{subtext}</div>}
  </div>
);
