import React, { useEffect, useState } from "react";
let quantity;
let discount;
let totalPriceExculdingTax;
let totalTaxAmount;
let totalAmountIncludingAllPrices;
const ProfitSaleData = ({tableData, salesProductShopNoDropDown}) => {
  const [dataLoading, setDataLoading] = useState(true)
  useEffect(()=>{
    console.log('ceb')
    console.log(quantity)
      
    quantity = tableData
    ?.reduce(
      (sum, product) =>
      { 
      const Quantity = parseInt(product?.products?.PurchaseQuantity, 10);
      return isNaN(Quantity) ? sum : sum + Quantity},
      0
    )
    .toString();
    console.log(quantity)
  
  //Calculating Discount
  discount = tableData
    ?.reduce((sum, product) => {
      const Discount = parseInt(product?.products?.Discount, 10);
      return isNaN(Discount) ? sum : sum + Discount}, 0)
    .toString();
  
  //Calculating Total Price Without Tax
  totalPriceExculdingTax = tableData
    ?.reduce((sum, product) =>
    {
      const totalPrice = parseInt(product?.products?.totalAmounnt, 10);
      return isNaN(totalPrice) ? sum : sum + totalPrice;
    } , 0)
    .toString();
  
  //Calculating Tax Amount
  totalTaxAmount = tableData
    ?.reduce((sum, product) => {
        const taxAmount = parseInt(product?.products?.taxAmount, 10);
        return isNaN(taxAmount) ? sum : sum + taxAmount;
    }, 0)
    .toString();
  
  //Calculating Total Amount Including All prices
  totalAmountIncludingAllPrices = tableData
    ?.reduce((sum, product) => 
    {const totalAmount = parseInt(product?.products?.amount, 10);
      return isNaN(totalAmount) ? sum : sum + totalAmount}, 0)
    .toString();
  setDataLoading(false)
  }, [tableData])

  return (
    <div className="InvoiceSecondCont">
   
      {!dataLoading && (<>
        <div className="InvoiceThirdCont">
         <div className="consolidateSaleLaserdivs">
         <h5>Total Quantity:&nbsp;</h5>
         <p>{quantity}</p>
         </div>
         <div className="consolidateSaleLaserdivs">
         <h5>Total Discount:&nbsp;</h5>
         <p>{discount}</p>
         </div>
         <div className="consolidateSaleLaserdivs">
         <h5>Total Price:&nbsp;</h5>
         <p> {totalPriceExculdingTax}</p>
         </div>
       </div>
       <div className="InvoiceThirdCont">
         <div className="consolidateSaleSecondLaserdivs">
         <h5>Tax Amount:&nbsp;</h5>
         <p>{totalTaxAmount}</p>
         </div>
         <div className="consolidateSaleSecondLaserdivs">
         <h5>Grand Total:&nbsp;</h5>
         <p> {totalAmountIncludingAllPrices}</p>
         </div>
           <div className="consolidateSaleSecondLaserdivs">
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
             </> ) }
     
   
  </div>
  );
};

export default ProfitSaleData;


