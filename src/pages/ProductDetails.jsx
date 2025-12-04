import MobilePageHeader from '../components/MobilePageHeader';

// ... existing imports

// ... AccordionItem component

const ProductDetails = () => {
  // ... existing hooks

  // ... existing useEffects and logic

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Mobile Header */}
      <MobilePageHeader
        title={product?.title}
        onSearch={() => document.dispatchEvent(new CustomEvent('open-search'))}
      />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

          {/* LEFT COLUMN: Gallery */}
          <div className="lg:w-[60%] flex gap-4 lg:h-[calc(100vh-120px)] h-auto lg:sticky lg:top-24">
            {/* Thumbnails Strip */}
            <div className="hidden lg:flex flex-col gap-3 w-20 overflow-y-auto no-scrollbar py-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-full aspect-[3/4] border transition-all ${activeImageIndex === idx ? 'border-black opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main Image Area */}
            <div className="flex-1 relative bg-gray-50 h-full overflow-hidden group">
              <img
                src={images[activeImageIndex]?.url}
                alt={product.title}
                className="w-full h-full object-cover object-center"
              />

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Floating Icons */}
              <div className="absolute top-4 right-4 flex flex-col gap-3">
                <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-105 transition-transform">
                  <Heart className="w-5 h-5 text-gray-700" />
                </button>
                <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-105 transition-transform">
                  <Share2 className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Details */}
          <div className="lg:w-[40%] pt-2 lg:pl-4">
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-xl md:text-2xl font-normal text-gray-900">{product.title}</h1>
              <span className="text-xl font-bold text-gray-900">{price}</span>
            </div>

            {/* Colors Section (Mock) */}
            <div className="mb-8">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Colors</h3>
              <div className="flex gap-3">
                {/* Just showing current product as the 'active' color + placeholders */}
                <div className="w-16 h-20 border border-black p-0.5 cursor-pointer">
                  <img src={images[0]?.url} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="w-16 h-20 border border-transparent hover:border-gray-300 p-0.5 cursor-pointer opacity-50 grayscale">
                  <img src={images[0]?.url} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="w-16 h-20 border border-transparent hover:border-gray-300 p-0.5 cursor-pointer opacity-50 grayscale">
                  <img src={images[0]?.url} alt="" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            {/* Sizes Section */}
            {hasSizes && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">Sizes</span>
                  <button className="text-xs font-medium text-gray-500 underline hover:text-black">SIZE CHART</button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {sizeOptions.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[48px] h-10 px-2 border flex items-center justify-center text-sm font-medium transition-all ${selectedSize === size
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 text-gray-900 hover:border-black'
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-orange-600 mt-3 flex items-center gap-1">
                  <Truck className="w-3 h-3" /> FREE 1-2 day delivery on 5k+ pincodes
                </p>
              </div>
            )}

            {/* Add to Bag */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-black text-white font-bold text-sm py-4 uppercase tracking-widest hover:bg-gray-900 transition-colors mb-8"
            >
              Add to Bag
            </button>

            {/* Accordions */}
            <div className="border-t border-gray-200">
              <AccordionItem
                title="Details"
                isOpen={openAccordion === 'details'}
                onClick={() => toggleAccordion('details')}
              >
                <div dangerouslySetInnerHTML={{ __html: product.descriptionHtml || product.description }} />
              </AccordionItem>

              <AccordionItem
                title="Delivery"
                isOpen={openAccordion === 'delivery'}
                onClick={() => toggleAccordion('delivery')}
              >
                <div className="flex gap-2 relative max-w-xs mb-2">
                  <input
                    type="text"
                    placeholder="Enter pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-black"
                  />
                  <button className="text-black font-bold text-xs absolute right-0 top-1/2 -translate-y-1/2 uppercase">Check</button>
                </div>
                <p className="text-xs text-gray-500">Enter your pincode to check delivery time & Pay on Delivery availability.</p>
              </AccordionItem>

              <AccordionItem
                title="Returns"
                isOpen={openAccordion === 'returns'}
                onClick={() => toggleAccordion('returns')}
              >
                <p>Easy 14 days returns and exchanges. Return Policies may vary based on products and promotions.</p>
              </AccordionItem>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
