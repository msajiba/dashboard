import React from "react";
import AppMenuitem from "./AppMenuitem";

import { MenuProvider } from "./context/menucontext";

const AppMenu = () => {
  const model = [
    //====================> NEED_LEFT_MENU_START <=======================//
    {
      label: "Home",
      items: [
        { label: "Dashboard", icon: "pi pi-fw pi-home", to: "/dashboard" },
        {
          label: "Products",
          icon: "pi pi-list ",
          to: "/dashboard/product",
        },
        {
          label: "Categories",
          icon: "pi pi-sitemap",
          to: "/dashboard/categories",
        },
        {
          label: "Sub Categories",
          icon: "pi pi-sitemap",
          to: "/dashboard/sub-categories",
        },
        {
          label: "Blogs",
          icon: "pi pi-table",
          to: "/dashboard/blogs",
        },
        {
          label: "Sub Blogs ",
          icon: "pi pi-sitemap",
          to: "/dashboard/sub-blogs",
        },
        {
          label: "Orders",
          icon: "pi pi-shopping-cart",
          to: "/dashboard/orders",
        },
        {
          label: "Profile",
          icon: "pi pi-users",
          to: "/dashboard/profile",
        },
        {
          label: "Users",
          icon: "pi pi-user",
          to: "/dashboard/users",
        },
      ],
    },
    {
      label: "Extra",
      items: [
        {
          label: "SiteInfo",
          icon: "pi pi-info",
          to: "/dashboard/siteinfo",
        },
        {
          label: "Slider",
          icon: "pi pi-arrow-right-arrow-left",
          to: "/dashboard/slider",
        },
      ],
    },

    //====================> NEED_LEFT_MENU_END <=======================//
  ];

  return (
    <MenuProvider>
      <ul className="layout-menu">
        {model.map((item, i) => {
          return !item.seperator ? (
            <AppMenuitem item={item} root={true} index={i} key={item.label} />
          ) : (
            <li className="menu-separator"></li>
          );
        })}

        {/* ADD_EXTRA_FEATUCHER_HERE */}
      </ul>
    </MenuProvider>
  );
};

export default AppMenu;
