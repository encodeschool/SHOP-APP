import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {AuthContext} from '../contexts/AuthContext';
import Register from './Register';
import { useTranslation } from "react-i18next";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const { t } = useTranslation();


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Login failed');
      }

      const data = await res.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);

      login(data.token, data.userId); // From AuthContext

      navigate(from, { replace: true }); // <-- this makes it work properly
    } catch (err) {
      setError(err.message);
    }
  };


  return (
    <div className="max-w-md mx-auto m-10  text-center">
      <h2 className="text-2xl font-bold mb-4">{t("Login")}</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder={t("Email")}
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="password"
          placeholder={t("Password")}
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded"
        />
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="w-full mb-3 bg-indigo-400 text-white py-2 rounded">{t("Login")}</button>
        <div>
          <Link to='/register' className='text-center'>{t("Don't have an account? Create account")}</Link>
        </div>
      </form>
    </div>
  );
}
