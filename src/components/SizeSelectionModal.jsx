import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { extractOptionValues } from '../lib/shopify';

const SizeSelectionModal = ({ isOpen, onClose, items, onConfirm }) => {
    const [selections, setSelections] = useState({});

    useEffect(() => {
        if (isOpen) {
            // Initialize selections for incoming items
            const initial = {};
            items.forEach(item => {
                const sizes = extractOptionValues(item, 'Size');
                if (sizes.length > 0) {
                    initial[item.handle] = sizes[0];
                }
            });
            setSelections(initial);
        }
    }, [isOpen, items]);

    if (!isOpen) return null;

    const handleSelection = (handle, size) => {
        setSelections(prev => ({ ...prev, [handle]: size }));
    };

    const handleConfirm = () => {
        const finalItems = items.map(item => ({
            handle: item.handle,
            size: selections[item.handle] || null,
            quantity: 1
        }));
        onConfirm(finalItems);
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Select Options</h2>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                <div className="p-4 max-h-[60vh] overflow-y-auto space-y-6">
                    {items.map(item => {
                        const sizes = extractOptionValues(item, 'Size');
                        const hasSizes = sizes.length > 0;
                        const currentSize = selections[item.handle];

                        return (
                            <div key={item.handle} className="space-y-2">
                                <p className="font-semibold text-gray-900">{item.title}</p>
                                {hasSizes ? (
                                    <div className="flex flex-wrap gap-2">
                                        {sizes.map(size => (
                                            <button
                                                key={size}
                                                onClick={() => handleSelection(item.handle, size)}
                                                className={`min-w-[40px] h-10 px-3 border rounded text-sm font-medium transition-all ${currentSize === size
                                                        ? 'border-black bg-black text-white'
                                                        : 'border-gray-200 text-gray-700 hover:border-black'
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">One Size</p>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50">
                    <button
                        onClick={handleConfirm}
                        className="w-full bg-[#1a1a2e] text-white font-bold text-sm py-4 uppercase tracking-widest hover:bg-gray-900 transition-colors rounded-sm"
                    >
                        Confirm and Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SizeSelectionModal;
