import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CAvatar,
  CBadge,
  CButton,
  CSpinner,
  CAlert,
  CListGroup,
  CListGroupItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilArrowLeft,
  cilBusAlt,
  cilUser,
  cilCalendar,
  cilLocationPin,
  cilClock,
  cilMoney,
  cilStar,
  cilPeople,
  cilPencil,
  cilTrash,
} from '@coreui/icons'
import ticketService from '../../services/ticketService'

const TicketDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchTicketDetail()
  }, [id])

  const fetchTicketDetail = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await ticketService.getTicketById(id)
      setTicket(response.data || response)
      setLoading(false)
    } catch (err) {
      console.error('Error fetching ticket details:', err)
      setError('Failed to fetch ticket details')
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${ticket?.bussName}?`)) {
      try {
        await ticketService.deleteTicket(id)
        alert('Ticket deleted successfully')
        navigate('/admin/tickets')
      } catch (error) {
        console.error('Error deleting ticket:', error)
        alert(`Failed to delete ticket: ${error.message}`)
      }
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatTime = (timeString) => {
    return timeString
  }

  const getShiftBadgeColor = (shift) => {
    switch (shift?.toLowerCase()) {
      case 'day':
        return 'success'
      case 'night':
        return 'info'
      default:
        return 'secondary'
    }
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <CSpinner color="primary" variant="grow" />
        <span className="ms-3">Loading ticket details...</span>
      </div>
    )
  }

  if (error) {
    return (
      <CAlert color="danger">
        {error}
        <CButton 
          color="link" 
          className="p-0 ms-2" 
          onClick={fetchTicketDetail}
        >
          Try again
        </CButton>
      </CAlert>
    )
  }

  if (!ticket) {
    return (
      <CAlert color="warning">
        Ticket not found
      </CAlert>
    )
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <CButton 
          color="light" 
          variant="outline"
          onClick={() => navigate('/admin/tickets')}
        >
          <CIcon icon={cilArrowLeft} className="me-2" />
          Back to Tickets
        </CButton>
        <div>
          <CButton 
            color="primary" 
            className="me-2"
            onClick={() => alert('Edit functionality coming soon')}
          >
            <CIcon icon={cilPencil} className="me-2" />
            Edit
          </CButton>
          <CButton 
            color="danger" 
            variant="outline"
            onClick={handleDelete}
          >
            <CIcon icon={cilTrash} className="me-2" />
            Delete
          </CButton>
        </div>
      </div>

      <CRow>
        <CCol xs={12} md={4}>
          <CCard className="mb-4">
            <CCardHeader>
              <h5>Bus Information</h5>
            </CCardHeader>
            <CCardBody className="text-center">
              <CAvatar 
                src={ticket.thumbnail} 
                size="xl" 
                className="mb-3"
                style={{ width: '200px', height: '150px' }}
              />
              <h4>{ticket.bussName}</h4>
              <p className="text-muted">Bus No: {ticket.bussNo}</p>
              <CBadge color="primary" className="text-capitalize mb-2">
                {ticket.vehicleType}
              </CBadge>
              <div className="mt-3">
                <CBadge color={getShiftBadgeColor(ticket.shift)} className="text-capitalize">
                  {ticket.shift} Shift
                </CBadge>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol xs={12} md={8}>
          <CCard className="mb-4">
            <CCardHeader>
              <h5>Ticket Details</h5>
            </CCardHeader>
            <CCardBody>
              <CListGroup flush>
                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <CIcon icon={cilUser} className="me-3" />
                    <div>
                      <strong>Operator</strong>
                      <div className="text-muted">{ticket.operatorName} ({ticket.operatorRole})</div>
                    </div>
                  </div>
                </CListGroupItem>

                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <CIcon icon={cilLocationPin} className="me-3" />
                    <div>
                      <strong>Route</strong>
                      <div className="text-muted">{ticket.route.from} → {ticket.route.to}</div>
                    </div>
                  </div>
                </CListGroupItem>

                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <CIcon icon={cilCalendar} className="me-3" />
                    <div>
                      <strong>Date</strong>
                      <div className="text-muted">{formatDate(ticket.date)}</div>
                    </div>
                  </div>
                </CListGroupItem>

                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <CIcon icon={cilClock} className="me-3" />
                    <div>
                      <strong>Schedule</strong>
                      <div className="text-muted">
                        {formatTime(ticket.departureTime)} - {formatTime(ticket.arrivalTime)} ({ticket.totalTimeTaken})
                      </div>
                    </div>
                  </div>
                </CListGroupItem>

                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <CIcon icon={cilMoney} className="me-3" />
                    <div>
                      <strong>Price</strong>
                      <div className="text-muted">₹{ticket.price}</div>
                    </div>
                  </div>
                </CListGroupItem>

                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <CIcon icon={cilStar} className="me-3" />
                    <div>
                      <strong>Reward Points</strong>
                      <div className="text-muted">{ticket.rewardPoints} points</div>
                    </div>
                  </div>
                </CListGroupItem>

                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <CIcon icon={cilPeople} className="me-3" />
                    <div>
                      <strong>Total Seats</strong>
                      <div className="text-muted">{ticket.totalSeats} seats</div>
                    </div>
                  </div>
                </CListGroupItem>
              </CListGroup>
            </CCardBody>
          </CCard>

          <CCard>
            <CCardHeader>
              <h5>Additional Information</h5>
            </CCardHeader>
            <CCardBody>
              <div className="row">
                <div className="col-md-6">
                  <strong>Created:</strong> {formatDate(ticket.createdAt)}
                </div>
                <div className="col-md-6">
                  <strong>Last Updated:</strong> {formatDate(ticket.updatedAt)}
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}

export default TicketDetail 