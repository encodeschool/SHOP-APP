// src/services/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://shop.encode.uz/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token automatically if available
instance.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default instance;
