import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaUsers,
  FaStream,
  FaSignOutAlt,
  FaClipboardList,
  FaImages,
  FaHome,
  FaChevronDown,
  FaChevronRight,
  FaTag,
  FaCog,
  FaShoppingCart
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { TbRulerMeasure } from "react-icons/tb";
import { RiDiscountPercentLine } from "react-icons/ri";
import { MdCategory } from "react-icons/md";
import { BsTags } from "react-icons/bs";
import { MdEditAttributes } from "react-icons/md";
import { SiBrandfolder } from "react-icons/si";
import { getUserById } from "../api/authService";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState({
    fullName: "Admin",
    profileImage: "https://via.placeholder.com/40",
  });

  // State for expandable sections
  const [expandedSections, setExpandedSections] = useState({
    catalog: false,
    sales: false,
    content: false,
    settings: false,
  });

  // Auto-expand section if current route matches
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId"); // You'll store this during login

    if (!token || !userId) {
      navigate("/login");
      return;
    }

    getUserById(userId)
      .then((res) => {
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data)); // cache it
      })
      .catch((err) => {
        console.error("Failed to fetch user", err);
        navigate("/login");
    });
  
    const path = location.pathname;
    
    if (path.includes('/products') || path.includes('/categories') || path.includes('/units')) {
      setExpandedSections(prev => ({ ...prev, catalog: true }));
    } else if (path.includes('/orders') || path.includes('/promos')) {
      setExpandedSections(prev => ({ ...prev, sales: true }));
    } else if (path.includes('/home-widget') || path.includes('/banner')) {
      setExpandedSections(prev => ({ ...prev, content: true }));
    }
  }, [location.pathname]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const linkClass = ({ isActive }) =>
    isActive
      ? "flex items-center font-semibold text-yellow-300 space-x-3 py-2 px-4 rounded-lg bg-gray-700"
      : "flex items-center hover:bg-gray-700 space-x-3 py-2 px-4 rounded-lg transition-colors";

  const subLinkClass = ({ isActive }) =>
    isActive
      ? "flex items-center font-medium text-yellow-300 space-x-3 py-2 px-4 pl-12 rounded-lg bg-gray-700"
      : "flex items-center hover:bg-gray-700 space-x-3 py-2 px-4 pl-12 rounded-lg transition-colors text-gray-300";

  const sectionButtonClass = (isExpanded) =>
    `flex items-center justify-between w-full py-2 px-4 rounded-lg transition-colors ${
      isExpanded ? 'bg-gray-700 text-yellow-300' : 'hover:bg-gray-700'
    }`;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const BASE_URL = process.env.REACT_APP_BASE_URL || '';

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4 flex flex-col justify-between overflow-y-auto">
        <div>
          <h1 className="text-2xl mb-6 font-bold text-yellow-300">Admin Panel</h1>
          <nav className="space-y-2">
            {/* Dashboard - Always visible */}
            <NavLink to="/" end className={linkClass}>
              <FaTachometerAlt />
              <span>Dashboard</span>
            </NavLink>

            {/* Catalog Section */}
            <div>
              <button
                onClick={() => toggleSection('catalog')}
                className={sectionButtonClass(expandedSections.catalog)}
              >
                <div className="flex items-center space-x-3">
                  <FaBoxOpen />
                  <span>Catalog</span>
                </div>
                {expandedSections.catalog ? <FaChevronDown /> : <FaChevronRight />}
              </button>
              
              {expandedSections.catalog && (
                <div className="mt-1 space-y-1">
                  <NavLink to="/products" className={subLinkClass}>
                    <FaTag />
                    <span>Products</span>
                  </NavLink>
                  <NavLink to="/categories" className={subLinkClass}>
                    <MdCategory />
                    <span>Categories</span>
                  </NavLink>
                  <NavLink to="/units" className={subLinkClass}>
                    <TbRulerMeasure />
                    <span>Units</span>
                  </NavLink>
                  <NavLink to="/product_attribute" className={subLinkClass}>
                    <MdEditAttributes />
                    <span>Attributes</span>
                  </NavLink>
                  <NavLink to="/brand" className={subLinkClass}>
                    <SiBrandfolder />
                    <span>Brand</span>
                  </NavLink>
                </div>
              )}
            </div>

            {/* Sales Section */}
            <div>
              <button
                onClick={() => toggleSection('sales')}
                className={sectionButtonClass(expandedSections.sales)}
              >
                <div className="flex items-center space-x-3">
                  <FaShoppingCart />
                  <span>Sales</span>
                </div>
                {expandedSections.sales ? <FaChevronDown /> : <FaChevronRight />}
              </button>
              
              {expandedSections.sales && (
                <div className="mt-1 space-y-1">
                  <NavLink to="/orders" className={subLinkClass}>
                    <FaClipboardList />
                    <span>Orders</span>
                  </NavLink>
                  <NavLink to="/promos" className={subLinkClass}>
                    <RiDiscountPercentLine />
                    <span>Promo Codes</span>
                  </NavLink>
                </div>
              )}
            </div>

            {/* Content Section */}
            <div>
              <button
                onClick={() => toggleSection('content')}
                className={sectionButtonClass(expandedSections.content)}
              >
                <div className="flex items-center space-x-3">
                  <FaImages />
                  <span>Content</span>
                </div>
                {expandedSections.content ? <FaChevronDown /> : <FaChevronRight />}
              </button>
              
              {expandedSections.content && (
                <div className="mt-1 space-y-1">
                  <NavLink to="/home-widget" className={subLinkClass}>
                    <FaHome />
                    <span>Home Widget</span>
                  </NavLink>
                  <NavLink to="/banner" className={subLinkClass}>
                    <BsTags />
                    <span>Banners</span>
                  </NavLink>
                </div>
              )}
            </div>

            {/* Users - Always visible */}
            <NavLink to="/users" className={linkClass}>
              <FaUsers />
              <span>Users</span>
            </NavLink>

            {/* Settings Section (Optional) */}
            <div>
              <button
                onClick={() => toggleSection('settings')}
                className={sectionButtonClass(expandedSections.settings)}
              >
                <div className="flex items-center space-x-3">
                  <FaCog />
                  <span>Settings</span>
                </div>
                {expandedSections.settings ? <FaChevronDown /> : <FaChevronRight />}
              </button>
              
              {expandedSections.settings && (
                <div className="mt-1 space-y-1">
                  <NavLink to="/settings/general" className={subLinkClass}>
                    <FaCog />
                    <span>General</span>
                  </NavLink>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 text-red-400 hover:text-red-600 hover:bg-gray-700 py-2 px-4 rounded-lg mt-6 transition-colors"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navbar */}
        <header className="h-16 bg-white border-b shadow flex items-center justify-between px-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {location.pathname === '/' ? 'Dashboard' : location.pathname.split('/')[1].charAt(0).toUpperCase() + location.pathname.split('/')[1].slice(1)}
          </h2>
          
          <div className="flex items-center space-x-4">
            <img
              src={user.profilePictureUrl ? `${BASE_URL}${user.profilePictureUrl}` : 'https://via.placeholder.com/40'}
              alt="User"
              className="w-10 h-10 rounded-full object-cover border-2"
              onError={(e) => e.target.src = 'https://via.placeholder.com/40'}
            />
            <span className="font-medium text-gray-700">{user.name}</span>
          </div>
        </header>

        {/* Outlet */}
        <main className="flex-1 overflow-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}