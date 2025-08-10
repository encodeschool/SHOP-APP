import React from 'react';
import { MdSupportAgent } from "react-icons/md";
import { FaFacebookF, FaTelegramPlane, FaWhatsapp, FaInstagram, FaYoutube, FaTiktok } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className='bg-white'>
      <div className="container px-4 py-6 mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Contact & Address */}
        <div>
          <div className="flex items-center">
            <MdSupportAgent className='text-indigo-400' size={60} />
            <div className='ml-4'>
              <p>info@info.com</p>
              <h1 className='text-2xl'>+123 456789</h1>
            </div>
          </div>
          <div className="info text-sm mt-5 mb-10">
            <p className='mb-3 font-bold'>Ganību dambis 36, Rīga, LV-1005</p>
            <p>Mon-Fri: 11:00 – 19:00</p>
            <p>Sat: 11:00 – 15:00</p>
            <p>Sun: Holiday</p>
          </div>
          {/* Social Media Icons */}
          <div className="flex space-x-3 mt-4">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <FaFacebookF className="text-gray-600 hover:text-blue-600" size={20} />
            </a>
            <a href="https://wa.me" target="_blank" rel="noreferrer">
              <FaWhatsapp className="text-gray-600 hover:text-green-500" size={20} />
            </a>
            <a href="https://t.me" target="_blank" rel="noreferrer">
              <FaTelegramPlane className="text-gray-600 hover:text-blue-500" size={20} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <FaInstagram className="text-gray-600 hover:text-pink-500" size={20} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer">
              <FaYoutube className="text-gray-600 hover:text-red-600" size={20} />
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer">
              <FaTiktok className="text-gray-600 hover:text-black" size={20} />
            </a>
          </div>
        </div>

        {/* Shop */}
        <div>
          <h2 className="font-bold mb-3">Shop</h2>
          <ul className="space-y-2 text-sm">
            <li><Link to="/filtered" className="text-gray-600 hover:text-black">Product Catalog</Link></li>
            <li><Link to="/track-order" className="text-gray-600 hover:text-black">Track Your Order</Link></li>
            <li><Link to="/profile" className="text-gray-600 hover:text-black">My Account</Link></li>
            <li><Link to="/delivery-payment" className="text-gray-600 hover:text-black">Delivery & Payment</Link></li>
          </ul>
        </div>

        {/* About Us */}
        <div>
          <h2 className="font-bold mb-3">About Us</h2>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="text-gray-600 hover:text-black">About Us</Link></li>
            <li><Link to="/contact" className="text-gray-600 hover:text-black">Contacts</Link></li>
          </ul>
        </div>

        {/* Regulations */}
        <div>
          <h2 className="font-bold mb-3">Regulations</h2>
          <ul className="space-y-2 text-sm">
            <li><Link to="/terms" className="text-gray-600 hover:text-black">Terms & Conditions</Link></li>
            <li><Link to="/privacy" className="text-gray-600 hover:text-black">Privacy Policy</Link></li>
            <li><Link to="/refund-policy" className="text-gray-600 hover:text-black">Refund and Returns Policy</Link></li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="bg-gray-100 text-center py-4 shadow-inner mt-auto">
        <p className="text-gray-600 text-sm">
          © {new Date().getFullYear()} Shop. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
