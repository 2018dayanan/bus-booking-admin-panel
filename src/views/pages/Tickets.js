import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CAvatar,
  CButton,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CBadge,
  CSpinner,
  CAlert,
  CFormInput,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react';
import { cilOptions, cilBusAlt, cilUser, cilCalendar, cilLocationPin, cilSearch } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import ticketService from '../../services/ticketService';

// Mock data for fallback
const mockTickets = [
  {
    _id: '1',
    bussName: 'Express Bus',
    thumbnail: 'https://via.placeholder.com/40',
    departureTime: '10:00 AM',
    arrivalTime: '2:00 PM',
    operatorName: 'John Doe',
    operatorRole: 'Driver',
    vehicleType: 'Deluxe',
    bussNo: 'ABC-123',
    date: '2025-06-15',
    totalTimeTaken: '4h',
    route: { from: 'New York', to: 'Boston' },
    shift: 'Day',
  },
  {
    _id: '2',
    bussName: 'City Liner',
    thumbnail: 'https://via.placeholder.com/40',
    departureTime: '8:00 PM',
    arrivalTime: '11:00 PM',
    operatorName: 'Jane Smith',
    operatorRole: 'Driver',
    vehicleType: 'Standard',
    bussNo: 'XYZ-789',
    date: '2025-06-16',
    totalTimeTaken: '3h',
    route: { from: 'Boston', to: 'New York' },
    shift: 'Night',
  },
];

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showDropdown, setShowDropdown] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchTickets = async () => {
      try {
        setLoading(true);
        setError(null);

        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Request timed out')), 10000);
        });

        const response = await Promise.race([ticketService.getAllTickets(), timeoutPromise]);

        if (isMounted) {
          const ticketData = Array.isArray(response.data) ? response.data : response;
          setTickets(ticketData.length ? ticketData : mockTickets);
          setFilteredTickets(ticketData.length ? ticketData : mockTickets);
          setLoading(false);
        }
      } catch (apiError) {
        console.warn('API call failed, using mock data:', apiError.message);
        if (isMounted) {
          setTickets(mockTickets);
          setFilteredTickets(mockTickets);
          setLoading(false);
        }
      }
    };

    fetchTickets();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter tickets based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredTickets(tickets);
      return;
    }

    const lowerSearch = searchTerm.toLowerCase();
    const filtered = tickets.filter((ticket) => {
      const formattedDate = new Date(ticket.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).toLowerCase();

      return (
        ticket.bussName?.toLowerCase().includes(lowerSearch) ||
        ticket.operatorName?.toLowerCase().includes(lowerSearch) ||
        ticket.vehicleType?.toLowerCase().includes(lowerSearch) ||
        ticket.bussNo?.toLowerCase().includes(lowerSearch) ||
        formattedDate.includes(lowerSearch) ||
        ticket.route?.from?.toLowerCase().includes(lowerSearch) ||
        ticket.route?.to?.toLowerCase().includes(lowerSearch) ||
        ticket.shift?.toLowerCase().includes(lowerSearch)
      );
    });

    setFilteredTickets(filtered);
  }, [searchTerm, tickets]);

  const handleDropdown = (visible, ticketId) => {
    setShowDropdown(visible ? ticketId : null);
  };

  const handleAction = async (action, ticket) => {
    setSelectedTicket(ticket);
    setShowDropdown(null);

    try {
      switch (action) {
        case 'view':
          navigate(`/admin/tickets/${ticket._id}`);
          break;
        case 'edit':
          alert(`Edit ticket ${ticket.bussName}`);
          break;
        case 'delete':
          if (window.confirm(`Are you sure you want to delete ${ticket.bussName}?`)) {
            await ticketService.deleteTicket(ticket._id);
            alert(`Successfully deleted ticket ${ticket.bussName}`);
            const updatedTickets = tickets.filter((t) => t._id !== ticket._id);
            setTickets(updatedTickets);
            setFilteredTickets(updatedTickets);
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error handling action:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getShiftBadgeColor = (shift) => {
    switch (shift?.toLowerCase()) {
      case 'day':
        return 'success';
      case 'night':
        return 'info';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <CSpinner color="primary" variant="grow" />
        <span className="ms-3">Loading tickets...</span>
      </div>
    );
  }

  if (error) {
    return (
      <CAlert color="danger" className="d-flex align-items-center">
        <CIcon icon={cilBusAlt} className="me-2" />
        <div>
          <strong>Error:</strong> {error}
          <CButton
            color="link"
            className="p-0 ms-2"
            onClick={async () => {
              setLoading(true);
              try {
                const response = await ticketService.getAllTickets();
                const ticketData = Array.isArray(response.data) ? response.data : response;
                setTickets(ticketData.length ? ticketData : mockTickets);
                setFilteredTickets(ticketData.length ? ticketData : mockTickets);
                setError(null);
              } catch (apiError) {
                setTickets(mockTickets);
                setFilteredTickets(mockTickets);
                setError('Failed to fetch tickets.');
              } finally {
                setLoading(false);
              }
            }}
          >
            Try again
          </CButton>
        </div>
      </CAlert>
    );
  }

  return (
    <CCard>
      <CCardHeader>
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Ticket Management</h4>
          <CButton color="primary" onClick={() => navigate('/admin/tickets/add')}>
            <CIcon icon={cilBusAlt} className="me-2" />
            Add New Ticket
          </CButton>
        </div>
      </CCardHeader>
      <CCardBody>
        <CInputGroup className="mb-3">
          <CInputGroupText>
            <CIcon icon={cilSearch} />
          </CInputGroupText>
          <CFormInput
            placeholder="Search by bus name, operator, vehicle type, bus number, date, route, or shift..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CInputGroup>
        <CTable align="middle" className="mb-0 border" hover responsive>
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell>Bus Info</CTableHeaderCell>
              <CTableHeaderCell>Operator</CTableHeaderCell>
              <CTableHeaderCell>Vehicle Type</CTableHeaderCell>
              <CTableHeaderCell>Bus No</CTableHeaderCell>
              <CTableHeaderCell>Date</CTableHeaderCell>
              <CTableHeaderCell>Route</CTableHeaderCell>
              <CTableHeaderCell>Shift</CTableHeaderCell>
              <CTableHeaderCell className="text-end">Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredTickets.map((ticket) => (
              <CTableRow key={ticket._id}>
                <CTableDataCell>
                  <div className="d-flex align-items-center">
                    <CAvatar src={ticket.thumbnail} size="md" className="me-3" />
                    <div>
                      <div className="fw-semibold">{ticket.bussName}</div>
                      <div className="small text-muted">
                        {ticket.departureTime} - {ticket.arrivalTime}
                      </div>
                    </div>
                  </div>
                </CTableDataCell>
                <CTableDataCell>
                  <div className="d-flex align-items-center">
                    <CIcon icon={cilUser} className="me-2" />
                    <div>
                      <div className="fw-semibold">{ticket.operatorName}</div>
                      <div className="small text-muted">{ticket.operatorRole}</div>
                    </div>
                  </div>
                </CTableDataCell>
                <CTableDataCell>
                  <CBadge color="primary" className="text-capitalize">
                    {ticket.vehicleType}
                  </CBadge>
                </CTableDataCell>
                <CTableDataCell>
                  <div className="fw-semibold">{ticket.bussNo}</div>
                </CTableDataCell>
                <CTableDataCell>
                  <div className="d-flex align-items-center">
                    <CIcon icon={cilCalendar} className="me-2" />
                    <div>
                      <div className="fw-semibold">{formatDate(ticket.date)}</div>
                      <div className="small text-muted">{ticket.totalTimeTaken}</div>
                    </div>
                  </div>
                </CTableDataCell>
                <CTableDataCell>
                  <div className="d-flex align-items-center">
                    <CIcon icon={cilLocationPin} className="me-2" />
                    <div>
                      <div className="small">{ticket?.route?.from ?? 'N/A'}</div>
                      <div className="small text-muted">→ {ticket?.route?.to ?? 'N/A'}</div>
                    </div>
                  </div>
                </CTableDataCell>
                <CTableDataCell>
                  <CBadge color={getShiftBadgeColor(ticket.shift)} className="text-capitalize">
                    {ticket.shift}
                  </CBadge>
                </CTableDataCell>
                <CTableDataCell className="text-end">
                  <CDropdown
                    visible={showDropdown === ticket._id}
                    onVisibleChange={(visible) => handleDropdown(visible, ticket._id)}
                  >
                    <CDropdownToggle color="light" caret={false}>
                      <CIcon icon={cilOptions} size="lg" />
                    </CDropdownToggle>
                    <CDropdownMenu>
                      <CDropdownItem onClick={() => handleAction('view', ticket)}>View Details</CDropdownItem>
                      <CDropdownItem onClick={() => handleAction('edit', ticket)}>Edit Ticket</CDropdownItem>
                      <CDropdownItem onClick={() => handleAction('delete', ticket)}>Delete Ticket</CDropdownItem>
                    </CDropdownMenu>
                  </CDropdown>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>

        {filteredTickets.length === 0 && !loading && (
          <div className="text-center py-5">
            <CIcon icon={cilBusAlt} size="3xl" className="text-muted mb-3" />
            <h5 className="text-muted">{searchTerm ? 'No tickets match your search' : 'No tickets found'}</h5>
            <p className="text-muted">
              {searchTerm ? 'Try a different search term.' : 'Start by adding your first ticket.'}
            </p>
          </div>
        )}
      </CCardBody>
    </CCard>
  );
};

export default Tickets;