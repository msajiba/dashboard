import axios from "axios";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Avatar } from "primereact/avatar";
import { ProgressBar } from "primereact/progressbar";
import { mainAPI } from "../../../uitls/api";

const ROOT = mainAPI;

const EditCategory = ({ rowData, refetch }) => {
  const jwt = useSelector((state) => state.user.jwt);
  const [ctgDialog, setCtgDialog] = useState(false);
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [selectedId, setSelectedID] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const toast = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const confirmDeleteCtg = (ctg) => {
    setCtgDialog(true);
    setName(ctg.name);
    setFile(ctg.image);
    setSelectedID(ctg?._id);
  };

  const updateCtg = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setIsLoading(true);
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
        `${ROOT}/api/admin/category/update`,
        {
          name,
          image,
          id: selectedId,
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
        setIsLoading(false);
      } else {
        toast.current.show({
          severity: "error",
          detail: `${data.message}`,
          life: 3000,
        });
        setCtgDialog(false);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }

    refetch();
    setIsLoading(false);
  };

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
        style={{ width: "800px" }}
        header="Update Category"
        modal
        className="p-fluid"
        onHide={() => setCtgDialog(false)}
      >
        <div className="flex align-items-center justify-content-center mb-5">
          <Avatar image={file} size="xlarge" shape="circle" />
        </div>

        <form onSubmit={updateCtg}>
          <div className="field">
            <input
              type="file"
              accept="image/*"
              style={{ border: "0.5px solid green", padding: "10px" }}
              maxFileSize={1000}
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
          <div style={{ marginTop: "30px" }}>
            {isLoading && (
              <ProgressBar
                mode="indeterminate"
                style={{ height: "6px", width: "300px", margin: "30px auto" }}
              ></ProgressBar>
            )}
            <Button type="submit" label="UPDATE CATEGORY" className="mt-10" />
          </div>
        </form>
      </Dialog>
    </>
  );
};

export default EditCategory;
