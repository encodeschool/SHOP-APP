// Order.jsx (main component)
import { useEffect, useState } from "react";
import axios from "../../api/axios";
import {
  DndContext,
  closestCenter,
  DragOverlay,
  useDraggable,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import StatusColumn from "../../components/StatusColumn";

const STATUSES = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];

const STATUS_COLORS = {
  PENDING: "bg-yellow-100",
  PAID: "bg-green-100",
  SHIPPED: "bg-blue-100",
  DELIVERED: "bg-purple-100",
  CANCELLED: "bg-red-100",
};

function OrderDetailModal({ order, onClose }) {
  if (!order) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Order Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Order Info */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Order Information</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-mono text-sm">{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[order.status]}`}>
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order Date:</span>
                <span>{new Date(order.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-semibold">Total Price:</span>
                <span className="font-semibold text-lg">${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Customer Information</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{order.user.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span>
                  <a href={`mailTo:${order.user.email}`}>{order.user.email}</a>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span>
                  <a href={`tel:${order.user.phone}`}>{order.user.phone}</a>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Username:</span>
                <span>@{order.user.username}</span>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          {order.country && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-700">Delivery Information</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 block mb-1">Address:</span>
                  <span className="font-medium">{order.country}, {order.city}, {order.zip}</span>
                </div>
                {order.notes && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 block mb-1">Delivery Notes:</span>
                    <span className="italic text-gray-700">{order.notes}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Order Items */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Order Items</h3>
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="text-left p-3 text-sm font-semibold">Product</th>
                    <th className="text-right p-3 text-sm font-semibold">Qty</th>
                    <th className="text-right p-3 text-sm font-semibold">Price</th>
                    <th className="text-right p-3 text-sm font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-100">
                      <td className="p-3">{item.productTitle}</td>
                      <td className="p-3 text-right">{item.quantity}</td>
                      <td className="p-3 text-right">${item.pricePerUnit.toFixed(2)}</td>
                      <td className="p-3 text-right font-medium">
                        ${(item.quantity * item.pricePerUnit).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-200 font-bold">
                    <td colSpan="3" className="p-3 text-right">Total:</td>
                    <td className="p-3 text-right">${order.totalPrice.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function OrderCard({ order, isOverlay = false, onClick }) {
  const [dragDistance, setDragDistance] = useState(0);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: order.id,
    disabled: order.status === "CANCELLED",
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  useEffect(() => {
    if (transform) {
      const distance = Math.sqrt(transform.x ** 2 + transform.y ** 2);
      setDragDistance(distance);
    } else {
      setDragDistance(0);
    }
  }, [transform]);

  const handleClick = (e) => {
    if (dragDistance < 5 && onClick) {
      onClick(order);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      className={`bg-white p-4 rounded-lg shadow mb-3 border-l-4 cursor-pointer hover:shadow-lg transition-shadow ${isOverlay ? "cursor-grabbing" : "cursor-grab"}`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs text-gray-500">
          {new Date(order.createdAt).toLocaleDateString()}
        </span>
      </div>
      <div className="flex justify-between items-start mb-2">
        <span className={`text-xs font-semibold px-2 py-1 rounded ${
          STATUS_COLORS[order.status]
        }`}>
          {order.status}
        </span>
      </div>
      <div className="mb-2">
        <p className="font-semibold text-sm">{order.user.name}</p>
        <p className="text-xs text-gray-600 break-all">{order.user.email}</p>
        {order.user.phone && (
          <p className="text-xs text-gray-600">{order.user.phone}</p>
        )}
      </div>
      <div className="flex justify-between items-center">
        <span className="text-lg font-bold">${order.totalPrice.toFixed(2)}</span>
        <span className="text-xs text-gray-500">
          {order.items.length} item{order.items.length !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}

export default function Order() {
  const [orders, setOrders] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    axios.get("/orders").then((res) => {
      setOrders(res.data);
    });
  }, []);

  const handleDragStart = (event) => {
    const order = orders.find((o) => o.id === event.active.id);
    setActiveOrder(order);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveOrder(null);

    if (!over) return;

    const orderId = active.id;
    const newStatus = over.id; // Now over.id will be the status column

    if (!newStatus || !STATUSES.includes(newStatus)) return;

    const order = orders.find((o) => o.id === orderId);
    if (order.status === "CANCELLED" && newStatus !== "CANCELLED") {
      return;
    }

    if (order.status === newStatus) return;

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );

    axios
      .patch(`/orders/${orderId}/status`, { status: newStatus })
      .then((res) => {
        console.log("Status updated:", res.data);
      })
      .catch((err) => {
        console.error("Failed to update status:", err);
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: order.status } : o))
        );
      });
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 p-4">
        {STATUSES.map((status) => {
          const columnOrders = orders.filter((o) => o.status === status);

          return (
            <StatusColumn key={status} status={status} color={STATUS_COLORS[status]}>
              {columnOrders.map((order) => (
                <OrderCard 
                  key={order.id} 
                  order={order}
                  onClick={setSelectedOrder}
                />
              ))}
            </StatusColumn>
          );
        })}
      </div>

      <DragOverlay>
        {activeOrder ? <OrderCard order={activeOrder} onClick={setSelectedOrder} isOverlay /> : null}
      </DragOverlay>

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </DndContext>
  );
}