import React, { useContext, useEffect, useRef } from "react";
import ReactToPrint from "react-to-print";
import MetaData from "../../../../../MetaData";
import { useState } from "react";
import { Dropdown, Button } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { useCustomState } from "../../../../../Variables/stateVariables";
import { Statee } from "../../context/stateContext";
import Tablee from "./table";
import Header from "./headers";
import Dates from "./Dates";
import { getExpenseDetail, getExpenseDetailsForPreview } from "../../../../../actions/expenseAction";
export default function Table() {
  const { salesId, setSalesId,expenseId, storageAddress, storagePhoneNo } =
    useContext(Statee);
  const [expenseResult, setExpenseResult] = useState("");
  const [selectedPrinter, setSelectedPrinter] = useState();
  const [colorTheme, setColorTheme] = useState("theme-white");
  const [selected, setSelected] = useState(false)

  const handleSelectPrinter = (printer) => {
    setSelectedPrinter(printer);
    setSelected(true)
  };

  const salesRef = useRef();
  const {
    invoicedata,
    setInvoicedata,
    Products,
    setProducts,
    loading,
    setLoading,
  } = useCustomState();
  const navigate = useNavigate();

  useEffect(() => {
    getspecificDataforInvoice();
  }, []);

  useEffect(() => {
    const currentColorTheme = localStorage.getItem("theme-color");
    if (currentColorTheme) {
      setColorTheme(currentColorTheme);
    }
  }, [colorTheme]);

  const getspecificDataforInvoice = async () => {
    // let result = await getPurchaseDetail(salesId);
    // setInvoicedata(result);

    let result = await getExpenseDetail(expenseId);
    // console.log(result);
    // console.log(result.expenses);

    setProducts(result.expenses);
    setExpenseResult(result);

    // console.log(salesId);
    setLoading(true);
  };

  const backHandle = () => {
    navigate("/expenseInvoice");
  };

  return (
    <>
     <MetaData title="QE ~~InvoicePreview" />
      <div className={`Purchase ${colorTheme}`}>
      <div className="secondContainer">
      <div className="purchaseProduct-box">
      <Button
        positive
        // style={{ marginTop: "2%", marginLeft: "5%" }}
        onClick={backHandle}
      >
        Back
      </Button>
        <ReactToPrint
            trigger={() => (
              // selected ?(
              <button className="printButton">
                Print / Downloads
              </button>
              // ):(<h1></h1>)
            )}
            content={() => salesRef.current}
          />
        </div>
            <div  className="previewTableContent"> 
          <div  ref={salesRef} className="previewInvoice"  style={{  border: "2px solid black",
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
      {/* {loading && (
        <div
        className="previewInvoice"
        >
          <div ref={salesRef} className="p-5">
          <div style={{ border: "2px solid black", marginRight: "20px", padding: "15px", paddingBottom: "0px",  flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', }}>
            <Header selectedPrinter={selectedPrinter}/>
            <Dates selectedPrinter={selectedPrinter}/>
            <Tablee selectedPrinter={selectedPrinter}/> 
            </div>
          </div>
        </div>
      )} */}
      </div>
      </div>
    </>
  );
}
