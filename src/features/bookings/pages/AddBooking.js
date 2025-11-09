import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CInputGroup,
  CFormInput,
  CSpinner,
  CAlert,
  CBadge,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilSearch,
  cilBusAlt,
  cilCalendar,
  cilUser,
  cilLocationPin,
  cilMoney,
  cilCreditCard,
  cilPlus,
} from '@coreui/icons'
import ticketService from '../../services/ticketService'

const AddBooking = () => {
  const navigate = useNavigate()
  const [tickets, setTickets] = useState([])
  const [filteredTickets, setFilteredTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date()
    const todayString = today.toISOString().split('T')[0]
    console.log('Current date object:', today)
    console.log('Today\'s date string:', todayString)
    return todayString
  }

  // Filter tickets by date (today and future only)
  const filterTicketsByDate = (ticketsList) => {
    const today = getTodayDate()
    console.log('Today\'s date for filtering:', today)
    
    const filteredTickets = ticketsList.filter(ticket => {
      // Use travel date (date field) for filtering instead of createdAt
      const ticketTravelDate = ticket.date || ticket.departureDate || ticket.travelDate
      console.log('Ticket travel date:', ticketTravelDate, 'for ticket:', ticket.bussName)
      
      if (!ticketTravelDate) {
        console.log('No travel date found for ticket:', ticket.bussName)
        return false
      }
      
      const isAvailable = ticketTravelDate >= today
      console.log('Is ticket available:', isAvailable, 'Comparing:', ticketTravelDate, '>=', today)
      
      return isAvailable
    })
    
    console.log('Filtered tickets count:', filteredTickets.length)
    return filteredTickets
  }

  // Search functionality
  const filterTicketsBySearch = (ticketsList, search) => {
    if (!search.trim()) return ticketsList
    
    const searchLower = search.toLowerCase()
    return ticketsList.filter(ticket => {
      return (
        (ticket.operatorName && ticket.operatorName.toLowerCase().includes(searchLower)) ||
        (ticket.bussName && ticket.bussName.toLowerCase().includes(searchLower)) ||
        (ticket.bussNo && ticket.bussNo.toLowerCase().includes(searchLower)) ||
        (ticket.route?.from && ticket.route.from.toLowerCase().includes(searchLower)) ||
        (ticket.route?.to && ticket.route.to.toLowerCase().includes(searchLower)) ||
        (ticket.vehicleType && ticket.vehicleType.toLowerCase().includes(searchLower))
      )
    })
  }

  // Fetch all tickets
  const fetchTickets = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Add timeout for API call
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timed out')), 10000);
      });

      const response = await Promise.race([ticketService.getAllTickets(), timeoutPromise])
      console.log('All tickets response:', response)
      
      // Handle different response structures
      let ticketData = []
      if (response && response.data) {
        if (Array.isArray(response.data)) {
          ticketData = response.data
        } else if (response.data.data && Array.isArray(response.data.data)) {
          ticketData = response.data.data
        } else if (response.data.tickets && Array.isArray(response.data.tickets)) {
          ticketData = response.data.tickets
        } else if (response.data.results && Array.isArray(response.data.results)) {
          ticketData = response.data.results
        } else if (response.data.success && response.data.data && Array.isArray(response.data.data)) {
          ticketData = response.data.data
        }
      }
      
      console.log('Processed ticket data:', ticketData)
      
      if (ticketData.length > 0) {
        // Filter by date first
        const availableTickets = filterTicketsByDate(ticketData)
        console.log('Available tickets (today and future):', availableTickets)
        
        setTickets(availableTickets)
        setFilteredTickets(availableTickets)
      } else {
        setError('No tickets found in the system')
        setTickets([])
        setFilteredTickets([])
      }
    } catch (error) {
      console.error('Error fetching tickets:', error)
      setError(`Failed to fetch tickets: ${error.message}`)
      setTickets([])
      setFilteredTickets([])
    } finally {
      setLoading(false)
    }
  }

  // Handle search
  useEffect(() => {
    const filtered = filterTicketsBySearch(tickets, searchTerm)
    setFilteredTickets(filtered)
  }, [searchTerm, tickets])

  // Fetch tickets on component mount
  useEffect(() => {
    fetchTickets()
  }, [])

  // Handle book ticket
  const handleBookTicket = (ticket) => {
    // Navigate to BookSeats page, passing ticket data
    navigate('/bookings/seats', { state: { ticketData: ticket } })
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      weekday: 'short'
    })
  }

  // Get status badge color
  const getStatusColor = (date) => {
    const today = getTodayDate()
    const ticketDate = date || ''
    
    if (ticketDate === today) {
      return 'warning' // Today
    } else if (ticketDate > today) {
      return 'success' // Future
    } else {
      return 'secondary' // Past
    }
  }

  // Get status text
  const getStatusText = (date) => {
    const today = getTodayDate()
    const ticketDate = date || ''
    
    if (ticketDate === today) {
      return 'Today'
    } else if (ticketDate > today) {
      return 'Available'
    } else {
      return 'Expired'
    }
  }

  return (
    <div>
      <CCard className="mb-4">
        <CCardHeader>
          <CRow className="align-items-center">
            <CCol>
              <h4 className="mb-0">
                <CIcon icon={cilCreditCard} className="me-2" />
                Available Tickets for Booking
              </h4>
              <p className="text-muted mb-0">
                Showing tickets for today and future dates only
              </p>
            </CCol>
            <CCol xs="auto">
              <CButton 
                color="primary" 
                onClick={fetchTickets}
                disabled={loading}
              >
                <CIcon icon={cilSearch} className="me-2" />
                {loading ? <CSpinner size="sm" /> : 'Refresh'}
              </CButton>
            </CCol>
          </CRow>
        </CCardHeader>
        <CCardBody>
          {/* Search Bar */}
          <CRow className="mb-4">
            <CCol md={6}>
              <CInputGroup>
                <CFormInput
                  placeholder="Search tickets by operator, bus, route, or vehicle type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <CButton color="primary" type="button">
                  <CIcon icon={cilSearch} />
                </CButton>
              </CInputGroup>
            </CCol>
            <CCol md={6} className="text-end">
              <CBadge color="info" className="fs-6">
                {filteredTickets.length} tickets available
              </CBadge>
            </CCol>
          </CRow>

          {/* Error Alert */}
          {error && (
            <CAlert color="danger" className="mb-4">
              {error}
            </CAlert>
          )}

          {/* Loading Spinner */}
          {loading && (
            <div className="text-center py-4">
              <CSpinner size="lg" />
              <p className="mt-2">Loading available tickets...</p>
            </div>
          )}

          {/* Tickets Table */}
          {!loading && !error && (
            <>
              {filteredTickets.length === 0 ? (
                <CAlert color="info">
                  <h5>No tickets available</h5>
                  <p>
                    {searchTerm 
                      ? 'No tickets match your search criteria.' 
                      : 'No tickets are available for today or future dates.'
                    }
                  </p>
                </CAlert>
              ) : (
                <CTable hover responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Operator</CTableHeaderCell>
                      <CTableHeaderCell>Bus Details</CTableHeaderCell>
                      <CTableHeaderCell>Route</CTableHeaderCell>
                      <CTableHeaderCell>Date & Time</CTableHeaderCell>
                      <CTableHeaderCell>Price</CTableHeaderCell>
                      <CTableHeaderCell>Status</CTableHeaderCell>
                      <CTableHeaderCell>Action</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {filteredTickets.map((ticket, index) => (
                      <CTableRow key={ticket._id || index}>
                        <CTableDataCell>
                          <div className="d-flex align-items-center">
                            <CIcon icon={cilUser} className="me-2 text-primary" />
                            <div>
                              <strong>{ticket.operatorName || 'N/A'}</strong>
                            </div>
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div>
                            <div className="d-flex align-items-center mb-1">
                              <CIcon icon={cilBusAlt} className="me-2 text-success" />
                              <strong>{ticket.bussName || 'N/A'}</strong>
                            </div>
                            <small className="text-muted">
                              Bus No: {ticket.bussNo || 'N/A'} | 
                              Type: {ticket.vehicleType || 'N/A'}
                            </small>
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div>
                            <div className="d-flex align-items-center mb-1">
                              <CIcon icon={cilLocationPin} className="me-2 text-info" />
                              <strong>
                                {ticket.route?.from || ticket.from || 'N/A'} → {ticket.route?.to || ticket.to || 'N/A'}
                              </strong>
                            </div>
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex align-items-center">
                            <CIcon icon={cilCalendar} className="me-2 text-warning" />
                            <div>
                              <div>{formatDate(ticket.date || ticket.departureDate || ticket.travelDate)}</div>
                              <small className="text-muted">
                                {ticket.departureTime || ticket.time || 'N/A'} - {ticket.arrivalTime || 'N/A'}
                              </small>
                            </div>
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex align-items-center">
                            <CIcon icon={cilMoney} className="me-2 text-success" />
                            <strong>रू {ticket.price || ticket.fare || 'N/A'}</strong>
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={getStatusColor(ticket.date || ticket.departureDate || ticket.travelDate)}>
                            {getStatusText(ticket.date || ticket.departureDate || ticket.travelDate)}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CButton
                            color="primary"
                            size="sm"
                            onClick={() => handleBookTicket(ticket)}
                            className="d-flex align-items-center"
                          >
                            <CIcon icon={cilPlus} className="me-1" />
                            Book Ticket
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              )}
            </>
          )}
        </CCardBody>
      </CCard>
    </div>
  )
}

export default AddBooking 