import React from "react";
import { ProgressSpinner } from "primereact/progressspinner";

const Loader = () => {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <ProgressSpinner style={{width: '50px', height: '50px'}} />
    </div>
  );
};

export default Loader;
