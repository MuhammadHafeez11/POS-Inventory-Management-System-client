import { useState } from "react";
import React, { useContext, useEffect } from "react";

export default function Header({ selectedPrinter }) {
//   const { salesId, salesRef } = useContext(State);
//   const [storageAddress, setStorageAddress] = useState("");
//   const [storagePhoneNo, setStoragePhoneNo] = useState("");
//   useEffect(()=>{
//     getspecificDataforInvoice()
//   }, [salesId])

//   const getspecificDataforInvoice = async () => {
//     console.log(salesId)
//     let result = await getSpecificSaleProduct(salesId);
//     // setProductss(result?.products);
//     setStorageAddress(result?.data?.address)
//     setStoragePhoneNo(result?.data?.phoneNo)
//     console.log(result)
//     console.log(result?.data?.phoneNo)
//     // setLoading(true);
//   };
  return (
    <>
      {/* {selectedPrinter === "Laser" ? ( */}
        <div className="headerHeading">
          <h1 className="invoiceTitle">Qureshi Electronics</h1>
          {/* <p className="invoiceAddress"> {storageAddress}</p> */}
          <p className="invoicePhoneNo">
            <p>
              {/* Phone No: */}
              {/* {storagePhoneNo} */}
            </p>
          </p>
        </div>
     
    </>
  );
}
