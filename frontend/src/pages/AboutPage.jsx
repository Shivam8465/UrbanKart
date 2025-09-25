import React from 'react';
import { Target, Eye, ShieldCheck } from 'lucide-react';

const AboutPage = () => {
  return (
    <div>
      {/* Page Header */}
      <section className="bg-blue-50 py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">About UrbanKart</h1>
          <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
            Your trusted partner in building, renovating, and perfecting your projects with high-quality supplies.
          </p>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <img 
              src="https://placehold.co/600x400/e2e8f0/334155?text=Our+Store" 
              alt="UrbanKart Storefront" 
              className="rounded-lg shadow-2xl"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              At UrbanKart, our mission is to empower every builder, creator, and homeowner by providing an unparalleled selection of sanitary ware, hardware, and paints. We are committed to quality, affordability, and expert guidance, ensuring every project is a success.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We believe in building lasting relationships with our customers by being the most reliable and knowledgeable source for all their project needs.
            </p>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Our Core Values</h2>
            <p className="text-gray-500 mt-2">The principles that guide our business.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <ShieldCheck className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Quality First</h3>
              <p className="text-gray-500">We source and provide only the most durable and reliable products.</p>
            </div>
            <div className="p-6">
              <Target className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Customer Focus</h3>
              <p className="text-gray-500">Your project's success is our highest priority. We're here to help.</p>
            </div>
            <div className="p-6">
              <Eye className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Integrity</h3>
              <p className="text-gray-500">We believe in honest pricing and transparent service, always.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;