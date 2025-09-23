import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { allProducts } from '../data/products.js'; // Import from central data

const ProductDetailPage = () => {
  const { productId } = useParams();
  const { addToCart } = useCart();
  const [wasAdded, setWasAdded] = useState(false);

  const product = allProducts.find(p => p.id === productId);

  const handleAddToCart = () => {
    addToCart(product);
    setWasAdded(true);
    setTimeout(() => { setWasAdded(false); }, 1500);
  };

  if (!product) {
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        <h1 className="text-3xl font-semibold mb-4">Product Not Found</h1>
        <Link to="/products" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-1/2">
          <img src={product.image} alt={product.name} className="w-full h-auto object-cover rounded-lg shadow-lg" />
        </div>
        <div className="lg:w-1/2">
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{product.category}</span>
          <h1 className="text-4xl font-bold text-gray-800 my-4">{product.name}</h1>
          <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
          <div className="text-3xl font-bold text-blue-600 mb-8">
            ₹{product.price.toFixed(2)}
          </div>
          <button 
            onClick={handleAddToCart}
            disabled={wasAdded}
            className={`w-full md:w-auto text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors ${wasAdded ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {wasAdded ? 'Added to Cart!' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;