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

// Dummy booking data for development/testing
const dummyBookings = [
  {
    "_id": "683b6233c8419b240da3dfe9",
    "userId": "681b5adb21f2f045369d8e49",
    "scheduleId": "683b5521c8419b240da3df1b",
    "seats": ["a9"],
    "totalAmount": 1800,
    "status": "booked",
    "refundStatus": "none",
    "refundAmount": 0,
    "gateway": "esewa",
    "transactionId": "000ATBF",
    "ticketId": "TKT-20250531-44102",
    "bookedAt": "2025-05-31T20:10:27.459Z",
    "createdAt": "2025-05-31T20:10:27.460Z",
    "updatedAt": "2025-05-31T20:10:27.460Z",
    "__v": 0,
    // Additional fields for display
    "userName": "John Doe",
    "userEmail": "john.doe@example.com",
    "userPhone": "+977-9841234567",
    "busName": "Express Bus",
    "busNo": "BUS001",
    "from": "Kathmandu",
    "to": "Pokhara",
    "departureTime": "08:00",
    "arrivalTime": "16:00",
    "date": "2025-06-01"
  },
  {
    "_id": "683b6234c8419b240da3dfea",
    "userId": "681b5adb21f2f045369d8e50",
    "scheduleId": "683b5521c8419b240da3df1c",
    "seats": ["b5", "b6"],
    "totalAmount": 2400,
    "status": "confirmed",
    "refundStatus": "none",
    "refundAmount": 0,
    "gateway": "khalti",
    "transactionId": "KHLT001",
    "ticketId": "TKT-20250531-44103",
    "bookedAt": "2025-05-31T18:30:15.123Z",
    "createdAt": "2025-05-31T18:30:15.124Z",
    "updatedAt": "2025-05-31T18:30:15.124Z",
    "__v": 0,
    "userName": "Jane Smith",
    "userEmail": "jane.smith@example.com",
    "userPhone": "+977-9851234567",
    "busName": "Luxury Coach",
    "busNo": "BUS002",
    "from": "Pokhara",
    "to": "Kathmandu",
    "departureTime": "14:00",
    "arrivalTime": "22:00",
    "date": "2025-06-02"
  },
  {
    "_id": "683b6235c8419b240da3dfeb",
    "userId": "681b5adb21f2f045369d8e51",
    "scheduleId": "683b5521c8419b240da3df1d",
    "seats": ["c12"],
    "totalAmount": 1200,
    "status": "cancelled",
    "refundStatus": "processed",
    "refundAmount": 1200,
    "gateway": "esewa",
    "transactionId": "000ATBG",
    "ticketId": "TKT-20250531-44104",
    "bookedAt": "2025-05-31T16:45:30.789Z",
    "createdAt": "2025-05-31T16:45:30.790Z",
    "updatedAt": "2025-05-31T17:30:00.000Z",
    "__v": 0,
    "userName": "Mike Johnson",
    "userEmail": "mike.johnson@example.com",
    "userPhone": "+977-9861234567",
    "busName": "City Bus",
    "busNo": "BUS003",
    "from": "Birgunj",
    "to": "Kathmandu",
    "departureTime": "06:00",
    "arrivalTime": "12:00",
    "date": "2025-06-01"
  },
  {
    "_id": "683b6236c8419b240da3dfec",
    "userId": "681b5adb21f2f045369d8e52",
    "scheduleId": "683b5521c8419b240da3df1e",
    "seats": ["d3", "d4", "d5"],
    "totalAmount": 3600,
    "status": "pending",
    "refundStatus": "none",
    "refundAmount": 0,
    "gateway": "khalti",
    "transactionId": "KHLT002",
    "ticketId": "TKT-20250531-44105",
    "bookedAt": "2025-05-31T19:20:45.456Z",
    "createdAt": "2025-05-31T19:20:45.457Z",
    "updatedAt": "2025-05-31T19:20:45.457Z",
    "__v": 0,
    "userName": "Sarah Wilson",
    "userEmail": "sarah.wilson@example.com",
    "userPhone": "+977-9871234567",
    "busName": "Premium Bus",
    "busNo": "BUS004",
    "from": "Kathmandu",
    "to": "Chitwan",
    "departureTime": "10:00",
    "arrivalTime": "14:00",
    "date": "2025-06-03"
  },
  {
    "_id": "683b6237c8419b240da3dfed",
    "userId": "681b5adb21f2f045369d8e53",
    "scheduleId": "683b5521c8419b240da3df1f",
    "seats": ["e8"],
    "totalAmount": 1500,
    "status": "completed",
    "refundStatus": "none",
    "refundAmount": 0,
    "gateway": "esewa",
    "transactionId": "000ATBH",
    "ticketId": "TKT-20250531-44106",
    "bookedAt": "2025-05-30T15:10:20.123Z",
    "createdAt": "2025-05-30T15:10:20.124Z",
    "updatedAt": "2025-05-31T08:00:00.000Z",
    "__v": 0,
    "userName": "David Brown",
    "userEmail": "david.brown@example.com",
    "userPhone": "+977-9881234567",
    "busName": "Express Bus",
    "busNo": "BUS001",
    "from": "Pokhara",
    "to": "Kathmandu",
    "departureTime": "16:00",
    "arrivalTime": "00:00",
    "date": "2025-05-31"
  }
];

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
      
      // Return dummy data if API fails
      console.log('Using dummy booking data due to API error')
      return {
        data: dummyBookings,
        status: 200,
        statusText: 'OK'
      }
    }
  }

  // Get booking by ID
  async getBookingById(bookingId) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.GET_BOOKING_BY_ID}/${bookingId}`)
      return response
    } catch (error) {
      console.error('Error fetching booking:', error)
      
      // Return dummy data if API fails
      const dummyBooking = dummyBookings.find(booking => booking._id === bookingId)
      if (dummyBooking) {
        return {
          data: dummyBooking,
          status: 200,
          statusText: 'OK'
        }
      }
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