import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaUsers,
  FaStream,
  FaSignOutAlt,
  FaClipboardList,
  FaImages,
  FaHome,
  FaBars,
  FaTimes
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { getUserById } from "../api/authService";
import { TbRulerMeasure } from "react-icons/tb";
import { RiDiscountPercentLine } from "react-icons/ri";

export default function AdminLayout() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState({
    fullName: "Admin",
    profileImage: "https://via.placeholder.com/40",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      navigate("/login");
      return;
    }

    getUserById(userId)
      .then((res) => {
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      })
      .catch((err) => {
        console.error("Failed to fetch user", err);
        navigate("/login");
      });
  }, []);

  const linkClass = ({ isActive }) =>
    isActive
      ? "flex items-center font-semibold text-yellow-300 space-x-2 p-2 rounded"
      : "flex items-center hover:bg-gray-700 space-x-2 p-2 rounded transition-colors";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-30
          w-64 bg-gray-800 text-white p-4 
          flex flex-col justify-between
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Admin</h1>
            <button
              onClick={closeSidebar}
              className="lg:hidden text-white hover:text-gray-300"
            >
              <FaTimes size={24} />
            </button>
          </div>
          
          <nav className="space-y-2">
            <NavLink to="/" end className={linkClass} onClick={closeSidebar}>
              <FaTachometerAlt />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/products" className={linkClass} onClick={closeSidebar}>
              <FaBoxOpen />
              <span>Products</span>
            </NavLink>
            <NavLink to="/users" className={linkClass} onClick={closeSidebar}>
              <FaUsers />
              <span>Users</span>
            </NavLink>
            <NavLink to="/categories" className={linkClass} onClick={closeSidebar}>
              <FaStream />
              <span>Categories</span>
            </NavLink>
            <NavLink to="/orders" className={linkClass} onClick={closeSidebar}>
              <FaClipboardList />
              <span>Orders</span>
            </NavLink>
            <NavLink to="/home-widget" className={linkClass} onClick={closeSidebar}>
              <FaHome />
              <span>Home Widget</span>
            </NavLink>
            <NavLink to="/banner" className={linkClass} onClick={closeSidebar}>
              <FaImages />
              <span>Banner</span>
            </NavLink>
            <NavLink to="/units" className={linkClass} onClick={closeSidebar}>
              <TbRulerMeasure />
              <span>Units</span>
            </NavLink>
            <NavLink to="/promos" className={linkClass} onClick={closeSidebar}>
              <RiDiscountPercentLine />
              <span>Promo Code</span>
            </NavLink>
          </nav>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 text-red-400 hover:text-red-600 mt-6 p-2 rounded hover:bg-gray-700 transition-colors"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Top navbar */}
        <header className="h-16 bg-white border-b shadow flex items-center justify-between px-4 md:px-6">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden text-gray-700 hover:text-gray-900"
          >
            <FaBars size={24} />
          </button>

          {/* User info */}
          <div className="flex items-center space-x-3 ml-auto">
            <img
              src={`${BASE_URL}${user.profilePictureUrl}`}
              alt="User"
              className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
            />
            <span className="font-medium hidden sm:block text-sm md:text-base">
              {user.name}
            </span>
          </div>
        </header>

        {/* Outlet */}
        <main className="flex-1 overflow-auto bg-gray-100 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}