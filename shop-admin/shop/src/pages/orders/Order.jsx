import { useEffect, useState } from "react";
import axios from '../../api/axios';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Orders</h2>
        </div>
    );
}