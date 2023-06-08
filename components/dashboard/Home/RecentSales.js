/* eslint-disable @next/next/no-img-element */
import axios from "axios";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Menu } from "primereact/menu";
import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { mainAPI } from "../../../uitls/api";
import { useSelector } from "react-redux";
import Loader from "../../Shared/Loader";

const ROOT = mainAPI;

const RecentSales = () => {
  const [products, setProducts] = useState(null);
  const menu1 = useRef(null);
  const jwt = useSelector((state) => state.user.jwt);

  const formatCurrency = (value) => {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "BDT",
    });
  };

  const { isLoading, error, data, refetch } = useQuery(
    "category",
    async () =>
      await axios.get(`${ROOT}/api/admin/product/getAll`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          token: `Bearer ${jwt}`,
        },
      })
  );

  useEffect(() => {
    setProducts(data?.data?.products.slice(0,5));
    refetch();
  }, [data?.data]);

  isLoading && <Loader />


  return (
    <div className="col-12 xl:col-6">
      <div className="card">
        <h5>Recent Sales</h5>
        <DataTable
          value={products}
          rows={5}
          paginator
          responsiveLayout="scroll"
        >
          <Column
            header="Image"
            body={(data) => (
              <img
                className="shadow-2"
                src={`${data.image}`}
                alt={data.image}
                width="50"
              />
            )}
          />
          <Column
            field="name"
            header="Name"
            body={(data) => (
             <span> {data.title} </span>
            )}
            sortable
            style={{ width: "35%" }}
          />
          <Column
            field="price"
            header="Price"
            sortable
            style={{ width: "35%" }}
            body={(data) => formatCurrency(parseFloat(data.price))}
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
      <div className="card">
        <div className="flex justify-content-between align-items-center mb-5">
          <h5>Best Selling Products</h5>
          <div>
            <Button
              type="button"
              icon="pi pi-ellipsis-v"
              className="p-button-rounded p-button-text p-button-plain"
              onClick={(event) => menu1.current.toggle(event)}
            />
            <Menu
              ref={menu1}
              popup
              model={[
                { label: "Add New", icon: "pi pi-fw pi-plus" },
                { label: "Remove", icon: "pi pi-fw pi-minus" },
              ]}
            />
          </div>
        </div>
        <ul className="list-none p-0 m-0">
          <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
            <div>
              <span className="text-900 font-medium mr-2 mb-1 md:mb-0">
                Space T-Shirt
              </span>
              <div className="mt-1 text-600">Clothing</div>
            </div>
            <div className="mt-2 md:mt-0 flex align-items-center">
              <div
                className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
                style={{ height: "8px" }}
              >
                <div
                  className="bg-orange-500 h-full"
                  style={{ width: "50%" }}
                />
              </div>
              <span className="text-orange-500 ml-3 font-medium">%50</span>
            </div>
          </li>
          <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
            <div>
              <span className="text-900 font-medium mr-2 mb-1 md:mb-0">
                Portal Sticker
              </span>
              <div className="mt-1 text-600">Accessories</div>
            </div>
            <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
              <div
                className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
                style={{ height: "8px" }}
              >
                <div className="bg-cyan-500 h-full" style={{ width: "16%" }} />
              </div>
              <span className="text-cyan-500 ml-3 font-medium">%16</span>
            </div>
          </li>
          <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
            <div>
              <span className="text-900 font-medium mr-2 mb-1 md:mb-0">
                Supernova Sticker
              </span>
              <div className="mt-1 text-600">Accessories</div>
            </div>
            <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
              <div
                className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
                style={{ height: "8px" }}
              >
                <div className="bg-pink-500 h-full" style={{ width: "67%" }} />
              </div>
              <span className="text-pink-500 ml-3 font-medium">%67</span>
            </div>
          </li>
          <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
            <div>
              <span className="text-900 font-medium mr-2 mb-1 md:mb-0">
                Wonders Notebook
              </span>
              <div className="mt-1 text-600">Office</div>
            </div>
            <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
              <div
                className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
                style={{ height: "8px" }}
              >
                <div className="bg-green-500 h-full" style={{ width: "35%" }} />
              </div>
              <span className="text-green-500 ml-3 font-medium">%35</span>
            </div>
          </li>
          <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
            <div>
              <span className="text-900 font-medium mr-2 mb-1 md:mb-0">
                Mat Black Case
              </span>
              <div className="mt-1 text-600">Accessories</div>
            </div>
            <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
              <div
                className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
                style={{ height: "8px" }}
              >
                <div
                  className="bg-purple-500 h-full"
                  style={{ width: "75%" }}
                />
              </div>
              <span className="text-purple-500 ml-3 font-medium">%75</span>
            </div>
          </li>
          <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
            <div>
              <span className="text-900 font-medium mr-2 mb-1 md:mb-0">
                Robots T-Shirt
              </span>
              <div className="mt-1 text-600">Clothing</div>
            </div>
            <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
              <div
                className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
                style={{ height: "8px" }}
              >
                <div className="bg-teal-500 h-full" style={{ width: "40%" }} />
              </div>
              <span className="text-teal-500 ml-3 font-medium">%40</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default RecentSales;
