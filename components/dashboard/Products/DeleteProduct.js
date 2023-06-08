import axios from "axios";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { ProgressBar } from "primereact/progressbar";
import { Toast } from "primereact/toast";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { mainAPI } from "../../../uitls/api";


const ROOT = mainAPI;

const DeleteProduct = ({ rowData, refetch }) => {
  const jwt = useSelector((state) => state.user.jwt);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [selectProduct, setSelectProduct] = useState(null);
  const toast = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const deleteHandleProduct = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        `${ROOT}/api/admin/product/delete`,
        { id: selectProduct._id },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            token: `Bearer ${jwt}`,
          },
        }
      );

      if (data.status == true) {
        toast.current.show({
          severity: "success",
          detail: `${data.message}`,
          life: 2000,
        });
        setDeleteProductDialog(false);
        setDeleteProductDialog(false);
        refetch();
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const ctgDialogFooter = (
    <>
      <Button
        label="Cancel"
        icon="pi pi-times"
        text
        onClick={() => setDeleteProductDialog(false)}
      />
      <Button
        label="Delete"
        icon="pi pi-check"
        text
        onClick={deleteHandleProduct}
      />
    </>
  );

  const confirmDeleteCtg = (sbCtg) => {
    setSelectProduct(sbCtg);
    setDeleteProductDialog(true);
  };

  return (
    <>
      <Toast ref={toast} />

      <Dialog
        visible={deleteProductDialog}
        style={{ width: "450px" }}
        header="Confirm"
        modal
        footer={ctgDialogFooter}
        onHide={() => setDeleteProductDialog(false)}
      >
        <div className="flex align-items-center justify-content-center">
          <Avatar image={selectProduct?.image} size="xlarge" shape="circle" />
        </div>
        <div className="flex align-items-center justify-content-center">
          <i
            className="pi pi-exclamation-triangle mr-3 "
            style={{ fontSize: "2rem" }}
          />
          {selectProduct && (
            <span>
              Are you sure you want to delete <b>{selectProduct?.title}</b>?
            </span>
          )}
        </div>
        {isLoading && (
          <ProgressBar
            mode="indeterminate"
            className="mt-5"
            style={{ height: "6px", width: "200px", margin: "0px auto" }}
          ></ProgressBar>
        )}
      </Dialog>

      <Button
        icon="pi pi-trash"
        severity="warning"
        rounded
        onClick={() => confirmDeleteCtg(rowData)}
      />
    </>
  );
};

export default DeleteProduct;
