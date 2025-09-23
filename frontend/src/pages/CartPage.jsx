import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Plus, Minus, Trash2 } from 'lucide-react';

const CartPage = () => {
  // Get everything we need from our cart context
  const { cartItems, addToCart, decreaseQuantity, removeFromCart, cartTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        <h1 className="text-3xl font-semibold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link 
          to="/products" 
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Shopping Cart</h1>
      <div className="flex flex-col lg:flex-row gap-8">

        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="space-y-4">
            {cartItems.map(item => (
              <div key={item.id} className="flex items-center bg-white p-4 rounded-lg shadow-md">
                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md mr-4" />
                <div className="flex-grow">
                  <h2 className="font-semibold text-lg">{item.name}</h2>
                  <p className="text-gray-600">₹{item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={() => decreaseQuantity(item.id)} className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"><Minus size={16} /></button>
                  <span className="font-semibold">{item.quantity}</span>
                  <button onClick={() => addToCart(item)} className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"><Plus size={16} /></button>
                </div>
                <div className="text-right ml-6 w-24">
                  <p className="font-bold text-lg">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="ml-6 text-red-500 hover:text-red-700">
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
            <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between font-bold text-xl">
              <span>Total</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>
            <button className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold">
              Proceed to Checkout
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CartPage;