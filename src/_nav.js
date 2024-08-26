import React from "react";
import CIcon from "@coreui/icons-react";
import {
  cil3d,
  cilActionRedo,
  cilAddressBook,
  cilAirplaneModeOff,
  cilBookmark,
  cilCarAlt,
  cilChatBubble,
  cilContact,
  cilDollar,
  cilDrop,
  cilFeaturedPlaylist,
  cilFile,
  cilHandPointUp,
  cilHouse,
  cilInbox,
  cilLibraryBuilding,
  cilNotes,
  cilPencil,
  cilSchool,
  cilSpeedometer,
} from "@coreui/icons";
import { CNavGroup, CNavItem, CNavTitle } from "@coreui/react";

const _nav = [
  // {
  //   component: CNavItem,
  //   name: "Dashboard",
  //   to: "/dashboard",
  //   icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  //   badge: {
  //     color: "info",
  //     text: "NEW",
  //   },
  // },
  {
    component: CNavTitle,
    name: "Kullanıcı Yonetimi",
  },
  {
    component: CNavItem,
    name: "Adresler",
    to: "/address",
    icon: <CIcon icon={cilAddressBook} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Kullanıcı Listesi",
    to: "/userlist",
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Kullanıcı Sözleşmeleri",
    to: "/userContract",
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: "Site Yonetimi",
  },
  {
    component: CNavItem,
    name: "Bize Ulaşın",
    to: "/contactForm",
    icon: <CIcon icon={cilContact} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Popüler Ürünler",
    to: "/popularProduct",
    icon: <CIcon icon={cilHandPointUp} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Ürünler",
    to: "/product",
    icon: <CIcon icon={cilInbox} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Blog",
    to: "/blog",
    icon: <CIcon icon={cil3d} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: "FAQ",
    to: "/faq",
    icon: <CIcon icon={cilBookmark} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Footer",
    to: "/footer",
    icon: <CIcon icon={cilActionRedo} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: "Kategoriler",
    to: "/categories",
    icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: "Markalar",
    to: "/brand",
    icon: <CIcon icon={cilLibraryBuilding} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Menü Ana Başlıkları",
    to: "/menuItem",
    icon: <CIcon icon={cilCarAlt} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Öne Çıkan Kategoriler",
    to: "/featuredCategories",
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: "Slider",
    to: "/slider",
    icon: <CIcon icon={cilSchool} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: "Ürün Yonetimi",
  },
  {
    component: CNavItem,
    name: "Depo - Kanal Yönetimi",
    to: "/warehouseconnection",
    icon: <CIcon icon={cilHouse} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Depo Yönetimi",
    to: "/warehouse",
    icon: <CIcon icon={cilAirplaneModeOff} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Fiyatlar",
    to: "/price",
    icon: <CIcon icon={cilDollar} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Kanallar",
    to: "/channel",
    icon: <CIcon icon={cilChatBubble} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Özellikler",
    to: "/feature",
    icon: <CIcon icon={cilFeaturedPlaylist} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Sözleşmeler",
    to: "/contract",
    icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
  },

  // {
  //   component: CNavTitle,
  //   name: "Components",
  // },
  // {
  //   component: CNavGroup,
  //   name: "Base",
  //   to: "/base",
  //   icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: "Accordion",
  //       to: "/base/accordion",
  //     },
  //     {
  //       component: CNavItem,
  //       name: "Breadcrumb",
  //       to: "/base/breadcrumbs",
  //     },
  //     {
  //       component: CNavItem,
  //       name: "Cards",
  //       to: "/base/cards",
  //     },
  //     {
  //       component: CNavItem,
  //       name: "Carousel",
  //       to: "/base/carousels",
  //     },
  //     {
  //       component: CNavItem,
  //       name: "Collapse",
  //       to: "/base/collapses",
  //     },
  //     {
  //       component: CNavItem,
  //       name: "List group",
  //       to: "/base/list-groups",
  //     },
  //     {
  //       component: CNavItem,
  //       name: "Navs & Tabs",
  //       to: "/base/navs",
  //     },
  //     {
  //       component: CNavItem,
  //       name: "Pagination",
  //       to: "/base/paginations",
  //     },
  //     {
  //       component: CNavItem,
  //       name: "Placeholders",
  //       to: "/base/placeholders",
  //     },
  //     {
  //       component: CNavItem,
  //       name: "Popovers",
  //       to: "/base/popovers",
  //     },
  //     {
  //       component: CNavItem,
  //       name: "Progress",
  //       to: "/base/progress",
  //     },
  //     {
  //       component: CNavItem,
  //       name: "Spinners",
  //       to: "/base/spinners",
  //     },
  //     {
  //       component: CNavItem,
  //       name: "Tables",
  //       to: "/base/tables",
  //     },
  //     {
  //       component: CNavItem,
  //       name: "Tabs",
  //       to: "/base/tabs",
  //     },
  //     {
  //       component: CNavItem,
  //       name: "Tooltips",
  //       to: "/base/tooltips",
  //     },
  //   ],
  // },
  // {
  //   component: CNavGroup,
  //   name: "Buttons",
  //   to: "/buttons",
  //   icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: "Buttons",
  //       to: "/buttons/buttons",
  //     },
  //     {
  //       component: CNavItem,
  //       name: "Buttons groups",
  //       to: "/buttons/button-groups",
  //     },
  //     {
  //       component: CNavItem,
  //       name: "Dropdowns",
  //       to: "/buttons/dropdowns",
  //     },
  //   ],
  // },
  // {
  //   component: CNavGroup,
  //   name: "Forms",
  //   icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: "Form Control",
  //       to: "/forms/form-control",
  //     },
  //     {
  //       component: CNavItem,
  //       name: "Select",
  //       to: "/forms/select",
  //     },
  //     {
  //       component: CNavItem,
  //       name: "Checks & Radios",
  //       to: "/forms/checks-radios",
  //     },
  //     {
  //       component: CNavItem,
  //       name: "Range",
  //       to: "/forms/range",
  //     },
  //     {
  //       component: CNavItem,
  //       name: "Input Group",
  //       to: "/forms/input-group",
  //     },
  //     {
  //       component: CNavItem,
  //       name: "Floating Labels",
  //       to: "/forms/floating-labels",
  //     },
  //     {
  //       component: CNavItem,
  //       name: "Layout",
  //       to: "/forms/layout",
  //     },
  //     {
  //       component: CNavItem,
  //       name: "Validation",
  //       to: "/forms/validation",
  //     },
  //   ],
  // },
  // {
  //   component: CNavItem,
  //   name: "Charts",
  //   to: "/charts",
  //   icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavGroup,
  //   name: "Icons",
  //   icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: "CoreUI Free",
  //       to: "/icons/coreui-icons",
  //       badge: {
  //         color: "success",
  //         text: "NEW",
  //       },
  //     },
  //     {
  //       component: CNavItem,
  //       name: "CoreUI Flags",
  //       to: "/icons/flags",
  //     },
  //     {
  //       component: CNavItem,
  //       name: "CoreUI Brands",
  //       to: "/icons/brands",
  //     },
  //   ],
  // },
  // {
  //   component: CNavGroup,
  //   name: "Notifications",
  //   icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: "Alerts",
  //       to: "/notifications/alerts",
  //     },
  //     {
  //       component: CNavItem,
  //       name: "Badges",
  //       to: "/notifications/badges",
  //     },
  //     {
  //       component: CNavItem,
  //       name: "Modal",
  //       to: "/notifications/modals",
  //     },
  //     {
  //       component: CNavItem,
  //       name: "Toasts",
  //       to: "/notifications/toasts",
  //     },
  //   ],
  // },
  // {
  //   component: CNavItem,
  //   name: "Widgets",
  //   to: "/widgets",
  //   icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
  //   badge: {
  //     color: "info",
  //     text: "NEW",
  //   },
  // },
  // {
  //   component: CNavTitle,
  //   name: "Extras",
  // },
  // {
  //   component: CNavGroup,
  //   name: "Pages",
  //   icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: "Login",
  //       to: "/login",
  //     },
  //     {
  //       component: CNavItem,
  //       name: "Register",
  //       to: "/register",
  //     },
  //     {
  //       component: CNavItem,
  //       name: "Error 404",
  //       to: "/404",
  //     },
  //     {
  //       component: CNavItem,
  //       name: "Error 500",
  //       to: "/500",
  //     },
  //   ],
  // },
  // {
  //   component: CNavItem,
  //   name: "Docs",
  //   href: "https://coreui.io/react/docs/templates/installation/",
  //   icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  // },
];

export default _nav;
