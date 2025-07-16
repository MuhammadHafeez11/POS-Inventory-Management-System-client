import { useState } from "react";
import React, { useContext, useEffect } from "react";
import { State } from "../context/ContextSales";
import {COMPANYHEADER} from "../../../../constants/companyNameContants" 
import { getSpecificSaleProduct } from "../../../../actions/saleProductAction";
export default function Header({ selectedPrinter }) {
  const { salesId, salesRef } = useContext(State);
  const [storageAddress, setStorageAddress] = useState("");
  const [storagePhoneNo, setStoragePhoneNo] = useState("");
  useEffect(()=>{
    getspecificDataforInvoice()
  }, [salesId])

  const getspecificDataforInvoice = async () => {
    console.log(salesId)
    let result = await getSpecificSaleProduct(salesId);
    setStorageAddress(result?.data?.address)
    setStoragePhoneNo(result?.data?.phoneNo)
  };
  return (
    <>
      {/* {selectedPrinter === "Laser" ? ( */}
        <div className="headerHeading">
          <h1 className="invoiceTitle">{COMPANYHEADER}</h1>
          <p className="invoiceAddress"> {storageAddress}</p>
          <p className="invoicePhoneNo">
            <p>
              Phone No:
              {storagePhoneNo}
            </p>
          </p>
        </div>
      {/* ) : (
        <div className="headerHeading">
          <h1 className="invoiceTitle">Qureshi Electronics</h1>
          <p className="invoicePhoneNo"> {storageAddress}</p>
          <p className="invoicePhoneNo">
            <p>
              Phone No:
              {storagePhoneNo}
            </p>
          </p>
        </div>
      )} */}
    </>
  );
}
