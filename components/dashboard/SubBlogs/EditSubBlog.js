import axios from "axios";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";

const EditSubBlog = ({ rowData, refetch }) => {
  const jwt = useSelector((state) => state.user.jwt);
  const [subBlogDialog, setSubBlogDialog] = useState(false);
  const [title, setTitle] = useState("");
  const [selectedId, setSelectedID] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const toast = useRef(null);

  const confirmDeleteSubBlog = (subBlog) => {
    setSubBlogDialog(true);
    setTitle(subBlog.title);
    setSelectedID(subBlog?._id);
  };

  const updateSubBlog = async () => {
    setSubmitted(true);

    try {
      const { data } = await axios.post(
        "https://front-end-msajiba.vercel.app/api/admin/sub-blog/update",
        {
          title,
          id: selectedId,
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
        setSubBlogDialog(false);
      } else {
        toast.current.show({
          severity: "error",
          detail: `${data.message}`,
          life: 3000,
        });
        setSubBlogDialog(false);
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
        onClick={() => setSubBlogDialog(false)}
      />
      <Button label="Save" icon="pi pi-check" text onClick={updateSubBlog} />
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
        onClick={() => confirmDeleteSubBlog(rowData)}
      />

      <Dialog
        visible={subBlogDialog}
        style={{ width: "500px" }}
        header="Update Sub Blog"
        modal
        className="p-fluid"
        footer={subCtgDialogFooter}
        onHide={() => setSubBlogDialog(false)}
      >
        <div className="field">
          <label htmlFor="title">Title</label>
          <InputText
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
            className={classNames({
              "p-invalid": submitted && !title,
            })}
          />
          {submitted && !title && (
            <small
              style={{ fontSize: "1rem", color: "red" }}
              className="p-invalid"
            >
              Title is required.
            </small>
          )}
        </div>
      </Dialog>
    </>
  );
};

export default EditSubBlog;
