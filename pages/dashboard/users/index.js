import React from "react";
import DashboardContainer from "../../../layout/DashboardContainer";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

const Users = () => {
  const user = useSelector((state) => state.user.currentUser);
  const router = useRouter();
  
  if (!user) {
    router.push("/auth/login");
    return null;
  }

  return (
    <DashboardContainer>
      <div>
        <h3> Users page</h3>
      </div>
    </DashboardContainer>
  );
};

export default Users;
