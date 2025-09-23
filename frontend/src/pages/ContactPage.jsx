import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

const ContactPage = () => {
  return (
    <div className="container mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">Contact Us</h1>
        <p className="text-lg text-gray-600 mt-4">We'd love to hear from you. Reach out with any questions.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 bg-white p-8 rounded-lg shadow-lg">
        {/* Contact Info */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Get In Touch</h2>
            <div className="flex items-center gap-4 text-gray-600 mb-4">
              <MapPin className="w-6 h-6 text-blue-600" />
              <span>123 Fixit Lane, Builderville, IN 46032</span>
            </div>
            <div className="flex items-center gap-4 text-gray-600 mb-4">
              <Phone className="w-6 h-6 text-blue-600" />
              <span>(555) 123-4567</span>
            </div>
            <div className="flex items-center gap-4 text-gray-600">
              <Mail className="w-6 h-6 text-blue-600" />
              <span>contact@nexfix.com</span>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Send a Message</h2>
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" id="name" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input type="email" id="email" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
              <textarea id="message" rows="4" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;