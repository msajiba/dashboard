import axios from "axios";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import React, { useRef, useState } from "react";

const DeleteProduct = ({ rowData, refetch }) => {
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [selectProduct, setSelectProduct] = useState(null);
  const toast = useRef(null);

  const deleteHandleProduct = async () => {
    try {
      const { data } = await axios.delete(
        `http://localhost:3000/api/admin/product`,
        {
          data: { id: selectProduct._id },
        }
      );

      if (data.status) {
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: `${data.message}`,
          life: 2000,
        });
        setDeleteProductDialog(false);
        setDeleteProductDialog(false);
        refetch();
      }
    } catch (error) {
      console.log(error);
    }
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
        label="Save"
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
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {selectProduct && (
            <span>
              Are you sure you want to delete <b>{selectProduct?.name}</b>?
            </span>
          )}
        </div>
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
