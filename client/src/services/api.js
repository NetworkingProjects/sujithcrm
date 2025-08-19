import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
};

// Leads API
export const leadsAPI = {
  getAll: () => api.get('/leads'),
  getById: (id) => api.get(`/leads/${id}`),
  create: (leadData) => api.post('/leads', leadData),
  update: (id, leadData) => api.put(`/leads/${id}`, leadData),
  delete: (id) => api.delete(`/leads/${id}`),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

export default api;