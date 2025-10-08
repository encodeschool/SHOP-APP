import React, { useEffect, useState } from "react";
import axios from "../../api/axios"; // ✅ your central Axios instance
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FaPlus, FaTrash, FaGripVertical } from "react-icons/fa";

const Widgets = () => {
  const [widgets, setWidgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newWidget, setNewWidget] = useState({
    title: "",
    widgetType: "CATEGORY_SECTION",
    categoryId: "",
    backgroundColor: "bg-white",
    iconName: "GiCow",
  });

  // Fetch data
  useEffect(() => {
    fetchWidgets();
    fetchCategories();
  }, []);

  const fetchWidgets = async () => {
    try {
      const res = await axios.get("/home-widgets");
      setWidgets(res.data);
    } catch (err) {
      console.error("Error fetching widgets", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories", err);
    }
  };

  // Create widget
  const handleCreate = async () => {
    try {
      const res = await axios.post("/home-widgets", newWidget);
      setWidgets([...widgets, res.data]);
      setNewWidget({
        title: "",
        widgetType: "CATEGORY_SECTION",
        categoryId: "",
        backgroundColor: "bg-white",
        iconName: "GiCow",
      });
    } catch (err) {
      console.error("Error creating widget", err);
    }
  };

  // Delete widget
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this widget?")) return;
    try {
      await axios.delete(`/home-widgets/${id}`);
      setWidgets(widgets.filter((w) => w.id !== id));
    } catch (err) {
      console.error("Error deleting widget", err);
    }
  };

  // Update widget inline
  const handleUpdate = async (id, field, value) => {
    const updatedWidgets = widgets.map((w) =>
      w.id === id ? { ...w, [field]: value } : w
    );
    setWidgets(updatedWidgets);
    try {
      const widget = updatedWidgets.find((w) => w.id === id);
      await axios.put(`/home-widgets/${id}`, widget);
    } catch (err) {
      console.error("Error updating widget", err);
    }
  };

  // Handle reorder
  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const reordered = Array.from(widgets);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    const updated = reordered.map((w, index) => ({
      ...w,
      orderIndex: index,
    }));

    setWidgets(updated);
    // Save new order to backend
    for (const widget of updated) {
      await axios.put(`/home-widgets/${widget.id}`, widget);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">🏠 Homepage Widgets</h2>

      {/* New Widget Form */}
      <div className="border p-4 mb-6 rounded-lg bg-gray-50 shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Add New Widget</h3>
        <div className="grid grid-cols-5 gap-2">
          <input
            type="text"
            placeholder="Title"
            value={newWidget.title}
            onChange={(e) =>
              setNewWidget({ ...newWidget, title: e.target.value })
            }
            className="border p-2 rounded"
          />
          <select
            value={newWidget.categoryId}
            onChange={(e) =>
              setNewWidget({ ...newWidget, categoryId: e.target.value })
            }
            className="border p-2 rounded"
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Icon Name (e.g., GiCow)"
            value={newWidget.iconName}
            onChange={(e) =>
              setNewWidget({ ...newWidget, iconName: e.target.value })
            }
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Background (e.g., bg-pink-100)"
            value={newWidget.backgroundColor}
            onChange={(e) =>
              setNewWidget({ ...newWidget, backgroundColor: e.target.value })
            }
            className="border p-2 rounded"
          />
          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-1"
          >
            <FaPlus /> Add
          </button>
        </div>
      </div>

      {/* Widget List with Drag/Drop */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="widgets">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {widgets.map((widget, index) => (
                <Draggable
                  key={widget.id}
                  draggableId={widget.id.toString()}
                  index={index}
                >
                  {(provided) => (
                    <div
                      {...provided.draggableProps}
                      ref={provided.innerRef}
                      className="bg-white border rounded-lg p-4 mb-2 shadow-sm flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <span
                          {...provided.dragHandleProps}
                          className="cursor-grab text-gray-500"
                        >
                          <FaGripVertical />
                        </span>
                        <input
                          type="text"
                          value={widget.title}
                          onChange={(e) =>
                            handleUpdate(widget.id, "title", e.target.value)
                          }
                          className="border p-2 rounded w-1/4"
                        />
                        <select
                          value={widget.category?.id || ""}
                          onChange={(e) =>
                            handleUpdate(widget.id, "categoryId", e.target.value)
                          }
                          className="border p-2 rounded w-1/4"
                        >
                          <option value="">Select Category</option>
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={widget.iconName}
                          onChange={(e) =>
                            handleUpdate(widget.id, "iconName", e.target.value)
                          }
                          className="border p-2 rounded w-1/4"
                        />
                        <input
                          type="text"
                          value={widget.backgroundColor}
                          onChange={(e) =>
                            handleUpdate(
                              widget.id,
                              "backgroundColor",
                              e.target.value
                            )
                          }
                          className="border p-2 rounded w-1/4"
                        />
                      </div>
                      <button
                        onClick={() => handleDelete(widget.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Widgets;
