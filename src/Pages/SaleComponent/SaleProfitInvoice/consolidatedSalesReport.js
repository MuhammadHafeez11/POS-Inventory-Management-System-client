import React, { useEffect, useState, useRef } from "react";
// import MetaData from "../../../MetaData";
import MetaData from "../../../MetaData";
import { useSelector, useDispatch } from "react-redux";
import { DateRangePicker } from 'rsuite';
import 'rsuite/DateRangePicker/styles/index.css';
import { BsDot } from "react-icons/bs";
import ReactToPrint from "react-to-print";
import { searchSalesConsolidatednvoiceData } from "../../../Components/searchComponent/ConsolidatedReportSearch/salesReportSearch";
import { Button,  Dropdown,  } from "semantic-ui-react";
import PrintLaserTable from "../../../Components/tableComponent/printLaserTable";
import { getPermissionForRoles } from "../../user/rolesAssigned/RolesPermissionValidation";
import { useTranslation } from "react-i18next";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import { json, useNavigate } from "react-router-dom";
import { refreshTokken } from "../../../actions/userAction";
import { GET_SALE_CONSOLIDATED_FOR_SHOPS_SUCCESS, GET_SALE_CONSOLIDATED_FOR_SPECIFIC_SHOP_SUCCESS } from "../../../constants/saleConstants";
import { getSaleRecordForConsolidatedForProfit, getSaleRecordForConsolidatedProfitForSpecificShop, getSaleRecordForConsolidatedProfitForSpecificShopOnDate, getSaleRecordForConsolidatedProfitOnDates } from "../../../actions/saleProductAction";
import Modal from "./ProfitModel";
import { getExpenseRecordForConsolidated, getExpenseRecordForConsolidatedForSpecificShop } from "../../../actions/expenseAction";
import { GET_EXPENSE_CONSOLIDATED_FOR_SHOPS_SUCCESS, GET_EXPENSE_CONSOLIDATED_FOR_SPECIFIC_SHOP_SUCCESS } from "../../../constants/expenseConstants";
import { getPaidCommissionRecordForConsolidatedForProfit, getPaidCommissionRecordForConsolidatedProfitForSpecificShop } from "../../../actions/employeCommissionAction";
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
const ProfitSalesReport = () => {
  const action4 = "ConsolProfitReport";
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch()
  //General UseState
  const [isCalled, setIsCalled] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [commissionTableData, setCommissionTableData] = useState([]);
  const [expenseTableData, setExpenseTableData] = useState([])
  const [showComponent, setShowComponent] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [valuesChanging, setValuesChanging] = useState(true)
  const [salesConsolidatedPermission, setSalesConsolidatedPermission] =
    useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const consolidatedSalesInvoice = useRef();
  const [modelTitle, setModelTitle] = useState()
  const [dateRange, setDateRange] = useState([]);
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
  const [selected, setSelected] = useState(false);
  const [colorTheme, setColorTheme] = useState("theme-white");
  const [tableRecord, setTableRecord] = useState()
  const {saleConsolidateProiftForShopsRecord, saleConsolidateProiftForShopsRecordLoading} = useSelector((state)=> state.saleConsolidateProiftForShopsRecord)
  const {paidCommissionConsolidateForShopsRecord, paidCommissionConsolidateForShopsRecordLoading} = useSelector((state)=> state.paidCommissionConsolidateForShopsRecord)
  const {saleConsolidateForSpecificShopsRecord, saleConsolidateForSpecificShopsRecordLoading} = useSelector((state)=> state.saleConsolidateForSpecificShopsRecord)
  const {expenseConsolidateForShopsRecord, expenseConsolidateForShopsRecordLoading}= useSelector((state) => state.expenseConsolidateForShopsRecord)
  const {expenseConsolidateForSpecificShopsRecord, expenseConsolidateForSpecificShopsRecordLoading} = useSelector((state)=> state.expenseConsolidateForSpecificShopsRecord)
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
    setsalesProductShopNoDropDown(value);
    setValuesChanging(true)
    dispatch({
      type: GET_SALE_CONSOLIDATED_FOR_SHOPS_SUCCESS,
      payload: [],
    }); 
    dispatch({
      type: GET_EXPENSE_CONSOLIDATED_FOR_SHOPS_SUCCESS,
      payload: [],
    });
    dispatch(getExpenseRecordForConsolidatedForSpecificShop(value, `last3Months`))
    dispatch(getSaleRecordForConsolidatedProfitForSpecificShop(value, `last3Months`))
    dispatch(getPaidCommissionRecordForConsolidatedProfitForSpecificShop(value, `last3Months`))
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
    console.log("jdfeilijsf")
    if(JSON.parse(localStorage.getItem("isAdministrator")) || JSON.parse(localStorage.getItem("isSuperAdmin")))
    {
      setValuesChanging(true)
      console.log("jdfeilijsf")
      dispatch({
        type: GET_SALE_CONSOLIDATED_FOR_SPECIFIC_SHOP_SUCCESS,
        payload: [],
      }); dispatch({
        type: GET_EXPENSE_CONSOLIDATED_FOR_SPECIFIC_SHOP_SUCCESS,
        payload: [],
      });
     dispatch(getExpenseRecordForConsolidated("last3Months"))
     dispatch(getSaleRecordForConsolidatedForProfit("last3Months"))
     dispatch(getPaidCommissionRecordForConsolidatedForProfit("last3Months"))
     
    }else{
      setValuesChanging(true)
      dispatch({
        type: GET_SALE_CONSOLIDATED_FOR_SHOPS_SUCCESS,
        payload: [],
      });        
      dispatch({
        type: GET_EXPENSE_CONSOLIDATED_FOR_SHOPS_SUCCESS,
        payload: [],
      });
  dispatch(getExpenseRecordForConsolidatedForSpecificShop(JSON.parse(localStorage.getItem("shopId")), `last3Months`))
  dispatch(getSaleRecordForConsolidatedProfitForSpecificShop(JSON.parse(localStorage.getItem("shopId")), `last3Months`))
  
  dispatch(getPaidCommissionRecordForConsolidatedProfitForSpecificShop(JSON.parse(localStorage.getItem("shopId")), `last3Months`))
 
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
     dispatch(getSaleRecordForConsolidatedForProfit("last3Months"))
     dispatch(getPaidCommissionRecordForConsolidatedForProfit("last3Months"))
    
     
    }else{
      dispatch({
        type: GET_SALE_CONSOLIDATED_FOR_SHOPS_SUCCESS,
        payload: [],
      });
  dispatch(getSaleRecordForConsolidatedProfitForSpecificShop(JSON.parse(localStorage.getItem("shopId")), `last3Months`))
  dispatch(getPaidCommissionRecordForConsolidatedProfitForSpecificShop(JSON.parse(localStorage.getItem("shopId")), `last3Months`))

  }
  }

  useEffect(()=>{
    if(saleConsolidateProiftForShopsRecord?.success && !saleConsolidateProiftForShopsRecordLoading)
    {
      console.log(saleConsolidateProiftForShopsRecord)
      setTableData(saleConsolidateProiftForShopsRecord?.salesData[0])
      setTableRecord(saleConsolidateProiftForShopsRecord?.salesData[0])
      setValuesChanging(false)
    }

  }, [saleConsolidateProiftForShopsRecord, saleConsolidateProiftForShopsRecordLoading])

  useEffect(()=>{
    if(paidCommissionConsolidateForShopsRecord?.success && !paidCommissionConsolidateForShopsRecordLoading)
    {
      console.log(paidCommissionConsolidateForShopsRecord)
      setCommissionTableData(paidCommissionConsolidateForShopsRecord?.commissionData)
    
    }

  }, [paidCommissionConsolidateForShopsRecord, paidCommissionConsolidateForShopsRecordLoading])

  useEffect(()=>{
    if(expenseConsolidateForShopsRecord?.success && !expenseConsolidateForShopsRecordLoading)
    {
      setExpenseTableData(expenseConsolidateForShopsRecord?.expenseData)
     
    }

  }, [expenseConsolidateForShopsRecord, expenseConsolidateForShopsRecordLoading])
  
  useEffect(()=>{
    if(expenseConsolidateForSpecificShopsRecord?.success && !expenseConsolidateForSpecificShopsRecordLoading)
    {
        setExpenseTableData(expenseConsolidateForSpecificShopsRecord?.expenseData)
  
    }

  }, [expenseConsolidateForSpecificShopsRecord, expenseConsolidateForSpecificShopsRecordLoading])





  const handleOpenModal = (title) => {
    setIsModalOpen(true);
    setModelTitle(title)
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };


  const handleDateChange = (value) => {
    console.log(value)
    if(value?.length > 0)
    {
      const startingDate = new Date(value[0])
      const endingDate = new Date(value[1])
      setSalesStartDateDropDown(startingDate)
      setSalesEndDateDropDown(endingDate)
      setDateRange(value);
      if(JSON.parse(localStorage.getItem("isAdministrator")) || JSON.parse(localStorage.getItem("isSuperAdmin")))
        {
          if(salesProductShopNoDropDown && salesStartDateDropDown){
            setValuesChanging(true)
            dispatch(getSaleRecordForConsolidatedProfitForSpecificShopOnDate(salesProductShopNoDropDown,startingDate, endingDate))
          }else{
            dispatch(getSaleRecordForConsolidatedProfitOnDates(startingDate, endingDate))
               setValuesChanging(true)
          }
         
        }else{
          dispatch(getSaleRecordForConsolidatedProfitForSpecificShopOnDate(JSON.parse(localStorage.getItem('shopId')), startingDate, endingDate))
             setValuesChanging(true)
        }
    }else{
      setSalesStartDateDropDown('')
      setSalesEndDateDropDown('')
      setDateRange(value)
    }
    
  };


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
      dispatch(getSaleRecordForConsolidatedProfitForSpecificShopOnDate(salesProductShopNoDropDown,salesStartDateDropDown, date))
    }else{
      dispatch(getSaleRecordForConsolidatedProfitOnDates(salesStartDateDropDown, date))
         setValuesChanging(true)
    }
   
  }else{
    dispatch(getSaleRecordForConsolidatedProfitForSpecificShopOnDate(JSON.parse(localStorage.getItem('shopId')), salesStartDateDropDown, date))
       setValuesChanging(true)
  }

};

  // Handle the dropdown selection
  const handleDropdownChange =async (event, { value }) => {
    if(salesProductShopNoDropDown){
      setSelectedOption(value);
      setValuesChanging(true)
      dispatch({
        type: GET_SALE_CONSOLIDATED_FOR_SHOPS_SUCCESS,
        payload: [],
      });
      dispatch({
        type: GET_EXPENSE_CONSOLIDATED_FOR_SHOPS_SUCCESS,
        payload: [],
      });
      dispatch(getExpenseRecordForConsolidatedForSpecificShop(salesProductShopNoDropDown, value))
      dispatch(getSaleRecordForConsolidatedProfitForSpecificShop(salesProductShopNoDropDown, value))
      dispatch(getPaidCommissionRecordForConsolidatedProfitForSpecificShop(salesProductShopNoDropDown, value))
    }else   
    if(JSON.parse(localStorage.getItem("isAdministrator")) || JSON.parse(localStorage.getItem("isSuperAdmin")))
      { 
        setSelectedOption(value);
        setValuesChanging(true)
        dispatch({
          type: GET_SALE_CONSOLIDATED_FOR_SPECIFIC_SHOP_SUCCESS,
          payload: [],
        });
        dispatch({
          type: GET_EXPENSE_CONSOLIDATED_FOR_SPECIFIC_SHOP_SUCCESS,
          payload: [],
        });
       dispatch(getExpenseRecordForConsolidated(value))
       dispatch(getSaleRecordForConsolidatedForProfit(value))
      dispatch(getPaidCommissionRecordForConsolidatedForProfit(value))
      }
      else{
      setSelectedOption(value);
      setValuesChanging(true)
      dispatch({
        type: GET_SALE_CONSOLIDATED_FOR_SHOPS_SUCCESS,
        payload: [],
      });
      dispatch({
        type: GET_EXPENSE_CONSOLIDATED_FOR_SHOPS_SUCCESS,
        payload: [],
      });
      dispatch(getExpenseRecordForConsolidatedForSpecificShop(JSON.parse(localStorage.getItem("shopId")), value))
      dispatch(getSaleRecordForConsolidatedProfitForSpecificShop(JSON.parse(localStorage.getItem("shopId")), value))
      dispatch(getPaidCommissionRecordForConsolidatedProfitForSpecificShop(JSON.parse(localStorage.getItem("shopId")), value))
    }
  };



  

  //Function to search element
  const handleSearch = async (code, company) => {
    console.log(tableRecord)
    setValuesChanging(true)
    const finalDataForTable = await searchSalesConsolidatednvoiceData(
      tableRecord,
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
    { field: "Code", label: "Code" },
    { field: "Company", label: "Company" },
    { field: "PurchaseQuantity", label: "Quantity" },
    { field: "excludeTaxPrice", label: "MRP" },
    { field: "Discount", label: "Discount" },
    { field: "salePrice", label: "SalePrice" },
    { field: "taxAmount", label: "Tax Amount" },
    { field: "amount", label: "Total Amount" },
    { field: "profitBeforeExpenses", label: "Profit" },
    { field: "dateWithProduct", label: "Invoice Date" },
  ];

  const expenseColumns = [
    { field: "expenses.expenseType", label: "Expense Type" },
    { field: "expenses.expenseAmount", label: "Expense Amount" },
    { field: "expenseCategory", label: "Category" },
    { field: "expenseLocation", label: "Expense Location" },
    { field: "expenses.dateWithProduct", label: "Date" },
  ];


  const commissionColumns = [
    { field: "employeName", label: "Employee Name" },
    { field: "shopNo", label: "Branch" },
    { field: "percentage", label: "Percentage" },
    { field: "totalCommission", label: "Paid Commission" },
    {field: "createdAt", label: "Date", format: "Date"}
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
                <h3>{t("consolidateProfitInvoice")}</h3>
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
                  // className="purchaseDropdown1"
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
                // className="consolidatePurchaseDropdown"
                selection
                options={DateOptions}
                value={selectedOption}
                onChange={handleDropdownChange}
              />
           
                 <DateRangePicker
                 showOneCalendar
                size="lg"
                value={dateRange}
                onChange={handleDateChange}
                placeholder="Select Date Range"
                className="saleProfitDatePicker"
                // style={{ left: "700px" }}
                />
           
              <Button
                // className="buttonSearchBack"
                onClick={handleClearData}
              >
                {t("clear")}&nbsp;&nbsp;{<ClearAllIcon />}
              </Button>
              <ReactToPrint
                        trigger={() =>
                         <button className="printButton" >
                              Print&nbsp;&nbsp;
                            </button>
                        
                        }
                        content={() => consolidatedSalesInvoice.current}
                        onAfterPrint={() => {
                          getSaleRecordForConsolidatedForProfit()
                          
                          
                          setsalesProductShopNoDropDown("");
                          setSalesProductCodeDropDown("");
                          setsalesProductCompanyDropDown("");
                          setSalesStartDateDropDown("");
                          setSelectedOption("");
                          setSalesEndDateDropDown("");
                          setSelectedPrinter("");
                          setIsDisabled(false);
                        }}
                      />
            </div>
            <div className="profit-table-container">
              <div className="divSection">
                      <div className="divBlock">
                        <div className="divDetails">
                            <div><BsDot /> <h5>Gross Profit: </h5><h6>{tableData?.profitWithoutExpensesAndCommission ? tableData?.profitWithoutExpensesAndCommission : 0}</h6></div>
                            <div><BsDot /> <h5>Expenses </h5><h6>{tableData?.totalExpenses ? tableData?.totalExpenses : 0}</h6></div>
                            <div><BsDot /> <h5>Commission: </h5><h6>{tableData?.totalPaidCommission ? tableData?.totalPaidCommission : 0}</h6></div>
                            <div><BsDot /> <h5>Net Profit: </h5><h6>{tableData?.totalProfitAfterExpenses ? tableData?.totalProfitAfterExpenses : 0}</h6></div>
                        </div>
                        <div className="divButton">
                        </div>
                      </div>
                      <div className="divBlock">
                        <div className="divDetails">
                            <div><BsDot /> <h5>Shop No: </h5><h6>{tableData?.shopNo ? tableData?.shopNo : "No Record Found For this Shop"}</h6></div>
                            <div><BsDot /> <h5>Items Sold: </h5><h6>{tableData?.totalQuantity ? tableData?.totalQuantity : 0}</h6></div>
                            <div><BsDot /> <h5>Total Purchase: </h5><h6>{tableData?.totalPurchasePrice ? tableData?.totalPurchasePrice : 0}</h6></div>
                            <div><BsDot /> <h5>Total MRP: </h5><h6>{tableData?.totalMRPPrice ? tableData?.totalMRPPrice : 0}</h6></div>
                            <div><BsDot /> <h5>Profit On Sold Items: </h5><h6>{tableData?.profitWithoutExpensesAndCommission ? tableData?.profitWithoutExpensesAndCommission : 0}</h6></div>
                        </div>
                        <div className="divButton">
                          <button onClick={()=> handleOpenModal('View Details')}>View Details</button>
                        </div>
                      </div>
                      <div className="divBlock">
                        <div className="divDetails">
                            <div><BsDot /> <h5>Total Expenses: </h5><h6>{tableData?.totalExpenses ? tableData?.totalExpenses : 0}</h6></div>                          
                        </div>
                        <div className="divButton">
                          <button onClick={()=> handleOpenModal('View Expense Details')}>View Details</button>
                        </div>
                      </div>
                      <div className="divBlock">
                        <div className="divDetails">
                            <div><BsDot /> <h5>Commission: </h5><h6>{tableData?.totalPaidCommission}</h6></div>
                        </div>
                        <div className="divButton">
                          <button onClick={()=> handleOpenModal('View Commission Details')}>View Details</button>
                        </div>
                      </div>
              </div>
              <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                modelTitle={modelTitle}
                columns={columns}
                expenseColumns={expenseColumns}
                tableData={tableData}
                expenseTableData = {expenseTableData}
                commissionColumns = {commissionColumns}
                commissionTableData = {commissionTableData}
                // dataId={selectedDataId}
              />


              <div
                ref={consolidatedSalesInvoice}
                style={{display: "none"}}
                className="consolidateMainTableDiv"
              >
                {/* <div>
                <ConsolidatedSaleData
                  tableData = {tableData?.products}
                  salesProductShopNoDropDown= {salesProductShopNoDropDown}
/>
                </div> */}
                <div>
                    <PrintLaserTable
                      data={tableData?.products}
                      columns={columns}
                      // action4={action4}
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

export default ProfitSalesReport;
