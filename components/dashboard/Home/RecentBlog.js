/* eslint-disable @next/next/no-img-element */
import axios from "axios";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { mainAPI } from "../../../uitls/api";
import { useSelector } from "react-redux";
import Loader from "../../Shared/Loader";

const ROOT = mainAPI;

const RecentBlog = () => {
  const [blogs, setBlogs] = useState(null);

  const jwt = useSelector((state) => state.user.jwt);

  const { isLoading, error, data, refetch } = useQuery(
    "bgs",
    async () =>
      await axios.get(`${ROOT}/api/admin/blog/latest5`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          token: `Bearer ${jwt}`,
        },
      })
  );

  useEffect(() => {
    setBlogs(data?.data?.blogs);
    refetch();
  }, [data?.data]);

  isLoading && <Loader />;
  error && console.log(error);

  return (
    <div className="col-12 xl:col-6">
      <div className="card">
        <h5>Recent Blogs</h5>
        <DataTable value={blogs} rows={5} paginator responsiveLayout="scroll">
          <Column
            header="Image"
            body={(res) => (
              <img
                className="shadow-2"
                src={`${res.image}`}
                alt={res.slug}
                width="50"
              />
            )}
          />
          <Column
            field="title"
            header="Name"
            body={(res) => <span> {res.title} </span>}
            sortable
            style={{ width: "35%" }}
          />
          <Column
            field="author"
            header="Author"
            sortable
            style={{ width: "35%" }}
            body={(res) => <span> {res.author} </span>}
          />

          <Column
            field="createdAt"
            header="Create At"
            sortable
            style={{ width: "35%" }}
            body={(res) => <span> {res.createdAt.substring(0, 10)} </span>}
          />

          <Column
            header="View"
            style={{ width: "15%" }}
            body={() => (
              <>
                <Button icon="pi pi-search" type="button" text />
              </>
            )}
          />
        </DataTable>
      </div>

    </div>
  );
};

export default RecentBlog;
