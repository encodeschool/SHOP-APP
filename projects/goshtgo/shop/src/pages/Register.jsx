import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { useTranslation } from "react-i18next";

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', username: '', phone: '', password: '', confirm: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { login } = useContext(AuthContext);
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const { t } = useTranslation();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      return setError('Passwords do not match');
    }

    try {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          username: form.username,
          phone: form.phone,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      login(data.token, data.userId);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };


  return (
    <div className="max-w-md mx-auto mt-10 text-center my-6">
      <h2 className="text-2xl font-bold mb-4">{t("Register")}</h2>
      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="text"
          placeholder={t("Full Name")}
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="email"
          placeholder={t("Email")}
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="text"
          placeholder={t("Username")}
          required
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="text"
          placeholder={t("Phone")}
          required
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="password"
          placeholder={t("Password")}
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="password"
          placeholder={t("Confirm Password")}
          required
          value={form.confirm}
          onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          className="w-full px-4 py-2 border rounded"
        />
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="w-full bg-black text-white py-2 rounded">{t("Register")}</button>
        <div>
          <Link to='/login' className='text-center'>{t("Already have an account? Sign in")}</Link>
        </div>
      </form>
    </div>
  );
}
