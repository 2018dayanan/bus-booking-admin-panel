const USE_MOCK_API = false;

const API_BASE_URL = 'http://34.229.93.103/api'; 
// const API_BASE_URL = 'http://192.168.195.125:7000/api';


let mockApi;
if (USE_MOCK_API) {
  mockApi = require('./mockApi').default;
}

class AuthService {
  // Login API call
  async login(credentials) {
    try {
      console.log('AuthService: Starting login process...')
      console.log('AuthService: Credentials:', { username: credentials.username, password: '***' })
      
      if (USE_MOCK_API) {
        const data = await mockApi.login(credentials);
        return data;
      }

      console.log('AuthService: Making API call to:', `${API_BASE_URL}/login`)
      
      const requestBody = {
        emailOrPhone: credentials.username, 
        password: credentials.password
      }
      
      console.log('AuthService: Request body:', { emailOrPhone: requestBody.emailOrPhone, password: '***' })

      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('AuthService: Response status:', response.status)
      console.log('AuthService: Response headers:', response.headers)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('AuthService: API error response:', errorData)
        throw new Error(errorData.message || `Login failed with status: ${response.status}`);
      }

      const data = await response.json();
      console.log('AuthService: API success response:', data)
      
      // Check for accessToken (your API format) or token (fallback)
      const token = data.accessToken || data.token;
      
      if (token) {
        console.log('AuthService: Storing accessToken in localStorage')
        localStorage.setItem('authToken', token);
        
        // Store the complete user object from API response
        if (data.user) {
          console.log('AuthService: Storing user data in localStorage')
          localStorage.setItem('user', JSON.stringify(data.user));
        } else {
          console.warn('AuthService: No user data in response')
          localStorage.setItem('user', JSON.stringify({
            username: credentials.username,
            email: credentials.username
          }));
        }
      } else {
        console.warn('AuthService: No accessToken received in response')
      }

      return data;
    } catch (error) {
      console.error('AuthService: Login error:', error);
      throw error;
    }
  }

  // Logout function
  logout() {
    console.log('AuthService: Logging out, clearing localStorage')
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('authToken');
    const isAuth = !!token;
    console.log('AuthService: Checking authentication:', isAuth)
    return isAuth;
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

      if (USE_MOCK_API) {
        // Use mock API for testing
        const result = await mockApi.verifyToken(token);
        return result.valid;
      }

      // Real API call - you may need to adjust this endpoint
      const response = await fetch(`${API_BASE_URL}/verify-token`, {
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