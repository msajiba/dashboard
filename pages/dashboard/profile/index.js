import React from "react";
import DashboardContainer from "../../../layout/DashboardContainer";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const Profile = () => {
  const user = useSelector((state) => state.user.currentUser);
  const router = useRouter();
  
  if (!user) {
    router.push("/auth/login");
    return null;
  }

  return (
    <DashboardContainer>
      <div>
        <h3> Profile page...</h3>
      </div>
    </DashboardContainer>
  );
};

export default Profile;
