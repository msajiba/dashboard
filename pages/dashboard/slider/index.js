/* eslint-disable */
import React, { useEffect, useRef, useState } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Toolbar } from "primereact/toolbar";
import DashboardContainer from "../../../layout/DashboardContainer";
import axios from "axios";
import { useQuery } from "react-query";
import { Badge } from "primereact/badge";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { Avatar } from "primereact/avatar";
import EditSlider from "../../../components/dashboard/Slider/EditSlider";
import NewSlider from "../../../components/dashboard/Slider/NewSlider";
import DeleteSlide from "../../../components/dashboard/Slider/DeleteSlider";
import Loader from "../../../components/Shared/Loader";
import { mainAPI } from "../../../uitls/api";

const ROOT = mainAPI;

const Slider = () => {
  const user = useSelector((state) => state.user.currentUser);
  const [sliders, setSliders] = useState(null);
  const [selectedSlider, setSelectedSlider] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const dt = useRef(null);
  const router = useRouter();

  if (!user) {
    router.push("/auth/login");
    return null;
  }

  const { isLoading, error, data, refetch } = useQuery(
    "slider",
    async () => await axios.get(`${ROOT}/api/admin/slider/getAll`)
  );
  isLoading && <Loader />;
  error && console.log(error);

  useEffect(() => {
    setSliders(data?.data?.sliders);
    refetch();
  }, [data?.data?.sliders]);

  const codeBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Code</span>
        {rowData._id}
      </>
    );
  };

  const imageBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Image</span>
        <Avatar image={`${rowData?.image}`} size="xlarge" shape="circle" />
      </>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <EditSlider rowData={rowData} refetch={refetch} />
        {/* ===========================================DELETE_SUB_CATEGORY_HANDLER ==================================== */}
        <DeleteSlide rowData={rowData} refetch={refetch} />
      </>
    );
  };

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">
        Banner Slides -
        <Badge
          className="ml-2"
          value={sliders?.length}
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
      {sliders ? (
        <div className="grid crud-demo">
          <div className="col-12">
            <div className="card">
              {/* ADD NEW SUB CATEGORY  */}
              <Toolbar
                className="mb-4"
                right={<NewSlider refetch={refetch} />}
              />
              <DataTable
                ref={dt}
                value={sliders}
                selection={selectedSlider}
                onSelectionChange={(e) => setSelectedSlider(e.value)}
                dataKey={sliders._id}
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25]}
                className="datatable-responsive"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Sliders"
                globalFilter={globalFilter}
                emptyMessage="No Sliders found..."
                header={header}
                responsiveLayout="scroll"
              >
                <Column
                  field="_id"
                  header="ID"
                  sortable
                  body={codeBodyTemplate}
                  headerStyle={{ minWidth: "5rem" }}
                />
                <Column
                  field="image"
                  header="IMAGE"
                  sortable
                  body={imageBodyTemplate}
                  headerStyle={{ minWidth: "10rem" }}
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
      ) : (
        <Loader />
      )}
    </DashboardContainer>
  );
};

export default Slider;
