import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

export default function Navbar() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cartItemCount = 3; // Replace with actual cart context/state
  const isLoggedIn = false; // Replace with auth state
  const { t } = useTranslation();

  return (
    <nav className="bg-white shadow-md px-4 py-3">
      <div className="flex justify-between container mx-auto items-center">
        <Link to="/" className="text-xl font-bold text-black">{t("Shop")}</Link>

        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-700 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <div className='hidden md:flex space-x-4 items-center"'>
          
        </div>

        <div className="hidden md:flex space-x-4 items-center">
          <Link to="/" className="hover:text-blue-500">{t("Home")}</Link>
          <Link to="/favorites" className="hover:text-blue-500">{t("Favorites")}</Link>
          <Link to="/cart" className="hover:text-blue-500">
            {t("Cart")} {cartItemCount > 0 && (<span className="ml-1 text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">{cartItemCount}</span>)}
          </Link>
          {isLoggedIn ? (
            <Link to="/profile" className="hover:text-blue-500">{t("Profile")}</Link>
          ) : (
            <Link to="/login" className="hover:text-blue-500">{t("Login")}</Link>
          )}
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden mt-2 space-y-2">
          <Link to="/" className="block hover:text-blue-500">{t("Home")}</Link>
          <Link to="/favorites" className="block hover:text-blue-500">{t("Favorites")}</Link>
          <Link to="/cart" className="block hover:text-blue-500">
            {t("Cart")} {cartItemCount > 0 && (<span className="ml-1 text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">{cartItemCount}</span>)}
          </Link>
          {isLoggedIn ? (
            <Link to="/profile" className="block hover:text-blue-500">{t("Profile")}</Link>
          ) : (
            <Link to="/login" className="block hover:text-blue-500">{t("Login")}</Link>
          )}
        </div>
      )}
    </nav>
  );
} 