import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { ChevronDown } from 'lucide-react';

// We NO LONGER import products from a local file.

const ProductsPage = ({ searchQuery }) => {
  const { category } = useParams();
  
  // This state will hold the original, unfiltered list of products from our server.
  const [allProducts, setAllProducts] = useState([]); 
  
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState(category ? category.charAt(0).toUpperCase() + category.slice(1) : 'All');
  const [priceFilter, setPriceFilter] = useState(10000);
  const [openFilter, setOpenFilter] = useState('category');
  const [isLoading, setIsLoading] = useState(true); // Add a loading state

  // This useEffect hook runs ONCE when the component loads.
  // Its job is to fetch the data from our backend API.
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true); // Start loading
      try {
        // This is the API call to your backend server.
        const response = await fetch('http://localhost:5000/api/products');
        const data = await response.json();
        setAllProducts(data); // We store the original list of products in our state.
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
      setIsLoading(false); // Stop loading
    };

    fetchProducts();
  }, []); // The empty array [] means this effect runs only once.

  // This useEffect hook runs whenever a filter changes.
  // It uses the `allProducts` state (which came from our server) as its source of truth.
  useEffect(() => {
    let products = allProducts;
    
    if (searchQuery && searchQuery.trim() !== '') {
      products = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    } else if (category && categoryFilter === 'All') {
      products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (categoryFilter !== 'All') {
      products = products.filter(p => p.category === categoryFilter);
    }

    products = products.filter(p => p.price <= priceFilter);

    setFilteredProducts(products);
  }, [category, searchQuery, categoryFilter, priceFilter, allProducts]);

  const categories = ['All', 'Sanitary', 'Hardware', 'Paints'];

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="text-center md:text-left mb-8">
        <h1 className="text-4xl font-bold text-gray-800 capitalize">{searchQuery ? `Results for "${searchQuery}"` : (category || 'Our Products')}</h1>
        <p className="text-gray-500 mt-2">Browse our collection of high-quality items.</p>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-1/4 lg:w-1/5">
          <div className="bg-white p-4 rounded-lg shadow-md sticky top-24">
            <h3 className="text-xl font-semibold mb-4 px-2">Filters</h3>
            
            <div className="border-t">
              <button 
                onClick={() => setOpenFilter(openFilter === 'category' ? null : 'category')}
                className="w-full flex justify-between items-center py-3 px-2 text-left font-semibold text-gray-700 hover:bg-gray-50"
              >
                Category
                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openFilter === 'category' ? 'rotate-180' : ''}`} />
              </button>
              {openFilter === 'category' && (
                <div className="py-2 px-2 space-y-1">
                  {categories.map(cat => (
                    <label key={cat} className={`flex items-center gap-2 cursor-pointer p-2 rounded-md transition-colors ${categoryFilter === cat ? 'bg-blue-50 text-blue-700 font-semibold' : 'hover:bg-gray-100'}`}>
                      <input 
                        type="radio" 
                        name="category"
                        value={cat}
                        checked={categoryFilter === cat}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      {cat}
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t">
              <button 
                onClick={() => setOpenFilter(openFilter === 'price' ? null : 'price')}
                className="w-full flex justify-between items-center py-3 px-2 text-left font-semibold text-gray-700 hover:bg-gray-50"
              >
                Price Range
                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openFilter === 'price' ? 'rotate-180' : ''}`} />
              </button>
              {openFilter === 'price' && (
                <div className="py-4 px-2">
                  <input 
                    type="range" min="500" max="10000" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(Number(e.target.value))}
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>₹500</span>
                    <span className="font-bold text-gray-800">₹{priceFilter}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>
        
        <main className="w-full md:w-3/4 lg:w-4/5">
          {isLoading ? (
            <p className="text-center text-gray-500 text-xl mt-8">Loading products...</p>
          ) : filteredProducts.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={{...product, price: `₹${product.price}`}} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 text-xl mt-8">No products match your current filters.</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductsPage;