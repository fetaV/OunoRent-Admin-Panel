import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Categories = React.lazy(() => import('./views/theme/categories/Categories'))
const UserList = React.lazy(() => import('./views/theme/userlist/UserList'))
const Slider = React.lazy(() => import('./views/theme/slider/Slider'))
const Blog = React.lazy(() => import('./views/theme/blog/Blog'))
const FeaturedCategory = React.lazy(
  () => import('./views/theme/featuredCategory/FeaturedCategories'),
)
const MenuItem = React.lazy(() => import('./views/theme/menuItem/MenuItem'))
const Footer = React.lazy(() => import('./views/theme/footer/Footer'))
const Faq = React.lazy(() => import('./views/theme/faq/Faq'))
const ContactForm = React.lazy(() => import('./views/theme/contactForm/ContactForm'))
const Brand = React.lazy(() => import('./views/theme/brand/Brand'))
const Feature = React.lazy(() => import('./views/theme/feature/Feature'))
const Address = React.lazy(() => import('./views/theme/address/Address'))
const Channel = React.lazy(() => import('./views/theme/channel/Channel'))
const Contract = React.lazy(() => import('./views/theme/contract/Contract'))
const Price = React.lazy(() => import('./views/theme/price/Price'))
const UserContract = React.lazy(() => import('./views/theme/userContract/UserContract'))
const Warehouse = React.lazy(() => import('./views/theme/warehouse/Warehouse'))
const WarehouseConnection = React.lazy(
  () => import('./views/theme/warehouseConnection/WarehouseConnection'),
)

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
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/theme', name: 'Theme', element: Categories, exact: true },
  { path: '/theme/categories', name: 'Categories', element: Categories },
  { path: '/theme/userlist', name: 'UserList', element: UserList },
  { path: '/theme/slider', name: 'Slider', element: Slider },
  { path: '/theme/blog', name: 'Blog', element: Blog },
  { path: '/theme/featuredCategories', name: 'FeaturedCategory', element: FeaturedCategory },
  { path: '/theme/menuItem', name: 'MenuItem', element: MenuItem },
  { path: '/theme/contactForm', name: 'ContactForm', element: ContactForm },
  { path: '/theme/brand', name: 'Brand', element: Brand },
  { path: '/theme/feature', name: 'Feature', element: Feature },
  { path: '/theme/address', name: 'Address', element: Address },
  { path: '/theme/channel', name: 'Channel', element: Channel },
  { path: '/theme/contract', name: 'Contract', element: Contract },
  { path: '/theme/price', name: 'Price', element: Price },
  { path: '/theme/userContract', name: 'UserContract', element: UserContract },
  { path: '/theme/warehouse', name: 'Warehouse', element: Warehouse },
  { path: '/theme/warehouseConnection', name: 'WarehouseConnection', element: WarehouseConnection },
  { path: '/theme/footer', name: 'Footer', element: Footer },
  { path: '/theme/faq', name: 'Faq', element: Faq },
  { path: '/base', name: 'Base', element: Cards, exact: true },
  { path: '/base/accordion', name: 'Accordion', element: Accordion },
  { path: '/base/breadcrumbs', name: 'Breadcrumbs', element: Breadcrumbs },
  { path: '/base/cards', name: 'Cards', element: Cards },
  { path: '/base/carousels', name: 'Carousel', element: Carousels },
  { path: '/base/collapses', name: 'Collapse', element: Collapses },
  { path: '/base/list-groups', name: 'List Groups', element: ListGroups },
  { path: '/base/navs', name: 'Navs', element: Navs },
  { path: '/base/paginations', name: 'Paginations', element: Paginations },
  { path: '/base/placeholders', name: 'Placeholders', element: Placeholders },
  { path: '/base/popovers', name: 'Popovers', element: Popovers },
  { path: '/base/progress', name: 'Progress', element: Progress },
  { path: '/base/spinners', name: 'Spinners', element: Spinners },
  { path: '/base/tabs', name: 'Tabs', element: Tabs },
  { path: '/base/tables', name: 'Tables', element: Tables },
  { path: '/base/tooltips', name: 'Tooltips', element: Tooltips },
  { path: '/buttons', name: 'Buttons', element: Buttons, exact: true },
  { path: '/buttons/buttons', name: 'Buttons', element: Buttons },
  { path: '/buttons/dropdowns', name: 'Dropdowns', element: Dropdowns },
  { path: '/buttons/button-groups', name: 'Button Groups', element: ButtonGroups },
  { path: '/charts', name: 'Charts', element: Charts },
  { path: '/forms', name: 'Forms', element: FormControl, exact: true },
  { path: '/forms/form-control', name: 'Form Control', element: FormControl },
  { path: '/forms/select', name: 'Select', element: Select },
  { path: '/forms/checks-radios', name: 'Checks & Radios', element: ChecksRadios },
  { path: '/forms/range', name: 'Range', element: Range },
  { path: '/forms/input-group', name: 'Input Group', element: InputGroup },
  { path: '/forms/floating-labels', name: 'Floating Labels', element: FloatingLabels },
  { path: '/forms/layout', name: 'Layout', element: Layout },
  { path: '/forms/validation', name: 'Validation', element: Validation },
  { path: '/icons', exact: true, name: 'Icons', element: CoreUIIcons },
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', element: CoreUIIcons },
  { path: '/icons/flags', name: 'Flags', element: Flags },
  { path: '/icons/brands', name: 'Brands', element: Brands },
  { path: '/notifications', name: 'Notifications', element: Alerts, exact: true },
  { path: '/notifications/alerts', name: 'Alerts', element: Alerts },
  { path: '/notifications/badges', name: 'Badges', element: Badges },
  { path: '/notifications/modals', name: 'Modals', element: Modals },
  { path: '/notifications/toasts', name: 'Toasts', element: Toasts },
  { path: '/widgets', name: 'Widgets', element: Widgets },
]

export default routes
