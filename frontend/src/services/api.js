import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests if present in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('polyscan_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth Service
export const authService = {
  register: async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    if (res.data.token) {
      localStorage.setItem('polyscan_token', res.data.token);
    }
    return res.data;
  },

  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.token) {
      localStorage.setItem('polyscan_token', res.data.token);
    }
    return res.data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      // Ignore logout errors
    } finally {
      localStorage.removeItem('polyscan_token');
    }
  },

  getCurrentUser: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
};

// Scan Service
export const scanService = {
  analyzeScan: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await api.post('/scans/analyze', formData, {
      headers: {
        'Content-Type': undefined,
      },
    });
    return res.data;
  },

  getScans: async (params = {}) => {
    const res = await api.get('/scans', { params });
    return res.data;
  },

  getScanById: async (id) => {
    const res = await api.get(`/scans/${id}`);
    return res.data;
  },

  deleteScan: async (id) => {
    const res = await api.delete(`/scans/${id}`);
    return res.data;
  },
};

// Dashboard Service
export const dashboardService = {
  getStats: async () => {
    const res = await api.get('/dashboard/stats');
    return res.data;
  },
};

// Polymer Service
export const polymerService = {
  getPolymers: async () => {
    const res = await api.get('/polymers');
    return res.data;
  },

  getPolymer: async (code) => {
    const res = await api.get(`/polymers/${code}`);
    return res.data;
  },
};

// Profile Service
export const profileService = {
  getProfile: async () => {
    const res = await api.get('/profile');
    return res.data;
  },

  updateProfile: async (data) => {
    const res = await api.put('/profile', data);
    return res.data;
  },
};

export default api;
