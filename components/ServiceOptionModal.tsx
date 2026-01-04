import React, { useState, useEffect } from 'react';
import { X, Check, Sparkles, Layers } from 'lucide-react';
import { Product } from '../types';

interface ServiceOptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
    onConfirm: (product: Product, option: 'standard' | 'deep_clean' | 'full_set', priceAdjustment: number, nameSuffix: string) => void;
}

export const ServiceOptionModal: React.FC<ServiceOptionModalProps> = ({
    isOpen,
    onClose,
    product,
    onConfirm
}) => {
    const [selectedOption, setSelectedOption] = useState<'standard' | 'deep_clean' | 'full_set'>('standard');

    useEffect(() => {
        if (isOpen) {
            setSelectedOption('standard');
        }
    }, [isOpen]);

    if (!isOpen || !product) return null;

    // Pricing Logic
    let deepCleanPrice = 0;
    let fullSetPrice = 0;

    // Determine car size from ID (w-s, w-m, w-xl, w-xxl, w-xxx)
    // or Name if IDs change. IDs are safer based on constants.ts.
    const id = product.id.toLowerCase();

    if (id === 'w-s' || id === 'w-m') {
        deepCleanPrice = 30;
        fullSetPrice = 50;
    } else if (id === 'w-xl') {
        deepCleanPrice = 40;
        fullSetPrice = 70;
    } else if (id === 'w-xxl' || id === 'w-xxx') {
        // Assuming XXX follows XXL rules as per "every car size" + logical progression/grouping
        deepCleanPrice = 50;
        fullSetPrice = 80;
    } else {
        // Fallback default
        deepCleanPrice = 30;
        fullSetPrice = 50;
    }

    const handleConfirm = () => {
        let priceAdjustment = 0;
        let nameSuffix = '';

        if (selectedOption === 'deep_clean') {
            priceAdjustment = deepCleanPrice;
            nameSuffix = ' + Deepclean/Polish';
        } else if (selectedOption === 'full_set') {
            priceAdjustment = fullSetPrice;
            nameSuffix = ' + Fullset';
        }

        onConfirm(product, selectedOption, priceAdjustment, nameSuffix);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col overflow-hidden">

                {/* Header */}
                <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold">Select Service Level</h2>
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">
                            For {product.name}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Options */}
                <div className="p-6 flex flex-col gap-4">

                    {/* Standard */}
                    <button
                        onClick={() => setSelectedOption('standard')}
                        className={`relative p-4 rounded-xl border-2 transition-all flex items-center gap-4 text-left ${selectedOption === 'standard'
                                ? 'border-yellow-400 bg-yellow-50/50 ring-1 ring-yellow-400'
                                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                    >
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedOption === 'standard' ? 'border-yellow-500 bg-yellow-400' : 'border-slate-300'
                            }`}>
                            {selectedOption === 'standard' && <Check size={14} className="text-black" />}
                        </div>
                        <div className="flex-1">
                            <div className="font-bold text-slate-900">Standard Wash</div>
                            <div className="text-sm text-slate-500">Regular exterior & interior wash</div>
                        </div>
                        <div className="text-lg font-black text-slate-900">
                            ฿{product.price.toFixed(0)}
                        </div>
                    </button>

                    {/* Deep Clean / Polish */}
                    <button
                        onClick={() => setSelectedOption('deep_clean')}
                        className={`relative p-4 rounded-xl border-2 transition-all flex items-center gap-4 text-left ${selectedOption === 'deep_clean'
                                ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500'
                                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                    >
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedOption === 'deep_clean' ? 'border-blue-600 bg-blue-500' : 'border-slate-300'
                            }`}>
                            {selectedOption === 'deep_clean' && <Check size={14} className="text-white" />}
                        </div>
                        <div className="flex-1">
                            <div className="font-bold text-slate-900 flex items-center gap-2">
                                Deep Clean / Polish
                                <Sparkles size={16} className="text-blue-500" />
                            </div>
                            <div className="text-sm text-slate-500">Enhanced cleaning & polishing</div>
                        </div>
                        <div className="text-right">
                            <div className="text-lg font-black text-slate-900">
                                ฿{(product.price + deepCleanPrice).toFixed(0)}
                            </div>
                            <div className="text-xs font-bold text-blue-600">
                                (+฿{deepCleanPrice})
                            </div>
                        </div>
                    </button>

                    {/* Full Set */}
                    <button
                        onClick={() => setSelectedOption('full_set')}
                        className={`relative p-4 rounded-xl border-2 transition-all flex items-center gap-4 text-left ${selectedOption === 'full_set'
                                ? 'border-purple-500 bg-purple-50/50 ring-1 ring-purple-500'
                                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                    >
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedOption === 'full_set' ? 'border-purple-600 bg-purple-500' : 'border-slate-300'
                            }`}>
                            {selectedOption === 'full_set' && <Check size={14} className="text-white" />}
                        </div>
                        <div className="flex-1">
                            <div className="font-bold text-slate-900 flex items-center gap-2">
                                Full Set
                                <Layers size={16} className="text-purple-500" />
                            </div>
                            <div className="text-sm text-slate-500">Maximum care package</div>
                        </div>
                        <div className="text-right">
                            <div className="text-lg font-black text-slate-900">
                                ฿{(product.price + fullSetPrice).toFixed(0)}
                            </div>
                            <div className="text-xs font-bold text-purple-600">
                                (+฿{fullSetPrice})
                            </div>
                        </div>
                    </button>

                </div>

                {/* Footer */}
                <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
                    <button
                        onClick={handleConfirm}
                        className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-transform active:scale-95 flex items-center gap-2"
                    >
                        Add to Order
                    </button>
                </div>

            </div>
        </div>
    );
};
