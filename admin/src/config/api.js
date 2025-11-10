// API Configuration for Admin Panel
// Use environment variable for production, fallback to localhost for development

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// API endpoints
export const API_ENDPOINTS = {
  UPLOAD: `${API_BASE_URL}/upload`,
  ADD_PRODUCT: `${API_BASE_URL}/addproduct`,
  ALL_PRODUCTS: `${API_BASE_URL}/allproducts`,
  REMOVE_PRODUCT: `${API_BASE_URL}/removeproduct`,
  UPDATE_PRODUCT: `${API_BASE_URL}/updateproduct`
};

export default API_BASE_URL;
