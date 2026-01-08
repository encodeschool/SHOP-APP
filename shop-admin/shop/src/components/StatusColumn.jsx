// components/StatusColumn.jsx
import { useDroppable } from "@dnd-kit/core";

export default function StatusColumn({ status, color, children }) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: { status },
  });

  // Calculate count properly - children might be an array or a single element
  const count = Array.isArray(children) ? children.length : (children ? 1 : 0);

  return (
    <div
      ref={setNodeRef}
      className={`bg-gray-50 rounded-xl p-4 min-h-screen transition-colors
        ${isOver ? "bg-gray-200" : ""}`}
    >
      <h3 className={`text-lg font-semibold text-center text-gray-800 p-3 rounded-lg mb-4 ${color}`}>
        {status}
        <span className="ml-2 text-sm font-normal text-gray-600">
          ({count})
        </span>
      </h3>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}