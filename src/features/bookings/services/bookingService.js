import axios from 'axios'
import { API_BASE_URL, API_ENDPOINTS } from '../config/apiConfig'

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken')
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
    console.log("Booking API token:", token)
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

class BookingService {
  // Get all bookings
  async getAllBookings() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.GET_ALL_BOOKINGS)
      console.log('Booking API Response:', response)
      return response
    } catch (error) {
      console.error('Error fetching bookings:', error)
      if (error.response) {
        console.error('Response status:', error.response.status)
        console.error('Response data:', error.response.data)
      }
      throw error
    }
  }

  // Get booking by ID
  async getBookingById(bookingId) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.GET_BOOKING_BY_ID}/${bookingId}`)
      return response
    } catch (error) {
      console.error('Error fetching booking:', error)
      throw error
    }
  }

  // Create new booking
  async createBooking(bookingData) {
    try {
      console.log('Creating booking with data:', bookingData)
      console.log('API URL:', `${API_BASE_URL}${API_ENDPOINTS.CREATE_BOOKING}`)
      
      const response = await apiClient.post(API_ENDPOINTS.CREATE_BOOKING, bookingData)
      console.log('Booking created successfully:', response)
      return response
    } catch (error) {
      console.error('Error creating booking:', error)
      if (error.response) {
        console.error('Response status:', error.response.status)
        console.error('Response data:', error.response.data)
        console.error('Response headers:', error.response.headers)
      }
      throw error
    }
  }

  // Update booking
  async updateBooking(bookingId, bookingData) {
    try {
      console.log('Updating booking with ID:', bookingId)
      console.log('Update data:', bookingData)
      console.log('API URL:', `${API_BASE_URL}${API_ENDPOINTS.UPDATE_BOOKING}`)
      
      const response = await apiClient.put(`${API_ENDPOINTS.UPDATE_BOOKING}/${bookingId}`, bookingData)
      console.log('Booking updated successfully:', response)
      return response
    } catch (error) {
      console.error('Error updating booking:', error)
      if (error.response) {
        console.error('Response status:', error.response.status)
        console.error('Response data:', error.response.data)
        console.error('Response headers:', error.response.headers)
      }
      throw error
    }
  }

  // Delete booking
  async deleteBooking(bookingId) {
    try {
      const response = await apiClient.delete(`${API_ENDPOINTS.DELETE_BOOKING}/${bookingId}`)
      return response
    } catch (error) {
      console.error('Error deleting booking:', error)
      throw error
    }
  }

  // Get bookings by user
  async getBookingsByUser(userId) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.GET_BOOKINGS_BY_USER}/${userId}`)
      return response
    } catch (error) {
      console.error('Error fetching user bookings:', error)
      throw error
    }
  }

  // Get bookings by status
  async getBookingsByStatus(status) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.GET_BOOKINGS_BY_STATUS}/${status}`)
      return response
    } catch (error) {
      console.error('Error fetching bookings by status:', error)
      throw error
    }
  }

  // Get bookings by date range
  async getBookingsByDateRange(startDate, endDate) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.GET_BOOKINGS_BY_DATE_RANGE}?start=${startDate}&end=${endDate}`)
      return response
    } catch (error) {
      console.error('Error fetching bookings by date range:', error)
      throw error
    }
  }
}

export default new BookingService() 