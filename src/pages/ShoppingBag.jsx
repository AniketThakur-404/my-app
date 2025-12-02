import React, { useState } from 'react';
import { ArrowLeft, Heart, Trash2, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function ShoppingBag() {
  const navigate = useNavigate();
  const [items, setItems] = useState([
    {
      id: 1,
      brand: 'Beyoung',
      name: 'Men Classic Fit Solid Spread Collar Cotton ...',
      soldBy: 'BEYOUNG FOLKS PRIVA...',
      size: '38',
      qty: 1,
      price: 665,
      originalPrice: 1330,
      discount: 665,
      returnPeriod: 7,
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', // Placeholder
      selected: false
    },
    {
      id: 2,
      brand: 'The Pant Project',
      name: 'Men Mineral Grey Solid Slim Fit Wrinkle-Re...',
      soldBy: 'AANSWR FASHION PRIV...',
      size: '28',
      qty: 1,
      price: 1890,
      originalPrice: 2990,
      discount: 1100,
      returnPeriod: 14,
      image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', // Placeholder
      selected: false
    },
    {
      id: 3,
      brand: 'LUX NITRO',
      name: 'Pack Of 2 Lounge T-Shirts',
      soldBy: 'LUX INDUSTRIES LIMITED',
      size: 'M',
      qty: 1,
      price: 341,
      originalPrice: 420,
      discount: 79,
      returnPeriod: 7,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', // Placeholder
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
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-lg font-semibold text-gray-800">SHOPPING BAG</h1>
        </div>
        <div className="text-xs font-medium text-gray-500">STEP 1/3</div>
      </div>

      {/* Address Bar */}
      <div className="bg-white mt-1 px-4 py-3 flex justify-between items-start">
        <div>
          <div className="text-sm text-gray-600">Deliver to: <span className="font-bold text-gray-900">Rik Samanta , 711413</span></div>
          <div className="text-xs text-gray-500 mt-0.5 truncate max-w-[250px]">Sarada Majhpara Near Sarada Post Office , Sarda, Howrah</div>
        </div>
        <button className="text-pink-600 font-bold text-sm uppercase">Change</button>
      </div>

      {/* Selection Header */}
      <div className="mt-4 px-4 py-2 flex justify-between items-center bg-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div 
            onClick={toggleSelectAll}
            className={`w-5 h-5 border rounded flex items-center justify-center cursor-pointer ${items.every(i => i.selected) ? 'bg-pink-600 border-pink-600' : 'border-gray-400'}`}
          >
             {items.every(i => i.selected) && <div className="w-2 h-2 bg-white rounded-sm" />}
          </div>
          <span className="text-sm font-bold text-gray-700">{selectedCount}/{items.length} ITEMS SELECTED</span>
        </div>
        <div className="flex gap-4 text-gray-500">
           <Heart className="w-5 h-5" />
           <Trash2 className="w-5 h-5" />
        </div>
      </div>

      {/* Items List */}
      <div className="flex flex-col gap-2 mt-2">
        {items.map((item) => (
          <div key={item.id} className="bg-white p-4 relative">
            <button className="absolute top-4 right-4 text-gray-400">
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex gap-4">
              <div className="relative">
                 <div 
                    onClick={() => toggleSelect(item.id)}
                    className={`absolute top-1 left-1 z-10 w-5 h-5 border rounded flex items-center justify-center cursor-pointer bg-white ${item.selected ? 'border-pink-600' : 'border-gray-400'}`}
                  >
                     {item.selected && <div className="w-3 h-3 bg-pink-600 rounded-sm" />}
                  </div>
                <img src={item.image} alt={item.name} className="w-28 h-36 object-cover rounded-sm" />
              </div>
              
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-sm">{item.brand}</h3>
                <p className="text-sm text-gray-600 leading-tight mt-1 line-clamp-2">{item.name}</p>
                <p className="text-xs text-gray-400 mt-1">Sold by: {item.soldBy}</p>
                
                <div className="flex gap-3 mt-3">
                  <div className="bg-gray-100 px-2 py-1 rounded text-xs font-bold text-gray-800 flex items-center gap-1">
                    Size: {item.size} <span className="text-gray-400">▼</span>
                  </div>
                  <div className="bg-gray-100 px-2 py-1 rounded text-xs font-bold text-gray-800 flex items-center gap-1">
                    Qty: {item.qty} <span className="text-gray-400">▼</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <span className="font-bold text-sm">₹{item.price}</span>
                  <span className="text-xs text-gray-400 line-through">₹{item.originalPrice}</span>
                  <span className="text-xs text-orange-500 font-medium">₹{item.discount} OFF</span>
                </div>

                <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                   <span className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center text-[10px]">↺</span>
                   <span>{item.returnPeriod} days return available</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      {selectedCount > 0 ? (
         <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 z-20">
            <Link to="/checkout/address">
              <button className="w-full bg-pink-600 text-white font-bold py-3 rounded-sm uppercase tracking-wide">
                Place Order
              </button>
            </Link>
         </div>
      ) : (
          <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 z-20">
             <div className="text-center text-sm font-medium text-gray-600 py-3">
                No Item selected, select at least one item to place order.
             </div>
             <button disabled className="w-full bg-pink-300 text-white font-bold py-3 rounded-sm uppercase tracking-wide cursor-not-allowed">
                Place Order
              </button>
          </div>
      )}
    </div>
  );
}
