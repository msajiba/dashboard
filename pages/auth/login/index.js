import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import AppConfig from "../../../layout/AppConfig";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { InputText } from "primereact/inputtext";
import Link from "next/link";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../../store/userSlice";
import { jwtSuccess } from "../../../store/userSlice";
import { providerSuccess } from "../../../store/userSlice";
import { loginFailure } from "../../../store/userSlice";

const LoginPage = () => {

  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [checked, setChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  isLoading && console.log("......................");

  const dispatch = useDispatch();

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const { data } = await axios.post(
        "http://localhost:3000/api/auth/signin",
        { emailId, password }
      );
      dispatch(loginSuccess(data.user));
      dispatch(jwtSuccess(data.token));
      dispatch(providerSuccess("email-password"));

      await axios.post(
        "http://localhost:3000/api/profile/store",
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

      const redirectPath = router.query.redirect || "/dashboard";
      router.push(redirectPath);
      setIsLoading(false);

    } catch (error) {
      dispatch(loginFailure());
      setIsLoading(false);
      console.log(error);
    }
  };

  return (
    <div className="">
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
              <img
                src="/demo/images/login/avatar.png"
                alt="Image"
                height="50"
                className="mb-3"
              />
              <div className="text-900 text-3xl font-medium mb-3">
                Welcome To Dashboard
              </div>
              <span className="text-600 font-medium">Sign in to continue</span>
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
                  <div className="flex align-items-center">
                    <Checkbox
                      id="remember"
                      checked={checked}
                      onChange={(e) => setChecked(e.checked)}
                      className="mr-2"
                    ></Checkbox>
                    <label htmlFor="remember">Remember me</label>
                  </div>
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
                ></Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// LoginPage.getLayout = function getLayout(page) {
//   return (
//     <React.Fragment>
//       {page}
//       <AppConfig simple />
//     </React.Fragment>
//   );
// };
export default LoginPage;
