// src/components/CartView.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart } from '../redux/cartSlice';

const CartView = () => {
  const cartItems = useSelector(state => state.cart.items);
  const dispatch = useDispatch();

  // Calculate total price
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cartItems.length === 0) {
    return <div className="container mx-auto p-4 text-center">Your cart is empty.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Your Cart</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2 text-left">Product</th>
            <th className="border border-gray-300 p-2">Quantity</th>
            <th className="border border-gray-300 p-2">Price</th>
            <th className="border border-gray-300 p-2">Subtotal</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map(item => (
            <tr key={item.id} className="hover:bg-gray-100">
              <td className="border border-gray-300 p-2 flex items-center gap-4">
                <img
                  src={item.imageUrls?.[0] ? `http://localhost:8080${item.imageUrls[0]}` : '/placeholder.jpg'}
                  alt={item.title}
                  className="w-16 h-16 object-contain"
                />
                <span>{item.title}</span>
              </td>
              <td className="border border-gray-300 p-2 text-center">{item.quantity}</td>
              <td className="border border-gray-300 p-2 text-center">${item.price.toFixed(2)}</td>
              <td className="border border-gray-300 p-2 text-center">${(item.price * item.quantity).toFixed(2)}</td>
              <td className="border border-gray-300 p-2 text-center">
                <button
                  onClick={() => dispatch(removeFromCart(item.id))}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan="3" className="text-right font-semibold p-2 border border-gray-300">Total:</td>
            <td className="text-center font-semibold p-2 border border-gray-300">${totalPrice.toFixed(2)}</td>
            <td className="border border-gray-300"></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CartView;
