import axios from "axios";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { ProgressBar } from "primereact/progressbar";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { mainAPI } from "../../../uitls/api";


const ROOT = mainAPI;

const NewCategory = ({ refetch }) => {
  const jwt = useSelector((state) => state.user.jwt);
  const [ctgDialog, setCtgDialog] = useState(false);
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const toast = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const saveCtg = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ytpmzows");

    try {
      setIsLoading(true);
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dymnymsph/image/upload",
        formData
      );
      const image = response.data.url;

      const { data } = await axios.post(
        `${ROOT}/api/admin/category/store`,
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

      if (data.status === true) {
        toast.current.show({
          severity: "success",
          detail: `${data.message}`,
          life: 3000,
        });
        setCtgDialog(false);
        setName("");
        setFile(null);
        setIsLoading(false);
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: `${data.message}`,
          life: 3000,
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.log("error ============>", error);
    }

    refetch();
    setIsLoading(false);
  };

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
        onHide={() => setCtgDialog(false)}
      >
        <form onSubmit={saveCtg}>
          <div className="field">
            <input
              type="file"
              accept="image/*"
              style={{ border: "0.5px solid green", padding: "10px" }}
              required
              
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
          <div style={{ marginTop: "30px" }}>
            {isLoading && (
              <ProgressBar
                mode="indeterminate"
                style={{ height: "6px", width: "300px", margin: "30px auto" }}
              ></ProgressBar>
            )}
            <Button type="submit" label="ADD CATEGORY" className="mt-10" />
          </div>
        </form>
      </Dialog>
    </>
  );
};

export default NewCategory;
