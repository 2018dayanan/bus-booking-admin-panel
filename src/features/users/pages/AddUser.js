import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormLabel,
  CFormInput,
  CFormTextarea,
  CButton,
  CSpinner,
  CAlert,
  CCol,
  CRow,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react';
import {
  cilArrowLeft,
  cilUser,
  cilEnvelopeClosed,
  cilPhone,
  cilLocationPin,
  cilSave,
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import userService from '../../services/userService';

const AddUser = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }

    // Address validation
    if (!formData.address.trim()) {
      errors.address = 'Address is required';
    } else if (formData.address.trim().length < 5) {
      errors.address = 'Address must be at least 5 characters long';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Format phone number (remove any non-digit characters)
      const formattedData = {
        ...formData,
        phone: formData.phone.replace(/\D/g, ''),
      };

      console.log('Creating user with data:', formattedData);
      
      const response = await userService.createUser(formattedData);
      console.log('User created successfully:', response);

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
      });

      // Redirect to users list after 2 seconds
      setTimeout(() => {
        navigate('/admin/users');
      }, 2000);

    } catch (error) {
      console.error('Error creating user:', error);
      
      let errorMessage = 'Failed to create user. Please try again.';
      
      if (error.response) {
        // Server responded with error
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.status === 400) {
          errorMessage = 'Invalid data provided. Please check your input.';
        } else if (error.response.status === 409) {
          errorMessage = 'A user with this email already exists.';
        } else if (error.response.status === 401) {
          errorMessage = 'Authentication failed. Please login again.';
        }
      } else if (error.request) {
        // Network error
        errorMessage = 'Network error. Please check your connection.';
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/users');
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <CButton
          color="light"
          variant="outline"
          onClick={handleCancel}
        >
          <CIcon icon={cilArrowLeft} className="me-2" />
          Back to Users
        </CButton>
        <h4 className="mb-0">
          <CIcon icon={cilUser} className="me-2" />
          Add New User
        </h4>
      </div>

      {success && (
        <CAlert color="success" className="mb-4">
          <strong>Success!</strong> User has been created successfully. Redirecting to users list...
        </CAlert>
      )}

      {error && (
        <CAlert color="danger" className="mb-4">
          <strong>Error:</strong> {error}
        </CAlert>
      )}

      <CCard>
        <CCardHeader>
          <h5 className="mb-0">User Information</h5>
        </CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleSubmit}>
            <CRow>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel htmlFor="name">
                    <CIcon icon={cilUser} className="me-2" />
                    Full Name *
                  </CFormLabel>
                  <CFormInput
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    invalid={!!validationErrors.name}
                    feedback={validationErrors.name}
                    required
                  />
                </div>
              </CCol>

              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel htmlFor="email">
                    <CIcon icon={cilEnvelopeClosed} className="me-2" />
                    Email Address *
                  </CFormLabel>
                  <CFormInput
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    invalid={!!validationErrors.email}
                    feedback={validationErrors.email}
                    required
                  />
                </div>
              </CCol>
            </CRow>

            <CRow>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel htmlFor="phone">
                    <CIcon icon={cilPhone} className="me-2" />
                    Phone Number *
                  </CFormLabel>
                  <CFormInput
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    invalid={!!validationErrors.phone}
                    feedback={validationErrors.phone}
                    required
                  />
                </div>
              </CCol>

              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel htmlFor="address">
                    <CIcon icon={cilLocationPin} className="me-2" />
                    Address *
                  </CFormLabel>
                  <CFormTextarea
                    id="address"
                    name="address"
                    placeholder="Enter full address"
                    value={formData.address}
                    onChange={handleInputChange}
                    invalid={!!validationErrors.address}
                    feedback={validationErrors.address}
                    rows={3}
                    required
                  />
                </div>
              </CCol>
            </CRow>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <CButton
                color="light"
                variant="outline"
                onClick={handleCancel}
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
                    Creating User...
                  </>
                ) : (
                  <>
                    <CIcon icon={cilSave} className="me-2" />
                    Create User
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

export default AddUser; 