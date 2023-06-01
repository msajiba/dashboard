import axios from "axios";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import React, { useRef, useState } from "react";

const EditProduct = ({ rowData, refetch }) => {
  const [ctgDialog, setCtgDialog] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [selectedId, setSelectedID] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const toast = useRef(null);

  const confirmDeleteCtg = (ctg) => {
    setCtgDialog(true);
    setName(ctg.name);
    setImage(ctg.image);
    setSelectedID(ctg?._id);
  };

  const updateCtg = async () => {
    setSubmitted(true);

    try {
      const { data } = await axios.patch(
        "http://localhost:3000/api/admin/category",
        {
          name,
          image,
          id: selectedId,
        }
      );
      if (data.status === true) {
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: `${data.message}`,
          life: 3000,
        });
        setCtgDialog(false);
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: `${data.message}`,
          life: 3000,
        });
        setCtgDialog(false);
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
        onClick={() => setCtgDialog(false)}
      />
      <Button label="Save" icon="pi pi-check" text onClick={updateCtg} />
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
        onClick={() => confirmDeleteCtg(rowData)}
      />

      <Dialog
        visible={ctgDialog}
        style={{ width: "500px" }}
        header="Add New Product"
        modal
        className="p-fluid"
        footer={subCtgDialogFooter}
        onHide={() => setCtgDialog(false)}
      >
        <div className="field">
          <label htmlFor="name">Image</label>
          <InputText
            id="image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
            autoFocus
            className={classNames({
              "p-invalid": submitted && !image,
            })}
          />
          {submitted && !image && (
            <small
              style={{ fontSize: "1rem", color: "red" }}
              className="p-invalid"
            >
              Image is required.
            </small>
          )}
        </div>

        <div className="field">
          <label htmlFor="name">Name</label>
          <InputText
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
            className={classNames({
              "p-invalid": submitted && !name,
            })}
          />
          {submitted && !name && (
            <small
              style={{ fontSize: "1rem", color: "red" }}
              className="p-invalid"
            >
              Name is required.
            </small>
          )}
        </div>
      </Dialog>
    </>
  );
};

export default EditProduct;
