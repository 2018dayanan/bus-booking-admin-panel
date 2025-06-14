import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CSpinner,
  CAlert,
  CListGroup,
  CListGroupItem,
  CBadge,
  CRow,
  CCol,
  CAvatar,
} from '@coreui/react';
import {
  cilArrowLeft,
  cilUser,
  cilEnvelopeClosed,
  cilPhone,
  cilCalendar,
  cilLocationPin,
  cilShieldAlt,
  cilCheckCircle,
  cilXCircle,
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import userService from '../../services/userService';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);

        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Request timed out')), 10000);
        });

        const response = await Promise.race([userService.getUserById(id), timeoutPromise]);

        if (isMounted) {
          console.log('User Detail API Response:', response);
          
          // Handle different response structures
          let userData = null;
          if (response && response.data) {
            if (response.data && typeof response.data === 'object') {
              userData = response.data;
            } else if (response.data.data && typeof response.data.data === 'object') {
              userData = response.data.data;
            }
          }
          
          if (userData) {
            setUser(userData);
          } else {
            setError('User data not found in API response');
          }
          setLoading(false);
        }
      } catch (apiError) {
        console.warn('API call failed:', apiError.message);
        if (isMounted) {
          setError('Failed to fetch user details. Please try again.');
          setLoading(false);
        }
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRoleBadgeColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'danger';
      case 'user':
        return 'primary';
      case 'moderator':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const getStatusBadgeColor = (isActive) => {
    return isActive ? 'success' : 'danger';
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <CSpinner color="primary" />
        <span className="ms-3">Loading user details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <CAlert color="danger" className="d-flex align-items-center">
        <CIcon icon={cilUser} className="me-2" />
        <div>
          <strong>Error:</strong> {error}
          <CButton
            color="link"
            className="p-0 ms-2"
            onClick={() => navigate('/admin/users')}
          >
            Back to Users
          </CButton>
        </div>
      </CAlert>
    );
  }

  if (!user) {
    return (
      <CAlert color="warning" className="d-flex align-items-center">
        <CIcon icon={cilUser} className="me-2" />
        <div>
          <strong>User not found</strong>
          <CButton
            color="link"
            className="p-0 ms-2"
            onClick={() => navigate('/admin/users')}
          >
            Back to Users
          </CButton>
        </div>
      </CAlert>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <CButton
          color="light"
          variant="outline"
          onClick={() => navigate('/admin/users')}
        >
          <CIcon icon={cilArrowLeft} className="me-2" />
          Back to Users
        </CButton>
        <div>
          <CButton
            color="primary"
            className="me-2"
            onClick={() => alert(`Edit user ${user.name}`)}
          >
            Edit User
          </CButton>
          <CButton
            color="danger"
            variant="outline"
            onClick={() => {
              if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
                alert(`Delete user ${user.name}`);
              }
            }}
          >
            Delete User
          </CButton>
        </div>
      </div>

      <CRow>
        <CCol md={4}>
          <CCard>
            <CCardBody className="text-center">
              <CAvatar
                src={user.profilePicture}
                size="xl"
                className="mb-3"
                style={{ width: '120px', height: '120px' }}
              />
              <h4 className="mb-2">{user.name}</h4>
              <CBadge color={getRoleBadgeColor(user.role)} className="mb-2">
                {user.role?.toUpperCase() || 'N/A'}
              </CBadge>
              <div className="mt-3">
                <CBadge color={getStatusBadgeColor(user.isActive)}>
                  <CIcon icon={user.isActive ? cilCheckCircle : cilXCircle} className="me-1" />
                  {user.isActive ? 'ACTIVE' : 'INACTIVE'}
                </CBadge>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol md={8}>
          <CCard>
            <CCardHeader>
              <h5 className="mb-0">
                <CIcon icon={cilUser} className="me-2" />
                User Information
              </h5>
            </CCardHeader>
            <CCardBody>
              <CListGroup flush>
                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <CIcon icon={cilEnvelopeClosed} className="me-3" />
                    <strong>Email:</strong>
                  </div>
                  <span>{user.email}</span>
                </CListGroupItem>

                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <CIcon icon={cilPhone} className="me-3" />
                    <strong>Phone:</strong>
                  </div>
                  <span>{user.phone || 'N/A'}</span>
                </CListGroupItem>

                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <CIcon icon={cilCalendar} className="me-3" />
                    <strong>Joined Date:</strong>
                  </div>
                  <span>{formatDate(user.createdAt)}</span>
                </CListGroupItem>

                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <CIcon icon={cilLocationPin} className="me-3" />
                    <strong>Address:</strong>
                  </div>
                  <span className="text-end">{user.address || 'N/A'}</span>
                </CListGroupItem>

                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <CIcon icon={cilShieldAlt} className="me-3" />
                    <strong>User ID:</strong>
                  </div>
                  <span className="text-muted">{user._id}</span>
                </CListGroupItem>
              </CListGroup>
            </CCardBody>
          </CCard>

          {user.updatedAt && (
            <CCard className="mt-3">
              <CCardHeader>
                <h6 className="mb-0">Additional Information</h6>
              </CCardHeader>
              <CCardBody>
                <CListGroup flush>
                  <CListGroupItem className="d-flex justify-content-between align-items-center">
                    <strong>Last Updated:</strong>
                    <span>{formatDate(user.updatedAt)}</span>
                  </CListGroupItem>
                </CListGroup>
              </CCardBody>
            </CCard>
          )}
        </CCol>
      </CRow>
    </div>
  );
};

export default UserDetail; 