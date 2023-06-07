/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { InputText } from "primereact/inputtext";
import Link from "next/link";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../../store/userSlice";
import { jwtSuccess } from "../../../store/userSlice";
import { providerSuccess } from "../../../store/userSlice";
import { loginFailure } from "../../../store/userSlice";
import Loader from "../../../components/Shared/Loader";
import { Toast } from "primereact/toast";

const LoginPage = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const toast = useRef(null);

  const dispatch = useDispatch();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data } = await axios.post(
        "https://front-end-msajiba.vercel.app/api/auth/signin",
        { emailId, password }
      );
      dispatch(loginSuccess(data.user));
      dispatch(jwtSuccess(data.token));
      dispatch(providerSuccess("email-password"));

      await axios.post(
        "https://front-end-msajiba.vercel.app/api/profile/store",
        {
          email: data.user.email,
          user_id_no: data.user._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            token: `Bearer ${data.token}`,
          },
        }
      );
      setIsLoading(false);
      const redirectPath = router.query.redirect || "/dashboard";
      router.push(redirectPath);
    } catch (error) {
      dispatch(loginFailure());
      setIsLoading(false);
      if (error?.response) {
        toast.current.show({
          severity: "error",
          detail: `${error?.response?.data?.error}`,
          life: 3000,
        });
      }
    }
  };

  return (
    <div>
      <Toast ref={toast} />

      {!isLoading ? (
        <div className="flex flex-column align-items-center justify-content-center">
          <div
            style={{
              borderRadius: "56px",
              padding: "0.3rem",
              background:
                "linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)",
            }}
          >
            <div
              className="w-full surface-card py-8 px-5 sm:px-8"
              style={{ borderRadius: "53px" }}
            >
              <div className="text-center mb-5">
                <img src="/logo.jpg" alt="Image" height="50" className="mb-3" />
                <div className="text-900 text-3xl font-medium mb-3">
                  Welcome To Dashboard
                </div>
                <span className="text-600 font-medium">
                  Sign in to continue
                </span>
              </div>

              <form onSubmit={handleSignIn}>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-900 text-xl font-medium mb-2"
                  >
                    Email
                  </label>
                  <InputText
                    id="email"
                    value={emailId}
                    onChange={(e) => setEmailId(e.target.value)}
                    type="email"
                    placeholder="Email address"
                    className="w-full md:w-30rem mb-5"
                    required
                    style={{ padding: "1rem" }}
                  />

                  <label
                    htmlFor="password"
                    className="block text-900 font-medium text-xl mb-2"
                  >
                    Password
                  </label>
                  <Password
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    toggleMask
                    required
                    className="w-full mb-5"
                    inputClassName="w-full p-3 md:w-30rem"
                  />

                  <div className="flex align-items-center justify-content-between mb-5 gap-5">
                    <Link
                      href="#"
                      className="font-medium no-underline ml-2 text-right cursor-pointer"
                      style={{ color: "var(--primary-color)" }}
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    label="Sign In"
                    type="submit"
                    className="w-full p-3 text-xl"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default LoginPage;
