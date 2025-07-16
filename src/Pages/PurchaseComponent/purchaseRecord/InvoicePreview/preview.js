import React, { useContext, useEffect } from "react";
import { State } from "../context/ContextSales"
import ReactToPrint from "react-to-print";
import { useState } from "react";
import { Dropdown, Button } from "semantic-ui-react";
import MetaData from "../../../../MetaData";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useCustomState } from "../../../../Variables/stateVariables";
import Header from "./headers";
import Tablee from "./table";
import Dates from "./dates";
export default function Table() {
  const [storageAddress, setStorageAddress] = useState("");
  const [storagePhoneNo, setStoragePhoneNo] = useState("");
  const [colorTheme, setColorTheme] = useState("theme-white");
  const { purchaseId, setPurchaseId, purchaseRef } = useContext(State);
  const [selected, setselected] = useState(false)
  const {
    invoicedata,
    setInvoicedata,
    Products,
    setProducts,
    loading,
    setLoading,
  } = useCustomState();
  const navigate = useNavigate();


  const [selectedPrinter, setSelectedPrinter] = useState();

  
  useEffect(() => {
    const currentColorTheme = localStorage.getItem("theme-color");
    if (currentColorTheme) {
      setColorTheme(currentColorTheme);
    }
  }, [colorTheme]);
  const handleSelectPrinter = (printer) => {
    setSelectedPrinter(printer);
    setselected(true)
  };

  const backHandle = () => {
    navigate("/purchaseRecord");
  };

  return (
    <>
      <MetaData title="QE ~~InvoicePreview" />
      <div className={`Purchase ${colorTheme}`}>
      <div className="secondContainer">
      <div className="purchaseProduct-box">
          <Button
            positive
            // style={{ height: "100%" }}
            onClick={backHandle}
            >
            Back
          </Button>
          <ReactToPrint
            trigger={() => (
              
              <button className="printButton">
                Print / Download
              </button>
              
            )}
            content={() => purchaseRef.current}
          />
      </div>
        {/* <div className="previewInvoice"> */}
         
          
          <div  className="previewTableContent"> 
          <div  ref={purchaseRef} className="previewInvoice"  
                  style={{  border: "2px solid black",
                      margin: '10px',
                      display: "flex",
                      padding: "15px",
                      paddingBottom: "0px",
                      flexDirection: "column",
                      alignItems: "center",
                      // overflowY: "scroll"
                      // justifyContent: "space-between",
                      }} >
            <Header  />
            <Dates />
            <Tablee />
            
          </div>
            {/* <Footer /> */}
          </div>
        </div>
        </div>
        {/* </div> */}
    </>
  );
}
