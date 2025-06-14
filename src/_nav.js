import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilExternalLink,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
  cilUser,
  cilBusAlt,
  cilCreditCard,
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
      {
        component: CNavItem,
        name: 'Add User',
        to: '/admin/users/add',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Ticket Management',
    to: '/admin/tickets',
    icon: <CIcon icon={cilBusAlt} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'All Tickets',
        to: '/admin/tickets',
      },
      {
        component: CNavItem,
        name: 'Add Tickets',
        to: '/admin/tickets/add',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Booking Management',
    to: '/admin/bookings',
    icon: <CIcon icon={cilCreditCard} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Bookings',
        to: '/admin/bookings',
      },
    ],
  },
]

export default _nav
