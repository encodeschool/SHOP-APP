import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaUsers,
  FaStream,
  FaSignOutAlt,
  FaClipboardList 
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { getUserById } from "../api/authService";

export default function AdminLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    fullName: "Admin",
    profileImage: "https://via.placeholder.com/40",
  });

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
  }, []);

  const linkClass = ({ isActive }) =>
    isActive
      ? "flex items-center font-semibold text-yellow-300 space-x-2"
      : "flex items-center hover:underline space-x-2";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl mb-6 font-bold">Admin</h1>
          <nav className="space-y-4">
            <NavLink to="/" end className={linkClass}>
              <FaTachometerAlt />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/products" className={linkClass}>
              <FaBoxOpen />
              <span>Products</span>
            </NavLink>
            <NavLink to="/users" className={linkClass}>
              <FaUsers />
              <span>Users</span>
            </NavLink>
            <NavLink to="/categories" className={linkClass}>
              <FaStream />
              <span>Categories</span>
            </NavLink>
            <NavLink to="/orders" className={linkClass}>
              <FaClipboardList  />
              <span>Orders</span>
            </NavLink>
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 text-red-400 hover:text-red-600 mt-6"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navbar */}
        <header className="h-16 bg-white border-b shadow flex items-center justify-end px-6">
          <div className="flex items-center space-x-4">
            <img
              src={`http://localhost:8080${user.profilePictureUrl}`}
              alt="User"
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="font-medium">{user.name}</span>
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
