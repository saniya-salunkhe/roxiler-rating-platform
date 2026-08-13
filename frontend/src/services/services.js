import API from '../services/api';

export const authService = {
  signup: (data) => API.post('/auth/signup', data),
  login: (data) => API.post('/auth/login', data),
  getProfile: () => API.get('/auth/me'),
  changePassword: (data) => API.put('/auth/password', data),
};

export const adminService = {
  getDashboard: () => API.get('/admin/dashboard'),
  listUsers: (params) => API.get('/admin/users', { params }),
  getUserDetail: (id) => API.get(`/admin/users/${id}`),
  createUser: (data) => API.post('/admin/users', data),
  listStores: (params) => API.get('/admin/stores', { params }),
  createStore: (data) => API.post('/admin/stores', data),
};

export const storeService = {
  listStores: (params) => API.get('/stores', { params }),
  getStore: (id) => API.get(`/stores/${id}`),
  submitRating: (storeId, rating) => API.post(`/stores/${storeId}/rate`, { rating }),
};

export const ownerService = {
  getDashboard: () => API.get('/owner/dashboard'),
};
