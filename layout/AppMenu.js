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
          icon: "pi pi-fw pi-briefcase",
          to: "/dashboard/product",
        },
        {
          label: "Categories",
          icon: "pi pi-fw pi-briefcase",
          to: "/dashboard/categories",
        },
        {
          label: "Sub Categories",
          icon: "pi pi-fw pi-briefcase",
          to: "/dashboard/sub-categories",
        },
        {
          label: "Blogs",
          icon: "pi pi-fw pi-briefcase",
          to: "/dashboard/blogs",
        },
        {
          label: "Sub Blogs ",
          icon: "pi pi-fw pi-briefcase",
          to: "/dashboard/sub-blogs",
        },
        {
          label: "Orders",
          icon: "pi pi-fw pi-briefcase",
          to: "/dashboard/orders",
        },
        {
          label: "Profile",
          icon: "pi pi-fw pi-briefcase",
          to: "/dashboard/profile",
        },
        {
          label: "Users",
          icon: "pi pi-fw pi-briefcase",
          to: "/dashboard/users",
        },
      ],
    },
    {
      label: "Extra",
      items: [
        {
          label: "SiteInfo",
          icon: "pi pi-fw pi-briefcase",
          to: "/dashboard/siteinfo",
        },
        {
          label: "Banner",
          icon: "pi pi-fw pi-briefcase",
          to: "/dashboard/banner",
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
