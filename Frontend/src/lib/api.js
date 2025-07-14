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

// Upload PPTX file to backend (Cloudinary)
export async function uploadPPTFile(file) {
  const url = buildApiUrl("/uploads/ppt");
  const formData = new FormData();
  formData.append("ppt", file);
  const token = localStorage.getItem('token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await fetch(url, {
    method: "POST",
    body: formData,
    headers,
  });
  if (!response.ok) {
    throw new Error("Failed to upload PPT file");
  }
  return response.json();
} 