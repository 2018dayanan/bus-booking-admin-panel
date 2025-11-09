import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CButton,
  CCol,
  CRow,
  CAlert,
  CSpinner,
  CInputGroup,
  CInputGroupText,
  CBadge,
} from '@coreui/react';
import {
  cilArrowLeft,
  cilBusAlt,
  cilUser,
  cilCalendar,
  cilLocationPin,
  cilClock,
  cilMoney,
  cilSpeedometer,
  cilSave,
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import ticketService from '../../services/ticketService';

const EditTicket = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation(); // Get location to access passed state
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dataSource, setDataSource] = useState(''); // Track data source
  
  const [formData, setFormData] = useState({
    operatorName: '',
    bussName: '',
    bussNo: '',
    vehicleType: '',
    departureTime: '',
    arrivalTime: '',
    date: '',
    from: '',
    to: '',
    price: '',
    totalSeats: '',
    totalTimeTaken: '',
    shift: '',
    ticketId: '',
  });

  const [errors, setErrors] = useState({});

  // Check different data sources (like Flutter constructor alternatives)
  const passedTicketData = location.state?.ticketData;
  const queryParams = new URLSearchParams(location.search);
  const localStorageData = localStorage.getItem('editTicketData');
  const sessionStorageData = sessionStorage.getItem('contextTicketData');

  // Fetch ticket data on component mount
  useEffect(() => {
    loadTicketData();
  }, [id]);

  const loadTicketData = () => {
    // Priority 1: React Router State (like Flutter constructor)
    if (passedTicketData) {
      console.log('Using React Router State data (Flutter constructor style)');
      populateFormWithData(passedTicketData);
      setDataSource('React Router State');
      setFetchLoading(false);
      return;
    }

    // Priority 2: Query Parameters
    if (queryParams.toString()) {
      console.log('Using Query Parameters data');
      const queryData = {
        _id: id,
        operatorName: queryParams.get('operatorName') || '',
        bussName: queryParams.get('bussName') || '',
        vehicleType: queryParams.get('vehicleType') || '',
        // Add other fields as needed
      };
      populateFormWithData(queryData);
      setDataSource('Query Parameters');
      setFetchLoading(false);
      return;
    }

    // Priority 3: Local Storage
    if (localStorageData) {
      try {
        console.log('Using Local Storage data');
        const parsedData = JSON.parse(localStorageData);
        populateFormWithData(parsedData);
        setDataSource('Local Storage');
        setFetchLoading(false);
        // Clean up localStorage after use
        localStorage.removeItem('editTicketData');
        return;
      } catch (error) {
        console.error('Error parsing localStorage data:', error);
      }
    }

    // Priority 4: Session Storage (Context alternative)
    if (sessionStorageData) {
      try {
        console.log('Using Session Storage data');
        const parsedData = JSON.parse(sessionStorageData);
        populateFormWithData(parsedData);
        setDataSource('Session Storage');
        setFetchLoading(false);
        // Clean up sessionStorage after use
        sessionStorage.removeItem('contextTicketData');
        return;
      } catch (error) {
        console.error('Error parsing sessionStorage data:', error);
      }
    }

    // Priority 5: API Call (fallback)
    console.log('No passed data found, fetching from API');
    fetchTicketData();
  };

  const populateFormWithData = (ticket) => {
    console.log('Populating form with data:', ticket);
    
    // Format date for input field (YYYY-MM-DD)
    const formattedDate = ticket.date ? new Date(ticket.date).toISOString().split('T')[0] : '';
    
    setFormData({
      operatorName: ticket.operatorName || '',
      bussName: ticket.bussName || '',
      bussNo: ticket.bussNo || '',
      vehicleType: ticket.vehicleType || '',
      departureTime: ticket.departureTime || '',
      arrivalTime: ticket.arrivalTime || '',
      date: formattedDate,
      from: ticket.from || ticket.route?.from || '',
      to: ticket.to || ticket.route?.to || '',
      price: ticket.price || '',
      totalSeats: ticket.totalSeats || '',
      totalTimeTaken: ticket.totalTimeTaken || '',
      shift: ticket.shift || '',
      ticketId: ticket._id || ticket.ticketId || '',
    });
  };

  const fetchTicketData = async () => {
    try {
      setFetchLoading(true);
      setError('');
      
      const response = await ticketService.getTicketById(id);
      const ticket = response.data || response;
      
      console.log('Fetched ticket data from API:', ticket);
      
      populateFormWithData(ticket);
      setDataSource('API Call');
      
    } catch (err) {
      console.error('Error fetching ticket:', err);
      setError('Failed to fetch ticket data. Please try again.');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.operatorName.trim()) {
      newErrors.operatorName = 'Operator name is required';
    }

    if (!formData.bussName.trim()) {
      newErrors.bussName = 'Bus name is required';
    }

    if (!formData.bussNo.trim()) {
      newErrors.bussNo = 'Bus number is required';
    }

    if (!formData.vehicleType.trim()) {
      newErrors.vehicleType = 'Vehicle type is required';
    }

    if (!formData.departureTime.trim()) {
      newErrors.departureTime = 'Departure time is required';
    }

    if (!formData.arrivalTime.trim()) {
      newErrors.arrivalTime = 'Arrival time is required';
    }

    if (!formData.date.trim()) {
      newErrors.date = 'Date is required';
    }

    if (!formData.from.trim()) {
      newErrors.from = 'From location is required';
    }

    if (!formData.to.trim()) {
      newErrors.to = 'To location is required';
    }

    // Fix for number fields - check if empty or invalid
    if (!formData.price || formData.price === '') {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a valid positive number';
    }

    if (!formData.totalSeats || formData.totalSeats === '') {
      newErrors.totalSeats = 'Total seats is required';
    } else if (isNaN(formData.totalSeats) || parseInt(formData.totalSeats) <= 0) {
      newErrors.totalSeats = 'Total seats must be a valid positive number';
    }

    if (!formData.totalTimeTaken.trim()) {
      newErrors.totalTimeTaken = 'Total time taken is required';
    }

    if (!formData.shift.trim()) {
      newErrors.shift = 'Shift is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Format the date to YYYY-MM-DD format
      const formattedDate = new Date(formData.date).toISOString().split('T')[0];
      
      const ticketData = {
        operatorName: formData.operatorName,
        bussName: formData.bussName,
        bussNo: formData.bussNo,
        vehicleType: formData.vehicleType,
        departureTime: formData.departureTime,
        arrivalTime: formData.arrivalTime,
        date: formattedDate,
        from: formData.from,
        to: formData.to,
        price: parseFloat(formData.price),
        totalSeats: parseInt(formData.totalSeats),
        totalTimeTaken: formData.totalTimeTaken,
        shift: formData.shift,
      };

      console.log('Submitting ticket update data:', ticketData);
      console.log('Ticket ID:', formData.ticketId);

      const response = await ticketService.updateTicket(formData.ticketId, ticketData);
      
      console.log('Ticket updated successfully:', response);
      
      setSuccess('Ticket updated successfully!');
      
      // Redirect to tickets list after 2 seconds
      setTimeout(() => {
        navigate('/admin/tickets');
      }, 2000);

    } catch (err) {
      console.error('Error updating ticket:', err);
      console.error('Error response:', err.response);
      console.error('Error message:', err.message);
      
      let errorMessage = 'Failed to update ticket';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (fetchLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <CSpinner color="primary" />
        <span className="ms-3">Loading ticket data...</span>
      </div>
    );
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
        <div className="d-flex align-items-center">
          <h4 className="mb-0">
            <CIcon icon={cilBusAlt} className="me-2" />
            Edit Ticket
          </h4>
          {dataSource && (
            <CBadge color="info" className="ms-2">
              Data: {dataSource}
            </CBadge>
          )}
        </div>
      </div>

      {error && (
        <CAlert color="danger" className="mb-4">
          <strong>Error:</strong> {error}
        </CAlert>
      )}

      {success && (
        <CAlert color="success" className="mb-4">
          <strong>Success:</strong> {success}
        </CAlert>
      )}

      <CCard>
        <CCardHeader>
          <h5 className="mb-0">Ticket Information</h5>
        </CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleSubmit}>
            <CRow>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel htmlFor="operatorName">
                    <CIcon icon={cilUser} className="me-2" />
                    Operator Name *
                  </CFormLabel>
                  <CFormInput
                    id="operatorName"
                    name="operatorName"
                    value={formData.operatorName}
                    onChange={handleInputChange}
                    placeholder="Enter operator name"
                    invalid={!!errors.operatorName}
                    feedback={errors.operatorName}
                  />
                </div>
              </CCol>

              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel htmlFor="bussName">
                    <CIcon icon={cilBusAlt} className="me-2" />
                    Bus Name *
                  </CFormLabel>
                  <CFormInput
                    id="bussName"
                    name="bussName"
                    value={formData.bussName}
                    onChange={handleInputChange}
                    placeholder="Enter bus name"
                    invalid={!!errors.bussName}
                    feedback={errors.bussName}
                  />
                </div>
              </CCol>
            </CRow>

            <CRow>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel htmlFor="bussNo">
                    <CIcon icon={cilBusAlt} className="me-2" />
                    Bus No *
                  </CFormLabel>
                  <CFormInput
                    id="bussNo"
                    name="bussNo"
                    value={formData.bussNo}
                    onChange={handleInputChange}
                    placeholder="Enter bus number"
                    invalid={!!errors.bussNo}
                    feedback={errors.bussNo}
                  />
                </div>
              </CCol>

              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel htmlFor="vehicleType">
                    <CIcon icon={cilSpeedometer} className="me-2" />
                    Vehicle Type *
                  </CFormLabel>
                  <CFormSelect
                    id="vehicleType"
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleInputChange}
                    invalid={!!errors.vehicleType}
                    feedback={errors.vehicleType}
                  >
                    <option value="">Select vehicle type</option>
                    <option value="bus">Bus</option>
                    <option value="hiace">Hiace</option>
                  </CFormSelect>
                </div>
              </CCol>
            </CRow>

            <CRow>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel htmlFor="departureTime">
                    <CIcon icon={cilClock} className="me-2" />
                    Departure Time *
                  </CFormLabel>
                  <CFormInput
                    id="departureTime"
                    name="departureTime"
                    type="time"
                    value={formData.departureTime}
                    onChange={handleInputChange}
                    invalid={!!errors.departureTime}
                    feedback={errors.departureTime}
                  />
                </div>
              </CCol>

              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel htmlFor="arrivalTime">
                    <CIcon icon={cilClock} className="me-2" />
                    Arrival Time *
                  </CFormLabel>
                  <CFormInput
                    id="arrivalTime"
                    name="arrivalTime"
                    type="time"
                    value={formData.arrivalTime}
                    onChange={handleInputChange}
                    invalid={!!errors.arrivalTime}
                    feedback={errors.arrivalTime}
                  />
                </div>
              </CCol>
            </CRow>

            <CRow>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel htmlFor="date">
                    <CIcon icon={cilCalendar} className="me-2" />
                    Date *
                  </CFormLabel>
                  <CFormInput
                    id="date"
                    name="date"
                    type="date"
                    min={getTodayDate()}
                    value={formData.date}
                    onChange={handleInputChange}
                    invalid={!!errors.date}
                    feedback={errors.date}
                  />
                </div>
              </CCol>

              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel htmlFor="from">
                    <CIcon icon={cilLocationPin} className="me-2" />
                    From *
                  </CFormLabel>
                  <CFormInput
                    id="from"
                    name="from"
                    value={formData.from}
                    onChange={handleInputChange}
                    placeholder="Enter departure location"
                    invalid={!!errors.from}
                    feedback={errors.from}
                  />
                </div>
              </CCol>
            </CRow>

            <CRow>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel htmlFor="to">
                    <CIcon icon={cilLocationPin} className="me-2" />
                    To *
                  </CFormLabel>
                  <CFormInput
                    id="to"
                    name="to"
                    value={formData.to}
                    onChange={handleInputChange}
                    placeholder="Enter arrival location"
                    invalid={!!errors.to}
                    feedback={errors.to}
                  />
                </div>
              </CCol>

              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel htmlFor="price">
                    <CIcon icon={cilMoney} className="me-2" />
                    Price (₹) *
                  </CFormLabel>
                  <CInputGroup>
                    <CInputGroupText>₹</CInputGroupText>
                    <CFormInput
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="Enter ticket price"
                      invalid={!!errors.price}
                      feedback={errors.price}
                    />
                  </CInputGroup>
                </div>
              </CCol>
            </CRow>

            <CRow>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel htmlFor="totalSeats">
                    <CIcon icon={cilSpeedometer} className="me-2" />
                    Total Seats *
                  </CFormLabel>
                  <CFormInput
                    id="totalSeats"
                    name="totalSeats"
                    type="number"
                    min="1"
                    value={formData.totalSeats}
                    onChange={handleInputChange}
                    placeholder="Enter total seats"
                    invalid={!!errors.totalSeats}
                    feedback={errors.totalSeats}
                  />
                </div>
              </CCol>

              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel htmlFor="totalTimeTaken">
                    <CIcon icon={cilClock} className="me-2" />
                    Total Time Taken *
                  </CFormLabel>
                  <CFormInput
                    id="totalTimeTaken"
                    name="totalTimeTaken"
                    value={formData.totalTimeTaken}
                    onChange={handleInputChange}
                    placeholder="e.g., 8 hours, 6 hours 30 minutes"
                    invalid={!!errors.totalTimeTaken}
                    feedback={errors.totalTimeTaken}
                  />
                </div>
              </CCol>
            </CRow>

            <CRow>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel htmlFor="shift">
                    <CIcon icon={cilClock} className="me-2" />
                    Shift *
                  </CFormLabel>
                  <CFormSelect
                    id="shift"
                    name="shift"
                    value={formData.shift}
                    onChange={handleInputChange}
                    invalid={!!errors.shift}
                    feedback={errors.shift}
                  >
                    <option value="">Select shift</option>
                    <option value="day">Day</option>
                    <option value="night">Night</option>
                  </CFormSelect>
                </div>
              </CCol>

              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel htmlFor="ticketId">
                    <CIcon icon={cilBusAlt} className="me-2" />
                    Ticket ID
                  </CFormLabel>
                  <CFormInput
                    id="ticketId"
                    name="ticketId"
                    value={formData.ticketId}
                    disabled
                    className="bg-light"
                  />
                </div>
              </CCol>
            </CRow>

            <div className="d-flex justify-content-end gap-2">
              <CButton 
                color="secondary" 
                variant="outline"
                onClick={() => navigate('/admin/tickets')}
                disabled={loading}
              >
                Cancel
              </CButton>
              <CButton 
                color="primary" 
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <CSpinner size="sm" className="me-2" />
                    Updating...
                  </>
                ) : (
                  <>
                    <CIcon icon={cilSave} className="me-2" />
                    Update Ticket
                  </>
                )}
              </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default EditTicket; 