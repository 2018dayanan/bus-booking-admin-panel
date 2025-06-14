import React from 'react'
import CIcon from '@coreui/icons-react'
import {
 
  cilSpeedometer,
  cilUser,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/admin/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  // {
  //   component: CNavItem,
  //   name: 'Dashboard2',
  //   to: '/admin/dashboard2',
  //   icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  //   badge: {
  //     color: 'success',
  //     text: 'SIMPLE',
  //   },
  // },
  {
    component: CNavItem,
    name: 'Profile',
    to: '/admin/profile',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
 
  {
    component: CNavTitle,
    name: 'Menus',
  },

  {
    component: CNavGroup,
    name: 'User Management',
    to: '/admin/manage/users',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Users',
        to: '/admin/users',
      },
     
    ],
  },
]

export default _nav
