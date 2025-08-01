import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Checkout = () => {
  const cartItems = useSelector(state => state.cart.items);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h2 className="text-xl font-semibold mb-2">Your cart is empty.</h2>
        <Link to="/" className="text-blue-500 underline">Go back to shop</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      <ul className="mb-4">
        {cartItems.map(item => (
          <li key={item.id} className="mb-2">
            {item.quantity} × {item.title} — ${(item.price * item.quantity).toFixed(2)}
          </li>
        ))}
      </ul>
      <h3 className="text-xl font-semibold mb-4">Total: ${totalPrice.toFixed(2)}</h3>
      <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
        Confirm Order
      </button>
    </div>
  );
};

export default Checkout;
