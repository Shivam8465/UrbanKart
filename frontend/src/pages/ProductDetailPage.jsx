import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { allProducts } from '../data/products.js';
import StarRating from '../components/StarRating'; // Import the new component

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

  // Calculate average rating
  const averageRating = product?.reviews.length > 0
    ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
    : 0;

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
          <h1 className="text-4xl font-bold text-gray-800 my-2">{product.name}</h1>
          
          {/* Average Rating */}
          <div className="flex items-center gap-2 mb-4">
            <StarRating rating={averageRating} />
            <span className="text-gray-500">({product.reviews.length} reviews)</span>
          </div>

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

      {/* Customer Reviews Section */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Customer Reviews</h2>
        {product.reviews.length > 0 ? (
          <div className="space-y-6">
            {product.reviews.map((review, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{review.author}</span>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
                <StarRating rating={review.rating} />
                <p className="text-gray-600 mt-2">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">There are no reviews for this product yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;