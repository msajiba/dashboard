import React from "react";

const AddressView = ({ item }) => {
  return (
    <div>
      {item.name && <p> Name: {item.name} </p>}
      {item.email && <p> Email: {item.email} </p>}
      {item.phone && <p> Phone: {item.phone} </p>}
      {item.address && <p> Address: {item.address} </p>}
      {item.city && <p> City: {item.city} </p>}
      {item.country && <p> Country: {item.country} </p>}
    </div>
  );
};

export default AddressView;
