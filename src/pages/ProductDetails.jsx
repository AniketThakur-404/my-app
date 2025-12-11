import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useOutletContext, useParams } from 'react-router-dom';
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
  fetchProductsFromCollection,
  findVariantForSize,
  formatMoney,
  getProductImageUrl,
  toProductCard,
  normaliseTokenValue,
  searchProducts,
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
  const [selectedColor, setSelectedColor] = useState(null);
  const [openAccordion, setOpenAccordion] = useState('details');
  const [pincode, setPincode] = useState('');
  const [comboSingles, setComboSingles] = useState([]);

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
  const colorOptions = useMemo(() => {
    const primary = extractOptionValues(product, 'Color');
    const alt = extractOptionValues(product, 'Colour');
    const metaColors = Array.isArray(product?.metafields)
      ? product.metafields
          .filter((m) => {
            const key = normaliseTokenValue(m?.key);
            const ns = normaliseTokenValue(m?.namespace);
            return (
              (key === 'color' || key === 'colour') &&
              ['custom', 'details', 'info', 'global', 'theme'].includes(ns)
            );
          })
          .map((m) => m?.value)
          .filter(Boolean)
      : [];
    const merged = [...primary, ...alt, ...metaColors].filter(Boolean);
    return Array.from(new Set(merged));
  }, [product]);
  const hasSizes = sizeOptions.length > 0;
  const hasColors = colorOptions.length > 0;

  const selectedVariant = useMemo(() => {
    if (!product) return null;
    const variants = product.variants || [];
    const targetSize = normaliseTokenValue(selectedSize);
    const targetColor = normaliseTokenValue(selectedColor);

    const matchOption = (variant, matcher) =>
      variant?.selectedOptions?.some((opt) => matcher(opt)) ?? false;

    const matchByBoth = variants.find((variant) => {
      const sizeMatch =
        !targetSize ||
        matchOption(
          variant,
          (opt) =>
            normaliseTokenValue(opt?.name).includes('size') &&
            normaliseTokenValue(opt?.value) === targetSize,
        );
      const colorMatch =
        !targetColor ||
        matchOption(
          variant,
          (opt) => {
            const name = normaliseTokenValue(opt?.name);
            return (
              (name.includes('color') || name.includes('colour')) &&
              normaliseTokenValue(opt?.value) === targetColor
            );
          },
        );
      return sizeMatch && colorMatch;
    });

    return matchByBoth || findVariantForSize(product, selectedSize);
  }, [product, selectedSize, selectedColor]);

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
    if (!product) return;

    const firstVariant = product.variants?.[0];
    const variantSize =
      firstVariant?.selectedOptions?.find((opt) =>
        normaliseTokenValue(opt?.name).includes('size'),
      )?.value;
    const variantColor =
      firstVariant?.selectedOptions?.find((opt) => {
        const name = normaliseTokenValue(opt?.name);
        return name.includes('color') || name.includes('colour');
      })?.value;

    if (hasSizes && !selectedSize && sizeOptions.length) {
      setSelectedSize(variantSize || sizeOptions[0]);
    }
    if (hasColors && !selectedColor && colorOptions.length) {
      setSelectedColor(variantColor || colorOptions[0]);
    }
  }, [
    product,
    hasSizes,
    sizeOptions,
    selectedSize,
    hasColors,
    colorOptions,
    selectedColor,
  ]);

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

  useEffect(() => {
    let cancelled = false;
    async function loadSingles() {
      const looksLikeCombo =
        String(product?.title || '').toLowerCase().includes('combo') ||
        product?.tags?.some((tag) => String(tag).toLowerCase().includes('combo'));
      if (!looksLikeCombo) return;
      const primaryCollection = product.collections?.[0]?.handle;
      try {
        let cards = [];
        if (primaryCollection) {
          const items = await fetchProductsFromCollection(primaryCollection, 8);
          cards = items
            .filter((item) => item?.handle && item.handle !== product.handle)
            .map((item) => {
              const priceInfo = item.priceRange?.minVariantPrice;
              const enriched = {
                ...item,
                price: priceInfo?.amount ?? item.price,
                currencyCode: priceInfo?.currencyCode ?? item.currencyCode,
              };
              return toProductCard(enriched);
            })
            .filter(Boolean);
        }

        if (!cards.length) {
          const baseTerm = String(product?.title || '')
            .replace(/\(combo\)/i, '')
            .trim();
          const results = await searchProducts(baseTerm || 'combo', 8);
          cards = results
            .filter((item) => item?.handle && item.handle !== product.handle)
            .map((item) => {
              const priceInfo = item.priceRange?.minVariantPrice;
              return {
                title: item.title,
                handle: item.handle,
                vendor: item.vendor,
                price: formatMoney(priceInfo?.amount, priceInfo?.currencyCode),
                img: item.featuredImage?.url,
                hoverImg: null,
                badge: item.tags?.includes('new') ? 'New' : undefined,
                href: `/product/${item.handle}`,
              };
            })
            .filter(Boolean);
        }

        if (!cancelled && cards.length) {
          setComboSingles(cards);
        }
      } catch (err) {
        console.warn('Failed to load singles for combo', err);
      }
    }
    loadSingles();
    return () => {
      cancelled = true;
    };
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading product...</div>
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

      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
          <div className="lg:w-[62%] flex gap-5 lg:min-h-[70vh] lg:max-h-[85vh] h-auto lg:sticky lg:top-24">
            <div className="hidden lg:flex flex-col gap-4 w-24 overflow-y-auto no-scrollbar py-1">
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
                    className="w-full h-full object-contain bg-white"
                  />
                </button>
              ))}
            </div>

            <div className="flex-1 relative bg-gray-50 h-full overflow-hidden group rounded">
              {images.length ? (
                <img
                  src={images[activeImageIndex]?.url}
                  alt={product.title}
                  className="w-full h-full object-contain object-center bg-white"
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

          <div className="lg:w-[38%] pt-2 lg:pl-2">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Aradhya</p>
                <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                  {product.title}
                </h1>
              </div>
              <span className="text-xl font-bold text-gray-900">{price}</span>
            </div>

            {hasColors && (
              <div className="mb-3 text-sm text-gray-700">
                <span className="font-semibold">Color: </span>
                <span>{selectedColor || colorOptions[0]}</span>
              </div>
            )}

            {hasColors && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Colors
                  </span>
                  <span className="text-xs text-gray-500">
                    {colorOptions.length} option{colorOptions.length === 1 ? '' : 's'}
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {colorOptions.map((color) => {
                    const active = selectedColor === color;
                    return (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`flex items-center gap-2 px-3 h-10 border text-sm font-medium transition-all ${
                          active
                            ? 'border-black bg-black text-white'
                            : 'border-gray-300 text-gray-900 hover:border-black'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-gray-200"
                          style={{ backgroundColor: color.toLowerCase() }}
                          aria-hidden
                        />
                        {color}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

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
              className="w-full bg-black text-white font-bold text-sm py-4 uppercase tracking-widest hover:bg-gray-900 transition-colors mb-6"
            >
              Add to Bag
            </button>

            {comboSingles.length > 0 && (
              <div className="mb-10">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                    Shop singles from this combo
                  </h3>
                  <span className="text-xs text-gray-500">
                    {comboSingles.length} option{comboSingles.length === 1 ? '' : 's'}
                  </span>
                </div>
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                  {comboSingles.map((item) => (
                    <Link
                      key={item.handle}
                      to={`/product/${item.handle}`}
                      className="min-w-[160px] max-w-[180px] border border-gray-200 rounded-sm bg-white hover:shadow-md transition-shadow"
                    >
                      <div className="aspect-[3/4] bg-gray-50">
                        <img
                          src={item.img || item.featuredImage?.url}
                          alt={item.title}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="p-2">
                        <p className="text-xs text-gray-500 uppercase tracking-[0.12em]">
                          {item.vendor || 'Aradhya'}
                        </p>
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {item.title}
                        </p>
                        <p className="text-sm font-bold text-gray-900">{item.price}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

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
