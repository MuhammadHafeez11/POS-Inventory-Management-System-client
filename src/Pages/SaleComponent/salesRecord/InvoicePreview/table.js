import React, { useContext, useEffect, useState } from "react";
import { State } from "../context/ContextSales";
import QRCode from "react-qr-code";
import logo from "./pos.png";
import PrintTableComponent from "../../../../Components/tableComponent/printTableComponent";
import PrintLaserTable from "../../../../Components/tableComponent/printLaserTable"
import { getSpecificSaleProduct } from "../../../../actions/saleProductAction";
import { QURESHI_ELECTRONICS } from "../../../../constants/companyNameContants";

let quantity = [];
let discount = [];
let totalAmount = [];
let taxAmount = [];
let amount = [];
let excludeTaxPrice = []
export default function Tablee({ selectedPrinter }) {
  let action4 = "salesRecipt";
  const { salesId } = useContext(State);
  let productsforlisting = [];
  const [invoicedata, setInvoicedata] = useState([]);
  const [productss, setProductss] = useState([""]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getspecificDataforInvoice();
  }, []);
  
  const getspecificDataforInvoice = async () => {
    let result = await getSpecificSaleProduct(salesId);
    console.log(result)
    setInvoicedata(result?.data);
    productsforlisting = result?.data?.products;

    quantity = productsforlisting?.reduce((sum, product) => sum + parseInt(product.PurchaseQuantity, 10), 0)
      .toString();
    discount = productsforlisting?.reduce((sum, product) => sum + parseFloat(product.Discount), 0)
      .toString();
    totalAmount = productsforlisting?.reduce((sum, product) => sum + parseFloat(product.totalAmounnt), 0)
      .toString();
    taxAmount = productsforlisting?.reduce((sum, product) => sum + parseFloat(product.taxAmount), 0)
      ?.toString();
    excludeTaxPrice = productsforlisting?.reduce((sum, product) => sum + parseFloat(product.excludeTaxPrice), 0)
    ?.toString();
    amount = productsforlisting?.reduce((sum, product) => sum + parseFloat(product.amount), 0)
      .toString();
    taxAmount = Number(taxAmount);
    taxAmount = taxAmount.toFixed(2);
    setProductss(result?.data?.products);
    setLoading(true);
  };

  const columns = [
    { field: "Code", label: "Code" },
    { field: "Namee", label: "Name" },
    { field: "color", label: "Color" },
    { field: "Company", label: "Company" },
    { field: "PurchaseQuantity", label: "Quantity" },
    { field: "excludeTaxPrice", label: "MRP" },
    { field: "totalAmounnt", label: "Total" },
    { field: "Discount", label: "Discount" },
    { field: "taxAmount", label: "Tax" },
    { field: "amount", label: "Due Amount" },
  ];

  const columns1 = [
    { field: "Code", label: "Code" },
    { field: "Namee", label: "Name" },
    { field: "color", label: "Color" },
    { field: "Company", label: "Company" },
    { field: "PurchaseQuantity", label: "Quantity" },
    { field: "excludeTaxPrice", label: "MRP" },
    { field: "totalAmounnt", label: "Total" },
    { field: "Discount", label: "Discount" },
    { field: "amount", label: "Due Amount" },
  ];
  const column2 = [
    { field: "PurchaseQuantity", label: "Qty" },
    { field: "purchaseTotalDiscount", label: "Discount" },
    { field: "purchaseQuantityPrice", label: "Price" },
    { field: "purchaseTotalTax", label: "Tax" },
    { field: "purchaseTotalAmount", label: "Due Amount" },
  ];
  return (
    <>
      {loading ? (
        <>
          <div className="printTable">
            {/* {selectedPrinter === "thermal" ? (
              <PrintTableComponent
                data={productss}
                columns={columns}
                column2={column2}
                action4={action4}
                ConsolidatedInvoiceTotalquantity={quantity}
                ConsolidatedInvoiceTotaldiscount={discount}
                ConsolidatedInvoiceTotaltotalPriceExculdingTax={totalAmount}
                ConsolidatedInvoiceTotaltotalTaxAmount={taxAmount}
                ConsolidatedInvoiceTotalIncludingAllPrices={amount}
              />
            ) : ( */}
            {
           QURESHI_ELECTRONICS === "QURESHI_ELECTRONICS_WITH_FBR" ? (
          
              <PrintLaserTable
                data={productss}
                columns={columns}
                action4={action4}
                ConsolidatedInvoiceTotalquantity={quantity}
                ConsolidatedInvoiceTotaldiscount={discount}
                ConsolidatedInvoiceTotaltotalPriceExculdingTax={totalAmount}
                ConsolidatedInvoiceTotaltotalTaxAmount={taxAmount}
                ConsolidatedInvoiceTotalIncludingAllPrices={amount}
                consolidateInvoiceExcludeTaxPrice = {excludeTaxPrice}
              /> 
              ) :(<>
              <PrintLaserTable
                data={productss}
                columns={columns1}
                action4={action4}
                ConsolidatedInvoiceTotalquantity={quantity}
                ConsolidatedInvoiceTotaldiscount={discount}
                ConsolidatedInvoiceTotaltotalPriceExculdingTax={totalAmount}
                ConsolidatedInvoiceTotaltotalTaxAmount={taxAmount}
                ConsolidatedInvoiceTotalIncludingAllPrices={amount}
                consolidateInvoiceExcludeTaxPrice = {excludeTaxPrice}
              /> 
              </>)
            }
              
            {/* )} */}
          </div>
          <div className="bottomGrand">
          <h2>
            Grand Total. {invoicedata?.total}
          </h2>
          {
        JSON.parse(localStorage.getItem("SoftwareWithFBR")) && (<>
 {invoicedata?.invoiceNumber === "" ? (
            <h1></h1>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                marginTop: "30px",
              }}
            >
              <img src={logo} alt="Logo" style={{ height: "80px" }} />
              {invoicedata?.invoiceNumber && (
                <QRCode
                  style={{
                    height: "77px",
                    width: "77px",
                    marginLeft: "10px",
                  }}
                  value={invoicedata?.invoiceNumber}
                />
              )}
            </div>
          )}
        </>)
      }
      </div>  
    
         
        </>
      ) : (
        <h1></h1>
      )}

    
    </>
  );
}
