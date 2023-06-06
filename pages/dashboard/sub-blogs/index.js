/* eslint-disable */
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Toolbar } from "primereact/toolbar";
import React, { useEffect, useRef, useState } from "react";
import DashboardContainer from "../../../layout/DashboardContainer";
import axios from "axios";
import { useQuery } from "react-query";
import Loader from "../../../components/Shared/Loader";
import { Badge } from "primereact/badge";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import EditSubBlog from "../../../components/dashboard/SubBlogs/EditSubBlog";
import NewSubBlog from "../../../components/dashboard/SubBlogs/NewSubBlog";
import DeleteSubBlog from "../../../components/dashboard/SubBlogs/DeleteSubBlog";

const SubBlogs = ({ blogs }) => {

  const [subBlogs, setSubBlogs] = useState(null);
  const [selectedSubBlog, setSelectedSubBlog] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const dt = useRef(null);
  const user = useSelector((state) => state.user.currentUser);
  const router = useRouter();

  if (!user) {
    router.push("/auth/login");
    return null;
  }

  const { isLoading, error, data, refetch } = useQuery(
    "sbCtg",
    async () =>
      await axios.get("https://front-end-msajiba.vercel.app/api/admin/sub-blog/getAll")
  );

  isLoading && <Loader />;
  error && console.log(error);

  useEffect(() => {
    setSubBlogs(data?.data?.subBlogs);
    refetch();
  }, [data?.data?.subBlogs]);

  const codeBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Code</span>
        {rowData._id}
      </>
    );
  };

  const titleBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Title</span>
        {rowData.title}
      </>
    );
  };



  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <EditSubBlog
          rowData={rowData}
          refetch={refetch}
          blogs={blogs}
        />
        {/* ===========================================DELETE_SUB_CATEGORY_HANDLER ==================================== */}
        <DeleteSubBlog rowData={rowData} refetch={refetch} />
      </>
    );
  };

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">
        SUB BLOG -
        <Badge
          className="ml-2"
          value={subBlogs?.length}
          size="large"
          severity="success"
        />
      </h5>
      <span className="block mt-2 md:mt-0 p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
        />
      </span>
    </div>
  );

  return (
    <DashboardContainer>
      <div className="grid crud-demo">
        <div className="col-12">
          <div className="card">
            {/* ADD NEW SUB CATEGORY  */}
            <Toolbar
              className="mb-4"
              right={
                <NewSubBlog blogs={blogs} refetch={refetch} />
              }
            />
            <DataTable
              ref={dt}
              value={subBlogs}
              selection={selectedSubBlog}
              onSelectionChange={(e) => setSelectedSubBlog(e.value)}
              dataKey="_id"
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25]}
              className="datatable-responsive"
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
              globalFilter={globalFilter}
              emptyMessage="No Sub Category found."
              header={header}
              responsiveLayout="scroll"
            >
              <Column
                field="code"
                header="ID"
                sortable
                body={codeBodyTemplate}
                headerStyle={{ minWidth: "5rem" }}
              />

              <Column
                field="title"
                header="Title"
                sortable
                body={titleBodyTemplate}
                headerStyle={{ minWidth: "15rem" }}
              />

              <Column
                field="Action"
                header="Action"
                body={actionBodyTemplate}
                headerStyle={{ minWidth: "10rem" }}
              />
            </DataTable>
          </div>
        </div>
      </div>
    </DashboardContainer>
  );
};

export default SubBlogs;

// export async function getServerSideProps() {
//   const res = await axios.get(
//     "https://front-end-msajiba.vercel.app/api/admin/sub-category/getAll"
//   );
//   const blogs = res?.data?.blogs;
//   return {
//     props: {
//       blogs: JSON.parse(JSON.stringify(blogs)),
//     },
//   };
// }
