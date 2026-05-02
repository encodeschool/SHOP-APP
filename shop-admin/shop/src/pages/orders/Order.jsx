// Order.jsx
import { useEffect, useState, useRef, useCallback } from "react";
import axios from "../../api/axios";
import {
  DndContext,
  closestCorners,
  DragOverlay,
  useDraggable,
  useDroppable,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

const STATUSES = ["PENDING_PAYMENT", "PAYMENT_FAILED", "PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];

const STATUS_META = {
  PENDING_PAYMENT: { bg: "bg-amber-50",   pill: "bg-amber-100 text-amber-800",   border: "border-amber-400",  header: "bg-amber-400",   label: "Pending Payment" },
  PAYMENT_FAILED: { bg: "bg-rose-50",    pill: "bg-rose-100 text-rose-800",      border: "border-rose-400",   header: "bg-rose-400",    label: "Payment Failed" },
  PENDING:   { bg: "bg-amber-50",   pill: "bg-amber-100 text-amber-800",   border: "border-amber-400",  header: "bg-amber-400",   label: "Pending"   },
  PAID:      { bg: "bg-emerald-50", pill: "bg-emerald-100 text-emerald-800", border: "border-emerald-400", header: "bg-emerald-400", label: "Paid"      },
  SHIPPED:   { bg: "bg-sky-50",     pill: "bg-sky-100 text-sky-800",        border: "border-sky-400",    header: "bg-sky-400",     label: "Shipped"   },
  DELIVERED: { bg: "bg-violet-50",  pill: "bg-violet-100 text-violet-800",  border: "border-violet-400", header: "bg-violet-400",  label: "Delivered" },
  CANCELLED: { bg: "bg-rose-50",    pill: "bg-rose-100 text-rose-800",      border: "border-rose-400",   header: "bg-rose-400",    label: "Cancelled" },
};

// ── Debounce hook ─────────────────────────────────────────────────────────────
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ── Order Detail Modal ────────────────────────────────────────────────────────
function OrderDetailModal({ order, onClose }) {
  // Close on Escape
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!order) return null;
  const meta = STATUS_META[order.status];
  const BASE_URL = process.env.REACT_APP_BASE_URL || '';

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
            <p className="text-xs text-gray-400 font-mono mt-0.5">{order.id}</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors text-lg font-bold"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status + Date row */}
          <div className="flex flex-wrap gap-3 items-center">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${meta.pill}`}>
              {meta.label}
            </span>
            <span className="text-sm text-gray-500">
              {new Date(order.createdAt).toLocaleString()}
            </span>
            <span className="ml-auto text-2xl font-bold text-gray-900">
              {order.totalPrice.toFixed(2)}
            </span>
          </div>

          <Section title="Payment">
            <Row
              label="Method"
              value={
                <span className="capitalize">
                  {order.paymentMethod === "CARD" && "💳 Card"}
                  {order.paymentMethod === "CLiCK" && "📱 CLICK"}
                  {order.paymentMethod === "COD" && "💵 Cash on Delivery"}
                  {!order.paymentMethod && "UNKNOWN"}
                </span>
              }
            />
          </Section>

          {/* Customer */}
          <Section title="Customer">
            <Row label="Name" value={order.user.name} />
            <Row label="Email" value={
              <a href={`mailto:${order.user.email}`} className="text-blue-600 hover:underline">
                {order.user.email}
              </a>
            } />
            {order.user.phone && (
              <Row label="Phone" value={
                <a href={`tel:${order.user.phone}`} className="text-blue-600 hover:underline">
                  {order.user.phone}
                </a>
              } />
            )}
            <Row label="Username" value={`@${order.user.username}`} />
          </Section>

          {/* Delivery */}
          {order.country && (
            <Section title="Delivery">
              <Row label="Address" value={[order.country, order.city, order.zip].filter(Boolean).join(", ")} />
              {order.notes && <Row label="Notes" value={<span className="italic text-gray-600">{order.notes}</span>} />}
            </Section>
          )}

          {/* Items table */}
          <Section title="Items">
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Product</th>
                    <th className="text-right px-4 py-2.5 font-semibold text-gray-600">Qty</th>
                    <th className="text-right px-4 py-2.5 font-semibold text-gray-600">Unit</th>
                    <th className="text-right px-4 py-2.5 font-semibold text-gray-600">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2.5">
                        {item.productImages && item.productImages.length > 0 && (
                          <img src={`${BASE_URL}${item.productImages[0]}`} alt={item.productTitle} className="w-16 h-16 object-cover rounded-lg" />
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-right text-gray-600">{item.quantity}</td>
                      <td className="px-4 py-2.5 text-right text-gray-600">{item.pricePerUnit.toFixed(2)}</td>
                      <td className="px-4 py-2.5 text-right font-medium">{(item.quantity * item.pricePerUnit).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50 border-t-2 border-gray-200 font-bold">
                    <td colSpan="3" className="px-4 py-2.5 text-right">Total</td>
                    <td className="px-4 py-2.5 text-right">{order.totalPrice.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Section>
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-100 px-6 py-4 flex justify-end rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">{title}</h3>
      <div className="bg-gray-50 rounded-xl p-4 space-y-2">
        {children}
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between items-center gap-4">
      <span className="text-sm text-gray-500 shrink-0">{label}</span>
      <span className="text-sm font-medium text-gray-900 text-right">{value}</span>
    </div>
  );
}

// ── Order Card ────────────────────────────────────────────────────────────────
// FIX: Separate drag handle (grip icon) from the clickable card body.
// The drag listeners ONLY go on the grip handle — the rest of the card is a
// normal click target. This completely eliminates the click-vs-drag conflict.
function OrderCard({ order, isOverlay = false, onClick }) {
  const meta = STATUS_META[order.status];
  const isCancelled = order.status === "CANCELLED";

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: order.id,
    disabled: isCancelled,
  });

  const cardStyle = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={cardStyle}
      className={`bg-white rounded-xl shadow-sm border border-gray-100 border-l-4 ${meta.border}
        transition-all duration-150
        ${isDragging ? "opacity-40 shadow-none" : "opacity-100"}
        ${isOverlay ? "shadow-2xl rotate-1 scale-105" : "hover:shadow-md"}
      `}
    >
      {/* Card body — this is what you click to open the modal */}
      <button
        type="button"
        onClick={() => !isDragging && onClick?.(order)}
        className="w-full text-left p-4 pr-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-gray-900 truncate">{order.user.name}</p>
            <p className="text-xs text-gray-400 truncate">{order.user.email}</p>
          </div>
          <span className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${meta.pill}`}>
            {meta.label}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">{order.totalPrice.toFixed(2)}</span>
          <span className="text-xs text-gray-400">
            {order.items.length} item{order.items.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="mt-1">
          <span className="text-xs text-gray-400">
            {new Date(order.createdAt).toLocaleDateString()}
          </span>
        </div>
      </button>

      {/* Drag handle — ONLY this element has dnd-kit listeners */}
      {!isCancelled && (
        <div
          {...attributes}
          {...listeners}
          className={`px-3 py-2 border-t border-gray-100 flex items-center justify-center
            text-gray-300 hover:text-gray-500 transition-colors
            ${isOverlay ? "cursor-grabbing" : "cursor-grab active:cursor-grabbing"}
            rounded-b-xl select-none`}
          title="Drag to change status"
        >
          {/* Grip dots icon */}
          <svg width="20" height="12" viewBox="0 0 20 12" fill="currentColor">
            <circle cx="3" cy="3" r="1.5"/><circle cx="10" cy="3" r="1.5"/><circle cx="17" cy="3" r="1.5"/>
            <circle cx="3" cy="9" r="1.5"/><circle cx="10" cy="9" r="1.5"/><circle cx="17" cy="9" r="1.5"/>
          </svg>
        </div>
      )}
    </div>
  );
}

// ── Status Column ─────────────────────────────────────────────────────────────
function StatusColumn({ status, children, count }) {
  const meta = STATUS_META[status];
  // FIX: useDroppable makes the column a valid drop target
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div className="flex flex-col min-h-[200px]">
      {/* Column header */}
      <div className={`${meta.header} rounded-t-xl px-4 py-2.5 flex items-center justify-between`}>
        <span className="text-white font-semibold text-sm tracking-wide">{meta.label}</span>
        <span className="bg-white/30 text-white text-xs font-bold px-2 py-0.5 rounded-full">
          {count}
        </span>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={`flex-1 rounded-b-xl p-2 pt-3 transition-colors duration-150 min-h-[120px]
          ${isOver ? `${meta.bg} ring-2 ring-inset ring-current` : "bg-gray-50/80"}`}
      >
        <div className="space-y-2">
          {children}
        </div>
        {count === 0 && (
          <div className="flex items-center justify-center h-16 text-gray-300 text-xs">
            Drop here
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Order Page ───────────────────────────────────────────────────────────
export default function Order() {
  const [orders, setOrders] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [search, setSearch] = useState("");
  // FIX: Debounce search so we don't fire an API call on every keystroke
  const debouncedSearch = useDebounce(search, 350);

  // FIX: Use distance activation constraint — must move 8px before drag starts,
  // so a tap/click never accidentally becomes a drag.
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  useEffect(() => {
    axios
      .get("/orders", { params: { search: debouncedSearch.trim() || undefined } })
      .then((res) => setOrders(res.data))
      .catch(console.error);
  }, [debouncedSearch]);

  const handleDragStart = (event) => {
    const order = orders.find((o) => o.id === event.active.id);
    setActiveOrder(order || null);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveOrder(null);
    if (!over) return;

    const orderId = active.id;
    const newStatus = over.id;

    if (!STATUSES.includes(newStatus)) return;

    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    if (order.status === "CANCELLED") return; // cancelled orders are locked
    if (order.status === newStatus) return;   // no-op

    // Optimistic update
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );

    axios
      .patch(`/orders/${orderId}/status`, { status: newStatus })
      .catch((err) => {
        console.error("Failed to update status:", err);
        // Rollback on failure
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: order.status } : o))
        );
      });
  };

  const totalOrders = orders.length;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      {/* Page header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500">{totalOrders} order{totalOrders !== 1 ? "s" : ""} total</p>
        </div>
        {/* FIX: Search input was wired up but never rendered */}
        <div className="sm:ml-auto relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders…"
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-white shadow-sm
              focus:outline-none focus:ring-2 focus:ring-gray-400 w-full sm:w-60 transition-all"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {STATUSES.map((status) => {
            const columnOrders = orders.filter((o) => o.status === status);
            return (
              <StatusColumn key={status} status={status} count={columnOrders.length}>
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

        <DragOverlay dropAnimation={null}>
          {activeOrder
            ? <OrderCard order={activeOrder} isOverlay onClick={() => {}} />
            : null}
        </DragOverlay>
      </DndContext>

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}