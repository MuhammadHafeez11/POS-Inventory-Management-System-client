import React, { useEffect, useState, useRef } from "react";
import MetaData from "../../../MetaData";
import "react-datepicker/dist/react-datepicker.css"
import { useSelector, useDispatch } from "react-redux";
import DatePicker from "react-datepicker";
import ReactToPrint from "react-to-print";
import { searchSalesConsolidatednvoiceData } from "../../../Components/searchComponent/ConsolidatedReportSearch/salesReportSearch";
import { Button, Dropdown, Loader } from "semantic-ui-react";
import PrintLaserTable from "../../../Components/tableComponent/printLaserTable";
import { getPermissionForRoles } from "../../user/rolesAssigned/RolesPermissionValidation";
import PageLoader from "../../../Components/Loader/PageLoader"
import { useTranslation } from "react-i18next";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import { getSaleConsolidatedRecord, getSaleRecordForConsolidated, getSaleRecordForConsolidatedForSpecificShop, getSaleRecordForConsolidatedForSpecificShopOnDate, getSaleRecordForConsolidatedOnDates } from "../../../actions/saleProductAction";
import {  useNavigate } from "react-router-dom";
import { refreshTokken } from "../../../actions/userAction";
import ConsolidatedSaleData from "./consolidatedSaleData";
import PrintIcon from '@mui/icons-material/Print';
import { GET_SALE_CONSOLIDATED_FOR_SHOPS_SUCCESS, GET_SALE_CONSOLIDATED_FOR_SPECIFIC_SHOP_SUCCESS } from "../../../constants/saleConstants";
let salesRecord = [];
//Below variables for calculating total of the values that we want to display in table
let quantity = [];
let discount = [];
let totalPriceExculdingTax = [];
let totalTaxAmount = [];
let totalAmountIncludingAllPrices = [];
let isCalledd = "false";
let code = "";
let type = "";
let companyProduct = "";
const ConsolidatedSalesReport = () => {
  const action4 = "ConsolReport";
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch()
  //General UseState
  const [isCalled, setIsCalled] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [showComponent, setShowComponent] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [valuesChanging, setValuesChanging] = useState(true)
  const [returnData, setReturnData] = useState()
  const [salesConsolidatedPermission, setSalesConsolidatedPermission] =
    useState(false);
  const consolidatedSalesInvoice = useRef();

  //UseState For setting dropDowns values
  const [salesProductShopNoDropDown, setsalesProductShopNoDropDown] =
    useState("");
  const [salesProductCodeDropDown, setSalesProductCodeDropDown] = useState("");
  const [salesProductCompanyDropDown, setsalesProductCompanyDropDown] =
    useState("");
  const [salesStartDateDropDown, setSalesStartDateDropDown] = useState(null);
  const [salesEndDateDropDown, setSalesEndDateDropDown] = useState(null);
  const { shop } = useSelector((state) => state.shop);
  //printerOption
  const [selectedPrinter, setSelectedPrinter] = useState();
  const [loadingPrintData, setLoadingPrintData] = useState(false)
  const [selected, setSelected] = useState(false);
  const [colorTheme, setColorTheme] = useState("theme-white");
  const [tableRecord, setTableRecord] = useState()
  const {saleConsolidateForShopsRecord, saleConsolidateForShopsRecordLoading} = useSelector((state)=> state.saleConsolidateForShopsRecord)
  const {saleConsolidateForSpecificShopsRecord, saleConsolidateForSpecificShopsRecordLoading} = useSelector((state)=> state.saleConsolidateForSpecificShopsRecord)
  const {saleConsolidateForShopsOnDateRecord, saleConsolidateForShopsOnDateRecordLoading} = useSelector((state)=> state.saleConsolidateForShopsOnDateRecord)
  const {saleConsolidateForSpecificShopsOnDateRecord, saleConsolidateForSpecificShopsOnDateRecordLoading} = useSelector((state)=> state.saleConsolidateForSpecificShopsOnDateRecord)
  const navigate = useNavigate();

 

  useEffect(() => {
    isCalledd = "false";
  });

  useEffect(() => {
    const currentColorTheme = localStorage.getItem("theme-color");
    if (currentColorTheme) {
      setColorTheme(currentColorTheme);
    }
  }, [colorTheme]);

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

  //Function To handle the Shop No Value that would be sales in fiter
  const handleShopNovalue = (event, { value }) => {
    setValuesChanging(true)
    dispatch({
      type: GET_SALE_CONSOLIDATED_FOR_SHOPS_SUCCESS,
      payload: [],
    });
    dispatch(getSaleRecordForConsolidatedForSpecificShop(value, `last3Months`))
    setsalesProductShopNoDropDown(value);
  };

  const handleBeforePrint = () => {
    console.log('ajfei')
    setLoadingPrintData(true);
  };

  const handleAfterPrint = () => {
    setLoadingPrintData(false);
  };


  // All New Work Of Consolidated Report

  useEffect(() => {
    setSalesConsolidatedPermission(false);
    getPermission();
  }, []);

  async function getPermission() {
    try {
      const permissionForAdd = await getPermissionForRoles(
        "View Consolidated Sale Invoice"
      );
      setSalesConsolidatedPermission(permissionForAdd);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  
  useEffect(() => {
    if(JSON.parse(localStorage.getItem("isAdministrator")) || JSON.parse(localStorage.getItem("isSuperAdmin")))
    {
      setValuesChanging(true)
      dispatch({
        type: GET_SALE_CONSOLIDATED_FOR_SPECIFIC_SHOP_SUCCESS,
        payload: [],
      });
     dispatch(getSaleRecordForConsolidated("last3Months"))
     
    }else{
      setValuesChanging(true)
      dispatch({
        type: GET_SALE_CONSOLIDATED_FOR_SHOPS_SUCCESS,
        payload: [],
      });
  dispatch(getSaleRecordForConsolidatedForSpecificShop(JSON.parse(localStorage.getItem("shopId")), `last3Months`))
 
  }
  }, []);

  const handleClearData = () =>{
    setValuesChanging(true)
    companyProduct=''
    code=''
    setsalesProductShopNoDropDown("");
    setSalesProductCodeDropDown("");
    setsalesProductCompanyDropDown("");
    setSalesStartDateDropDown("");
    setSalesEndDateDropDown("");
    setSelectedOption("");
    setIsDisabled(false);
    if(JSON.parse(localStorage.getItem("isAdministrator")) || JSON.parse(localStorage.getItem("isSuperAdmin")))
    {
      dispatch({
        type: GET_SALE_CONSOLIDATED_FOR_SPECIFIC_SHOP_SUCCESS,
        payload: [],
      });
     dispatch(getSaleRecordForConsolidated("last3Months"))
    
     
    }else{
      dispatch({
        type: GET_SALE_CONSOLIDATED_FOR_SHOPS_SUCCESS,
        payload: [],
      });
  dispatch(getSaleRecordForConsolidatedForSpecificShop(JSON.parse(localStorage.getItem("shopId")), `last3Months`))

  }
  }

  useEffect(()=>{
    if(saleConsolidateForShopsRecord?.success && !saleConsolidateForShopsRecordLoading)
    {
      setTableData(saleConsolidateForShopsRecord?.salesData)
      setReturnData(saleConsolidateForShopsRecord?.returnData)
      setTableRecord(saleConsolidateForShopsRecord?.salesData)
      setValuesChanging(false)
    }

  }, [saleConsolidateForShopsRecord, saleConsolidateForShopsRecordLoading])
  
  useEffect(()=>{
    if(saleConsolidateForSpecificShopsRecord?.success && !saleConsolidateForSpecificShopsRecordLoading)
    {
        setTableData(saleConsolidateForSpecificShopsRecord?.salesData)
        setReturnData(saleConsolidateForSpecificShopsRecord?.returnData)
      setTableRecord(saleConsolidateForSpecificShopsRecord?.salesData)
    setValuesChanging(false)
    }

  }, [saleConsolidateForSpecificShopsRecord, saleConsolidateForSpecificShopsRecordLoading])




  //Function to set Starting Date
  const handleDateSelectChange = (date) => {
    setSalesStartDateDropDown(date);
  };


//Function to set Ending Date
const handleSelectEndDateChange =async (date) => {
  setSalesEndDateDropDown(date);
  if(JSON.parse(localStorage.getItem("isAdministrator")) || JSON.parse(localStorage.getItem("isSuperAdmin")))
  {
    if(salesProductShopNoDropDown && salesStartDateDropDown){
      setValuesChanging(true)
      dispatch(getSaleRecordForConsolidatedForSpecificShopOnDate(salesProductShopNoDropDown,salesStartDateDropDown, date))
    }else{
      dispatch(getSaleRecordForConsolidatedOnDates(salesStartDateDropDown, date))
         setValuesChanging(true)
    }
   
  }else{
    dispatch(getSaleRecordForConsolidatedForSpecificShopOnDate(JSON.parse(localStorage.getItem('shopId')), salesStartDateDropDown, date))
       setValuesChanging(true)
  }

};

useEffect(()=>{
  if(!saleConsolidateForShopsOnDateRecordLoading && saleConsolidateForShopsOnDateRecord?.success)
  {
    setTableData(saleConsolidateForShopsOnDateRecord?.salesData)
    setReturnData(saleConsolidateForShopsOnDateRecord?.returnData)
    setTableRecord(saleConsolidateForShopsOnDateRecord?.salesData)
    setValuesChanging(false)
  }

}, [saleConsolidateForShopsOnDateRecord, saleConsolidateForShopsOnDateRecordLoading])


useEffect(()=>{
  if(!saleConsolidateForSpecificShopsOnDateRecordLoading && saleConsolidateForSpecificShopsOnDateRecord?.success)
  {
    setTableData(saleConsolidateForSpecificShopsOnDateRecord?.salesData)
    setReturnData(saleConsolidateForSpecificShopsOnDateRecord?.returnData)
    setTableRecord(saleConsolidateForSpecificShopsOnDateRecord?.salesData)
    setValuesChanging(false)
  }

}, [saleConsolidateForSpecificShopsOnDateRecord, saleConsolidateForSpecificShopsOnDateRecordLoading])

  // Handle the dropdown selection
  const handleDropdownChange =async (event, { value }) => {
    if(salesProductShopNoDropDown){
      setSelectedOption(value);
      setValuesChanging(true)
      dispatch({
        type: GET_SALE_CONSOLIDATED_FOR_SHOPS_SUCCESS,
        payload: [],
      });
      dispatch(getSaleRecordForConsolidatedForSpecificShop(salesProductShopNoDropDown, value))
    }
  if(JSON.parse(localStorage.getItem("isAdministrator")) || JSON.parse(localStorage.getItem("isSuperAdmin")))
  {
    setSelectedOption(value);
    setValuesChanging(true)
    dispatch({
      type: GET_SALE_CONSOLIDATED_FOR_SPECIFIC_SHOP_SUCCESS,
      payload: [],
    });
   dispatch(getSaleRecordForConsolidated(value))
   
  }
    else{
      setSelectedOption(value);
      setValuesChanging(true)
      dispatch({
        type: GET_SALE_CONSOLIDATED_FOR_SHOPS_SUCCESS,
        payload: [],
      });
      dispatch(getSaleRecordForConsolidatedForSpecificShop(JSON.parse(localStorage.getItem("shopId")), value))
    }
  };



  

  //Function to search element
  const handleSearch = async (code, company) => {
    console.log(tableRecord)
    setValuesChanging(true)
    const finalDataForTable = await searchSalesConsolidatednvoiceData(
      tableRecord,
      // salesProductShopNoDropDown,
      code,
      company,
      salesStartDateDropDown,
      salesEndDateDropDown
    );
      console.log(finalDataForTable)
    setTableData(finalDataForTable);
    setValuesChanging(false)
    console.log(finalDataForTable);
  };

  const columns = [
    { field: "products.Code", label: "Code" },
    { field: "products.Namee", label: "Name" },
    { field: "products.Company", label: "Company" },
    { field: "products.PurchaseQuantity", label: "Quantity" },
    { field: "products.excludeTaxPrice", label: "Price" },
    { field: "products.totalAmounnt", label: "Total Price" },
    { field: "products.Discount", label: "Discount" },
    { field: "products.taxAmount", label: "Tax Amount" },
    { field: "products.amount", label: "Total Amount" },
    { field: "products.dateWithProduct", label: "Invoice Date" },
  ];

  const columns1 = [
    { field: "products.Code", label: "Code" },
    { field: "products.Namee", label: "Name" },
    { field: "products.Company", label: "Company" },
    { field: "products.PurchaseQuantity", label: "Quantity" },
    { field: "products.excludeTaxPrice", label: "Price" },
    { field: "products.totalAmounnt", label: "Total Price" },
    { field: "products.Discount", label: "Discount" },
    { field: "products.amount", label: "Total Amount" },
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
      <MetaData title="QE ~~SaleInvoice" />
      <div className={`Sale ${colorTheme}`}>
        <div className="secondContainer">
          {salesConsolidatedPermission && (
            <>
              <div className="contentt-box">
                <div className="heading-container">
                  <h3>{t("consolidateSaleInvoice")}</h3>
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
                    search
                    selection
                    disabled={isDisabled}
                    value={salesProductShopNoDropDown}
                    onChange={handleShopNovalue}
                  />
                )}
                <Dropdown
                  placeholder={t("selectTimePeriod")}
                  fluid
                  className="consolidatePurchaseDropdown"
                  selection
                  options={DateOptions}
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
                    companyProduct = e.target.value;
                    handleSearch(code, companyProduct);
                  }}
                />
                <DatePicker
                  selected={salesStartDateDropDown}
                  onChange={handleDateSelectChange}
                  placeholderText={t("startingDate")}
                  dateFormat="dd/MM/yyyy"
                  className="datePicker"
                />
                <DatePicker
                  selected={salesEndDateDropDown}
                  onChange={handleSelectEndDateChange}
                  placeholderText={t("endingDate")}
                  dateFormat="dd/MM/yyyy"
                  className="datePicker"
                />
                <Button className="buttonSearchBack" onClick={handleClearData}>
                  {t("clear")}&nbsp;&nbsp;{<ClearAllIcon />}
                </Button>
                {!loadingPrintData ? (
                  <ReactToPrint
                    trigger={() => (
                      <button onClick={handleBeforePrint}>
                        Print&nbsp;&nbsp;
                        <PrintIcon />
                      </button>
                    )}
                    content={() => consolidatedSalesInvoice.current}
                    onBeforeGetContent={handleBeforePrint}
                    onAfterPrint={() => {
                      getSaleConsolidatedRecord();
                      setsalesProductShopNoDropDown("");
                      setSalesProductCodeDropDown("");
                      setsalesProductCompanyDropDown("");
                      setSalesStartDateDropDown("");
                      setSelectedOption("");
                      setSalesEndDateDropDown("");
                      setSelectedPrinter("");
                      handleAfterPrint();
                      setIsDisabled(false);
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
                <div className="consolidatedDatesData">
                  {!valuesChanging && (
                    <ConsolidatedSaleData
                      tableData={tableData}
                      returnData={returnData}
                      salesProductShopNoDropDown={salesProductShopNoDropDown}
                    />
                  )}
                </div>
                <div className="consolidatedSaleTable">
                  {!valuesChanging ? (
                    <>
                      {JSON.parse(localStorage.getItem("SoftwareWithFBR")) ? (
                        <>
                          <PrintLaserTable
                            data={tableData}
                            returnData={returnData}
                            columns={columns}
                            action4={action4}
                            ConsolidatedInvoiceTotalquantity={quantity}
                            ConsolidatedInvoiceTotaldiscount={discount}
                            ConsolidatedInvoiceTotaltotalPriceExculdingTax={
                              totalPriceExculdingTax
                            }
                            ConsolidatedInvoiceTotaltotalTaxAmount={
                              totalTaxAmount
                            }
                            ConsolidatedInvoiceTotalIncludingAllPrices={
                              totalAmountIncludingAllPrices
                            }
                          />
                        </>
                      ) : (
                        <>
                          <PrintLaserTable
                            data={tableData}
                            returnData={returnData}
                            columns={columns1}
                            action4={action4}
                            ConsolidatedInvoiceTotalquantity={quantity}
                            ConsolidatedInvoiceTotaldiscount={discount}
                            ConsolidatedInvoiceTotaltotalPriceExculdingTax={
                              totalPriceExculdingTax
                            }
                            ConsolidatedInvoiceTotaltotalTaxAmount={
                              totalTaxAmount
                            }
                            ConsolidatedInvoiceTotalIncludingAllPrices={
                              totalAmountIncludingAllPrices
                            }
                          />
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <PageLoader />
                    </>
                  )}
                </div>
                <div style={{ display: "none" }}>
                  <div
                    ref={consolidatedSalesInvoice}
                    //
                    style={{
                      padding: "5px",
                      display: "flex",
                      paddingBottom: "0px",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                   {!valuesChanging && (
                    <ConsolidatedSaleData
                      tableData={tableData}
                      returnData={returnData}
                      salesProductShopNoDropDown={salesProductShopNoDropDown}
                    />
                  )}
                    {JSON.parse(localStorage.getItem("SoftwareWithFBR")) ? (
                      <>
                        <PrintLaserTable
                          data={tableData}
                          returnData={returnData}
                          columns={columns}
                          action4={action4}
                          ConsolidatedInvoiceTotalquantity={quantity}
                          ConsolidatedInvoiceTotaldiscount={discount}
                          ConsolidatedInvoiceTotaltotalPriceExculdingTax={
                            totalPriceExculdingTax
                          }
                          ConsolidatedInvoiceTotaltotalTaxAmount={
                            totalTaxAmount
                          }
                          ConsolidatedInvoiceTotalIncludingAllPrices={
                            totalAmountIncludingAllPrices
                          }
                        />
                      </>
                    ) : (
                      <>
                        <PrintLaserTable
                          data={tableData}
                          returnData={returnData}
                          columns={columns1}
                          action4={action4}
                          ConsolidatedInvoiceTotalquantity={quantity}
                          ConsolidatedInvoiceTotaldiscount={discount}
                          ConsolidatedInvoiceTotaltotalPriceExculdingTax={
                            totalPriceExculdingTax
                          }
                          ConsolidatedInvoiceTotaltotalTaxAmount={
                            totalTaxAmount
                          }
                          ConsolidatedInvoiceTotalIncludingAllPrices={
                            totalAmountIncludingAllPrices
                          }
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ConsolidatedSalesReport;
