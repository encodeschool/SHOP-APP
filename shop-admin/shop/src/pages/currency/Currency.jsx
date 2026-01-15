import { useEffect, useState } from "react";
import axios from "../../api/axios";

export default function Currencies() {
    const [currencies, setCurrencies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({
        code: "",
        name: "",
        symbol: "",
        active: true,
    });

    // 🔄 Fetch currencies
    const fetchCurrencies = () => {
        setLoading(true);
        axios
            .get("/currency")
            .then((res) => {
                setCurrencies(res.data);
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to fetch currencies");
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchCurrencies();
    }, []);

    // 🧠 Handle input
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    // ✅ Create / Update
    const handleSave = async () => {
        if (!form.code || !form.name || !form.symbol) {
            alert("Please fill all required fields");
            return;
        }

        const payload = {
            code: form.code.trim().toUpperCase(),
            name: form.name.trim(),
            symbol: form.symbol.trim(),
            active: form.active,
        };

        try {
            if (editingId) {
                await axios.put(`/currency/${editingId}`, payload);
            } else {
                await axios.post("/currency", payload);
            }

            resetForm();
            fetchCurrencies();
        } catch (err) {
            console.error(err);
            alert("Failed to save currency");
        }
    };

    // ✏️ Edit
    const handleEdit = (currency) => {
        setForm({
            code: currency.code,
            name: currency.name,
            symbol: currency.symbol,
            active: currency.active,
        });
        setEditingId(currency.id);
        setIsDrawerOpen(true);
    };

    // 🗑 Delete
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this currency?")) return;

        try {
            await axios.delete(`/currency/${id}`);
            fetchCurrencies();
        } catch (err) {
            console.error(err);
            alert("Failed to delete currency");
        }
    };

    const resetForm = () => {
        setForm({
            code: "",
            name: "",
            symbol: "",
            active: true,
        });
        setEditingId(null);
        setIsDrawerOpen(false);
    };

    if (loading) return <div className="p-4">Loading currencies...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;

    return (
        <div className="h-full">
            <h2 className="text-xl font-bold mb-4">Currencies</h2>

            <button
                className="bg-green-500 mb-6 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => {
                    resetForm();
                    setIsDrawerOpen(true);
                }}
            >
                + Add Currency
            </button>

            <table className="w-full border bg-white shadow">
                <thead>
                    <tr className="bg-gray-200 text-left">
                        <th className="p-2">Code</th>
                        <th className="p-2">Name</th>
                        <th className="p-2">Symbol</th>
                        <th className="p-2">Active</th>
                        <th className="p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currencies.map((c) => (
                        <tr key={c.id} className="hover:bg-gray-100">
                            <td className="p-2 font-mono">{c.code}</td>
                            <td className="p-2">{c.name}</td>
                            <td className="p-2">{c.symbol}</td>
                            <td className="p-2">
                                {c.active ? "✅" : "❌"}
                            </td>
                            <td className="p-2 flex gap-2">
                                <button
                                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                                    onClick={() => handleEdit(c)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                    onClick={() => handleDelete(c.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity ${
                    isDrawerOpen
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                }`}
                onClick={() => setIsDrawerOpen(false)}
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ${
                    isDrawerOpen ? "translate-x-0" : "translate-x-full"
                } w-full md:w-[500px]`}
            >
                <div className="p-6">
                    <h3 className="font-semibold mb-4 text-lg">
                        {editingId ? "Edit Currency" : "Add Currency"}
                    </h3>

                    <input
                        name="code"
                        placeholder="Code (USD, EUR)"
                        className="border p-2 mb-3 w-full rounded"
                        value={form.code}
                        onChange={handleChange}
                        disabled={!!editingId}
                    />

                    <input
                        name="name"
                        placeholder="Currency name"
                        className="border p-2 mb-3 w-full rounded"
                        value={form.name}
                        onChange={handleChange}
                    />

                    <input
                        name="symbol"
                        placeholder="Symbol ($, €)"
                        className="border p-2 mb-3 w-full rounded"
                        value={form.symbol}
                        onChange={handleChange}
                    />

                    <label className="flex items-center gap-2 mb-4">
                        <input
                            type="checkbox"
                            name="active"
                            checked={form.active}
                            onChange={handleChange}
                        />
                        Active
                    </label>

                    <button
                        onClick={handleSave}
                        className={`${
                            editingId
                                ? "bg-yellow-500 hover:bg-yellow-600"
                                : "bg-blue-500 hover:bg-blue-600"
                        } text-white px-4 py-2 rounded w-full`}
                    >
                        {editingId ? "Update Currency" : "Create Currency"}
                    </button>
                </div>
            </div>
        </div>
    );
}
