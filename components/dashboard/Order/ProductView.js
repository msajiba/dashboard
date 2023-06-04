import { Accordion, AccordionTab } from "primereact/accordion";
import React from "react";
import { Image } from "primereact/image";

const ProductView = ({ item }) => {
  return (
    <>
      {item.products && (
        <Accordion activeIndex={0}>
          {item.products.map((pd, i) => {
            return (
              <AccordionTab key={i} header={pd.title}>
                <div className=" flex justify-content-center">
                  <Image
                    src={`https://primefaces.org/cdn/primereact/images/product/${item.image}`}
                    zoomSrc={`https://primefaces.org/cdn/primereact/images/product/${item.image}`}
                    alt="Image"
                    width="100"
                    height="60"
                    preview
                  />
                </div>
                <div className=" pt-5">
                  <h6> Quantity: {pd.quantity} </h6>
                  <p> Price: {pd.price} </p>
                  <p> Category: {pd.category} </p>
                </div>
              </AccordionTab>
            );
          })}
        </Accordion>
      )}
    </>
  );
};

export default ProductView;
