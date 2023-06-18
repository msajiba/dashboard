/* eslint-disable @next/next/no-img-element */
import axios from "axios";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { mainAPI } from "../../../uitls/api";
import { useSelector } from "react-redux";
import Loader from "../../Shared/Loader";
import BestSelling from "./BestSelling";

const ROOT = mainAPI;

const RecentOrder = () => {
  const [orders, setOrders] = useState(null);

  const jwt = useSelector((state) => state.user.jwt);

  const formatCurrency = (value) => {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "BDT",
    });
  };

  const { isLoading, error, data, refetch } = useQuery(
    "category",
    async () =>
      await axios.get(`${ROOT}/api/admin/order/latest5`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          token: `Bearer ${jwt}`,
        },
      })
  );

  useEffect(() => {
    setOrders(data?.data?.order);
    refetch();
  }, [data?.data]);

  console.log("orders", orders)

  isLoading && <Loader />;

  return (
    <div className="col-12 xl:col-6">
      <div className="card">
        <h5>Recent Orders</h5>
        <DataTable value={orders} rows={5} paginator responsiveLayout="scroll">
          <Column
            header="Image"
            body={(data) => (
              <img
                className="shadow-2"
                src={`${data.image}`}
                alt={data.image}
                width="50"
              />
            )}
          />
          <Column
            field="subtotal"
            header="Subtotal"
            body={(data) => <span> { data && data.country} </span>}
            sortable
            style={{ width: "35%" }}
          />
          <Column
            field="price"
            header="Price"
            sortable
            style={{ width: "35%" }}
            body={(data) => formatCurrency(parseFloat(data.price))}
          />
          <Column
            header="View"
            style={{ width: "15%" }}
            body={() => (
              <>
                <Button icon="pi pi-search" type="button" text />
              </>
            )}
          />
        </DataTable>
      </div>

      {/* <BestSelling /> */}
    </div>
  );
};

export default RecentOrder;
