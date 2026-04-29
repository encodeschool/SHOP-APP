import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { clearCart } from '../redux/cartSlice';
import { clearCheckoutInfo } from '../redux/checkoutSlice';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';
import {useCheckoutInfo} from '../hooks/useCheckoutInfo';
import { useTranslation } from "react-i18next";
import axios from '../api/axios';

const OrderConfirmation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  const reduxCheckoutInfo = useSelector((state) => state.checkout.checkoutInfo);
  const checkoutInfo = useCheckoutInfo();
  const { t } = useTranslation();
  
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get orderId from URL params or localStorage
  const urlOrderId = searchParams.get('orderId');
  const storedOrderId = localStorage.getItem('currentOrderId');
  const orderId = location.state?.orderId || urlOrderId || storedOrderId;

  useEffect(() => {
    const verifyPaymentStatus = async () => {
      if (!orderId) {
        if (!checkoutInfo?.name || !checkoutInfo?.email) {
          navigate('/');
        } else {
          dispatch(clearCart());
          setLoading(false);
        }
        return;
      }

      try {
        const response = await axios.get(`/checkout/payment-status/${orderId}`);
        setPaymentStatus(response.data);
        setLoading(false);

        // Clear localStorage after successful verification
        if (response.data.paymentStatus === 'PAID' || response.data.orderStatus === 'PAID') {
          localStorage.removeItem('currentOrderId');
          localStorage.removeItem('checkoutInfo');
          dispatch(clearCart());
        }
      } catch (err) {
        console.error('Error checking payment status:', err);
        setError(err.response?.data?.message || 'Error verifying payment');
        setLoading(false);
      }
    };

    verifyPaymentStatus();
  }, [orderId, checkoutInfo, navigate, dispatch]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10 text-center max-w-2xl">
        <Loader className="animate-spin w-8 h-8 mx-auto text-blue-500 mb-4" />
        <p className="text-gray-600">{t("Verifying payment...")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-10 text-center max-w-2xl">
        <div className="flex flex-col items-center space-y-6">
          <AlertCircle className="text-red-600 w-16 h-16" />
          <h1 className="text-3xl font-bold text-red-700">{t("Payment Error")}</h1>
          <p className="text-gray-700">{error}</p>
          <Link to="/" className="mt-6 inline-block bg-red-800 text-white px-6 py-2 rounded hover:bg-red-900">
            {t("Back to Home")}
          </Link>
        </div>
      </div>
    );
  }

  if (!checkoutInfo && !paymentStatus) {
    return null;
  }

  const displayInfo = checkoutInfo || {};

  return (
    <div className="container mx-auto px-4 py-10 text-center max-w-2xl">
      <div className="flex flex-col items-center space-y-6">
        <CheckCircle className="text-green-600 w-16 h-16" />
        <h1 className="text-3xl font-bold text-green-700">{t("Order Confirmed!")}</h1>
        <p className="text-gray-700">
          {t("Thank you")}, <span className="font-semibold">{displayInfo.name}</span>. {t("Your order has been placed successfully.")}
        </p>
        
        {paymentStatus && (
          <div className="w-full bg-blue-50 rounded shadow p-4 text-left border-l-4 border-blue-600 mb-4">
            <h3 className="font-semibold text-blue-900 mb-2">{t("Payment Status")}</h3>
            <p><strong>{t("Order ID")}:</strong> {paymentStatus.orderId}</p>
            <p><strong>{t("Status")}:</strong> <span className="text-green-600 font-semibold">{paymentStatus.paymentStatus}</span></p>
            <p><strong>{t("Amount")}:</strong> {paymentStatus.amount}</p>
            {paymentStatus.provider && <p><strong>{t("Provider")}:</strong> {paymentStatus.provider}</p>}
          </div>
        )}
        
        <div className="w-full bg-white rounded shadow p-6 text-left">
          <h2 className="text-xl font-semibold mb-4">{t("Shipping Info")}</h2>
          <p><strong>{t("Email")}:</strong> {displayInfo.email}</p>
          <p><strong>{t("Phone")}:</strong> {displayInfo.phone}</p>
          {displayInfo.city && <p><strong>{t("Address")}:</strong> {displayInfo.city}, {displayInfo.zip}, {displayInfo.country}</p>}
          {displayInfo.shippingMethod && <p><strong>{t("Shipping Method")}:</strong> {displayInfo.shippingMethod}</p>}
          {displayInfo.paymentMethod && <p><strong>{t("Payment Method")}:</strong> {displayInfo.paymentMethod}</p>}
          {displayInfo.notes && <p><strong>{t("Notes")}:</strong> {displayInfo.notes}</p>}
        </div>

        <Link to="/" className="mt-6 inline-block bg-red-800 text-white px-6 py-2 rounded hover:bg-red-900">
          {t("Continue Shopping")}
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
