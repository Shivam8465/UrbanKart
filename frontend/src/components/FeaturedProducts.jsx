import React from 'react';
import ProductCard from './ProductCard';
import { allProducts } from '../data/products.js'; // Import from central data

const FeaturedProducts = () => {
  // Filter the main list to get only featured products
  const featured = allProducts.filter(p => p.featured);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Our Featured Products</h2>
            <p className="text-gray-500 mt-2">Bestsellers loved by our customers.</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={{...product, price: `₹${product.price}`}} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;