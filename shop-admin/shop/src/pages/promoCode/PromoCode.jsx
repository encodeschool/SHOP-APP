import React, { useEffect, useState } from "react";
import axios from "../../api/axios";

export default function PromoCode() {
    const [promoCodes, setPromoCodes] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const emptyForm = {
        code: "",
        discountAmount: "",
        discountPercent: "",
        validFrom: "",
        validUntil: "",
        active: false,
        usageLimit: "",
        timesUsed: "",
    };

    const [form, setForm] = useState(emptyForm);

    // FETCH
    const fetchPromoCodes = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get("/promo");
            setPromoCodes(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch promo codes");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPromoCodes();
    }, []);

    // HANDLE INPUT CHANGE
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    // SAVE (ADD / EDIT)
    const handleSubmit = async () => {
        const payload = {
            ...form,
            discountAmount: form.discountAmount === "" ? null : Number(form.discountAmount),
            discountPercent: form.discountPercent === "" ? null : Number(form.discountPercent),
            usageLimit: Number(form.usageLimit),
            timesUsed: Number(form.timesUsed)
        };

        try {
            if (editingId) {
                await axios.put(`/promo/${editingId}`, payload);
            } else {
                await axios.post("/promo", payload);
            }
            fetchPromoCodes();
            setIsDrawerOpen(false);
        } catch (err) {
            console.error(err);
            alert("Save failed");
        }
    };

    // EDIT
    const handleEdit = (promo) => {
        setEditingId(promo.id);
        setForm({
            ...promo,
            validFrom: promo.validFrom?.slice(0, 16),
            validUntil: promo.validUntil?.slice(0, 16)
        });
        setIsDrawerOpen(true);
    };

    // DELETE
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this promo code?")) return;

        try {
            await axios.delete(`/promo/${id}`);
            fetchPromoCodes();
        } catch (err) {
            console.error(err);
            alert("Delete failed");
        }
    };

    // NEW
    const handleNew = () => {
        setEditingId(null);
        setForm(emptyForm);
        setIsDrawerOpen(true);
    };

    return (
        <div className="h-[100%]">
            <div className="flex gap-4 h-[100%]">
                {/* Left Column */}
                <div className="w-[100%]">
                    <h2 className="text-xl font-bold mb-4">Promo Codes</h2>

                    <button
                        className="bg-green-500 mb-6 hover:bg-green-700 text-white font-bold py-2 mr-6 px-4 rounded"
                        onClick={handleNew}
                    >
                        +
                    </button>

                    {loading ? (
                        <div className="p-4">Loading promo codes...</div>
                    ) : error ? (
                        <div className="p-4 text-red-500">{error}</div>
                    ) : (
                        <table className="w-full border bg-white shadow">
                            <thead>
                                <tr className="bg-gray-200 text-left">
                                    <th className="p-2">Code</th>
                                    <th className="p-2">Amount</th>
                                    <th className="p-2">Percent</th>
                                    <th className="p-2">Valid From</th>
                                    <th className="p-2">Valid Until</th>
                                    <th className="p-2">Active</th>
                                    <th className="p-2">Usage Limit</th>
                                    <th className="p-2">Times Used</th>
                                    <th className="p-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {promoCodes.map(promo => (
                                    <tr key={promo.id} className="border-b">
                                        <td className="p-2">{promo.code}</td>
                                        <td className="p-2">{promo.discountAmount}</td>
                                        <td className="p-2">{promo.discountPercent}</td>
                                        <td className="p-2">{new Date(promo.validFrom).toLocaleString()}</td>
                                        <td className="p-2">{new Date(promo.validUntil).toLocaleString()}</td>
                                        <td className="p-2">{promo.active ? "Yes" : "No"}</td>
                                        <td className="p-2">{promo.usageLimit}</td>
                                        <td className="p-2">{promo.timesUsed}</td>

                                        <td className="p-2 flex gap-2">
                                            <button
                                                onClick={() => handleEdit(promo)}
                                                className="bg-yellow-500 text-white px-3 py-1 rounded"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(promo.id)}
                                                className="bg-red-500 text-white px-3 py-1 rounded"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Drawer Overlay */}
                <div
                    className={`fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity ${
                        isDrawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                    onClick={() => setIsDrawerOpen(false)}
                />

                {/* Drawer Panel */}
                <div
                    className={`fixed top-0 right-0 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ${
                        isDrawerOpen ? "translate-x-0" : "translate-x-full"
                    } w-[100%] md:w-[500px] overflow-y-scroll`}
                >
                    <div className="p-6">
                        <h2 className="text-xl font-bold mb-4">
                            {editingId ? "Edit Promo Code" : "New Promo Code"}
                        </h2>

                        {/* FORM */}
                        <div className="flex flex-col gap-4">

                            <input
                                type="text"
                                name="code"
                                placeholder="Code"
                                value={form.code}
                                onChange={handleChange}
                                className="border p-2"
                            />

                            <input
                                type="number"
                                name="discountAmount"
                                placeholder="Discount Amount"
                                value={form.discountAmount}
                                onChange={handleChange}
                                className="border p-2"
                            />

                            <input
                                type="number"
                                name="discountPercent"
                                placeholder="Discount Percent"
                                value={form.discountPercent ?? ""}
                                onChange={handleChange}
                                className="border p-2"
                            />

                            <label className="text-sm">Valid From</label>
                            <input
                                type="datetime-local"
                                name="validFrom"
                                value={form.validFrom}
                                onChange={handleChange}
                                className="border p-2"
                            />

                            <label className="text-sm">Valid Until</label>
                            <input
                                type="datetime-local"
                                name="validUntil"
                                value={form.validUntil}
                                onChange={handleChange}
                                className="border p-2"
                            />

                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="active"
                                    checked={form.active}
                                    onChange={handleChange}
                                />
                                Active
                            </label>

                            <input
                                type="number"
                                name="usageLimit"
                                placeholder="Usage Limit"
                                value={form.usageLimit}
                                onChange={handleChange}
                                className="border p-2"
                            />

                            <input
                                type="number"
                                name="timesUsed"
                                placeholder="Times Used"
                                value={form.timesUsed}
                                onChange={handleChange}
                                className="border p-2"
                            />

                            <button
                                onClick={handleSubmit}
                                className="bg-blue-600 text-white py-2 rounded"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
