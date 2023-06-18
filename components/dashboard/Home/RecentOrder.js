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
    ["od", orders],
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
    refetch();
    setOrders(data?.data?.order);
  }, [data?.data]);

  console.log('')


  isLoading && <Loader />;

  error && conosle.log(error);
  return (
    <div className="col-12 xl:col-6">
      <div className="card">
        <h5>Recent Orders</h5>
        <DataTable value={orders} rows={5} paginator responsiveLayout="scroll">
          <Column
            field="email"
            header="Email"
            body={(res) => <span> {res.email} </span>}
            sortable
            style={{ width: "35%" }}
          />
          <Column
            field="phone"
            header="Phone Number"
            body={(res) => <span> {res.phone} </span>}
            sortable
            style={{ width: "35%" }}
          />
          <Column
            field="total"
            header="Total Amount"
            sortable
            style={{ width: "35%" }}
            body={(data) => formatCurrency(parseFloat(data.total))}
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
    </div>
  );
};

export default RecentOrder;
