// API service for making authenticated requests to protected endpoints

import authService from 'features/auth/services/authService'

// Use local proxy to avoid CORS issues
const API_BASE_URL = '/api';

class ApiService {
  // Make an authenticated API request
  async authenticatedRequest(endpoint, options = {}) {
    const token = authService.getToken();
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };

    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      if (response.status === 401) {
        // Token expired or invalid
        authService.logout();
        window.location.href = '/login';
        throw new Error('Authentication expired. Please login again.');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API request failed with status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint) {
    return this.authenticatedRequest(endpoint, { method: 'GET' });
  }

  // POST request
  async post(endpoint, data) {
    return this.authenticatedRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data) {
    return this.authenticatedRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.authenticatedRequest(endpoint, { method: 'DELETE' });
  }

  // Example: Get user profile
  async getUserProfile() {
    return this.get('/user/profile');
  }

  // Example: Update user profile
  async updateUserProfile(profileData) {
    return this.put('/user/profile', profileData);
  }

  // Example: Get dashboard data
  async getDashboardData() {
    return this.get('/dashboard');
  }
}

export default new ApiService(); 