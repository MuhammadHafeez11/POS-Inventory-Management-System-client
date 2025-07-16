import React, { useEffect, useState, useRef } from "react";
import MetaData from "../../../MetaData";
import { searchExpenseConsolidatednvoiceData } from "../../../Components/searchComponent/ConsolidatedReportSearch/expenseReportSearch";

import ReactToPrint from "react-to-print";
import "react-datepicker/dist/react-datepicker.css"
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from "react-redux";
import { Button,  Dropdown, Loader } from "semantic-ui-react";
import PrintIcon from '@mui/icons-material/Print';
import PrintTableComponent from "../../../Components/tableComponent/printTableComponent";
import PrintLaserTable from "../../../Components/tableComponent/printLaserTable";
import { useTranslation } from "react-i18next";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import {  getExpenseRecordForConsolidated, getExpenseRecordForConsolidatedForSpecificShop, getExpenseRecordForConsolidatedForSpecificShopOnDate, getExpenseRecordForConsolidatedOnDates, getExpeseRecordForConsolidatedForSpecificShop } from "../../../actions/expenseAction";
import { refreshTokken } from "../../../actions/userAction";
import { useNavigate } from "react-router-dom";
import ConsolidatedExpenseData from "./consolidatedExpensedata";
import { getPermissionForRoles } from "../../user/rolesAssigned/RolesPermissionValidation";
import { getExpenseType } from "../../../actions/expenseTypeAction";
import { GET_EXPENSE_CONSOLIDATED_FOR_SHOPS_SUCCESS, GET_EXPENSE_CONSOLIDATED_FOR_SPECIFIC_SHOP_SUCCESS } from "../../../constants/expenseConstants";
import PageLoader from "../../../Components/Loader/PageLoader";
let expenseRecord = [];
let totalExpense = [];
let isCalledd = "false";
const ConsolidatedExpenseReport = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  //printerOption
  const [selectedPrinter, setSelectedPrinter] = useState();
  const [selected, setSelected] = useState(false);
  const [colorTheme, setColorTheme] = useState("theme-white");
  const [isCalled, setIsCalled] = useState(true);
  const [tableData, setTableData] = useState([]);
  const consolidatedExpenseInvoice = useRef();
  const [expenseTypeDropDown, setExpenseTypeDropDown] = useState("");
  const [expenseCategoryDropDown, setExpenseCategoryDropDown] = useState("");
  const [expenseShopNoDropDown, setExpenseShopNoDropDown] = useState("");
  const [expenseStartDateDropDown, setexpenseStartDateDropDown] =
    useState(null);
  const [expenseEndDateDropDown, setExpenseEndDateDropDown] = useState(null);
  const [expenseTypeData, setExpenseTypeData] = useState([]);
  const [expenseShopNoData, setExpenseShopNoData] = useState([]);
  const [expenseConslidatedPermission, setExpenseConslidatedPermission] =
    useState(false);
  const [selectedOption, setSelectedOption] = useState();
  const [expenseProductShopNoDropDown, setExpenseProductShopNoDropDown] =useState();
  const [isDisabled, setIsDisabled] = useState(false);
  const [valuesChanging, setValuesChanging] = useState(true)
  const [loadingPrintData, setLoadingPrintData] = useState(false)
  const [tableRecord, setTableRecord] = useState()
  const { shop } = useSelector((state) => state.shop);
  const { expenseType } = useSelector((state) => state.expenseType);
  const {user, loading} = useSelector((state)=> state.user)
  const {expenseConsolidateForShopsRecord, expenseConsolidateForShopsRecordLoading}= useSelector((state) => state.expenseConsolidateForShopsRecord)
  const {expenseConsolidateForSpecificShopsRecord, expenseConsolidateForSpecificShopsRecordLoading} = useSelector((state)=> state.expenseConsolidateForSpecificShopsRecord)
  const dispatch = useDispatch()
  const DateOptions = [
    // { key: "today", value: "today", text: "Today" },
    // { key: "week", value: "thisWeek", text: "This Week" },
    // { key: "month", value: "thisMonth", text: "This Month" },
    // { key: "year", value: "thisYear", text: "This Year" },
    // { key: "all", value: "all", text: "All" },
    { key: "today", value: "today", text: "Today" },
    { key: "week", value: "thisWeek", text: "This Week" },
    { key: "month", value: "thisMonth", text: "This Month" },
    { key: "month", value: "last3Months", text: "Last Three Months" },
    { key: "year", value: "lastYear", text: "Last Year" },
    { key: "all", value: "All", text: "All" },
  ];


  useEffect(() => {
    setExpenseConslidatedPermission(false);
    getPermission();
  }, []);
  async function getPermission() {
    try {
      const permissionForAdd = await getPermissionForRoles(
        "View Consolidated Expense Invoice"
      );
      setExpenseConslidatedPermission(permissionForAdd);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }



  useEffect(() => {
    let currentLang = localStorage.getItem("lang");
    i18n.changeLanguage(currentLang);
  }, []);

  useEffect(()=>{
    totalExpense = tableData.reduce((sum, expense) => sum + parseInt(expense.exponseTotal), 0) 
  }, [tableData])

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


  const handleBeforePrint = () => {
    console.log('ajfei')
    setLoadingPrintData(true);
  };

  const handleAfterPrint = () => {
    setLoadingPrintData(false);
  };


  useEffect(()=>{
    dispatch(getExpenseType())
    console.log(user)
    if(user?.user?.roles?.roleName === "Administrator" || user?.user?.roles?.roleName === "superAdmin" )
      {
        setExpenseProductShopNoDropDown("All Shops")
        setValuesChanging(true)
        dispatch({
          type: GET_EXPENSE_CONSOLIDATED_FOR_SPECIFIC_SHOP_SUCCESS,
          payload: [],
        });
       dispatch(getExpenseRecordForConsolidated("last3Months"))
       
      }else{
        setValuesChanging(true)
        setExpenseProductShopNoDropDown(user?.user?.shopNo?.shopCode)
        dispatch({
          type: GET_EXPENSE_CONSOLIDATED_FOR_SHOPS_SUCCESS,
          payload: [],
        });
    dispatch(getExpenseRecordForConsolidatedForSpecificShop(JSON.parse(localStorage.getItem("shopId")), `last3Months`))
   
    }
  }, [user, loading])

  const handleDropdownChange = (event, { value }) => {
    // console.log(value);
    // setSelectedOption(value);
    // const filteredData = filterData(value);
    // expenseRecord = filteredData;
    setValuesChanging(true)
    if(expenseProductShopNoDropDown){
      setSelectedOption(value);
      setValuesChanging(true)
      dispatch({
        type: GET_EXPENSE_CONSOLIDATED_FOR_SHOPS_SUCCESS,
        payload: [],
      });
      dispatch(getExpenseRecordForConsolidatedForSpecificShop(expenseProductShopNoDropDown, value))
    }

  if(JSON.parse(localStorage.getItem("isAdministrator")) || JSON.parse(localStorage.getItem("isSuperAdmin")))
  {
    setSelectedOption(value);
    setValuesChanging(true)
    dispatch({
      type: GET_EXPENSE_CONSOLIDATED_FOR_SPECIFIC_SHOP_SUCCESS,
      payload: [],
    });
   dispatch(getExpenseRecordForConsolidated(value))
   
  }
    else{
      setSelectedOption(value);
      setValuesChanging(true)
      dispatch({
        type: GET_EXPENSE_CONSOLIDATED_FOR_SHOPS_SUCCESS,
        payload: [],
      });
      dispatch(getExpenseRecordForConsolidatedForSpecificShop(JSON.parse(localStorage.getItem("shopId")), value))
    }
  };


  const handleShopNoValue = (event, { value }) => {
    setValuesChanging(true)
    setSelectedOption("");
    setExpenseProductShopNoDropDown(value);

    setValuesChanging(true)
    dispatch({
      type: GET_EXPENSE_CONSOLIDATED_FOR_SHOPS_SUCCESS,
      payload: [],
    });
    dispatch(getExpenseRecordForConsolidatedForSpecificShop(value, `last3Months`))
  };


  useEffect(()=>{
    if(expenseConsolidateForShopsRecord?.expenseData?.length > 0 && !expenseConsolidateForShopsRecordLoading)
    {
      setTableData(expenseConsolidateForShopsRecord?.expenseData)
      setTableRecord(expenseConsolidateForShopsRecord?.expenseData)
      setValuesChanging(false)
    }

  }, [expenseConsolidateForShopsRecord, expenseConsolidateForShopsRecordLoading])
  
  useEffect(()=>{
    if(expenseConsolidateForSpecificShopsRecord?.expenseData?.length > 0 && !expenseConsolidateForSpecificShopsRecordLoading)
    {
        setTableData(expenseConsolidateForSpecificShopsRecord?.expenseData)
      setTableRecord(expenseConsolidateForSpecificShopsRecord?.expenseData)
    setValuesChanging(false)
    }

  }, [expenseConsolidateForSpecificShopsRecord, expenseConsolidateForSpecificShopsRecordLoading])

  const handleDateSelectChange = (date) => {
    setexpenseStartDateDropDown(date);
  };


//Function to set Ending Date
const handleSelectEndDateChange =async (date) => {
  setExpenseEndDateDropDown(date);
  if(JSON.parse(localStorage.getItem("isAdministrator")) || JSON.parse(localStorage.getItem("isSuperAdmin")))
  {
    if(expenseProductShopNoDropDown && expenseStartDateDropDown){
      setValuesChanging(true)
      dispatch(getExpenseRecordForConsolidatedForSpecificShopOnDate(expenseProductShopNoDropDown,expenseStartDateDropDown, date))
    }else{
      dispatch(getExpenseRecordForConsolidatedOnDates(expenseStartDateDropDown, date))
         setValuesChanging(true)
    }
   
  }else{
    dispatch(getExpenseRecordForConsolidatedForSpecificShopOnDate(JSON.parse(localStorage.getItem('shopId')), expenseStartDateDropDown, date))
       setValuesChanging(true)
  }

};

  const handleClearData = () =>{
    setValuesChanging(true)
 
    // setSalesProductCodeDropDown("");
    // setsalesProductCompanyDropDown("");
    // setSalesStartDateDropDown("");
    // setSalesEndDateDropDown("");
    setSelectedOption("");
    setIsDisabled(false);
    if(JSON.parse(localStorage.getItem("isAdministrator")) || JSON.parse(localStorage.getItem("isSuperAdmin")))
    {   setExpenseProductShopNoDropDown("All Shop");
      dispatch({
        type: GET_EXPENSE_CONSOLIDATED_FOR_SPECIFIC_SHOP_SUCCESS,
        payload: [],
      });
     dispatch(getExpenseRecordForConsolidated("last3Months"))
    
     
    }else{
      setExpenseProductShopNoDropDown(user?.user?.shopNo?.shopCode);
      dispatch({
        type: GET_EXPENSE_CONSOLIDATED_FOR_SHOPS_SUCCESS,
        payload: [],
      });
  dispatch(getExpenseRecordForConsolidatedForSpecificShop(JSON.parse(localStorage.getItem("shopId")), `last3Months`))

  }
  }

  //Function to search element
  const handleSearch = async () => {
    const finalDataForTable = await searchExpenseConsolidatednvoiceData(
      expenseRecord,
      expenseShopNoDropDown,
      expenseCategoryDropDown,
      expenseTypeDropDown,
      expenseStartDateDropDown,
      expenseEndDateDropDown
    );

    setTableData(finalDataForTable);
      console.log(finalDataForTable)
    //To calculate the total of all the Calculating value for Footer

    //Calculating Quantity
    totalExpense = finalDataForTable
      ?.reduce((sum, product) => sum + parseInt(product.expenseAmount, 10), 0)
      .toString();

    //To disabled All the Buttons when data is fetched till we clear table record
    setIsDisabled(true);
  };

  const columns = [
    { field: "expenses.expenseType", label: "Expense Type" },
    { field: "expenses.expenseAmount", label: "Expense Amount" },
    { field: "expenseCategory", label: "Category" },
    { field: "expenseLocation", label: "Expense Location" },
    { field: "expenses.dateWithProduct", label: "Date" },
  ];

  return (
    <>
      <MetaData title="QE ~~ExpenseInvoice" />
      <div className={`Expense ${colorTheme}`}>
      <div className="secondContainer">
        {expenseConslidatedPermission && (
          <>
            <div className="contentt-box">
              <div className="heading-container">
                <h3>{t("textConsolidatedExpenseInvoice")}</h3>
              </div>
            </div>
            <div className="expense-search-box">
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
                  // search
                  selection
                  disabled={isDisabled}
                  value={expenseProductShopNoDropDown}
                  onChange={handleShopNoValue}
                />
              )}
         
               <Dropdown
                placeholder={t("selectTimePeriod")}
                fluid
                // search
                // className="consolidatePurchaseDropdown"
                selection
                options={DateOptions}
                value={selectedOption}
                onChange={handleDropdownChange}
              />
             
              <DatePicker
                selected={expenseStartDateDropDown}
                onChange={handleDateSelectChange}
                placeholderText={t("startingDate")}
                dateFormat="dd/MM/yyyy"
                // className="datePicker"
                disabled={isDisabled}
                // style={{ flex: 1 }}
              />
              <DatePicker
                selected={expenseEndDateDropDown}
                onChange={handleSelectEndDateChange}
                placeholderText={t("endingDate")}
                dateFormat="dd/MM/yyyy"
                // style={{ flex: 1 }}
                disabled={isDisabled}
                // className="datePicker"
              />
             
              {/* <Button className="buttonSearch" onClick={handleSearch}>
                {t("search")}&nbsp;&nbsp;{<SearchIcon />}
              </Button> */}
              <Button
                // className="buttonSearchBack"
                onClick={handleClearData}
              >
                {t("clear")}&nbsp;&nbsp;{<ClearAllIcon />}
              </Button>
              {
                !loadingPrintData ? ( <>
                  <ReactToPrint
                     trigger={() =>
                          (
                            <button className="printButton"> 
                              Print&nbsp;&nbsp;<PrintIcon/>
                            </button>
                           )
                        }
                        content={() => consolidatedExpenseInvoice.current} 
                        onBeforeGetContent={handleBeforePrint}
                        onAfterPrint={() => {
                        setTableData([]); 
                        setExpenseShopNoDropDown(""); 
                        setExpenseCategoryDropDown(""); 
                        setExpenseTypeDropDown(""); 
                        setexpenseStartDateDropDown(""); 
                        setExpenseEndDateDropDown(""); 
                        setSelectedPrinter("");
                        setSelectedOption(""); 
                        setSelected(false); 
                        handleClearData()
                        handleAfterPrint()
                        setIsDisabled(false);
                  }}
                />
                </>) :(
                  <Button disabled>  Print&nbsp;&nbsp;<PrintIcon/></Button>
                )
              }
            </div>
            {/* <div className="table-cont"> */}
              <div
                ref={consolidatedExpenseInvoice}
                className="table-container"
              >
                {
                    !valuesChanging && (<>
                      <ConsolidatedExpenseData
                          tableData = {tableData}
                          props={{
                          tableData: tableData,
                          selectedPrinter: selectedPrinter,
                          totalExpense: totalExpense,
                          selectedOption: selectedOption,
                          expenseCategoryDropDown: expenseCategoryDropDown,
                            expenseProductShopNoDropDown: expenseProductShopNoDropDown,
                          expenseTypeDropDown: expenseTypeDropDown,
                          expenseStartDateDropDown: expenseStartDateDropDown,
                          expenseEndDateDropDown: expenseEndDateDropDown,
                  }}
                  />
                </>)
                  }
                {
                  !valuesChanging ? (
                      <>
                        {selectedPrinter === "thermal" ? (
                          <PrintTableComponent data={tableData} columns={columns} />
                        ) : (
                              <div className='consolidatedExpenseTable'>
                                <PrintLaserTable data={tableData} columns={columns} />
                              </div>)}
                      </>
                    ):(
                        <>
                          <PageLoader />
                        </>
                      )
                }
               
                  
                
              </div>
            {/* </div> */}
          </>
        )}
      </div>
      </div>
    </>
  
  );
};

export default ConsolidatedExpenseReport;
