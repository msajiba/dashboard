import axios from "axios";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";

const DeleteUser = ({ rowData, refetch }) => {
  const jwt = useSelector((state) => state.user.jwt);
  const [deleteUser, setDeleteUser] = useState(false);
  const [selectUser, setSelectUser] = useState(null);
  const toast = useRef(null);

  const deleteHandleUser = async () => {
    try {
      const { data } = await axios.post(
        "https://front-end-msajiba.vercel.app/api/admin/user/delete",
        {
          id: selectUser._id,
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
        setDeleteUser(false);
        refetch();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const userDialogFooter = (
    <>
      <Button
        label="Cancel"
        icon="pi pi-times"
        text
        onClick={() => setDeleteUser(false)}
      />
      <Button
        label="Delete"
        icon="pi pi-check"
        text
        onClick={deleteHandleUser}
      />
    </>
  );

  const confirmDeleteCtg = (user) => {
    setSelectUser(user);
    setDeleteUser(true);
  };

  return (
    <>
      <Toast ref={toast} />

      <Dialog
        visible={deleteUser}
        style={{ width: "450px" }}
        header="Confirm"
        modal
        footer={userDialogFooter}
        onHide={() => setDeleteUser(false)}
      >
        <div className="flex align-items-center justify-content-center">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {selectUser && (
            <span>
              Are you sure you want to delete <b>{selectUser?.email}</b>?
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

export default DeleteUser;
