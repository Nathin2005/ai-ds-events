import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
  withCredentials: false, // Temporarily disable credentials
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle token expiration
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      // Only redirect if not already on login page
      if (window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  verifyToken: () => api.get('/auth/verify'),
  logout: () => api.post('/auth/logout'),
};

// Events API endpoints
export const eventsAPI = {
  // Public endpoints
  getAll: (params = {}) => api.get('/events', { params }),
  getUpcoming: () => api.get('/events/upcoming'),
  getPast: () => api.get('/events/past'),
  getById: (id) => api.get(`/events/${id}`),
  
  // Admin endpoints
  create: (eventData) => api.post('/events', eventData),
  update: (id, eventData) => api.put(`/events/${id}`, eventData),
  delete: (id) => api.delete(`/events/${id}`),
};

// Upload API endpoints
export const uploadAPI = {
  single: (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('image', file);
    
    return api.post('/upload/single', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
  },
  
  multiple: (files, onUploadProgress) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });
    
    return api.post('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
  },
  
  delete: (publicId) => {
    // Encode the publicId to handle special characters
    const encodedPublicId = encodeURIComponent(publicId);
    return api.delete(`/upload/${encodedPublicId}`);
  },
  
  getStats: () => api.get('/upload/stats'),
};

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
};

export default api;