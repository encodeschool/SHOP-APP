// src/pages/Dashboard.jsx
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { useEffect, useState } from 'react';
import axios from '../../api/axios';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1'];

export default function Dashboard() {
  const [productStats, setProductStats] = useState([]);
  const [orderStats, setOrderStats] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [userStats, setUserStats] = useState([]);
  const [revenueStats, setRevenueStats] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  const [totals, setTotals] = useState({
    users: 0,
    orders: 0,
    revenue: 0,
    products: 0
  });

  useEffect(() => {
    axios.get('/admin/analytics/products/monthly').then(res => setProductStats(res.data));
    axios.get('/admin/analytics/stats').then(res => setTotals(res.data));
    axios.get('/admin/analytics/orders/monthly').then(res => setOrderStats(res.data));
    axios.get('/admin/analytics/products/category').then(res => setCategoryStats(res.data));
    axios.get('/admin/analytics/products/top').then(res => setTopProducts(res.data));
    // axios.get('/admin/analytics/totals').then(res => setTotals(res.data));
  }, []);

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-white p-4 shadow rounded">
          <h3 className="text-sm text-gray-500">Total Users</h3>
          <p className="text-2xl font-bold">{totals.totalUsers}</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <h3 className="text-sm text-gray-500">Total Orders</h3>
          <p className="text-2xl font-bold">{totals.totalOrders}</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <h3 className="text-sm text-gray-500">Total Revenue</h3>
          <p className="text-2xl font-bold">${totals.totalRevenue?.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <h3 className="text-sm text-gray-500">Total Products</h3>
          <p className="text-2xl font-bold">{totals.totalProducts}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Bar Chart - Products per Month */}
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-lg font-semibold mb-2">Products Created per Month</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="monthName" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart - Orders per Month */}
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-lg font-semibold mb-2">Orders per Month</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={orderStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="monthName" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Pie Chart - Products by Category */}
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-lg font-semibold mb-2">Products by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryStats}
                dataKey="productCount"
                nameKey="categoryName"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#ffc658"
                label
              >
                {categoryStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Bar Chart - Top Products */}
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-lg font-semibold mb-2">Top Selling Products</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="productTitle" />      {/* matches your API */}
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalSold" fill="#82ca9d" /> {/* matches your API */}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
