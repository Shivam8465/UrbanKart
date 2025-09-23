import React, { useState } from 'react'; // 1. Import useState
import { Link } from 'react-router-dom';
import { ShoppingCart, Check } from 'lucide-react'; // 2. Import the Check icon
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  // 3. State to track the "added" status
  const [wasAdded, setWasAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    
    // 4. Set status to true and reset after 1.5 seconds
    setWasAdded(true);
    setTimeout(() => {
      setWasAdded(false);
    }, 1500);
  };

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="bg-white overflow-hidden rounded-xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
        {/* ... (image div is the same) ... */}
        <div className="relative overflow-hidden">
            <img src={product.image} alt={product.name} className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-110"/>
            <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h3>
          <p className="text-blue-600 font-bold mt-2 text-xl">{product.price}</p>
          <div className="flex-grow"></div>
          {/* 5. Update the button to be dynamic */}
          <button 
            className={`mt-4 w-full flex items-center justify-center gap-2 text-white py-2.5 rounded-lg transform translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ${wasAdded ? 'bg-green-500' : 'bg-slate-800 hover:bg-blue-600'}`}
            onClick={handleAddToCart}
            disabled={wasAdded} // Disable button briefly after click
          >
            {wasAdded ? (
              <>
                <Check className="w-5 h-5" /> Added!
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" /> Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;