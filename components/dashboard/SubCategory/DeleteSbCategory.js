import axios from "axios";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";

const DeleteSbCategory = ({ rowData, refetch }) => {
  const jwt = useSelector((state) => state.user.jwt);
  const [deleteSbCtgDialog, setDeleteSbCtgDialog] = useState(false);
  const [selectSbCtg, setSelectSbCtg] = useState(null);
  const toast = useRef(null);

  const deleteHandleSubCtg = async () => {
    try {
      const { data } = await axios.post(
        "https://front-end-msajiba.vercel.app/api/admin/sub-category/delete",
        {
          id: selectSbCtg._id,
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
        refetch();

        await toast.current.show({
          severity: "success",
          detail: `${data?.message}`,
          life: 3000,
        });

        setDeleteSbCtgDialog(false);
        setDeleteSbCtgDialog(false);
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
        onClick={() => setDeleteSbCtgDialog(false)}
      />
      <Button
        label="Delete"
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
          <Avatar image={selectSbCtg?.image} size="xlarge" shape="circle" />
        </div>
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
