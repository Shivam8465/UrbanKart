// src/components/Footer.jsx
import React from "react";
export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-12">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} NexFix. All rights reserved.</p>
        <div className="mt-2 space-x-4">
          <a href="/about" className="hover:text-blue-400">About</a>
          <a href="/contact" className="hover:text-blue-400">Contact</a>
          <a href="/products" className="hover:text-blue-400">Products</a>
        </div>
      </div>
    </footer>
  );
}
