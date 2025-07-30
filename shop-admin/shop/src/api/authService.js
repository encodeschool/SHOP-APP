import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth'; // Adjust if needed

export const login = (credentials) => axios.post(`${API_URL}/login`, credentials);

export const register = (userData) => axios.post(`${API_URL}/register`, userData);

export const getUserById = (id) => {
    const token = localStorage.getItem('token');
    return axios.get(`http://localhost:8080/api/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
