import axios from "axios";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import React, { useRef, useState } from "react";
import { Password } from "primereact/password";
import { useSelector } from "react-redux";

const ChangePassword = () => {
  const jwt = useSelector((state) => state.user.jwt);
  const [changePasswordDialog, setChangePasswordDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const toast = useRef(null);

  const updatePassword = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    try {
      const res = await axios.post(
        "https://front-end-msajiba.vercel.app/api/auth/change-password",
        {
          currentPassword: currentPassword,
          password: password,
          passwordConfirmation: passwordConfirmation,
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      toast.current.show({
        severity: "success",
        detail: "Password Change successfully",
        life: 3000,
      });
      setPassword("");
      setCurrentPassword("");
      setPasswordConfirmation("");
      setChangePasswordDialog(false);
    } catch (error) {
      toast.current.show({
        severity: "error",
        detail: `${error?.response?.data?.error?.message}`,
        life: 3000,
      });
    }
  };

  return (
    <>
      <Toast ref={toast} />

      <Button
        label="Password Change"
        severity="success"
        className="mr-2"
        onClick={() => setChangePasswordDialog(true)}
      />

      <Dialog
        visible={changePasswordDialog}
        style={{ width: "500px" }}
        header="CHANGE PASSWORD"
        modal
        className="p-fluid"
        onHide={() => setChangePasswordDialog(false)}
      >
        <>
          <form onSubmit={updatePassword}>
            <div>
              <div className="field">
                <label htmlFor="current-password">Current Password </label>
                <InputText
                  id="current-password"
                  type="password"
                  name="currentPassword"
                  required
                  value={currentPassword}
                  onChange={(e) => {
                    return setCurrentPassword(e.target.value);
                  }}
                  className={classNames({
                    "p-invalid": submitted && !currentPassword,
                  })}
                />
                {submitted && !currentPassword && (
                  <small
                    style={{ fontSize: "1rem", color: "red" }}
                    className="p-invalid"
                  >
                    CurrentPassword is required.
                  </small>
                )}
              </div>

              <div className="field">
                <label htmlFor="password">Password </label>
                <InputText
                  id="password"
                  type="password"
                  name="password"
                  required
                  value={password}
                  onChange={(e) => {
                    return setPassword(e.target.value);
                  }}
                  className={classNames({
                    "p-invalid": submitted && !password,
                  })}
                />
                {submitted && !password && (
                  <small
                    style={{ fontSize: "1rem", color: "red" }}
                    className="p-invalid"
                  >
                    Password is required.
                  </small>
                )}
              </div>

              <div className="field">
                <label htmlFor="cnf">Confirmed Password</label>
                <Password
                  id="cnf"
                  type="password"
                  name="passwordConfirmation"
                  toggleMask
                  required
                  value={passwordConfirmation}
                  onChange={(e) => {
                    return setPasswordConfirmation(e.target.value);
                  }}
                  className={classNames({
                    "p-invalid": submitted && !passwordConfirmation,
                  })}
                />
                {submitted && !passwordConfirmation && (
                  <small
                    style={{ fontSize: "1rem", color: "red" }}
                    className="p-invalid"
                  >
                    PasswordConfirmation is required.
                  </small>
                )}
              </div>
            </div>
            <div>
              {password !== passwordConfirmation &&
                passwordConfirmation.length > 0 && (
                  <span style={{ color: "brown", fontWeight: 600 }}>
                    Passwords should be matched
                  </span>
                )}
            </div>
            {/* {isLoading && <p> loading...</p>} */}

            <Button type="submit" label="Save" icon="pi" />
          </form>
        </>
      </Dialog>
    </>
  );
};

export default ChangePassword;
