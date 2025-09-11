import React, { useState } from "react";
import { useLoading } from "../contexts/LoadingContext";
import axios from "../api/axios";
import { FaClipboardList, FaMoneyBill, FaTruck, FaCheckCircle } from "react-icons/fa";
import { useTranslation } from "react-i18next";

// ✅ Timeline Component
function OrderTrackingTimeline({ status }) {
  const steps = [
    { key: "PENDING", label: "Pending", icon: <FaClipboardList /> },
    { key: "PAID", label: "Paid", icon: <FaMoneyBill /> },
    { key: "SHIPPED", label: "Shipped", icon: <FaTruck /> },
    { key: "DELIVERED", label: "Delivered", icon: <FaCheckCircle /> },
  ];

  const currentStepIndex = steps.findIndex((step) => step.key === status);
  const { t } = useTranslation();

  return (
    <div className="flex justify-between items-center w-full container mx-auto mt-8">
      {steps.map((step, index) => {
        const isCompleted = index <= currentStepIndex;
        const isActive = index === currentStepIndex;

        return (
          <div key={step.key} className="flex-1 flex flex-col items-center relative">
            {/* Step Circle */}
            <div
              className={`flex items-center justify-center w-12 h-12 rounded-full border-2 z-10
                ${isCompleted ? "bg-green-500 border-green-500 text-white" : "bg-gray-200 border-gray-300 text-gray-500"}
                ${isActive ? "ring-4 ring-green-200" : ""}
              `}
            >
              {step.icon}
            </div>

            {/* Label */}
            <span
              className={`mt-2 text-sm font-medium ${
                isCompleted ? "text-green-600" : "text-gray-500"
              }`}
            >
              {t(step.label)}
            </span>

            {/* Connecting Line */}
            {index < steps.length - 1 && (
              <div
                className={`absolute top-6 w-full h-1 -z-10 ${
                  index < currentStepIndex ? "bg-green-500" : "bg-gray-300"
                }`}
                style={{ transform: "translateX(50%)" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ✅ Main Component
export default function TrackOrder() {
  const { setLoading } = useLoading();
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const { t } = useTranslation();

  const handleTrackOrder = async () => {
    if (!orderId.trim()) {
      setError("Please enter a valid Order ID");
      return;
    }

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await axios.get(`/orders/${orderId}`);
      setOrder(res.data);
      console.log(res.data);
    } catch (err) {
      console.error(err);
      setError("Order not found or an error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-8 px-8 container mx-auto">
      <h1 className="text-center text-3xl font-bold mb-6">{t("Track your Order")}</h1>

      {/* Input & Button */}
      <div className="flex items-center gap-2 justify-center mb-[50px]">
        <input
          type="text"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder={t("Enter your Order ID")}
          className="border border-gray-300 rounded px-4 py-2 w-64 focus:outline-none focus:ring focus:border-red-800"
        />
        <button
          onClick={handleTrackOrder}
          className="bg-red-800 text-white px-4 py-2 rounded hover:bloody"
        >
          {t("Track Order")}
        </button>
      </div>

      {/* Error */}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Order Info + Timeline */}
      {order && (
        <>
          {/* Timeline */}
          <OrderTrackingTimeline status={order.status} />
          <div className="border rounded p-4 mt-[50px] shadow container mx-auto">
            <h2 className="text-lg font-bold mb-2">{t("Order")} #{order.id}</h2>
            <p>
              {t("Status")}:{" "}
              <span className="font-medium">{order.status}</span>
            </p>
            <table className="w-full my-4 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-white uppercase bg-indigo-400 dark:text-white">
                <tr>
                  <th className="p-2">{t("Title")}</th>
                  <th className="p-2">{t("Quantity")}</th>
                  <th className="p-2">{t("Price per unit")}</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={`${item.id || item.productTitle}-${index}`} className="border-b border-indigo-400">
                    <td className="p-2">{item.productTitle}</td>
                    <td className="p-2">{item.quantity}</td>
                    <td className="p-2">{item.pricePerUnit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p>{t("Total")}: ${order.totalPrice}</p>
            <p>{t("Placed on")}: {new Date(order.createdAt).toLocaleString()}</p>
          </div>
        </>
      )}
    </div>
  );
}
