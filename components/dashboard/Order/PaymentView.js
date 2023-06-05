import React from "react";

const PaymentView = ({ item }) => {
  const aa = true;
  return (
    <div>
      {item.paymentMethod && <p> Payment Method: {item.paymentMethod} </p>}
      {item.transactionId && <p> Transaction ID: {item.transactionId} </p>}
      {item.transactionPhoneNo && (
        <p> Transaction Phone No: {item.transactionPhoneNo} </p>
      )}
      {item.isPaid ===false && aa ? <p> PAID: TRUE</p> : <p> PAID: FALSE </p>}
    </div>
  );
};

export default PaymentView;
