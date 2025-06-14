import axios from 'axios'

const API_BASE_URL = 'http://192.168.1.78:7000/api' // Use local proxy to avoid CORS

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');


}

// Create axios instance with auth header
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken()
    console.log("my token is ", token)
    
    
    if (token) {
      // Try different auth header formats
      config.headers.Authorization = `Bearer ${token}`
      console.log("my token is ", token)
      // If the above doesn't work, try without Bearer
      // config.headers.Authorization = token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

const userService = {
  // Get all users
  getAllUsers: async () => {
    try {
      const response = await apiClient.get('/admin/getAllUsers')
      console.log('API Response:', response) // Debug log
      return response
    } catch (error) {
      console.error('Error fetching users:', error)
      if (error.response) {
        console.error('Response status:', error.response.status)
        console.error('Response data:', error.response.data)
      }
      throw error
    }
  },

  // Get user by ID
  getUserById: async (userId) => {
    try {
      const response = await apiClient.get(`/admin/users/${userId}`)
      return response
    } catch (error) {
      console.error('Error fetching user:', error)
      throw error
    }
  },

  // Update user
  updateUser: async (userId, userData) => {
    try {
      const response = await apiClient.put(`/admin/users/${userId}`, userData)
      return response
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  },

  // Delete user
  deleteUser: async (userId) => {
    try {
      const response = await apiClient.delete(`/admin/users/${userId}`)
      return response
    } catch (error) {
      console.error('Error deleting user:', error)
      throw error
    }
  },

  // Create new user
  createUser: async (userData) => {
    try {
      const response = await apiClient.post('/admin/users', userData)
      return response
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  },
}

export default userService 