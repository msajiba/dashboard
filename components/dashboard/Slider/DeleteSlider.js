import axios from "axios";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";

const DeleteSlide = ({ rowData, refetch }) => {
  const jwt = useSelector((state) => state.user.jwt);
  const [deleteSlideDialog, setDeleteSlideDialog] = useState(false);
  const [selectSlide, setSelectSlide] = useState(null);
  const toast = useRef(null);

  const deleteSlide = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/admin/slider/delete",
        {
          id: selectSlide._id,
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

        setDeleteSlideDialog(false);
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
        onClick={() => setDeleteSlideDialog(false)}
      />
      <Button label="Delete" icon="pi pi-check" text onClick={deleteSlide} />
    </>
  );

  const confirmDeleteSlide = (sbCtg) => {
    setSelectSlide(sbCtg);
    setDeleteSlideDialog(true);
  };

  return (
    <>
      <Toast ref={toast} />

      <Dialog
        visible={deleteSlideDialog}
        style={{ width: "450px" }}
        header="Confirm"
        modal
        footer={subCtgDialogFooter}
        onHide={() => setDeleteSlideDialog(false)}
      >
        <div className="flex align-items-center justify-content-center">
          <Avatar image={selectSlide?.image} size="xlarge" shape="circle" />
        </div>
        <div className="flex align-items-center justify-content-center">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {selectSlide && <span>Are you sure you want to delete ?</span>}
        </div>
      </Dialog>

      <Button
        icon="pi pi-trash"
        severity="warning"
        rounded
        onClick={() => confirmDeleteSlide(rowData)}
      />
    </>
  );
};

export default DeleteSlide;
