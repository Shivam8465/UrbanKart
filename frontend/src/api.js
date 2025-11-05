// API Configuration for UrbanKart Backend

// Base API URL - Change this when deploying to production
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  SIGNUP: `${API_BASE_URL}/auth/signup`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh`,
  GET_USER: `${API_BASE_URL}/auth/me`,
  UPDATE_PROFILE: `${API_BASE_URL}/auth/profile`,
  CHANGE_PASSWORD: `${API_BASE_URL}/auth/change-password`,
  VERIFY_TOKEN: `${API_BASE_URL}/auth/verify`,

  // Products
  GET_PRODUCTS: `${API_BASE_URL}/products`,
  GET_PRODUCT_BY_ID: (id) => `${API_BASE_URL}/products/${id}`,
  
  // Cart (to be implemented)
  GET_CART: `${API_BASE_URL}/cart`,
  ADD_TO_CART: `${API_BASE_URL}/cart/add`,
  UPDATE_CART: `${API_BASE_URL}/cart/update`,
  REMOVE_FROM_CART: `${API_BASE_URL}/cart/remove`,
  CLEAR_CART: `${API_BASE_URL}/cart/clear`,
  
  // Orders (to be implemented)
  CREATE_ORDER: `${API_BASE_URL}/orders`,
  GET_ORDERS: `${API_BASE_URL}/orders`,
  GET_ORDER_BY_ID: (id) => `${API_BASE_URL}/orders/${id}`,
};

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

export default API_ENDPOINTS;
