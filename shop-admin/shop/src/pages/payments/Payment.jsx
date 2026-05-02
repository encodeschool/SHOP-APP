// Payment.jsx
import { useEffect, useState } from "react";
import axios from "../../api/axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const PAYMENT_METHODS = ["CLICK", "COD", "CARD", "STRIPE"];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1'];

export default function Payment() {
  const [payments, setPayments] = useState([]);
  const [paymentStats, setPaymentStats] = useState([]);
  const [methodStats, setMethodStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState("ALL");

  useEffect(() => {
    fetchPayments();
    fetchPaymentStats();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await axios.get('/admin/analytics/payments');
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const fetchPaymentStats = async () => {
    try {
      const [statsRes, methodRes] = await Promise.all([
        axios.get('/admin/analytics/payments/monthly'),
        axios.get('/admin/analytics/payments/method')
      ]);
      setPaymentStats(statsRes.data);
      setMethodStats(methodRes.data);
    } catch (error) {
      console.error('Error fetching payment stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = selectedMethod === "ALL"
    ? payments
    : payments.filter(payment => (payment.method || '').toUpperCase() === selectedMethod);

  const totalRevenue = payments
    .filter(p => p.status?.toUpperCase() === 'PAID')
    .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Payments</h1>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-2xl font-bold text-green-600">{totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Payments Chart */}
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-lg font-semibold mb-2">Payments per Month</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={paymentStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="monthName" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Methods Distribution */}
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-lg font-semibold mb-2">Payment Methods</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={methodStats}
                dataKey="count"
                nameKey="method"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#ffc658"
                label
              >
                {methodStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 shadow rounded">
        <div className="flex items-center gap-4">
          <label className="font-medium">Filter by Method:</label>
          <select
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
            className="border rounded px-3 py-1"
          >
            <option value="ALL">All Methods</option>
            {PAYMENT_METHODS.map(method => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white shadow rounded overflow-hidden">
        <div className="px-4 py-3 border-b">
          <h2 className="text-lg font-semibold">Payment Details</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Card Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                    {payment.id.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.orderId ? `${payment.orderId.substring(0, 8)}...` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {(() => {
                      const method = (payment.method || 'UNKNOWN').toUpperCase();
                      const style = method === 'CLICK'
                        ? 'bg-blue-100 text-blue-800'
                        : method === 'COD'
                        ? 'bg-green-100 text-green-800'
                        : ['CARD', 'STRIPE', 'UZCARD', 'HUMO'].includes(method)
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-800';
                      return (
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${style}`}>
                          {method}
                        </span>
                      );
                    })()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {parseFloat(payment.amount).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      payment.status === 'PAID' ? 'bg-green-100 text-green-800' :
                      payment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {payment.status?.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.cardType || payment.provider || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.paidAt ? new Date(payment.paidAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.userName || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredPayments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No payments found for the selected method.
          </div>
        )}
      </div>
    </div>
  );
}