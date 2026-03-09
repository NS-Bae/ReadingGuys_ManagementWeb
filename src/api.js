import axios from 'axios';

const api = axios.create({
  baseURL: 'http://15.164.32.162:3000',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,
});

export default api;