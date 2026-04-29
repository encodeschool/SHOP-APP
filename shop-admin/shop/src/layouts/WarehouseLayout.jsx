import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  FaBoxes,
  FaExchangeAlt,
  FaSignOutAlt,
  FaWarehouse
} from "react-icons/fa";

export default function WarehouseLayout() {
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    isActive
      ? "flex items-center space-x-3 py-2 px-4 rounded bg-gray-700 text-yellow-300"
      : "flex items-center space-x-3 py-2 px-4 rounded hover:bg-gray-700";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4 flex flex-col justify-between">
        <div>
          <h1 className="text-xl font-bold text-yellow-300 mb-6">
            Warehouse Panel
          </h1>

          <nav className="space-y-2">
            <NavLink to="/warehouse" end className={linkClass}>
              <FaWarehouse />
              <span>Dashboard</span>
            </NavLink>

            <NavLink to="/warehouse/products" className={linkClass}>
              <FaBoxes />
              <span>Stock</span>
            </NavLink>

            <NavLink to="/warehouse/transactions" className={linkClass}>
              <FaExchangeAlt />
              <span>Transactions</span>
            </NavLink>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 text-red-400 hover:bg-gray-700 px-4 py-2 rounded"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </aside>

      {/* Content */}
      <div className="flex-1 bg-gray-100 p-6 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}