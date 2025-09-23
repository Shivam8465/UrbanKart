// src/pages/HomePage.jsx
import React from "react";
import Hero from "../components/Hero.jsx";
import CategoryCards from "../components/CategoryCards.jsx";
import FeaturedProducts from "../components/FeaturedProducts.jsx";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <CategoryCards />
      <FeaturedProducts />
    </div>
  );
}