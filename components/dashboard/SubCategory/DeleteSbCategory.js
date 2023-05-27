import axios from "axios";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import React, { useRef, useState } from "react";

const DeleteSbCategory = ({ rowData, setSubCategories }) => {
  const [deleteSbCtgDialog, setDeleteSbCtgDialog] = useState(false);
  const [selectSbCtg, setSelectSbCtg] = useState(null);
  const toast = useRef(null);

  const deleteHandleSubCtg = async () => {
    try {
      const { data } = await axios.delete(
        `http://localhost:3000/api/admin/subCategory`,
        {
          data: { id: selectSbCtg._id },
        }
      );
      if (data?.status) {
        setSubCategories(data?.subCategory);

        toast?.current?.show({
          severity: "success",
          summary: "Successful",
          detail: `${data.message}`,
          life: 3000,
        });

        setDeleteSbCtgDialog(false);
      }
      setDeleteSbCtgDialog(false);
    } catch (error) {
      console.log(error);
    }
  };

  const subCtgDialogFooter = (
    <>
      <Button
        label="Cancel"
        icon="pi pi-times"
        text
        onClick={() => setDeleteSbCtgDialog(false)}
      />
      <Button
        label="Save"
        icon="pi pi-check"
        text
        onClick={deleteHandleSubCtg}
      />
    </>
  );

  const confirmDeleteSbCtg = (sbCtg) => {
    setSelectSbCtg(sbCtg);
    setDeleteSbCtgDialog(true);
  };

  return (
    <>
      <Toast ref={toast} />

      <Dialog
        visible={deleteSbCtgDialog}
        style={{ width: "450px" }}
        header="Confirm"
        modal
        footer={subCtgDialogFooter}
        onHide={() => setDeleteSbCtgDialog(false)}
      >
        <div className="flex align-items-center justify-content-center">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {selectSbCtg && (
            <span>
              Are you sure you want to delete <b>{selectSbCtg?.name}</b>?
            </span>
          )}
        </div>
      </Dialog>

      <Button
        icon="pi pi-trash"
        severity="warning"
        rounded
        onClick={() => confirmDeleteSbCtg(rowData)}
      />
    </>
  );
};

export default DeleteSbCategory;
