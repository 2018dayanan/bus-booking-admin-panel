import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Dashboard2 = React.lazy(() => import('./views/dashboard/Dashboard2'))
const Profile = React.lazy(() => import('./views/pages/Profile'))
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

const Users = React.lazy(() => import('./views/pages/Users'))

const routes = [
  { path: '/admin', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/admin/profile', name: 'Profile', element: Profile },
  { path: '/admin/dashboard2', name: 'Dashboard2', element: Dashboard2 },
  { path: '/admin/theme', name: 'Theme', element: Colors, exact: true },
  { path: '/admin/theme/colors', name: 'Colors', element: Colors },
  { path: '/admin/theme/typography', name: 'Typography', element: Typography },
  { path: '/admin/base', name: 'Base', element: Cards, exact: true },
  { path: '/admin/base/accordion', name: 'Accordion', element: Accordion },
  { path: '/admin/base/breadcrumbs', name: 'Breadcrumbs', element: Breadcrumbs },
  { path: '/admin/base/cards', name: 'Cards', element: Cards },
  { path: '/admin/base/carousels', name: 'Carousel', element: Carousels },
  { path: '/admin/base/collapses', name: 'Collapse', element: Collapses },
  { path: '/admin/base/list-groups', name: 'List Groups', element: ListGroups },
  { path: '/admin/base/navs', name: 'Navs', element: Navs },
  { path: '/admin/base/paginations', name: 'Paginations', element: Paginations },
  { path: '/admin/base/placeholders', name: 'Placeholders', element: Placeholders },
  { path: '/admin/base/popovers', name: 'Popovers', element: Popovers },
  { path: '/admin/base/progress', name: 'Progress', element: Progress },
  { path: '/admin/base/spinners', name: 'Spinners', element: Spinners },
  { path: '/admin/base/tabs', name: 'Tabs', element: Tabs },
  { path: '/admin/base/tables', name: 'Tables', element: Tables },
  { path: '/admin/base/tooltips', name: 'Tooltips', element: Tooltips },
  { path: '/admin/buttons', name: 'Buttons', element: Buttons, exact: true },
  { path: '/admin/buttons/buttons', name: 'Buttons', element: Buttons },
  { path: '/admin/buttons/dropdowns', name: 'Dropdowns', element: Dropdowns },
  { path: '/admin/buttons/button-groups', name: 'Button Groups', element: ButtonGroups },
  { path: '/admin/charts', name: 'Charts', element: Charts },
  { path: '/admin/forms', name: 'Forms', element: FormControl, exact: true },
  { path: '/admin/forms/form-control', name: 'Form Control', element: FormControl },
  { path: '/admin/forms/select', name: 'Select', element: Select },
  { path: '/admin/forms/checks-radios', name: 'Checks & Radios', element: ChecksRadios },
  { path: '/admin/forms/range', name: 'Range', element: Range },
  { path: '/admin/forms/input-group', name: 'Input Group', element: InputGroup },
  { path: '/admin/forms/floating-labels', name: 'Floating Labels', element: FloatingLabels },
  { path: '/admin/forms/layout', name: 'Layout', element: Layout },
  { path: '/admin/forms/validation', name: 'Validation', element: Validation },
  { path: '/admin/icons', exact: true, name: 'Icons', element: CoreUIIcons },
  { path: '/admin/icons/coreui-icons', name: 'CoreUI Icons', element: CoreUIIcons },
  { path: '/admin/icons/flags', name: 'Flags', element: Flags },
  { path: '/admin/icons/brands', name: 'Brands', element: Brands },
  { path: '/admin/notifications', name: 'Notifications', element: Alerts, exact: true },
  { path: '/admin/notifications/alerts', name: 'Alerts', element: Alerts },
  { path: '/admin/notifications/badges', name: 'Badges', element: Badges },
  { path: '/admin/notifications/modals', name: 'Modals', element: Modals },
  { path: '/admin/notifications/toasts', name: 'Toasts', element: Toasts },
  { path: '/admin/widgets', name: 'Widgets', element: Widgets },
  { path: '/users', name: 'Users', element: Users },
]

export default routes
