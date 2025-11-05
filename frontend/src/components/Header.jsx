import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, User, Menu, X, LogOut, Shield } from "lucide-react";
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Header({ onSearchChange }) {
  const { cartItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const handleSearchInputChange = (event) => {
    if (onSearchChange) {
      onSearchChange(event.target.value);
    }
  };

  const handleSearchSubmit = (event) => {
    if (event.key === 'Enter') {
      navigate('/products');
    }
  };

  return (
    <header className="sticky top-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">UrbanKart</Link>
        
        <nav className="hidden md:flex items-center gap-6 mx-auto">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <Link to="/products" className="hover:text-blue-600">Products</Link>
          <Link to="/about" className="hover:text-blue-600">About</Link>
          <Link to="/contact" className="hover:text-blue-600">Contact</Link>
          <Link to="/orders" className="hover:text-blue-600">My Orders</Link>
          <Link to="/profile" className="hover:text-blue-600">Profile</Link>
          
          {/* ADMIN LINK - ONLY SHOWS FOR ADMINS */}
          {user?.role === 'admin' && (
            <Link 
              to="/admin" 
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-bold flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              Admin Panel
            </Link>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <div className="relative">
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-48 border rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                onChange={handleSearchInputChange}
                onKeyDown={handleSearchSubmit}
              />
              <Search className="absolute left-3 top-2.5 text-gray-500 w-5 h-5" />
          </div>

          <Link to="/cart" aria-label="View shopping cart" className="relative hover:text-blue-600">
            <ShoppingCart className="w-6 h-6" />
            {totalItems > 0 && (<span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{totalItems}</span>)}
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm">Hi, {user.name}</span>
              <button onClick={handleLogout} className="hover:text-blue-600" title="Logout">
                <LogOut className="w-6 h-6" />
              </button>
            </div>
          ) : (
            <Link to="/login" aria-label="Login or Signup" className="hover:text-blue-600">
              <User className="w-6 h-6" />
            </Link>
          )}
        </div>
        
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden focus:outline-none" aria-label="Toggle mobile menu">
          {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>
    </header>
  );
}