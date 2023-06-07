import axios from "axios";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Editor } from "primereact/editor";
import { Dropdown } from "primereact/dropdown";
import { useQuery } from "react-query";

const NewBlog = ({ refetch }) => {
  const jwt = useSelector((state) => state.user.jwt);
  const [blogDialog, setBlogDialog] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [selectSubBlog, setSelectedSubBlog] = useState("");
  const [subBlogs, setSubBlogs] = useState("");
  const [file, setFile] = useState("");

  const toast = useRef(null);

  const { isLoading, error, data } = useQuery(
    "subBlogs",
    async () =>
      await axios.get("https://front-end-msajiba.vercel.app/api/admin/sub-blog/getAll")
  );
  isLoading && <p> Loading...</p>;

  useEffect(() => {
    setSubBlogs(data?.data.subBlogs);
  }, [data?.data?.subBlogs]);

  const saveBlog = async () => {
    setSubmitted(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ytpmzows");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dymnymsph/image/upload",
        formData
      );
      const image = response.data.url;

      const { data } = await axios.post(
        "https://front-end-msajiba.vercel.app/api/admin/blog/store",
        {
          title,
          slug,
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
        setTitle("");
        setSlug("");
        setImage("");
        setContent(null);
        setAuthor("");
        setSubBlogs("");
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

  const blogDialogFooter = (
    <>
      <Button
        label="Cancel"
        icon="pi pi-times"
        text
        onClick={() => setBlogDialog(false)}
      />
      {!content ? (
        <Button
          label="Save"
          disabled
          icon="pi pi-check"
          text
          onClick={saveBlog}
        />
      ) : (
        <Button label="Save" icon="pi pi-check" text onClick={saveBlog} />
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
        onClick={() => setBlogDialog(true)}
      />

      <Dialog
        visible={blogDialog}
        style={{ width: "800px", position: "relative" }}
        header="Add New Blog"
        modal
        className="p-fluid "
        footer={blogDialogFooter}
        onHide={() => setBlogDialog(false)}
      >
        <div className="flex align-items-center justify-content-center mb-5">
          <div className="field ">
            <input
              type="file"
              accept="image/*"
              maxFileSize={1000}
              onChange={(e) => setFile(e.target.files[0])}
              className={classNames({
                "p-invalid": submitted && !file,
              })}
            />
            {submitted && !file && (
              <small
                style={{ fontSize: "1rem", color: "red" }}
                className="p-invalid"
              >
                File is required.
              </small>
            )}
          </div>
        </div>

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

        <div className="formgrid grid">
          <div className="field col">
            <label htmlFor="slug">Slug</label>
            <InputText
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              autoFocus
              className={classNames({
                "p-invalid": submitted && !slug,
              })}
            />
            {submitted && !slug && (
              <small
                style={{ fontSize: "1rem", color: "red" }}
                className="p-invalid"
              >
                Slug is required.
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

          <div className="field col">
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
            style={{ maxHeight: "100%" }}
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

export default NewBlog;
