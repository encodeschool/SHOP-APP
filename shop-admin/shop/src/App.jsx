import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from './pages/dashboard/Dashboard';
import Products from './pages/products/Product';
import AdminLayout from './layouts/AdminLayout';
import Users from './pages/user/User';
import Categories from "./pages/category/Category";
import Login from './pages/authorization/Login';
import Register from './pages/authorization/Registration';
import Orders from "./pages/orders/Order";
import AttributeManagement from './pages/products/AttributeManagement';
import Brand from './pages/products/Brand';
import Banner from "./pages/banner/Banner";
import RoleRoute from './routes/RoleRoute';
import NotFound from "./pages/Errors/NotFound";
import Forbidden from "./pages/Errors/Forbidden";
import ServerError from "./pages/Errors/ServerError";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected admin routes */}
        <Route
          path="/"
          element={
            <RoleRoute roles={["ADMIN"]}>
              <AdminLayout />
            </RoleRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="users" element={<Users />} />
          <Route path="categories" element={<Categories />} />
          <Route path="orders" element={<Orders />} />
          <Route path="product_attribute" element={<AttributeManagement />} />
          <Route path="brand" element={<Brand />} />
          <Route path="banner" element={<Banner />} />
        </Route>

        <Route path="/unauthorized" element={<Forbidden />} />
        <Route path="/server-error" element={<ServerError />} />

        {/* Catch-all for unknown routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
