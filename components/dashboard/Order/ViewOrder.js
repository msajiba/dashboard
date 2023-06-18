import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import AddressView from "./AddressView";
import ProductView from "./ProductView";
import PaymentView from "./PaymentView";
import ShippingView from "./ShppedView";
import axios from "axios";
import { mainAPI } from "../../../uitls/api";
import { Toast } from "primereact/toast";

const ROOT = mainAPI;

const ViewOrder = ({ rowData, refetch }) => {
  const jwt = useSelector((state) => state.user.jwt);
  const user = useSelector((state) => state.user.currentUser);
  const toast = useRef(null);

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
  const [paymentStatus, setPaymentStatus] = useState("");
  const [total, setTotal] = useState("");
  const [shippingCost, setShippingCost] = useState("");
  const [status, setStatus] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [subtotal, setSubtotal] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const confirmViewOrder = (order) => {
    const {
      products,
      name,
      email,
      address,
      city,
      country,
      shipping_cost,
      payment_method,
      delivery_status,
      phone,
      post_code,
      status,
      total,
      transaction_id,
      transaction_phone_no,
      createdAt,
      isPaid,
      payment_status,
      _id,
      order_notes,
      subtotal,
    } = order;

    setOrderDialog(true);
    setSelectedId(_id);
    setOrderNotes(order_notes);
    setSubtotal(subtotal);
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
    setStatus(status);
    setShippingCost(shipping_cost);
    setDeliveryStatus(delivery_status);
    setPaymentStatus(payment_status);
  };

  const shippingInfo = {
    isPaid,
    setIsPaid,
    deliveryStatus,
    setDeliveryStatus,
    status,
    setStatus,
    paymentStatus,
    setPaymentStatus,
  };

  const userInfo = {
    name,
    email,
    address,
    city,
    country,
    phone,
    postCode,
  };

  const paymentInfo = {
    paymentMethod,
    transactionId,
    date,
    transactionPhoneNo,
    shippingCost,
    total,
  };

  const orderUpdateInfo = {
    id: selectedId,
    products,
    name,
    email,
    phone,
    address,
    city,
    post_code: postCode,
    country,
    shipping_cost: shippingCost,
    payment_method: paymentMethod,
    transaction_phone_no: transactionPhoneNo,
    transaction_id: transactionId,
    total,
    status,
    subtotal,
    payment_status: paymentStatus,
    delivery_status: deliveryStatus,
    order_notes: orderNotes,
    isPaid,
    user_id_no: user._id,
  };

  const handleOrderUpdate = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        `${ROOT}/api/admin/order/update`,
        orderUpdateInfo,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            token: `Bearer ${jwt}`,
          },
        }
      );

      if (data.status === true) {
        toast.current.show({
          severity: "success",
          detail: `${data.message}`,
          life: 3000,
        });
        refetch();
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
    setOrderDialog(false);
  };

  return (
    <>
      <Toast ref={toast} />
      <Button
        icon="pi pi-pencil"
        severity="success"
        rounded
        className="mr-2"
        onClick={() => confirmViewOrder(rowData)}
      />

      <Dialog
        visible={orderDialog}
        style={{ width: "1000px" }}
        header="Order Information"
        modal
        className="p-fluid"
        onHide={() => setOrderDialog(false)}
      >
        <div className="grid">
          <div className="col-12 lg:col-6">
            <PaymentView paymentInfo={paymentInfo} />
          </div>
          <div className="col-12 lg:col-6">
            <AddressView userInfo={userInfo} />
          </div>
          <div className="col-12 lg:col-6">
            <ProductView pd={products} />
          </div>
          <div className="col-12 lg:col-6">
            <ShippingView
              handleOrderUpdate={handleOrderUpdate}
              shippingInfo={shippingInfo}
              isLoading={isLoading}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default ViewOrder;
