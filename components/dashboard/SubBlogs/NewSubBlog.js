import axios from "axios";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";

const NewSubBlog = ({ refetch }) => {
  const jwt = useSelector((state) => state.user.jwt);
  const [subBlogDialog, setSubBlogDialog] = useState(false);
  const [title, setTitle] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const toast = useRef(null);

  const saveSubBlog = async () => {
    setSubmitted(true);
    try {
      const { data } = await axios.post(
        "https://front-end-msajiba.vercel.app/api/admin/sub-blog/store",
        {
          title,
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
        setTitle("");
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: `${data.message}`,
          life: 3000,
        });
      }
    } catch (error) {
      console.log("error ============>", error);
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
      {title === "" ? (
        <Button label="Save" disabled icon="pi pi-check" text onClick={saveSubBlog} />
      ) : (
        <Button label="Save" icon="pi pi-check" text onClick={saveSubBlog} />
      )}
    </>
  );

  return (
    <>
      <Toast ref={toast} />

      <Button
        label="Add New"
        icon="pi pi-plus"
        severity="sucess"
        className="mr-2"
        onClick={() => setSubBlogDialog(true)}
      />

      <Dialog
        visible={subBlogDialog}
        style={{ width: "500px" }}
        header="Add New Sub Blog"
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

export default NewSubBlog;
