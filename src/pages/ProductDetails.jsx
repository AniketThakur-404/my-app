import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { Star, ShoppingBag, Heart, Truck } from 'lucide-react';
import { useCart } from '../contexts/cart-context';
import { useNotifications } from '../components/NotificationProvider';
import { useCatalog } from '../contexts/catalog-context';
import {
  fetchProductByHandle,
  fetchRecommendedProducts,
  formatMoney,
  toProductCard,
} from '../lib/shopify';

const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { openCartDrawer } = useOutletContext() ?? {};
  const { addItem } = useCart();
  const { notify } = useNotifications();
  const { getProduct } = useCatalog();

  const initialProduct = getProduct(slug);
  const [product, setProduct] = useState(initialProduct ?? null);
  const [loading, setLoading] = useState(!initialProduct);
  const [error, setError] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [pincode, setPincode] = useState('');

  // Always fetch fresh product (with metafields)
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setError(null);
      // If we have it in context, show it immediately while fetching fresh data
      const cached = getProduct(slug);
      if (!cancelled && cached) {
        setProduct(cached);
        setLoading(false);
      } else if (!cancelled && !product) {
        setLoading(true);
      }

      try {
        console.log(`Fetching product: ${slug}`);
        const full = await fetchProductByHandle(slug);

        if (cancelled) return;

        if (full) {
          setProduct(full);
          // Fetch recommendations only if we found the product
          try {
            const recs = await fetchRecommendedProducts(full, 4);
            if (!cancelled) setRelatedProducts((recs ?? []).map(toProductCard).filter(Boolean));
          } catch (e) {
            console.warn('Unable to load recommended products', e);
          }
        } else {
          console.error(`Product not found for handle: ${slug}`);
          if (!cached) setError(new Error('Product not found'));
        }
      } catch (e) {
        console.error(`Failed to load product "${slug}"`, e);
        if (!cancelled && !cached) {
          setError(e);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [slug, getProduct]);

  // Size Logic
  const sizeOptions = useMemo(() => {
    if (!product) return [];
    const entries = Object.entries(product.optionValues || {});
    const byName = entries.find(([name]) => name === 'size') || entries.find(([name]) => name.includes('size'));
    if (byName?.[1]?.length) return byName[1];

    const sizeOpt = (product.options || []).find((o) => (o?.name || '').toLowerCase().includes('size'));
    if (sizeOpt?.values?.length) return sizeOpt.values;

    return [];
  }, [product]);

  const hasSizes = sizeOptions.length > 0;

  useEffect(() => {
    if (hasSizes && !selectedSize) {
      setSelectedSize(sizeOptions[0]);
    }
  }, [hasSizes, sizeOptions, selectedSize]);


  if (loading) return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4">
      <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-500">Loading product details...</p>
    </div>
  );

  if (error || !product) return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4">
      <p className="text-red-500 font-bold">Product not found</p>
      <p className="text-sm text-gray-500">Could not load details for "{slug}"</p>
      <Link to="/" className="text-pink-600 underline">Return Home</Link>
    </div>
  );

  const images = (product.images || []).filter(img => img.url);
  // Fallback if no images
  if (images.length === 0 && product.featuredImage) {
    images.push(product.featuredImage);
  }

  const price = formatMoney(product.price, product.currencyCode);
  const compareAtPrice = product.compareAtPrice ? formatMoney(product.compareAtPrice, product.currencyCode) : null;
  const discount = product.compareAtPrice && product.price && product.compareAtPrice.amount > product.price.amount
    ? Math.round(((product.compareAtPrice.amount - product.price.amount) / product.compareAtPrice.amount) * 100)
    : 0;

  const handleAddToCart = () => {
    const size = selectedSize ?? sizeOptions[0] ?? null;
    addItem(product.handle, { size: hasSizes ? size : null });
    notify({
      title: 'Added to Cart',
      message: `${product.title}${hasSizes && size ? ` - Size ${size}` : ''}`,
      actionLabel: 'View Cart',
      onAction: () => navigate('/cart'),
    });
    openCartDrawer?.();
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="site-shell pt-4">
        <div className="text-xs text-gray-500 mb-4">
          <Link to="/" className="hover:text-black">Home</Link> / <Link to="/products" className="hover:text-black">Clothing</Link> / <span className="font-bold text-gray-800">{product.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Images Grid */}
          <div className="grid grid-cols-2 gap-2">
            {images.length > 0 ? (
              images.map((img, idx) => (
                <div key={idx} className="aspect-[3/4] overflow-hidden cursor-zoom-in group bg-gray-50">
                  <img src={img.url} alt={img.altText || product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              ))
            ) : (
              <div className="col-span-2 aspect-[3/4] bg-gray-100 flex items-center justify-center text-gray-400">
                No Images Available
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="lg:pl-8 lg:sticky lg:top-24 lg:self-start">
            <h1 className="text-2xl font-bold text-[#282c3f] mb-1">{product.vendor || 'Brand'}</h1>
            <h2 className="text-xl text-[#535766] font-normal mb-4">{product.title}</h2>

            <div className="flex items-center gap-2 mb-4 border border-gray-200 w-fit px-2 py-1 rounded cursor-pointer hover:border-gray-800">
              <span className="font-bold text-sm">4.4</span>
              <Star className="w-3 h-3 text-teal-500 fill-teal-500" />
              <span className="text-gray-300">|</span>
              <span className="text-xs text-gray-500">2.8k Ratings</span>
            </div>

            <div className="border-t border-gray-200 my-4"></div>

            <div className="flex items-center gap-4 mb-2">
              <span className="text-2xl font-bold text-[#282c3f]">{price}</span>
              {compareAtPrice && (
                <>
                  <span className="text-lg text-gray-500 line-through">{compareAtPrice}</span>
                  <span className="text-lg text-orange-500 font-bold">({discount}% OFF)</span>
                </>
              )}
            </div>
            <p className="text-xs text-teal-600 font-bold mb-6">inclusive of all taxes</p>

            {/* Size Selector */}
            {hasSizes && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-bold text-[#282c3f] uppercase">Select Size</span>
                  <span className="text-sm font-bold text-[#ff3f6c] uppercase cursor-pointer">Size Chart</span>
                </div>
                <div className="flex gap-3 flex-wrap">
                  {sizeOptions.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 rounded-full border flex items-center justify-center text-sm font-bold transition-all ${selectedSize === size ? 'border-[#ff3f6c] text-[#ff3f6c]' : 'border-gray-300 text-[#282c3f] hover:border-[#ff3f6c]'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-[#ff3f6c] text-white font-bold py-4 rounded-sm uppercase tracking-wide flex items-center justify-center gap-2 hover:bg-[#d43256] transition-colors"
              >
                <ShoppingBag className="w-5 h-5" /> Add to Bag
              </button>
              <button className="flex-1 border border-gray-300 text-[#282c3f] font-bold py-4 rounded-sm uppercase tracking-wide flex items-center justify-center gap-2 hover:border-black transition-colors">
                <Heart className="w-5 h-5" /> Wishlist
              </button>
            </div>

            {/* Delivery */}
            <div className="mb-8">
              <span className="text-sm font-bold text-[#282c3f] uppercase flex items-center gap-2 mb-3">
                Delivery Options <Truck className="w-5 h-5" />
              </span>
              <div className="flex gap-2 relative max-w-xs">
                <input
                  type="text"
                  placeholder="Enter pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-black"
                />
                <button className="text-[#ff3f6c] font-bold text-sm absolute right-3 top-1/2 -translate-y-1/2">Check</button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Please enter PIN code to check delivery time & Pay on Delivery Availability</p>
            </div>

            {/* Product Details from Description */}
            <div className="mb-8">
              <span className="text-sm font-bold text-[#282c3f] uppercase flex items-center gap-2 mb-3">
                Product Details
              </span>
              <div
                className="text-sm text-gray-700 leading-relaxed space-y-2"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml || product.description }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
