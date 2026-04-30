import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { saveCheckoutInfo } from '../redux/checkoutSlice';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from '../api/axios';
import { useTranslation } from "react-i18next";

// ─── Reusable FormField ───────────────────────────────────────────────────────
const FormField = ({ label, name, type = "text", register, rules, errors, required, placeholder }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">
      {label}{required && <span className="text-red-600 ml-0.5">*</span>}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      {...register(name, {
        ...rules,
        ...(rules?.required ? { required: `${label} is required` } : {}),
      })}
      className={`w-full px-3 py-2 border rounded-md shadow-sm text-sm
        focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-red-800 transition-colors
        ${errors[name] ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
    />
    {errors[name] && (
      <span className="text-red-500 text-xs flex items-center gap-1">
        <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        {errors[name].message || `${label} is required`}
      </span>
    )}
  </div>
);

const SectionTitle = ({ children }) => (
  <h3 className="text-base font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
    {children}
  </h3>
);

// ─── Checkout Component ───────────────────────────────────────────────────────
const Checkout = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const reduxUser = useSelector((state) => state.auth?.user);
  const localUser = JSON.parse(localStorage.getItem('user') || 'null');
  const user = reduxUser || localUser;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoApplied, setPromoApplied] = useState(false);

  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [postalCodes, setPostalCodes] = useState([]);
  const [geoLoading, setGeoLoading] = useState({ cities: false, postal: false });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      shippingMethod: 'standard',
      paymentMethod: 'card',
    }
  });

  const isLegalEntity = watch('isLegalEntity');
  const shippingMethod = watch('shippingMethod');
  const paymentMethod = watch('paymentMethod');
  const selectedCountry = watch("country");
  const selectedCity = watch("city");

  // ── Totals (reactive to shippingMethod) ────────────────────────────────────
  const shippingPrice = shippingMethod === 'express' ? 15 : 5;
  const itemsTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalBeforeDiscount = itemsTotal + shippingPrice;
  const finalTotal = Math.max(0, totalBeforeDiscount - discount);

  // ── Auth guard ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: location.pathname } });
    } else {
      setValue('name', user.name || '');
      setValue('email', user.email || '');
      setValue('phone', user.phone || '');
    }
  }, [user, navigate, location.pathname, setValue]);

  // ── Geo: load countries once ───────────────────────────────────────────────
  useEffect(() => {
    axios.get("/geo/countries").then(res => setCountries(res.data)).catch(() => {});
  }, []);

  // ── Geo: cities when country changes ──────────────────────────────────────
  useEffect(() => {
    if (!selectedCountry) return;
    setValue("city", "");
    setValue("zip", "");
    setCities([]);
    setPostalCodes([]);
    setGeoLoading(g => ({ ...g, cities: true }));
    axios.get("/geo/cities", { params: { countryCode: selectedCountry } })
      .then(res => setCities(res.data))
      .catch(() => {})
      .finally(() => setGeoLoading(g => ({ ...g, cities: false })));
  }, [selectedCountry, setValue]);

  // ── Geo: postal codes when city changes ────────────────────────────────────
  // FIX: also pass selectedCountry here and include it in deps
  useEffect(() => {
    if (!selectedCountry || !selectedCity) return;
    setValue("zip", "");
    setPostalCodes([]);
    setGeoLoading(g => ({ ...g, postal: true }));
    axios.get("/geo/postal-codes", { params: { countryCode: selectedCountry, city: selectedCity } })
      .then(res => setPostalCodes(res.data))
      .catch(() => {})
      .finally(() => setGeoLoading(g => ({ ...g, postal: false })));
  }, [selectedCountry, selectedCity, setValue]);

  // ── Promo ──────────────────────────────────────────────────────────────────
  // FIX: pass totalBeforeDiscount (fresh value) not totalPrice
  const applyPromo = async () => {
    if (!promoCode.trim()) return;
    setPromoLoading(true);
    setPromoError("");
    try {
      const response = await axios.post(`/promo/apply?code=${promoCode.trim()}&total=${totalBeforeDiscount}`);
      const newTotal = response.data.newTotal;
      setDiscount(totalBeforeDiscount - newTotal);
      setPromoApplied(true);
    } catch (err) {
      setPromoError(err.response?.data?.message || t("Invalid or expired promo code"));
      setDiscount(0);
      setPromoApplied(false);
    } finally {
      setPromoLoading(false);
    }
  };

  const removePromo = () => {
    setPromoCode("");
    setDiscount(0);
    setPromoApplied(false);
    setPromoError("");
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const onSubmit = async (data) => {
    setLoading(true);

    const checkoutPayload = {
      userId: user.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      country: data.country,
      city: data.city,
      zip: data.zip,
      notes: data.notes || '',
      shippingMethod: data.shippingMethod,
      paymentMethod: data.paymentMethod,
      isLegalEntity: data.isLegalEntity || false,
      companyName: data.companyName || '',
      registrationNr: data.registrationNr || '',
      vatNumber: data.vatNumber || '',
      legalAddress: data.legalAddress || '',
      agreeToTerms: data.agreeToTerms || false,
      promoCode: promoCode || null,
      items: cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        pricePerUnit: item.price,
      })),
      totalPrice: finalTotal,
    };

    try {
      const response = await axios.post('/checkout/initiate', checkoutPayload);
      const { orderId, paymentMethod: pm, paymentUrl, clientSecret } = response.data;

      dispatch(saveCheckoutInfo({ ...data, orderId }));
      localStorage.setItem('checkoutInfo', JSON.stringify({ ...data, orderId }));
      localStorage.setItem('currentOrderId', orderId);

      if (pm === 'click' && paymentUrl) {
        // ── CLICK payment flow (FIXED) ──────────────────────────────────────
        // The order is created with status PENDING_PAYMENT.
        // User pays on CLICK's side. CLICK calls your backend webhook to confirm.
        // CLICK then redirects back to /order-confirmation?orderId=XXX
        // On that page, poll GET /checkout/payment-status/{orderId} until PAID.
        // Do NOT navigate here — let CLICK handle the return redirect.
        window.location.href = paymentUrl;
      } else if (pm === 'card' && clientSecret) {
        navigate('/order-confirmation', { state: { orderId, clientSecret } });
      } else if (pm === 'cod') {
        navigate('/order-confirmation', { state: { orderId } });
      }
    } catch (error) {
      alert(error.response?.data?.message || t('Checkout failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  // ── Empty cart ─────────────────────────────────────────────────────────────
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8 gap-4">
        <div className="text-6xl mb-2">🛒</div>
        <h2 className="text-2xl font-semibold text-gray-800">{t("Your cart is empty.")}</h2>
        <p className="text-gray-500">{t("Add some items before checking out.")}</p>
        <Link
          to="/"
          className="mt-2 inline-block bg-red-800 text-white px-6 py-2.5 rounded-md font-medium hover:bg-red-900 transition-colors"
        >
          {t("Go back to shop")}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-8 items-start">

      {/* ── Left: Checkout Form ─────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit(onSubmit)} className="md:col-span-2 space-y-8">

        {/* Contact */}
        <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <SectionTitle>{t("Contact Information")}</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label={t("Full Name")} name="name" register={register} rules={{ required: true }} errors={errors} required placeholder="John Doe" />
            <FormField label={t("Email")} name="email" type="email" register={register} rules={{ required: true }} errors={errors} required placeholder="john@example.com" />
            <div className="sm:col-span-2">
              <FormField label={t("Phone")} name="phone" type="tel" register={register} rules={{ required: true }} errors={errors} required placeholder="+1 555 000 0000" />
            </div>
          </div>
        </section>

        {/* Legal Entity */}
        <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              {...register('isLegalEntity')}
              className="w-4 h-4 accent-red-800 rounded"
            />
            <span className="text-sm font-medium text-gray-700">{t("I am ordering as a legal entity")}</span>
          </label>

          {isLegalEntity && (
            <div className="mt-5 space-y-4 pt-4 border-t border-gray-100">
              <p className="text-sm font-semibold text-gray-800">{t("Company Information")}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label={t("Company Name")} name="companyName" register={register} rules={{ required: isLegalEntity }} errors={errors} required />
                <FormField label={t("Registration Nr")} name="registrationNr" register={register} rules={{ required: isLegalEntity }} errors={errors} required />
                <FormField label={t("VAT Number")} name="vatNumber" register={register} errors={errors} />
                <FormField label={t("Legal Address")} name="legalAddress" register={register} rules={{ required: isLegalEntity }} errors={errors} required />
              </div>
            </div>
          )}
        </section>

        {/* Shipping Address — FIX: Country → City → ZIP order */}
        <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <SectionTitle>{t("Shipping Address")}</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* 1. Country */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                {t("Country")}<span className="text-red-600 ml-0.5">*</span>
              </label>
              <select
                {...register("country", { required: `${t("Country")} is required` })}
                className={`w-full px-3 py-2 border rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-red-800 transition-colors
                  ${errors.country ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
              >
                <option value="">{t("Select country")}</option>
                {countries.map(c => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>
              {errors.country && <span className="text-red-500 text-xs">{errors.country.message}</span>}
            </div>

            {/* 2. City — must come before ZIP since ZIP depends on city */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                {t("City")}<span className="text-red-600 ml-0.5">*</span>
              </label>
              <div className="relative">
                <select
                  {...register("city", { required: `${t("City")} is required` })}
                  disabled={!cities.length}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-red-800 transition-colors
                    disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
                    ${errors.city ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                >
                  <option value="">
                    {geoLoading.cities ? t("Loading cities…") : t("Select city")}
                  </option>
                  {cities.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              {errors.city && <span className="text-red-500 text-xs">{errors.city.message}</span>}
              {!selectedCountry && <span className="text-gray-400 text-xs">{t("Select a country first")}</span>}
            </div>

            {/* 3. ZIP — depends on city */}
            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className="text-sm font-medium text-gray-700">
                {t("Post Code / ZIP")}<span className="text-red-600 ml-0.5">*</span>
              </label>
              <select
                {...register("zip", { required: `${t("ZIP")} is required` })}
                disabled={!postalCodes.length}
                className={`w-full px-3 py-2 border rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-red-800 transition-colors
                  disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
                  ${errors.zip ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
              >
                <option value="">
                  {geoLoading.postal ? t("Loading postal codes…") : t("Select ZIP")}
                </option>
                {postalCodes.map(p => (
                  <option key={p.id} value={p.code}>{p.code}</option>
                ))}
              </select>
              {errors.zip && <span className="text-red-500 text-xs">{errors.zip.message}</span>}
              {selectedCountry && !selectedCity && <span className="text-gray-400 text-xs">{t("Select a city first")}</span>}
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">{t("Order Notes")}</label>
            <textarea
              {...register('notes')}
              placeholder={t("Any special delivery instructions…")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm
                focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-red-800 transition-colors resize-none"
              rows={3}
            />
          </div>
        </section>

        {/* Terms */}
        <div className="flex flex-col gap-1">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              {...register('agreeToTerms', { required: t("You must accept the terms to continue") })}
              className="mt-0.5 w-4 h-4 accent-red-800"
            />
            <span className="text-sm text-gray-700">
              {t("I have read and agree to the website")}{" "}
              <Link to="/terms" className="text-red-800 underline hover:text-red-900">{t("terms and conditions")}</Link>
              {" "}<span className="text-red-600">*</span>
            </span>
          </label>
          {errors.agreeToTerms && (
            <span className="text-red-500 text-xs ml-7">{errors.agreeToTerms.message}</span>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-red-800 text-white px-6 py-3.5 rounded-lg font-semibold text-sm
            hover:bg-red-900 active:scale-[0.99] transition-all flex justify-center items-center gap-2
            ${loading ? 'cursor-not-allowed opacity-75' : ''}`}
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {t("Processing…")}
            </>
          ) : (
            <>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {paymentMethod === 'click'
                ? t("Proceed to CLICK Payment")
                : t("Confirm Order")}
            </>
          )}
        </button>
      </form>

      {/* ── Right: Order Summary ────────────────────────────────────────────── */}
      <aside className="sticky top-6 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-red-800 bg-red-800">
          <h2 className="text-white font-bold text-lg">{t("Order Summary")}</h2>
        </div>

        <div className="px-6 py-4 space-y-5">
          {/* Cart Items */}
          <div className="space-y-2">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-start text-sm">
                <span className="text-gray-700 flex-1 pr-2">
                  {item.title}
                  <span className="text-gray-400 ml-1">× {item.quantity}</span>
                </span>
                <span className="font-medium text-gray-900 whitespace-nowrap">
                  {(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Shipping Method */}
          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">{t("Shipping Method")}</p>
            <div className="space-y-2">
              {[
                { value: 'standard', label: t("Standard Shipping"), price: '5.00', note: '3–5 days' },
                { value: 'express', label: t("Express Shipping"), price: '15.00', note: '1–2 days' },
              ].map(opt => (
                <label key={opt.value} className="flex items-center justify-between cursor-pointer group">
                  <span className="flex items-center gap-2">
                    <input type="radio" value={opt.value} {...register('shippingMethod', { required: true })} className="accent-red-800" />
                    <span className="text-sm text-gray-700">{opt.label}</span>
                    <span className="text-xs text-gray-400">({opt.note})</span>
                  </span>
                  <span className="text-sm font-medium">{opt.price}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">{t("Payment Method")}</p>
            <div className="space-y-2">
              {[
                { value: 'card', label: t("Credit / Debit Card"), icon: '💳' },
                { value: 'click', label: t("CLICK Payment"), icon: '📱' },
                { value: 'cod', label: t("Cash on Delivery"), icon: '💵' },
              ].map(opt => (
                <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer">
                  <input type="radio" value={opt.value} {...register('paymentMethod', { required: true })} className="accent-red-800" />
                  <span className="text-sm text-gray-700">{opt.icon} {opt.label}</span>
                </label>
              ))}
            </div>
            {errors.paymentMethod && (
              <p className="text-red-500 text-xs mt-1">{t("Please select a payment method")}</p>
            )}

            {/* CLICK info banner */}
            {paymentMethod === 'click' && (
              <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2.5 text-xs text-blue-700 flex gap-2">
                <span>ℹ️</span>
                <span>{t("You'll be redirected to CLICK to complete payment. Your order will be confirmed automatically after payment.")}</span>
              </div>
            )}
          </div>

          {/* Promo Code */}
          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">{t("Promo Code")}</p>
            {!promoApplied ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), applyPromo())}
                  placeholder={t("Enter promo code")}
                  className="border border-gray-300 px-3 py-2 rounded-md text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-red-800"
                />
                <button
                  type="button"
                  onClick={applyPromo}
                  disabled={promoLoading || !promoCode.trim()}
                  className="bg-red-800 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                >
                  {promoLoading ? '…' : t("Apply")}
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                <span className="text-sm text-green-700 font-medium">✓ {promoCode}</span>
                <button type="button" onClick={removePromo} className="text-gray-400 hover:text-gray-600 text-xs">✕</button>
              </div>
            )}
            {promoError && <p className="text-red-500 text-xs mt-1">{promoError}</p>}
          </div>

          {/* Totals */}
          <div className="border-t border-gray-100 pt-4 space-y-1.5">
            <div className="flex justify-between text-sm text-gray-600">
              <span>{t("Subtotal")}</span>
              <span>{itemsTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>{t("Shipping")}</span>
              <span>{shippingPrice.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-green-600 font-medium">
                <span>{t("Discount")}</span>
                <span>− {discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200 mt-2">
              <span>{t("Total")}</span>
              <span>{finalTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Privacy note */}
          <p className="text-xs text-gray-400 leading-relaxed">
            {t("Your personal data will be used to process your order and support your experience throughout this website, as described in our privacy policy.")}
          </p>
        </div>
      </aside>
    </div>
  );
};

export default Checkout;