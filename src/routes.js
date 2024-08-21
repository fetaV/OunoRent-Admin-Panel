import React from "react";

const Dashboard = React.lazy(() => import("./views/dashboard/Dashboard"));
const Categories = React.lazy(
  () => import("./views/theme/categories/Categories")
);
const UserList = React.lazy(() => import("./views/theme/userlist/UserList"));
const Slider = React.lazy(() => import("./views/theme/slider/Slider"));
const Blog = React.lazy(() => import("./views/theme/blog/Blog"));
const FeaturedCategory = React.lazy(
  () => import("./views/theme/featuredCategory/FeaturedCategories")
);
const MenuItem = React.lazy(() => import("./views/theme/menuItem/MenuItem"));
const Footer = React.lazy(() => import("./views/theme/footer/Footer"));
const Faq = React.lazy(() => import("./views/theme/faq/Faq"));
const ContactForm = React.lazy(
  () => import("./views/theme/contactForm/ContactForm")
);
const Brand = React.lazy(() => import("./views/theme/brand/Brand"));
const Feature = React.lazy(() => import("./views/theme/feature/Feature"));
const Address = React.lazy(() => import("./views/theme/address/Address"));
const Channel = React.lazy(() => import("./views/theme/channel/Channel"));
const Contract = React.lazy(() => import("./views/theme/contract/Contract"));
const Price = React.lazy(() => import("./views/theme/price/Price"));
const UserContract = React.lazy(
  () => import("./views/theme/userContract/UserContract")
);
const Warehouse = React.lazy(() => import("./views/theme/warehouse/Warehouse"));
const WarehouseConnection = React.lazy(
  () => import("./views/theme/warehouseConnection/WarehouseConnection")
);

const routes = [
  { path: "/", exact: true, name: "Home" },
  { path: "/dashboard", name: "Dashboard", element: Dashboard },
  { path: "/theme", name: "Theme", element: Categories, exact: true },
  { path: "/categories", name: "Categories", element: Categories },
  { path: "/userlist", name: "UserList", element: UserList },
  { path: "/slider", name: "Slider", element: Slider },
  { path: "/blog", name: "Blog", element: Blog },
  {
    path: "/featuredCategories",
    name: "FeaturedCategory",
    element: FeaturedCategory,
  },
  { path: "/menuItem", name: "MenuItem", element: MenuItem },
  { path: "/contactForm", name: "ContactForm", element: ContactForm },
  { path: "/brand", name: "Brand", element: Brand },
  { path: "/feature", name: "Feature", element: Feature },
  { path: "/address", name: "Address", element: Address },
  { path: "/channel", name: "Channel", element: Channel },
  { path: "/contract", name: "Contract", element: Contract },
  { path: "/price", name: "Price", element: Price },
  { path: "/userContract", name: "UserContract", element: UserContract },
  { path: "/warehouse", name: "Warehouse", element: Warehouse },
  {
    path: "/warehouseConnection",
    name: "WarehouseConnection",
    element: WarehouseConnection,
  },
  { path: "/footer", name: "Footer", element: Footer },
  { path: "/faq", name: "Faq", element: Faq },
];

export default routes;
