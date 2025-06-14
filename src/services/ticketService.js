import axios from 'axios'

const API_BASE_URL = 'http://192.168.1.78:7000/api'

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
    console.log("Ticket API token:", token)
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

class TicketService {
  // Get all tickets
  async getAllTickets() {
    try {
      const response = await apiClient.get('/admin/getAllTicket')
      console.log('Ticket API Response:', response)
      return response
    } catch (error) {
      console.error('Error fetching tickets:', error)
      if (error.response) {
        console.error('Response status:', error.response.status)
        console.error('Response data:', error.response.data)
      }
      throw error
    }
  }

  // Get ticket by ID
  async getTicketById(ticketId) {
    try {
      const response = await apiClient.get(`/admin/tickets/${ticketId}`)
      return response
    } catch (error) {
      console.error('Error fetching ticket:', error)
      throw error
    }
  }

  // Create new ticket
  async createTicket(ticketData) {
    try {
      const response = await apiClient.post('/admin/tickets', ticketData)
      return response
    } catch (error) {
      console.error('Error creating ticket:', error)
      throw error
    }
  }

  // Update ticket
  async updateTicket(ticketId, ticketData) {
    try {
      const response = await apiClient.put(`/admin/tickets/${ticketId}`, ticketData)
      return response
    } catch (error) {
      console.error('Error updating ticket:', error)
      throw error
    }
  }

  // Delete ticket
  async deleteTicket(ticketId) {
    try {
      const response = await apiClient.delete(`/admin/tickets/${ticketId}`)
      return response
    } catch (error) {
      console.error('Error deleting ticket:', error)
      throw error
    }
  }

  // Get tickets by operator
  async getTicketsByOperator(operatorId) {
    try {
      const response = await apiClient.get(`/admin/tickets/operator/${operatorId}`)
      return response
    } catch (error) {
      console.error('Error fetching operator tickets:', error)
      throw error
    }
  }

  // Get tickets by date range
  async getTicketsByDateRange(startDate, endDate) {
    try {
      const response = await apiClient.get(`/admin/tickets/date-range?start=${startDate}&end=${endDate}`)
      return response
    } catch (error) {
      console.error('Error fetching tickets by date range:', error)
      throw error
    }
  }

  // Get tickets by route
  async getTicketsByRoute(from, to) {
    try {
      const response = await apiClient.get(`/admin/tickets/route?from=${from}&to=${to}`)
      return response
    } catch (error) {
      console.error('Error fetching tickets by route:', error)
      throw error
    }
  }
}

export default new TicketService() 