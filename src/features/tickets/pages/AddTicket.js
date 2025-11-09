import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const AddTicket = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    operatorName: '',
    bussName: '',
    bussNo: '',
    vehicleType: '',
    departureTime: '',
    arrivalTime: '',
    from: '',
    to: '',
    price: '',
    totalSeats: '',
    totalTimeTaken: '',
    shift: '',
    date: '',
  });

  const [errors, setErrors] = useState({});

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

    if (!formData.from.trim()) {
      newErrors.from = 'From location is required';
    }

    if (!formData.to.trim()) {
      newErrors.to = 'To location is required';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a valid positive number';
    }

    if (!formData.totalSeats.trim()) {
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

    if (!formData.date.trim()) {
      newErrors.date = 'Date is required';
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
      const formattedDate = new Date(formData.date).toISOString().split('T')[0];
      
      const ticketData = {
        ...formData,
        date: formattedDate,
        price: parseFloat(formData.price),
        totalSeats: parseInt(formData.totalSeats),
      };

      console.log('Submitting ticket data:', ticketData);
      console.log('Formatted date:', formattedDate);

      const response = await ticketService.createTicket(ticketData);
      
      console.log('Ticket created successfully:', response);
      
      setSuccess('Ticket created successfully!');
      
      setFormData({
        operatorName: '',
        bussName: '',
        bussNo: '',
        vehicleType: '',
        departureTime: '',
        arrivalTime: '',
        from: '',
        to: '',
        price: '',
        totalSeats: '',
        totalTimeTaken: '',
        shift: '',
        date: '',
      });

      setTimeout(() => {
        navigate('/admin/tickets');
      }, 2000);

    } catch (err) {
      console.error('Error creating ticket:', err);
      console.error('Error response:', err.response);
      console.error('Error message:', err.message);
      
      let errorMessage = 'Failed to create ticket';
      
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
        <h4 className="mb-0">
          <CIcon icon={cilBusAlt} className="me-2" />
          Add New Ticket
        </h4>
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
            </CRow>

            <CRow>
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
            </CRow>

            <CRow>
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
                    Creating...
                  </>
                ) : (
                  <>
                    <CIcon icon={cilSave} className="me-2" />
                    Create Ticket
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

export default AddTicket;
