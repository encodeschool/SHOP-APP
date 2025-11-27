import React, { useEffect, useState, useRef, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from "react-router-dom";
import {
  FaSyncAlt,
  FaHeart,
  FaShoppingBag,
  FaSearch,
  FaBars,
  FaTimes,
  FaPhone,
  FaMailBulk, 
} from "react-icons/fa";
import { useSelector } from 'react-redux';
import { BsShop } from "react-icons/bs";
import i18n from "../i18n";
import axios from '../api/axios';
import { useLoading } from '../contexts/LoadingContext';
import MegaMenu from './MegaMenu';
import { TbRosetteDiscount, TbRosetteDiscountCheck  } from "react-icons/tb";
import { FaCircleUser } from "react-icons/fa6";
import { AuthContext } from '../contexts/AuthContext';
import { MdLanguage } from "react-icons/md";
import { LanguageContext } from '../contexts/LanguageContext';
import { RiLoginCircleFill } from "react-icons/ri";
import 'flag-icons/css/flag-icons.min.css';
import { BsStars } from "react-icons/bs";
import Logo from '../static/img/logo.png';

const CategoryBar = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const { language, setLanguage } = useContext(LanguageContext);

  const [categories, setCategories] = useState([]);
  // Get localized name from translations or fallback to default name
  const getLocalizedName = (item) => {
    if (!item) return '';
    const lang = i18n.language === 'lv' ? 'en' : i18n.language;
    const translation = item.translations?.find(t => t.language === lang);
    return translation?.name || item.name || 'Unnamed';
  };
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const BASE_URL = process.env.REACT_APP_BASE_URL || '';
  const { setLoading } = useLoading();

  const cartItems = useSelector((state) => state.cart.items);
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm(""); // Optional: reset after search
      setMobileMenuOpen(false); // Optional: close mobile menu
    }
  };

  useEffect(() => {
    setLoading(true);
    const fetchCategories = async () => {
      try {
        const lang = i18n.language === 'lv' ? 'en' : i18n.language;
        const res = await axios.get(`/categories?lang=${lang}`);
        const uniqueCategories = [];
        const seenIds = new Set();
        res.data.forEach((cat) => {
          if (!seenIds.has(cat.id)) {
            seenIds.add(cat.id);
            uniqueCategories.push(cat);
          } else {
            console.warn(`Duplicate category ID detected: ${cat.id}, Name=${cat.name}`);
          }
        });
        const rootCategories = uniqueCategories.filter(
          (cat) => cat.parentId === null && cat.subcategories && cat.subcategories.length > 0
        );
        rootCategories.forEach((cat) => {
          const uniqueSubcategories = [];
          const subSeenIds = new Set();
          cat.subcategories.forEach((sub) => {
            if (!subSeenIds.has(sub.id)) {
              subSeenIds.add(sub.id);
              uniqueSubcategories.push(sub);
            } else {
              console.warn(`Duplicate subcategory ID detected: ${sub.id}, Name=${sub.name}, ParentID=${cat.id}`);
            }
          });
          cat.subcategories = uniqueSubcategories;
        });
        setCategories(rootCategories);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [i18n.language, setLoading]);

  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  // Toggles the desktop MegaMenu
  const toggleDesktopMenu = () => {
    setIsOpen(!isOpen);
  };

  // Toggles the mobile side menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const [user, setUser] = useState({
    fullName: "Admin",
    profileImage: "https://via.placeholder.com/40",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) return;

    const cachedUser = localStorage.getItem("user");
    if (cachedUser) {
    setUser(JSON.parse(cachedUser));
    return;
  }

  axios
        .get(`${BASE_URL}/api/users/${userId}`, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        })
        .then((res) => {
            setUser(res.data);
            localStorage.setItem("user", JSON.stringify(res.data));
        })
        .catch((err) => {
            console.error("Failed to fetch user", err);
        });
    }, [isLoggedIn]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleLanguageChange = (lang) => {
        setLanguage(lang);
        setLanguageOpen(false);
    };

  return (
    <div className="bloody shadow-sm w-full py-3 sticky top-0 z-[99]">
      {/* Desktop Navigation (visible on md and up) */}
      <div className="container mx-auto px-4 md:px-10 py-2 hidden md:flex items-center justify-between">
        <div className="relative group">
          <button
            onClick={toggleDesktopMenu}
            className="flex items-center text-red-600 text-base font-medium p-3 bg-white px-6 rounded-md transition-all"
          >
            {(!isOpen ?
              <span className="transition-transform duration-300 transform uppercase flex items-center">
                <FaBars className='mr-3' /> {t('Catalogue')}
              </span>
              :
              <span className="transition-transform duration-300 transform uppercase flex items-center">
                <FaTimes className='mr-3' /> {t('Catalogue')}
              </span>
            )}
          </button>
          {/* Tooltip for the category toggle button */}
          <div className="absolute top-full bg-white left-1/2 -translate-x-1/2 mt-2 px-3 py-1  text-red-500 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-[101]">
            {isOpen ? t('Close Categories') : t('Open Categories')}
          </div>
        </div>
        <div className="flex ml-6">
          <TbRosetteDiscount size={50} className="text-white mr-1" />
          <Link to='/ai'>
            <BsStars size={40} className="text-white ml-4" />
          </Link>
        </div>
        <div className="flex-1 mx-6 max-w-3xl flex">
          <input
            type="text"
            placeholder={t("Search for Products")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 px-4 py-2 rounded-l-xl border-[4px] border border-white focus:outline-none"
          />
          <button onClick={handleSearch} className="bg-white text-red-500 px-4 rounded-r-xl text-white md:text-red-800 transition-all ">
            <FaSearch />
          </button>
        </div>
        <div className="flex items-center gap-6 text-white">
          <div className="relative group">
            {!isLoggedIn ?
              (
                <Link to="/login" title="Compare Products">
                  <RiLoginCircleFill   size={29} className="cursor-pointer  transition-colors" />
                </Link>
              ) : (
                <Link to="/profile" title="Compare Products">
                  <FaCircleUser  size={29} className="cursor-pointer  transition-colors" />
                </Link>
              )
            }
            {/* Tooltip for compare link */}
            <div className="absolute top-full bg-white left-1/2 -translate-x-1/2 mt-2 px-3 py-1 text-red-500 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-[101]">
              {isLoggedIn ? (
                <>
                  {user.name}
                </>
              ) : (
                <p>{t('My Account')}</p>
              )}
            </div>
          </div>
          <div className="relative group">
            <div onClick={() => setLanguageOpen(!languageOpen)} className="hover:underline">
              <MdLanguage size={35} className="cursor-pointer  transition-colors" />
            </div>
            {languageOpen && (
              <div className="absolute right-0 mt-1 bg-white text-red-800 shadow-md border rounded z-[101]">
                <button onClick={() => handleLanguageChange('en')} className="flex items-center w-[100%] gap-2 px-4 py-2 hover:bg-gray-100">
                  <span className="fi fi-us"></span> English
                </button>
                {/* <button onClick={() => handleLanguageChange('lv')} className="flex items-center w-[100%] gap-2 px-4 py-2 hover:bg-gray-100">
                  <span className="fi fi-lv"></span> Latvian
                </button> */}
                <button onClick={() => handleLanguageChange('ru')} className="flex items-center w-[100%] gap-2 px-4 py-2 hover:bg-gray-100">
                  <span className="fi fi-ru"></span> Russian
                </button>
                <button onClick={() => handleLanguageChange('uz')} className="flex items-center w-[100%] gap-2 px-4 py-2 hover:bg-gray-100">
                  <span className="fi fi-uz"></span> Uzbek
                </button>
              </div>
            )}
            {/* Tooltip for compare link */}
            <div className="absolute top-full bg-white left-1/2 -translate-x-1/2 mt-2 px-3 py-1 text-red-500 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-[101]">
              {language === 'en' ? 'English' : language === 'ru' ? 'Russian' : language === 'uz' ? 'Uzbek' : 'Latvian'}
            </div>
          </div>
          <div className="relative group">
            <Link to="/compare" title="Compare Products">
              <FaSyncAlt size={25} className="cursor-pointer  transition-colors" />
            </Link>
            {/* Tooltip for compare link */}
            <div className="absolute top-full bg-white left-1/2 -translate-x-1/2 mt-2 px-3 py-1 text-red-500 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-[101]">
              {t('Compare Products')}
            </div>
          </div>
          <div className="relative group">
            <Link to="/favorites" title="My Favorites">
              <FaHeart size={25} className="cursor-pointer  transition-colors" />
            </Link>
            {/* Tooltip for favorites link */}
            <div className="absolute top-full bg-white left-1/2 -translate-x-1/2 mt-2 px-3 py-1 text-red-500 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-[101]">
              {t('My Favorites')}
            </div>
          </div>
          <div className="relative group">
            <Link to="/cart" className="relative flex items-center" title="My Shopping Cart">
              <FaShoppingBag size={25} className="mr-1" />
              {totalQuantity > 0 && (
                <span className="absolute -bottom-3 bg-white left-[15px] text-red-800 rounded-full px-2 p-1 text-xs font-bold transition-all transform hover:scale-110">
                  {totalQuantity}
                </span>
              )}
              <span className="ml-2 text-xl font-bold">€{totalPrice.toFixed(2)}</span>
            </Link>
            {/* Tooltip for cart link */}
            <div className="absolute top-full bg-white left-1/2 -translate-x-1/2 mt-2 px-3 py-1  text-red-500 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-[101]">
              {t('My Shopping Cart')}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation (visible on smaller screens) */}
      <div className="container mx-auto px-4 py-2 md:hidden flex items-center justify-between">
        {/* Hamburger menu button */}
        <button onClick={toggleMobileMenu} className="text-white">
          <FaBars size={25} />
        </button>
        {/* Mobile search bar */}
        <div className="flex-1 mx-4 flex">
          <input
            type="text"
            placeholder={t("Search for Products")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 px-4 py-2 rounded-xl border-[2px] border-white focus:outline-none"
          />
        </div>
        {/* Mobile cart icon */}
        <Link to="/cart" className="relative flex items-center text-white" title="My Shopping Cart">
          <FaShoppingBag size={25} className="mr-1" />
          {totalQuantity > 0 && (
            <span className="absolute -bottom-2 left-[15px]  text-red-800 bg-white rounded-full px-2 p-1 text-xs font-bold transition-all transform hover:scale-110">
              {totalQuantity}
            </span>
          )}
        </Link>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-white z-50 transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }  md:hidden overflow-y-auto max-h-screen`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <Link to="/" className="text-3xl font-bold flex items-center justify-center">
            <img src={Logo} alt="Logo" className='w-[100px]' />
          </Link>
          <button onClick={toggleMobileMenu} className="text-gray-700">
            <FaTimes size={25} />
          </button>
        </div>
        <div className="p-4">
          <div className="flex-1 mb-4 flex">
            <input
              type="text"
              placeholder={t("Search for Products")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 px-4 py-2 rounded-l-xl border-[4px] border-red-500 focus:outline-none"
            />
            <button onClick={handleSearch} className="bg-red-500 px-4 rounded-r-xl text-white">
              <FaSearch />
            </button>
          </div>
          <nav className="flex flex-col space-y-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.id}`}
                onClick={toggleMobileMenu}
                className="text-gray-700 font-medium text-lg hover:text-red-500 transition-colors"
              >
                {getLocalizedName(category)}
              </Link>
            ))}
            <div className="border-t pt-4 mt-4">
              <h3 className="font-bold text-gray-800 mb-2">{t('My Account')}</h3>
              <div className="flex flex-col space-y-2">
                <Link to="/compare" onClick={toggleMobileMenu} className="text-gray-600 hover:text-red-500 flex items-center gap-2">
                  <FaSyncAlt />
                  {t('Compare Products')}
                </Link>
                <Link to="/favorites" onClick={toggleMobileMenu} className="text-gray-600 hover:text-red-500 flex items-center gap-2">
                  <FaHeart />
                  {t('My Favorites')}
                </Link>
                <Link to="/cart" onClick={toggleMobileMenu} className="text-gray-600 hover:text-red-500 flex items-center gap-2">
                  <FaShoppingBag />
                  {t('My Shopping Cart')}
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* The MegaMenu component for desktop view */}
      {isOpen && (
        <MegaMenu
          categories={categories}
          getLocalizedName={getLocalizedName}
          BASE_URL={BASE_URL}
        />
      )}
    </div>
  );
};

export default CategoryBar;
