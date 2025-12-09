import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  Truck,
} from 'lucide-react';
import MobilePageHeader from '../components/MobilePageHeader';
import { useCatalog } from '../contexts/catalog-context';
import { useCart } from '../contexts/cart-context';
import {
  extractOptionValues,
  fetchProductByHandle,
  findVariantForSize,
  formatMoney,
  getProductImageUrl,
} from '../lib/shopify';

const AccordionItem = ({ title, isOpen, onClick, children }) => (
  <div className="border-b border-gray-200">
    <button
      onClick={onClick}
      className="w-full flex justify-between items-center py-4 text-left"
    >
      <span className="text-sm font-bold text-gray-900 uppercase tracking-wider">
        {title}
      </span>
      <span className="text-gray-500 text-sm">{isOpen ? '-' : '+'}</span>
    </button>
    {isOpen && <div className="pb-4 text-sm text-gray-700">{children}</div>}
  </div>
);

const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const outletContext = useOutletContext() || {};
  const openCartDrawer = outletContext?.openCartDrawer ?? (() => {});

  const { getProduct } = useCatalog();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [images, setImages] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const [selectedSize, setSelectedSize] = useState(null);
  const [openAccordion, setOpenAccordion] = useState('details');
  const [pincode, setPincode] = useState('');

  useEffect(() => {
    let cancelled = false;
    if (!slug) return;

    async function loadProduct() {
      setLoading(true);
      setError(null);

      const local = getProduct(slug);
      if (local) {
        if (!cancelled) {
          setProduct(local);
          setLoading(false);
        }
        return;
      }

      try {
        const fetched = await fetchProductByHandle(slug);
        if (!cancelled) {
          if (fetched) {
            setProduct(fetched);
          } else {
            setError('Product not found');
          }
        }
      } catch (err) {
        console.error(`Failed to load product "${slug}"`, err);
        if (!cancelled) setError('Product unavailable right now.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProduct();
    return () => {
      cancelled = true;
    };
  }, [slug, getProduct]);

  useEffect(() => {
    if (!product) return;
    const media = [];
    const hero = getProductImageUrl(product);
    if (hero) media.push({ url: hero, alt: product.title });
    (product.images || []).forEach((img) => {
      if (img?.url && !media.find((m) => m.url === img.url)) {
        media.push(img);
      }
    });
    setImages(media);
    setActiveImageIndex(0);
  }, [product]);

  const sizeOptions = useMemo(() => extractOptionValues(product, 'Size'), [product]);
  const hasSizes = sizeOptions.length > 0;

  const selectedVariant = useMemo(
    () => findVariantForSize(product, selectedSize),
    [product, selectedSize],
  );

  const price = useMemo(() => {
    if (!product) return '';
    const amount =
      selectedVariant?.price ??
      product.price ??
      product.priceRange?.minVariantPrice?.amount ??
      0;
    const currency =
      selectedVariant?.currencyCode ??
      product.currencyCode ??
      product.priceRange?.minVariantPrice?.currencyCode;
    return formatMoney(amount, currency);
  }, [product, selectedVariant]);

  useEffect(() => {
    if (hasSizes && !selectedSize && sizeOptions.length) {
      setSelectedSize(sizeOptions[0]);
    }
  }, [hasSizes, sizeOptions, selectedSize]);

  const toggleAccordion = (key) =>
    setOpenAccordion((current) => (current === key ? null : key));

  const nextImage = () =>
    setActiveImageIndex((idx) => (idx + 1) % Math.max(images.length, 1));
  const prevImage = () =>
    setActiveImageIndex((idx) =>
      images.length ? (idx - 1 + images.length) % images.length : 0,
    );

  const handleAddToCart = () => {
    if (!product?.handle) return;
    addItem(product.handle, { size: selectedSize, quantity: 1 });
    openCartDrawer();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading product…</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <p className="text-gray-700">{error || 'Product not found.'}</p>
        <button
          onClick={() => navigate('/products')}
          className="px-4 py-2 text-sm font-bold border border-gray-900 uppercase tracking-[0.18em]"
        >
          Back to products
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      <MobilePageHeader
        title={product?.title}
        onSearch={() => document.dispatchEvent(new CustomEvent('open-search'))}
      />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="lg:w-[60%] flex gap-4 lg:h-[calc(100vh-120px)] h-auto lg:sticky lg:top-24">
            <div className="hidden lg:flex flex-col gap-3 w-20 overflow-y-auto no-scrollbar py-1">
              {images.map((img, idx) => (
                <button
                  key={img.url || idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-full aspect-[3/4] border transition-all ${
                    activeImageIndex === idx
                      ? 'border-black opacity-100'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.alt || product.title}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            <div className="flex-1 relative bg-gray-50 h-full overflow-hidden group">
              {images.length ? (
                <img
                  src={images[activeImageIndex]?.url}
                  alt={product.title}
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No image
                </div>
              )}

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

          <div className="lg:w-[40%] pt-2 lg:pl-4">
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-xl md:text-2xl font-normal text-gray-900">
                {product.title}
              </h1>
              <span className="text-xl font-bold text-gray-900">{price}</span>
            </div>

            {hasSizes && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Sizes
                  </span>
                  <button className="text-xs font-medium text-gray-500 underline hover:text-black">
                    SIZE CHART
                  </button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {sizeOptions.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[48px] h-10 px-2 border flex items-center justify-center text-sm font-medium transition-all ${
                        selectedSize === size
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 text-gray-900 hover:border-black'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-orange-600 mt-3 flex items-center gap-1">
                  <Truck className="w-3 h-3" /> FREE 1-2 day delivery on 5k+
                  pincodes
                </p>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              className="w-full bg-black text-white font-bold text-sm py-4 uppercase tracking-widest hover:bg-gray-900 transition-colors mb-8"
            >
              Add to Bag
            </button>

            <div className="border-t border-gray-200">
              <AccordionItem
                title="Details"
                isOpen={openAccordion === 'details'}
                onClick={() => toggleAccordion('details')}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: product.descriptionHtml || product.description,
                  }}
                />
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
                  <button className="text-black font-bold text-xs absolute right-0 top-1/2 -translate-y-1/2 uppercase">
                    Check
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Enter your pincode to check delivery time & Pay on Delivery
                  availability.
                </p>
              </AccordionItem>

              <AccordionItem
                title="Returns"
                isOpen={openAccordion === 'returns'}
                onClick={() => toggleAccordion('returns')}
              >
                <p>
                  Easy 14 days returns and exchanges. Return Policies may vary
                  based on products and promotions.
                </p>
              </AccordionItem>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
