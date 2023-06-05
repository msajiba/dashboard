/*eslint-disable */
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Toolbar } from "primereact/toolbar";
import React, { useEffect, useRef, useState } from "react";
import DashboardContainer from "../../../layout/DashboardContainer";
import { Avatar } from "primereact/avatar";
import { useQuery } from "react-query";
import axios from "axios";
import EditCategory from "../../../components/dashboard/Category/EditCategory";
import DeleteCategory from "../../../components/dashboard/Category/DeleteCategory";
import { Badge } from "primereact/badge";
import NewCategory from "../../../components/dashboard/Category/NewCategory";
import Loader from "../../../components/Shared/Loader";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

const Categories = ({ ctg }) => {
  const [categories, setCategories] = useState(null);
  const [selectedCtg, setSelectedCtg] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const dt = useRef(null);

  const user = useSelector((state) => state.user.currentUser);
  const router = useRouter();

  if (!user) {
    router.push("/auth/login");
    return null;
  }

  const { isLoading, error, data, refetch } = useQuery(
    "category",
    async () =>
      await axios.get("http://localhost:3000/api/admin/category/getAll")
  );

  useEffect(() => {
    setCategories(data?.data?.categories);
    refetch();
  }, [data?.data?.categories]);

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
        <span className="p-column-title">Name</span>
        {rowData?.name.toUpperCase()}
      </>
    );
  };

  const imageBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Image</span>
        <Avatar image={`${rowData.image}`} size="xlarge" shape="circle" />
      </>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <EditCategory rowData={rowData} refetch={refetch} />

        <DeleteCategory rowData={rowData} refetch={refetch} />
      </>
    );
  };

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">
        CATEGORY
        <Badge
          className="ml-2"
          value={categories?.length}
          size="large"
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
      <div className="grid crud-demo">
        <div className="col-12">
          <div className="card">
            <Toolbar
              className="mb-4"
              right={<NewCategory refetch={refetch} />}
            />

            <DataTable
              ref={dt}
              value={categories}
              selection={selectedCtg}
              onSelectionChange={(e) => setSelectedCtg(e.value)}
              dataKey="id"
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

              <Column header="Image" body={imageBodyTemplate} />

              <Column
                field="name"
                header="Name"
                sortable
                body={nameBodyTemplate}
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
    </DashboardContainer>
  );
};

export default Categories;
