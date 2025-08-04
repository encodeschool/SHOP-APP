import { useEffect, useState } from "react";
import axios from '../../api/axios';

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
            })
    };

     useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) return <div className="p-4">Loading users...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Orders</h2>

            <table className="w-full border bg-white shadow">
                <thead>
                    <tr className="bg-gray-200 text-left">
                        {/* <th className="p-2">ID</th> */}
                        <th className="p-2">Product Title & Quantity</th>
                        <th className="p-2">Total Price</th>
                        <th className="p-2">Created Date</th>
                        <th className="p-2">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((o) => (
                        <tr key={o.id}>
                            {/* <td className="p-2">{o.id}</td> */}
                            <td className="p-2">
                                {o.items.map((item, index) => (
                                <div key={index}>
                                    {item.productTitle} × {item.quantity}
                                </div>
                                ))}
                            </td>
                            <td className="p-2">
                                {o.totalPrice ?? o.items.reduce((sum, item) => sum + item.quantity * item.pricePerUnit, 0).toFixed(2)}
                            </td>
                            <td className="p-2">{new Date(o.createdAt).toLocaleString()}</td>
                            <td className="p-2">{o.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
}