import { useEffect, useState } from "react";
import axios from '../../api/axios';
import { FaTrash } from "react-icons/fa";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOrders = () => {
        setLoading(true);
        axios
            .get('/orders')
            .then((res) => {
                setOrders(res.data);
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to fetch orders");
                setLoading(false);
            });
    };

    const updateStatus = (orderId, newStatus) => {
        axios
            .patch(`/orders/${orderId}/status`, null, { params: { status: newStatus } })
            .then((res) => {
                setOrders(prev =>
                    prev.map(o =>
                        o.id === orderId ? { ...o, status: res.data.status } : o
                    )
                );
            })
            .catch(() => {
                alert("Failed to update status");
            });
    };

    const deleteOrder = (orderId) => {
        if (!window.confirm("Are you sure you want to delete this order?")) return;
        axios
            .delete(`/orders/${orderId}`)
            .then(() => {
                setOrders(prev => prev.filter(o => o.id !== orderId));
            })
            .catch(() => {
                alert("Failed to delete order");
            });
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) return <div className="p-4">Loading orders...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Orders</h2>

            <table className="w-full border bg-white shadow">
                <thead>
                    <tr className="bg-gray-200 text-left">
                        <th className="p-2">User Details</th>
                        <th className="p-2">Product Title & Quantity</th>
                        <th className="p-2">Total Price</th>
                        <th className="p-2">Created Date</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((o) => (
                        <tr key={o.id} className="hover:bg-gray-100">
                            <td className="p-2">
                                <p>Full name: <b><u>{o.user.name}</u></b></p>
                                <p>Email: <b><u>{o.user.email}</u></b></p>
                            </td>
                            <td className="p-2">
                                {o.items.map((item, index) => (
                                    <div key={index}>
                                        {item.productTitle} × {item.quantity}
                                    </div>
                                ))}
                            </td>
                            <td className="p-2">
                                {o.totalPrice ??
                                    o.items.reduce(
                                        (sum, item) => sum + item.quantity * item.pricePerUnit,
                                        0
                                    ).toFixed(2)}
                            </td>
                            <td className="p-2">{new Date(o.createdAt).toLocaleString()}</td>
                            <td className="p-2">
                                <select
                                    value={o.status}
                                    onChange={(e) => updateStatus(o.id, e.target.value)}
                                    className="border rounded px-2 py-1"
                                >
                                    <option value="PENDING">PENDING</option>
                                    <option value="PAID">PAID</option>
                                    <option value="SHIPPED">SHIPPED</option>
                                    <option value="DELIVERED">DELIVERED</option>
                                    <option value="CANCELLED">CANCELLED</option>
                                </select>
                            </td>
                            <td className="p-2">
                                {o.status === "CANCELLED" && (
                                    <button
                                        onClick={() => deleteOrder(o.id)}
                                        className="text-red-600 hover:text-red-800 p-1"
                                        title="Delete order"
                                    >
                                        <FaTrash  size={18} />
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
