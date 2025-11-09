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
      const response = await apiClient.get(API_ENDPOINTS.GET_ALL_TICKETS)
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
      const response = await apiClient.get(`${API_ENDPOINTS.GET_TICKET_BY_ID}/${ticketId}`)
      return response
    } catch (error) {
      console.error('Error fetching ticket:', error)
      throw error
    }
  }

  // Create new ticket
  async createTicket(ticketData) {
    try {
      console.log('Creating ticket with data:', ticketData)
      console.log('API URL:', `${API_BASE_URL}${API_ENDPOINTS.CREATE_TICKET}`)
      
      const response = await apiClient.post(API_ENDPOINTS.CREATE_TICKET, ticketData)
      console.log('Ticket created successfully:', response)
      return response
    } catch (error) {
      console.error('Error creating ticket:', error)
      if (error.response) {
        console.error('Response status:', error.response.status)
        console.error('Response data:', error.response.data)
        console.error('Response headers:', error.response.headers)
      }
      throw error
    }
  }

  // Update ticket
  async updateTicket(ticketId, ticketData) {
    try {
      console.log('Updating ticket with ID:', ticketId)
      console.log('Update data:', ticketData)
      console.log('API URL:', `${API_BASE_URL}${API_ENDPOINTS.UPDATE_TICKET}`)
      
      const response = await apiClient.patch(API_ENDPOINTS.UPDATE_TICKET, {
        ticketId: ticketId,
        ...ticketData
      })
      console.log('Ticket updated successfully:', response)
      return response
    } catch (error) {
      console.error('Error updating ticket:', error)
      if (error.response) {
        console.error('Response status:', error.response.status)
        console.error('Response data:', error.response.data)
        console.error('Response headers:', error.response.headers)
      }
      throw error
    }
  }

  // Delete ticket
  async deleteTicket(ticketId) {
    try {
      const response = await apiClient.delete(`${API_ENDPOINTS.DELETE_TICKET}/${ticketId}`)
      return response
    } catch (error) {
      console.error('Error deleting ticket:', error)
      throw error
    }
  }

  // Get tickets by operator
  async getTicketsByOperator(operatorId) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.GET_TICKETS_BY_OPERATOR}/${operatorId}`)
      return response
    } catch (error) {
      console.error('Error fetching operator tickets:', error)
      throw error
    }
  }

  // Get tickets by date range
  async getTicketsByDateRange(startDate, endDate) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.GET_TICKETS_BY_DATE_RANGE}?start=${startDate}&end=${endDate}`)
      return response
    } catch (error) {
      console.error('Error fetching tickets by date range:', error)
      throw error
    }
  }

  // Get tickets by route
  async getTicketsByRoute(from, to) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.GET_TICKETS_BY_ROUTE}?from=${from}&to=${to}`)
      return response
    } catch (error) {
      console.error('Error fetching tickets by route:', error)
      throw error
    }
  }
}

export default new TicketService() 