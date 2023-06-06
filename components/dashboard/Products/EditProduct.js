import axios from "axios";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const EditProduct = ({ rowData, refetch, categories }) => {
  const jwt = useSelector((state) => state.user.jwt);
  const [productDialog, setProductDialog] = useState(false);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(null);
  const [original_price, setOriginal_Price] = useState(null);
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [stock, setStock] = useState(null);
  const [description, setDescription] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [bestDeal, setBestDeal] = useState(false);
  const [discountedSale, setDiscountedSale] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [file, setFile] = useState(null);
  const toast = useRef(null);

  const confirmEditProduct = (ctg) => {
    setProductDialog(true);
    setTitle(ctg.title);
    setFile(ctg.image);
    setSelectedId(ctg._id);
    setPrice(ctg.price);
    setOriginal_Price(ctg.originalPrice);
    setStock(ctg.stock);
    setShortDescription(ctg.shortDescription);
    setDescription(ctg.description);
    setBestDeal(ctg.bestDeal);
    setDiscountedSale(ctg.discountedSale);
    setCategory(ctg.category);
    setSubCategory(ctg.subCategory);
  };

  useEffect(() => {
    const getSubCategory = async () => {
      const URL = `https://front-end-msajiba.vercel.app/api/admin/category/getSubCategories?categoryId=${category._id}`;
      const { data } = await axios.get(URL);
      setSelectedSub(data?.subcategories);
    };

    getSubCategory();
  }, [category]);

  const updateProduct = {
    id: selectedId,
    title,
    price,
    originalPrice: original_price,
    category: category._id,
    subCategory: subCategory._id,
    stock,
    description,
    bestDeal,
    discountedSale,
    shortDescription,
  };

  const updatePdHandler = async () => {
    setSubmitted(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ytpmzows");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dymnymsph/image/upload",
        formData
      );
      const image = response?.data?.url;

      const { data } = await axios.post(
        "https://front-end-msajiba.vercel.app/api/admin/product/update",
        { ...updateProduct, image },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            token: `Bearer ${jwt}`,
          },
        }
      );

      if (data.status === true) {
        toast.current.show({
          severity: "success",
          detail: `${data.message}`,
          life: 3000,
        });
        setProductDialog(false);
        setTitle("");
        setShortDescription("");
        setPrice(null);
        setOriginal_Price(null);
        setStock(null);
        setCategory("");
        setSubCategory("");
        setDescription("");
        setBestDeal(false);
        setDiscountedSale(false);
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: `${data.message}`,
          life: 3000,
        });
      }
    } catch (error) {
      console.log(error);
    }

    refetch();
  };

  const subCtgDialogFooter = (
    <>
      <Button
        label="Cancel"
        icon="pi pi-times"
        text
        onClick={() => setProductDialog(false)}
      />
      <Button label="Save" icon="pi pi-check" text onClick={updatePdHandler} />
    </>
  );

  return (
    <>
      <Toast ref={toast} />

      <Button
        icon="pi pi-pencil"
        severity="success"
        rounded
        className="mr-2"
        onClick={() => confirmEditProduct(rowData)}
      />

      <Dialog
        visible={productDialog}
        style={{ width: "800px" }}
        header="Update Product"
        modal
        className="p-fluid"
        footer={subCtgDialogFooter}
        onHide={() => setProductDialog(false)}
      >
        <div className="flex align-items-center justify-content-center mb-5">
          <Avatar image={file} size="xlarge" shape="circle" />
        </div>

        <div className="field flex justify-content-center">
          <input
            type="file"
            accept="image/*"
            required
            maxFileSize={1000000}
            onChange={(e) => setFile(e.target.files[0])}
            className={classNames({
              "p-invalid": submitted && !file,
            })}
          />
          {submitted && !file && (
            <small
              style={{ fontSize: "1rem", color: "red" }}
              className="p-invalid"
            >
              File is required.
            </small>
          )}
        </div>

        <div className="formgrid grid">
          <div className="field col">
            <label htmlFor="name">Name</label>
            <InputText
              id="name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className={classNames({
                "p-invalid": submitted && !title,
              })}
            />
            {submitted && !title && (
              <small
                style={{ fontSize: "1rem", color: "red" }}
                className="p-invalid"
              >
                Name is required.
              </small>
            )}
          </div>
        </div>

        {/* CATEGORY AND SUB_CATEGORY */}
        <div className="formgrid grid">
          <div className="field col">
            <label htmlFor="ctg">Category</label>

            <Dropdown
              value={category}
              onChange={(e) => setCategory(e.value)}
              options={categories}
              optionLabel="name"
              placeholder="Select a Category"
              className={classNames({
                "p-invalid": submitted && !category,
              })}
            />

            {submitted && !category && (
              <small
                style={{ fontSize: "1rem", color: "red" }}
                className="p-invalid"
              >
                Category is required.
              </small>
            )}
          </div>

          <div className="field col">
            <label htmlFor="sub-ctg">Sub Category</label>

            <Dropdown
              value={subCategory}
              onChange={(e) => setSubCategory(e.value)}
              options={selectedSub}
              optionLabel="name"
              placeholder="Select a Category"
              className={classNames({
                "p-invalid": submitted && !subCategory,
              })}
            />

            {submitted && !subCategory && (
              <small
                style={{ fontSize: "1rem", color: "red" }}
                className="p-invalid"
              >
                Sub Category is required.
              </small>
            )}
          </div>
        </div>

        {/* PRICE _ ORIGINAL_PRICE & QUANTITY  */}
        <div className="formgrid grid">
          <div className="field col">
            <label htmlFor="original_price">Original Price</label>
            <InputNumber
              id="original_price"
              value={original_price}
              onChange={(e) => setOriginal_Price(e.value)}
              required
              className={classNames({
                "p-invalid": submitted && !original_price,
              })}
            />
            {submitted && !original_price && (
              <small
                style={{ fontSize: "1rem", color: "red" }}
                className="p-invalid"
              >
                Original Price is required.
              </small>
            )}
          </div>

          <div className="field col">
            <label htmlFor="price">Price</label>
            <InputNumber
              id="price"
              value={price}
              onChange={(e) => setPrice(e.value)}
              required
              className={classNames({
                "p-invalid": submitted && !price,
              })}
            />
            {submitted && !price && (
              <small
                style={{ fontSize: "1rem", color: "red" }}
                className="p-invalid"
              >
                Price is required.
              </small>
            )}
          </div>

          <div className="field col">
            <label htmlFor="stock">Stock</label>
            <InputNumber
              id="stock"
              value={stock}
              onChange={(e) => setStock(e.value)}
              required
              className={classNames({
                "p-invalid": submitted && !stock,
              })}
            />
            {submitted && !stock && (
              <small
                style={{ fontSize: "1rem", color: "red" }}
                className="p-invalid"
              >
                Quantity is required.
              </small>
            )}
          </div>
        </div>

        <div className="field col">
          <label htmlFor="short-des">ShortDescription</label>
          <InputTextarea
            id="short-des"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            required
            className={classNames({
              "p-invalid": submitted && !shortDescription,
            })}
          />
          {submitted && !shortDescription && (
            <small
              style={{ fontSize: "1rem", color: "red" }}
              className="p-invalid"
            >
              Short Description is required.
            </small>
          )}
        </div>

        <div className="field col">
          <label htmlFor="des">Description</label>
          <InputTextarea
            id="des"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className={classNames({
              "p-invalid": submitted && !description,
            })}
          />
          {submitted && !description && (
            <small
              style={{ fontSize: "1rem", color: "red" }}
              className="p-invalid"
            >
              Description is required.
            </small>
          )}
        </div>

        {/* DISCOUND AND BEST SALE */}
        <div className="formgrid grid">
          <div className="field col flex justify-content-between align-content-center">
            <label htmlFor="bestdeal">Best Deal</label>
            <InputSwitch
              id="bestdeal"
              checked={bestDeal}
              onChange={(e) => setBestDeal(!bestDeal)}
              required
              className="small"
            />
          </div>

          <div className="field col flex justify-content-between align-content-center">
            <label htmlFor="discountedSale">Discounted Sale</label>
            <InputSwitch
              id="discountedSale"
              checked={discountedSale}
              onChange={(e) => setDiscountedSale(!discountedSale)}
              required
              className="small"
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default EditProduct;
