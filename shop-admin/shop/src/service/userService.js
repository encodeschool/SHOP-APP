import axios from 'axios';

export const getUserById = (id) => {
  const token = localStorage.getItem('token');
  return axios.get(`/api/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
