import axios from "axios";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";

const DeleteSubBlog = ({ rowData, refetch }) => {
  const [deleteSubBlogDialog, setDeleteSubBlogDialog] = useState(false);
  const [selectSubBlog, setSelectSubBlog] = useState(null);
  const toast = useRef(null);
  const jwt = useSelector((state) => state.user.jwt);

  const deleteHandleSubBlog = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/admin/sub-blog/delete",
        {
          id: selectSubBlog._id,
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
        setDeleteSubBlogDialog(false);
        refetch();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const subBlogDialogFooter = (
    <>
      <Button
        label="Cancel"
        icon="pi pi-times"
        text
        onClick={() => setDeleteSubBlogDialog(false)}
      />
      <Button
        label="Delete"
        icon="pi pi-check"
        text
        onClick={deleteHandleSubBlog}
      />
    </>
  );

  const confirmDeleteCtg = (subBlog) => {
    setSelectSubBlog(subBlog);
    setDeleteSubBlogDialog(true);
  };

  return (
    <>
      <Toast ref={toast} />

      <Dialog
        visible={deleteSubBlogDialog}
        style={{ width: "450px" }}
        header="Confirm"
        modal
        footer={subBlogDialogFooter}
        onHide={() => setDeleteSubBlogDialog(false)}
      >
        <div className="flex align-items-center justify-content-center">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {selectSubBlog && (
            <span>
              Are you sure you want to delete <b>{selectSubBlog?.name}</b>?
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

export default DeleteSubBlog;
