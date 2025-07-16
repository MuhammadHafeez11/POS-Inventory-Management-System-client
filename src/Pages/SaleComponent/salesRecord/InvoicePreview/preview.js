import React, { useContext, useEffect } from "react";
import { State } from "../context/ContextSales";
import ReactToPrint from "react-to-print";
import MetaData from "../../../../MetaData";
import { useState } from "react";
import { Button } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import Tablee from "./table";
import Header from './Header'
import Dates from './Dates'
import { getSpecificSaleProduct } from "../../../../actions/saleProductAction";
import { COMPANYHEADER, QURESHI_ELECTRONICS } from "../../../../constants/companyNameContants";
import Invoice from "../../../../Components/Printer/MainPrinter";
export default function Table() {
  const { salesId, salesRef } = useContext(State);
  const [productss, setProductss] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [colorTheme, setColorTheme] = useState("theme-white");
  const [selected, setselected] = useState(false)
  const navigate = useNavigate();

  const [selectedPrinter, setSelectedPrinter] = useState();

  const handleSelectPrinter = (printer) => {
    setSelectedPrinter(printer);
    setselected(true)
  };

  useEffect(() => {
    const currentColorTheme = localStorage.getItem("theme-color");
    if (currentColorTheme) {
      setColorTheme(currentColorTheme);
    }
  }, [colorTheme]);

  useEffect(()=>{
    getspecificDataforInvoice()
  }, [])

  const getspecificDataforInvoice = async () => {
    console.log(salesId)
    let result = await getSpecificSaleProduct(salesId);
    setProductss(result?.data);
    setLoading(true);
  };
  const backHandle = () => {
    // navigate("/Salerecord");
    navigate(-1);
  };

  const columns = [
    { field: "Code", label: "Code" },
    { field: "Namee", label: "Name" },
    { field: "color", label: "Color" },
    { field: "Company", label: "Company" },
    { field: "PurchaseQuantity", label: "Qty" },
    { field: "excludeTaxPrice", label: "Price" },
    { field: "totalAmounnt", label: "Total" },
    { field: "Discount", label: "Disc" },
    { field: "taxAmount", label: "Tax" },
    { field: "amount", label: "Due" },
  ];

  const withoutFBRColumns = [
    { field: "Code", label: "Code" },
    { field: "Namee", label: "Name" },
    { field: "color", label: "Color" },
    { field: "Company", label: "Company" },
    { field: "PurchaseQuantity", label: "Qty" },
    { field: "excludeTaxPrice", label: "Price" },
    { field: "totalAmounnt", label: "Total" },
    { field: "Discount", label: "Disc" },
    { field: "taxAmount", label: "Tax" },
    { field: "amount", label: "Due" },
  ];

  const invoiceData = {
    invoiceTitle: "Sale Invoice",
    companyTitle: COMPANYHEADER,
    address: productss.address,
    contact: productss.phoneNo,

    customerTitle: "Name",
    customerTitleValue: `${productss.customerName}`,
    customerPhoneTitle: "Contact",
    customerPhoneValue: `${productss.customerNumber}`,
    generatedBy: productss.saleBy,


    billingDetailsFirstTitle: "FBR #",
    billingDetailsSecondTitle:`Invoice Number`,
    billingDetailsThirdTitle:`Dated`,
    billingDetailsFirstValue: productss.invoiceNumber,
    billingDetailsSecondValue:productss.id,
    billingDetailsThirdValue:`${new Date(productss?.createdAt).toLocaleDateString(
      "en-GB"
    )}`,

    columns,
    listData: productss.products,

    FBRInvoiceNumber: productss.invoiceNumber,
    totalFirstTitle: "Due Amount",
    totalFirstValue: productss.total, 
    terms: 'Qureshi Electronics Corporation',
  };

  const withoutFBRinvoiceData = {
    invoiceTitle: "Sale Invoice",
    companyTitle: COMPANYHEADER,
    address: productss.address,
    contact: productss.phoneNo,

    customerTitle: "Name",
    customerTitleValue: `${productss.customerName}`,
    customerPhoneTitle: "Contact",
    customerPhoneValue: `${productss.customerNumber}`,
    generatedBy: productss.saleBy,


    // billingDetailsFirstTitle: "FBR #",
    billingDetailsSecondTitle:`Invoice Number`,
    billingDetailsThirdTitle:`Dated`,
    // billingDetailsFirstValue: productss.invoiceNumber,
    billingDetailsSecondValue:productss.id,
    billingDetailsThirdValue:`${new Date(productss?.createdAt).toLocaleDateString(
      "en-GB"
    )}`,

    columns: withoutFBRColumns,
    listData: productss.products,

    // FBRInvoiceNumber: productss.invoiceNumber,
    totalFirstTitle: "Due Amount",
    totalFirstValue: productss.total, 
    terms: 'Qureshi Electronics Corporation',
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
                <button className="printButton">
                  Print / Download
                </button>
              )}
              content={() => salesRef.current}
            />
          </div>
          <div  className="previewTableContent"> 
            <div className="previewInvoice"  
              style={{  border: "2px solid black",
              margin: '10px',
              display: "flex",
              padding: "15px",
              paddingBottom: "0px",
              flexDirection: "column",
              alignItems: "center",
              }} >
              <Header  />
              <Dates />
              <Tablee />
            </div>
          </div>
          <div className="print-only-container">
            <div id="invoice" ref={salesRef} className="p-5">
                  {
                      QURESHI_ELECTRONICS === "QURESHI_ELECTRONICS_WITH_FBR" ? (
                        <>
                         <Invoice invoiceData={invoiceData} />
                        </>
                      ) : (
                        <>
                         <Invoice invoiceData={withoutFBRinvoiceData} />
                        </>
                      )
                    }
            </div>
          </div>
      </div>
    </div>
    </>
  );
}
