import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, User, Heart, Menu, X } from 'lucide-react';
import { useCart } from '../contexts/cart-context';

const Navbar = ({ onSearchClick, onCartClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const navLinks = [
    { label: 'MEN', href: '/products?category=men' },
    { label: 'WOMEN', href: '/products?category=women' },
    { label: 'KIDS', href: '/products?category=kids' },
    { label: 'HOME & LIVING', href: '/products?category=home' },
    { label: 'BEAUTY', href: '/products?category=beauty' },
    { label: 'STUDIO', href: '/products?category=studio', isNew: true },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="site-shell h-20 flex items-center justify-between gap-8">

        {/* Left: Logo & Nav */}
        <div className="flex items-center gap-8 lg:gap-12">
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 -ml-2 text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img
              src="/aradhya-logo.png"
              alt="Aradhya"
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm font-bold text-[#282c3f] tracking-wide hover:text-[#ff3f6c] hover:border-b-4 hover:border-[#ff3f6c] py-7 transition-all relative"
              >
                {link.label}
                {link.isNew && (
                  <span className="absolute -top-0 -right-2 text-[10px] text-[#ff3f6c] font-bold uppercase">New</span>
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* Center: Search */}
        <div className="hidden md:flex flex-1 max-w-lg relative bg-[#f5f5f6] rounded-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search for products, brands and more"
            className="block w-full pl-10 pr-3 py-2.5 bg-transparent text-sm text-gray-700 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-gray-200 rounded-md transition-colors"
            onClick={onSearchClick}
          />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-6 lg:gap-8">
          <div className="flex flex-col items-center gap-1 cursor-pointer group">
            <User className="w-5 h-5 text-gray-700 group-hover:text-black" />
            <span className="text-xs font-bold text-gray-700 group-hover:text-black hidden lg:block">Profile</span>
          </div>
          <div className="flex flex-col items-center gap-1 cursor-pointer group">
            <Heart className="w-5 h-5 text-gray-700 group-hover:text-black" />
            <span className="text-xs font-bold text-gray-700 group-hover:text-black hidden lg:block">Wishlist</span>
          </div>
          <div
            className="flex flex-col items-center gap-1 cursor-pointer group relative"
            onClick={onCartClick}
          >
            <ShoppingBag className="w-5 h-5 text-gray-700 group-hover:text-black" />
            {totalItems > 0 && (
              <span className="absolute -top-1 right-0 bg-[#ff3f6c] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
            <span className="text-xs font-bold text-gray-700 group-hover:text-black hidden lg:block">Bag</span>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-200 shadow-lg py-4 px-4 flex flex-col gap-4 z-40">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="text-sm font-bold text-gray-800 py-2 border-b border-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Navbar;
