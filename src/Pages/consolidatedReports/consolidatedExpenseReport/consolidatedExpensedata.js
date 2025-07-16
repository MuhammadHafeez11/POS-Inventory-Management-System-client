import React, { useEffect } from "react";
let totalExpense
const ConsolidatedExpenseData = ({tableData, props }) => {
  useEffect(()=>{
    console.log(tableData)
    totalExpense = tableData?.reduce(
      (sum, product) =>
      { 
      const total = parseInt(product.expenseTotal, 10);
      return isNaN(total) ? sum : sum + total},
      0
    )
    .toString();
  }, [props])
  return (
    <>
   <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between"}} className="consolidatedDatesData">
   <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", width: "50%"}}  className="InvoiceSecondCont">
                <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between"}} className="consolidateLaserFirstRecordDiv">
                  <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", }} className="consolidateLaserQuantity">
                    {
                      totalExpense && (<>
                      <h5>Total Expense:</h5>
                      <p>{totalExpense}</p></>)
                    }
                    
                  </div>
                  <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between",}} className="consolidateLaserProductCode">
                    {
                      props.expenseProductShopNoDropDown && (<>
                          <h5>Shop No:</h5>
                          <p> {props.expenseProductShopNoDropDown}</p>
                      </>)
                    }
                  </div>
                </div>
                <div className="consolidateLaserFirstRecordDiv">
                  <div className="consolidateLaserQuantity">
                    {
                      props.selectedOption && (<>
                        <h5>Time Period:</h5>
                        <p> {props.selectedOption}</p>
                      </>)
                    }
                  
                  </div>
                  <div className="consolidateLaserProductCode">
                    {
                      props.expenseTypeDropDown && (
                        <>     <h5>Expense Type:</h5>
                    <p>{props.expenseTypeDropDown}</p></>
                      )
                    }
               
                  </div>
                </div>  
           </div>
                <div className="consolidateLaserFirstRecordDiv">
                  <div className="consolidateLaserQuantity">
                    {props.expenseStartDateDropDown && (
                      <>
                        <h5>Starting Date::</h5>
                        <p>
                          {" "}
                          {props.expenseStartDateDropDown.toLocaleDateString(
                            "en-GB"
                          )}
                        </p>
                      </>
                    )}
                  </div>
                  <div className="consolidateLaserProductCode">
                    {props.expenseEndDateDropDown && (
                      <>
                        <h5>Ending Date:</h5>
                        <p>
                          {" "}
                          {props.expenseEndDateDropDown.toLocaleDateString(
                            "en-GB"
                          )}
                        </p>
                      </>
                    )}
                  </div>
                </div>
            </div>
      {/* {tableData?.length > 0 ? (
              <>
                {selectedPrinter === "thermal" ? (
                  <>
                    <table
                      className="mt-10 table1"
                      style={{ fontSize: "10px", whiteSpace: "nowrap" }}
                    >
                      <tr
                        style={{
                          marginTop: "-10px",
                          gap: "50px",
                          padding: "0px",
                          marginBottom: "-10px",
                        }}
                      >
                        <td
                          className="td1"
                          style={{
                            marginTop: "-30px",
                            marginBottom: "0px",
                            marginRight: "10px",
                          }}
                        >
                          {" "}
                          <span className="font-bold td1">
                            Total Expense:
                          </span>{" "}
                          {totalExpense}
                        </td>
                        {expenseCategoryDropDown ? (
                          <td
                            className="td1"
                            style={{
                              marginTop: "-30px",
                              marginBottom: "0px",
                              marginLeft: "10px",
                              paddingLeft: "50px",
                            }}
                          >
                            {" "}
                            <span className="font-bold td1">
                              Expense Category:
                            </span>{" "}
                            {expenseCategoryDropDown}
                          </td>
                        ) : (
                          <td></td>
                        )}
                      </tr>
                      <tr style={{ marginTop: "-30px", marginBottom: "0px" }}>
                        {expenseShopNoDropDown ? (
                          <td
                            className="td1"
                            style={{
                              marginTop: "-30px",
                              marginBottom: "0px",
                              marginLeft: "10px",
                              paddingLeft: "50px",
                            }}
                          >
                            {" "}
                            <span className="font-bold td1">Shop No:</span>{" "}
                            {expenseShopNoData}
                          </td>
                        ) : (
                          <td></td>
                        )}
                        {expenseTypeDropDown ? (
                          <td
                            className="td1"
                            style={{
                              marginTop: "-30px",
                              marginBottom: "0px",
                              marginLeft: "10px",
                              paddingLeft: "50px",
                            }}
                          >
                            {" "}
                            <span className="font-bold td1">
                              Expense Type:
                            </span>{" "}
                            {expenseTypeDropDown}
                          </td>
                        ) : (
                          <td></td>
                        )}
                      </tr>
                      <tr style={{ marginTop: "-30px", marginBottom: "0px" }}>
                        {expenseStartDateDropDown ? (
                          <td
                            className="td1"
                            style={{
                              marginTop: "-30px",
                              marginBottom: "0px",
                              marginLeft: "10px",
                              paddingLeft: "50px",
                            }}
                          >
                            {" "}
                            <span className="font-bold td1">
                              Starting Date:
                            </span>{" "}
                            {expenseStartDateDropDown.toLocaleDateString(
                              "en-GB"
                            )}
                          </td>
                        ) : (
                          <td></td>
                        )}
                        {expenseEndDateDropDown ? (
                          <td
                            className="td1"
                            style={{
                              marginTop: "-30px",
                              marginBottom: "0px",
                              marginLeft: "10px",
                              paddingLeft: "50px",
                            }}
                          >
                            {" "}
                            <span className="font-bold td1">
                              Ending Date:
                            </span>{" "}
                            {expenseEndDateDropDown.toLocaleDateString("en-GB")}
                          </td>
                        ) : (
                          <td></td>
                        )}
                      </tr>
                    </table>
                  </>
                ) : (
                  <>
                    <table className="table1" style={{ margin: 0 }}>
                      <tr className="tr1">
                        <td>
                          {" "}
                          <span className="font-bold td1">
                            Total Expense:
                          </span>{" "}
                          {totalExpense}
                        </td>
                        {expenseCategoryDropDown ? (
                          <td>
                            {" "}
                            <span className="td1">Expense Category:</span>{" "}
                            {expenseCategoryDropDown}
                          </td>
                        ) : (
                          <td></td>
                        )}
                      </tr>
                      <tr>
                        {expenseShopNoDropDown ? (
                          <td>
                            {" "}
                            <span className="font-bold td1">Shop No:</span>{" "}
                            {expenseShopNoDropDown}
                          </td>
                        ) : (
                          <td></td>
                        )}
                        {expenseTypeDropDown ? (
                          <td>
                            {" "}
                            <span className="font-bold td1">
                              Expense Type:
                            </span>{" "}
                            {expenseTypeDropDown}
                          </td>
                        ) : (
                          <td></td>
                        )}
                      </tr>
                      <tr>
                        {expenseStartDateDropDown ? (
                          <td>
                            {" "}
                            <span className="font-bold td1">
                              Starting Date:
                            </span>{" "}
                            {expenseStartDateDropDown.toLocaleDateString(
                              "en-GB"
                            )}
                          </td>
                        ) : (
                          <td></td>
                        )}
                        {expenseEndDateDropDown ? (
                          <td>
                            {" "}
                            <span className="font-bold td1">
                              Ending Date:
                            </span>{" "}
                            {expenseEndDateDropDown.toLocaleDateString("en-GB")}
                          </td>
                        ) : (
                          <td></td>
                        )}
                      </tr>
                    </table>
                  </>
                )}
              </>
            ) : (
              <h1></h1>
            )} */}
    </>
  );
};
export default ConsolidatedExpenseData;
