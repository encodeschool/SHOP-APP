import React, { useState } from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const { t } = useTranslation();

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.message.trim()) newErrors.message = "Message is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      console.log("Form submitted:", formData);
      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-10 py-6 text-gray-800">
      <h1 className="text-center text-3xl font-bold mb-6">{t("Contact Us")}</h1>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Contact Info */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">{t("Get in Touch")}</h2>
          <p className="text-gray-600">
            {t("Have questions or need assistance? Fill out the form or reach us using the details below.")}
          </p>
          <div className="flex items-center gap-3">
            <FaMapMarkerAlt className="text-red-700 text-xl" />
            <span>Tashkent city, Uzbekistan</span>
          </div>
          <div className="flex items-center gap-3">
            <FaPhoneAlt className="text-red-700 text-xl" />
            <span>+998 95 777-11-55</span>
          </div>
          <div className="flex items-center gap-3">
            <FaEnvelope className="text-red-700 text-xl" />
            <span>goshtgo@gmail.com</span>
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded">
          <div>
            <label className="block font-medium">{t("Full Name")}</label>
            <input
              type="text"
              placeholder={t("Enter your name...")}
              className="border border-gray-300 rounded w-full px-3 py-2 focus:outline-none focus:ring focus:border-red-700"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            {errors.name && <p className="text-red-700 text-sm">{errors.name}</p>}
          </div>

          <div>
            <label className="block font-medium">{t("Email")}</label>
            <input
              type="email"
              placeholder={t("Enter your email..")}
              className="border border-gray-300 rounded w-full px-3 py-2 focus:outline-none focus:ring focus:border-red-700"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            {errors.email && <p className="text-red-700 text-sm">{errors.email}</p>}
          </div>

          <div>
            <label className="block font-medium">{t("Message")}</label>
            <textarea
              placeholder={t("Enter your message")}
              className="border border-gray-300 rounded w-full px-3 py-2 h-32 focus:outline-none focus:ring focus:border-red-700"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            ></textarea>
            {errors.message && <p className="text-red-700 text-sm">{errors.message}</p>}
          </div>

          <button
            type="submit"
            className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            {t("Send Message")}
          </button>

          {submitted && (
            <p className="text-green-600 font-medium mt-2">
              {t("✅ Your message has been sent successfully!")}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
