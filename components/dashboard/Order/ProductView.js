/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from "react";
import { OrderList } from "primereact/orderlist";
import { ToggleButton } from "primereact/togglebutton";
import { Dropdown } from "primereact/dropdown";
import { Fieldset } from "primereact/fieldset";

export default function ProductView({ pd }) {
  const [products, setProducts] = useState(pd);

  const itemTemplate = (item) => {
    return (
      <div className="flex flex-wrap p-2 align-items-center gap-3">
        <img
          className="w-4rem shadow-2 flex-shrink-0 border-round"
          src={`${item.image}`}
          alt={item.name}
        />
        <div className="flex-1 flex flex-column gap-2 xl:mr-8">
          <span className="font-bold"> Name: {item.name}</span>
          <div className="flex align-items-center gap-2">
            <i className="pi pi-tag text-sm"></i>
            <span>{item.category}</span>
          </div>
        </div>
        <span className="font-bold text-900"> quantity: {item.quantity} ({item.quantityPrice}) </span>
        <span className="font-bold text-900"> Price: ${item.price}</span>
      </div>
    );
  };

  
  const legendTemplate = (
    <div className="flex align-items-center text-primary">
      <span className="pi pi-shopping-cart mr-2"></span>
      <span className="font-bold text-lg"> Products Information </span>
    </div>
  );

  return (
    <div className="xl:flex xl:justify-content-center">
      <Fieldset legend={legendTemplate}>
        <OrderList
          value={products}
          itemTemplate={itemTemplate}
        />
      </Fieldset>
    </div>
  );
}
