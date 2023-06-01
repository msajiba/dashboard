import axios from "axios";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";

const NewSubCategory = ({ categories, refetch }) => {
  const jwt = useSelector((state) => state.user.jwt);
  const [sbCtgDialog, setSbCtgDialog] = useState(false);
  const [name, setName] = useState("");
  const [selectCategory, setSelectCategory] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const toast = useRef(null);

  const saveSubCtg = async () => {
    setSubmitted(true);
    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/admin/sub-category/store",
        {
          name,
          parent: selectCategory._id,
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
          summary: "Successful",
          detail: `${data.message}`,
          life: 3000,
        });
        setName("");
        setSelectCategory("");
        setSbCtgDialog(false);
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
        onClick={() => setSbCtgDialog(false)}
      />
      {name === "" ? (
        <Button label="Save" icon="pi pi-check" text disabled />
      ) : (
        <Button label="Save" icon="pi pi-check" text onClick={saveSubCtg} />
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
        onClick={() => setSbCtgDialog(true)}
      />

      <Dialog
        visible={sbCtgDialog}
        style={{ width: "500px" }}
        header="Add New Sub Category"
        modal
        className="p-fluid"
        footer={subCtgDialogFooter}
        onHide={() => setSbCtgDialog(false)}
      >
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

        <div className="field">
          <label className="mb-3">Category</label>
          <div className="formgrid grid">
            <div className="fixed">
              <Dropdown
                value={selectCategory}
                onChange={(e) => setSelectCategory(e.value)}
                options={categories}
                optionLabel="name"
                placeholder="Select a Category"
                required
                style={{ position: "fixed" }}
                className={classNames({
                  "p-invalid": submitted && !name,
                })}
              />
              {submitted && !selectCategory && (
                <small
                  style={{ fontSize: "1rem", color: "red" }}
                  className="p-invalid text-danger"
                >
                  Category is required.
                </small>
              )}
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default NewSubCategory;
