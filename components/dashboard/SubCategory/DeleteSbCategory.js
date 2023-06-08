import axios from "axios";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { ProgressBar } from "primereact/progressbar";
import { Toast } from "primereact/toast";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { mainAPI } from "../../../uitls/api";


const ROOT = mainAPI;

const DeleteSbCategory = ({ rowData, refetch }) => {
  const jwt = useSelector((state) => state.user.jwt);
  const [deleteSbCtgDialog, setDeleteSbCtgDialog] = useState(false);
  const [selectSbCtg, setSelectSbCtg] = useState(null);
  const toast = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const deleteHandleSubCtg = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        `${ROOT}/api/admin/sub-category/delete`,
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
        {isLoading && (
          <ProgressBar
            mode="indeterminate"
            className="mt-5"
            style={{ height: "6px", width: "200px", margin: "0px auto" }}
          ></ProgressBar>
        )}
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
