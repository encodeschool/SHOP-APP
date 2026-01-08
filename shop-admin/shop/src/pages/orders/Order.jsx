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

function OrderCard({ order, isOverlay = false }) {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white p-4 rounded-lg shadow mb-3 cursor-grab active:cursor-grabbing
        ${order.status === "CANCELLED" ? "opacity-60 cursor-not-allowed" : ""}
        ${isOverlay ? "shadow-2xl rotate-3" : ""}`}
    >
      <p className="text-xs font-medium text-gray-500">{order.status}</p>
      <p className="font-semibold text-gray-900">{order.user.name}</p>
      <p className="text-sm text-gray-600">{order.user.email}</p>
      <p className="mt-2 text-lg font-bold text-gray-900">${order.totalPrice}</p>
    </div>
  );
}

export default function Order() {
  const [orders, setOrders] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);

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
                <OrderCard key={order.id} order={order} />
              ))}
            </StatusColumn>
          );
        })}
      </div>

      <DragOverlay>
        {activeOrder ? <OrderCard order={activeOrder} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}