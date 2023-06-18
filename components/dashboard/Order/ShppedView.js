import { Button } from "primereact/button";
import { Fieldset } from "primereact/fieldset";
import React, { useEffect, useState } from "react";
import { SelectButton } from "primereact/selectbutton";
import { ProgressBar } from "primereact/progressbar";

const ShippingView = ({ shippingInfo, handleOrderUpdate, isLoading }) => {
  const {
    isPaid,
    setIsPaid,
    deliveryStatus,
    setDeliveryStatus,
    status,
    setStatus,
    paymentStatus,
    setPaymentStatus,
  } = shippingInfo;

  const legendTemplate = (
    <div className="flex align-items-center text-primary">
      <span className="pi pi-car mr-2"></span>
      <span className="font-bold text-lg"> Shipping Information </span>
    </div>
  );

  const paidOptions = ["false", "true"];
  const deliveryOptions = ["Pending", "Delivered"];
  const statusOptions = [
    "Not Processed",
    "Processing",
    "Completed",
    "Cancelled",
  ];
  const paymentOptions = ["Not Verified", "Verified"];

  return (
    <Fieldset legend={legendTemplate}>
      <>
        <div className="flex justify-content-between align-items-center ">
          <div>
            <h5> PAID</h5>
            <div className="flex justify-content-between align-items-center pt-0 p-1 custom-style ">
              <SelectButton
                value={JSON.stringify(isPaid)}
                onChange={(e) => setIsPaid(JSON.parse(e.value))}
                // disabled ={isPaid === "true" || isPaid === true}
                options={paidOptions}
                className="p-invalid"
              />
            </div>
          </div>
          <div>
            <h5> Delivered Status </h5>

            <div className=" flex justify-content-between align-items-center pt-0 p-1 custom-style  ">
              <SelectButton
                value={deliveryStatus}
                onChange={(e) => setDeliveryStatus(e.value)}
                options={deliveryOptions}
                className="p-invalid"
              />
            </div>
          </div>
        </div>

        <h5> Payment Status </h5>
        <div className=" flex justify-content-between align-items-center pt-0 p-1 custom-style ">
          <SelectButton
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.value)}
            options={paymentOptions}
            className="p-invalid"
          />
        </div>

        <h5> Order Status </h5>
        <div className="flex justify-content-between align-items-center pt-0 p-1 custom-style ">
          <SelectButton
            value={status}
            onChange={(e) => setStatus(e.value)}
            options={statusOptions}
            className="p-invalid"
          />
        </div>

        {isLoading && (
          <ProgressBar
            mode="indeterminate"
            className="mt-5"
            style={{ height: "6px", width: "200px", margin: "0px auto" }}
          />
        )}

        <Button
          onClick={handleOrderUpdate}
          label="Update Shipping "
          severity="success"
          raised
          className="mt-5"
        />
      </>
    </Fieldset>
  );
};

export default ShippingView;
