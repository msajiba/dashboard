/* eslint-disable */
import React, { useEffect, useRef, useState } from "react";
import DashboardContainer from "../../../layout/DashboardContainer";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import axios from "axios";
import ChangePassword from "../../../components/dashboard/Profile/ChangePassword";
import Loader from "../../../components/Shared/Loader";
import { mainAPI } from "../../../uitls/api";


const ROOT = mainAPI;

const Profile = () => {
  const user = useSelector((state) => state.user.currentUser);
  const jwt = useSelector((state) => state.user.jwt);
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const toast = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const getUserInfo = async () => {
    setIsLoading(true);
    const { data } = await axios.post(
      `${ROOT}/api/profile/find`,
      {
        user_id_no: user._id,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          token: `Bearer ${jwt}`,
        },
      }
    );

    setAddress(data?.address);
    setPostalCode(data?.post_code);
    setCity(data?.city);
    setCountry(data?.country);
    setName(data?.name);
    setEmail(data?.email);
    setPhone(data?.phone);
    setIsLoading(false);
  };

  useEffect(() => {
    getUserInfo();
  }, [user._id]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const updatedProfileData = await axios.post(
        `${ROOT}/api/profile/update`,
        {
          name: name,
          email: email,
          phone: phone,
          address: address,
          post_code: postalCode,
          city: city,
          country: country,
          user_id_no: user._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            token: `Bearer ${jwt}`,
          },
        }
      );
      setIsLoading(false);
      if (updatedProfileData.status === 200) {
        toast.current.show({
          severity: "success",
          detail: "User Update successfully",
          life: 3000,
        });
        setIsLoading(false);
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
      <Toast ref={toast} />
      {!isLoading ? (
        <div className="grid">
          <div className="col-12">
            <div className="card">
              <h5>Profile Information</h5>

              <form
                onSubmit={handleUpdateProfile}
                className="flex flex-column gap-2"
              >
                <div className="p-fluid formgrid grid">
                  <div className="field col-12 md:col-4">
                    <label htmlFor="userName">User Name</label>
                    <InputText
                      id="userName"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
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
                      type="number"
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

                  <div className="field col-12 md:col-4">
                    <label htmlFor="postal">Postal Code</label>
                    <InputText
                      id="postal"
                      value={postalCode}
                      onChange={(e) => {
                        setPostalCode(e.target.value);
                      }}
                      type="number"
                    />
                  </div>

                  <div className="field col-12 md:col-4">
                    <label htmlFor="city">City</label>
                    <InputText
                      id="city"
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                      }}
                      type="text"
                    />
                  </div>

                  <div className="field col-12 md:col-4">
                    <label htmlFor="country">Country</label>
                    <InputText
                      id="country"
                      value={country}
                      onChange={(e) => {
                        setCountry(e.target.value);
                      }}
                      type="text"
                    />
                  </div>
                </div>
                <Button type="submit" label="Save"></Button>
              </form>
            </div>
          </div>
          <ChangePassword />
        </div>
      ) : (
        <Loader />
      )}
    </DashboardContainer>
  );
};

export default Profile;
