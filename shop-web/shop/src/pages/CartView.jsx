// src/components/CartView.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, increaseQuantity, decreaseQuantity } from '../redux/cartSlice';
import { useTranslation } from "react-i18next";

const CartView = () => {
  const cartItems = useSelector(state => state.cart.items);
  const dispatch = useDispatch();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const { t } = useTranslation();

  // Calculate total price
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cartItems.length === 0) {
    return <div className="container mx-auto p-4 text-center">{t("Your cart is empty.")}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">{t("Your Cart")}</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-indigo-400 text-white text-center">
            <th className="border border-gray-300 p-2 text-left">{t("Product")}</th>
            <th className="border border-gray-300 p-2">{t("Quantity")}</th>
            <th className="border border-gray-300 p-2">{t("Price")}</th>
            <th className="border border-gray-300 p-2">{t("Subtotal")}</th>
            <th className="border border-gray-300 p-2">{t("Actions")}</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map(item => (
            <tr key={item.id} className="hover:bg-gray-100">
              <td className="border border-gray-300 p-2 flex items-center gap-4">
                <img
                  src={item.imageUrls?.[0] ? `${BASE_URL}${item.imageUrls[0]}` : '/placeholder.jpg'}
                  alt={item.title}
                  className="w-16 h-16 object-contain"
                />
                <span>{item.title}</span>
              </td>
              <td className="border border-gray-300 p-2 text-center">
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => dispatch(decreaseQuantity(item.id))}
                    className="px-2 py-1 bg-gray-300 hover:bg-gray-400 rounded"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => dispatch(increaseQuantity(item.id))}
                    className="px-2 py-1 bg-gray-300 hover:bg-gray-400 rounded"
                  >
                    +
                  </button>
                </div>
              </td>
              <td className="border border-gray-300 p-2 text-center">${item.price.toFixed(2)}</td>
              <td className="border border-gray-300 p-2 text-center">${(item.price * item.quantity).toFixed(2)}</td>
              <td className="border border-gray-300 p-2 text-center">
                <button
                  onClick={() => dispatch(removeFromCart(item.id))}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  {t("Remove")}
                </button>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan="3" className="text-right font-semibold p-2 border border-gray-300">{t("Total:")}</td>
            <td className="text-center font-semibold p-2 border border-gray-300">${totalPrice.toFixed(2)}</td>
            <td className="border border-gray-300"></td>
          </tr>
          <tr>
            <td colSpan="5" className="text-right p-2">
              <a
                href="/checkout"
                className="inline-block bg-indigo-400 hover:bg-indigo-600 text-white font-semibold px-6 py-2 rounded"
              >
                {t("Proceed to Checkout")}
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CartView;
