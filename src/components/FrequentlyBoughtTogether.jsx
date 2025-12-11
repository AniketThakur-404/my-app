import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { formatMoney } from '../lib/shopify';
import { useCart } from '../contexts/cart-context';

/**
 * FrequentlyBoughtTogether - Professional section for related products
 * @param {Object} props
 * @param {Array} props.products - Array of product objects from same collection
 * @param {Function} props.openCartDrawer - Callback to open cart drawer after adding items
 */
const FrequentlyBoughtTogether = ({ products = [], openCartDrawer }) => {
    const { addItem } = useCart();

    // Track selected products by handle
    const [selectedHandles, setSelectedHandles] = useState(() =>
        new Set(products.slice(0, 3).map(p => p.handle)) // Pre-select first 3
    );

    // Toggle selection
    const toggleSelection = (handle) => {
        setSelectedHandles((prev) => {
            const next = new Set(prev);
            if (next.has(handle)) {
                next.delete(handle);
            } else {
                next.add(handle);
            }
            return next;
        });
    };

    // Calculate total price of selected items
    const totalPrice = useMemo(() => {
        let sum = 0;
        let currency = 'INR';
        products.forEach((p) => {
            if (selectedHandles.has(p.handle)) {
                const amount = p.price ?? p.priceRange?.minVariantPrice?.amount ?? 0;
                sum += parseFloat(amount) || 0;
                currency = p.currencyCode || p.priceRange?.minVariantPrice?.currencyCode || currency;
            }
        });
        return formatMoney(sum, currency);
    }, [products, selectedHandles]);

    // Add selected items to cart
    const handleAddSelected = () => {
        products.forEach((p) => {
            if (selectedHandles.has(p.handle)) {
                addItem(p.handle, { quantity: 1 });
            }
        });
        openCartDrawer?.();
    };

    if (!products.length) return null;

    return (
        <div className="bg-white py-6 px-4">
            {/* Header */}
            <h2 className="text-xl font-bold text-gray-900 mb-4">
                Frequently Bought Together:
            </h2>

            {/* Product List */}
            <div className="space-y-3">
                {products.map((item) => {
                    const isSelected = selectedHandles.has(item.handle);
                    const imageUrl = item.featuredImage?.url || item.images?.[0]?.url;
                    const price = formatMoney(
                        item.price ?? item.priceRange?.minVariantPrice?.amount,
                        item.currencyCode ?? item.priceRange?.minVariantPrice?.currencyCode
                    );

                    return (
                        <div
                            key={item.handle}
                            className="flex items-center gap-3 p-2 border border-gray-100 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors"
                        >
                            {/* Product Image - Clickable */}
                            <Link
                                to={`/product/${item.handle}`}
                                className="flex-shrink-0 w-16 h-16 bg-white rounded overflow-hidden border border-gray-100"
                            >
                                {imageUrl ? (
                                    <img
                                        src={imageUrl}
                                        alt={item.title}
                                        className="w-full h-full object-contain"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                                        No img
                                    </div>
                                )}
                            </Link>

                            {/* Product Info - Clickable */}
                            <Link
                                to={`/product/${item.handle}`}
                                className="flex-1 min-w-0"
                            >
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {item.title}
                                </p>
                                <p className="text-sm font-bold text-gray-900">{price}</p>
                            </Link>

                            {/* Selection Checkbox */}
                            <button
                                onClick={() => toggleSelection(item.handle)}
                                className={`flex-shrink-0 w-6 h-6 border-2 rounded flex items-center justify-center transition-all ${isSelected
                                        ? 'bg-black border-black text-white'
                                        : 'border-gray-300 bg-white hover:border-gray-400'
                                    }`}
                                aria-label={isSelected ? 'Deselect product' : 'Select product'}
                            >
                                {isSelected && <Check className="w-4 h-4" />}
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Total and Add Button */}
            {selectedHandles.size > 0 && (
                <div className="mt-5 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-600">
                            Total for {selectedHandles.size} item{selectedHandles.size > 1 ? 's' : ''}:
                        </span>
                        <span className="text-lg font-bold text-gray-900">{totalPrice}</span>
                    </div>
                    <button
                        onClick={handleAddSelected}
                        className="w-full bg-black text-white font-bold text-sm py-3 uppercase tracking-widest hover:bg-gray-900 transition-colors rounded"
                    >
                        Add Selected to Bag
                    </button>
                </div>
            )}
        </div>
    );
};

export default FrequentlyBoughtTogether;
