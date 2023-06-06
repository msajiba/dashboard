import axios from "axios";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";

const DeleteBlog = ({ rowData, refetch }) => {
  const [deleteBlogDialog, setDeleteBlogDialog] = useState(false);
  const [selectBlog, setSelectBlog] = useState(null);
  const toast = useRef(null);
  const jwt = useSelector((state) => state.user.jwt);

  const deleteHandleBlog = async () => {
    try {
      const { data } = await axios.post(
        "https://front-end-msajiba.vercel.app/api/admin/blog/delete",
        {
          id: selectBlog._id,
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
        setDeleteBlogDialog(false);
        setDeleteBlogDialog(false);
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
        onClick={() => setDeleteBlogDialog(false)}
      />
      <Button
        label="Delete"
        icon="pi pi-check"
        text
        onClick={deleteHandleBlog}
      />
    </>
  );

  const confirmDeleteBlog = (blog) => {
    setSelectBlog(blog);
    setDeleteBlogDialog(true);
  };

  return (
    <>
      <Toast ref={toast} />

      <Dialog
        visible={deleteBlogDialog}
        style={{ width: "450px" }}
        header="Confirm"
        modal
        footer={blogDialogFooter}
        onHide={() => setDeleteBlogDialog(false)}
      >
        
        <div className="flex align-items-center justify-content-center">
          <Avatar image={selectBlog?.image} size="xlarge" shape="circle" />
        </div>
        <div className="flex align-items-center justify-content-center">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {selectBlog && (
            <span>
              Are you sure you want to delete <b>{selectBlog?.title}</b>?
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

export default DeleteBlog;
