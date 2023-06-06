/* eslint-disable */
import React, { useEffect, useRef, useState } from "react";
import DashboardContainer from "../../../layout/DashboardContainer";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { InputText } from "primereact/inputtext";
import { Avatar } from "primereact/avatar";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";

import axios from "axios";

const Siteinfo = () => {
  const user = useSelector((state) => state.user.currentUser);
  const jwt = useSelector((state) => state.user.jwt);
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);

  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const toast = useRef(null);

  const getUserInfo = async () => {
    const { data } = await axios.get(
      "https://front-end-msajiba.vercel.app/api/admin/siteinfo/find"
    );

    setAddress(data?.siteinfo?.address);
    setTitle(data?.siteinfo?.title);
    setEmail(data?.siteinfo?.email);
    setPhone(data?.siteinfo?.phone);
    setDescription(data?.siteinfo.description);
    setFile(data.siteinfo.logo);
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      const updatedSiteInfo = await axios.post(
        "https://front-end-msajiba.vercel.app/api/admin/siteinfo/store",
        {
          title,
          email,
          phone,
          address,
          description,
          logo: file,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            token: `Bearer ${jwt}`,
          },
        }
      );

      if (updatedSiteInfo.status === 200) {
        toast.current.show({
          severity: "success",
          detail: "Siteinfo has been created successfully",
          life: 3000,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!user) {
    router.push("/auth/login");
    return null;
  }

  return (
    <DashboardContainer>
      <div className="grid">
        <div className="col-12">
          <div className="card">
            <Toast ref={toast} />
            <h5>Site Information</h5>

            <div className="flex align-items-center justify-content-center mb-5">
              <Avatar image={file} size="xlarge" shape="circle" />
            </div>

            <form
              onSubmit={handleUpdateProfile}
              className="flex flex-column gap-2"
            >
              <div className="field flex justify-content-center">
                <input
                  type="file"
                  accept="image/*"
                  maxFileSize={1000000}
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

              <div className="p-fluid formgrid grid">
                <div className="field col-12 md:col-4">
                  <label htmlFor="title">Title</label>
                  <InputText
                    id="title"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                    type="text"
                  />
                </div>

                <div className="field col-12 md:col-4">
                  <label htmlFor="email">Email</label>
                  <InputText
                    id="email"
                    value={email}
                    readOnly
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    type="email"
                  />
                </div>
                <div className="field col-12 md:col-4">
                  <label htmlFor="phone">Phone No</label>
                  <InputText
                    id="phone"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                    }}
                    type="text"
                  />
                </div>
                <div className="field col-12">
                  <label htmlFor="address">Address</label>
                  <InputText
                    id="address"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                    }}
                    type="address"
                  />
                </div>

                <div className="field col">
                  <label htmlFor="des">Description</label>
                  <InputTextarea
                    id="des"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className={classNames({
                      "p-invalid": submitted && !description,
                    })}
                  />
                  {submitted && !description && (
                    <small
                      style={{ fontSize: "1rem", color: "red" }}
                      className="p-invalid"
                    >
                      Description is required.
                    </small>
                  )}
                </div>
              </div>
              <Button type="submit" label="Save"></Button>
            </form>
          </div>
        </div>
      </div>
    </DashboardContainer>
  );
};

export default Siteinfo;
