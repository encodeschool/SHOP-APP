import React, { useState } from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

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
    <div className="my-8 px-4 container mx-auto">
      <h1 className="text-center text-3xl font-bold mb-6">Contact Us</h1>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Contact Info */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Get in Touch</h2>
          <p className="text-gray-600">
            Have questions or need assistance? Fill out the form or reach us using the details below.
          </p>
          <div className="flex items-center gap-3">
            <FaMapMarkerAlt className="text-indigo-400 text-xl" />
            <span>123 Main Street, Your City, Country</span>
          </div>
          <div className="flex items-center gap-3">
            <FaPhoneAlt className="text-indigo-400 text-xl" />
            <span>+1 234 567 890</span>
          </div>
          <div className="flex items-center gap-3">
            <FaEnvelope className="text-indigo-400 text-xl" />
            <span>support@yourshop.com</span>
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded">
          <div>
            <label className="block font-medium">Name</label>
            <input
              type="text"
              placeholder="Enter your name..."
              className="border border-gray-300 rounded w-full px-3 py-2 focus:outline-none focus:ring focus:border-indigo-400"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter your email.."
              className="border border-gray-300 rounded w-full px-3 py-2 focus:outline-none focus:ring focus:border-indigo-400"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div>
            <label className="block font-medium">Message</label>
            <textarea
              placeholder="Enter your message"
              className="border border-gray-300 rounded w-full px-3 py-2 h-32 focus:outline-none focus:ring focus:border-indigo-400"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            ></textarea>
            {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}
          </div>

          <button
            type="submit"
            className="bg-indigo-400 text-white px-4 py-2 rounded hover:bg-indigo-400"
          >
            Send Message
          </button>

          {submitted && (
            <p className="text-green-600 font-medium mt-2">
              ✅ Your message has been sent successfully!
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
