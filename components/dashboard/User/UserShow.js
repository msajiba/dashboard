import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { InputText } from "primereact/inputtext";

const UserShow = ({ rowData, refetch }) => {
  const [deleteUser, setDeleteUser] = useState(false);
  const [selectUser, setSelectUser] = useState(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const confirmDeleteCtg = (user) => {
    setSelectUser(user);
    setName(user.name);
    setEmail(user?.email);
    setDeleteUser(true);
  };

  return (
    <>
      <Dialog
        visible={deleteUser}
        style={{ width: "800px" }}
        header="Show User Information"
        modal
        onHide={() => setDeleteUser(false)}
      >
        <div className="card">
          <div className=" mb-5 flex flex-column md:flex-row gap-3">
            <div className="p-inputgroup flex-1">
              <span className="p-inputgroup-addon">
                <i className="pi pi-user"> Name</i>
              </span>
              <InputText placeholder="Username" value={name} disabled />
            </div>
            <div className="p-inputgroup flex-1">
              <span className="p-inputgroup-addon">
                <i className="pi pi-comments"> Email</i>
              </span>
              <InputText placeholder="Username" value={email} disabled />
            </div>
          </div>

          <div className=" flex flex-column md:flex-row gap-3">
            <div className="p-inputgroup flex-1">
              <span className="p-inputgroup-addon">
                <i className="pi pi-phone"> Phone</i>
              </span>
              <InputText
                placeholder="Username"
                value={selectUser?.phone}
                disabled
              />
            </div>
            <div className="p-inputgroup flex-1">
              <span className="p-inputgroup-addon">
                <i className="pi pi-user"> ID</i>
              </span>
              <InputText
                placeholder="Username"
                value={selectUser?.user_id_no}
                disabled
              />
            </div>
          </div>

          <div className="mt-5 flex flex-column md:flex-row gap-3">
            <div className="p-inputgroup flex-1">
              <span className="p-inputgroup-addon">
                <i className="pi pi-address"> Address </i>
              </span>
              <InputText
                placeholder="Username"
                value={selectUser?.address}
                disabled
              />
            </div>
            <div className="p-inputgroup flex-1">
              <span className="p-inputgroup-addon">
                <i className="pi pi-address"> City </i>
              </span>
              <InputText
                placeholder="Username"
                value={selectUser?.city}
                disabled
              />
            </div>
          </div>

          <div className="mt-5 flex flex-column md:flex-row gap-3">
            <div className="p-inputgroup flex-1">
              <span className="p-inputgroup-addon">
                <i className="pi pi-address"> Country </i>
              </span>
              <InputText
                placeholder="Username"
                value={selectUser?.country}
                disabled
              />
            </div>

            <div className="p-inputgroup flex-1">
              <span className="p-inputgroup-addon">
                <i className="pi pi-address"> Post Code</i>
              </span>
              <InputText
                placeholder="Username"
                value={selectUser?.address}
                disabled
              />
            </div>
          </div>
        </div>
      </Dialog>

      <Button
        className="mx-1"
        icon="pi pi-eye"
        severity="info"
        rounded
        onClick={() => confirmDeleteCtg(rowData)}
      />
    </>
  );
};

export default UserShow;
