// API utility functions for MGNREGA dashboard

// Use relative URL in development (Vite proxy) or environment variable in production
const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api' : 'http://localhost:5000/api');

// Generic fetch wrapper with error handling
const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};

// Fetch all districts
export const fetchDistricts = async () => {
  return apiRequest('/api/districts');
};

// Fetch performance data for a specific district
export const fetchDistrictPerformance = async (districtCode) => {
  if (!districtCode) {
    throw new Error('District code is required');
  }
  return apiRequest(`/api/district/${districtCode}`);
};

// Detect district based on coordinates
export const detectDistrictByLocation = async (latitude, longitude) => {
  return apiRequest('/api/district/locate', {
    method: 'POST',
    body: JSON.stringify({ latitude, longitude }),
  });
};

// Health check
export const checkApiHealth = async () => {
  return apiRequest('/api/health');
};