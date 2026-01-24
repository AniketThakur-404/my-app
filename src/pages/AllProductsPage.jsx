import MobilePageHeader from '../components/MobilePageHeader';

import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useCatalog } from '../contexts/catalog-context';
import { normaliseTokenValue, toProductCard } from '../lib/shopify';

const normalizeForMatch = (value) => {
  const normalized = normaliseTokenValue(value);
  if (!normalized) return '';
  return normalized.replace(/[^a-z0-9]+/g, ' ').trim();
};

const tokenize = (value) => normalizeForMatch(value).split(' ').filter(Boolean);

const matchesToken = (source, targetTokens) => {
  if (!source || targetTokens.length === 0) return false;
  const sourceTokens = tokenize(source);
  if (sourceTokens.length === 0) return false;
  if (targetTokens.length === 1) {
    return sourceTokens.includes(targetTokens[0]);
  }
  if (targetTokens.every((token) => sourceTokens.includes(token))) return true;
  const collapsedSource = sourceTokens.join('');
  const collapsedTarget = targetTokens.join('');
  return collapsedSource.includes(collapsedTarget);
};

const productMatchesFilter = (product, filterToken) => {
  if (!filterToken) return true;
  const targetTokens = tokenize(filterToken);
  if (targetTokens.length === 0) return true;

  const tags = Array.isArray(product?.tags) ? product.tags : [];
  const collections = Array.isArray(product?.collections) ? product.collections : [];
  const candidates = [
    product?.productType,
    ...tags,
    ...collections.map((collection) => collection?.handle),
    ...collections.map((collection) => collection?.title),
  ].filter(Boolean);

  return candidates.some((candidate) => matchesToken(candidate, targetTokens));
};

const AllProductsPage = ({ initialCategory = 'all' }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') ?? initialCategory;
  const skintoneFilter = normalizeForMatch(searchParams.get('skintone'));
  const occasionFilter = normalizeForMatch(searchParams.get('occasion'));

  const { products: catalogProducts, ensureCollectionProducts } = useCatalog();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('recommended');

  // Load products based on category (collection handle)
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    async function loadProducts() {
      if (activeCategory === 'all') {
        // If 'all', use the default catalog products
        if (catalogProducts?.length) {
          if (!cancelled) {
            setProducts(catalogProducts);
            setLoading(false);
          }
        } else {
          // Wait for catalog to load or fetch all
          // Assuming useCatalog loads initial products
          if (!cancelled) setLoading(false);
        }
      } else {
        // Fetch specific collection
        try {
          const collectionProducts = await ensureCollectionProducts(activeCategory);
          if (!cancelled) {
            setProducts(collectionProducts);
          }
        } catch (e) {
          console.error(`Failed to load collection: ${activeCategory}`, e);
          // Fallback to empty or all products if needed
          if (!cancelled) setProducts([]);
        } finally {
          if (!cancelled) setLoading(false);
        }
      }
    }

    loadProducts();

    return () => { cancelled = true; };
  }, [activeCategory, catalogProducts, ensureCollectionProducts]);

  // Update products when catalogProducts changes if we are in 'all' mode
  useEffect(() => {
    if (activeCategory === 'all' && catalogProducts?.length) {
      setProducts(catalogProducts);
      setLoading(false);
    }
  }, [catalogProducts, activeCategory]);


  const sortedProducts = useMemo(() => {
    const applySkintone = skintoneFilter && skintoneFilter !== 'all';
    const applyOccasion = occasionFilter && occasionFilter !== 'all';
    let filtered = products;
    if (applySkintone || applyOccasion) {
      filtered = products.filter((product) => {
        const matchesSkintone = applySkintone
          ? productMatchesFilter(product, skintoneFilter)
          : true;
        const matchesOccasion = applyOccasion
          ? productMatchesFilter(product, occasionFilter)
          : true;
        return matchesSkintone && matchesOccasion;
      });
    }

    let sorted = [...filtered];
    if (sortBy === 'price_low') {
      sorted.sort((a, b) => (a?.price ?? 0) - (b?.price ?? 0));
    } else if (sortBy === 'price_high') {
      sorted.sort((a, b) => (b?.price ?? 0) - (a?.price ?? 0));
    } else if (sortBy === 'new') {
      // Mock sort for newness if date not available, or use id
      sorted.sort((a, b) => String(b?.id || '').localeCompare(String(a?.id || '')));
    }
    return sorted.map(toProductCard).filter(Boolean);
  }, [products, sortBy, skintoneFilter, occasionFilter]);

  const updateFilter = (key, value) => {
    const prev = new URLSearchParams(searchParams);
    if (!value || value === 'all') {
      prev.delete(key);
    } else {
      prev.set(key, value);
    }
    setSearchParams(prev);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Mobile Header */}
      <MobilePageHeader
        title={activeCategory === 'all' ? 'All Products' : activeCategory}
        onSearch={() => document.dispatchEvent(new CustomEvent('open-search'))}
      />

      {/* Breadcrumb / Title Header - Desktop Only */}
      <div className="hidden lg:flex site-shell py-6 flex-col gap-2">
        <div className="text-xs text-gray-500">
          Home / <span className="font-bold text-gray-800 capitalize">{activeCategory}</span>
        </div>
        <h1 className="text-lg font-bold text-gray-800 capitalize">
          {activeCategory === 'all' ? 'All Products' : activeCategory} <span className="text-gray-400 font-normal text-sm">- {sortedProducts.length} items</span>
        </h1>
      </div>

      {/* Filter Bar */}
      <div className="border-t border-b border-gray-200 bg-white">
        <div className="site-shell py-3 flex justify-between items-center gap-4">
          {/* Left: Filters */}
          <div className="flex items-center gap-2 md:gap-4 overflow-x-auto no-scrollbar whitespace-nowrap flex-1">

            {/* Skin Tone Filter */}
            <div className="relative group">
              <button className={`flex items-center gap-1 text-sm font-bold px-4 py-2 rounded-full transition-colors whitespace-nowrap ${skintoneFilter ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}>
                {skintoneFilter ? `Skin: ${skintoneFilter}` : 'Skin Tone'} <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-gray-100 shadow-lg py-2 hidden group-hover:block z-40 rounded-lg">
                <button onClick={() => updateFilter('skintone', 'all')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50">All</button>
                <button onClick={() => updateFilter('skintone', 'fair')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Fair</button>
                <button onClick={() => updateFilter('skintone', 'neutral')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Neutral</button>
                <button onClick={() => updateFilter('skintone', 'dark')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Dark</button>
              </div>
            </div>

            {/* Occasion Filter */}
            <div className="relative group">
              <button className={`flex items-center gap-1 text-sm font-bold px-4 py-2 rounded-full transition-colors whitespace-nowrap ${occasionFilter ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}>
                {occasionFilter ? `Occasion: ${occasionFilter}` : 'Occasion'} <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-100 shadow-lg py-2 hidden group-hover:block z-40 rounded-lg">
                <button onClick={() => updateFilter('occasion', 'all')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50">All</button>
                <button onClick={() => updateFilter('occasion', 'date')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Date Wear</button>
                <button onClick={() => updateFilter('occasion', 'office')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Office Wear</button>
                <button onClick={() => updateFilter('occasion', 'puja')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Puja/Festive</button>
                <button onClick={() => updateFilter('occasion', 'party')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Party</button>
                <button onClick={() => updateFilter('occasion', 'casual')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Casual</button>
              </div>
            </div>

            {/* Clear Filters */}
            {(skintoneFilter || occasionFilter) && (
              <button
                onClick={() => setSearchParams(new URLSearchParams())}
                className="text-xs text-red-600 font-bold hover:underline"
              >
                Reset
              </button>
            )}

          </div>

          {/* Right: Sort - Fixed width/shrink */}
          <div className="flex-shrink-0 flex items-center gap-2 border border-gray-200 px-3 py-2 rounded-sm cursor-pointer hover:border-gray-400 relative group">
            <span className="text-sm text-gray-500 hidden sm:inline">Sort by:</span>
            <span className="text-sm font-bold text-gray-800 capitalize">{sortBy.replace('_', ' ')}</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />

            <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-gray-100 shadow-lg py-2 hidden group-hover:block z-40">
              <button onClick={() => setSortBy('recommended')} className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${sortBy === 'recommended' ? 'font-bold bg-gray-50' : ''}`}>Recommended</button>
              <button onClick={() => setSortBy('new')} className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${sortBy === 'new' ? 'font-bold bg-gray-50' : ''}`}>What's New</button>
              <button onClick={() => setSortBy('popularity')} className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${sortBy === 'popularity' ? 'font-bold bg-gray-50' : ''}`}>Popularity</button>
              <button onClick={() => setSortBy('price_low')} className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${sortBy === 'price_low' ? 'font-bold bg-gray-50' : ''}`}>Price: Low to High</button>
              <button onClick={() => setSortBy('price_high')} className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${sortBy === 'price_high' ? 'font-bold bg-gray-50' : ''}`}>Price: High to Low</button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="site-shell py-8">
        {loading ? (
          <div className="flex justify-center py-20 text-gray-500">Loading products...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-10">
            {sortedProducts.length > 0 ? (
              sortedProducts.map((product, index) => (
                <ProductCard key={product.handle || product.id || index} item={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-gray-500">No products found in this category.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProductsPage;
