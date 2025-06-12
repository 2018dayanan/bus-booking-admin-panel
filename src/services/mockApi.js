// Mock API service for testing login functionality
// Replace this with your actual API calls when ready

class MockApiService {
  // Simulate API delay
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Mock login API
  async login(credentials) {
    // Simulate network delay
    await this.delay(1000);

    // Mock validation
    if (credentials.username === 'admin' && credentials.password === 'admin') {
      return {
        success: true,
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: 1,
          username: 'admin',
          name: 'Administrator',
          email: 'admin@example.com',
          role: 'admin'
        }
      };
    } else if (credentials.username === 'user' && credentials.password === 'user') {
      return {
        success: true,
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: 2,
          username: 'user',
          name: 'Regular User',
          email: 'user@example.com',
          role: 'user'
        }
      };
    } else {
      throw new Error('Invalid username or password');
    }
  }

  // Mock token verification
  async verifyToken(token) {
    await this.delay(500);
    
    // Check if token exists and is not expired (mock validation)
    if (token && token.startsWith('mock-jwt-token-')) {
      return { valid: true };
    }
    
    return { valid: false };
  }
}

export default new MockApiService(); 