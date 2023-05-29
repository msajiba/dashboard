import axios from "axios";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import React, { useRef, useState } from "react";

const EditSbCategory = ({ categories, rowData, refetch }) => {
  const [upSbCtgDialog, setUpSbCtgDialog] = useState(false);
  const [selectedID, setSelectedID] = useState(null);
  const [name, setName] = useState("");
  const [selectCategory, setSelectCategory] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const toast = useRef(null);

  const confirmDeleteSbCtg = (sbCtg) => {
    setName(sbCtg.name);
    setUpSbCtgDialog(true);
    setSelectedID(sbCtg?._id);
    setSelectCategory(sbCtg?.category);
  };

  const updateSubCtg = async () => {
    setSubmitted(true);

    try {
      const { data } = await axios.patch(
        "http://localhost:3000/api/admin/subCategory",
        {
          name,
          id: selectedID,
        }
      );
      if (data.status === true) {
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: `${data.message}`,
          life: 3000,
        });
        setUpSbCtgDialog(false);
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: `${data.message}`,
          life: 3000,
        });
        setUpSbCtgDialog(false);
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
        onClick={() => setUpSbCtgDialog(false)}
      />
      <Button label="Save" icon="pi pi-check" text onClick={updateSubCtg} />
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
        visible={upSbCtgDialog}
        style={{ width: "500px" }}
        header="Add New Product"
        modal
        className="p-fluid"
        footer={subCtgDialogFooter}
        onHide={() => setUpSbCtgDialog(false)}
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
                disabled
                onChange={(e) => setSelectCategory(e.target.value)}
                options={categories}
                optionLabel="name"
                placeholder="Select a Category"
                style={{ position: "fixed" }}
                className={classNames({
                  "p-invalid": submitted && !selectCategory,
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

export default EditSbCategory;
