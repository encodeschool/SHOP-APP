import React from 'react';
import { useForm } from 'react-hook-form';
import { register as registerUser } from '../../api/authService';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm();

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
      navigate('/login'); // redirect to dashboard
      alert('Registration successful! Please login.');
    } catch (err) {
      alert('Registration failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const password = watch('password');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-md w-full bg-white p-8 rounded shadow"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Register Admin</h2>

        <label className="block mb-2 font-semibold">Email</label>
        <input
          type="email"
          {...register('email', { required: 'Email is required' })}
          className="w-full p-2 mb-4 border rounded"
          placeholder="you@example.com"
        />
        {errors.email && <p className="text-red-500 mb-2">{errors.email.message}</p>}

        <label className="block mb-2 font-semibold">Name</label>
        <input
          type="name"
          {...register('name', { required: 'Full name is required' })}
          className="w-full p-2 mb-4 border rounded"
          placeholder="Will Smith"
        />
        {errors.name && <p className="text-red-500 mb-2">{errors.name.message}</p>}

        <label className="block mb-2 font-semibold">Username</label>
        <input
          type="username"
          {...register('username', { required: 'Username is required' })}
          className="w-full p-2 mb-4 border rounded"
          placeholder="will_smith"
        />
        {errors.username && <p className="text-red-500 mb-2">{errors.username.message}</p>}

        <label className="block mb-2 font-semibold">Password</label>
        <input
          type="password"
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 6, message: 'Minimum length is 6' }
          })}
          className="w-full p-2 mb-4 border rounded"
          placeholder="********"
        />
        {errors.password && <p className="text-red-500 mb-2">{errors.password.message}</p>}

        <label className="block mb-2 font-semibold">Confirm Password</label>
        <input
          type="password"
          {...register('confirmPassword', {
            required: 'Confirm Password is required',
            validate: value => value === password || 'Passwords do not match'
          })}
          className="w-full p-2 mb-4 border rounded"
          placeholder="********"
        />
        {errors.confirmPassword && <p className="text-red-500 mb-2">{errors.confirmPassword.message}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>
        <p className='text-center mt-5'><a className='text-grey-200' href='/login'>Already have an account? Back to Login</a></p>
      </form>
    </div>
  );
}
