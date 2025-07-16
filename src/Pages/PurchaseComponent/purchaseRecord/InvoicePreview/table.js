import React, { useContext, useEffect } from "react";
import { State } from "../context/ContextSales";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useCustomState } from "../../../../Variables/stateVariables";
import PrintLaserTable from "../../../../Components/tableComponent/printLaserTable";
import { getPurchaseDetailForPreview } from "../../../../actions/purchaseAction";
let quantity = [];
let discount = [];
let totalAmount = [];
let taxAmount = [];
let amount = [];
let productsforlisting = [];
export default function Tablee({ selectedPrinter }) {
  const { purchaseId} = useContext(State);
  const {
    invoicedata,
    setInvoicedata,
    Products,
    setProducts,
    loading,
    setLoading,
  } = useCustomState();
  let action4 = "purchaseInvoice";
  const navigate = useNavigate();

  useEffect(() => {
    getspecificDataforInvoice();
  }, []);

  const getspecificDataforInvoice = async () => {
    let result = await getPurchaseDetailForPreview(purchaseId);
    console.log(result)
    productsforlisting = result?.data?.products;
  quantity = productsforlisting?.reduce((sum, product) => sum + parseInt(product.PurchaseQuantity, 10), 0)
    .toString();
  discount = productsforlisting?.reduce((sum, product) => sum + parseFloat(product.purchaseTotalDiscount), 0)
    .toString();
  totalAmount = productsforlisting?.reduce((sum, product) => sum + parseFloat(product.purchaseQuantityPrice), 0)
    .toString();
  taxAmount = productsforlisting?.reduce((sum, product) => sum + parseFloat(product.purchaseTotalTax), 0)
    ?.toString();
  amount = productsforlisting?.reduce((sum, product) => sum + parseFloat(product.purchaseTotalAmount), 0)
    .toString();
  taxAmount = Number(taxAmount);
  taxAmount = taxAmount.toFixed(2);
    setInvoicedata(result?.data);
    setProducts(result?.data?.products);
    setLoading(true);
    console.log(quantity)
    console.log(discount)
    console.log(totalAmount)
    console.log(taxAmount)
    console.log(amount)
  };

  const backHandle = () => {
    navigate("/purchaseRecord");
  };

  const columns = [
    { field: "Code", label: "Code" },
    { field: "Namee", label: "Name" },
    { field: "Color", label: "Color"},
    { field: "invoicePrice", label: "Invoice Price" },
    { field: "expense", label: "Expenses" },
    { field: "purchaseTotalDiscount", label: "Discount" },
    { field: "purchasePrice", label: "Purchase Price" },
    { field: "MRP", label: "MRP" },
    { field: "PurchaseQuantity", label: "Quantity" },
    // { field: "purchaseQuantityPrice", label: "Price" },
    { field: "purchaseTotalTax", label: "Tax" },
  
    { field: "purchaseTotalAmount", label: "Due Amount" },
  ];
  return (
    <>
      <div className="printTable">
        {/* {selectedPrinter === "thermal" ? (
          <PrintTableComponent data={Products} columns={columns} 
          action4={action4}
          ConsolidatedInvoiceTotalquantity={quantity}
          ConsolidatedInvoiceTotaldiscount={discount}
          ConsolidatedInvoiceTotaltotalPriceExculdingTax={totalAmount}
          ConsolidatedInvoiceTotaltotalTaxAmount={taxAmount}
          ConsolidatedInvoiceTotalIncludingAllPrices={amount}/>
        ) : ( */}
          <PrintLaserTable 
          data={Products} 
          columns={columns} 
          action4={action4}
          ConsolidatedInvoiceTotalquantity={quantity}
          ConsolidatedInvoiceTotaldiscount={discount}
          ConsolidatedInvoiceTotaltotalPriceExculdingTax={totalAmount}
          ConsolidatedInvoiceTotaltotalTaxAmount={taxAmount}
          ConsolidatedInvoiceTotalIncludingAllPrices={amount}/>
      </div>

      <div     className="bottomGrand">
        <h2
        >
          Grand Total. {invoicedata.total}
        </h2>
      </div>
    </>
  );
}
