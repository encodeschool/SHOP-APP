import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { saveCheckoutInfo } from '../redux/checkoutSlice';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from '../api/axios';
import { useTranslation } from "react-i18next";

const Checkout = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const reduxUser = useSelector((state) => state.auth?.user);
  const localUser = JSON.parse(localStorage.getItem('user'));
  const user = reduxUser || localUser;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const isLegalEntity = watch('isLegalEntity');
  const shippingMethod = watch('shippingMethod');
  const paymentMethod = watch('paymentMethod');

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: location.pathname } });
    } else {
      setValue('name', user.name || '');
      setValue('email', user.email || '');
      setValue('phone', user.phone || '');
    }
  }, [user, navigate, location, setValue]);

  // ✅ Updated: calculate shipping price
  const shippingPrice = shippingMethod === 'express' ? 15 : 5;
  const itemsTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalPrice = itemsTotal + shippingPrice;

  const onSubmit = async (data) => {
    setLoading(true);
    // ✅ Updated: Build checkout payload with full details
    const checkoutPayload = {
      userId: user.id,
      items: cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        pricePerUnit: item.price,
      })),
      shippingMethod: data.shippingMethod, // ✅ Updated
      paymentMethod: data.paymentMethod,   // ✅ Updated
      shippingPrice: shippingPrice,        // ✅ Updated
      totalPrice: totalPrice,              // ✅ Updated
      shippingAddress: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        country: data.country,
        zip: data.zip,
        city: data.city,
        notes: data.notes || '',
      },
      paymentInfo: {
        isLegalEntity: data.isLegalEntity || false,
        companyName: data.companyName || '',
        registrationNr: data.registrationNr || '',
        vatNumber: data.vatNumber || '',
        legalAddress: data.legalAddress || '',
      },
    };

    try {
      const response = await axios.post('/orders', checkoutPayload); // ✅ Updated
      const order = response.data;
      console.log('Order created:', order);
      dispatch(saveCheckoutInfo(data));
      localStorage.setItem('checkoutInfo', JSON.stringify(data)); // ✅ Persistent
      navigate('/order-confirmation');
      setLoading(false);
    } catch (error) {
      console.error('Error submitting checkout:', error.response?.data || error.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h2 className="text-xl font-semibold mb-2">{t("Your cart is empty.")}</h2>
        <Link to="/" className="text-blue-500 underline">
          {t("Go back to shop")}
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 py-[50px] grid md:grid-cols-3 gap-8">
      {/* Checkout Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="md:col-span-2 space-y-4">
        <h2 className="text-2xl font-bold">{t("Contact Information")}</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>{t("Full Name")}*</label>
            <input {...register('name', { required: true })} className="input" />
            {errors.name && <span className="text-red-500">{t("Required")}</span>}
          </div>
          <div>
            <label>{t("Email")} *</label>
            <input type="email" {...register('email', { required: true })} className="input" />
            {errors.email && <span className="text-red-500">{t("Required")}</span>}
          </div>
        </div>

        <div>
          <label>{t("Phone")} *</label>
          <input type="tel" {...register('phone', { required: true })} className="input" />
          {errors.phone && <span className="text-red-500">{t("Required")}</span>}
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input type="checkbox" {...register('isLegalEntity')} />
            {t("I am a legal entity")}
          </label>
        </div>

        {isLegalEntity && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("Company Information")}</h3>
            <div>
              <label>{t("Company Name")} *</label>
              <input {...register('companyName', { required: true })} className="input" />
              {errors.companyName && <span className="text-red-500">{t("Required")}</span>}
            </div>
            <div>
              <label>{("Registration Nr")} *</label>
              <input {...register('registrationNr', { required: true })} className="input" />
              {errors.registrationNr && <span className="text-red-500">{t("Required")}</span>}
            </div>
            <div>
              <label>{t("VAT Number")}</label>
              <input {...register('vatNumber')} className="input" />
            </div>
            <div>
              <label>{t("Legal Address")} *</label>
              <input {...register('legalAddress', { required: true })} className="input" />
              {errors.legalAddress && <span className="text-red-500">{t("Required")}</span>}
            </div>
          </div>
        )}

        <h3 className="text-xl font-semibold">{t("Shipping Address")}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>{t("Country")} *</label>
            <input {...register('country', { required: true })} className="input" />
            {errors.country && <span className="text-red-500">{t("Required")}</span>}
          </div>
          <div>
            <label>{t("Post Code / ZIP")} *</label>
            <input {...register('zip', { required: true })} className="input" />
            {errors.zip && <span className="text-red-500">{t("Required")}</span>}
          </div>
        </div>

        <div>
          <label>{t("City")} *</label>
          <input {...register('city', { required: true })} className="input" />
          {errors.city && <span className="text-red-500">{t("Required")}</span>}
        </div>

        <div>
          <label>{t("Order Notes")}</label>
          <textarea {...register('notes')} className="input" rows={3} />
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input type="checkbox" {...register('agreeToTerms', { required: true })} />
            {t("I have read and agree to the website terms and conditions")} *
          </label>
          {errors.agreeToTerms && <span className="text-red-500">{("You must accept the terms")}</span>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`bg-indigo-400 w-full text-white px-6 py-2 rounded hover:bg-indigo-600 flex justify-center items-center ${
            loading ? 'cursor-not-allowed opacity-70' : ''
          }`}
        >
          {loading ? (
            <>
              <svg
                aria-hidden="true"
                role="status"
                className="inline w-5 h-5 mr-2 text-white animate-spin"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591
                  C22.3858 100.591 0 78.2051 0 50.5908
                  C0 22.9766 22.3858 0.59082 50 0.59082
                  C77.6142 0.59082 100 22.9766 100 50.5908Z"
                  fill="none"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116
                  97.0079 33.5539C95.2932 28.8227 92.871 24.3692
                  89.8167 20.348C85.8452 15.1192 80.8826 10.7238
                  75.2124 7.41289C69.5422 4.10194 63.2754 1.94025
                  56.7698 1.05124C51.7666 0.367541 46.6976 0.446843
                  41.7345 1.27873C39.2613 1.69328 37.813 4.19778
                  38.4501 6.62326C39.0873 9.04874 41.5694 10.4717
                  44.0505 10.1071C47.8511 9.54855 51.7191 9.52689
                  55.5402 10.0491C60.8642 10.7766 65.9928 12.5457
                  70.6331 15.2552C75.2735 17.9648 79.3347 21.5619
                  82.5849 25.841C84.9175 28.9121 86.7997 32.2913
                  88.1811 35.8758C89.083 38.2158 91.5421 39.6781
                  93.9676 39.0409Z"
                  fill="#E5E7EB"
                />
              </svg>
              {t("Processing...")}
            </>
          ) : (
            'Confirm Order'
          )}
        </button>
      </form>

      {/* Order Summary */}
      <div className="border sticky rounded p-4 bg-gray-100">
        <h2 className="text-3xl border-b-2 border-b-indigo-400 pb-6 pt-3">{t("Order Summary")}</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-indigo-400">
              <th className="text-left">{t("Product")}</th>
              <th className="text-right">{t("Total")}</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.id}>
                <td>{item.title} x {item.quantity}</td>
                <td className="text-right">${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}

            <tr className="border-t-2 border-indigo-400">
              <td colSpan={2} className="pt-4 pb-4 font-semibold">{t("Shipping Method")}</td>
            </tr>
            <tr>
              <td colSpan={2}>
                <label className="flex items-center justify-between">
                  <span>
                    <input
                      type="radio"
                      value="standard"
                      {...register('shippingMethod', { required: true })}
                      defaultChecked
                    />
                    {t("Standard Shipping")}
                  </span>
                  <span>$5.00</span>
                </label>
                <label className="flex items-center justify-between mt-2">
                  <span>
                    <input type="radio" value="express" {...register('shippingMethod')} />
                    {t("Express Shipping")}
                  </span>
                  <span>$15.00</span>
                </label>
              </td>
            </tr>

            <tr className="border-t-2 border-indigo-400">
              <td colSpan={2} className="pt-4 pb-4 font-semibold">{t("Payment Method")}</td>
            </tr>
            <tr>
              <td colSpan={2}>
                <label className="block">
                  <input type="radio" value="card" {...register('paymentMethod', { required: true })} defaultChecked />
                  {t("Credit / Debit Card")}
                </label>
                <label className="block mt-2">
                  <input type="radio" value="paypal" {...register('paymentMethod')} />
                  {t("PayPal")}
                </label>
                <label className="block mt-2">
                  <input type="radio" value="cod" {...register('paymentMethod')} />
                  {t("Cash on Delivery")}
                </label>
                {errors.paymentMethod && (
                  <p className="text-red-500 mt-1">{t("Please select a payment method")}</p>
                )}
              </td>
            </tr>

            <tr className="border-t-2 border-indigo-400 font-bold">
              <td className='py-4'>{t("Total")}:</td>
              <td className="text-right">
                ${totalPrice.toFixed(2)} {/* ✅ Updated: total includes shipping */}
              </td>
            </tr>

            <tr>
              <td colSpan={2} className="text-sm text-gray-600 pt-4">
                {t("Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our privacy policy.")}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Checkout;
