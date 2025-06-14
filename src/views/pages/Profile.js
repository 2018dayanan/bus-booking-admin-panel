import React from 'react'
import { useSelector } from 'react-redux'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CAvatar,
  CListGroup,
  CListGroupItem,
  CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilUser,
  cilEnvelopeClosed,
  cilPhone,
  cilLocationPin,
  cilBadge,
  cilCheckCircle,
  cilCalendar,
} from '@coreui/icons'

import avatar8 from '../../assets/images/avatars/8.jpg'

const Profile = () => {
  const { user } = useSelector((state) => state.auth)

  // Get profile picture from user data, with fallback to default avatar
  const getProfilePicture = () => {
    if (user && user.profilePicture) {
      return user.profilePicture
    }
    return avatar8 // Fallback to default avatar
  }

  // Get user display name
  const getUserDisplayName = () => {
    if (user) {
      return user.name || user.username || 'User'
    }
    return 'User'
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'success'
      case 'inactive':
        return 'danger'
      case 'pending':
        return 'warning'
      default:
        return 'secondary'
    }
  }

  // Get verification status
  const getVerificationStatus = () => {
    if (user?.isVerified) {
      return <CBadge color="success">Verified</CBadge>
    }
    return <CBadge color="warning">Not Verified</CBadge>
  }

  return (
    <CRow>
      <CCol xs={12} md={4}>
        <CCard className="mb-4">
          <CCardHeader>
            <h4>Profile Picture</h4>
          </CCardHeader>
          <CCardBody className="text-center">
            <CAvatar 
              src={getProfilePicture()} 
              size="xl" 
              className="mb-3"
              style={{ width: '150px', height: '150px' }}
            />
            <h5>{getUserDisplayName()}</h5>
            <p className="text-muted">{user?.role || 'User'}</p>
            {getVerificationStatus()}
          </CCardBody>
        </CCard>
      </CCol>
      
      <CCol xs={12} md={8}>
        <CCard className="mb-4">
          <CCardHeader>
            <h4>Personal Information</h4>
          </CCardHeader>
          <CCardBody>
            <CListGroup flush>
              <CListGroupItem className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <CIcon icon={cilUser} className="me-3" />
                  <div>
                    <strong>Name</strong>
                    <div className="text-muted">{getUserDisplayName()}</div>
                  </div>
                </div>
              </CListGroupItem>
              
              <CListGroupItem className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <CIcon icon={cilEnvelopeClosed} className="me-3" />
                  <div>
                    <strong>Email</strong>
                    <div className="text-muted">{user?.email || 'N/A'}</div>
                  </div>
                </div>
              </CListGroupItem>
              
              <CListGroupItem className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <CIcon icon={cilPhone} className="me-3" />
                  <div>
                    <strong>Phone</strong>
                    <div className="text-muted">{user?.phone || 'N/A'}</div>
                  </div>
                </div>
              </CListGroupItem>
              
              <CListGroupItem className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <CIcon icon={cilLocationPin} className="me-3" />
                  <div>
                    <strong>Address</strong>
                    <div className="text-muted">{user?.address || 'N/A'}</div>
                  </div>
                </div>
              </CListGroupItem>
              
              <CListGroupItem className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <CIcon icon={cilBadge} className="me-3" />
                  <div>
                    <strong>Gender</strong>
                    <div className="text-muted">{user?.gender || 'N/A'}</div>
                  </div>
                </div>
              </CListGroupItem>
              
              <CListGroupItem className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <CIcon icon={cilCheckCircle} className="me-3" />
                  <div>
                    <strong>Status</strong>
                    <div>
                      <CBadge color={getStatusColor(user?.status)}>
                        {user?.status || 'Unknown'}
                      </CBadge>
                    </div>
                  </div>
                </div>
              </CListGroupItem>
              
              <CListGroupItem className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <CIcon icon={cilCalendar} className="me-3" />
                  <div>
                    <strong>Member Since</strong>
                    <div className="text-muted">{formatDate(user?.createdAt)}</div>
                  </div>
                </div>
              </CListGroupItem>
            </CListGroup>
          </CCardBody>
        </CCard>
        
        {user?.rewardPoints && (
          <CCard>
            <CCardHeader>
              <h4>Rewards</h4>
            </CCardHeader>
            <CCardBody>
              <div className="d-flex align-items-center">
                <CIcon icon={cilBadge} className="me-3" size="lg" />
                <div>
                  <strong>Reward Points</strong>
                  <div className="h4 mb-0">{user.rewardPoints}</div>
                </div>
              </div>
            </CCardBody>
          </CCard>
        )}
      </CCol>
    </CRow>
  )
}

export default Profile 