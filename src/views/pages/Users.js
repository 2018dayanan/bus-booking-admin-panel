import React, { useState } from 'react'
import { CCard, CCardBody, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CAvatar, CButton, CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem } from '@coreui/react'
import { cilOptions } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const dummyUsers = [
  {
    id: 1,
    name: 'Alice Johnson',
    role: 'Admin',
    profilePic: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: 2,
    name: 'Bob Smith',
    role: 'User',
    profilePic: 'https://randomuser.me/api/portraits/men/46.jpg',
  },
  {
    id: 3,
    name: 'Carol Lee',
    role: 'Moderator',
    profilePic: 'https://randomuser.me/api/portraits/women/47.jpg',
  },
]

const Users = () => {
  const [selectedUser, setSelectedUser] = useState(null)
  const [showDropdown, setShowDropdown] = useState(null)

  const handleDropdown = (userId) => {
    setShowDropdown(showDropdown === userId ? null : userId)
  }

  const handleAction = (action, user) => {
    setSelectedUser(user)
    setShowDropdown(null)
    if (action === 'view') {
      alert(`View details for ${user.name}`)
    } else if (action === 'update') {
      alert(`Update user ${user.name}`)
    } else if (action === 'delete') {
      if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
        alert(`Deleted user ${user.name}`)
      }
    }
  }

  return (
    <CCard>
      <CCardBody>
        <h4 className="mb-4">User Management</h4>
        <CTable align="middle" className="mb-0 border" hover responsive>
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell scope="col">Profile</CTableHeaderCell>
              <CTableHeaderCell scope="col">Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">Role</CTableHeaderCell>
              <CTableHeaderCell scope="col" className="text-end">Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {dummyUsers.map((user) => (
              <CTableRow key={user.id}>
                <CTableDataCell>
                  <CAvatar src={user.profilePic} size="md" />
                </CTableDataCell>
                <CTableDataCell>{user.name}</CTableDataCell>
                <CTableDataCell>{user.role}</CTableDataCell>
                <CTableDataCell className="text-end">
                  <CDropdown visible={showDropdown === user.id} onVisibleChange={() => handleDropdown(user.id)}>
                    <CDropdownToggle color="light" caret={false}>
                      <CIcon icon={cilOptions} size="lg" />
                    </CDropdownToggle>
                    <CDropdownMenu>
                      <CDropdownItem onClick={() => handleAction('view', user)}>View Details</CDropdownItem>
                      <CDropdownItem onClick={() => handleAction('update', user)}>Update User</CDropdownItem>
                      <CDropdownItem onClick={() => handleAction('delete', user)}>Delete User</CDropdownItem>
                    </CDropdownMenu>
                  </CDropdown>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  )
}

export default Users 