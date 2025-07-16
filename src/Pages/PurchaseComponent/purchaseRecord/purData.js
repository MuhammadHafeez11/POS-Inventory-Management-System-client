import React from "react";
import MetaData from "../../../MetaData";
import { useEffect, useState, useContext, useRef } from "react";
import DatePicker from "react-datepicker";
import { DateRangePicker } from 'rsuite';
import { useSelector, useDispatch } from "react-redux";
import { Dropdown, Table } from "semantic-ui-react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import 'rsuite/DateRangePicker/styles/index.css';
import "react-datepicker/dist/react-datepicker.css"
import AsyncSelect from "react-select/async"
import swal from "sweetalert2";
import {
  Button,
} from "semantic-ui-react";

import TableComponentId from "../../../Components/tableComponent/tableComponentId";
import { useTranslation } from "react-i18next";
import { State } from "./context/ContextSales";
import { useCustomState } from "../../../Variables/stateVariables";
// import { getPurchaseRecord } from "../Api";
import { searchPurchaseRecord } from "../../../Components/searchComponent/purchaseRecordSearch/purchaseRecord";
import { tableState } from "../../../Components/tableComponent/tableContext";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import SearchIcon from "@mui/icons-material/Search";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import { getPurchaseRecord } from "../../../actions/purchaseAction";
import { getCompany } from "../../../actions/companyAction";
import { refreshTokken } from "../../../actions/userAction";
import PageLoader from "../../../Components/Loader/PageLoader"
let pr = [];
let isCalledd = "false";
let invoiceNumberList = []
let clientNameList = []
let receptNumberList = []
let companyNumberList = []

const TableTransfer = () => {
  //for Scrolling
  const tableContainerRef = useRef(null);

  ///////////////////////////////////////////
  const { setPurchaseId } = useContext(State);
  const { rowCount, setRowCount } = useContext(tableState);

  const {
    data,
    setData,
    selectedDate,
    setSelectedDate,
    selectEndDate,
    setSelectEndDate,
    SalesRecord,
    setSalesRecord,
    InvoiceNumber,
    setInvoiceNumber,
    custName,
    setcustName,
    filteredProducts,
    setFilteredProducts,
    purchaseReceiptNumber,
    setPurchaseReceiptNumber,
    purchaseCompany,
    setPurchaseCompany,
  } = useCustomState();
  const [dateRange, setDateRange] = useState([]);
  const [defaultInvoiceNumber, setDefaultInvoiceNumber] = useState()
  const [defualtClientName, setDefaultClientName] = useState()
  const [defaultReceiptNumber, setDefaultReceiptNumber] = useState()
  const [defaultCompanyValue, setDefaultCompanyValue] = useState()
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [colorTheme, setColorTheme] = useState("theme-white");
  const dispatch = useDispatch();
  const selectInputRef1 = useRef();
  const selectInputRef2 = useRef();
  const selectInputRef3 = useRef();
  const selectInputRef4 = useRef();
  const { purchaseRecord, loading } = useSelector(
    (state) => state.purchaseRecord
  );
  const { company } = useSelector((state) => state.company);
  useEffect(() => {
    let currentLang = localStorage.getItem("lang");
    i18n.changeLanguage(currentLang);
  }, []);
  useEffect(() => {
    dispatch(getPurchaseRecord());
    dispatch(getCompany());
  }, []);

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
    if (!loading) {
      getSalesRecord();
    }
  }, [loading]);
  const getSalesRecord = async () => {
    pr = purchaseRecord
    if (pr?.length > 0) {
      //to filter product for each storage location that a user login with account
      if (
        JSON.parse(localStorage.getItem("isAdministrator")) ||
        JSON.parse(localStorage.getItem("isSuperAdmin"))
      ) {
        pr = purchaseRecord;
        setData(pr);
        console.log(pr);
        setSalesRecord(pr);
        invoiceNumberList =pr?.map(storage =>({
          value: storage.id,
          label: storage.id 
        }))
        clientNameList =pr?.map(storage =>({
          value: storage.clientName,
          label: storage.clientName 
        }))
        receptNumberList =pr?.map(storage =>({
          value: storage.purchaseReceiptNumber,
          label: storage.purchaseReceiptNumber 
        }))
        setFilteredProducts(pr.reverse());
      } else {
        pr = pr.length > 0 && pr?.reduce((filteredProducts, product) => {
          if (product?.shopNo === JSON.parse(localStorage.getItem("shopId"))) {
            filteredProducts.push(product);
          }
          return filteredProducts;
        }, []);
        setData(pr);
        console.log(pr);
        invoiceNumberList =pr?.map(storage =>({
          value: storage.id,
          label: storage.id 
        }))
        clientNameList =pr?.map(storage =>({
          value: storage.clientName,
          label: storage.clientName 
        }))
        receptNumberList =pr?.map(storage =>({
          value: storage.purchaseReceiptNumber,
          label: storage.purchaseReceiptNumber 
        }))
        setSalesRecord(pr);
        setFilteredProducts(pr.reverse());
      }
    } else {
      pr = [];
    }

    // setLoading(true);
  };

  useEffect(()=>{
    if(company?.length > 0 && company !== "No Record Found")
    {
      companyNumberList = company?.map(comp =>({
        value: comp.companyName,
        label: comp.companyName 
      }))
    }
  }, [company])


  const loadInvoiceOptions = (search, callBack) => {
    setTimeout(()=>{
      const filterOptions = invoiceNumberList?.filter(option=> option?.value.toLowerCase().includes(search.toLowerCase()))
      callBack(filterOptions)
    }, 3000)
  }
  const loadClientNameOptions = (search, callBack) => {
    setTimeout(()=>{
      const filterOptions = clientNameList?.filter(option=> option?.value.toLowerCase().includes(search.toLowerCase()))
      callBack(filterOptions)
    }, 3000)
  }

  const loadReceiptNumberOptions = (search, callBack) => {
    setTimeout(()=>{
      const filterOptions = receptNumberList?.filter(option=> option?.value.toLowerCase().includes(search.toLowerCase()))
      callBack(filterOptions)
    }, 3000)
  }

  const loadCompanyOptions = (search, callBack) => {
    setTimeout(()=>{
      const filterOptions = companyNumberList?.filter(option=> option?.value.toLowerCase().includes(search.toLowerCase()))
      callBack(filterOptions)
    }, 3000)
  }

  const sellproduct = (id) => {
    setPurchaseId(id);
    navigate("/Previewpurchase");
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
    setDefaultClientName(value)
      }else {
        setDefaultClientName({
          value: '',
          label: ''
        })
      }
  };
  const handleReceiptSelectChange = (value ) => {
    if(value)
    {
      setPurchaseReceiptNumber(value?.value);
      setDefaultReceiptNumber(value)
    }else {
      setDefaultReceiptNumber({
        value: '',
        label: ''
      })
    }
   
  };
  const handleCompanySelectChange = ( value ) => {
  
    if(value)
      {
        setPurchaseCompany(value.value);
        setDefaultCompanyValue(value)
      }else {
        setDefaultCompanyValue({
          value: '',
          label: ''
        })
      }
  
  };

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

  const handleDateSelectChange = (date) => {
    setSelectedDate(date);
  };
  const handleSelectEndDateChange = (date) => {
    setSelectEndDate(date);
  };

  const handleSearch = async () => {
    const dataa = await searchPurchaseRecord(
      SalesRecord,
      InvoiceNumber,
      purchaseReceiptNumber,
      purchaseCompany,
      custName,
      selectedDate,
      selectEndDate
    );
    setData(dataa);
  };

  const columns = [
    { field: "id", label: t("invoiceNumber") },
    { field: "clientName", label: t("purchaseFrom") },
    { field: "purchaseReceiptNumber", label: t("receiptNumber") },
    { field: "purchaseCompany", label: t("company") },
    { field: "purchaseDate", label: t("purchaseDate"), format: "date" },
    { field: "createdAt", label: t("Date"), format: "date" },
    { field: "createdAt", label: t("time"), format: "time" },
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
      <MetaData title="QE ~~PurchaseInvoice" />
      <div className={`Purchase ${colorTheme}`}>
      <div className="secondContainer">
        <div className="contentt-box">
          <div className="heading-container">
            <h3>{t("purchaseInvoices")}</h3>
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
            defaultValue={defaultInvoiceNumber}
                   />
         
           <AsyncSelect 
               placeholder = {"Customer Name"}
            ref={selectInputRef2}
            loadOptions={clientNameList?.length > 0 && loadClientNameOptions}
            defaultOptions={clientNameList} onChange={handlecustomerNameSelectChange}
            defaultValue={defualtClientName}
                   />
         
          <AsyncSelect 
            placeholder = {"Receipt Number"}
            ref={selectInputRef3}
            loadOptions={receptNumberList?.length > 0 && loadReceiptNumberOptions}
            defaultOptions={receptNumberList} onChange={handleReceiptSelectChange}
            defaultValue={defaultReceiptNumber}
                   />
        
           <AsyncSelect 
            placeholder = {"Company"}
            ref={selectInputRef4}
            loadOptions={companyNumberList?.length > 0 && loadCompanyOptions}
            defaultOptions={companyNumberList} onChange={handleCompanySelectChange}
            defaultValue={defaultCompanyValue}
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
          {/* <DatePicker
            selected={selectedDate}
            onChange={handleDateSelectChange}
            placeholderText={t("startingDate")}
            dateFormat="dd/MM/yyyy"
            className="datePicker"
            // style={{ flex: 1 }}
          />
          <DatePicker
            selected={selectEndDate}
            onChange={handleSelectEndDateChange}
            placeholderText={t("endingDate")}
            dateFormat="dd/MM/yyyy"
            // style={{ flex: 1 }}
            className="datePicker"
          /> */}
          <Button className="buttonSearch" onClick={handleSearch}>
            {t("search")}&nbsp;&nbsp;{<SearchIcon />}
          </Button>
          <Button
            className="buttonSearchBack"
            onClick={() => {
              selectInputRef1.current.clearValue();
              selectInputRef2.current.clearValue();
              selectInputRef3.current.clearValue();
              selectInputRef4.current.clearValue();
              setInvoiceNumber("");
              setcustName("");
              setSelectedDate("");
              setSelectEndDate("");
              setPurchaseCompany("");
              setPurchaseReceiptNumber("");
              setData(pr);
              handleReceiptSelectChange()
              handleInvoiceNmberSelectChange()
              handlecustomerNameSelectChange()
              setDefaultInvoiceNumber([])
              setDefaultReceiptNumber([])
              setDateRange([])
            }}
          >
            {t("clear")}&nbsp;&nbsp;{<ClearAllIcon />}
          </Button>
        </div>
        <div className="table-container">
          {!loading ? (
            <TableComponentId data={data} columns={columns} actions={actions} />
          ) : (
            // <Loader active>Loading</Loader>
            <PageLoader />
          )}
        </div>
      </div>  
      </div>
    </>
  );
};

export default TableTransfer;
