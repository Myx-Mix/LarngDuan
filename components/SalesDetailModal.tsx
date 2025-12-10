import React, { useState, useMemo, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Transaction } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

interface SalesDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'Weekly' | 'Monthly' | 'Yearly';
  transactions: Transaction[];
}

export const SalesDetailModal: React.FC<SalesDetailModalProps> = ({ 
  isOpen, 
  onClose, 
  type, 
  transactions 
}) => {
  const [offset, setOffset] = useState(0);

  // Reset offset when modal opens or type changes
  useEffect(() => {
    if (isOpen) setOffset(0);
  }, [isOpen, type]);

  const chartData = useMemo(() => {
    const data: { label: string; value: number }[] = [];
    const now = new Date();
    let title = "";

    if (type === 'Weekly') {
      const currentDay = now.getDay(); // 0=Sun, 1=Mon
      const daysToMonday = currentDay === 0 ? 6 : currentDay - 1;
      
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - daysToMonday + (offset * 7));
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      title = `${startOfWeek.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;

      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const dayBuckets = days.map(d => ({ label: d, value: 0 }));

      transactions.forEach(t => {
        if (t.timestamp >= startOfWeek.getTime() && t.timestamp <= endOfWeek.getTime()) {
          const date = new Date(t.timestamp);
          let dayIndex = date.getDay() - 1; 
          if (dayIndex === -1) dayIndex = 6; 
          if (dayBuckets[dayIndex]) {
            dayBuckets[dayIndex].value += t.total;
          }
        }
      });
      return { data: dayBuckets, title };

    } else if (type === 'Monthly') {
      const targetDate = new Date(now.getFullYear(), now.getMonth() + offset, 1);
      const year = targetDate.getFullYear();
      const month = targetDate.getMonth();
      
      title = targetDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

      const weekBuckets = [
        { label: 'Week 1', value: 0 },
        { label: 'Week 2', value: 0 },
        { label: 'Week 3', value: 0 },
        { label: 'Week 4+', value: 0 },
      ];

      transactions.forEach(t => {
        const d = new Date(t.timestamp);
        if (d.getFullYear() === year && d.getMonth() === month) {
          const date = d.getDate();
          if (date <= 7) weekBuckets[0].value += t.total;
          else if (date <= 14) weekBuckets[1].value += t.total;
          else if (date <= 21) weekBuckets[2].value += t.total;
          else weekBuckets[3].value += t.total;
        }
      });
      return { data: weekBuckets, title };

    } else { // Yearly
      const targetYear = now.getFullYear() + offset;
      title = targetYear.toString();

      const monthBuckets = Array.from({ length: 12 }, (_, i) => ({
        label: new Date(2000, i, 1).toLocaleDateString(undefined, { month: 'short' }),
        value: 0
      }));

      transactions.forEach(t => {
        const d = new Date(t.timestamp);
        if (d.getFullYear() === targetYear) {
          monthBuckets[d.getMonth()].value += t.total;
        }
      });
      return { data: monthBuckets, title };
    }
  }, [type, offset, transactions]);

  const canGoBack = type === 'Weekly' ? offset > -3 : true;
  const canGoForward = offset < 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex justify-between items-center shrink-0">
          <div>
            <div className="flex items-center gap-2 text-yellow-400 font-bold uppercase tracking-wider text-sm mb-1">
              <Calendar size={16} />
              {type} Overview
            </div>
            <h2 className="text-2xl font-black italic">{chartData.title}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation & Controls */}
        <div className="bg-slate-50 border-b border-slate-200 p-4 flex justify-between items-center shrink-0">
          <button 
            onClick={() => canGoBack && setOffset(prev => prev - 1)}
            disabled={!canGoBack}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-slate-700"
          >
            <ChevronLeft size={20} />
            Previous
          </button>
          
          <div className="font-bold text-slate-800 text-lg">
             Total: ฿{chartData.data.reduce((acc, curr) => acc + curr.value, 0).toLocaleString()}
          </div>

          <button 
            onClick={() => canGoForward && setOffset(prev => prev + 1)}
            disabled={!canGoForward}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-slate-700"
          >
            Next
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Chart Area - Fixed Height to ensure rendering */}
        <div className="p-6 h-[400px] w-full bg-white">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData.data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="label" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} 
                dy={10} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#64748b', fontSize: 12}} 
                tickFormatter={(val) => `฿${val}`}
                width={80}
              />
              <Tooltip 
                cursor={{fill: '#f1f5f9'}}
                contentStyle={{
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  padding: '12px',
                  backgroundColor: '#1e293b',
                  color: '#fff'
                }}
                itemStyle={{color: '#facc15'}}
                formatter={(value: number) => [`฿${value.toLocaleString()}`, 'Sales']}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={60}>
                {chartData.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.value > 0 ? '#fbbf24' : '#cbd5e1'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="p-4 bg-slate-50 text-center text-xs text-slate-400 shrink-0">
           Click outside or 'X' to close.
        </div>

      </div>
    </div>
  );
};