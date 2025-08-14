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

// A simple helper to check if user is authenticated
const isAuthenticated = () => !!localStorage.getItem('token');

function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}
// Some comments
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
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="users" element={<Users />} />
          <Route path="categories" element={<Categories />} />
          <Route path="orders" element={<Orders />} />
          <Route path="product_attribute" element={<AttributeManagement />} />
          <Route path="brand" element={<Brand />} />
        </Route>

        {/* Redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
