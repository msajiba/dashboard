/* eslint-disable */
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const index = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard");
  }, [router]);
  return (
    <div>
      <h3> Wellcome to Home page</h3>
    </div>
  );
};

export default index;
