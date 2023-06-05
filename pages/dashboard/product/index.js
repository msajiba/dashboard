/* eslint-disable */
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import React, { useEffect, useRef, useState } from "react";
import DashboardContainer from "../../../layout/DashboardContainer";
import NewProduct from "../../../components/dashboard/Products/NewProduct";
import EditProduct from "../../../components/dashboard/Products/EditProduct";
import DeleteProduct from "../../../components/dashboard/Products/DeleteProduct";
import { Badge } from "primereact/badge";
import { useQuery } from "react-query";
import axios from "axios";
import Loader from "../../../components/Shared/Loader";
import { Avatar } from "primereact/avatar";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

const index = ({ categories }) => {
  const [products, setProducts] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  const user = useSelector((state) => state.user.currentUser);
  const router = useRouter();

  if (!user) {
    router.push("/auth/login");
    return null;
  }

  const { isLoading, error, data, refetch } = useQuery(
    "products",
    async () =>
      await axios.get("http://localhost:3000/api/admin/product/getAll")
  );

  isLoading && <Loader />;

  useEffect(() => {
    setProducts(data?.data?.products);
    refetch();
  }, [data?.data?.products]);

  error && console.log(error);

  const formatCurrency = (value) => {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "BDT",
    });
  };

  const imageBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Image</span>
        <Avatar image={`${rowData.image}`} size="xlarge" shape="circle" />
      </>
    );
  };

  const nameBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Name</span>
        {rowData.title}
      </>
    );
  };

  const priceBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Price</span>
        {formatCurrency(rowData.price)}
      </>
    );
  };

  const categoryBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Category</span>
        {rowData?.category?.name}
      </>
    );
  };

  const stockBodyTemplate = (rowData) => {

    return (
      <>
        <span className="p-column-title">Stock</span>
        {rowData.stock}
      </>
    );
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Status</span>
        {rowData.stock > 0 ? (
          <Button
            label="INSTOCK"
            severity="success"
            size="small"
            text
            disabled
          />
        ) : (
          <Button
            label="OUTOFSTOK"
            severity="warning"
            size="small"
            text
            disabled
          />
        )}
      </>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <EditProduct
          categories={categories}
          rowData={rowData}
          refetch={refetch}
        />
        <DeleteProduct rowData={rowData} refetch={refetch} />
      </>
    );
  };

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">
        Products
        <Badge
          className="ml-2"
          value={products?.length}
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
            <Toast ref={toast} />
            <Toolbar
              className="mb-4"
              right={<NewProduct refetch={refetch} categories={categories} />}
            />
            <DataTable
              ref={dt}
              value={products}
              selection={selectedProducts}
              onSelectionChange={(e) => setSelectedProducts(e.value)}
              dataKey="id"
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25]}
              className="datatable-responsive"
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
              globalFilter={globalFilter}
              emptyMessage="No products found."
              header={header}
              responsiveLayout="scroll"
            >
              <Column header="Image" body={imageBodyTemplate} />

              <Column
                field="title"
                header="Name"
                sortable
                body={nameBodyTemplate}
                headerStyle={{ minWidth: "10rem" }}
              />

              <Column
                field="price"
                header="Price"
                body={priceBodyTemplate}
                sortable
              />

              <Column
                field="Category"
                header="Category"
                body={categoryBodyTemplate}
                headerStyle={{ minWidth: "5rem" }}
              />

              <Column
                field="stock"
                header="Stock"
                body={stockBodyTemplate}
                sortable
                headerStyle={{ minWidth: "10rem" }}
              />

              <Column
                field="Status"
                header="Status"
                sortable
                body={statusBodyTemplate}
                headerStyle={{ minWidth: "5rem" }}
              />
              <Column
                header="ACTION"
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

export default index;

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
