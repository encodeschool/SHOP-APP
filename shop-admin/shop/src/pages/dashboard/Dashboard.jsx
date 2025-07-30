// src/pages/Dashboard.jsx
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { useEffect, useState } from 'react';
import axios from '../../api/axios';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

export default function Dashboard() {
  const [productStats, setProductStats] = useState([]);
  const [orderStats, setOrderStats] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);

  useEffect(() => {
    axios.get('/admin/analytics/products/monthly').then(res => setProductStats(res.data));
    axios.get('admin/analytics/orders/monthly').then(res => setOrderStats(res.data));
    axios.get('admin/analytics/products/category').then(res => setCategoryStats(res.data));
  }, []);

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* Bar Chart - Products per Month */}
      <div className="bg-white p-4 shadow rounded">
        <h2 className="text-lg font-semibold mb-2">Products Created per Month</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={productStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
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
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart - Products by Category */}
      <div className="bg-white p-4 shadow rounded">
        <h2 className="text-lg font-semibold mb-2">Products by Category</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryStats}
              dataKey="count"
              nameKey="category"
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
    </div>
  );
}
