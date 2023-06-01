/* eslint-disable */
import React from "react";
import DashboardContainer from "../../layout/DashboardContainer";
import Dashboard from "../../components/dashboard";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

const index = () => {
  const user = useSelector((state) => state.user.currentUser);

  const router = useRouter();

  if (!user) {
    router.push("/auth/login");
    return null;
  }
  return (
    <>
      <DashboardContainer>
        <Dashboard />
      </DashboardContainer>
    </>
  );
};

export default index;
