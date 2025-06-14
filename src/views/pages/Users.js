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
import { cilOptions, cilUser, cilSearch, cilEnvelopeClosed, cilPhone, cilCalendar, cilLocationPin } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import userService from '../../services/userService';

// Mock data for fallback
const mockUsers = [
  {
    _id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    role: 'user',
    profilePicture: 'https://via.placeholder.com/40',
    createdAt: '2024-01-15T10:30:00Z',
    isActive: true,
    address: '123 Main St, New York, NY',
  },
  {
    _id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1234567891',
    role: 'admin',
    profilePicture: 'https://via.placeholder.com/40',
    createdAt: '2024-01-10T14:20:00Z',
    isActive: true,
    address: '456 Oak Ave, Boston, MA',
  },
];

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Request timed out')), 10000);
        });

        const response = await Promise.race([userService.getAllUsers(), timeoutPromise]);

        if (isMounted) {
          console.log('Full API Response:', response);
          
          // Handle different response structures
          let userData = [];
          if (response && response.data) {
            // If response.data is an array, use it directly
            if (Array.isArray(response.data)) {
              userData = response.data;
            }
            // If response.data has a nested data property (common API pattern)
            else if (response.data.data && Array.isArray(response.data.data)) {
              userData = response.data.data;
            }
            // If response.data is an object with users property
            else if (response.data.users && Array.isArray(response.data.users)) {
              userData = response.data.users;
            }
            // If response.data is an object with results property
            else if (response.data.results && Array.isArray(response.data.results)) {
              userData = response.data.results;
            }
          }
          
          console.log('Processed user data:', userData);
          
          if (userData.length > 0) {
            setUsers(userData);
            setFilteredUsers(userData);
          } else {
            console.warn('No user data found in API response, using mock data');
            setUsers(mockUsers);
            setFilteredUsers(mockUsers);
          }
          setLoading(false);
        }
      } catch (apiError) {
        console.error('API call failed, using mock data:', apiError.message);
        if (isMounted) {
          setUsers(mockUsers);
          setFilteredUsers(mockUsers);
          setError(`API Error: ${apiError.message}`);
          setLoading(false);
        }
      }
    };

    fetchUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter users based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredUsers(users);
      return;
    }

    const lowerSearch = searchTerm.toLowerCase();
    const filtered = users.filter((user) => {
      const formattedDate = new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).toLowerCase();

      return (
        user.name?.toLowerCase().includes(lowerSearch) ||
        user.email?.toLowerCase().includes(lowerSearch) ||
        user.phone?.toLowerCase().includes(lowerSearch) ||
        user.role?.toLowerCase().includes(lowerSearch) ||
        formattedDate.includes(lowerSearch) ||
        user.address?.toLowerCase().includes(lowerSearch)
      );
    });

    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleDropdown = (visible, userId) => {
    setShowDropdown(visible ? userId : null);
  };

  const handleAction = async (action, user) => {
    setSelectedUser(user);
    setShowDropdown(null);

    try {
      switch (action) {
        case 'view':
          navigate(`/admin/users/${user._id}`);
          break;
        case 'edit':
          alert(`Edit user ${user.name}`);
          break;
        case 'delete':
          if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
            await userService.deleteUser(user._id);
            alert(`Successfully deleted user ${user.name}`);
            const updatedUsers = users.filter((u) => u._id !== user._id);
            setUsers(updatedUsers);
            setFilteredUsers(updatedUsers);
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
        <span className="ms-3">Loading users...</span>
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
            onClick={async () => {
              setLoading(true);
              try {
                const response = await userService.getAllUsers();
                console.log('Retry API Response:', response);
                
                // Handle different response structures
                let userData = [];
                if (response && response.data) {
                  if (Array.isArray(response.data)) {
                    userData = response.data;
                  } else if (response.data.data && Array.isArray(response.data.data)) {
                    userData = response.data.data;
                  } else if (response.data.users && Array.isArray(response.data.users)) {
                    userData = response.data.users;
                  } else if (response.data.results && Array.isArray(response.data.results)) {
                    userData = response.data.results;
                  }
                }
                
                if (userData.length > 0) {
                  setUsers(userData);
                  setFilteredUsers(userData);
                  setError(null);
                } else {
                  setUsers(mockUsers);
                  setFilteredUsers(mockUsers);
                  setError('No user data found in API response');
                }
              } catch (apiError) {
                setUsers(mockUsers);
                setFilteredUsers(mockUsers);
                setError(`API Error: ${apiError.message}`);
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
          <h4 className="mb-0">User Management</h4>
          <CButton color="primary" onClick={() => navigate('/admin/users/add')}>
            <CIcon icon={cilUser} className="me-2" />
            Add New User
          </CButton>
        </div>
      </CCardHeader>
      <CCardBody>
        <CInputGroup className="mb-3">
          <CInputGroupText>
            <CIcon icon={cilSearch} />
          </CInputGroupText>
          <CFormInput
            placeholder="Search by name, email, phone, role, date, or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CInputGroup>

        <CTable align="middle" className="mb-0 border" hover responsive>
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell>Profile</CTableHeaderCell>
              <CTableHeaderCell>Name</CTableHeaderCell>
              <CTableHeaderCell>Contact</CTableHeaderCell>
              <CTableHeaderCell>Role</CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell>
              <CTableHeaderCell>Joined Date</CTableHeaderCell>
              <CTableHeaderCell>Address</CTableHeaderCell>
              <CTableHeaderCell className="text-end">Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredUsers.map((user) => (
              <CTableRow key={user._id}>
                <CTableDataCell>
                  <CAvatar src={user.profilePicture} size="md" className="me-3" />
                </CTableDataCell>
                <CTableDataCell>
                  <div className="fw-semibold">{user.name}</div>
                  <div className="small text-muted">ID: {user._id}</div>
                </CTableDataCell>
                <CTableDataCell>
                  <div className="d-flex align-items-center mb-1">
                    <CIcon icon={cilEnvelopeClosed} className="me-2" />
                    <div className="small">{user.email}</div>
                  </div>
                  <div className="d-flex align-items-center">
                    <CIcon icon={cilPhone} className="me-2" />
                    <div className="small">{user.phone || 'N/A'}</div>
                  </div>
                </CTableDataCell>
                <CTableDataCell>
                  <CBadge color={getRoleBadgeColor(user.role)}>
                    {user.role?.toUpperCase() || 'N/A'}
                  </CBadge>
                </CTableDataCell>
                <CTableDataCell>
                  <CBadge color={getStatusBadgeColor(user.isActive)}>
                    {user.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </CBadge>
                </CTableDataCell>
                <CTableDataCell>
                  <div className="d-flex align-items-center">
                    <CIcon icon={cilCalendar} className="me-2" />
                    <div className="small">{formatDate(user.createdAt)}</div>
                  </div>
                </CTableDataCell>
                <CTableDataCell>
                  <div className="d-flex align-items-center">
                    <CIcon icon={cilLocationPin} className="me-2" />
                    <div className="small">{user.address || 'N/A'}</div>
                  </div>
                </CTableDataCell>
                <CTableDataCell className="text-end">
                  <CDropdown
                    visible={showDropdown === user._id}
                    onVisibleChange={(visible) => handleDropdown(visible, user._id)}
                  >
                    <CDropdownToggle color="light" caret={false}>
                      <CIcon icon={cilOptions} size="lg" />
                    </CDropdownToggle>
                    <CDropdownMenu>
                      <CDropdownItem onClick={() => handleAction('view', user)}>View Details</CDropdownItem>
                      <CDropdownItem onClick={() => handleAction('edit', user)}>Edit User</CDropdownItem>
                      <CDropdownItem onClick={() => handleAction('delete', user)}>Delete User</CDropdownItem>
                    </CDropdownMenu>
                  </CDropdown>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>

        {filteredUsers.length === 0 && !loading && (
          <div className="text-center py-5">
            <CIcon icon={cilUser} size="3xl" className="text-muted mb-3" />
            <h5 className="text-muted">{searchTerm ? 'No users match your search' : 'No users found'}</h5>
            <p className="text-muted">
              {searchTerm ? 'Try a different search term.' : 'Start by adding your first user.'}
            </p>
          </div>
        )}
      </CCardBody>
    </CCard>
  );
};

export default Users; 