import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Search, User, Menu, X } from "lucide-react";

// 1. Import the useCart hook
import { useCart } from '../context/CartContext';

export default function Header({ onSearchChange }) {
  // 2. Get the cartItems from the context
  const { cartItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // 3. Calculate the total number of items by summing their quantities
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* ... Logo, Search Bar ... */}
        <Link to="/" className="text-2xl font-bold text-blue-600">NexFix</Link>
        {/* ... (The search bar code remains the same) ... */}
        <div className="hidden md:flex flex-1 mx-6">
            <div className="relative w-full max-w-lg">
                <input type="text" placeholder="Search for products..." className="w-full border rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={handleSearchInputChange}/>
                <Search className="absolute left-3 top-2.5 text-gray-500 w-5 h-5" />
            </div>
        </div>


        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <Link to="/products" className="hover:text-blue-600">Products</Link>
          <Link to="/about" className="hover:text-blue-600">About</Link>
          <Link to="/contact" className="hover:text-blue-600">Contact</Link>
          
          {/* 4. Update the Shopping Cart Link */}
          <Link to="/cart" aria-label="View shopping cart" className="relative hover:text-blue-600">
            <ShoppingCart className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          <Link to="/profile" aria-label="View user profile" className="hover:text-blue-600">
            <User className="w-6 h-6" />
          </Link>
        </nav>
        
        {/* ... (Mobile Menu Button and Dropdown code remains the same, but we update the icon there too) ... */}
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden focus:outline-none" aria-label="Toggle mobile menu">
            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md px-6 py-4 space-y-4">
            {/* ... (Mobile Search and Nav Links remain the same) ... */}
            <div className="relative"><input type="text" placeholder="Search..." className="w-full border rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={handleSearchInputChange}/><Search className="absolute left-3 top-2.5 text-gray-500 w-5 h-5" /></div>
            <nav className="flex flex-col space-y-3"><Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link><Link to="/products" onClick={() => setMobileMenuOpen(false)}>Products</Link><Link to="/about" onClick={() => setMobileMenuOpen(false)}>About</Link><Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link></nav>
            
            {/* Mobile Icons */}
            <div className="flex space-x-6 pt-4">
                {/* 5. Update the Mobile Shopping Cart Link */}
                <Link to="/cart" aria-label="View shopping cart" className="relative hover:text-blue-600">
                    <ShoppingCart className="w-6 h-6" />
                    {totalItems > 0 && (
                        <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {totalItems}
                        </span>
                    )}
                </Link>
                <Link to="/profile" aria-label="View user profile" className="hover:text-blue-600">
                    <User className="w-6 h-6" />
                </Link>
            </div>
        </div>
      )}
    </header>
  );
}