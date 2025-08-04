import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { saveCheckoutInfo } from '../redux/checkoutSlice';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from '../api/axios';

const Checkout = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const reduxUser = useSelector((state) => state.auth?.user);
  const localUser = JSON.parse(localStorage.getItem('user'));
  const user = reduxUser || localUser;
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const location = useLocation();

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
    } catch (error) {
      console.error('Error submitting checkout:', error.response?.data || error.message);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h2 className="text-xl font-semibold mb-2">Your cart is empty.</h2>
        <Link to="/" className="text-blue-500 underline">
          Go back to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 py-[50px] grid md:grid-cols-3 gap-8">
      {/* Checkout Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="md:col-span-2 space-y-4">
        <h2 className="text-2xl font-bold">Contact Information</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Full Name *</label>
            <input {...register('name', { required: true })} className="input" />
            {errors.name && <span className="text-red-500">Required</span>}
          </div>
          <div>
            <label>Email *</label>
            <input type="email" {...register('email', { required: true })} className="input" />
            {errors.email && <span className="text-red-500">Required</span>}
          </div>
        </div>

        <div>
          <label>Phone *</label>
          <input type="tel" {...register('phone', { required: true })} className="input" />
          {errors.phone && <span className="text-red-500">Required</span>}
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input type="checkbox" {...register('isLegalEntity')} />
            I am a legal entity
          </label>
        </div>

        {isLegalEntity && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Company Information</h3>
            <div>
              <label>Company Name *</label>
              <input {...register('companyName', { required: true })} className="input" />
              {errors.companyName && <span className="text-red-500">Required</span>}
            </div>
            <div>
              <label>Registration Nr *</label>
              <input {...register('registrationNr', { required: true })} className="input" />
              {errors.registrationNr && <span className="text-red-500">Required</span>}
            </div>
            <div>
              <label>VAT Number</label>
              <input {...register('vatNumber')} className="input" />
            </div>
            <div>
              <label>Legal Address *</label>
              <input {...register('legalAddress', { required: true })} className="input" />
              {errors.legalAddress && <span className="text-red-500">Required</span>}
            </div>
          </div>
        )}

        <h3 className="text-xl font-semibold">Shipping Address</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Country *</label>
            <input {...register('country', { required: true })} className="input" />
            {errors.country && <span className="text-red-500">Required</span>}
          </div>
          <div>
            <label>Post Code / ZIP *</label>
            <input {...register('zip', { required: true })} className="input" />
            {errors.zip && <span className="text-red-500">Required</span>}
          </div>
        </div>

        <div>
          <label>City *</label>
          <input {...register('city', { required: true })} className="input" />
          {errors.city && <span className="text-red-500">Required</span>}
        </div>

        <div>
          <label>Order Notes</label>
          <textarea {...register('notes')} className="input" rows={3} />
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input type="checkbox" {...register('agreeToTerms', { required: true })} />
            I have read and agree to the website terms and conditions *
          </label>
          {errors.agreeToTerms && <span className="text-red-500">You must accept the terms</span>}
        </div>

        <button
          type="submit"
          className="bg-green-600 w-[100%] text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Confirm Order
        </button>
      </form>

      {/* Order Summary */}
      <div className="border sticky rounded p-4 bg-gray-100">
        <h2 className="text-3xl border-b-2 border-b-indigo-400 pb-6 pt-3">Order Summary</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-indigo-400">
              <th className="text-left">Product</th>
              <th className="text-right">Total</th>
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
              <td colSpan={2} className="pt-4 pb-4 font-semibold">Shipping Method</td>
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
                    Standard Shipping
                  </span>
                  <span>$5.00</span>
                </label>
                <label className="flex items-center justify-between mt-2">
                  <span>
                    <input type="radio" value="express" {...register('shippingMethod')} />
                    Express Shipping
                  </span>
                  <span>$15.00</span>
                </label>
              </td>
            </tr>

            <tr className="border-t-2 border-indigo-400">
              <td colSpan={2} className="pt-4 pb-4 font-semibold">Payment Method</td>
            </tr>
            <tr>
              <td colSpan={2}>
                <label className="block">
                  <input type="radio" value="card" {...register('paymentMethod', { required: true })} defaultChecked />
                  Credit / Debit Card
                </label>
                <label className="block mt-2">
                  <input type="radio" value="paypal" {...register('paymentMethod')} />
                  PayPal
                </label>
                <label className="block mt-2">
                  <input type="radio" value="cod" {...register('paymentMethod')} />
                  Cash on Delivery
                </label>
                {errors.paymentMethod && (
                  <p className="text-red-500 mt-1">Please select a payment method</p>
                )}
              </td>
            </tr>

            <tr className="border-t-2 border-indigo-400 font-bold">
              <td className='py-4'>Total:</td>
              <td className="text-right">
                ${totalPrice.toFixed(2)} {/* ✅ Updated: total includes shipping */}
              </td>
            </tr>

            <tr>
              <td colSpan={2} className="text-sm text-gray-600 pt-4">
                Your personal data will be used to process your order, support your experience
                throughout this website, and for other purposes described in our privacy policy.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Checkout;
