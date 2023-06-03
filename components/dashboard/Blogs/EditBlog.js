import axios from "axios";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Editor } from "primereact/editor";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";

const EditBlog = ({ rowData, refetch }) => {
  const jwt = useSelector((state) => state.user.jwt);
  const [blogDialog, setBlogDialog] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [selectSubBlog, setSelectedSubBlog] = useState("");
  const [subBlogs, setSubBlogs] = useState("");
  const [selectedId, setSelectedID] = useState("");

  const toast = useRef(null);

  const confirmDeleteCtg = (blog) => {
    setBlogDialog(true);
    setTitle(blog.title);
    setAuthor(blog.author);
    setContent(blog.content);
    setImage(blog.image);
    setSelectedID(blog?._id);
    setSelectedSubBlog(blog.subBlog);
  };

  const { isLoading, error, data } = useQuery(
    "subBlogs",
    async () =>
      await axios.get("http://localhost:3000/api/admin/sub-blog/getAll")
  );
  isLoading && <p> Loading...</p>;

  useEffect(() => {
    setSubBlogs(data?.data.subBlogs);
  }, [data?.data?.subBlogs]);

  const updateCtg = async () => {
    setSubmitted(true);

    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/admin/blog/update",
        {
          id: selectedId,
          title,
          author,
          content,
          image,
          subBlog: selectSubBlog._id,
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
        setBlogDialog(false);
      } else {
        toast.current.show({
          severity: "error",
          detail: `${data.message}`,
          life: 3000,
        });
        setBlogDialog(false);
      }
    } catch (error) {
      console.log(error);
    }

    refetch();
  };

  const blogDialogFooter = (
    <>
      <Button
        label="Cancel"
        icon="pi pi-times"
        text
        onClick={() => setBlogDialog(false)}
      />
      <Button label="Update" icon="pi pi-check" text onClick={updateCtg} />
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
        onClick={() => confirmDeleteCtg(rowData)}
      />

      <Dialog
        visible={blogDialog}
        style={{ width: "800px", position: "relative" }}
        header="Update Blog"
        modal
        className="p-fluid "
        footer={blogDialogFooter}
        onHide={() => setBlogDialog(false)}
      >
        <div className="formgrid grid">
          <div className="field col">
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
          <div className="field col">
            <label htmlFor="author">Author</label>
            <InputText
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              className={classNames({
                "p-invalid": submitted && !author,
              })}
            />
            {submitted && !author && (
              <small
                style={{ fontSize: "1rem", color: "red" }}
                className="p-invalid"
              >
                Author is required.
              </small>
            )}
          </div>
        </div>

        <div className="formgrid grid">
          <div className="field col">
            <label htmlFor="name">Image</label>
            <InputText
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className={classNames({
                "p-invalid": submitted && !image,
              })}
            />
            {submitted && !image && (
              <small
                style={{ fontSize: "1rem", color: "red" }}
                className="p-invalid"
              >
                Image is required.
              </small>
            )}
          </div>
          <div
            className="field col"
            style={{ marginBottom: "50px", position: "sticky" }}
          >
            <label className="mb-10">Category</label>
            <div className="formgrid grid">
              <div>
                <Dropdown
                  value={selectSubBlog}
                  onChange={(e) => setSelectedSubBlog(e.value)}
                  options={subBlogs}
                  optionLabel="title"
                  placeholder="Select a Category"
                  required
                  style={{ position: "fixed" }}
                  className={classNames({
                    "p-invalid": submitted && !selectSubBlog,
                  })}
                />
                {submitted && !selectSubBlog && (
                  <small
                    style={{ fontSize: "1rem", color: "red" }}
                    className="p-invalid text-danger"
                  >
                    Sub Blog is required.
                  </small>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="field">
          <label htmlFor="author">Content</label>

          <Editor
            id="author"
            value={content}
            onTextChange={(e) => setContent(e.htmlValue)}
            style={{ height: "320px" }}
            required
            className={classNames({
              "p-invalid": submitted && !author,
            })}
          />
          {submitted && !author && (
            <small
              style={{ fontSize: "1rem", color: "red" }}
              className="p-invalid"
            >
              Content is required.
            </small>
          )}
        </div>
      </Dialog>
    </>
  );
};

export default EditBlog;
