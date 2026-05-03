import { useEffect, useState } from "react";
import axios from "../../api/axios";

export default function StockPage() {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    fetchStock();
  }, []);

  const fetchStock = async () => {
    const res = await axios.get("/inventory/stock");
    setStocks(res.data);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Stock</h1>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-200 text-left">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">Warehouse</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {stocks.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="p-3">{s.productName}</td>
                <td className="p-3">{s.warehouseName}</td>
                <td className="p-3 font-semibold">{s.quantity}</td>

                <td className="p-3">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded">
                    Adjust
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}