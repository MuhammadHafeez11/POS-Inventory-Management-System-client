import { useContext, useState, useEffect } from "react";
import { State } from "../context/ContextSales";
import {COMPANYHEADER} from '../../../../constants/companyNameContants'
import { getPurchaseDetailForPreview } from "../../../../actions/purchaseAction";
export default function Header({ selectedPrinter }) {
  
  const [shopAddress, setShopAddress] = useState("");
  const [shopPhoneNumber, setShopPhoneNo] = useState("");
  const { purchaseId } = useContext(State);
  useEffect(() => {
    getspecificDataforInvoice();
  }, []);

  const getspecificDataforInvoice = async () => {
    let result = await getPurchaseDetailForPreview(purchaseId);
    // console.log(result)
    setShopAddress(result?.data?.address);
    setShopPhoneNo(result?.data?.phoneNo);
  };
  return (
    <>
    
       <div className="headerHeading">
          <h1 className="invoiceTitle">{COMPANYHEADER}</h1>
          <p className="invoiceAddress">{shopAddress}</p>
          <p className="invoicePhoneNo">
            <h4>Phone No: &nbsp;{shopPhoneNumber}</h4>
          </p>
        </div>
 
    </>
  );
}
