/* eslint-disable */
import React, { useRef } from "react";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { Toast } from "primereact/toast";
import { useRouter } from "next/router";
import { logout } from "../../store/userSlice";
import { useDispatch, useSelector } from "react-redux";

const TopUserShow = () => {
  const user = useSelector((state) => state.user.currentUser);
  const menuLeft = useRef(null);
  const toast = useRef(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const items = [
    {
      items: [
        {
          label: user?.name,
          icon: "pi pi-user",
        },
        {
          label: "Profile",
          icon: "pi pi-spin pi-cog",
          command: () => router.push("/dashboard/profile/"),
        },
        {
          label: "Sign Out",
          icon: "pi pi-sign-out",
          command: () => {
            dispatch(logout());
          },
        },
      ],
    },
  ];

  return (
    <div>
      <div className="flex justify-content-center">
        <Toast ref={toast}></Toast>
        <Menu model={items} popup ref={menuLeft} id="popup_menu_left" />
        <Button
          icon="pi pi-user"
          className="mr-2"
          text
          onClick={(event) => menuLeft.current.toggle(event)}
          aria-controls="popup_menu_left"
          aria-haspopup
        />
      </div>
    </div>
  );
};

export default TopUserShow;
