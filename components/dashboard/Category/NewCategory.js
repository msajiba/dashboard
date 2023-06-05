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
  const [name, setName] = useState(null);
  const [file, setFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const toast = useRef(null);

  const saveCtg = async () => {
    setSubmitted(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ytpmzows");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dymnymsph/image/upload",
        formData
      );
      const image = response.data.url;

      const { data } = await axios.post(
        "http://localhost:3000/api/admin/category/store",
        {
          name,
          image,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            token: `Bearer ${jwt}`,
          },
        }
      );

      console.log(data);

      if (data.status === true) {
        toast.current.show({
          severity: "success",
          detail: `${data.message}`,
          life: 3000,
        });
        setCtgDialog(false);
        setName(null);
        setFile(null);
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
      {!file ? (
        <Button
          label="Save"
          disabled={!file && !name}
          icon="pi pi-check"
          text
          onClick={saveCtg}
        />
      ) : (
        <Button label="Save" icon="pi pi-check" text onClick={saveCtg} />
      )}
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
        style={{ width: "800px" }}
        header="Add New Category"
        modal
        className="p-fluid"
        footer={subCtgDialogFooter}
        onHide={() => setCtgDialog(false)}
      >
        <form>
          <div className="field">
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
        </form>
      </Dialog>
    </>
  );
};

export default NewCategory;
