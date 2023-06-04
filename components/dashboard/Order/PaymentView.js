import React from "react";

const PaymentView = ({ item }) => {
  return (
    <div>
      {item.paymentMethod && <p> PaymentMethod: {item.paymentMethod} </p>}
      {item.transactionId && <p> transactionId: {item.transactionId} </p>}
      {item.transactionPhoneNo && (
        <p> transactionPhoneNo: {item.transactionPhoneNo} </p>
      )}
    </div>
  );
};

export default PaymentView;
