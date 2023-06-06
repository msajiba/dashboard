/* eslint-disable */
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { ProgressSpinner } from "primereact/progressspinner";

const index = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard");
  }, [router]);
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ProgressSpinner />
    </div>
  );
};

export default index;
