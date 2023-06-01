/* eslint-disable */
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton } from "primereact/radiobutton";
import { Rating } from "primereact/rating";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { classNames } from "primereact/utils";
import React, { useEffect, useRef, useState } from "react";

import DashboardContainer from "../../../layout/DashboardContainer";
import db from "../../../config/db";
import Blog from "../../../server/models/Blog";
import { Avatar } from "primereact/avatar";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

const index = ({ blogs }) => {
  
  const user = useSelector((state) => state.user.currentUser);
  const router = useRouter();
  if (!user) {
    router.push("/auth/login");
    return null;
  }

  let emptyProduct = {
    id: null,
    name: "",
    image: null,
    description: "",
    category: null,
    price: 0,
    quantity: 0,
    rating: 0,
    inventoryStatus: "INSTOCK",
  };

  const [products, setProducts] = useState(blogs);
  const [productDialog, setProductDialog] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  const [product, setProduct] = useState(emptyProduct);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  const openNew = () => {
    setProduct(emptyProduct);
    setSubmitted(false);
    setProductDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setProductDialog(false);
  };

  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  };

  const hideDeleteProductsDialog = () => {
    setDeleteProductsDialog(false);
  };

  const saveProduct = () => {
    setSubmitted(true);

    if (product.name.trim()) {
      let _products = [...products];
      let _product = { ...product };
      if (product.id) {
        const index = findIndexById(product.id);

        _products[index] = _product;
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Product Updated",
          life: 3000,
        });
      } else {
        _product.id = createId();
        _product.code = createId();
        _product.image = "product-placeholder.svg";
        _products.push(_product);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Product Created",
          life: 3000,
        });
      }

      setProducts(_products);
      setProductDialog(false);
      setProduct(emptyProduct);
    }
  };

  const editProduct = (product) => {
    setProduct({ ...product });
    setProductDialog(true);
  };

  const confirmDeleteProduct = (product) => {
    setProduct(product);
    setDeleteProductDialog(true);
  };

  const deleteProduct = () => {
    let _products = products.filter((val) => val.id !== product.id);
    setProducts(_products);
    setDeleteProductDialog(false);
    setProduct(emptyProduct);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Product Deleted",
      life: 3000,
    });
  };

  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < products.length; i++) {
      if (products[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const createId = () => {
    let id = "";
    let chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  };

  const confirmDeleteSelected = () => {
    setDeleteProductsDialog(true);
  };

  const deleteSelectedProducts = () => {
    let _products = products.filter((val) => !selectedProducts.includes(val));
    setProducts(_products);
    setDeleteProductsDialog(false);
    setSelectedProducts(null);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Products Deleted",
      life: 3000,
    });
  };

  const onCategoryChange = (e) => {
    let _product = { ...product };
    _product["category"] = e.value;
    setProduct(_product);
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _product = { ...product };
    _product[`${name}`] = val;

    setProduct(_product);
  };

  const onInputNumberChange = (e, name) => {
    const val = e.value || 0;
    let _product = { ...product };
    _product[`${name}`] = val;
    setProduct(_product);
  };

  const rightToolbarTemplate = () => {
    return (
      <React.Fragment>
        <div className="my-2">
          <Button
            label="Add New"
            icon="pi pi-plus"
            severity="sucess"
            className="mr-2"
            onClick={openNew}
          />
        </div>
      </React.Fragment>
    );
  };

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
        <span className="p-column-title">Title</span>
        {rowData.name}
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
        <Button
          icon="pi pi-pencil"
          severity="success"
          rounded
          className="mr-2"
          onClick={() => editProduct(rowData)}
        />
        <Button
          icon="pi pi-trash"
          severity="warning"
          rounded
          onClick={() => confirmDeleteProduct(rowData)}
        />
      </>
    );
  };

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0 ">Manage Blogs</h5>
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

  const productDialogFooter = (
    <>
      <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" text onClick={saveProduct} />
    </>
  );
  const deleteProductDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        text
        onClick={hideDeleteProductDialog}
      />
      <Button label="Yes" icon="pi pi-check" text onClick={deleteProduct} />
    </>
  );
  const deleteProductsDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        text
        onClick={hideDeleteProductsDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        text
        onClick={deleteSelectedProducts}
      />
    </>
  );

  return (
    <DashboardContainer>
      <div className="grid crud-demo">
        <div className="col-12">
          <div className="card">
            <Toast ref={toast} />
            <Toolbar className="mb-4" right={rightToolbarTemplate}></Toolbar>

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
              <Column
                selectionMode="multiple"
                headerStyle={{ width: "4rem" }}
              />

              <Column
                field="code"
                header="ID"
                sortable
                body={codeBodyTemplate}
                headerStyle={{ minWidth: "5rem" }}
              />

              <Column header="Image" body={imageBodyTemplate} />

              <Column
                field="title"
                header="Title"
                sortable
                body={nameBodyTemplate}
                headerStyle={{ minWidth: "15rem" }}
              />

              <Column
                field="Action"
                header="Action"
                body={actionBodyTemplate}
                headerStyle={{ minWidth: "15rem" }}
              />
            </DataTable>

            <Dialog
              visible={productDialog}
              style={{ width: "450px" }}
              header="Product Details"
              modal
              className="p-fluid"
              footer={productDialogFooter}
              onHide={hideDialog}
            >
              {product.image && (
                <img
                  src={`/demo/images/product/${product.image}`}
                  alt={product.image}
                  width="150"
                  className="mt-0 mx-auto mb-5 block shadow-2"
                />
              )}
              <div className="field">
                <label htmlFor="name">Name</label>
                <InputText
                  id="name"
                  value={product.name}
                  onChange={(e) => onInputChange(e, "name")}
                  required
                  autoFocus
                  className={classNames({
                    "p-invalid": submitted && !product.name,
                  })}
                />
                {submitted && !product.name && (
                  <small className="p-invalid">Name is required.</small>
                )}
              </div>
              <div className="field">
                <label htmlFor="description">Description</label>
                <InputTextarea
                  id="description"
                  value={product.description}
                  onChange={(e) => onInputChange(e, "description")}
                  required
                  rows={3}
                  cols={20}
                />
              </div>

              <div className="field">
                <label className="mb-3">Category</label>
                <div className="formgrid grid">
                  <div className="field-radiobutton col-6">
                    <RadioButton
                      inputId="category1"
                      name="category"
                      value="Accessories"
                      onChange={onCategoryChange}
                      checked={product.category === "Accessories"}
                    />
                    <label htmlFor="category1">Accessories</label>
                  </div>
                  <div className="field-radiobutton col-6">
                    <RadioButton
                      inputId="category2"
                      name="category"
                      value="Clothing"
                      onChange={onCategoryChange}
                      checked={product.category === "Clothing"}
                    />
                    <label htmlFor="category2">Clothing</label>
                  </div>
                  <div className="field-radiobutton col-6">
                    <RadioButton
                      inputId="category3"
                      name="category"
                      value="Electronics"
                      onChange={onCategoryChange}
                      checked={product.category === "Electronics"}
                    />
                    <label htmlFor="category3">Electronics</label>
                  </div>
                  <div className="field-radiobutton col-6">
                    <RadioButton
                      inputId="category4"
                      name="category"
                      value="Fitness"
                      onChange={onCategoryChange}
                      checked={product.category === "Fitness"}
                    />
                    <label htmlFor="category4">Fitness</label>
                  </div>
                </div>
              </div>

              <div className="formgrid grid">
                <div className="field col">
                  <label htmlFor="price">Price</label>
                  <InputNumber
                    id="price"
                    value={product.price}
                    onValueChange={(e) => onInputNumberChange(e, "price")}
                    mode="currency"
                    currency="USD"
                    locale="en-US"
                  />
                </div>
                <div className="field col">
                  <label htmlFor="quantity">Quantity</label>
                  <InputNumber
                    id="quantity"
                    value={product.quantity}
                    onValueChange={(e) => onInputNumberChange(e, "quantity")}
                    integeronly="true"
                  />
                </div>
              </div>
            </Dialog>

            <Dialog
              visible={deleteProductDialog}
              style={{ width: "450px" }}
              header="Confirm"
              modal
              footer={deleteProductDialogFooter}
              onHide={hideDeleteProductDialog}
            >
              <div className="flex align-items-center justify-content-center">
                <i
                  className="pi pi-exclamation-triangle mr-3"
                  style={{ fontSize: "2rem" }}
                />
                {product && (
                  <span>
                    Are you sure you want to delete <b>{product.name}</b>?
                  </span>
                )}
              </div>
            </Dialog>

            <Dialog
              visible={deleteProductsDialog}
              style={{ width: "450px" }}
              header="Confirm"
              modal
              footer={deleteProductsDialogFooter}
              onHide={hideDeleteProductsDialog}
            >
              <div className="flex align-items-center justify-content-center">
                <i
                  className="pi pi-exclamation-triangle mr-3"
                  style={{ fontSize: "2rem" }}
                />
                {product && (
                  <span>
                    Are you sure you want to delete the selected products?
                  </span>
                )}
              </div>
            </Dialog>
          </div>
        </div>
      </div>
    </DashboardContainer>
  );
};

export default index;

export async function getServerSideProps() {
  db.connectDb();
  let blogs = await Blog.find().sort({ createdAt: -1 }).lean();
  return {
    props: {
      blogs: JSON.parse(JSON.stringify(blogs)),
    },
  };
}
