import axios from "axios";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { ProgressBar } from "primereact/progressbar";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { mainAPI } from "../../../uitls/api";


const ROOT = mainAPI;

const EditSlider = ({ rowData, refetch }) => {
  const jwt = useSelector((state) => state.user.jwt);
  const [sliderDialog, setSliderDialog] = useState(false);
  const [selectedID, setSelectedID] = useState(null);
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const toast = useRef(null);
  const [file, setFile] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const confirmDeleteSbCtg = (sbCtg) => {
    setSliderDialog(true);
    setDescription(sbCtg.description);
    setSelectedID(sbCtg?._id);
    setFile(sbCtg.image);
  };

  const updateSlider = async () => {
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
        `${ROOT}/api/admin/slider/update`,
        {
          description,
          image,
          id: selectedID,
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
      <Button label="update" icon="pi pi-check" text onClick={updateSlider} />
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
        onClick={() => confirmDeleteSbCtg(rowData)}
      />

      <Dialog
        visible={sliderDialog}
        style={{ width: "500px" }}
        header="Update Slider"
        modal
        className="p-fluid"
        footer={subCtgDialogFooter}
        onHide={() => setSliderDialog(false)}
      >
        <div className="flex align-items-center justify-content-center mb-5">
          <Avatar image={file} size="xlarge" shape="circle" />
        </div>

        <div className="flex align-items-center justify-content-center my-2 ">
          <div className="field ">
            <input
              type="file"
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

export default EditSlider;
