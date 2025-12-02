import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useCatalog } from '../contexts/catalog-context';
import { toProductCard } from '../lib/shopify';

const AllProductsPage = ({ initialCategory = 'all' }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const activeCategory = searchParams.get('category') ?? initialCategory;

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
            setProducts(catalogProducts.map(toProductCard));
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
            setProducts(collectionProducts.map(toProductCard));
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
      setProducts(catalogProducts.map(toProductCard));
      setLoading(false);
    }
  }, [catalogProducts, activeCategory]);


  const sortedProducts = useMemo(() => {
    let sorted = [...products];
    if (sortBy === 'price_low') {
      sorted.sort((a, b) => parseFloat(a.price.replace(/[^0-9.]/g, '')) - parseFloat(b.price.replace(/[^0-9.]/g, '')));
    } else if (sortBy === 'price_high') {
      sorted.sort((a, b) => parseFloat(b.price.replace(/[^0-9.]/g, '')) - parseFloat(a.price.replace(/[^0-9.]/g, '')));
    } else if (sortBy === 'new') {
      // Mock sort for newness if date not available, or use id
      sorted.sort((a, b) => b.id.localeCompare(a.id));
    }
    return sorted;
  }, [products, sortBy]);

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb / Title Header */}
      <div className="site-shell py-6 flex flex-col gap-2">
        <div className="text-xs text-gray-500">
          Home / <span className="font-bold text-gray-800 capitalize">{activeCategory}</span>
        </div>
        <h1 className="text-lg font-bold text-gray-800 capitalize">
          {activeCategory === 'all' ? 'All Products' : activeCategory} <span className="text-gray-400 font-normal text-sm">- {sortedProducts.length} items</span>
        </h1>
      </div>

      {/* Filter Bar */}
      <div className="border-t border-b border-gray-200 sticky top-20 bg-white z-30">
        <div className="site-shell py-3 flex justify-between items-center">
          {/* Left: Filters (Mock) */}
          <div className="flex items-center gap-4">
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm font-bold text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-full transition-colors">
                Bundles <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm font-bold text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-full transition-colors">
                Country of Origin <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm font-bold text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-full transition-colors">
                Size <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right: Sort */}
          <div className="flex items-center gap-2 border border-gray-200 px-3 py-2 rounded-sm cursor-pointer hover:border-gray-400 relative group">
            <span className="text-sm text-gray-500">Sort by:</span>
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
              sortedProducts.map((product) => (
                <ProductCard key={product.id} item={product} />
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
