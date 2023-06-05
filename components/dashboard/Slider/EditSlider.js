import axios from "axios";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/InputTextarea";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";

const EditSlider = ({ rowData, refetch }) => {
  const jwt = useSelector((state) => state.user.jwt);
  const [sliderDialog, setSliderDialog] = useState(false);
  const [selectedID, setSelectedID] = useState(null);
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const toast = useRef(null);
  const [file, setFile] = useState("");

  const confirmDeleteSbCtg = (sbCtg) => {
    setSliderDialog(true);
    setDescription(sbCtg.description);
    setSelectedID(sbCtg?._id);
    setFile(sbCtg.image);
  };

  const updateSlider = async () => {
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
        "http://localhost:3000/api/admin/slider/update",
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
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: `${data.message}`,
          life: 3000,
        });
        setSliderDialog(false);
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
        </div>

        <div className="field col">
          <label htmlFor="des">Description</label>
          <InputTextarea
            id="des"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </Dialog>
    </>
  );
};

export default EditSlider;
