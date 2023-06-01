import axios from "axios";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";

const NewCategory = ({ refetch }) => {
  
  const jwt = useSelector((state) => state.user.jwt);
  const [ctgDialog, setCtgDialog] = useState(false);
  const [name, setName] = useState("");
  // const [image, setImage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const toast = useRef(null);

  const saveCtg = async () => {
    setSubmitted(true);
    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/admin/category/store",
        {
          name,
          // image,
        },
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
        setCtgDialog(false);
        setName("");
        // setImage("");
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: `${data.message}`,
          life: 3000,
        });
      }
    } catch (error) {
      console.log("error ============>", error);
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
      <Button label="Save" icon="pi pi-check" text onClick={saveCtg} />
    </>
  );

  return (
    <>
      <Toast ref={toast} />

      <Button
        label="Add New"
        icon="pi pi-plus"
        severity="sucess"
        className="mr-2"
        onClick={() => setCtgDialog(true)}
      />

      <Dialog
        visible={ctgDialog}
        style={{ width: "500px" }}
        header="Add New Category"
        modal
        className="p-fluid"
        footer={subCtgDialogFooter}
        onHide={() => setCtgDialog(false)}
      >
        {/* <div className="field">
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
        </div> */}

        <div className="field">
          <label htmlFor="name">Name</label>
          <InputText
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
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

export default NewCategory;
