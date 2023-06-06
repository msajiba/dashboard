import axios from "axios";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";

const DeleteOrder = ({ rowData, refetch }) => {
  const [deleteOrderDialog, setDeleteOrderDialog] = useState(false);
  const [selectOrder, setSelectOrder] = useState(null);
  const toast = useRef(null);
  const jwt = useSelector((state) => state.user.jwt);

  const deleteHandleOrder = async () => {
    try {
      const { data } = await axios.post(
        "https://front-end-msajiba.vercel.app/api/admin/order/delete",
        {
          id: selectOrder._id,
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
        setDeleteOrderDialog(false);
        setDeleteOrderDialog(false);
        refetch();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const blogDialogFooter = (
    <>
      <Button
        label="Cancel"
        icon="pi pi-times"
        text
        onClick={() => setDeleteOrderDialog(false)}
      />
      <Button
        label="Delete"
        icon="pi pi-check"
        text
        onClick={deleteHandleOrder}
      />
    </>
  );

  const confirmDeleteBlog = (order) => {
    setSelectOrder(order);
    setDeleteOrderDialog(true);
  };

  return (
    <>
      <Toast ref={toast} />

      <Dialog
        visible={deleteOrderDialog}
        style={{ width: "450px" }}
        header="Confirm"
        modal
        footer={blogDialogFooter}
        onHide={() => setDeleteOrderDialog(false)}
      >
        <div className="flex align-items-center justify-content-center">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {selectOrder && (
            <span>
              Are you sure you want to delete <b>{selectOrder?.title}</b>?
            </span>
          )}
        </div>
      </Dialog>

      <Button
        icon="pi pi-trash"
        severity="warning"
        rounded
        onClick={() => confirmDeleteBlog(rowData)}
      />
    </>
  );
};

export default DeleteOrder;
