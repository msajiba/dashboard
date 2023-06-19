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
import { Avatar } from "primereact/avatar";
import { ProgressBar } from "primereact/progressbar";
import { mainAPI } from "../../../uitls/api";

const ROOT = mainAPI;

const EditBlog = ({ rowData, refetch }) => {
  const jwt = useSelector((state) => state.user.jwt);
  const [blogDialog, setBlogDialog] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [selectSubBlog, setSelectedSubBlog] = useState("");
  const [subBlogs, setSubBlogs] = useState("");
  const [selectedId, setSelectedID] = useState("");
  const [slug, setSlug] = useState("");
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const toast = useRef(null);

  const confirmDeleteCtg = (blog) => {
    setBlogDialog(true);
    setTitle(blog.title);
    setSlug(blog.slug);
    setAuthor(blog.author);
    setContent(blog.content);
    setSelectedID(blog?._id);
    setSelectedSubBlog(blog.subBlog);
    setFile(blog.image);
  };

  const { error, data } = useQuery(
    "blogs",
    async () => await axios.get(`${ROOT}/api/admin/sub-blog/getAll`)
  );

  useEffect(() => {
    setSubBlogs(data?.data.subBlogs);
  }, [data?.data?.subBlogs]);

  error && console.log(error);

  const updateCtg = async (e) => {
    e.preventDefault();
    setIsLoading(true);
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
        `${ROOT}/api/admin/blog/update`,
        {
          id: selectedId,
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
        setIsLoading(false);
      } else {
        toast.current.show({
          severity: "error",
          detail: `${data.message}`,
          life: 3000,
        });
        setBlogDialog(false);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
    refetch();
  };

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
        onHide={() => setBlogDialog(false)}
      >
        <div className="flex align-items-center justify-content-center mb-5">
          <Avatar image={file} size="xlarge" shape="circle" />
        </div>

        <form onSubmit={updateCtg}>
          <div className="flex align-items-center justify-content-center mb-5">
            <div className="field ">
              <input
                type="file"
                accept="image/*"
             
                style={{ border: "0.5px solid green", padding: "10px" }}
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
          <div style={{ marginTop: "30px" }}>
            {isLoading && (
              <ProgressBar
                mode="indeterminate"
                style={{ height: "6px", width: "300px", margin: "30px auto" }}
              ></ProgressBar>
            )}
            <Button type="submit" label="UPDATE BLOG" className="mt-10" />
          </div>
        </form>
      </Dialog>
    </>
  );
};

export default EditBlog;
