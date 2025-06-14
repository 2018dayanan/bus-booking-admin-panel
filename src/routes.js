import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Profile = React.lazy(() => import('./views/pages/Profile'))
const Tickets = React.lazy(() => import('./views/pages/Tickets'))
const TicketDetail = React.lazy(() => import('./views/pages/TicketDetail'))
const AddTicket = React.lazy(() => import('./views/pages/AddTicket'))
const EditTicket = React.lazy(() => import('./views/pages/EditTicket'))
const Bookings = React.lazy(() => import('./views/pages/Bookings'))
const Users = React.lazy(() => import('./views/pages/Users'))
const UserDetail = React.lazy(() => import('./views/pages/UserDetail'))
const AddUser = React.lazy(() => import('./views/pages/AddUser'))
const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))

// Base
const Accordion = React.lazy(() => import('./views/base/accordion/Accordion'))
const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'))
const Cards = React.lazy(() => import('./views/base/cards/Cards'))
const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'))
const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'))
const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups'))
const Navs = React.lazy(() => import('./views/base/navs/Navs'))
const Paginations = React.lazy(() => import('./views/base/paginations/Paginations'))
const Placeholders = React.lazy(() => import('./views/base/placeholders/Placeholders'))
const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'))
const Progress = React.lazy(() => import('./views/base/progress/Progress'))
const Spinners = React.lazy(() => import('./views/base/spinners/Spinners'))
const Tabs = React.lazy(() => import('./views/base/tabs/Tabs'))
const Tables = React.lazy(() => import('./views/base/tables/Tables'))
const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'))

// Buttons
const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'))
const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'))
const Dropdowns = React.lazy(() => import('./views/buttons/dropdowns/Dropdowns'))

//Forms
const ChecksRadios = React.lazy(() => import('./views/forms/checks-radios/ChecksRadios'))
const FloatingLabels = React.lazy(() => import('./views/forms/floating-labels/FloatingLabels'))
const FormControl = React.lazy(() => import('./views/forms/form-control/FormControl'))
const InputGroup = React.lazy(() => import('./views/forms/input-group/InputGroup'))
const Layout = React.lazy(() => import('./views/forms/layout/Layout'))
const Range = React.lazy(() => import('./views/forms/range/Range'))
const Select = React.lazy(() => import('./views/forms/select/Select'))
const Validation = React.lazy(() => import('./views/forms/validation/Validation'))

const Charts = React.lazy(() => import('./views/charts/Charts'))

// Icons
const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'))
const Flags = React.lazy(() => import('./views/icons/flags/Flags'))
const Brands = React.lazy(() => import('./views/icons/brands/Brands'))

// Notifications
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'))
const Badges = React.lazy(() => import('./views/notifications/badges/Badges'))
const Modals = React.lazy(() => import('./views/notifications/modals/Modals'))
const Toasts = React.lazy(() => import('./views/notifications/toasts/Toasts'))

const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

const routes = [
  { path: '/admin', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/profile', name: 'Profile', element: Profile },
  { path: '/users', name: 'Users', element: Users },
  { path: '/users/add', name: 'Add User', element: AddUser },
  { path: '/admin/users/:id', name: 'User Detail', element: UserDetail },
  { path: '/tickets', name: 'Tickets', element: Tickets },
  { path: '/tickets/add', name: 'Add Ticket', element: AddTicket },
  { path: '/tickets/edit/:id', name: 'Edit Ticket', element: EditTicket },
  { path: '/admin/tickets/:id', name: 'Ticket Detail', element: TicketDetail },
  { path: '/bookings', name: 'Bookings', element: Bookings },
  { path: '/admin/theme', name: 'Theme', element: Colors, exact: true },
  { path: '/admin/theme/colors', name: 'Colors', element: Colors },
  { path: '/admin/theme/typography', name: 'Typography', element: Typography },

  { path: '/admin/notifications/alerts', name: 'Alerts', element: Alerts },
  { path: '/admin/notifications/badges', name: 'Badges', element: Badges },
  { path: '/admin/notifications/modals', name: 'Modals', element: Modals },
  { path: '/admin/notifications/toasts', name: 'Toasts', element: Toasts },
]

export default routes
