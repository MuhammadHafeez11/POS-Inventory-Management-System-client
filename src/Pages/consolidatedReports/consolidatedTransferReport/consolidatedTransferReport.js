import React, { useEffect, useState, useRef } from "react";
import DatePicker from "react-datepicker";
import ReactToPrint from "react-to-print";
import "react-datepicker/dist/react-datepicker.css"
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../../../MetaData";
import { searchTransferConsolidatednvoiceData } from "../../../Components/searchComponent/ConsolidatedReportSearch/TransferReportSearch";
import { Button, Form, Dropdown, Container, Select, Loader } from "semantic-ui-react";
import PrintLaserTable from "../../../Components/tableComponent/printLaserTable";
import { getPermissionForRoles } from "../../user/rolesAssigned/RolesPermissionValidation";
import { useTranslation } from "react-i18next";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import { getTransferRecordForConsolidated, getTransferRecordForConsolidatedForSpecificShop, getTransferRecordForConsolidatedForSpecificShopOnDate, getTransferRecordForConsolidatedOnDates } from "../../../actions/transferAction";
import { useNavigate } from "react-router-dom";
import { refreshTokken } from "../../../actions/userAction";
import ConsolidatedTransferData from "./consolidatedTransferData";
import PrintIcon from '@mui/icons-material/Print';
import PageLoader from "../../../Components/Loader/PageLoader";
import { GET_TRANSFER_CONSOLIDATED_FOR_SHOPS_SUCCESS, GET_TRANSFER_CONSOLIDATED_FOR_SPECIFIC_SHOP_SUCCESS } from "../../../constants/transferConstants";
import { getStorage } from "../../../actions/storageAction";
let isCalledd = "false";
// let tableData = [];
let transferRecord = [];
let selectedShop = [];
let seletedGodown = [];
let selectedTempShop = "";
let code = "";
let type = "";
let companyProduct = "";
const ConsolidatedTransferReport = () => {
  const action4 = "salePage";
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch()
  //General UseState
  const [isCalled, setIsCalled] = useState(true);
  const [tableRecord, setTableRecord] = useState()
  const [Productsarray, setProductsarray] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [colorTheme, setColorTheme] = useState("theme-white");
  const [showComponent, setShowComponent] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const consolidatedTransferInvoice = useRef();
  const [shopSelected, setShopSelected] = useState()
  const [godownSelected, setGodownSelected] = useState()
  const [selectedRadioOption, setSelectedRadioOption] = useState("");
  const [loadingPrintData, setLoadingPrintData] = useState(false)
  const { storage } = useSelector((state) => state.storage);
  const { shop } = useSelector((state) => state.shop);
  const [transferConsolidatedPermission, setTransferConsolidatedPermission] =
    useState(false);
  const [valuesChanging, setValuesChanging] = useState(true)
  const {transferConsolidateForShopsRecord, transferConsolidateForShopsRecordLoading, transferConsolidateForShopsRecordError} = useSelector((state)=> state.transferConsolidateForShopsRecord)
  const {transferConsolidateForSpecificShopsRecord, transferConsolidateForSpecificShopsRecordLoading} = useSelector((state)=> state.transferConsolidateForSpecificShopsRecord)
  const {transferConsolidateForSpecificShopsOnDateRecord, transferConsolidateForSpecificShopsOnDateRecordLoading} = useSelector((state)=> state.transferConsolidateForSpecificShopsOnDateRecord)
  const {transferConsolidateForShopsOnShopRecord, transferConsolidateForShopsOnShopRecordLoading} = useSelector((state)=> state.transferConsolidateForShopsOnShopRecord)
  const navigate = useNavigate();
  const [selecctedShop, setSelecctedShop] = useState();
  const [selectedGodown, setSelectedGodown] = useState();

  const categoryOptions = [
    { key: "1", text: "shop", value: "shop" },
    { key: "2", text: "store", value: "store" },
  ];
  useEffect(() => {
    dispatch(getStorage())
    setTransferConsolidatedPermission(false);
    getPermission();
  }, []);

  async function getPermission() {
    try {
      const permissionForAdd = await getPermissionForRoles(
        "View Consolidated Transfer Invoice"
      );
      setTransferConsolidatedPermission(permissionForAdd);
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
    if (token.data === "Please login to acces this resource") {
      navigate("/login");
    }
    console.log(token);
  };

  ////////////==================================//////////
  /////////////////  shop selection ///////////////////////
  //////////==================================/////////
  const shopAsArray = [selectedShop];
  const shopCodes = shopAsArray?.map((shop) => shop);
  const godownCodes = seletedGodown?.map((godown) => godown);
  const combinedOptions = [...shopCodes, ...godownCodes];

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
  // const [yourData, setYourData] = useState([...]); // Your array of data


  useEffect(() => {
    console.log(combinedOptions);
    if (combinedOptions?.length > 0 && !selectedRadioOption) {
      setSelectedRadioOption(combinedOptions[0]);
      console.log(combinedOptions[0]);
      selectedTempShop = combinedOptions[0];
    }
  }, [combinedOptions, selectedRadioOption]);

  useEffect(() => {
    selectedShop = JSON.parse(localStorage.getItem("shopId"));
    seletedGodown = JSON.parse(localStorage.getItem("godownId"));
    console.log(selectedShop);
    console.log(seletedGodown);
  });

  const handleSelectChange = (e, { value }) => {
    console.log(value)
    setValuesChanging(true)
      dispatch({
        type: GET_TRANSFER_CONSOLIDATED_FOR_SHOPS_SUCCESS,
        payload: [],
      });
      dispatch(getTransferRecordForConsolidatedForSpecificShop(value, `last3Months`))
    setSelectedRadioOption(value);
    setIsCalled(true);
  };

  //UseState For setting dropDowns values
  const [
    transferProductTrasferToDropDown,
    setTransferProductTrasferToDropDown,
  ] = useState("");
  const [transferProductCodeDropDown, setTransferProductCodeDropDown] =
    useState("");
  const [transferProductCompanyDropDown, setTransferProductCompanyDropDown] =
    useState("");
  const [transferStartingDateDropDown, setTransferStartingDateDropDown] =
    useState(null);
  const [
    transferProductEndingDateDropDown,
    setTransferProductEndingDateDropDown,
  ] = useState(null);
  const [totalQuantity, setTotalQuantity] = useState(0);

  //printerOption
  const [selectedPrinter, setSelectedPrinter] = useState();

  //select language
  useEffect(() => {
    let currentLang = localStorage.getItem("lang");
    i18n.changeLanguage(currentLang);
  }, []);

  // New Logic
  // All New Logic
  useEffect(() => {
    getTransferConsolidatedRecord()
  }, []);

  
  const handleBeforePrint = () => {
    console.log('ajfei')
    setLoadingPrintData(true);
  };

  const handleAfterPrint = () => {
    setLoadingPrintData(false);
  };

  
  const getTransferConsolidatedRecord =async()=>{
    if(JSON.parse(localStorage.getItem("isAdministrator")) || JSON.parse(localStorage.getItem("isSuperAdmin")))
    {
      setValuesChanging(true)
      dispatch({
        type: GET_TRANSFER_CONSOLIDATED_FOR_SPECIFIC_SHOP_SUCCESS,
        payload: [],
      });
      dispatch(getTransferRecordForConsolidated("last3Months"))
    }else{
      setValuesChanging(true)
      dispatch({
        type: GET_TRANSFER_CONSOLIDATED_FOR_SHOPS_SUCCESS,
        payload: [],
      });
      setSelectedRadioOption(JSON.parse(localStorage.getItem("shopId")))
      dispatch(getTransferRecordForConsolidatedForSpecificShop(JSON.parse(localStorage.getItem("shopId")), `last3Months`))
  }
  }


  useEffect(()=>{
    if(transferConsolidateForShopsRecord?.success && !transferConsolidateForShopsRecordLoading)
    {
      setTableData(transferConsolidateForShopsRecord?.transferData)
      setTableRecord(transferConsolidateForShopsRecord?.transferData)
      setValuesChanging(false)
    }

  }, [transferConsolidateForShopsRecord, transferConsolidateForShopsRecordLoading])
  
  useEffect(()=>{
    if(transferConsolidateForSpecificShopsRecord?.success && !transferConsolidateForSpecificShopsRecordLoading)
    {
        setTableData(transferConsolidateForSpecificShopsRecord?.transferData)
      setTableRecord(transferConsolidateForSpecificShopsRecord?.transferData)
    setValuesChanging(false)
    }

  }, [transferConsolidateForSpecificShopsRecord, transferConsolidateForSpecificShopsRecordLoading])



  // Handle the dropdown selection
const handleDropdownChange = async(event, { value }) => {
  if(selectedRadioOption){
    setValuesChanging(true)
    dispatch(getTransferRecordForConsolidatedForSpecificShop(selectedRadioOption ,value))
  }
  else{
    setValuesChanging(true)
    dispatch(getTransferRecordForConsolidatedForSpecificShop(JSON.parse(localStorage.getItem("shopId")), value))
  }
};





const handleSearch = async (code, company) => {
  setValuesChanging(true)
  const finalDataForTable = await searchTransferConsolidatednvoiceData(
    tableRecord,
    code,
    company,
    transferStartingDateDropDown,
    transferProductEndingDateDropDown
  );
    console.log(finalDataForTable)
  setTableData(finalDataForTable);
  setValuesChanging(false)
  console.log(finalDataForTable);

};


  //Function to set Starting Date
  const handleDateSelectChange = (date) => {
    // console.log(date);
    setTransferStartingDateDropDown(date);
  };

  //Function to set Ending Date
  const handleSelectEndDateChange =async (date) => {
    setTransferProductEndingDateDropDown(date);
    if(JSON.parse(localStorage.getItem("isAdministrator")) || JSON.parse(localStorage.getItem("isSuperAdmin")))
    {
      if(selectedRadioOption && transferStartingDateDropDown){
        setValuesChanging(true)
        dispatch(getTransferRecordForConsolidatedForSpecificShopOnDate(selectedRadioOption , transferStartingDateDropDown, date))
      }else
      {
        setValuesChanging(true)

        dispatch(getTransferRecordForConsolidatedOnDates(transferStartingDateDropDown, date))
      }
     
    }else{
      console.log('afe')
      if(selectedRadioOption)
      {
        setValuesChanging(true)
        dispatch(getTransferRecordForConsolidatedForSpecificShopOnDate(selectedRadioOption, transferStartingDateDropDown, date))
      }else{
        setValuesChanging(true)
        setSelectedRadioOption(JSON.parse(localStorage.getItem('shopId')))
        dispatch(getTransferRecordForConsolidatedForSpecificShopOnDate(JSON.parse(localStorage.getItem('shopId')), transferStartingDateDropDown, date))
      }
     
    }
  };

  useEffect(()=>{
    if(!transferConsolidateForShopsOnShopRecordLoading && transferConsolidateForShopsOnShopRecord?.success)
    {
      setTableData(transferConsolidateForShopsOnShopRecord?.transferData)
      setTableRecord(transferConsolidateForShopsOnShopRecord?.transferData)
      setValuesChanging(false)
    }
  
  }, [transferConsolidateForShopsOnShopRecord, transferConsolidateForShopsOnShopRecordLoading])
  
  
  useEffect(()=>{
    if(!transferConsolidateForSpecificShopsOnDateRecordLoading && transferConsolidateForSpecificShopsOnDateRecord?.success)
    {
      setTableData(transferConsolidateForSpecificShopsOnDateRecord?.transferData)
      setTableRecord(transferConsolidateForSpecificShopsOnDateRecord?.transferData)
      setValuesChanging(false)
    }
  
  }, [transferConsolidateForSpecificShopsOnDateRecord, transferConsolidateForSpecificShopsOnDateRecordLoading])


  const handleShopSelect = async (event, {value}) =>{
    console.log(value)
    setValuesChanging(true)
      dispatch({
        type: GET_TRANSFER_CONSOLIDATED_FOR_SHOPS_SUCCESS,
        payload: [],
      });
      dispatch(getTransferRecordForConsolidatedForSpecificShop(value, `last3Months`))
    setSelectedRadioOption(value)
  }

  const handleGodownSelect = async (event, {value})=>{
    console.log(value)
    setValuesChanging(true)
      dispatch({
        type: GET_TRANSFER_CONSOLIDATED_FOR_SHOPS_SUCCESS,
        payload: [],
      });
      dispatch(getTransferRecordForConsolidatedForSpecificShop(value, `last3Months`))
    setSelectedRadioOption(value)
  }

  const handleCategoryChange = async (event, { value }) => {
    // setExpenseCategory(value);
    
    console.log(value)
    if (value.startsWith("st")) {
      setSelecctedShop("");
      setSelectedGodown(value);
      console.log("st");
    } else {
      console.log("shop");
      setSelecctedShop(value);
      setSelectedGodown("");
    }
  };
  //Function to search element
  
  const columns = [
    { field: 'products.transferFrom', label: "Transfer From"},
    { field: 'products.transferTo', label: "Transfer To"},
    { field: "products.Namee", label: "Name" },
    { field: "products.Code", label: "Code" },
    { field: "products.Color", label: "Color" },
    { field: "products.Company", label: "Company" },
    { field: "products.PurchaseQuantity", label: "Quantity" },
    { field: "products.dateWithProduct", label: "Invoice Date" },
  ];

  return (
    <>
      <MetaData title="QE ~~TransferInvoice" />
      <div className={`Transfer ${colorTheme}`}>
      <div className="secondContainer">
        {transferConsolidatedPermission && (
          <>
            <div className="contentt-box">
              <div className="heading-container">
                <h3>{t("consolidateTransferInvoice")}</h3>
              </div>
            </div>
            <div className="search-box">
              {JSON.parse(localStorage.getItem("isAdministrator")) ||
              JSON.parse(localStorage.getItem("isSuperAdmin")) ? (
                <Dropdown
                control={Select}
                placeholder={t("selectWareHouse")}
                className="purchaseDropdown1"
                fluid
                selection
                clearable
                options={categoryOptions}
                onChange={handleCategoryChange}
              />
              ) : (
                <Dropdown
                  options={combinedOptions.map((option) => ({
                    key: option,
                    text: option,
                    value: option,
                  }))}
                  placeholder={t("transferFrom")}
                  fluid
                  search
                  className="purchaseDropdown"
                  selection
                  disabled={isDisabled}
                  value={selectedRadioOption}
                  onChange={handleSelectChange}
                />
              )}

              {selecctedShop ? (
              <>
                <Dropdown
                  placeholder="Select an option"
                  selection
                  fluid
                  options={shop?.map((option) => ({
                    key: option.shopCode,
                    text: option.shopCode,
                    value: option.shopCode,
                  }))}
                  clearable
                  className="purchaseDropdown"
                  onChange={handleShopSelect}
                />
              </>
            ) : (
              <>
                {(selectedGodown && storage?.length > 0) && (
                  <Dropdown
                    placeholder="Select an option"
                    selection
                    fluid
                    clearable
                    options={storage?.map((option) => ({
                      key: option.storageCode,
                      text: option.storageCode,
                      value: option.storageCode,
                    }))}
                    className="purchaseDropdown"
                    onChange={handleGodownSelect}
                  />
                )}
              </>
            )}
               <Dropdown
                placeholder={t("selectTimePeriod")}
                fluid
                search
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
                selected={transferStartingDateDropDown}
                onChange={handleDateSelectChange}
                placeholderText={t("startingDate")}
                dateFormat="dd/MM/yyyy"
                className="datePicker"
                disabled={isDisabled}
                // style={{ flex: 1 }}
              />
              <DatePicker
                selected={transferProductEndingDateDropDown}
                onChange={handleSelectEndDateChange}
                placeholderText={t("endingDate")}
                dateFormat="dd/MM/yyyy"
                // style={{ flex: 1 }}
                disabled={isDisabled}
                className="datePicker"
              />
              
              <Button
                className="buttonSearchBack"
                onClick={() => {
                  // setTableData([]);
                  getTransferConsolidatedRecord()
                  setTransferProductTrasferToDropDown("");
                  setTransferProductCodeDropDown("");
                  setTransferProductCompanyDropDown("");
                  setTransferStartingDateDropDown("");
                  setTransferProductEndingDateDropDown("");
                  setSelectedOption("");
                  setSelectedPrinter("");
                  code = ""
                  companyProduct = ""
                  setIsDisabled(false);
                }}
              >
                {t("clear")}&nbsp;&nbsp;{<ClearAllIcon />}
              </Button>
              {
                !loadingPrintData ? (
                  <ReactToPrint
                  trigger={() =>
                      <button >
                        Print&nbsp;&nbsp; <PrintIcon />
                      </button>
                   
                  }
                  content={() => consolidatedTransferInvoice.current}
                  onBeforeGetContent={handleBeforePrint}
                  onAfterPrint={() => {
                    // setTableData([]);
                    setTransferProductTrasferToDropDown("");
                    setTransferProductCodeDropDown("");
                    setTransferProductCompanyDropDown("");
                    setTransferStartingDateDropDown("");
                    setTransferProductEndingDateDropDown("");
                    handleAfterPrint()
                    setSelectedOption("");
                    setIsDisabled(false);
                  }}
                />
                ):(
                  <Button disabled>
                  Print&nbsp;&nbsp;<PrintIcon/>
              </Button>
                )}
             
            </div>
            
            <div className="table-container">
            <div className="consolidatedDatesData">
            {!valuesChanging && (<ConsolidatedTransferData
                   
                      tableData= {tableData}
                      selectedShop = {selectedRadioOption}
                  />)} 
                </div>
              <div className="consolidatedTransferTable">
            { !valuesChanging ? (<>
              <PrintLaserTable data={tableData} columns={columns} />
            </>):(<><PageLoader /></>) }
             
            </div>
            <div  style={{display: "none"}}>
              <div
                ref={consolidatedTransferInvoice}
                className="consolidateMainTableDiv"
                style={{    
                  // border: "2px solid black",
                  padding: "5px",
                  display: "flex",
                  paddingBottom: "0px",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
              >
                <div>
                <ConsolidatedTransferData
                   
                   tableData= {tableData}
                   selectedShop = {selectedRadioOption}
               />
                </div>
                <div>
                    <PrintLaserTable data={tableData} columns={columns} />
                  {tableData?.length > 0 && (
                    <h1
                      style={{
                        fontWeight: "bold",
                        display: "flex",
                        justifyContent: "flex-end",
                        padding: "10px",
                        marginLeft: "auto",
                      }}
                    >
                      {/* TotalQuantity:{totalQuantity}{" "} */}
                    </h1>
                  )}
                </div>
              </div>
            </div></div>
          </>
        )}
      </div>
      </div>
    </>
  );
};

export default ConsolidatedTransferReport;

// <Stack  backgroundColor="white"   borderRadius="50px 50px 0 0" padding={1} marginTop={1}>
//           <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} padding={3}>
//            <Form style={{width:"100%"}}>
//             <Stack direction="row" sx={{display:"flex",flexDirection:"row", justifyContent:"space-between", width:"100%"}}>
//                 <Form.Group widths="equal" style={{ display: "flex", gap: "30px" }}>
//
//               </Form.Group>
//               <Form.Group  widths="equal" style={{ display: "flex", gap: "20px" }}>
//
//               </Form.Group>

//           </Stack>
//         </Form>
//       </Stack>
//       </Stack>
