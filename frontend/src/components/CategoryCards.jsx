import React from 'react';
import { Link } from 'react-router-dom';
import CategoryIcon from './CategoryIcon.jsx';

const CategoryCards = () => {
  const categories = [
    { name: "Sanitary", link: "/products/sanitary" },
    { name: "Hardware", link: "/products/hardware" },
    { name: "Paints", link: "/products/paints" },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Shop by Category</h2>
          <p className="text-gray-500 mt-2">Find exactly what you're looking for.</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <Link to={cat.link} key={cat.name} className="group block">
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-8 text-center transition-all duration-300 hover:bg-blue-600 hover:shadow-2xl hover:-translate-y-2">
                <div className="flex items-center justify-center h-24 w-24 mx-auto bg-white rounded-full shadow-md mb-6 group-hover:bg-blue-100 transition-colors">
                  <CategoryIcon name={cat.name} className="w-12 h-12 text-blue-500 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 group-hover:text-white">{cat.name}</h3>
                <p className="mt-2 text-blue-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:text-white">Shop Now &rarr;</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryCards;

