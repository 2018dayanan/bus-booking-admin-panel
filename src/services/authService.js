// Authentication service for handling login API calls and token management

const API_BASE_URL = 'https://api.example.com'; // Replace with your actual API base URL

class AuthService {
  // Login API call
  async login(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      
      // Store token in localStorage
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Logout function
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('authToken');
    return !!token;
  }

  // Get stored token
  getToken() {
    return localStorage.getItem('authToken');
  }

  // Get stored user data
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Verify token with backend (optional)
  async verifyToken() {
    try {
      const token = this.getToken();
      if (!token) {
        return false;
      }

      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Token verification error:', error);
      return false;
    }
  }
}

export default new AuthService(); 