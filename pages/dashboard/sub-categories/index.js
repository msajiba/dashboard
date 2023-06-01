/* eslint-disable */
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Toolbar } from "primereact/toolbar";
import React, { useEffect, useRef, useState } from "react";
import DashboardContainer from "../../../layout/DashboardContainer";
import axios from "axios";
import DeleteSbCategory from "../../../components/dashboard/SubCategory/DeleteSbCategory";
import EditSbCategory from "../../../components/dashboard/SubCategory/EditSbCategory";
import NewSubCategory from "../../../components/dashboard/SubCategory/NewSubCategory";
import { useQuery } from "react-query";
import Loader from "../../../components/Shared/Loader";
import { Badge } from "primereact/badge";

const SubCategories = ({ categories }) => {
  const [subCategories, setSubCategories] = useState(null);
  const [selectedSbCtg, setSelectedSbCtg] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);

  const dt = useRef(null);

  const { isLoading, error, data, refetch } = useQuery(
    "sbCtg",
    async () =>
      await axios.get("http://localhost:3000/api/admin/sub-category/getAll")
  );

  isLoading && <Loader />;
  error && console.log(error);

  useEffect(() => {
    setSubCategories(data?.data?.subcategories);
    refetch();
  }, [data?.data?.subcategories]);

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
        {rowData.name}
      </>
    );
  };

  const categoryBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Category</span>
        {rowData?.parent?.name}
      </>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <EditSbCategory
          rowData={rowData}
          refetch={refetch}
          categories={categories}
        />
        {/* ===========================================DELETE_SUB_CATEGORY_HANDLER ==================================== */}
        <DeleteSbCategory rowData={rowData} refetch={refetch} />
      </>
    );
  };

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">
        SUB CATEGORY -
        <Badge
          className="ml-2"
          value={subCategories?.length}
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
            {/* ADD NEW SUB CATEGORY  */}
            <Toolbar
              className="mb-4"
              right={
                <NewSubCategory categories={categories} refetch={refetch} />
              }
            />
            <DataTable
              ref={dt}
              value={subCategories}
              selection={selectedSbCtg}
              onSelectionChange={(e) => setSelectedSbCtg(e.value)}
              dataKey="_id"
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25]}
              className="datatable-responsive"
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
              globalFilter={globalFilter}
              emptyMessage="No Sub Category found."
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
                field="category"
                header="Category"
                sortable
                body={categoryBodyTemplate}
                headerStyle={{ minWidth: "10rem" }}
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
    </DashboardContainer>
  );
};

export default SubCategories;

export async function getServerSideProps() {
  const res = await axios.get(
    "http://localhost:3000/api/admin/category/getAll"
  );
  const ctg = res?.data?.categories;
  return {
    props: {
      categories: JSON.parse(JSON.stringify(ctg)),
    },
  };
}
