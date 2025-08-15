import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;
const API_URL = `${BASE_URL}/auth`; 
console.log(process.env.REACT_APP_BASE_URL);

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
