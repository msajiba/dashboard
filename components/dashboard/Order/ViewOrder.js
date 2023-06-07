import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Timeline } from "primereact/timeline";
import { Card } from "primereact/card";
// import "./TimelineDemo.css";
import { Accordion, AccordionTab } from "primereact/accordion";
import AddressView from "./AddressView";
import ProductView from "./ProductView";
import PaymentView from "./PaymentView";
import ShppedView from "./ShppedView";

const ViewOrder = ({ rowData, refetch }) => {
  const jwt = useSelector((state) => state.user.jwt);
  const [orderDialog, setOrderDialog] = useState(false);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [postCode, setPostCode] = useState("");

  const [date, setDate] = useState("");
  const [products, setProducts] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [transactionPhoneNo, setTransactionPhoneNO] = useState("");
  const [isPaid, setIsPaid] = useState("");

  const [deliveryStatus, setDeliveryStatus] = useState("");
  const [total, setTotal] = useState("");
  const [shippingCost, setShippingCost] = useState("");
  const [status, settStatus] = useState("");

  const confirmViewOrder = (order) => {
    const {
      name,
      email,
      address,
      city,
      country,
      delivery_status,
      payment_method,
      phone,
      post_code,
      products,
      shipping_cost,
      status,
      total,
      transaction_id,
      transaction_phone_no,
      createdAt,
      isPaid,
    } = order;

    setOrderDialog(true);

    setAddress(address);
    setCity(city);
    setDate(createdAt.substring(0, 10));
    setName(name);
    setEmail(email);
    setPhone(phone);
    setCountry(country);
    setPostCode(post_code);

    setProducts(products);

    setPaymentMethod(payment_method);
    setTransactionId(transaction_id);
    setTransactionPhoneNO(transaction_phone_no);
    setIsPaid(isPaid);

    setTotal(total);
    settStatus(status);
    setShippingCost(shipping_cost);
    setDeliveryStatus(delivery_status);
  };

  const events = [
    {
      status: "Product",
      date,
      icon: "pi pi-shopping-cart",
      color: "#9C27B0",
      image: "game-controller.jpg",
      products,
    },
    {
      status: "Address",
      icon: "pi pi-check",
      color: "#607D8B",
      address,
      city,
      name,
      email,
      phone,
      country,
    },
    {
      status: "Payment",
      icon: "pi pi-cog",
      color: "#673AB7",
      paymentMethod,
      transactionId,
      transactionPhoneNo,
      isPaid,
    },
    {
      status: "Shipped",
      icon: "pi pi-shopping-cart",
      color: "#FF9800",
      deliveryStatus,
      total,
      shippingCost,
    },
  ];

  const customizedMarker = (item) => {
    return (
      <span
        className="flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1 shadow-1"
        style={{ backgroundColor: item.color }}
      >
        <i className={item.icon}></i>
      </span>
    );
  };

  const customizedContent = (item) => {
    return (
      <Card title={item.status} subTitle={item.date}>
        <ProductView item={item} />
        <AddressView item={item} />
        <PaymentView item={item} />
        <ShppedView item={item} />
      </Card>
    );
  };

  return (
    <>
      <Button
        icon="pi pi-eye"
        severity="success"
        rounded
        className="mr-2"
        onClick={() => confirmViewOrder(rowData)}
      />

      <Dialog
        visible={orderDialog}
        style={{ width: "800px" }}
        header="Order Information"
        modal
        className="p-fluid"
        onHide={() => setOrderDialog(false)}
      >
        <div className="card">
          <Timeline
            value={events}
            align="alternate"
            className="customized-timeline"
            marker={customizedMarker}
            content={customizedContent}
          />
        </div>
      </Dialog>
    </>
  );
};

export default ViewOrder;
