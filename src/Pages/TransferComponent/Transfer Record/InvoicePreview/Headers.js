import { useContext, useState, useEffect } from "react";
import { State } from "../context/ContextSales";
import {COMPANYHEADER} from '../../../../constants/companyNameContants'
import { getTransferDetailsForPreview } from "../../../../actions/transferAction";
export default function Header({ selectedPrinter }) {
  const [storageAddress, setStorageAddress] = useState("");
  const [storagePhoneNo, setStoragePhoneNo] = useState("");
  const { salesId, setSalesId, salesRef } = useContext(State);
  //   const { storageAddress, storagePhoneNo } = useContext(State);

  useEffect(() => {
    getspecificDataforInvoice();
  }, []);

  const getspecificDataforInvoice = async () => {
    console.log(salesId);
    const result = await getTransferDetailsForPreview(salesId);
    console.log(result);
    setStorageAddress(result?.data?.address);
    setStoragePhoneNo(result?.data?.phoneNo);
  };

  return (
    <>
      {/* {selectedPrinter === "laser" ? ( */}
        <div className="headerHeading">
          <h1 className="invoiceTitle">{COMPANYHEADER}</h1>
          <p className="invoiceAddress">{storageAddress}</p>
          <p className="invoicePhoneNo">
            <h4>Phone No: &nbsp;{storagePhoneNo}</h4>
          </p>
        </div>
      {/* // ) : (
      //   <div className="headerHeading">
      //     <h1 className="invoiceTitle">Qureshi Electronics</h1>
      //     <p className="invoicePhoneNo">{storageAddress}</p>
      //     <p className="invoicePhoneNo">
      //       <p>Phone No: &nbsp;{storagePhoneNo}</p>
      //     </p>
      //   </div>
      // )} */}
    </>
  );
}
