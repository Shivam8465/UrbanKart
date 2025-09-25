import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-12">
      <div className="container mx-auto text-center">
        {/* NAME CHANGE */}
        <p>&copy; {new Date().getFullYear()} UrbanKart. All rights reserved.</p>
        <div className="mt-2 space-x-4">
          <Link to="/about" className="hover:text-blue-400">About</Link>
          <Link to="/contact" className="hover:text-blue-400">Contact</Link>
          <Link to="/products" className="hover:text-blue-400">Products</Link>
        </div>
      </div>
    </footer>
  );
}