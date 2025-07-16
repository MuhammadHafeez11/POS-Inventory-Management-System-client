import React, { useContext, useEffect } from "react";
import { State } from "../context/ContextSales";
import ReactToPrint from "react-to-print";
import { useState } from "react";
import { Dropdown, Button } from "semantic-ui-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import MetaData from "../../../../MetaData";
import TableComponentId from "../../../../Components/tableComponent/tableComponentId";
import Header from "./Headers"
import Tablee from "./table";
import Dates from "./Dates";
export default function Table() {
  const { salesId, setSalesId, salesRef } = useContext(State);
  const [invoicedata, setInvoicedata] = useState([]);
  const [productss, setProductss] = useState([]);
  const [loading, setLoading] = useState(false);
  const [storageAddress, setStorageAddress] = useState("");
  const [storagePhoneNo, setStoragePhoneNo] = useState("");
  const [selectedPrinter, setSelectedPrinter] = useState();
  const [colorTheme, setColorTheme] = useState("theme-white");
  const [selected, setSelected] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    const currentColorTheme = localStorage.getItem("theme-color");
    if (currentColorTheme) {
      setColorTheme(currentColorTheme);
    }
  }, [colorTheme]);



  const handleSelectPrinter = (printer) => {
    setSelectedPrinter(printer);
    setSelected(true)
  };

  const backHandle = () => {
    navigate("/TranferPreview");
  };

  return (
    <>
      <MetaData title="QE ~~InvoicePreview" />
      <div className={`Purchase ${colorTheme}`}>
      <div className="secondContainer">
      <div className="purchaseProduct-box">
      <Button
        positive
        onClick={backHandle}
      >
        Back
      </Button>
      <ReactToPrint
            trigger={() => (
              // selected ?(
              <button className="printButton">
                Print / Download
              </button>
              // ):(<h1></h1>)
            )}
            content={() => salesRef.current}
          />
      </div>
        {/* <div
         className="previewInvoice"
        > */}
          {/* <PrinterSelectionDropdown
            selectedPrinter={selectedPrinter}
            onSelectPrinter={handleSelectPrinter}
          /> */}
           <div  className="previewTableContent"> 
          <div  ref={salesRef} className="previewInvoice"  
                  style={{  
                      border: "2px solid black",
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
          </div>
          {/* <div ref={salesRef}  style={{overflow: "auto", height: "100%"}}  className="p-5">
          <div className="printPagePrev" style={{margin: "10px", border: "2px solid black", padding: "10px"}}>
            <Header />
            <Dates />
            <Tablee />
          </div>
          </div> */}
        {/* </div> */}
        </div>
        </div>
    </>
  );
}
