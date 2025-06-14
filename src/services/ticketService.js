import apiService from './apiService'

class TicketService {
  // Get all tickets
  async getAllTickets() {
    try {
      const response = await apiService.get('/tickets')
      return response
    } catch (error) {
      console.error('Error fetching tickets:', error)
      throw error
    }
  }

  // Get ticket by ID
  async getTicketById(ticketId) {
    try {
      const response = await apiService.get(`/tickets/${ticketId}`)
      return response
    } catch (error) {
      console.error('Error fetching ticket:', error)
      throw error
    }
  }

  // Create new ticket
  async createTicket(ticketData) {
    try {
      const response = await apiService.post('/tickets', ticketData)
      return response
    } catch (error) {
      console.error('Error creating ticket:', error)
      throw error
    }
  }

  // Update ticket
  async updateTicket(ticketId, ticketData) {
    try {
      const response = await apiService.put(`/tickets/${ticketId}`, ticketData)
      return response
    } catch (error) {
      console.error('Error updating ticket:', error)
      throw error
    }
  }

  // Delete ticket
  async deleteTicket(ticketId) {
    try {
      const response = await apiService.delete(`/tickets/${ticketId}`)
      return response
    } catch (error) {
      console.error('Error deleting ticket:', error)
      throw error
    }
  }

  // Get tickets by operator
  async getTicketsByOperator(operatorId) {
    try {
      const response = await apiService.get(`/tickets/operator/${operatorId}`)
      return response
    } catch (error) {
      console.error('Error fetching operator tickets:', error)
      throw error
    }
  }

  // Get tickets by date range
  async getTicketsByDateRange(startDate, endDate) {
    try {
      const response = await apiService.get(`/tickets/date-range?start=${startDate}&end=${endDate}`)
      return response
    } catch (error) {
      console.error('Error fetching tickets by date range:', error)
      throw error
    }
  }

  // Get tickets by route
  async getTicketsByRoute(from, to) {
    try {
      const response = await apiService.get(`/tickets/route?from=${from}&to=${to}`)
      return response
    } catch (error) {
      console.error('Error fetching tickets by route:', error)
      throw error
    }
  }
}

export default new TicketService() 