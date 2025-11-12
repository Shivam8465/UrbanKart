import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, accessToken, authenticatedFetch } = useAuth();

  // Load cart from backend when user logs in
  useEffect(() => {
    if (user && accessToken) {
      loadCartFromBackend();
    } else {
      // Clear cart when user logs out
      setCartItems([]);
    }
  }, [user, accessToken]);

  // Load cart from backend
  const loadCartFromBackend = async () => {
    if (!accessToken) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/cart`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Transform backend format to frontend format
        const formattedItems = data.items.map(item => ({
          id: item.productId,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: item.quantity
        }));
        setCartItems(formattedItems);
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add to cart
  const addToCart = async (product) => {
    // If user is not logged in, show alert
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }

    // Prevent admins from adding to cart
    if (user.role === 'admin') {
      alert('Admin accounts cannot add items to cart. This account is for managing the store only.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update local state
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

        console.log('✅ Added to cart:', product.name);
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to add item to cart');
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      alert('Network error. Please try again.');
    }
  };

  // Decrease quantity
  const decreaseQuantity = async (productId) => {
    if (!user) return;

    const item = cartItems.find(item => item.id === productId);
    if (!item) return;

    const newQuantity = item.quantity - 1;

    try {
      if (newQuantity === 0) {
        // Remove item if quantity becomes 0
        await removeFromCart(productId);
      } else {
        // Update quantity in backend
        const response = await fetch(`${API_URL}/cart/update`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            productId: productId,
            quantity: newQuantity
          })
        });

        if (response.ok) {
          // Update local state
          setCartItems(prevItems =>
            prevItems.map(item =>
              item.id === productId ? { ...item, quantity: newQuantity } : item
            )
          );
        }
      }
    } catch (error) {
      console.error('Decrease quantity error:', error);
      alert('Network error. Please try again.');
    }
  };

  // Remove from cart
  const removeFromCart = async (productId) => {
    if (!user) return;

    try {
      const response = await fetch(`${API_URL}/cart/remove/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.ok) {
        // Update local state
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
        console.log('✅ Removed from cart');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to remove item from cart');
      }
    } catch (error) {
      console.error('Remove from cart error:', error);
      alert('Network error. Please try again.');
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    if (!user) return;

    try {
      const response = await fetch(`${API_URL}/cart/clear`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.ok) {
        setCartItems([]);
        console.log('✅ Cart cleared');
      }
    } catch (error) {
      console.error('Clear cart error:', error);
      alert('Network error. Please try again.');
    }
  };

  // Calculate cart total
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const value = {
    cartItems,
    loading,
    addToCart,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    loadCartFromBackend
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};