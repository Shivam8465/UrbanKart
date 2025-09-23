import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-slate-50 to-blue-100 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-20">
        <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h18v18H3z M21 3l-6 6 M3 21l6-6 M12 3v18 M3 12h18"/></svg>
      </div>
      <div className="container mx-auto px-6 py-24 md:py-32 text-center relative z-10">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 tracking-tight mb-4">
          Your Project, <span className="text-blue-600">Perfected.</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Discover a curated selection of premium sanitary ware, durable hardware, and vibrant paints. Everything you need, all in one place.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
        >
          Explore All Products
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
};

export default Hero;

