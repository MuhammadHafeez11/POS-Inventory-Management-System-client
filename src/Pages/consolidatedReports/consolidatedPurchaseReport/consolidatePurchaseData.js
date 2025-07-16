import React, { useEffect, useState } from "react";

let quantity;
let discount;
let totalPriceExculdingTax;
let totalTaxAmount;
let totalAmountIncludingAllPrices;
const ConsolidatePurchaseData = ({tableData, purchaseProductShopNoDropDown }) => {
  const [dataLoading, setDataLoading] = useState(true)
  useEffect(()=>{
    console.log(tableData)
    console.log(quantity)
    quantity = tableData
    ?.reduce(
      (sum, product) => sum + parseInt(product.products.PurchaseQuantity, 10),
      0
    )
    .toString();
  console.log(quantity)
  //Calculating Discount
  discount = tableData
    ?.reduce(
      (sum, product) => sum + parseInt(product.products.purchaseTotalDiscount, 10),
      0
    )
    .toString();

  //Calculating Total Price Without Tax
  totalPriceExculdingTax = tableData
    ?.reduce(
      (sum, product) => sum + parseInt(product.products.purchaseQuantityPrice, 10),
      0
    )
    .toString();

  //Calculating Tax Amount
  totalTaxAmount = tableData?.reduce(
      (sum, product) => sum + parseInt(product.products.purchaseTotalTax, 10),
      0
    )
    .toString();
  
  totalTaxAmount = Number(totalTaxAmount);
  totalTaxAmount = totalTaxAmount.toFixed(2);
  //Calculating Total Amount Including All prices
  totalAmountIncludingAllPrices = tableData?.reduce(
      (sum, product) => sum + parseInt(product.products.purchaseTotalAmount, 10),
      0
    )
    .toString();
    setDataLoading(false)
  }, [tableData, purchaseProductShopNoDropDown])

  return (
    <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between"}} className="consolidatedDatesData">
    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", width: "50%"}} className="InvoiceSecondCont">
    {!dataLoading && (<>
      <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between"}}  className="InvoiceThirdCont">
      <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", }} className="consolidatePurchaseLaserdivs">
      <h5>Total Quantity:&nbsp;</h5>
        <p>{quantity}</p>
      </div>
      <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between",}} className="consolidatePurchaseLaserdivs">
      <h5>Total Discount:&nbsp;</h5>
          <p>{discount}</p>
      </div>
      <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", }} className="consolidatePurchaseLaserdivs">
      <h5>Total Price:&nbsp;</h5>
                  <p> {totalPriceExculdingTax}</p>
      </div>
    </div>
    <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between"}} className="InvoiceThirdCont">
      <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", }} className="consolidatePurchaseLaserdivs">
        <h5>Grand Total:&nbsp;</h5>
        <p> {totalAmountIncludingAllPrices}</p>
      </div>
      <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", }} className="consolidatePurchaseLaserdivs">
      <h5>Tax Amount:&nbsp;</h5>
                  <p>{totalTaxAmount}</p>
      </div>
      <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between",}} className="consolidatePurchaseLaserdivs">
          <h5>Shop No:&nbsp;</h5>
          <p>{purchaseProductShopNoDropDown ? (purchaseProductShopNoDropDown): (
            <>
              {
                JSON.parse(localStorage.getItem("isAdministrator")) || JSON.parse(localStorage.getItem("isSuperAdmin")) ?
                ("Over All Shops"): (JSON.parse(localStorage.getItem("shopId")))
              }
            </>
           )}</p>
      </div>
      
      </div>
    </>)}      </div>
    
   

      {/* {props.tableData?.length > 0 ? (
        <>
          {props.selectedPrinter === "thermal" ? (
            <>
              <div className="consolidateLaserFirstRecordDiv">
                <div className="consolidateLaserQuantity">
                  <h5>Total Quantity:</h5>
                  <p>{props.quantity}</p>
                </div>
                <div className="consolidateLaserProductCode">
                  <h5>Total Discount:</h5>
                  <p>{props.discount}</p>
                </div>
              </div>
              <div className="consolidateLaserFirstRecordDiv">
                <div className="consolidateLaserQuantity">
                  <h5>Total Price:</h5>
                  <p> {props.totalPriceExculdingTax}</p>
                </div>
                <div className="consolidateLaserProductCode">
                  <h5>Tax Amount:</h5>
                  <p>{props.totalTaxAmount}</p>
                </div>
              </div>
              <div className="consolidateLaserFirstRecordDiv">
                <div className="consolidateLaserQuantity">
                  <h5>Grand Total:</h5>
                  <p> {props.totalAmountIncludingAllPrices}</p>
                </div>
                {props.purchaseProductCodeDropDown ? (
                  <>
                    <div className="consolidateLaserProductCode">
                      <h5>Product Code:</h5>
                      <p> {props.purchaseProductCodeDropDown}</p>
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </div>
              <div className="consolidateLaserFirstRecordDiv">
                {props.purchaseProductCompanyDropDown ? (
                  <>
                    <div className="consolidateLaserQuantity">
                      <h5>Product Company:</h5>
                      <p> {props.purchaseProductCompanyDropDown}</p>
                    </div>
                  </>
                ) : (
                  <></>
                )}
                {props.purchaseProductShopNoDropDown ? (
                  <>
                    <div className="consolidateLaserProductCode">
                      <h5>Shop No::</h5>
                      <p>{props.purchaseProductShopNoDropDown}</p>
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </div>
              <div className="consolidateLaserFirstRecordDiv">
                <div className="consolidateLaserQuantity">
                  {props.purchaseStartDateDropDown && (
                    <>
                      <h5>Starting Date::</h5>
                      <p>
                        {" "}
                        {props.purchaseStartDateDropDown.toLocaleDateString(
                          "en-GB"
                        )}
                      </p>
                    </>
                  )}
                </div>
                <div className="consolidateLaserProductCode">
                  {props.purchaseEndDateDropDown && (
                    <>
                      <h5>Ending Date:</h5>
                      <p>
                        {" "}
                        {props.purchaseEndDateDropDown.toLocaleDateString(
                          "en-GB"
                        )}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="consolidateLaserFirstRecordDiv">
                <div className="consolidateLaserQuantity">
                  <h5>Total Quantity:</h5>
                  <p>{props.quantity}</p>
                </div>
                <div className="consolidateLaserProductCode">
                  <h5>Total Discount:</h5>
                  <p>{props.discount}</p>
                </div>
              </div>
              <div className="consolidateLaserFirstRecordDiv">
                <div className="consolidateLaserQuantity">
                  <h5>Total Price:</h5>
                  <p> {props.totalPriceExculdingTax}</p>
                </div>
                <div className="consolidateLaserProductCode">
                  <h5>Tax Amount:</h5>
                  <p>{props.totalTaxAmount}</p>
                </div>
              </div>
              <div className="consolidateLaserFirstRecordDiv">
                <div className="consolidateLaserQuantity">
                  <h5>Grand Total:</h5>
                  <p> {props.totalAmountIncludingAllPrices}</p>
                </div>
                {props.purchaseProductCodeDropDown ? (
                  <>
                    <div className="consolidateLaserProductCode">
                      <h5>Product Code:</h5>
                      <p> {props.purchaseProductCodeDropDown}</p>
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </div>
              <div className="consolidateLaserFirstRecordDiv">
                {props.purchaseProductCompanyDropDown ? (
                  <>
                    <div className="consolidateLaserQuantity">
                      <h5>Product Company:</h5>
                      <p> {props.purchaseProductCompanyDropDown}</p>
                    </div>
                  </>
                ) : (
                  <></>
                )}
                {props.purchaseProductShopNoDropDown ? (
                  <>
                    <div className="consolidateLaserProductCode">
                      <h5>Shop No::</h5>
                      <p>{props.purchaseProductShopNoDropDown}</p>
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </div>
              <div className="consolidateLaserFirstRecordDiv">
                <div className="consolidateLaserQuantity">
                  {props.purchaseStartDateDropDown && (
                    <>
                      <h5>Starting Date::</h5>
                      <p>
                        {" "}
                        {props.purchaseStartDateDropDown.toLocaleDateString(
                          "en-GB"
                        )}
                      </p>
                    </>
                  )}
                </div>
                <div className="consolidateLaserProductCode">
                  {props.purchaseEndDateDropDown && (
                    <>
                      <h5>Ending Date:</h5>
                      <p>
                        {" "}
                        {props.purchaseEndDateDropDown.toLocaleDateString(
                          "en-GB"
                        )}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <h1></h1>
      )} */}
    </div>
  );
};

export default ConsolidatePurchaseData;
