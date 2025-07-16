import React from "react";

import { useEffect, useState, useContext, useRef } from "react";
import MetaData from "../../../MetaData";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"
import AsyncSelect from "react-select/async"
import { Dropdown, Button } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { Select, Loader } from "semantic-ui-react";
import { useTranslation } from "react-i18next";

// import TableComponentId from "../Components/tableComponent/tableComponentId";
import TableComponentId from "../../../Components/tableComponent/tableComponentId";
import { useCustomState } from "../../../Variables/stateVariables";
// import { getSaleRecord } from "../Api";
import { searchSaleRecord } from "../../../Components/searchComponent/SaleRecordSearch/saleRecordSearch";
import { tableState } from "../../../Components/tableComponent/tableContext";
import { DateRangePicker } from "rsuite";
import 'rsuite/DateRangePicker/styles/index.css';
import { useSelector, useDispatch } from "react-redux";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import SearchIcon from "@mui/icons-material/Search";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import PageLoader from "../../../Components/Loader/PageLoader";
import { getSaleCreditOnShopRecord, getSaleCreditRecord, getSaleRecord } from "../../../actions/saleProductAction";
import { refreshTokken } from "../../../actions/userAction";
import { QURESHI_ELECTRONICS } from "../../../constants/companyNameContants";
let isCalledd = "false";
let pr = [];
let invoiceNumberList = []
let clientNameList = []
const TableTransfer = () => {
  //for Scrolling

  ///////////////////////////////////////////
  const [dateRange, setDateRange] = useState([]);
  const [defaultInvoiceNumber, setDefaultInvoiceNumber] = useState()
  const [defaultCustomerName, setDefaultCustomerName] = useState()
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectEndDate, setSelectEndDate] = useState(null);
  const [SalesRecord, setSalesRecord] = useState([]);
  const navigate = useNavigate();
  const [InvoiceNumber, setInvoiceNumber] = useState();
  const [custName, setcustName] = useState("");
  // const [loading, setLoading] = useState(false);
  const selectInputRef1 = useRef();
  const selectInputRef2 = useRef();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { data, setData } = useCustomState();
  const { rowCount } = useContext(tableState);
  const [colorTheme, setColorTheme] = useState("theme-white");
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { saleRecord, saleRecordLoading } = useSelector((state) => state.saleRecord);
  const { user } = useSelector((state) => state.user);
  const { saleCreditRecord, saleCreditRecordLoading } = useSelector((state) => state.saleCreditRecord);
  const { saleCreditOnShopRecord, saleCreditOnShopRecordLoading } = useSelector((state) => state.saleCreditOnShopRecord)
  
  useEffect(() => {
    if (user?.user?.roles?.roleName === "Administrator" || user?.user?.roles?.roleName === "superAdmin") 
     {
      dispatch(getSaleCreditRecord());
    }else{
      dispatch(getSaleCreditOnShopRecord(user?.user?.shopNo?.shopCode))
    }
  }, [user]);

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

  useEffect(() => {
    let currentLang = localStorage.getItem("lang");
    i18n.changeLanguage(currentLang);
  }, [i18n]);
  // const getSalesRecord = async () => {
  //   // pr = await getSaleRecord();
  //   // console.log(pr);
  //   pr = saleRecord;
  //   if (saleRecord) {
  //     //to filter product for each storage location that a user login with account
  //     if (
  //       JSON.parse(localStorage.getItem("isAdministrator")) ||
  //       JSON.parse(localStorage.getItem("isSuperAdmin"))
  //     ) {
  //       pr = saleRecord;
  //       setSalesRecord(pr);
  //       invoiceNumberList =pr?.map(storage =>({
  //         value: storage.id,
  //         label: storage.id 
  //       }))
  //       clientNameList =pr?.map(storage =>({
  //         value: storage.customerName,
  //         label: storage.customerName 
  //       }))
  //       setData(pr);
  //       setFilteredProducts(pr.reverse());
  //     } else {
  //       pr = saleRecord?.reduce((filteredProducts, product) => {
  //         if (product?.shopNo === JSON.parse(localStorage.getItem("shopId"))) {
  //           filteredProducts.push(product);
  //         }
  //         return filteredProducts;
  //       }, []);
  //       invoiceNumberList =pr?.map(storage =>({
  //         value: storage.id,
  //         label: storage.id 
  //       }))
  //       clientNameList =pr?.map(storage =>({
  //         value: storage.customerName,
  //         label: storage.customerName 
  //       }))
  //       setSalesRecord(pr);
  //       setData(pr);
  //       setFilteredProducts(pr.reverse());
  //     }
  //   } else {
  //     pr = [];
  //   }
  // };

  useEffect(()=>{
    console.log(saleCreditOnShopRecord)
    if(saleCreditOnShopRecord?.data?.length > 0 && !saleCreditOnShopRecordLoading) {
      console.log("hi")
      setData(saleCreditOnShopRecord?.data)
      setSalesRecord(saleCreditOnShopRecord?.data)
      invoiceNumberList =saleCreditOnShopRecord?.data?.map(inv =>({
        value: inv.id,
        label: inv.id 
      }))
      clientNameList = saleCreditOnShopRecord?.data?.map(inv =>({
        value: inv.customerName,
        label: inv.customerName 
      }))
    }
  }, [saleCreditOnShopRecord, saleCreditOnShopRecordLoading])

  useEffect(()=>{
if(saleCreditRecord?.data?.length > 0 && !saleCreditRecordLoading) {
  console.log('afeilh')
  setData(saleCreditRecord?.data)
  setSalesRecord(saleCreditRecord?.data)
  invoiceNumberList = saleCreditRecord?.data?.map(inv =>({
            value: inv.id,
            label: inv.id 
          }))
          clientNameList = saleCreditRecord?.data?.map(inv =>({
            value: inv.customerName,
            label: inv.customerName 
          }))
    }
    console.log(saleCreditRecord)
  }, [saleCreditRecord, saleCreditRecordLoading])


  const loadInvoiceOptions = (search, callBack) => {
    setTimeout(()=>{
      const filterOptions = invoiceNumberList?.filter(option=> option?.value.toLowerCase().includes(search.toLowerCase())) 
      // const filterOptions = saleCreditOnShopRecord ? 
      // saleCreditOnShopRecord?.data?.filter(option=> option?.invoiceNumber.toLowerCase().includes(search.toLowerCase())) :  
      //     saleCreditRecord?.data?.filter(option=> option?.invoiceNumber.toLowerCase().includes(search.toLowerCase()))
      callBack(filterOptions)
    }, 3000)
  }
  const loadClientNameOptions = (search, callBack) => {
    setTimeout(()=>{
      const filterOptions = clientNameList?.filter(option=> option?.value.toLowerCase().includes(search.toLowerCase()))
      callBack(filterOptions)
    }, 3000)
  }
  const handleDateChange = (value) => {
    console.log(value)
    if(value?.length > 0)
    {setDateRange(value);
      setSelectedDate(new Date(value[0]))
      setSelectEndDate(new Date(value[1]));
      const startingDate = new Date(value[0])
      const endingDate = new Date(value[1])
    }
  }

  const sellproduct = (id) => {
    navigate(`/saleCreditRecordPreview/${id}`);
  };

  const handleInvoiceNmberSelectChange = ( value ) => {
    if(value)
      {
        setInvoiceNumber(value.value);
        setDefaultInvoiceNumber(value)
      }else {
        setDefaultInvoiceNumber({
          value: '',
          label: ''
        })
      }
    
  };
  const handlecustomerNameSelectChange = ( value ) => {
    if(value)
      {
        setcustName(value?.value);
    setDefaultCustomerName(value)
      }else {
        setDefaultCustomerName({
          value: '',
          label: ''
        })
      }
   
  };

  const handleDateSelectChange = (date) => {
    setSelectedDate(date);
  };
  const handleSelectEndDateChange = (date) => {
    setSelectEndDate(date);
  };

  const handleSearch = async () => {
    const dataa = await searchSaleRecord(
      SalesRecord,
      InvoiceNumber,
      custName,
      selectedDate,
      selectEndDate
    );
    setData(dataa);
  };

  const columns = [
    { field: "id", label: t("invoiceNumber") },
    { field: "invoiceNumber", label: t("fbrInvoiceNumber") },
    { field: "customerName", label: t("customerName") },
    { field: "customerNumber", label: t("customerNumber") },
    { field: "paymentStatus", label: t("paymentStatus") },
    { field: "createdAt", label: t("Date"), format: "date" },
    { field: "createdAt", label: t("time"), format: "time" },
    // {field: `${new Date(createdAt).toLocaleDateString()}`, label: 'Sale Date'},
  ];

  const columns1 = [
    { field: "id", label: t("invoiceNumber") },
    { field: "customerName", label: t("customerName") },
    { field: "paymentStatus", label: t("paymentStatus") },
    { field: "createdAt", label: t("Date"), format: "date" },
    { field: "createdAt", label: t("time"), format: "time" },
    // {field: `${new Date(createdAt).toLocaleDateString()}`, label: 'Sale Date'},
  ];
  const actions = [
    {
      label: "Preview",
      color: "green",
      handler: (itemId) => sellproduct(itemId),
      url: null,
    },
  ];

  return (
    <>
      <MetaData title="QE ~~SaleInvoice" />
      <div className={`Sale ${colorTheme}`}>
      <div className="secondContainer">
        <div className="contentt-box">
          <div className="heading-container">
            <h3>{t("saleCreditInvoices")}</h3>
            <h5>
              <span className="total-records">
                {t("totalRecords")}&nbsp;&nbsp;
                <EventAvailableIcon fontSize="small" />
              </span>
              <span className="rowCount">{rowCount}</span>
            </h5>
          </div>
        </div>
        <div className="search-box">
        <AsyncSelect 
            placeholder = {"Invoice Number"}
            ref={selectInputRef1}
            loadOptions={invoiceNumberList?.length > 0 && loadInvoiceOptions}
            defaultOptions={invoiceNumberList} onChange={handleInvoiceNmberSelectChange}
            // defaultValue={defaultInvoiceNumber}
                   />
          <AsyncSelect 
            placeholder = {"Customer Name"}
            ref={selectInputRef2}
            loadOptions={clientNameList?.length > 0 && loadClientNameOptions}
            defaultOptions={clientNameList} onChange={handlecustomerNameSelectChange}
            defaultValue={defaultCustomerName}
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
         
          <Button className="buttonSearch" onClick={handleSearch}>
            {t("search")}&nbsp;&nbsp;{<SearchIcon />}
          </Button>
          <Button
            className="buttonSearchBack"
            onClick={() => {
              if (user?.user?.roles?.roleName === "Administrator" || user?.user?.roles?.roleName === "superAdmin") 
                {
                 dispatch(getSaleCreditRecord());
               }else{
                 dispatch(getSaleCreditOnShopRecord(user?.user?.shopNo?.shopCode))
               }
              setInvoiceNumber("");
              setcustName("");
              setSelectedDate("");
              setSelectEndDate("");
              setData(pr);
              setDateRange()
              selectInputRef1.current.clearValue();
              selectInputRef2.current.clearValue();
            }}
          >
            {t("clear")}&nbsp;&nbsp;{<ClearAllIcon />}
          </Button>
        </div>
        <div className="table-container">
          {!saleRecordLoading ? (
            <>
            {
              QURESHI_ELECTRONICS === "QURESHI_ELECTRONICS_WITH_FBR" ? (
              <TableComponentId data={data} columns={columns} actions={actions} />) : (
                <TableComponentId data={data} columns={columns1} actions={actions} />
              )
            }
            </>
           
          ) : (
            <PageLoader />
          )}
        </div>
      </div>
      </div>
    </>
  );
};

export default TableTransfer;
