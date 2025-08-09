import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaMailBulk, FaRegUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";
import { CiMail } from "react-icons/ci";
import { FaPhone } from "react-icons/fa6";
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';


export default function AppBar() {
  const [languageOpen, setLanguageOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

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

    axios.get(`http://localhost:8080/api/users/${userId}`, {
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
  }, [isLoggedIn]); // Add isLoggedIn here


  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="bg-white text-sm border-b shadow-sm">
      <div className="container mx-auto md:px-4 md:py-2 flex justify-between items-center">
        {/* Left Links - Desktop */}
        <div className="hidden md:flex gap-4">
          <Link to="/terms" className="font-[200] hover:underline">Terms & Conditions</Link>
          <Link to="/delivery" className="font-[200] hover:underline">Delivery & Payment</Link>
          <Link to="/about" className="font-[200] hover:underline">About Us</Link>
          <Link to="/contacts" className="font-[200] hover:underline">Contacts</Link>
        </div>

        {/* Right - Desktop */}
        <div className="hidden font-[200] md:flex items-center gap-4">
          <span className="flex items-center">
            <FaPhone className="mr-1" />
            <span>+371 22164949</span>
          </span>
          |
          <span className="flex items-center">
            <CiMail className="mr-1" />
            <span>4games@4games.lv</span>
          </span>
          |
          <Link to="/track-order" className="hover:underline flex items-center "><TbTruckDelivery className="mr-1" />Track Your Order</Link>
          |
          {/* My Account Dropdown */}
          <div className="relative">
            <button onClick={() => setAccountOpen(!accountOpen)} className="flex items-center hover:underline">
              < FaRegUserCircle className="mr-1" />
              {isLoggedIn ? (
                <>
                  {user.name}
                </>
              ) : (
                <p>My Account</p>
              )}
            </button>
            {accountOpen && (
              <div className="absolute right-0 mt-1 bg-white shadow-md border rounded z-10">
                {isLoggedIn ? (
                  <>
                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                    <button onClick={handleLogout} className="block px-4 py-2 hover:bg-gray-100">Logout</button>
                  </>
                ) : (
                  <Link to="/login" className="block px-4 py-2 hover:bg-gray-100">Login</Link>
                )}
              </div>
            )}
          </div>
          |
          {/* Language Dropdown */}
          <div className="relative">
            <button onClick={() => setLanguageOpen(!languageOpen)} className="hover:underline">
              English
            </button>
            {languageOpen && (
              <div className="absolute right-0 mt-1 bg-white shadow-md border rounded z-10">
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
