import axios from 'axios';

const API_URL = 'https://shop.encode.uz/api/auth'; 

export const login = (credentials) => axios.post(`${API_URL}/login`, credentials);

export const register = (userData) => axios.post(`${API_URL}/register`, userData);

export const getUserById = (id) => {
    const token = localStorage.getItem('token');
    return axios.get(`https://shop.encode.uz/api/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
