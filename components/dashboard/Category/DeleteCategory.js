import axios from "axios";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";

const DeleteCategory = ({ rowData, refetch }) => {
  const [deleteCtgDialog, setDeleteCtgDialog] = useState(false);
  const [selectCtg, setSelectCtg] = useState(null);
  const toast = useRef(null);
  const jwt = useSelector((state) => state.user.jwt);

  const deleteHandleCtg = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/admin/category/delete",
        {
          id: selectCtg._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            token: `Bearer ${jwt}`,
          },
        }
      );

      if (data.status) {
        toast.current.show({
          severity: "success",
          detail: `${data.message}`,
          life: 3000,
        });
        setDeleteCtgDialog(false);
        setDeleteCtgDialog(false);
        refetch();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const ctgDialogFooter = (
    <>
      <Button
        label="Cancel"
        icon="pi pi-times"
        text
        onClick={() => setDeleteCtgDialog(false)}
      />
      <Button
        label="Delete"
        icon="pi pi-check"
        text
        onClick={deleteHandleCtg}
      />
    </>
  );

  const confirmDeleteCtg = (sbCtg) => {
    setSelectCtg(sbCtg);
    setDeleteCtgDialog(true);
  };

  return (
    <>
      <Toast ref={toast} />

      <Dialog
        visible={deleteCtgDialog}
        style={{ width: "450px" }}
        header="Confirm"
        modal
        footer={ctgDialogFooter}
        onHide={() => setDeleteCtgDialog(false)}
      >
        <div className="flex align-items-center justify-content-center">
          <Avatar image={selectCtg?.image} size="xlarge" shape="circle" />
        </div>

        <div className="flex align-items-center justify-content-center">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {selectCtg && (
            <span>
              Are you sure you want to delete <b>{selectCtg?.name}</b>?
            </span>
          )}
        </div>
      </Dialog>

      <Button
        icon="pi pi-trash"
        severity="warning"
        rounded
        onClick={() => confirmDeleteCtg(rowData)}
      />
    </>
  );
};

export default DeleteCategory;
