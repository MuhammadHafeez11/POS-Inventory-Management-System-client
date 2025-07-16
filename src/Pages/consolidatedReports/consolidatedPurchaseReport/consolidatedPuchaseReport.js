import React, { useEffect, useState, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactToPrint from "react-to-print";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../../../MetaData";
import { searchPurchaseConsolidatednvoiceData } from "../../../Components/searchComponent/ConsolidatedReportSearch/purchaseReportSeach";
import { Button, Form, Dropdown, Loader } from "semantic-ui-react";
import PrintTableComponent from "../../../Components/tableComponent/printTableComponent";
import PrintLaserTable from "../../../Components/tableComponent/printLaserTable";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import {
  getPurchaseConsolidatedRecord,
  getPurchaseRecordForConsolidated,
  getPurchaseRecordForConsolidatedForSpecificShop,
  getPurchaseRecordForConsolidatedForSpecificShopOnDate,
  getPurchaseRecordForConsolidatedOnDates,
} from "../../../actions/purchaseAction";
import { refreshTokken } from "../../../actions/userAction";
import ConsolidatePurchaseData from "./consolidatePurchaseData";
import { getPermissionForRoles } from "../../user/rolesAssigned/RolesPermissionValidation";
import PrintIcon from "@mui/icons-material/Print";
import PageLoader from "../../../Components/Loader/PageLoader";
let PurchaseRecord = [];
let isCalledd = "false";
let quantity = [];
let discount = [];
let totalPriceExculdingTax = [];
let totalTaxAmount = [];
let totalAmountIncludingAllPrices = [];
let code = "";
let type = "";
let companyProduct = "";
const ConsolidatedPuchaseReport = (props) => {
  const action4 = "PurchaseConsolReport";
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //printerOption
  const [selectedPrinter, setSelectedPrinter] = useState();
  const [selected, setSelected] = useState(false);
  const [colorTheme, setColorTheme] = useState("theme-white");
  //General UseState
  const [isCalled, setIsCalled] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [showComponent, setShowComponent] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [loadingPrintData, setLoadingPrintData] = useState(false);
  const consolidatedPurchaseInvoice = useRef();
  const [purchaseConsolidatedPermission, setPurchaseConsolidatedPermission] =
    useState(false);
  const [tableRecord, setTableRecord] = useState();
  const [valuesChanging, setValuesChanging] = useState(false);
  const [valuesChanged, setValuesChanged] = useState(true);
  //UseState For setting dropDowns values

  const [purchaseProductShopNoDropDown, setPurchaseProductShopNoDropDown] =
    useState("");
  const [purchaseProductCodeDropDown, setPurchaseProductCodeDropDown] =
    useState("");
  const [purchaseProductCompanyDropDown, setPurchaseProductCompanyDropDown] =
    useState("");
  const [purchaseStartDateDropDown, setPurchaseStartDateDropDown] =
    useState(null);
  const [purchaseEndDateDropDown, setPurchaseEndDateDropDown] = useState(null);
  const { shop } = useSelector((state) => state.shop);
  const {
    purchaseConsolidateForSpecificShopsRecord,
    purchaseConsolidateForSpecificShopsRecordLoading,
  } = useSelector((state) => state.purchaseConsolidateForSpecificShopsRecord);
  const {
    purchaseConsolidateForShopsRecord,
    purchaseConsolidateForShopsRecordLoading,
  } = useSelector((state) => state.purchaseConsolidateForShopsRecord);
  const {
    purchaseConsolidateForShopsOnDateRecord,
    purchaseConsolidateForShopsOnDateRecordLoading,
  } = useSelector((state) => state.purchaseConsolidateForShopsOnDateRecord);
  const {
    purchaseConsolidateForSpecificShopsOnDateRecord,
    purchaseConsolidateForSpecificShopsOnDateRecordLoading,
  } = useSelector(
    (state) => state.purchaseConsolidateForSpecificShopsOnDateRecord
  );
  //useStates For Seting dropdown data on page loading
  const [shopNoData, setShopNoData] = useState([]);
  const [purchaseProductCodeData, setPurchaseProductCodeData] = useState([]);
  const [purchaseProductcompanyData, setPurchaseProductcompanyData] = useState(
    []
  );

  const handleBeforePrint = () => {
    console.log("ajfei");
    setLoadingPrintData(true);
  };

  const handleAfterPrint = () => {
    setLoadingPrintData(false);
  };

  useEffect(() => {
    setPurchaseConsolidatedPermission(false);
    getPermission();
  }, []);
  async function getPermission() {
    try {
      const permissionForAdd = await getPermissionForRoles(
        "View Consolidated Purchase Invoice"
      );
      setPurchaseConsolidatedPermission(permissionForAdd);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    const currentColorTheme = localStorage.getItem("theme-color");
    if (currentColorTheme) {
      setColorTheme(currentColorTheme);
    }
  }, [colorTheme]);

  useEffect(() => {
    isCalledd = "false";
  });
  useEffect(() => {
    if (isCalledd === "false") {
      isCalledd = "true";
      getToken();
    }
  }, []);
  const getToken = async () => {
    const token = await refreshTokken();
    if (token?.data === "Please login to acces this resource") {
      navigate("/login");
    }
    console.log(token);
  };

  ////////======================================================///////////////
  /////======== Handle All Daily, weekly, Monthly, Yearly Data ======////////
  ///////======================================================///////////////

  const DateOptions = [
    { key: "today", value: "today", text: "Today" },
    { key: "week", value: "thisWeek", text: "This Week" },
    { key: "month", value: "thisMonth", text: "This Month" },
    { key: "month", value: "last3Months", text: "Last Three Months" },
    { key: "year", value: "lastYear", text: "Last Year" },
    { key: "all", value: "All", text: "All" },
  ];
  const [yourData, setYourData] = useState();
  const [selectedOption, setSelectedOption] = useState();

  //select language
  useEffect(() => {
    let currentLang = localStorage.getItem("lang");
    i18n.changeLanguage(currentLang);
  }, []);

  const handleClearData = () => {
    companyProduct = "";
    code = "";
    setPurchaseProductShopNoDropDown("");
    setPurchaseStartDateDropDown("");
    setPurchaseEndDateDropDown("");
    setSelectedOption("");
    setSelectedPrinter("");
    setSelected(false);
    setIsDisabled(false);
    setValuesChanged(true);
    if (
      JSON.parse(localStorage.getItem("isAdministrator")) ||
      JSON.parse(localStorage.getItem("isSuperAdmin"))
    ) {
      dispatch(getPurchaseRecordForConsolidated("last3Months"));
    } else {
      dispatch(
        getPurchaseRecordForConsolidatedForSpecificShop(
          JSON.parse(localStorage.getItem("shopId")),
          `last3Months`
        )
      );
    }
  };

  // All New Logic
  useEffect(() => {
    if (
      JSON.parse(localStorage.getItem("isAdministrator")) ||
      JSON.parse(localStorage.getItem("isSuperAdmin"))
    ) {
      dispatch(getPurchaseRecordForConsolidated("last3Months"));
    } else {
      dispatch(
        getPurchaseRecordForConsolidatedForSpecificShop(
          JSON.parse(localStorage.getItem("shopId")),
          `last3Months`
        )
      );
    }
  }, []);

  // Handle the dropdown selection
  const handleDropdownChange = async (event, { value }) => {
    setValuesChanged(true);
    if (purchaseProductShopNoDropDown) {
      dispatch(
        getPurchaseRecordForConsolidatedForSpecificShop(
          purchaseProductShopNoDropDown,
          value
        )
      );
      setSelectedOption(value);
    } else {
      dispatch(
        getPurchaseRecordForConsolidatedForSpecificShop(
          JSON.parse(localStorage.getItem("shopId")),
          value
        )
      );
      setValuesChanged(true);
      setSelectedOption(value);
    }
  };

  useEffect(() => {
    console.log(purchaseConsolidateForSpecificShopsRecord);
    if (
      !purchaseConsolidateForSpecificShopsRecordLoading &&
      purchaseConsolidateForSpecificShopsRecord?.success
    ) {
      setTableData(purchaseConsolidateForSpecificShopsRecord?.purchaseData);
      setTableRecord(purchaseConsolidateForSpecificShopsRecord?.purchaseData);
      setValuesChanged(false);
    }
  }, [
    purchaseConsolidateForSpecificShopsRecord,
    purchaseConsolidateForSpecificShopsRecordLoading,
  ]);

  useEffect(() => {
    console.log(purchaseConsolidateForShopsRecord);
    if (
      !purchaseConsolidateForShopsRecordLoading &&
      purchaseConsolidateForShopsRecord?.success
    ) {
      setTableData(purchaseConsolidateForShopsRecord?.purchaseData);
      setTableRecord(purchaseConsolidateForShopsRecord?.purchaseData);
      setValuesChanged(false);
    }
  }, [
    purchaseConsolidateForShopsRecord,
    purchaseConsolidateForShopsRecordLoading,
  ]);

  //Function To handle the Shop No Value that would be Purcahse in fiter
  const handleShopNovalue = (event, { value }) => {
    setPurchaseProductShopNoDropDown(value);
  };

  //Function to set Starting Date
  const handleDateSelectChange = (date) => {
    setPurchaseStartDateDropDown(date);
  };

  //Function to set Ending Date
  const handleSelectEndDateChange = async (date) => {
    setPurchaseEndDateDropDown(date);
    if (
      JSON.parse(localStorage.getItem("isAdministrator")) ||
      JSON.parse(localStorage.getItem("isSuperAdmin"))
    ) {
      if (purchaseProductShopNoDropDown && purchaseStartDateDropDown) {
        setValuesChanged(true);
        dispatch(
          getPurchaseRecordForConsolidatedForSpecificShopOnDate(
            purchaseProductShopNoDropDown,
            purchaseStartDateDropDown,
            date
          )
        );
      } else {
        setValuesChanged(true);
        dispatch(
          getPurchaseRecordForConsolidatedOnDates(
            purchaseStartDateDropDown,
            date
          )
        );
      }
    } else {
      setValuesChanged(true);
      dispatch(
        getPurchaseRecordForConsolidatedForSpecificShopOnDate(
          JSON.parse(localStorage.getItem("shopId")),
          purchaseStartDateDropDown,
          date
        )
      );
    }
  };

  useEffect(() => {
    if (
      purchaseConsolidateForShopsOnDateRecord?.success &&
      !purchaseConsolidateForShopsOnDateRecordLoading
    ) {
      setTableData(purchaseConsolidateForShopsOnDateRecord?.purchaseData);
      setTableRecord(purchaseConsolidateForShopsOnDateRecord?.purchaseData);
      setValuesChanged(false);
    }
  }, [
    purchaseConsolidateForShopsOnDateRecord,
    purchaseConsolidateForShopsOnDateRecordLoading,
  ]);

  useEffect(() => {
    if (
      purchaseConsolidateForSpecificShopsOnDateRecord?.success &&
      !purchaseConsolidateForSpecificShopsOnDateRecordLoading
    ) {
      setTableData(
        purchaseConsolidateForSpecificShopsOnDateRecord?.purchaseData
      );
      setTableRecord(
        purchaseConsolidateForSpecificShopsOnDateRecord?.purchaseData
      );

      setValuesChanged(false);
    }
  }, [
    purchaseConsolidateForSpecificShopsOnDateRecord,
    purchaseConsolidateForSpecificShopsOnDateRecordLoading,
  ]);

  //Function to search element
  const handleSearch = async (code, company) => {
    setValuesChanged(true);
    const finalDataForTable = await searchPurchaseConsolidatednvoiceData(
      tableRecord,
      // salesProductShopNoDropDown,
      code,
      company,
      purchaseStartDateDropDown,
      purchaseEndDateDropDown
    );
    console.log(finalDataForTable);
    setTableData(finalDataForTable);
    setValuesChanged(false);
    console.log(finalDataForTable);
  };
  const columns = [
    { field: "products.Code", label: "Code" },
    { field: "products.Namee", label: "Name" },
    { field: "products.Company", label: "Company" },
    { field: "products.PurchaseQuantity", label: "Quantity" },
    { field: "products.MRP", label: "MRP" },
    { field: "products.purchaseQuantityPrice", label: "Total Price" },
    { field: "products.purchaseTotalDiscount", label: "Discount" },
    { field: "products.purchaseTotalTax", label: "Tax Amount" },
    { field: "products.purchaseTotalAmount", label: "Total Amount" },
    { field: "products.dateWithProduct", label: "Invoice Date" },
  ];
  const column2 = [
    { field: "PurchaseQuantity", label: "Qty" },
    { field: "purchaseTotalDiscount", label: "Discount" },
    { field: "purchaseQuantityPrice", label: "Ttl_Price" },
    { field: "purchaseTotalTax", label: "Tax_Amount" },
    { field: "purchaseTotalAmount", label: "Total_Amount" },
  ];

  return (
    <>
      <MetaData title="QE ~~PurchaseInvoice" />
      <div className={`Purchase ${colorTheme}`}>
        <div className="secondContainer">
          {purchaseConsolidatedPermission && (
            <>
              <div className="contentt-box">
                <div className="heading-container">
                  <h3>{t("consolidatePurcahseInvoice")}</h3>
                </div>
              </div>
              <div className="search-box">
                {(JSON.parse(localStorage.getItem("isAdministrator")) ||
                  JSON.parse(localStorage.getItem("isSuperAdmin"))) && (
                  <Dropdown
                    options={shop.map((option) => ({
                      key: option.shopCode,
                      text: option.shopCode,
                      value: option.shopCode,
                    }))}
                    placeholder={t("selectShop")}
                    className="purchaseDropdown1"
                    fluid
                    clearable
                    selection
                    disabled={isDisabled}
                    value={purchaseProductShopNoDropDown}
                    onChange={handleShopNovalue}
                  />
                )}
                <Dropdown
                  placeholder={t("selectTimePeriod")}
                  fluid
                  className="consolidatePurchaseDropdown"
                  selection
                  clearable
                  // options={DateOptions}
                  options={DateOptions.map((option) => ({
                    key: option.key,
                    text: option.text,
                    value: option.value,
                  }))}
                  value={selectedOption}
                  onChange={handleDropdownChange}
                />
                <input
                  type="text"
                  name="productCode"
                  placeholder={t("enterProdCode")}
                  autoComplete="off"
                  value={code}
                  onChange={(e) => {
                    // setProductCode(e.target.value);
                    code = e.target.value;
                    handleSearch(code, companyProduct);
                  }}
                />
                <input
                  type="text"
                  name="productCode"
                  placeholder={t("enterProdCompany")}
                  autoComplete="off"
                  value={companyProduct}
                  onChange={(e) => {
                    // setProductCode(e.target.value);
                    companyProduct = e.target.value;
                    handleSearch(code, companyProduct);
                  }}
                />
                <DatePicker
                  selected={purchaseStartDateDropDown}
                  onChange={handleDateSelectChange}
                  placeholderText={t("startingDate")}
                  dateFormat="dd/MM/yyyy"
                  className="datePicker"
                  disabled={isDisabled}
                  // style={{ flex: 1 }}
                />
                <DatePicker
                  selected={purchaseEndDateDropDown}
                  onChange={handleSelectEndDateChange}
                  placeholderText={t("endingDate")}
                  dateFormat="dd/MM/yyyy"
                  // style={{ flex: 1 }}
                  disabled={isDisabled}
                  className="datePicker"
                />

                {/* <Button className="buttonSearch" onClick={handleSearch}>
                {t("search")}&nbsp;&nbsp;{<SearchIcon />}
              </Button> */}
                <Button className="buttonSearchBack" onClick={handleClearData}>
                  {t("clear")}&nbsp;&nbsp;{<ClearAllIcon />}
                </Button>
                {!loadingPrintData ? (
                  <ReactToPrint
                    trigger={() => (
                      <button className="printButton">
                        Print&nbsp;&nbsp;
                        <PrintIcon />
                      </button>
                    )}
                    content={() => consolidatedPurchaseInvoice.current}
                    onBeforeGetContent={handleBeforePrint}
                    onAfterPrint={() => {
                      getPurchaseConsolidatedRecord();
                      setPurchaseProductShopNoDropDown("");
                      setPurchaseProductCodeDropDown("");
                      setPurchaseProductCompanyDropDown("");
                      setPurchaseStartDateDropDown("");
                      setPurchaseEndDateDropDown("");
                      setSelectedOption("");
                      setSelected(false);
                      setIsDisabled(false);
                      handleAfterPrint();
                    }}
                  />
                ) : (
                  <Button disabled>
                    Print&nbsp;&nbsp;
                    <PrintIcon />
                  </Button>
                )}
              </div>
              <div className="table-container">
              {!valuesChanged && (
                    <ConsolidatePurchaseData
                      tableData={tableData}
                      purchaseProductShopNoDropDown={
                        purchaseProductShopNoDropDown
                      }
                    />
                  )}
                <div className="consolidatedPurchaseTable">
                  {!valuesChanged ? (
                    <>
                      {" "}
                      <PrintLaserTable
                        data={tableData}
                        columns={columns}
                        action4={action4}
                      />
                    </>
                  ) : (
                    <PageLoader />
                  )}
                </div>
                <div style={{ display: "none" }}>
                  <div
                    ref={consolidatedPurchaseInvoice}
                    style={{
                      // border: "2px solid black",
                      padding: "5px",
                      display: "flex",
                      paddingBottom: "0px",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                {!valuesChanged && (
                    <ConsolidatePurchaseData
                      tableData={tableData}
                      purchaseProductShopNoDropDown={
                        purchaseProductShopNoDropDown
                      }
                    />
                  )}

                    <div className="consolidatedTable">
                      <PrintLaserTable
                        data={tableData}
                        columns={columns}
                        action4={action4}
                        ConsolidatedInvoiceTotalquantity={quantity}
                        ConsolidatedInvoiceTotaldiscount={discount}
                        ConsolidatedInvoiceTotaltotalPriceExculdingTax={
                          totalPriceExculdingTax
                        }
                        ConsolidatedInvoiceTotaltotalTaxAmount={totalTaxAmount}
                        ConsolidatedInvoiceTotalIncludingAllPrices={
                          totalAmountIncludingAllPrices
                        }
                      />
                      {/* )} */}
                    </div>
                  </div>
                </div>
                {/* </div> */}
              </div>
            </>
          )}
        </div>{" "}
      </div>
    </>
    // <div className="div1Container">
    //   <div style={{ width: "75%" }}>
    //     <Stack spacing={2} direction="row" alignItems="center">
    //       <Typography
    //         className="typograpgy"
    //         style={{ color: "#000000", fontSize: 30 }}
    //       >
    //         {t("consolidatePurcahseInvoice")}
    //       </Typography>
    //     </Stack>
    //     <Stack
    //       backgroundColor="white"
    //       borderRadius="50px 50px 0 0"
    //       padding={1}
    //       marginTop={1}
    //     >
    //       <Stack
    //         direction={{ xs: "column", sm: "row" }}
    //         spacing={3}
    //         padding={3}
    //       >
    //         <Form style={{ width: "100%" }}>
    //           <Stack
    //             direction="row"
    //             sx={{
    //               display: "flex",
    //               flexDirection: "row",
    //               justifyContent: "space-between",
    //               width: "100%",
    //             }}
    //           >
    //             <Form.Group
    //               widths="equal"
    //               style={{ display: "flex", gap: "30px" }}
    //             >
    //               {JSON.parse(localStorage.getItem("isAdministrator")) && (
    //                 <Dropdown
    //                   options={shopNoData?.map((element) => ({
    //                     key: element,
    //                     text: element,
    //                     value: element,
    //                   }))}
    //                   placeholder={t("selectShop")}
    //                   fluid
    //                   search
    //                   selection
    //                   clearable
    //                   disabled={isDisabled}
    //                   value={purchaseProductShopNoDropDown}
    //                   onChange={handleShopNovalue}
    //                   style={{ flex: 1, padding: "10px", width: "200px" }}
    //                 />
    //               )}{" "}
    //               <Dropdown
    //                 options={purchaseProductCodeData?.map((element) => ({
    //                   key: element,
    //                   text: element,
    //                   value: element,
    //                 }))}
    //                 placeholder={t("code")}
    //                 fluid
    //                 search
    //                 selection
    //                 clearable
    //                 disabled={isDisabled}
    //                 value={purchaseProductCodeDropDown}
    //                 onChange={handlePurchasesCodevalue}
    //                 style={{ flex: 1, width: "100px" }}
    //               />
    //               <Dropdown
    //                 options={purchaseProductcompanyData?.map((element) => ({
    //                   key: element,
    //                   text: element,
    //                   value: element,
    //                 }))}
    //                 placeholder={t("company")}
    //                 fluid
    //                 search
    //                 selection
    //                 clearable
    //                 disabled={isDisabled}
    //                 value={purchaseProductCompanyDropDown}
    //                 onChange={handlePurchaseComapnyvalue}
    //                 style={{ flex: 1, width: "100px" }}
    //               />
    //               <DatePicker
    //                 selected={purchaseStartDateDropDown}
    //                 onChange={handleDateSelectChange}
    //                 placeholderText={t("startingDate")}
    //                 dateFormat="dd/MM/yyyy"
    //                 style={{
    //                   flex: 1,
    //                   backgroundColor: "transparent",
    //                   border: "1px solid rgba(0, 0, 0, 0.1)",
    //                   borderRadius: "20px 20px 20px 20px",
    //                 }}
    //                 disabled={isDisabled}
    //               />
    //               <DatePicker
    //                 selected={purchaseEndDateDropDown}
    //                 onChange={handleSelectEndDateChange}
    //                 placeholderText={t("endingDate")}
    //                 dateFormat="dd/MM/yyyy"
    //                 style={{ flex: 1 }}
    //                 disabled={isDisabled}
    //               />
    //               <Dropdown
    //                 placeholder={t("selectTimePeriod")}
    //                 fluid
    //                 search
    //                 selection
    //                 clearable
    //                 style={{ flex: 1, width: "100px" }}
    //                 options={DateOptions}
    //                 value={selectedOption}
    //                 onChange={handleDropdownChange}
    //               />
    //             </Form.Group>
    //             <Form.Group
    //               widths="equal"
    //               style={{ display: "flex", gap: "20px" }}
    //             >
    //               <Button
    //                 style={{
    //                   backgroundColor: "transparent",
    //                   border: "1px solid rgba(0, 0, 0, 0.1)",
    //                   borderRadius: "10px 10px 10px 10px",
    //                   fontWeight: "bold",
    //                 }}
    //                 onClick={handleSearch}
    //               >
    //                 {t("search")}&nbsp;&nbsp;{<SearchIcon />}
    //               </Button>
    //               <Button
    //                 style={{
    //                   backgroundColor: "transparent",
    //                   border: "1px solid rgba(0, 0, 0, 0.1)",
    //                   borderRadius: "10px 10px 10px 10px",
    //                   fontWeight: "bold",
    //                 }}
    //                 onClick={() => {
    //                   setTableData([]);
    //                   setPurchaseProductShopNoDropDown("");
    //                   setPurchaseProductCodeDropDown("");
    //                   setPurchaseProductCompanyDropDown("");
    //                   setPurchaseStartDateDropDown("");
    //                   setPurchaseEndDateDropDown("");
    //                   setSelectedOption("");
    //                   setSelectedPrinter("");
    //                   setSelected(false);
    //                   setIsDisabled(false);
    //                 }}
    //               >
    //                 {t("clear")}&nbsp;&nbsp;{<ClearAllIcon />}
    //               </Button>
    //             </Form.Group>
    //           </Stack>
    //         </Form>
    //       </Stack>
    //     </Stack>
    //     <div className="invoice__preview bg-white p-5 rounded-2xl border-4 border-blue-200">
    //       {tableData?.length > 0 && (
    //         <>
    //           <PrinterSelectionDropdown
    //             selectedPrinter={selectedPrinter}
    //             onSelectPrinter={handleSelectPrinter}
    //           />
    //           <ReactToPrint
    //             trigger={() =>
    //               selected ? (
    //                 <button className="bg-blue-500 text-white font-bold py-2 px-8 rounded hover:bg-blue-600 hover:text-white transition-all duration-150 hover:ring-4 hover:ring-blue-400">
    //                   Print / Downloads
    //                 </button>
    //               ) : (
    //                 <h1></h1>
    //               )
    //             }
    //             content={() => consolidatedPurchaseInvoice.current}
    //             onAfterPrint={() => {
    //               setTableData([]);
    //               setPurchaseProductShopNoDropDown("");
    //               setPurchaseProductCodeDropDown("");
    //               setPurchaseProductCompanyDropDown("");
    //               setPurchaseStartDateDropDown("");
    //               setPurchaseEndDateDropDown("");
    //               setSelectedOption("");
    //               setSelected(false);
    //               setIsDisabled(false);
    //             }}
    //           />
    //         </>
    //       )}

    //       <div ref={consolidatedPurchaseInvoice} className="p-5">
    //         <ConsolidatePurchaseData
    //           props={{
    //             tableData: tableData,
    //             selectedPrinter: selectedPrinter,
    //             quantity: quantity,
    //             purchaseProductCodeDropDown: purchaseProductCodeDropDown,
    //             discount: discount,
    //             purchaseProductCompanyDropDown: purchaseProductCompanyDropDown,
    //             purchaseProductCompanyDropDown: purchaseProductCompanyDropDown,
    //             totalPriceExculdingTax: totalPriceExculdingTax,
    //             purchaseProductShopNoDropDown: purchaseProductShopNoDropDown,
    //             totalTaxAmount: totalTaxAmount,
    //             purchaseStartDateDropDown: purchaseStartDateDropDown,
    //             totalAmountIncludingAllPrices: totalAmountIncludingAllPrices,
    //             purchaseEndDateDropDown: purchaseEndDateDropDown,
    //           }}
    //         />
    //         {selectedPrinter === "thermal" ? (
    //           <PrintTableComponent
    //             data={tableData}
    //             columns={columns}
    //             column2={column2}
    //             action4={action4}
    //             ConsolidatedInvoiceTotalquantity={quantity}
    //             ConsolidatedInvoiceTotaldiscount={discount}
    //             ConsolidatedInvoiceTotaltotalPriceExculdingTax={
    //               totalPriceExculdingTax
    //             }
    //             ConsolidatedInvoiceTotaltotalTaxAmount={totalTaxAmount}
    //             ConsolidatedInvoiceTotalIncludingAllPrices={
    //               totalAmountIncludingAllPrices
    //             }
    //           />
    //         ) : (
    //           <PrintLaserTable
    //             data={tableData}
    //             columns={columns}
    //             action4={action4}
    //             ConsolidatedInvoiceTotalquantity={quantity}
    //             ConsolidatedInvoiceTotaldiscount={discount}
    //             ConsolidatedInvoiceTotaltotalPriceExculdingTax={
    //               totalPriceExculdingTax
    //             }
    //             ConsolidatedInvoiceTotaltotalTaxAmount={totalTaxAmount}
    //             ConsolidatedInvoiceTotalIncludingAllPrices={
    //               totalAmountIncludingAllPrices
    //             }
    //           />
    //         )}
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default ConsolidatedPuchaseReport;
