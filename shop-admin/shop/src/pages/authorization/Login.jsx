import React from 'react';
import { useForm } from 'react-hook-form';
import { login, getUserById } from '../../api/authService';
import { useNavigate } from 'react-router-dom';


export default function Login({ onLoginSuccess }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();

  // inside your onSubmit function after successful login
  const onSubmit = async (data) => {
    try {
      const response = await login(data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.userId); // store userId
      localStorage.setItem("roles", JSON.stringify(response.data.roles));
      navigate("/");
    } catch (err) {
      alert("Login failed: " + (err.response?.data?.message || err.message));
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-md w-full bg-white p-8 rounded shadow"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>

        <label className="block mb-2 font-semibold">Email</label>
        <input
          type="email"
          {...register('email', { required: 'Email is required' })}
          className="w-full p-2 mb-4 border rounded"
          placeholder="you@example.com"
        />
        {errors.email && <p className="text-red-500 mb-2">{errors.email.message}</p>}

        <label className="block mb-2 font-semibold">Password</label>
        <input
          type="password"
          {...register('password', { required: 'Password is required' })}
          className="w-full p-2 mb-4 border rounded"
          placeholder="********"
        />
        {errors.password && <p className="text-red-500 mb-2">{errors.password.message}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
        <p className='text-center mt-5'><a className='text-grey-200' href='/register'>Do not you have an account? Create account.</a></p>
      </form>
    </div>
  );
}
