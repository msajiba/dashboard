/* eslint-disable */
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Toolbar } from "primereact/toolbar";
import React, { useEffect, useRef, useState } from "react";
import DashboardContainer from "../../../layout/DashboardContainer";
import axios from "axios";
import { useQuery } from "react-query";
import Loader from "../../../components/Shared/Loader";
import { Badge } from "primereact/badge";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import DeleteUser from "../../../components/dashboard/User/UserDelete";
import { mainAPI } from "../../../uitls/api";
import UserShow from "../../../components/dashboard/User/UserShow";

const ROOT = mainAPI;

const SubCategories = () => {
  const user = useSelector((state) => state.user.currentUser);
  const jwt = useSelector((state) => state.user.jwt);
  const [users, setUsers] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const dt = useRef(null);
  const router = useRouter();

  if (!user) {
    router.push("/auth/login");
    return null;
  }

  const { isLoading, error, data, refetch } = useQuery(
    ["profiles", users],
    async () =>
      await axios.get(`${ROOT}/api/profile/getAll`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          token: `Bearer ${jwt}`,
        },
      })
  );

  isLoading && <Loader />;

  error && console.log(error);

  useEffect(() => {
    refetch();
    setUsers(data?.data?.order);
  }, [data?.data]);

  const codeBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Code</span>
        {rowData._id}
      </>
    );
  };

  const emailBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Email</span>
        {rowData?.email}
      </>
    );
  };
  const phoneBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Phone</span>
        {rowData?.phone}
      </>
    );
  };
  const nameBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Name</span>
        {rowData?.name}
      </>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <UserShow rowData={rowData} refetch={refetch} />
        {rowData.role !== "admin" && (
          <DeleteUser rowData={rowData} refetch={refetch} />
        )}
      </>
    );
  };

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">
        USERS -
        <Badge
          className="ml-2"
          value={users?.length}
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
      {users ? (
        <div className="grid crud-demo">
          <div className="col-12">
            <div className="card">
              <DataTable
                ref={dt}
                value={users}
                selection={selectedUser}
                onSelectionChange={(e) => setSelectedUser(e.value)}
                dataKey={users._id}
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25]}
                className="datatable-responsive"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Users"
                globalFilter={globalFilter}
                emptyMessage="No user found..."
                header={header}
                responsiveLayout="scroll"
              >
                <Column
                  field="_id"
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
                  headerStyle={{ minWidth: "5rem" }}
                />

                <Column
                  field="email"
                  header="Email"
                  sortable
                  body={emailBodyTemplate}
                  headerStyle={{ minWidth: "8rem" }}
                />

                <Column
                  field="phone"
                  header="Phone"
                  sortable
                  body={phoneBodyTemplate}
                  headerStyle={{ minWidth: "5rem" }}
                />
                <Column
                  field="Action"
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

export default SubCategories;
