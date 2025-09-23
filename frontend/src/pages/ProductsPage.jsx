import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { allProducts } from '../data/products.js';

const ProductsPage = ({ searchQuery }) => {
  const { category } = useParams();
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  // The dropdown's state is now initialized based on the URL parameter
  const [categoryFilter, setCategoryFilter] = useState(category ? category.charAt(0).toUpperCase() + category.slice(1) : 'All');
  const [priceFilter, setPriceFilter] = useState(10000);

  useEffect(() => {
    let products = allProducts;

    // Apply search query
    if (searchQuery) {
      products = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // Apply sidebar category filter (this is the source of truth for category filtering)
    if (categoryFilter !== 'All') {
      // THE FIX IS HERE: We now compare the category from our data with the filter state.
      // This single filter handles both the initial URL parameter and subsequent dropdown changes.
      products = products.filter(p => p.category === categoryFilter);
    }

    // Apply price filter
    products = products.filter(p => p.price <= priceFilter);

    setFilteredProducts(products);
  }, [searchQuery, categoryFilter, priceFilter]); // We remove `category` from dependencies, as it's only used for the initial state

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="text-center md:text-left mb-8">
        {/* The title now reflects the selected filter */}
        <h1 className="text-4xl font-bold text-gray-800 capitalize">{category || 'Our Products'}</h1>
        <p className="text-gray-500 mt-2">Browse our collection of high-quality items.</p>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-1/4 lg:w-1/5">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
            <h3 className="text-xl font-semibold mb-4">Filters</h3>
            <div className="mb-6">
              <h4 className="font-semibold mb-2">Category</h4>
              <select 
                className="w-full border-gray-300 rounded-md shadow-sm"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Sanitary">Sanitary</option>
                <option value="Hardware">Hardware</option>
                <option value="Paints">Paints</option>
              </select>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Max Price: ₹{priceFilter}</h4>
              <input 
                type="range" min="500" max="10000" className="w-full"
                value={priceFilter}
                onChange={(e) => setPriceFilter(Number(e.target.value))}
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>₹500</span>
                <span>₹10,000</span>
              </div>
            </div>
          </div>
        </aside>
        <main className="w-full md:w-3/4 lg:w-4/5">
          {filteredProducts.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={{...product, price: `₹${product.price}`}} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 text-xl">No products match your current filters.</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductsPage;