import axios from "axios";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { ProgressBar } from "primereact/progressbar";
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
  const [isLoading, setIsLoading] = useState(false);

  const saveSubBlog = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    try {
      setIsLoading(true);
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
        setIsLoading(false);
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: `${data.message}`,
          life: 3000,
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.log("error ============>", error);
    }
    refetch();
    setIsLoading(false);
  };

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
        onHide={() => setSubBlogDialog(false)}
      >
        <form onSubmit={saveSubBlog}>
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
          <div style={{ marginTop: "30px" }}>
            {isLoading && (
              <ProgressBar
                mode="indeterminate"
                style={{ height: "6px", width: "300px", margin: "30px auto" }}
              ></ProgressBar>
            )}
            <Button type="submit" label="ADD SUB BLOG" className="mt-10" />
          </div>
        </form>
      </Dialog>
    </>
  );
};

export default NewSubBlog;
