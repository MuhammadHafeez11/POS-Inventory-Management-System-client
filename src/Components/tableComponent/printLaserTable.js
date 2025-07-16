import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Table, Button, Tab } from "semantic-ui-react";
import { State } from "./../../Pages/PurchaseComponent/purchaseRecipt/context/stateContext";
import { Statee } from "./../../Pages/SaleComponent/salesRecipt/context/stateContext";
import { Statte } from "./../../Pages/TransferComponent/Transfer Recipt/context/stateContext";
import { useTranslation, initReactI18next } from "react-i18next";
import { tableState } from "./tableContext";
import { QURESHI_ELECTRONICS } from "../../constants/companyNameContants";
let quantity;
let discount;
let invoiceTotaltotalPriceExculdingTax;
let invoiceTotaltotalTaxAmount;
let invoiceTotalIncludingAllPrices;
let invoiceExcludeTaxPrice;
let MSP;
let salePrice;
let profit;
const TableComponentId = ({
  data,
  columns,
  actions,
  action4,
  quantityy,
  Price,
  Discount,
  totalAmounnt,
  totalProfit,
  ConsolidatedInvoiceTotalquantity,
  ConsolidatedInvoiceTotaldiscount,
  ConsolidatedInvoiceTotaltotalTaxAmount,
  ConsolidatedInvoiceTotalIncludingAllPrices,
  consolidateInvoiceExcludeTaxPrice,
  ConsolidatedInvoiceTotaltotalPriceExculdingTax,
}) => {
  let lengthOfData = columns?.length;
  if (actions) {
    lengthOfData = lengthOfData;
  }
  const { t, i18n } = useTranslation();
  const { rowCount, setRowCount } = useContext(tableState);

  // State variables for sorting
  const [sortedColumn, setSortedColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const handleSort = (field) => {
    if (field === sortedColumn) {
      // If the clicked column is already sorted, toggle the direction
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // If a different column is clicked, set it as the sorted column with ascending direction
      setSortedColumn(field);
      setSortDirection("asc");
    }
  };

  const {
    showModaal,
    setShowModaal,
    list,
    total,
    GrandQuantityTotal,
    GrandTotalExludeTex,
    GrandTotalTax,
    setGrandPriceTotal,
    GrandPriceTotal,
    GrandDiscount,
  } = useContext(Statee);
  // console.log(locationsetid);
  // console.log(data);
  let currentIndex = 0;
  useEffect(() => {
    setRowCount(data?.length);
  }, [data]);

  useEffect(() => {
    if (action4 === "ConsolReport") {
      console.log(data);
      quantity = data
        ?.reduce((sum, product) => {
          const Quantity = parseInt(product?.products?.PurchaseQuantity, 10);
          return isNaN(Quantity) ? sum : sum + Quantity;
        }, 0)
        .toString();
      invoiceExcludeTaxPrice = data
        ?.reduce((sum, product) => {
          const totalPriceExcludeTax = parseInt(
            product?.products?.excludeTaxPrice,
            10
          );
          return isNaN(totalPriceExcludeTax) ? sum : sum + totalPriceExcludeTax;
        }, 0)
        .toString();
      invoiceTotaltotalPriceExculdingTax = data
        ?.reduce((sum, product) => {
          const invoiceTotal = parseInt(product?.products?.totalAmounnt, 10);
          return isNaN(invoiceTotal) ? sum : sum + invoiceTotal;
        }, 0)
        .toString();
      discount = data
        ?.reduce((sum, product) => {
          const Quantity = parseInt(product?.products?.Discount, 10);
          return isNaN(Quantity) ? sum : sum + Quantity;
        }, 0)
        .toString();
      invoiceTotaltotalTaxAmount = data
        ?.reduce((sum, product) => {
          const TotalTax = parseInt(product?.products?.taxAmount, 10);
          return isNaN(TotalTax) ? sum : sum + TotalTax;
        }, 0)
        .toString();
      invoiceTotalIncludingAllPrices = data
        ?.reduce((sum, product) => {
          const totalPriceAll = parseInt(product?.products?.amount, 10);
          return isNaN(totalPriceAll) ? sum : sum + totalPriceAll;
        }, 0)
        .toString();
    } else if (action4 === "ConsolProfitReport") {
      console.log(data);
      quantity = data
        ?.reduce((sum, product) => {
          const Quantity = parseInt(product?.products?.PurchaseQuantity, 10);
          return isNaN(Quantity) ? sum : sum + Quantity;
        }, 0)
        .toString();
      invoiceExcludeTaxPrice = data
        ?.reduce((sum, product) => {
          const totalPriceExcludeTax = parseInt(
            product?.products?.excludeTaxPrice,
            10
          );
          return isNaN(totalPriceExcludeTax) ? sum : sum + totalPriceExcludeTax;
        }, 0)
        .toString();
      invoiceTotaltotalPriceExculdingTax = data
        ?.reduce((sum, product) => {
          const invoiceTotal = parseInt(product?.products?.totalAmounnt, 10);
          return isNaN(invoiceTotal) ? sum : sum + invoiceTotal;
        }, 0)
        .toString();
      discount = data
        ?.reduce((sum, product) => {
          const Quantity = parseInt(product?.products?.Discount, 10);
          return isNaN(Quantity) ? sum : sum + Quantity;
        }, 0)
        .toString();
      MSP = data
        ?.reduce((sum, product) => {
          const MSP = parseInt(product?.products?.minimumSalePrice, 10);
          return isNaN(MSP) ? sum : sum + MSP;
        }, 0)
        .toString();
      salePrice = data
        ?.reduce((sum, product) => {
          const saleprice = parseInt(product?.products?.salePrice, 10);
          return isNaN(saleprice) ? sum : sum + saleprice;
        }, 0)
        .toString();
      profit = data
        ?.reduce((sum, product) => {
          const profit = parseInt(product?.products?.profit, 10);
          return isNaN(profit) ? sum : sum + profit;
        }, 0)
        .toString();
      invoiceTotaltotalTaxAmount = data
        ?.reduce((sum, product) => {
          const TotalTax = parseInt(product?.products?.taxAmount, 10);
          return isNaN(TotalTax) ? sum : sum + TotalTax;
        }, 0)
        .toString();
      invoiceTotalIncludingAllPrices = data
        ?.reduce((sum, product) => {
          const totalPriceAll = parseInt(product?.products?.amount, 10);
          return isNaN(totalPriceAll) ? sum : sum + totalPriceAll;
        }, 0)
        .toString();
    } else if ("PurchaseConsolReport") 
      {
      quantity = data
        ?.reduce((sum, product) => {
          const Quantity = parseInt(product?.products?.PurchaseQuantity, 10);
          return isNaN(Quantity) ? sum : sum + Quantity;
        }, 0)
        .toString();

      //Calculating Discount
      discount = data
        ?.reduce((sum, product) => {
          const Discount = parseInt(
            product?.products?.purchaseTotalDiscount,
            10
          );
          return isNaN(Discount) ? sum : sum + Discount;
        }, 0)
        .toString();

      //Calculating Total Price Without Tax
      invoiceTotaltotalPriceExculdingTax = data
        ?.reduce((sum, product) => {
          const totalPriceExTax = parseInt(
            product?.products?.purchaseQuantityPrice,
            10
          );
          return isNaN(totalPriceExTax) ? sum : sum + totalPriceExTax;
        }, 0)
        .toString();

      //Calculating Tax Amount
      invoiceTotaltotalTaxAmount = data
        ?.reduce((sum, product) => {
          const totalTaxAmount = parseInt(
            product?.products?.purchaseTotalTax,
            10
          );
          return isNaN(totalTaxAmount) ? sum : sum + totalTaxAmount;
        }, 0)
        .toString();

      invoiceTotaltotalTaxAmount = Number(invoiceTotaltotalTaxAmount);
      invoiceTotaltotalTaxAmount = invoiceTotaltotalTaxAmount.toFixed(2);
      //Calculating Total Amount Including All prices
      invoiceTotalIncludingAllPrices = data
        ?.reduce((sum, product) => {
          const totalAllPrice = parseInt(
            product?.products?.purchaseTotalAmount,
            10
          );
          return isNaN(totalAllPrice) ? sum : sum + totalAllPrice;
        }, 0)
        .toString();
    } 
  }, [data, action4]);

  const renderDateValue = (item, field, format) => {
    const value = renderCellValue(item, field);
    // console.log(value);

    //for converting bool value into string ..just for dispalying into table
    if (format === "bool") {
      return value && value.toLocaleString();
    }

    if (format === "time") {
      // console.log("time");
      return value ? new Date(value).toLocaleTimeString() : "";
    }
    if (format === "date") {
      // console.log("date");
      return value ? new Date(value).toLocaleDateString() : "";
    }

    return value;
  };
  const renderCellValue = (item, field) => {
    const fieldKeys = field.split(".");

    return fieldKeys?.reduce((obj, key) => (obj ? obj[key] : ""), item);
  };

  // Sorting logic
  const sortedData =
    data &&
    data?.slice()?.sort((a, b) => {
      if (!sortedColumn) return 0;

      const sortOrder = sortDirection === "asc" ? 1 : -1;
      const aField = renderCellValue(a, sortedColumn);
      const bField = renderCellValue(b, sortedColumn);

      if (aField < bField) return -1 * sortOrder;
      if (aField > bField) return 1 * sortOrder;
      return 0;
    });

  return (
    <div
      style={{
        width: "100%",
        // overflowX: "auto",
        zIndex: "2",
        // height: "40vh",
      }}
    >
      {sortedData && sortedData?.length > 0 ? (
        <Table
          celled
          columns={lengthOfData}
          striped
          sortable
          selectable
          stickyHeader
          // className="bg-gray-100"
          style={{ margin: "0", zIndex: "2", width: "100%" }}
        >
          <Table.Header
            id="table-header"
            className="HeaderStyle"
            style={{
              position: "sticky",
              top: 0,
              backgroundColor: "lightgray",
              border: "none",
              // border: "1px solid black"
            }}
          >
            <Table.Row
              // className="font-bold text-center HeaderStyle"
              style={{
                backgroundColor: "lightgray",
                // border: "1px solid black",
                border: "none",
                textAlign: "center",
                padding: "0px",
                textSize: "14px",
              }}
              // style={styles.tableHeader}
            >
              <Table.HeaderCell
                className="Hello"
                style={{
                  backgroundColor: "lightgray",
                  padding: "5px",
                  width: "3%",
                  fontSize: "12px",
                  textAlign: "center",
                  border: "none",
                  // border: "1px solid black",
                }}
              >
                {t("sNo")}
              </Table.HeaderCell>
              {columns?.map((column) => (
                <Table.HeaderCell
                  key={column.field}
                  className="HeaderStyle"
                  style={{
                    backgroundColor: "lightgray",
                    whiteSpace: "nowrap",
                    fontSize: "12px",
                    border: "none",
                    // border: "1px solid black",
                  }}
                  onClick={() => handleSort(column.field)} // Attach the click event
                >
                  {/* Display sorting indicator based on the current sorting state */}
                  {column.label}
                  {sortedColumn === column.field && (
                    <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                  )}
                </Table.HeaderCell>
              ))}
              {actions && (
                <Table.HeaderCell className="HeaderStyle">
                  {t("actions")}
                </Table.HeaderCell>
              )}
            </Table.Row>
          </Table.Header>
          <Table.Body id="table-body" className="text-center">
            {sortedData?.map((item, index) => (
              <Table.Row key={index} style={{ height: "20px" }}>
                <Table.Cell
                  className="Hello"
                  style={{
                    width: "15px",
                    fontSize: "12px",
                    border: "none",
                    // border: "1px solid black",
                  }}
                >
                  {++currentIndex}
                </Table.Cell>
                {columns?.map((column) => (
                  <Table.Cell
                    key={column.Code}
                    className="Hello"
                    // style={{ textAlign: "left" }}
                    style={{
                      width: "15px",
                      fontSize: "10px",
                      border: "none",
                      whiteSpace: "nowrap",
                      textAlign: "center",
                      justifyContent: "center",
                      // border: "1px solid black",
                    }}
                  >
                    {column.format === "date" ||
                    column.format === "time" ||
                    column.format === "bool"
                      ? renderDateValue(item, column.field, column.format)
                      : renderCellValue(item, column.field, column.format)}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
          {list?.length > 0 && action4 == "salePage" ? (
            <Table.Footer
              className=" text-center"
              style={{
                position: "sticky",
                bottom: 0,
                backgroundColor: "lightgray",
                // border: "black 1px solid"
              }}
            >
              <Table.Row
                style={{
                  backgroundColor: "lightgray",
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                  fontSize: "12px",
                  // border: "1px solid black",
                }}
              >
                <Table.HeaderCell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    // border: "1px solid black",
                  }}
                ></Table.HeaderCell>
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    // border: "1px solid black",
                  }}
                >
                  {/* Total: */}
                </Table.Cell>
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    // border: "1px solid black",
                  }}
                ></Table.Cell>
                {action4 == "salePage" && (
                  <Table.Cell
                    className="Hello"
                    style={{
                      backgroundColor: "lightgray",
                      fontWeight: "bold",
                      fontSize: "12px",
                      // border: "1px solid black",
                    }}
                  ></Table.Cell>
                )}
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    // border: "1px solid black",
                  }}
                ></Table.Cell>
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    // border: "1px solid black",
                  }}
                >
                  {list?.length > 0
                    ? GrandQuantityTotal?.toLocaleString()
                    : null}
                </Table.Cell>
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    // border: "1px solid black",
                  }}
                >
                  {list?.length > 0 ? GrandPriceTotal?.toLocaleString() : null}
                </Table.Cell>
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    // border: "1px solid black",
                  }}
                >
                  {" "}
                  {list?.length > 0
                    ? GrandTotalExludeTex?.toLocaleString()
                    : null}
                </Table.Cell>
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    // border: "1px solid black",
                  }}
                >
                  {list?.length > 0 ? GrandDiscount?.toLocaleString() : null}
                  {/* {" "} {ConsolidatedInvoiceTotaldiscount.toLocaleString()} */}
                </Table.Cell>
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    // border: "1px solid black",
                  }}
                >
                  {" "}
                  {list?.length > 0 ? GrandTotalTax?.toLocaleString() : null}
                  {/* {ConsolidatedInvoiceTotaltotalTaxAmount.toLocaleString()} */}
                </Table.Cell>
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    // border: "1px solid black",
                  }}
                >
                  {" "}
                  {list?.length > 0 ? total?.toLocaleString() : null}
                  {/* {ConsolidatedInvoiceTotalIncludingAllPrices.toLocaleString()} */}
                </Table.Cell>
              </Table.Row>
            </Table.Footer>
          ) : null}

          {action4 == "PurchaseConsolReport" ? (
            <Table.Footer
              className=" text-center"
              style={{
                // position: "sticky",
                bottom: 0,
                backgroundColor: "lightgray",
                border: "transparent",
                // border: "black 1px solid",
              }}
            >
              <Table.Row
                style={{
                  backgroundColor: "lightgray",
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                  fontSize: "12px",
                  border: "transparent",
                  // border: "1px solid black",
                }}
              >
                <Table.HeaderCell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    width: "3px",
                    fontSize: "12px",
                    border: "transparent",
                    textAlign: "center",
                    // border: "1px solid black",
                  }}
                ></Table.HeaderCell>
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    border: "transparent",
                    textAlign: "center",
                    // border: "1px solid black",
                  }}
                >
                  {/* Total: */}
                </Table.Cell>
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    border: "transparent",
                    textAlign: "center",
                    // border: "1px solid black",
                  }}
                ></Table.Cell>
                {action4 == "salesRecipt" && (
                  <Table.Cell
                    className="Hello"
                    style={{
                      backgroundColor: "lightgray",
                      fontWeight: "bold",
                      fontSize: "12px",
                      border: "transparent",
                      textAlign: "center",
                      // border: "1px solid black",
                    }}
                  ></Table.Cell>
                )}
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    textAlign: "center",
                    border: "transparent",
                    // border: "1px solid black",
                  }}
                ></Table.Cell>
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    border: "transparent",
                    textAlign: "center",
                    // border: "1px solid black",
                  }}
                >
                  {quantity?.toLocaleString()}
                </Table.Cell>
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    textAlign: "center",
                    border: "transparent",
                    // border: "1px solid black",
                  }}
                >
                  {invoiceExcludeTaxPrice?.toLocaleString()}
                </Table.Cell>
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    border: "transparent",
                    textAlign: "center",
                    // border: "1px solid black",
                  }}
                >
                  {invoiceTotaltotalPriceExculdingTax?.toLocaleString()}
                </Table.Cell>
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    textAlign: "center",
                    border: "transparent",
                    // border: "1px solid black",
                  }}
                >
                  {" "}
                  {discount?.toLocaleString()}
                </Table.Cell>
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    border: "transparent",
                    textAlign: "center",
                    // border: "1px solid black",
                  }}
                >
                  {invoiceTotaltotalTaxAmount?.toLocaleString()}
                </Table.Cell>
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    border: "transparent",
                    textAlign: "center",
                    // border: "1px solid black",
                  }}
                >
                  {invoiceTotalIncludingAllPrices?.toLocaleString()}
                </Table.Cell>
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    border: "transparent",
                    textAlign: "center",
                    // border: "1px solid black",
                  }}
                ></Table.Cell>
              </Table.Row>
            </Table.Footer>
          ) : null}

          {action4 == "ConsolReport" ? (
            <Table.Footer
              // className=" text-center"
              style={{
                // position: "sticky",
                bottom: 0,
                backgroundColor: "lightgray",
                border: "transparent",
              }}
            >
              <Table.Row
                style={{
                  backgroundColor: "lightgray",
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                  fontSize: "12px",
                  border: "transparent",
                }}
              >
                <Table.HeaderCell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    border: "transparent",
                  }}
                ></Table.HeaderCell>
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    border: "transparent",
                    textAlign: "center",
                  }}
                >
                  {/* Total: */}
                </Table.Cell>
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    border: "transparent",
                    textAlign: "center",
                  }}
                ></Table.Cell>
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    border: "transparent",
                    textAlign: "center",
                  }}
                ></Table.Cell>
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    border: "transparent",
                    textAlign: "center",
                  }}
                >
                  {quantity?.toLocaleString()}
                </Table.Cell>
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    border: "transparent",
                    textAlign: "center",
                  }}
                >
                  {invoiceExcludeTaxPrice?.toLocaleString()}
                </Table.Cell>
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    border: "transparent",
                    textAlign: "center",
                  }}
                >
                  {invoiceTotaltotalPriceExculdingTax?.toLocaleString()}
                </Table.Cell>
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    border: "transparent",
                    textAlign: "center",
                  }}
                >
                  {" "}
                  {discount?.toLocaleString()}
                </Table.Cell>
                {QURESHI_ELECTRONICS === "QURESHI_ELECTRONICS_WITH_FBR" && (
                  <Table.Cell
                    className="Hello"
                    style={{
                      backgroundColor: "lightgray",
                      fontWeight: "bold",
                      fontSize: "12px",
                      border: "transparent",
                      textAlign: "center",
                    }}
                  >
                    {invoiceTotaltotalTaxAmount?.toLocaleString()}
                  </Table.Cell>
                )}

                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    border: "transparent",
                    textAlign: "center",
                  }}
                >
                  {invoiceTotalIncludingAllPrices?.toLocaleString()}
                </Table.Cell>
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    border: "transparent",
                    textAlign: "center",
                  }}
                ></Table.Cell>
              </Table.Row>
            </Table.Footer>
          ) : null}

          {action4 == "ConsolProfitReport" ? (
            <Table.Footer
              className=" text-center"
              style={{
                position: "sticky",
                bottom: 0,
                backgroundColor: "lightgray",
                border: "black 1px solid",
              }}
            >
              <Table.Row
                style={{
                  backgroundColor: "lightgray",
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                  fontSize: "12px",
                  // border: "1px solid black",
                }}
              >
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    width: "1px",
                    // border: "1px solid black",
                  }}
                >
                  {/* Total: */}
                </Table.Cell>
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    // border: "1px solid black",
                  }}
                ></Table.Cell>
                {action4 == "salesRecipt" && (
                  <Table.Cell
                    className="Hello"
                    style={{
                      backgroundColor: "lightgray",
                      fontWeight: "bold",
                      fontSize: "12px",
                      // border: "1px solid black",
                    }}
                  ></Table.Cell>
                )}
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    // border: "1px solid black",
                  }}
                ></Table.Cell>
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    // border: "1px solid black",
                  }}
                >
                  {quantity?.toLocaleString()}
                </Table.Cell>
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    // border: "1px solid black",
                  }}
                ></Table.Cell>
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    // border: "1px solid black",
                  }}
                >
                  {" "}
                  {invoiceExcludeTaxPrice?.toLocaleString()}
                </Table.Cell>
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    // border: "1px solid black",
                  }}
                >
                  {MSP?.toLocaleString()}{" "}
                </Table.Cell>
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    // border: "1px solid black",
                  }}
                >
                  {" "}
                  {discount?.toLocaleString()}
                </Table.Cell>
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    // border: "1px solid black",
                  }}
                >
                  {salePrice?.toLocaleString()}
                </Table.Cell>
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    // border: "1px solid black",
                  }}
                >
                  {invoiceTotaltotalTaxAmount?.toLocaleString()}
                </Table.Cell>
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    // border: "1px solid black",
                  }}
                >
                  {invoiceTotalIncludingAllPrices?.toLocaleString()}
                </Table.Cell>
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    // border: "1px solid black",
                  }}
                >
                  {profit?.toLocaleString()}
                </Table.Cell>
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    // border: "1px solid black",
                  }}
                ></Table.Cell>
              </Table.Row>
            </Table.Footer>
          ) : null}

          {action4 == "salesRecipt" ? (
            <Table.Footer
              className=" text-center"
              style={{
                position: "sticky",
                bottom: 0,
                backgroundColor: "lightgray",
                border: "black 1px solid",
              }}
            >
              <Table.Row
                style={{
                  backgroundColor: "lightgray",
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                  fontSize: "12px",
                  // border: "1px solid black",
                }}
              >
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    // border: "1px solid black",
                  }}
                ></Table.Cell>
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    // border: "1px solid black",
                    textAlign: "center",
                  }}
                >
                  {/* {ConsolidatedInvoiceTotalquantity?.toLocaleString()} */}
                </Table.Cell>
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    // border: "1px solid black",
                    textAlign: "center",
                  }}
                ></Table.Cell>
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    // border: "1px solid black",
                    textAlign: "center",
                  }}
                >
                  {" "}
                  {invoiceExcludeTaxPrice?.toLocaleString()}
                </Table.Cell>
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    // border: "1px solid black",
                    textAlign: "center",
                  }}
                ></Table.Cell>
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    // border: "1px solid black",
                    textAlign: "center",
                  }}
                >
                  {ConsolidatedInvoiceTotalquantity?.toLocaleString()}
                </Table.Cell>
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    // border: "1px solid black",
                    textAlign: "center",
                  }}
                >
                  {consolidateInvoiceExcludeTaxPrice?.toLocaleString()}{" "}
                </Table.Cell>

                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    // border: "1px solid black",
                    textAlign: "center",
                  }}
                >
                  {ConsolidatedInvoiceTotaltotalPriceExculdingTax?.toLocaleString()}
                </Table.Cell>
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    // border: "1px solid black",
                    textAlign: "center",
                  }}
                >
                  {ConsolidatedInvoiceTotaldiscount?.toLocaleString()}
                </Table.Cell>
                {QURESHI_ELECTRONICS === "QURESHI_ELECTRONICS_WITH_FBR" && (
                  <Table.Cell
                    className="Hello"
                    style={{
                      backgroundColor: "lightgray",
                      fontWeight: "bold",
                      fontSize: "12px",
                      // border: "1px solid black",
                      textAlign: "center",
                    }}
                  >
                    {ConsolidatedInvoiceTotaltotalTaxAmount?.toLocaleString()}
                  </Table.Cell>
                )}

                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    // border: "1px solid black",
                    textAlign: "center",
                  }}
                >
                  {" "}
                  {ConsolidatedInvoiceTotalIncludingAllPrices?.toLocaleString()}
                </Table.Cell>
              </Table.Row>
            </Table.Footer>
          ) : null}

          {action4 == "purchaseInvoice" ? (
            <Table.Footer
              className=" text-center"
              style={{
                position: "sticky",
                bottom: 0,
                backgroundColor: "lightgray",
                // border: "black 1px solid"
              }}
            >
              <Table.Row
                style={{
                  backgroundColor: "lightgray",
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                  fontSize: "12px",
                  // border: "1px solid black",
                  textAlign: "center",
                }}
              >
                <Table.HeaderCell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    // border: "1px solid black",
                    textAlign: "center",
                  }}
                ></Table.HeaderCell>
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    // border: "1px solid black",
                    textAlign: "center",
                  }}
                ></Table.Cell>
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    // border: "1px solid black",
                    textAlign: "center",
                  }}
                ></Table.Cell>
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    // border: "1px solid black",
                    textAlign: "center",
                  }}
                ></Table.Cell>

                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    // border: "1px solid black",
                    textAlign: "center",
                  }}
                ></Table.Cell>
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    // border: "1px solid black",
                    textAlign: "center",
                  }}
                ></Table.Cell>
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    // border: "1px solid black",
                    textAlign: "center",
                  }}
                >
                  {" "}
                  {ConsolidatedInvoiceTotaldiscount?.toLocaleString()}
                </Table.Cell>
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    // border: "1px solid black",
                    textAlign: "center",
                  }}
                ></Table.Cell>
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    // border: "1px solid black",
                    textAlign: "center",
                  }}
                ></Table.Cell>
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    // border: "1px solid black",
                    textAlign: "center",
                  }}
                >
                  {ConsolidatedInvoiceTotalquantity?.toLocaleString()}
                </Table.Cell>
                {/* <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    border: "1px solid black",
                  }}
                > {ConsolidatedInvoiceTotaltotalPriceExculdingTax?.toLocaleString()}</Table.Cell> */}
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    // border: "1px solid black",
                    textAlign: "center",
                  }}
                >
                  {ConsolidatedInvoiceTotaltotalTaxAmount?.toLocaleString()}
                </Table.Cell>

                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    // border: "1px solid black",
                    textAlign: "center",
                  }}
                >
                  {ConsolidatedInvoiceTotalIncludingAllPrices?.toLocaleString()}
                </Table.Cell>
              </Table.Row>
            </Table.Footer>
          ) : null}

          {action4 == "ProfitEmployee" ? (
            <Table.Footer
              className=" text-center"
              style={{
                position: "sticky",
                bottom: 0,
                backgroundColor: "lightgray",
                border: "black 1px solid",
              }}
            >
              <Table.Row
                style={{
                  backgroundColor: "lightgray",
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                  fontSize: "12px",
                  // border: "1px solid black",
                }}
              >
                <Table.HeaderCell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    // border: "1px solid black",
                  }}
                ></Table.HeaderCell>
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    // border: "1px solid black",
                  }}
                >
                  {/* Total: */}
                </Table.Cell>
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    // border: "1px solid black",
                  }}
                ></Table.Cell>
                {action4 == "ProfitEmployee" && (
                  <>
                    <Table.Cell
                      className="Hello"
                      style={{
                        backgroundColor: "lightgray",
                        fontWeight: "bold",
                        fontSize: "12px",
                        // border: "1px solid black",
                      }}
                    ></Table.Cell>
                  </>
                )}
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    // border: "1px solid black",
                  }}
                >
                  {quantityy?.toLocaleString()}
                </Table.Cell>
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    // border: "1px solid black",
                  }}
                >
                  {" "}
                </Table.Cell> 
                <Table.HeaderCell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    // border: "1px solid black",
                  }}
                >
                  {Price?.toLocaleString()}
                </Table.HeaderCell>
                {/* <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    // border: "1px solid black",
                  }}
                ></Table.Cell> */}
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    // border: "1px solid black",
                  }}
                >
                  {" "}
                  {Discount?.toLocaleString()}
                </Table.Cell>
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    // border: "1px solid black",
                  }}
                >
                  {totalAmounnt?.toLocaleString()}
                </Table.Cell>
                {/* <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    // border: "1px solid black",
                  }}
                >
                  {" "}
                </Table.Cell> */}
                <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    // border: "1px solid black",
                  }}
                >
                  {" "}
                  {totalProfit?.toLocaleString()}
                  {/* {amount?.toLocaleString()} */}
                </Table.Cell>
                {/* <Table.Cell
                  className="Hello"
                  style={{
                    backgroundColor: "lightgray",
                    fontWeight: "bold",
                    fontSize: "12px",
                    border: "1px solid black",
                  }}
                >
                  {totalProfit?.toLocaleString()}
                </Table.Cell> */}
              </Table.Row>
            </Table.Footer>
          ) : null}
        </Table>
      ) : (
        <div>No record found.</div>
      )}
    </div>
  );
};

export default TableComponentId;
// const styles = {
//   printTable: {
//     width: "100%",
//     borderCollapse: "collapse",
//   },
//   tableHeader: {
//     backgroundColor: "#f0f0f0",
//     // border: "1px solid black",
//     textAlign: "center",
//   },
//   tableCell: {
//     border: "1px solid #000",
//     padding: "8px",
//     textAlign: "center",
//   },
// };
