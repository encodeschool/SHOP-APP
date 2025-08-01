import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaPhone, FaMailBulk, FaBars, FaTimes } from "react-icons/fa";

export default function AppBar() {
  const [languageOpen, setLanguageOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-white text-sm border-b shadow-sm">
      <div className="container mx-auto md:px-4 md:py-2 flex justify-between items-center">
        {/* Left Links - Desktop */}
        <div className="hidden md:flex gap-4">
          <Link to="/terms" className="hover:underline">Terms & Conditions</Link>
          <Link to="/delivery" className="hover:underline">Delivery & Payment</Link>
          <Link to="/about" className="hover:underline">About Us</Link>
          <Link to="/contacts" className="hover:underline">Contacts</Link>
        </div>

        {/* Right - Desktop */}
        <div className="hidden md:flex items-center gap-4">
          <span className="flex items-center">
            <FaPhone className="mr-1" />
            <b>+371 22164949</b>
          </span>
          <span className="flex items-center">
            <FaMailBulk className="mr-1" />
            <b>4games@4games.lv</b>
          </span>
          <Link to="/track-order" className="hover:underline">Track Your Order</Link>

          {/* My Account Dropdown */}
          <div className="relative">
            <button onClick={() => setAccountOpen(!accountOpen)} className="hover:underline">
              My Account
            </button>
            {accountOpen && (
              <div className="absolute right-0 mt-1 bg-white shadow-md border rounded z-10 w-40">
                <Link to="/login" className="block px-4 py-2 hover:bg-gray-100">Login</Link>
                <Link to="/register" className="block px-4 py-2 hover:bg-gray-100">Register</Link>
                <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
              </div>
            )}
          </div>

          {/* Language Dropdown */}
          <div className="relative">
            <button onClick={() => setLanguageOpen(!languageOpen)} className="hover:underline">
              English
            </button>
            {languageOpen && (
              <div className="absolute right-0 mt-1 bg-white shadow-md border rounded z-10 w-32">
                <button className="block px-4 py-2 hover:bg-gray-100">Latviešu</button>
                <button className="block px-4 py-2 hover:bg-gray-100">Русский</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3">
          <Link to="/terms" className="block hover:underline">Terms & Conditions</Link>
          <Link to="/delivery" className="block hover:underline">Delivery & Payment</Link>
          <Link to="/about" className="block hover:underline">About Us</Link>
          <Link to="/contacts" className="block hover:underline">Contacts</Link>

          <div className="flex items-center">
            <FaPhone className="mr-2" />
            <u>+371 22164949</u>
          </div>
          <div className="flex items-center">
            <FaMailBulk className="mr-2" />
            <u>4games@4games.lv</u>
          </div>

          <Link to="/track-order" className="block hover:underline">Track Your Order</Link>

          {/* My Account Dropdown (Mobile) */}
          <div>
            <button onClick={() => setAccountOpen(!accountOpen)} className="hover:underline">
              My Account
            </button>
            {accountOpen && (
              <div className="mt-1 bg-white shadow-md border rounded w-full">
                <Link to="/login" className="block px-4 py-2 hover:bg-gray-100">Login</Link>
                <Link to="/register" className="block px-4 py-2 hover:bg-gray-100">Register</Link>
                <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
              </div>
            )}
          </div>

          {/* Language Dropdown (Mobile) */}
          <div>
            <button onClick={() => setLanguageOpen(!languageOpen)} className="hover:underline">
              English
            </button>
            {languageOpen && (
              <div className="mt-1 bg-white shadow-md border rounded w-full">
                <button className="block px-4 py-2 hover:bg-gray-100">Latviešu</button>
                <button className="block px-4 py-2 hover:bg-gray-100">Русский</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
