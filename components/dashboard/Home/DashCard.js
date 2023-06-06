import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const DashCard = () => {
  const jwt = useSelector((state) => state.user.jwt);
  const [orders, setOrders] = useState(null);
  const [products, setProducts] = useState(null);
  const [users, setUsers] = useState(null);
  const [totalSale, setTotalSale] = useState(null);

  const getOrders = async () => {
    const { data } = await axios.get(
      "http://localhost:3000/api/admin/order/getAll",
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          token: `Bearer ${jwt}`,
        },
      }
    );
    setOrders(data.order);
  };

  const getUsers = async () => {
    const { data } = await axios.get(
      "http://localhost:3000/api/admin/user/getAll",
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          token: `Bearer ${jwt}`,
        },
      }
    );
    setUsers(data);
  };

  const getProducts = async () => {
    const { data } = await axios.get(
      "http://localhost:3000/api/admin/product/getAll"
    );
    setProducts(data.products);
  };

  // const result = orders.reduce(od, 0)

  useEffect(() => {
    getOrders();
    getProducts();
    getUsers();
  }, []);

  return (
    <>
      {/* =====================ORDER====================== */}

      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3">Orders</span>
              <div className="text-900 font-medium text-xl">
                {" "}
                {orders?.length}{" "}
              </div>
            </div>
            <div
              className="flex align-items-center justify-content-center bg-blue-100 border-round"
              style={{ width: "2.5rem", height: "2.5rem" }}
            >
              <i className="pi pi-shopping-cart text-blue-500 text-xl" />
            </div>
          </div>
          <span className="text-green-500 font-medium">24 new </span>
          <span className="text-500">since last visit</span>
        </div>
      </div>

      {/* =====================ORDER====================== */}

      {/* =====================PRODUCT====================== */}

      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3">Revenue</span>
              <div className="text-900 font-medium text-xl">$2.100</div>
            </div>
            <div
              className="flex align-items-center justify-content-center bg-orange-100 border-round"
              style={{ width: "2.5rem", height: "2.5rem" }}
            >
              <i className="pi pi-map-marker text-orange-500 text-xl" />
            </div>
          </div>
          <span className="text-green-500 font-medium">%52+ </span>
          <span className="text-500">since last week</span>
        </div>
      </div>

      {/* =====================PRODUCT====================== */}

      {/* =====================USER====================== */}

      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3">Customers</span>
              <div className="text-900 font-medium text-xl">{users.length}</div>
            </div>
            <div
              className="flex align-items-center justify-content-center bg-cyan-100 border-round"
              style={{ width: "2.5rem", height: "2.5rem" }}
            >
              <i className="pi pi-user text-cyan-500 text-xl" />
            </div>
          </div>
          <span className="text-green-500 font-medium">520 </span>
          <span className="text-500">newly registered</span>
        </div>
      </div>

      {/* =====================USER====================== */}

      {/* =====================TOTAL SALE====================== */}
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3">Products</span>
              <div className="text-900 font-medium text-xl">
                {" "}
                {products?.length}{" "}
              </div>
            </div>
            <div
              className="flex align-items-center justify-content-center bg-purple-100 border-round"
              style={{ width: "2.5rem", height: "2.5rem" }}
            >
              <i className="pi pi-comment text-purple-500 text-xl" />
            </div>
          </div>
          <span className="text-green-500 font-medium">85 </span>
          <span className="text-500">responded</span>
        </div>
      </div>

      {/* =====================TOTAL SALE====================== */}
    </>
  );
};

export default DashCard;
