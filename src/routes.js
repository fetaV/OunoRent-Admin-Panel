import React from "react";

const Dashboard = React.lazy(() => import("./views/dashboard/Dashboard"));
const Categories = React.lazy(
  () => import("./views/pages/categories/Categories")
);
const UserList = React.lazy(() => import("./views/pages/userlist/UserList"));
const Slider = React.lazy(() => import("./views/pages/slider/Slider"));
const Blog = React.lazy(() => import("./views/pages/blog/Blog"));
const FeaturedCategory = React.lazy(
  () => import("./views/pages/featuredCategory/FeaturedCategories")
);
const MenuItem = React.lazy(() => import("./views/pages/menuItem/MenuItem"));
const Footer = React.lazy(() => import("./views/pages/footer/FooterHeader"));
const Faq = React.lazy(() => import("./views/pages/faq/Faq"));
const ContactForm = React.lazy(
  () => import("./views/pages/contactForm/ContactForm")
);
const Brand = React.lazy(() => import("./views/pages/brand/Brand"));
const Feature = React.lazy(() => import("./views/pages/feature/Feature"));
const Address = React.lazy(() => import("./views/pages/address/Address"));
const Channel = React.lazy(() => import("./views/pages/channel/Channel"));
const Contract = React.lazy(() => import("./views/pages/contract/Contract"));
const Price = React.lazy(() => import("./views/pages/price/Price"));
const PopularProduct = React.lazy(
  () => import("./views/pages/popularProduct/PopularProduct")
);
const Product = React.lazy(() => import("./views/pages/Product/Product"));
const UserContract = React.lazy(
  () => import("./views/pages/userContract/UserContract")
);
const Warehouse = React.lazy(() => import("./views/pages/warehouse/Warehouse"));
const WarehouseConnection = React.lazy(
  () => import("./views/pages/warehouseConnection/WarehouseConnection")
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
  { path: "/popularProduct", name: "PopularProduct", element: PopularProduct },
  { path: "/product", name: "Product", element: Product },
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
