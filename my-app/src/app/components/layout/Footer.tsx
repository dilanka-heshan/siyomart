'use client';

import Link from 'next/link';
import { Mail, MapPin, Phone, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-12">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold text-amber-600 mb-4">SiyoMart</h3>
            <p className="text-gray-600 text-sm mb-4">
              SiyoMart is a premier online marketplace for authentic Sri Lankan products,
              connecting local artisans and businesses with customers worldwide.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-amber-600">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-amber-600">
                <Instagram size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-amber-600">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/shop" className="text-gray-600 hover:text-amber-600 text-sm">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-amber-600 text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-amber-600 text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-amber-600 text-sm">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-medium mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-amber-600 text-sm">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-600 hover:text-amber-600 text-sm">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-600 hover:text-amber-600 text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-amber-600 text-sm">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="font-medium mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 text-amber-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600 text-sm">
                  123 Main Street, Colombo 04, Sri Lanka
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 text-amber-600 flex-shrink-0" />
                <span className="text-gray-600 text-sm">+94 11 234 5678</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 text-amber-600 flex-shrink-0" />
                <span className="text-gray-600 text-sm">support@siyomart.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 mb-4 md:mb-0">
              © {currentYear} SiyoMart. All rights reserved.
            </p>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">Payment Methods:</span>
              <div className="flex space-x-2">
                {/* Replace these with actual payment method icons or names */}
                <div className="bg-gray-200 text-xs px-2 py-1 rounded">Visa</div>
                <div className="bg-gray-200 text-xs px-2 py-1 rounded">MasterCard</div>
                <div className="bg-gray-200 text-xs px-2 py-1 rounded">PayPal</div>
                <div className="bg-gray-200 text-xs px-2 py-1 rounded">Cash on Delivery</div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Subscription - Optional */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="font-medium mb-2">Subscribe to our Newsletter</h3>
              <p className="text-sm text-gray-600">
                Stay updated with our latest products and offers.
              </p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 border border-gray-300 rounded-l-md w-full focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button className="bg-amber-600 text-white px-4 py-2 rounded-r-md hover:bg-amber-700 transition duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
