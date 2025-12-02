import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Youtube, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#fafbfc] pt-12 pb-8 border-t border-gray-200 font-sans">
      <div className="site-shell">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">

          {/* Column 1 */}
          <div>
            <h3 className="text-xs font-bold text-[#282c3f] uppercase tracking-wide mb-6">Online Shopping</h3>
            <ul className="flex flex-col gap-2 text-sm text-[#696b79]">
              <li><Link to="/products?category=men" className="hover:text-[#282c3f]">Men</Link></li>
              <li><Link to="/products?category=women" className="hover:text-[#282c3f]">Women</Link></li>
              <li><Link to="/products?category=kids" className="hover:text-[#282c3f]">Kids</Link></li>
              <li><Link to="/products?category=home" className="hover:text-[#282c3f]">Home & Living</Link></li>
              <li><Link to="/products?category=beauty" className="hover:text-[#282c3f]">Beauty</Link></li>
              <li><Link to="/gift-cards" className="hover:text-[#282c3f]">Gift Cards</Link></li>
              <li><Link to="/insider" className="hover:text-[#282c3f]">Aradhya Insider</Link></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="text-xs font-bold text-[#282c3f] uppercase tracking-wide mb-6">Customer Policies</h3>
            <ul className="flex flex-col gap-2 text-sm text-[#696b79]">
              <li><Link to="/contact" className="hover:text-[#282c3f]">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-[#282c3f]">FAQ</Link></li>
              <li><Link to="/tnc" className="hover:text-[#282c3f]">T&C</Link></li>
              <li><Link to="/terms" className="hover:text-[#282c3f]">Terms Of Use</Link></li>
              <li><Link to="/track" className="hover:text-[#282c3f]">Track Orders</Link></li>
              <li><Link to="/shipping" className="hover:text-[#282c3f]">Shipping</Link></li>
              <li><Link to="/cancellation" className="hover:text-[#282c3f]">Cancellation</Link></li>
              <li><Link to="/returns" className="hover:text-[#282c3f]">Returns</Link></li>
              <li><Link to="/privacy" className="hover:text-[#282c3f]">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="text-xs font-bold text-[#282c3f] uppercase tracking-wide mb-6">Experience Aradhya App on Mobile</h3>
            <div className="flex gap-4 mb-6">
              <div className="h-10 w-32 bg-black rounded flex items-center justify-center text-white text-xs font-bold cursor-pointer">
                Google Play
              </div>
              <div className="h-10 w-32 bg-black rounded flex items-center justify-center text-white text-xs font-bold cursor-pointer">
                App Store
              </div>
            </div>
            <h3 className="text-xs font-bold text-[#282c3f] uppercase tracking-wide mb-4">Keep in Touch</h3>
            <div className="flex gap-4 text-[#696b79]">
              <Facebook className="w-5 h-5 cursor-pointer hover:text-[#282c3f]" />
              <Twitter className="w-5 h-5 cursor-pointer hover:text-[#282c3f]" />
              <Youtube className="w-5 h-5 cursor-pointer hover:text-[#282c3f]" />
              <Instagram className="w-5 h-5 cursor-pointer hover:text-[#282c3f]" />
            </div>
          </div>

          {/* Column 4 */}
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-xs font-bold">100%</span>
              </div>
              <div>
                <p className="text-sm font-bold text-[#282c3f]">100% ORIGINAL</p>
                <p className="text-xs text-[#696b79]">guarantee for all products at aradhya.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-xs font-bold">14d</span>
              </div>
              <div>
                <p className="text-sm font-bold text-[#282c3f]">Return within 14days</p>
                <p className="text-xs text-[#696b79]">of receiving your order</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <h3 className="text-sm font-bold text-[#282c3f] mb-4">POPULAR SEARCHES</h3>
          <p className="text-sm text-[#696b79] leading-relaxed">
            Makeup | Dresses For Girls | T-Shirts | Sandals | Headphones | Babydolls | Blazers For Men | Handbags | Ladies Watches | Bags | Sport Shoes | Reebok Shoes | Puma Shoes | Boxers | Wallets | Tops | Earrings | Fastrack Watches | Kurtis | Nike | Smart Watches | Titan Watches | Designer Blouse | Gowns | Rings | Cricket Shoes | Forever 21 | Eye Makeup | Photo Frames | Punjabi Suits | Bikini | Aradhya Fashion Show | Lipstick | Saree | Watches | Dresses | Lehenga | Nike Shoes | Goggles | Bras | Suit | Chinos | Shoes | Adidas Shoes | Woodland Shoes | Jewellery | Designers Sarees
          </p>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 flex justify-between items-center text-sm text-[#696b79]">
          <p>In case of any concern, <Link to="/contact" className="text-[#526cd0] font-bold">Contact Us</Link></p>
          <p>© 2025 www.aradhya.com. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
