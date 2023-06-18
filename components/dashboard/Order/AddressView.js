import React from "react";
import { Fieldset } from "primereact/fieldset";
import { Button } from "primereact/button";

const AddressView = ({ userInfo }) => {
  const { name, email, address, city, country, phone, postCode } = userInfo;
  const legendTemplate = (
    <div className="flex align-items-center text-primary">
      <span className="pi pi-user mr-2"></span>
      <span className="font-bold text-lg"> {name} </span>
    </div>
  );

  return (
    <Fieldset legend={legendTemplate}>
      <div className="flex" style={{ fontSize: "100px" }}>
        <Button label={phone} severity="success" text disabled />
        <Button label={email} severity="success" text disabled />
      </div>
      <p className="mb-0">
        Address: <span style={{ color: "green" }}> {address}</span>
      </p>
      <p className="mb-0">
        City: <span style={{ color: "green" }}> {city}</span>
      </p>
      <p className="mb-0">
        Post Code: <span style={{ color: "green" }}> {postCode}</span>
      </p>
      <p className="">
        Country : <span style={{ color: "green" }}> {country}</span>
      </p>
    </Fieldset>
  );
};

export default AddressView;
