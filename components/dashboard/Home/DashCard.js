import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { mainAPI } from "../../../uitls/api";
import { formatCurrency } from "../../Shared/FormatCurrency";

const ROOT = mainAPI;

const DashCard = () => {
  const jwt = useSelector((state) => state.user.jwt);
  const [orders, setOrders] = useState(null);
  const [products, setProducts] = useState(null);
  const [users, setUsers] = useState(null);

  const getOrders = async () => {
    const { data } = await axios.get(`${ROOT}/api/admin/order/getAll`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        token: `Bearer ${jwt}`,
      },
    });
    setOrders(data.order);
  };

  const getUsers = async () => {
    const { data } = await axios.get(`${ROOT}/api/admin/user/getAll`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        token: `Bearer ${jwt}`,
      },
    });
    setUsers(data);
  };

  const getProducts = async () => {
    const { data } = await axios.get(`${ROOT}/api/admin/product/getAll`);
    setProducts(data.products);
  };

  const subTotal = useMemo(() => {
    return orders?.reduce((sum, val) => sum + parseFloat(val.total), 0);
  }, [orders]);

  useEffect(() => {
    getOrders();
  }, [jwt]);

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    getUsers();
  }, [jwt]);

  return (
    <>
      {/* =====================ORDER====================== */}

      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3">Orders</span>
              <div className="text-900 font-medium text-xl">
                
                {orders?.length}
              </div>
            </div>
            <div
              className="flex align-items-center justify-content-center bg-blue-100 border-round"
              style={{ width: "2.5rem", height: "2.5rem" }}
            >
              <i className="pi pi-shopping-cart text-blue-500 text-xl" />
            </div>
          </div>
          <span className="text-500">Total payment</span>
          <span className="text-green-500 font-medium"> {formatCurrency(parseInt(subTotal))} </span>
        </div>
      </div>

      {/* =====================ORDER====================== */}

      {/* =====================Revenue====================== */}
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3">Revenue</span>
              <div className="text-900 font-medium text-xl">
                <div className="text-900 font-medium text-xl">
                  {formatCurrency(parseInt(subTotal))}
                </div>
              </div>
            </div>
            <div
              className="flex align-items-center justify-content-center bg-cyan-100 border-round"
              style={{ width: "2.5rem", height: "2.5rem" }}
            >
              <i className="pi pi-money-bill text-cyan-500 text-xl" />
            </div>
          </div>
          <span className="text-green-500 font-medium">  {orders?.length} </span>
          <span className="text-500">Total Order</span>
        </div>
      </div>

      {/* =====================Revenue====================== */}

      {/* =====================USER====================== */}

      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3">Customers</span>
              <div className="text-900 font-medium text-xl">
                {users?.length}
              </div>
            </div>
            <div
              className="flex align-items-center justify-content-center bg-cyan-100 border-round"
              style={{ width: "2.5rem", height: "2.5rem" }}
            >
              <i className="pi pi-user text-cyan-500 text-xl" />
            </div>
          </div>
          <span className="text-green-500 font-medium"> 00 </span>
          <span className="text-500">newly registered</span>
        </div>
      </div>

      {/* =====================USER====================== */}

      {/* =====================TOTAL PRODUCTS====================== */}
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3">Products</span>
              <div className="text-900 font-medium text-xl">
                {products?.length}
              </div>
            </div>
            <div
              className="flex align-items-center justify-content-center bg-purple-100 border-round"
              style={{ width: "2.5rem", height: "2.5rem" }}
            >
              <i className="pi pi-list text-purple-500 text-xl" />
            </div>
          </div>
          <span className="text-green-500 font-medium"> {orders?.length}  </span>
          <span className="text-500">Responded Order</span>
        </div>
      </div>

      {/* =====================TOTAL PRODUCTS====================== */}
    </>
  );
};

export default DashCard;
