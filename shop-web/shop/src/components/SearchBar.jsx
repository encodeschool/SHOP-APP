import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaSyncAlt,
  FaHeart,
  FaShoppingBag,
  FaSearch,
  FaBars,
  FaTimes,
  FaPhone, FaMailBulk
} from "react-icons/fa";
import { useSelector } from 'react-redux';

export default function SearchAppBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const cartItems = useSelector((state) => state.cart.items);
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);


  return (
    <header className="bg-white border-b shadow-sm w-full">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        {/* Logo + Hamburger */}
        <div className="flex items-center gap-4">
          <Link to="/" className="text-xl font-bold">
            Shop
          </Link>
          <button
            className="md:hidden text-xl ml-auto"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Search bar: Desktop only */}
        <div className="hidden md:flex flex-1 mx-6 max-w-3xl">
          <input
            type="text"
            placeholder="Search for Products"
            className="flex-1 px-4 py-2 rounded-l-full border-2 border-indigo-400 focus:outline-none"
          />
          <button className="bg-indigo-400 px-4 rounded-r-full text-white">
            <FaSearch />
          </button>
        </div>

        {/* Icons: Desktop only */}
        <div className="hidden md:flex items-center gap-6 text-gray-700">
          <Link to="/compare">
            <FaSyncAlt size={25} className="cursor-pointer" />
          </Link>
          <Link to="/favorites">
            <FaHeart size={25} className="cursor-pointer" />
          </Link>
          <Link to="/cart" className="relative flex items-center">
            <FaShoppingBag size={25} className="mr-1" />
            {totalQuantity > 0 && (
              <span className="absolute -bottom-3 left-[15px] bg-indigo-400 text-white rounded-full px-2 p-1 text-xs font-bold">
                {totalQuantity}
              </span>
            )}
            <span className="ml-2 text-xl">€{totalPrice.toFixed(2)}</span>
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pb-4">
          <div className="flex flex-col gap-3 items-start text-gray-700">
            <Link to="/search" className="flex items-center gap-2">
              <FaSearch /> Search
            </Link>
            <Link to="/favorites" className="flex items-center gap-2">
              <FaHeart /> Favorites
            </Link>
            <Link to="/cart" className="flex items-center gap-2 relative">
              <FaShoppingBag />
              <span>Cart</span>
              <span className="absolute -top-2 -right-3 bg-indigo-400 text-white text-xs font-bold px-1.5 rounded-full">
                0
              </span>
            </Link>
            <Link to="/compare">
              <div className="flex items-center gap-2">
                <FaSyncAlt /> Sync
              </div>
            </Link>
          </div>
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
    </header>
  );
}
