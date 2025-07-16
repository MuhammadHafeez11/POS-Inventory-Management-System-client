import React, { useEffect, useState } from "react";
let quantity;
let discount;
let totalPriceExculdingTax;
let totalTaxAmount;
let totalAmountIncludingAllPrices;
let totalReturnTax;
let totalReturnAmount;
let totalReturnQuantity;
const ConsolidatedSaleData = ({tableData, returnData,  salesProductShopNoDropDown}) => {
  const [dataLoading, setDataLoading] = useState(true)
  useEffect(()=>{
    console.log('ceb')
    console.log(quantity)
      
    quantity = tableData
    ?.reduce(
      (sum, product) =>
      { 
      const Quantity = parseInt(product.products.PurchaseQuantity, 10);
      return isNaN(Quantity) ? sum : sum + Quantity},
      0
    )
    .toString();
    console.log(quantity)
  
  //Calculating Discount
  discount = tableData
    ?.reduce((sum, product) => {
      const Discount = parseInt(product.products.Discount, 10);
      return isNaN(Discount) ? sum : sum + Discount}, 0)
    .toString();
  
  //Calculating Total Price Without Tax
  totalPriceExculdingTax = tableData
    ?.reduce((sum, product) =>
    {
      const totalPrice = parseInt(product.products.totalAmounnt, 10);
      return isNaN(totalPrice) ? sum : sum + totalPrice;
    } , 0)
    .toString();
  
  //Calculating Tax Amount
  totalTaxAmount = tableData
    ?.reduce((sum, product) => {
        const taxAmount = parseInt(product.products.taxAmount, 10);
        return isNaN(taxAmount) ? sum : sum + taxAmount;
    }, 0)
    .toString();
  
  //Calculating Total Amount Including All prices
  totalAmountIncludingAllPrices = tableData
    ?.reduce((sum, product) => 
    {const totalAmount = parseInt(product.products.amount, 10);
      return isNaN(totalAmount) ? sum : sum + totalAmount}, 0)
    .toString();

    totalReturnQuantity = returnData
    ?.reduce(
      (sum, product) =>
      { 
      const Quantity = parseInt(product.products.returnQuantity, 10);
      return isNaN(Quantity) ? sum : sum + Quantity},
      0
    )
    .toString();
  totalReturnTax = returnData
  ?.reduce((sum, product) => 
  {const totalAmount = parseInt(product.products.taxAmount, 10);
    return isNaN(totalAmount) ? sum : sum + totalAmount}, 0)
  .toString();

  totalReturnAmount = returnData
  ?.reduce((sum, product) => 
  {const totalAmount = parseInt(product.products.totalAmounnt, 10);
    return isNaN(totalAmount) ? sum : sum + totalAmount}, 0)
  .toString();
  setDataLoading(false)
  }, [tableData, returnData])

  return (
    <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between"}} className="consolidatedDatesData">
    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", width: "50%"}}  className="InvoiceSecondCont">
      {!dataLoading && (<>
        <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between"}} className="InvoiceThirdCont">
         <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", width: "80%"}} className="consolidateSaleLaserdivs">
         <h5>Total Quantity:</h5>
         <p>{quantity}</p>
         </div>
         <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}} className="consolidateSaleLaserdivs">
         <h5>Total Discount:&nbsp;</h5>
         <p>{discount}</p>
         </div>
         <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}} className="consolidateSaleLaserdivs">
         <h5>Total Price:&nbsp;</h5>
         <p> {totalPriceExculdingTax}</p>
         </div>
       </div>
       <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between"}} className="InvoiceThirdCont">
         <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}} className="consolidateSaleLaserdivs">
         <h5>Tax Amount:&nbsp;</h5>
         <p>{totalTaxAmount}</p>
         </div>
         <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}} className="consolidateSaleLaserdivs">
         <h5>Total Sale:&nbsp;</h5>
         <p> {totalAmountIncludingAllPrices}</p>
         </div>
           <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}} className="consolidateSaleLaserdivs">
           <h5>Shop No:&nbsp;</h5>
           <p>{salesProductShopNoDropDown ? (salesProductShopNoDropDown): (
            <>
              {
                JSON.parse(localStorage.getItem("isAdministrator")) || JSON.parse(localStorage.getItem("isSuperAdmin")) ?
                ("Over All Shops"): (JSON.parse(localStorage.getItem("shopId")))
              }
            </>
           )}</p>
          </div>
        </div>
        <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between"}} className="InvoiceThirdCont">
         <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}} className="consolidateSaleLaserdivs">
         <h5>Total Return Quantity:&nbsp;</h5>
         <p>{totalReturnQuantity}</p>
         </div>
         <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}} className="consolidateSaleLaserdivs">
         <h5>Total Return Amount:&nbsp;</h5>
         <p> {totalReturnAmount}</p>
         </div>
           <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}} className="consolidateSaleLaserdivs">
           <h5>Grand Total:&nbsp;</h5>
           <p>{totalAmountIncludingAllPrices-totalReturnAmount}</p>
          </div>
        </div>
             </> ) 
        }
  </div>  
   </div>
  );
};

export default ConsolidatedSaleData;

