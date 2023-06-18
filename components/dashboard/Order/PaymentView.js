import React from "react";
import { Fieldset } from "primereact/fieldset";
import { Button } from "primereact/button";
import { formatCurrency } from "../../Shared/FormatCurrency";

const PaymentView = ({ paymentInfo }) => {
  const {
    paymentMethod,
    transactionId,
    transactionPhoneNo,
    shippingCost,
    total,
    date,
  } = paymentInfo;

  const legendTemplate = (
    <div className="flex align-items-center text-primary">
      <span className="pi pi-money-bill mr-2"></span>
      <span className="font-bold text-lg"> Payment Information </span>
    </div>
  );

  return (
    <Fieldset legend={legendTemplate}>
      <div className="flex">
        <p>
          Payment Method
          <Button label={paymentMethod} severity="success" text disabled />
        </p>
        {transactionId && (
          <p>
            transaction_id
            <Button label={transactionId} severity="success" text disabled />
          </p>
        )}
      </div>
      {transactionPhoneNo && (
        <p className="mb-0">
          Transaction Number :
          <span style={{ color: "red" }}> {transactionPhoneNo}</span>
        </p>
      )}
      <p className="mb-0">
        Shipping Cost :<span style={{ color: "red" }}> {formatCurrency(parseInt(shippingCost))} </span>
      </p>
      <p className="mb-0">
        Total Amount : <span style={{ color: "red" }}> {formatCurrency(parseFloat(total))} </span> 
      </p>
      <p className="mb-0">
        Date: <span style={{ color: "red" }}> {date}</span>
      </p>
    </Fieldset>
  );
};

export default PaymentView;
