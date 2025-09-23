import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

// THIS EXPORT IS CRITICAL
export const useCart = () => {
  return useContext(CartContext);
};

// THIS EXPORT IS ALSO CRITICAL
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        const priceAsNumber = typeof product.price === 'string' 
          ? Number(String(product.price).replace(/[^0-9.-]+/g,"")) 
          : product.price;

        const newItem = {
          id: product.id,
          name: product.name,
          image: product.image,
          price: priceAsNumber,
          quantity: 1
        };
        return [...prevItems, newItem];
      }
    });
  };

  const decreaseQuantity = (productId) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === productId);
      if (existingItem && existingItem.quantity === 1) {
        return prevItems.filter(item => item.id !== productId);
      } else if (existingItem) {
        return prevItems.map(item =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return prevItems;
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const value = {
    cartItems,
    addToCart,
    decreaseQuantity,
    removeFromCart,
    cartTotal,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};