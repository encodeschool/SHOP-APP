import React from 'react';
import { MdSupportAgent } from "react-icons/md";
import { FaFacebookF, FaTelegramPlane, FaWhatsapp, FaInstagram, FaYoutube, FaTiktok } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className='bg-white'>
      <div className="container px-4 md:px-10 py-6 mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Contact & Address */}
        <div>
          <div className="flex items-center">
            <MdSupportAgent className='text-red-700' size={60} />
            <div className='ml-4'>
              <p>goshtgo@gmail.com</p>
              <h1 className='text-2xl'>+998 95 777-11-55</h1>
            </div>
          </div>
          <div className="info text-sm mt-5 mb-10">
            <p className='mb-3 font-bold'>Tashkent city, Uzbekistan</p>
            <p>{t("Mon-Fri")}: 11:00 – 19:00</p>
            <p>{t("Sat")}: 11:00 – 15:00</p>
            <p>{t("Sun")}: {t("Holiday")}</p>
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
          <h2 className="font-bold mb-3">{t("Shop")}</h2>
          <ul className="space-y-2 text-sm">
            <li><Link to="/filtered" className="text-gray-600 hover:text-black">{t("Product Catalog")}</Link></li>
            <li><Link to="/track" className="text-gray-600 hover:text-black">{t("Track Your Order")}</Link></li>
            <li><Link to="/profile" className="text-gray-600 hover:text-black">{t("My Account")}</Link></li>
            <li><Link to="/delivery-payment" className="text-gray-600 hover:text-black">{t("Delivery & Payment")}</Link></li>
          </ul>
        </div>

        {/* About Us */}
        <div>
          <h2 className="font-bold mb-3">{t("About Us")}</h2>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="text-gray-600 hover:text-black">{t("About Us")}</Link></li>
            <li><Link to="/contacts" className="text-gray-600 hover:text-black">{t("Contacts")}</Link></li>
          </ul>
        </div>

        {/* Regulations */}
        <div>
          <h2 className="font-bold mb-3">{t("Regulations")}</h2>
          <ul className="space-y-2 text-sm">
            <li><Link to="/terms" className="text-gray-600 hover:text-black">{t("Terms & Conditions")}</Link></li>
            <li><Link to="/privacy" className="text-gray-600 hover:text-black">{t("Privacy Policy")}</Link></li>
            <li><Link to="/refund-policy" className="text-gray-600 hover:text-black">{t("Refund and Returns Policy")}</Link></li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="bg-gray-100 text-center py-4 shadow-inner mt-auto">
        <p className="text-gray-600 text-sm">
          © {new Date().getFullYear()} {t("Shop. All rights reserved.")}
        </p>
      </div>
    </footer>
  );
}
