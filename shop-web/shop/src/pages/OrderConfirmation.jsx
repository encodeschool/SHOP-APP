import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { clearCart } from '../redux/cartSlice';
import { clearCheckoutInfo } from '../redux/checkoutSlice';
import { CheckCircle } from 'lucide-react';
import {useCheckoutInfo} from '../hooks/useCheckoutInfo';

const OrderConfirmation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const reduxCheckoutInfo = useSelector((state) => state.checkout.checkoutInfo);

  const checkoutInfo = useCheckoutInfo();

  // cart is cleared after confirmation, not used for validation anymore
  useEffect(() => {
    if (!checkoutInfo?.name || !checkoutInfo?.email) {
      navigate('/');
    } else {
      dispatch(clearCart());
      localStorage.removeItem('checkoutInfo'); // ✅ clean up
    }
  }, [checkoutInfo, navigate, dispatch]);

  if (!checkoutInfo) return null;

  return (
    <div className="container mx-auto px-4 py-10 text-center max-w-2xl">
      <div className="flex flex-col items-center space-y-6">
        <CheckCircle className="text-green-600 w-16 h-16" />
        <h1 className="text-3xl font-bold text-green-700">Order Confirmed!</h1>
        <p className="text-gray-700">
          Thank you, <span className="font-semibold">{checkoutInfo.name}</span>. Your order has been placed successfully.
        </p>
        <div className="w-full bg-white rounded shadow p-6 text-left">
          <h2 className="text-xl font-semibold mb-4">Shipping Info</h2>
          <p><strong>Email:</strong> {checkoutInfo.email}</p>
          <p><strong>Phone:</strong> {checkoutInfo.phone}</p>
          <p><strong>Address:</strong> {checkoutInfo.city}, {checkoutInfo.zip}, {checkoutInfo.country}</p>
          <p><strong>Shipping Method:</strong> {checkoutInfo.shippingMethod}</p>
          <p><strong>Payment Method:</strong> {checkoutInfo.paymentMethod}</p>
          {checkoutInfo.notes && <p><strong>Notes:</strong> {checkoutInfo.notes}</p>}
        </div>

        <Link to="/" className="mt-6 inline-block bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
