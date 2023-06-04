import React from "react";

const ShppedView = ({ item }) => {
  return (
    <>
      {item.deliveryStatus && <p> Delivery Status: {item.deliveryStatus} </p>}
      {item.total && <p> Total Amount: {item.total} </p>}
      {item.shippingCost && <p> Shipping cost: {item.shippingCost} </p>}
      {item.status && <p> Status: {item.status} </p>}
    </>
  );
};

export default ShppedView;
