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
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CListGroup,
  CListGroupItem,
  CRow,
  CCol,
  CPagination,
  CPaginationItem,
} from '@coreui/react';
import { 
  cilOptions, 
  cilUser, 
  cilCalendar, 
  cilLocationPin, 
  cilSearch,
  cilClock,
  cilMoney,
  cilCreditCard,
  cilBusAlt,
  cilStar,
  cilX,
  cilChevronLeft,
  cilChevronRight,
  cilDescription,
  cilPlus,
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import bookingService from '../../services/bookingService';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDropdown, setShowDropdown] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingsPerPage] = useState(10);
  
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);

        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Request timed out')), 10000);
        });

        const response = await Promise.race([bookingService.getAllBookings(), timeoutPromise]);

        if (isMounted) {
          console.log('Full Booking API Response:', response);
          
          // Handle the new API response structure
          let bookingData = [];
          if (response && response.data) {
            if (response.data.data && Array.isArray(response.data.data)) {
              bookingData = response.data.data;
            } else if (Array.isArray(response.data)) {
              bookingData = response.data;
            } else if (response.data.bookings && Array.isArray(response.data.bookings)) {
              bookingData = response.data.bookings;
            } else if (response.data.results && Array.isArray(response.data.results)) {
              bookingData = response.data.results;
            }
          }
          
          console.log('Processed booking data:', bookingData);
          
          if (bookingData.length > 0) {
            setBookings(bookingData);
            setFilteredBookings(bookingData);
          } else {
            setError('No bookings found in the system');
          }
          setLoading(false);
        }
      } catch (apiError) {
        console.error('API call failed:', apiError.message);
        if (isMounted) {
          setError(`Failed to fetch bookings: ${apiError.message}`);
          setLoading(false);
        }
      }
    };

    fetchBookings();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter bookings based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredBookings(bookings);
      return;
    }

    const lowerSearch = searchTerm.toLowerCase();
    const filtered = bookings.filter((booking) => {
      const formattedDate = new Date(booking.bookedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).toLowerCase();

      return (
        booking.userInfo?.name?.toLowerCase().includes(lowerSearch) ||
        booking.userInfo?.email?.toLowerCase().includes(lowerSearch) ||
        booking.userInfo?.phone?.toLowerCase().includes(lowerSearch) ||
        booking.transactionId?.toLowerCase().includes(lowerSearch) ||
        booking.gateway?.toLowerCase().includes(lowerSearch) ||
        booking.status?.toLowerCase().includes(lowerSearch) ||
        booking.scheduleInfo?.bussName?.toLowerCase().includes(lowerSearch) ||
        booking.scheduleInfo?.route?.from?.toLowerCase().includes(lowerSearch) ||
        booking.scheduleInfo?.route?.to?.toLowerCase().includes(lowerSearch) ||
        formattedDate.includes(lowerSearch)
      );
    });

    setFilteredBookings(filtered);
  }, [searchTerm, bookings]);

  const handleDropdown = (visible, bookingId) => {
    setShowDropdown(visible ? bookingId : null);
  };

  const handleAction = async (action, booking) => {
    setSelectedBooking(booking);
    setShowDropdown(null);

    try {
      switch (action) {
        case 'view':
          setShowModal(true);
          break;
        case 'edit':
          navigate(`/admin/bookings/edit/${booking._id}`, {
            state: { bookingData: booking }
          });
          break;
        case 'delete':
          if (window.confirm(`Are you sure you want to delete booking ${booking.ticketId}?`)) {
            await bookingService.deleteBooking(booking._id);
            alert(`Successfully deleted booking ${booking.ticketId}`);
            const updatedBookings = bookings.filter((b) => b._id !== booking._id);
            setBookings(updatedBookings);
            setFilteredBookings(updatedBookings);
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'booked':
        return 'primary';
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'danger';
      case 'completed':
        return 'info';
      default:
        return 'secondary';
    }
  };

  const getRefundStatusBadgeColor = (refundStatus) => {
    switch (refundStatus?.toLowerCase()) {
      case 'none':
        return 'secondary';
      case 'pending':
        return 'warning';
      case 'processed':
        return 'success';
      case 'failed':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getGatewayBadgeColor = (gateway) => {
    switch (gateway?.toLowerCase()) {
      case 'esewa':
        return 'success';
      case 'khalti':
        return 'primary';
      case 'paypal':
        return 'info';
      default:
        return 'secondary';
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
  };

  // Pagination logic
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);

  // Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <CSpinner color="primary" />
        <span className="ms-3">Loading bookings...</span>
      </div>
    );
  }

  if (error) {
    return (
      <CAlert color="danger" className="d-flex align-items-center">
        <CIcon icon={cilDescription} className="me-2" />
        <div>
          <strong>Error:</strong> {error}
          <CButton
            color="link"
            className="p-0 ms-2"
            onClick={async () => {
              setLoading(true);
              try {
                const response = await bookingService.getAllBookings();
                console.log('Retry Booking API Response:', response);
                
                let bookingData = [];
                if (response && response.data) {
                  if (response.data.data && Array.isArray(response.data.data)) {
                    bookingData = response.data.data;
                  } else if (Array.isArray(response.data)) {
                    bookingData = response.data;
                  } else if (response.data.bookings && Array.isArray(response.data.bookings)) {
                    bookingData = response.data.bookings;
                  } else if (response.data.results && Array.isArray(response.data.results)) {
                    bookingData = response.data.results;
                  }
                }
                
                if (bookingData.length > 0) {
                  setBookings(bookingData);
                  setFilteredBookings(bookingData);
                  setError(null);
                } else {
                  setError('No bookings found in the system');
                }
              } catch (apiError) {
                setError(`Failed to fetch bookings: ${apiError.message}`);
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
    <>
      <CCard className="mb-4">
        <CCardHeader>
          <CRow className="align-items-center">
            <CCol>
              <h4 className="mb-0">
                <CIcon icon={cilCreditCard} className="me-2" />
                All Bookings
              </h4>
              <p className="text-muted mb-0">
                Manage and view all booking records
              </p>
            </CCol>
            <CCol xs="auto">
              <CButton 
                color="primary" 
                onClick={() => navigate('/admin/bookings/add')}
                className="d-flex align-items-center"
              >
                <CIcon icon={cilPlus} className="me-2" />
                Book Ticket
              </CButton>
            </CCol>
          </CRow>
        </CCardHeader>
        <CCardBody>
          <CInputGroup className="mb-3">
            <CInputGroupText>
              <CIcon icon={cilSearch} />
            </CInputGroupText>
            <CFormInput
              placeholder="Search by user name, email, ticket ID, transaction ID, gateway, status, bus name, route, or date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CInputGroup>

          <CTable align="middle" className="mb-0 border" hover responsive>
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell>Booking Info</CTableHeaderCell>
                <CTableHeaderCell>User</CTableHeaderCell>
                <CTableHeaderCell>Route</CTableHeaderCell>
                <CTableHeaderCell>Amount</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Gateway</CTableHeaderCell>
                <CTableHeaderCell>Date</CTableHeaderCell>
                <CTableHeaderCell className="text-end">Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {currentBookings.map((booking) => (
                <CTableRow key={booking._id}>
                  <CTableDataCell>
                    <div className="d-flex align-items-center">
                      <CAvatar src={booking.scheduleInfo?.thumbnail} size="md" className="me-3" />
                      <div>
                        <div className="fw-semibold">Booking #{booking._id.slice(-6)}</div>
                        <div className="small text-muted">
                          {booking.seats?.join(', ')} • {booking.transactionId}
                        </div>
                      </div>
                    </div>
                  </CTableDataCell>
                  <CTableDataCell>
                    <div className="d-flex align-items-center">
                      <CIcon icon={cilUser} className="me-2" />
                      <div>
                        <div className="fw-semibold">{booking.userInfo?.name || 'N/A'}</div>
                        <div className="small text-muted">{booking.userInfo?.email || 'N/A'}</div>
                      </div>
                    </div>
                  </CTableDataCell>
                  <CTableDataCell>
                    <div className="d-flex align-items-center">
                      <CIcon icon={cilLocationPin} className="me-2" />
                      <div>
                        <div className="small">{booking.scheduleInfo?.route?.from || 'N/A'}</div>
                        <div className="small text-muted">→ {booking.scheduleInfo?.route?.to || 'N/A'}</div>
                      </div>
                    </div>
                  </CTableDataCell>
                  <CTableDataCell>
                    <div className="d-flex align-items-center">
                      <CIcon icon={cilMoney} className="me-2" />
                      <div>
                        <div className="fw-semibold">{formatCurrency(booking.totalAmount)}</div>
                        {booking.refundAmount > 0 && (
                          <div className="small text-danger">
                            Refund: {formatCurrency(booking.refundAmount)}
                          </div>
                        )}
                      </div>
                    </div>
                  </CTableDataCell>
                  <CTableDataCell>
                    <div className="d-flex flex-column gap-1">
                      <CBadge color={getStatusBadgeColor(booking.status)}>
                        {booking.status?.toUpperCase() || 'N/A'}
                      </CBadge>
                      <CBadge color={getRefundStatusBadgeColor(booking.refundStatus)}>
                        Refund: {booking.refundStatus?.toUpperCase() || 'N/A'}
                      </CBadge>
                    </div>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={getGatewayBadgeColor(booking.gateway)}>
                      {booking.gateway?.toUpperCase() || 'N/A'}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>
                    <div className="d-flex align-items-center">
                      <CIcon icon={cilCalendar} className="me-2" />
                      <div className="small">{formatDate(booking.bookedAt)}</div>
                    </div>
                  </CTableDataCell>
                  <CTableDataCell className="text-end">
                    <CDropdown
                      visible={showDropdown === booking._id}
                      onVisibleChange={(visible) => handleDropdown(visible, booking._id)}
                    >
                      <CDropdownToggle color="light" caret={false}>
                        <CIcon icon={cilOptions} size="lg" />
                      </CDropdownToggle>
                      <CDropdownMenu>
                        <CDropdownItem onClick={() => handleAction('view', booking)}>View Details</CDropdownItem>
                        <CDropdownItem onClick={() => handleAction('edit', booking)}>Edit Booking</CDropdownItem>
                        <CDropdownItem onClick={() => handleAction('delete', booking)}>Delete Booking</CDropdownItem>
                      </CDropdownMenu>
                    </CDropdown>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <div className="text-muted">
                Showing {indexOfFirstBooking + 1} to {Math.min(indexOfLastBooking, filteredBookings.length)} of {filteredBookings.length} bookings
              </div>
              <CPagination aria-label="Bookings pagination">
                <CPaginationItem 
                  aria-label="Previous" 
                  disabled={currentPage === 1}
                  onClick={() => paginate(currentPage - 1)}
                >
                  <CIcon icon={cilChevronLeft} />
                </CPaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <CPaginationItem
                    key={page}
                    active={page === currentPage}
                    onClick={() => paginate(page)}
                  >
                    {page}
                  </CPaginationItem>
                ))}
                
                <CPaginationItem 
                  aria-label="Next" 
                  disabled={currentPage === totalPages}
                  onClick={() => paginate(currentPage + 1)}
                >
                  <CIcon icon={cilChevronRight} />
                </CPaginationItem>
              </CPagination>
            </div>
          )}
        </CCardBody>
      </CCard>

      {/* Booking Detail Modal */}
      <CModal 
        visible={showModal} 
        onClose={closeModal}
        size="lg"
        scrollable
      >
        <CModalHeader onClose={closeModal}>
          <CModalTitle>
            <CIcon icon={cilDescription} className="me-2" />
            Booking Details
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedBooking && (
            <CListGroup flush>
              <CListGroupItem>
                <CRow>
                  <CCol md={6}>
                    <strong>Booking ID:</strong>
                  </CCol>
                  <CCol md={6}>
                    <CBadge color="primary">{selectedBooking._id}</CBadge>
                  </CCol>
                </CRow>
              </CListGroupItem>
              
              <CListGroupItem>
                <CRow>
                  <CCol md={6}>
                    <strong>Transaction ID:</strong>
                  </CCol>
                  <CCol md={6}>
                    <CBadge color="info">{selectedBooking.transactionId}</CBadge>
                  </CCol>
                </CRow>
              </CListGroupItem>
              
              <CListGroupItem>
                <CRow>
                  <CCol md={6}>
                    <strong>User Information:</strong>
                  </CCol>
                  <CCol md={6}>
                    <div className="d-flex align-items-center mb-2">
                      <CAvatar src={selectedBooking.userInfo?.profilePicture} size="sm" className="me-2" />
                      <div>
                        <div className="fw-bold">{selectedBooking.userInfo?.name || 'N/A'}</div>
                        <div className="text-muted">{selectedBooking.userInfo?.email || 'N/A'}</div>
                        <div className="text-muted">{selectedBooking.userInfo?.phone || 'N/A'}</div>
                        <div className="text-muted">{selectedBooking.userInfo?.address || 'N/A'}</div>
                        <div className="text-muted">Gender: {selectedBooking.userInfo?.gender || 'N/A'}</div>
                        <div className="text-muted">Role: {selectedBooking.userInfo?.role || 'N/A'}</div>
                        <div className="text-muted">Reward Points: {selectedBooking.userInfo?.rewardPoints || 0}</div>
                      </div>
                    </div>
                  </CCol>
                </CRow>
              </CListGroupItem>
              
              <CListGroupItem>
                <CRow>
                  <CCol md={6}>
                    <strong>Bus Information:</strong>
                  </CCol>
                  <CCol md={6}>
                    <div className="d-flex align-items-center mb-2">
                      <CAvatar src={selectedBooking.scheduleInfo?.thumbnail} size="sm" className="me-2" />
                      <div>
                        <div className="fw-bold">{selectedBooking.scheduleInfo?.bussName || 'N/A'}</div>
                        <div className="text-muted">Bus No: {selectedBooking.scheduleInfo?.bussNo || 'N/A'}</div>
                        <div className="text-muted">Vehicle Type: {selectedBooking.scheduleInfo?.vehicleType || 'N/A'}</div>
                        <div className="text-muted">Total Seats: {selectedBooking.scheduleInfo?.totalSeats || 'N/A'}</div>
                        <div className="text-muted">Reward Points: {selectedBooking.scheduleInfo?.rewardPoints || 0}</div>
                      </div>
                    </div>
                  </CCol>
                </CRow>
              </CListGroupItem>
              
              <CListGroupItem>
                <CRow>
                  <CCol md={6}>
                    <strong>Operator Information:</strong>
                  </CCol>
                  <CCol md={6}>
                    <div>
                      <div>Name: {selectedBooking.scheduleInfo?.operatorName || 'N/A'}</div>
                      <div className="text-muted">Role: {selectedBooking.scheduleInfo?.operatorRole || 'N/A'}</div>
                    </div>
                  </CCol>
                </CRow>
              </CListGroupItem>
              
              <CListGroupItem>
                <CRow>
                  <CCol md={6}>
                    <strong>Route Details:</strong>
                  </CCol>
                  <CCol md={6}>
                    <div>
                      <div className="fw-bold">{selectedBooking.scheduleInfo?.route?.from || 'N/A'} → {selectedBooking.scheduleInfo?.route?.to || 'N/A'}</div>
                      <div className="text-muted">
                        Departure: {selectedBooking.scheduleInfo?.departureTime || 'N/A'}
                      </div>
                      <div className="text-muted">
                        Arrival: {selectedBooking.scheduleInfo?.arrivalTime || 'N/A'}
                      </div>
                      <div className="text-muted">Date: {selectedBooking.scheduleInfo?.date || 'N/A'}</div>
                      <div className="text-muted">Duration: {selectedBooking.scheduleInfo?.totalTimeTaken || 'N/A'}</div>
                      <div className="text-muted">Shift: {selectedBooking.scheduleInfo?.shift || 'N/A'}</div>
                    </div>
                  </CCol>
                </CRow>
              </CListGroupItem>
              
              <CListGroupItem>
                <CRow>
                  <CCol md={6}>
                    <strong>Seats:</strong>
                  </CCol>
                  <CCol md={6}>
                    <CBadge color="success">{selectedBooking.seats?.join(', ') || 'N/A'}</CBadge>
                  </CCol>
                </CRow>
              </CListGroupItem>
              
              <CListGroupItem>
                <CRow>
                  <CCol md={6}>
                    <strong>Pricing:</strong>
                  </CCol>
                  <CCol md={6}>
                    <div>
                      <div className="fw-bold">Total Amount: {formatCurrency(selectedBooking.totalAmount)}</div>
                      <div className="text-muted">Schedule Price: {formatCurrency(selectedBooking.scheduleInfo?.price || 0)}</div>
                      {selectedBooking.refundAmount > 0 && (
                        <div className="text-danger">
                          Refund Amount: {formatCurrency(selectedBooking.refundAmount)}
                        </div>
                      )}
                    </div>
                  </CCol>
                </CRow>
              </CListGroupItem>
              
              <CListGroupItem>
                <CRow>
                  <CCol md={6}>
                    <strong>Status:</strong>
                  </CCol>
                  <CCol md={6}>
                    <CBadge color={getStatusBadgeColor(selectedBooking.status)}>
                      {selectedBooking.status?.toUpperCase() || 'N/A'}
                    </CBadge>
                  </CCol>
                </CRow>
              </CListGroupItem>
              
              <CListGroupItem>
                <CRow>
                  <CCol md={6}>
                    <strong>Refund Status:</strong>
                  </CCol>
                  <CCol md={6}>
                    <CBadge color={getRefundStatusBadgeColor(selectedBooking.refundStatus)}>
                      {selectedBooking.refundStatus?.toUpperCase() || 'N/A'}
                    </CBadge>
                  </CCol>
                </CRow>
              </CListGroupItem>
              
              <CListGroupItem>
                <CRow>
                  <CCol md={6}>
                    <strong>Payment Gateway:</strong>
                  </CCol>
                  <CCol md={6}>
                    <CBadge color={getGatewayBadgeColor(selectedBooking.gateway)}>
                      {selectedBooking.gateway?.toUpperCase() || 'N/A'}
                    </CBadge>
                  </CCol>
                </CRow>
              </CListGroupItem>
              
              <CListGroupItem>
                <CRow>
                  <CCol md={6}>
                    <strong>Timestamps:</strong>
                  </CCol>
                  <CCol md={6}>
                    <div>
                      <div className="text-muted">Booked At: {formatDate(selectedBooking.bookedAt)}</div>
                      <div className="text-muted">Created At: {formatDate(selectedBooking.createdAt)}</div>
                      <div className="text-muted">Updated At: {formatDate(selectedBooking.updatedAt)}</div>
                    </div>
                  </CCol>
                </CRow>
              </CListGroupItem>
            </CListGroup>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={closeModal}>
            Close
          </CButton>
          <CButton 
            color="primary" 
            onClick={() => {
              closeModal();
              handleAction('edit', selectedBooking);
            }}
          >
            Edit Booking
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default Bookings; 