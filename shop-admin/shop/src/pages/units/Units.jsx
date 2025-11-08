import { useEffect, useState } from "react";
import axios from "../../api/axios";

export default function Units() {
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [newUnit, setNewUnit] = useState({ name: "", code: "" });
    const [editingId, setEditingId] = useState(null);

    // Fetch all units
    const fetchUnits = () => {
        setLoading(true);
        axios
            .get("/units")
            .then((res) => {
                setUnits(res.data);
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to fetch units");
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchUnits();
    }, []);

    const handleInputChange = (e) => {
        setNewUnit({ ...newUnit, [e.target.name]: e.target.value });
    };

    // ✅ Handle Create or Update
    const handleCreateOrUpdate = async () => {
        try {
            const payload = {
                name: newUnit.name.trim(),
                code: newUnit.code.trim(),
            };

            if (!payload.name || !payload.code) {
                alert("Please fill out both fields.");
                return;
            }

            if (editingId) {
                // ✅ Update existing unit
                await axios.put(`/units/${editingId}`, payload);
            } else {
                // ✅ Create new unit
                await axios.post("/units", payload);
            }

            // Reset form
            setNewUnit({ name: "", code: "" });
            setEditingId(null);
            setIsDrawerOpen(false);
            fetchUnits();
        } catch (error) {
            console.error("Error creating/updating unit:", error);
            alert("Failed to save unit. Check console for details.");
        }
    };

    // ✅ Handle Edit
    const handleEdit = (unit) => {
        if (!unit.id) {
            console.error("Unit has no ID:", unit);
            return;
        }
        setNewUnit({
            name: unit.name,
            code: unit.code,
        });
        setEditingId(unit.id);
        setIsDrawerOpen(true);
    };

    // ✅ Handle Delete
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this unit?")) {
            try {
                await axios.delete(`/units/${id}`);
                fetchUnits();
            } catch (error) {
                console.error("Error deleting unit:", error);
                alert("Failed to delete unit. Check console for details.");
            }
        }
    };

    if (loading) return <div className="p-4">Loading units...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;

    return (
        <div className="h-full">
            <div className="flex gap-4 h-full">
                <div className="w-full">
                    <h2 className="text-xl font-bold mb-4">Units</h2>
                    <button
                        className="bg-green-500 mb-6 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => {
                            setEditingId(null);
                            setNewUnit({ name: "", code: "" });
                            setIsDrawerOpen(true);
                        }}
                    >
                        +
                    </button>

                    <table className="w-full border bg-white shadow">
                        <thead>
                            <tr className="bg-gray-200 text-left">
                                <th className="p-2">Unit</th>
                                <th className="p-2">Code</th>
                                <th className="p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {units.map((unit) => (
                                <tr key={unit.id} className="hover:bg-gray-100">
                                    <td className="p-2">{unit.name}</td>
                                    <td className="p-2">{unit.code}</td>
                                    <td className="p-2 flex gap-2">
                                        <button
                                            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                                            onClick={() => handleEdit(unit)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                            onClick={() => handleDelete(unit.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Drawer Overlay */}
                <div
                    className={`fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity ${
                        isDrawerOpen
                            ? "opacity-100 pointer-events-auto"
                            : "opacity-0 pointer-events-none"
                    }`}
                    onClick={() => setIsDrawerOpen(false)}
                ></div>

                {/* Drawer Panel */}
                <div
                    className={`fixed top-0 right-0 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ${
                        isDrawerOpen ? "translate-x-0" : "translate-x-full"
                    } w-full md:w-[500px] overflow-y-auto`}
                >
                    <div className="p-4">
                        <h3 className="font-semibold mb-2 text-lg">
                            {editingId ? "Edit Unit" : "Add Unit"}
                        </h3>

                        <input
                            name="name"
                            placeholder="Unit name"
                            className="border p-2 mb-3 w-full rounded"
                            value={newUnit.name}
                            onChange={handleInputChange}
                        />

                        <input
                            name="code"
                            placeholder="Code"
                            className="border p-2 mb-3 w-full rounded"
                            value={newUnit.code}
                            onChange={handleInputChange}
                        />

                        <button
                            onClick={handleCreateOrUpdate}
                            className={`${
                                editingId
                                    ? "bg-yellow-500 hover:bg-yellow-600"
                                    : "bg-blue-500 hover:bg-blue-600"
                            } text-white px-4 py-2 rounded w-full`}
                        >
                            {editingId ? "Update Unit" : "Create Unit"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
