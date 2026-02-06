import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000'
});

// Add request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API calls
export const signup = async (userData) => {
  const response = await api.post('/api/auth/signup', userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await api.post('/api/auth/login', credentials);
  return response.data;
};

// Ticket API calls
export const getTickets = async () => {
  const response = await api.get('/api/tickets');
  return response.data;
};

export default api;
