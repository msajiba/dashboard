/* eslint-disable */
import axios from "axios";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { ProgressBar } from "primereact/progressbar";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { mainAPI } from "../../../uitls/api";



const ROOT = mainAPI;

const NewSlider = ({ rowData, refetch }) => {
  const jwt = useSelector((state) => state.user.jwt);
  const [sliderDialog, setSliderDialog] = useState(false);
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const toast = useRef(null);
  const [file, setFile] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const confirmDeleteSbCtg = () => {
    setSliderDialog(true);
  };

  const storeSlider = async () => {
    setIsLoading(true);
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
        `${ROOT}/api/admin/slider/store`,
        {
          description,
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
        setSliderDialog(false);
        setFile(null);
        setDescription("");
        setIsLoading(false);
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: `${data.message}`,
          life: 3000,
        });
        setSliderDialog(false);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }

    refetch();
    setIsLoading(false);
  };

  const subCtgDialogFooter = (
    <>
      <Button
        label="Cancel"
        icon="pi pi-times"
        text
        onClick={() => setSliderDialog(false)}
      />
      {!file ? (
        <Button
          label="save"
          disabled
          icon="pi pi-check"
          text
          onClick={storeSlider}
        />
      ) : (
        <Button label="save" icon="pi pi-check" text onClick={storeSlider} />
      )}
    </>
  );

  return (
    <>
      <Toast ref={toast} />

      <Button
        icon="pi pi-plus"
        severity="success"
        label="Add New"
        rounded
        className="mr-2"
        onClick={() => confirmDeleteSbCtg(rowData)}
      />

      <Dialog
        visible={sliderDialog}
        style={{ width: "500px" }}
        header="Add New Slider"
        modal
        className="p-fluid"
        footer={subCtgDialogFooter}
        onHide={() => setSliderDialog(false)}
      >
        <div className="flex align-items-center justify-content-center my-2 ">
          <div className="field ">
            <input
              type="file"
              required
              accept="image/*"
              style={{ border: "0.5px solid green", padding: "10px" }}
            
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
        </div>

        <div className="field col">
          <label htmlFor="des">Description</label>
          <InputTextarea
            id="des"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div style={{ marginTop: "30px" }}>
          {isLoading && (
            <ProgressBar
              mode="indeterminate"
              style={{ height: "6px", width: "300px", margin: "0px auto" }}
            ></ProgressBar>
          )}
        </div>
      </Dialog>
    </>
  );
};

export default NewSlider;
