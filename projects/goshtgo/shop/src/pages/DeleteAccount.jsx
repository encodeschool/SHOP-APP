import React, { useState } from "react";
import "../static/css/DeleteAccount.css";

const DeleteAccount = () => {
  const [form, setForm] = useState({
    name: "",
    emailOrPhone: "",
    reason: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // TEMPORARY: replace with API call later
    alert(
      "Your request has been submitted. We will process your account deletion within 7 business days."
    );

    setForm({ name: "", emailOrPhone: "", reason: "" });
  };

  return (
    <div className="delete-page">
      <div className="delete-card">
        <h1>Delete Account</h1>
        <p className="subtitle">
          Request deletion of your <strong>Gosht Go</strong> account and
          associated data.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email or Phone Number</label>
            <input
              type="text"
              name="emailOrPhone"
              placeholder="example@email.com or +998901234567"
              value={form.emailOrPhone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Reason for deletion (optional)</label>
            <textarea
              name="reason"
              placeholder="Tell us why you want to delete your account"
              value={form.reason}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <button type="submit" className="submit-btn">
            Submit Request
          </button>
        </form>

        <div className="info">
          <h3>What happens next?</h3>
          <ul>
            <li>Your account and personal data will be deleted</li>
            <li>Order history and saved addresses will be removed</li>
            <li>
              Some data may be retained for legal purposes for up to 90 days
            </li>
          </ul>

          <p className="processing-time">
            ⏱ Processing time: <strong>up to 7 business days</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccount;
