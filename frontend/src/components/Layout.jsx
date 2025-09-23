import React from 'react';
import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children, onSearchChange }) { 
  return (
    <div className="flex flex-col min-h-screen">
      <Header onSearchChange={onSearchChange} /> 
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}