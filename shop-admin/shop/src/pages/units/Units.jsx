import { useEffect, useState } from "react";
import axios from '../../api/axios';

export default function Units() {
    const [units, setUnit] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [newUnit, setNewUnit] = useState({
        name: "",
        code: ""
    });
    const [editingId, setEditingId] = useState(null);

    const fetchUnits = () => {
        setLoading(true);
        axios
            .get('/units')
            .then((res) => {
                setUnit(res.data);
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to fetch units");
                setLoading(false);
            });
    }

    const handleEdit = (unit) => {
        setNewUnit({
            name: unit.name,
            code: unit.code,
        });
        console.log(unit.id);
        setEditingId(unit.id);
        setIsDrawerOpen(true);
    };

    useEffect(() => {
        fetchUnits();
    }, []);

    const handleInputChange = (e) => {
        setNewUnit({ ...newUnit, [e.target.name]: e.target.value });
    };

    const handleCreateOrUpdate = async () => {
        try {

            const formData = new FormData();
            
            if (editingId) {
                await axios.put(`/units/${editingId}`, formData);
            } else {
                await axios.post("/units", formData);
            }

            setNewUnit({
                name: "",
                code: ""
            });

            setIsDrawerOpen(false);
            setEditingId(null);
            fetchUnits();
        } catch (error) {
            console.error("Error creating/updating unit:", error);
            alert("Failed to save unit. Check console for details.");
        }
    };

    if (loading) return <div className="p-4">Loading orders...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;

    return (
        <div className="h-[100%]">
            <div className="flex gap-4 h-[100%]">
                <div className="w-[100%]">
                    <h2 className="text-xl font-bold mb-4">Units</h2>
                    <button
                        className='bg-green-500 mb-6 hover:bg-green-700 text-white font-bold py-2 mr-6 px-4 rounded'
                            onClick={() => {
                            setEditingId(null);
                            setNewUnit({ 
                                name: "",
                                code: "",
                            });
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
                                <tr key={unit.id - unit.name} className="hover:bg-gray-100">
                                    <td className="p-2">
                                        <p>{unit.name}</p>
                                    </td>
                                    <td className="p-2">
                                        <p>{unit.code}</p>
                                    </td>
                                    <th className="p-2">
                                        <button onClick={() => handleEdit(unit)}>
                                            Edit
                                        </button>
                                    </th>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Drawer Overlay */}
                <div
                    className={`fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity ${
                        isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                    onClick={() => setIsDrawerOpen(false)}
                ></div>

                {/* Drawer Panel */}
                <div
                className={`fixed top-0 right-0 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ${
                    isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
                } w-[100%] md:w-[500px] overflow-y-scroll`}
                >
                <div className="p-4">
                    <div className="w-[100%] p-4 bg-white shadow h-[auto]">
                    <h3 className="font-semibold mb-2">{editingId ? "Edit" : "Add"} Unit</h3>
                    <input
                        name="name"
                        placeholder="Unit name"
                        className="border p-1 mb-3 w-[100%]"
                        value={newUnit.name}
                        onChange={handleInputChange}
                    />
                    
                    <input
                        name="code"
                        placeholder="code"
                        className="border p-1 mb-3 w-[100%]"
                        value={newUnit.code || ""}
                        onChange={handleInputChange}
                    />

                    <button
                        onClick={handleCreateOrUpdate}
                        className={editingId ? "bg-yellow-500 text-white px-3 py-1 w-[100%]" : "bg-blue-500 text-white px-3 py-1 w-[100%]"}
                    >
                        {editingId ? "Update" : "Create"}
                    </button>
                </div>
                </div>
                </div>
            </div>
            
        </div>
    );
}