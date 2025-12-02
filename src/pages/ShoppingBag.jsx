import React, { useState } from 'react';
import { ArrowLeft, Heart, Trash2, X, Share2, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function ShoppingBag() {
  const navigate = useNavigate();
  const [items, setItems] = useState([
    {
      id: 1,
      brand: 'Beyoung',
      name: 'Men Classic Fit Solid Spread Collar Cotton Shirt',
      soldBy: 'BEYOUNG FOLKS PRIVATE LIMITED',
      size: '38',
      qty: 1,
      left: 1,
      price: 665,
      originalPrice: 1330,
      discount: 665,
      returnPeriod: 7,
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      selected: false
    },
    {
      id: 2,
      brand: 'The Pant Project',
      name: 'Men Mineral Grey Solid Slim Fit Wrinkle-Free Formal Trousers',
      soldBy: 'AANSWR FASHION PRIVATE LIMITED',
      size: '28',
      qty: 1,
      left: null,
      price: 1890,
      originalPrice: 2990,
      discount: 1100,
      returnPeriod: 14,
      image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      selected: false
    },
    {
      id: 3,
      brand: 'LUX NITRO',
      name: 'Pack Of 2 Lounge T-Shirts',
      soldBy: 'LUX INDUSTRIES LIMITED',
      size: 'M',
      qty: 1,
      left: 9,
      price: 341,
      originalPrice: 420,
      discount: 79,
      returnPeriod: 7,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      selected: false
    }
  ]);

  const toggleSelect = (id) => {
    setItems(items.map(item => item.id === id ? { ...item, selected: !item.selected } : item));
  };

  const toggleSelectAll = () => {
    const allSelected = items.every(item => item.selected);
    setItems(items.map(item => ({ ...item, selected: !allSelected })));
  };

  const selectedCount = items.filter(item => item.selected).length;

  return (
    <div className="min-h-screen bg-gray-50 pb-32 font-sans">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-base font-bold text-gray-800 uppercase">Shopping Bag</h1>
        </div>
        <div className="text-xs font-medium text-gray-500">STEP 1/3</div>
      </div>

      {/* Address Bar */}
      <div className="bg-white mt-2 px-4 py-4 flex justify-between items-start shadow-sm">
        <div>
          <div className="text-sm text-gray-700">Deliver to: <span className="font-bold text-gray-900">Rik Samanta , 711413</span></div>
          <div className="text-xs text-gray-500 mt-1 truncate max-w-[280px]">Sarada Majhpara Near Sarada Post Office , Sarda, Howrah</div>
        </div>
        <button className="text-pink-600 font-bold text-xs uppercase pt-0.5">Change</button>
      </div>

      {/* Selection Header */}
      <div className="mt-3 px-4 py-3 flex justify-between items-center bg-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div
            onClick={toggleSelectAll}
            className={`w-5 h-5 border rounded-[3px] flex items-center justify-center cursor-pointer transition-colors ${items.every(i => i.selected) ? 'bg-pink-600 border-pink-600' : 'border-gray-400 bg-white'}`}
          >
            {items.every(i => i.selected) && <div className="w-2.5 h-1.5 border-l-2 border-b-2 border-white rotate-[-45deg] mb-0.5" />}
          </div>
          <span className="text-xs font-bold text-gray-700 uppercase">{selectedCount}/{items.length} ITEMS SELECTED</span>
        </div>
        <div className="flex gap-5 text-gray-600">
          <Share2 className="w-5 h-5 stroke-[1.5]" />
          <Trash2 className="w-5 h-5 stroke-[1.5]" />
          <Heart className="w-5 h-5 stroke-[1.5]" />
        </div>
      </div>

      {/* Items List */}
      <div className="flex flex-col gap-3 mt-3">
        {items.map((item) => (
          <div key={item.id} className="bg-white p-3 relative shadow-sm">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>

            <div className="flex gap-3">
              {/* Checkbox & Image */}
              <div className="relative shrink-0">
                <div
                  onClick={() => toggleSelect(item.id)}
                  className={`absolute top-1 left-1 z-10 w-5 h-5 border rounded-[3px] flex items-center justify-center cursor-pointer bg-white transition-colors ${item.selected ? 'border-pink-600 bg-pink-600' : 'border-gray-400'}`}
                >
                  {item.selected && <div className="w-2.5 h-1.5 border-l-2 border-b-2 border-white rotate-[-45deg] mb-0.5" />}
                </div>
                <img src={item.image} alt={item.name} className="w-[100px] h-[133px] object-cover rounded-sm" />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0 pt-0.5">
                <h3 className="font-bold text-gray-900 text-sm leading-none">{item.brand}</h3>
                <p className="text-sm text-gray-600 leading-tight mt-1.5 truncate pr-6">{item.name}</p>
                <p className="text-[10px] text-gray-400 mt-1">Sold by: {item.soldBy}</p>

                <div className="flex gap-2 mt-2.5">
                  <button className="bg-gray-50 border border-gray-200 px-2 py-0.5 rounded text-xs font-bold text-gray-800 flex items-center gap-1">
                    Size: {item.size} <ChevronDown className="w-3 h-3 text-gray-500" />
                  </button>
                  <button className="bg-gray-50 border border-gray-200 px-2 py-0.5 rounded text-xs font-bold text-gray-800 flex items-center gap-1">
                    Qty: {item.qty} <ChevronDown className="w-3 h-3 text-gray-500" />
                  </button>
                  {item.left && (
                    <span className="text-[10px] text-orange-500 border border-orange-200 px-1 py-0.5 rounded flex items-center">
                      {item.left} left
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-2.5">
                  <span className="font-bold text-sm text-gray-900">₹{item.price}</span>
                  <span className="text-xs text-gray-400 line-through">₹{item.originalPrice}</span>
                  <span className="text-xs text-orange-500 font-medium">₹{item.discount} OFF</span>
                </div>

                <div className="flex items-center gap-1.5 mt-2 text-[10px] text-gray-600">
                  <span className="w-3.5 h-3.5 rounded-full border border-gray-400 flex items-center justify-center text-[8px] font-bold">↺</span>
                  <span>{item.returnPeriod} days return available</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
        {selectedCount === 0 && (
          <div className="bg-pink-50 text-center text-xs font-medium text-gray-800 py-2.5">
            No Item selected, select at least one item to place order.
          </div>
        )}
        <div className="p-4">
          <Link to="/checkout/address">
            <button
              disabled={selectedCount === 0}
              className={`w-full font-bold py-3.5 rounded-[2px] uppercase tracking-wider text-sm transition-colors ${selectedCount > 0 ? 'bg-pink-600 text-white hover:bg-pink-700' : 'bg-pink-300 text-white cursor-not-allowed'}`}
            >
              Place Order
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
