// API Configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://hackzen.onrender.com' 
  : 'http://localhost:3000';

export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    ...apiConfig.headers,
    Authorization: token ? `Bearer ${token}` : '',
  };
};

// Helper function to build API URLs
export const buildApiUrl = (endpoint) => {
  return `${API_BASE_URL}/api${endpoint}`;
}; 