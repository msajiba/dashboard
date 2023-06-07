/*eslint-disable */
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Toolbar } from "primereact/toolbar";
import React, { useEffect, useRef, useState } from "react";
import DashboardContainer from "../../../layout/DashboardContainer";
import { useQuery } from "react-query";
import axios from "axios";
import { Badge } from "primereact/badge";
import Loader from "../../../components/Shared/Loader";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import DeleteOrder from "../../../components/dashboard/Order/DeleteOrder";
import ViewOrder from "../../../components/dashboard/Order/ViewOrder";

const Order = () => {
  const jwt = useSelector((state) => state.user.jwt);
  const user = useSelector((state) => state.user.currentUser);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [orders, setOrders] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const dt = useRef(null);

  const router = useRouter();

  if (!user) {
    router.push("/auth/login");
    return null;
  }

  const { isLoading, error, data, refetch } = useQuery(
    "category",
    async () =>
      await axios.get(
        "https://front-end-msajiba.vercel.app/api/admin/order/getAll",
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            token: `Bearer ${jwt}`,
          },
        }
      )
  );

  useEffect(() => {
    setOrders(data?.data?.order);
    refetch();
  }, [data?.data?.order]);
  
  isLoading && <Loader />;
  error && console.log(error);

  const codeBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Code</span>
        {rowData._id}
      </>
    );
  };

  const nameBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Email</span>
        {rowData.name}
      </>
    );
  };

  const emailBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Email</span>
        {rowData.email}
      </>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <ViewOrder rowData={rowData} refetch={refetch} />
        <DeleteOrder rowData={rowData} refetch={refetch} />
      </>
    );
  };

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">
        ORDERS -
        <Badge
          className="ml-2"
          value={orders?.length}
          size="small"
          severity="success"
        />
      </h5>
      <span className="block mt-2 md:mt-0 p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
        />
      </span>
    </div>
  );

  return (
    <DashboardContainer>
      {orders ? (
        <div className="grid crud-demo">
          <div className="col-12">
            <div className="card">
              <DataTable
                ref={dt}
                value={orders}
                selection={selectedOrder}
                onSelectionChange={(e) => setSelectedOrder(e.value)}
                dataKey={orders._id}
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25]}
                className="datatable-responsive"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                globalFilter={globalFilter}
                emptyMessage="No Category found."
                header={header}
                responsiveLayout="scroll"
              >
                <Column
                  field="code"
                  header="ID"
                  sortable
                  body={codeBodyTemplate}
                  headerStyle={{ minWidth: "5rem" }}
                />

                <Column
                  field="name"
                  header="Name"
                  sortable
                  body={nameBodyTemplate}
                  headerStyle={{ minWidth: "15rem" }}
                />

                <Column
                  field="email"
                  header="Email"
                  sortable
                  body={emailBodyTemplate}
                  headerStyle={{ minWidth: "15rem" }}
                />

                <Column
                  header="Action"
                  body={actionBodyTemplate}
                  headerStyle={{ minWidth: "10rem" }}
                />
              </DataTable>
            </div>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </DashboardContainer>
  );
};

export default Order;
