import { useEffect, useState } from "react";
import axios from "../../api/axios";

export default function MovementsPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("/inventory/movements").then(res => setData(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Inventory Movements</h1>

      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3">Product</th>
            <th className="p-3">Type</th>
            <th className="p-3">Qty</th>
            <th className="p-3">Warehouse</th>
            <th className="p-3">Date</th>
          </tr>
        </thead>

        <tbody>
          {data.map((m) => (
            <tr key={m.id} className="border-t">
              <td className="p-3">{m.product}</td>
              <td className="p-3">
                <span className={
                  m.type === "IN" ? "text-green-600" : "text-red-600"
                }>
                  {m.type}
                </span>
              </td>
              <td className="p-3">{m.quantity}</td>
              <td className="p-3">{m.warehouse}</td>
              <td className="p-3">{m.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}