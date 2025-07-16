import React from "react";
import MetaData from "../../../MetaData";
import { useEffect, useState, useContext, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DateRangePicker } from 'rsuite';
import 'rsuite/DateRangePicker/styles/index.css';
import AsyncSelect from "react-select/async"
import { Link, Navigate, useNavigate } from "react-router-dom";
import swal from "sweetalert2";
import {
  Button,
} from "semantic-ui-react";
import { useTranslation } from "react-i18next";
import { State } from "./context/ContextSales";
import TableComponentId from "../../../Components/tableComponent/tableComponentId";
import { useCustomState } from "../../../Variables/stateVariables";
import { tableState } from "../../../Components/tableComponent/tableContext";
import { useSelector, useDispatch } from "react-redux";
import PageLoader from "../../../Components/Loader/PageLoader";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import SearchIcon from "@mui/icons-material/Search";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import {
  getTransferInvoiceRecord,
  getTransferInvoiceRecordOnMultipleShops,
  getTransferRecord,
} from "../../../actions/transferAction";
import { refreshTokken } from "../../../actions/userAction";
let pr = [];
let seletedShop = [];
let seletedGodown = [];
let invoiceNumberList = []
let transferFromList = []
let shopOptionsList = []
let godownOptionsList = []
let transferToList = []
let selectedTempShop = "";
let isCalledd = "false";
const TableTransfer = () => {
  //for Scrolling
  const tableContainerRef = useRef(null);

  ///////////////////////////////////////////
  const {
    salesId,
    setSalesId,
    salesRef,
    selectedRadioOption,
    setSelectedRadioOption,
  } = useContext(State); 
  const selectInputRef1 = useRef();
  const selectInputRef2 = useRef();
  const selectInputRef3 = useRef();
  const selectInputRef4 = useRef();
  const selectInputRef5 = useRef();
  const selectInputRef6 = useRef();
  const [dateRange, setDateRange] = useState([]);
  const [defaultInvoiceNumber, setDefaultInvoiceNumber] = useState()
  const [defaultTransferFrom, setDefaultTransferFrom] = useState()
  const [defaultTransferTo, setDefaultTransferTo] = useState()
  const [defaultCategoryOption, setDefaultCategoryOption] = useState()
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectEndDate, setSelectEndDate] = useState(null);
  const [SalesRecord, setSalesRecord] = useState([]);
  const navigate = useNavigate();
  const [InvoiceNumber, setInvoiceNumber] = useState();
  const [custName, setcustName] = useState("");
  const [loading, setLoading] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { data, setData } = useCustomState();
  const { rowCount, setRowCount } = useContext(tableState);
  const [colorTheme, setColorTheme] = useState("theme-white");
  const [selectedShop, setSelectedShop] = useState('');
  const [selectedGodown, setSelectedGodown] = useState('');
  const { t, i18n } = useTranslation();
  const categoryOptions = [
    { key: "1", label: "shop", value: "shop" },
    { key: "2", label: "store", value: "store" },
  ];
  const { storage } = useSelector((state) => state.storage);
  const { shop } = useSelector((state) => state.shop);
  const handleCategoryChange = async ( value ) => {
    if (value?.value.startsWith("st")) {
      setDefaultCategoryOption(value)
      setSelectedShop("");
      setSelectedGodown(value?.value);
      console.log("st");
    } else {
      setDefaultCategoryOption(value)
      console.log("shop");
      setSelectedShop(value?.value);
      setSelectedGodown("");
    }
  };


  useEffect(() => {
    const currentColorTheme = localStorage.getItem("theme-color");
    if (currentColorTheme) {
      setColorTheme(currentColorTheme);
    }
  }, [colorTheme]);

  useEffect(() => {
    let currentLang = localStorage.getItem("lang");
    i18n.changeLanguage(currentLang);
  }, []);
  useEffect(() => {
    call();
  }, []);

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
  const shopAsArray = [seletedShop];
  const shopCodes = shopAsArray?.map((shop) => shop);
  const godownCodes = seletedGodown.map((godown) => godown);
  const combinedOptions = [...shopCodes, ...godownCodes];
  const transferFromList =combinedOptions?.map(storage =>({
    value: storage,
    label: storage 
  }))
  useEffect(() => {
    console.log(combinedOptions);
    if (combinedOptions?.length > 0 && !selectedRadioOption) {
      // setSelectedRadioOption(combinedOptions[0]);
      console.log(combinedOptions[0]);
      selectedTempShop = combinedOptions[0];
    }
  }, [combinedOptions, selectedRadioOption]);

  useEffect(() => {
    seletedShop = JSON.parse(localStorage.getItem("shopId"));
    seletedGodown = JSON.parse(localStorage.getItem("godownId"));
    console.log(selectedShop);
    console.log(seletedGodown);
  });


  useEffect(()=>{
    if(shop?.length > 0)
    {
      shopOptionsList = shop.map(option => ({
        label: option.shopCode,
        value: option.shopCode
      }))
    }
  }, [shop])


  useEffect(()=>{
    if(storage?.length > 0)
    {
      godownOptionsList = storage?.map(option => ({
        label: option.storageCode,
        value: option.storageCode
      }))
    }
  }, [storage])
  useEffect(()=>{
  if(selectedGodown === '' && selectedShop === ''){
    call()
  }
  },[selectedShop, selectedGodown])

  const handleOptionChange = async (value) => {
    setLoading(false);
    console.log(value?.value);
    pr = await getTransferInvoiceRecord(value?.value);
    invoiceNumberList =pr?.map(storage =>({
      value: storage.id,
      label: storage.id 
    }))
    transferToList =pr?.map(storage =>({
      value: storage.transferTo,
      label: storage.transferTo 
    }))
    console.log(pr);
    setDefaultTransferFrom(value)
    setSelectedRadioOption(value?.value);
    setData(pr);
    setLoading(true);
  };

  async function call() {
    if (
      JSON.parse(localStorage.getItem("isAdministrator")) ||
      JSON.parse(localStorage.getItem("isAdministrator"))
    ) {
      let result = await getTransferRecord();
      console.log(result);
      pr = result;
      invoiceNumberList =pr?.map(storage =>({
        value: storage.id,
        label: storage.id 
      }))
      transferToList =pr?.map(storage =>({
        value: storage.transferTo,
        label: storage.transferTo 
      }))
      setData(result);
      setSalesRecord(result);
      setFilteredProducts(result?.reverse());
      setLoading(true);
    } else {
      let result = await getTransferInvoiceRecordOnMultipleShops(
        JSON.parse(localStorage.getItem("shopId")), JSON.parse(localStorage.getItem("godownId"))
      );
      console.log(result);
      pr = result;
      invoiceNumberList =pr?.map(storage =>({
        value: storage?.id,
        label: storage?.id 
      }))
      transferToList =pr?.map(storage =>({
        value: storage?.transferTo,
        label: storage?.transferTo 
      }))
      setData(result);
      setSalesRecord(result);
      setFilteredProducts(result?.reverse());
      setLoading(true);
    }
  }

  
  const loadInvoiceOptions = (search, callBack) => {
    setTimeout(()=>{
      const filterOptions = invoiceNumberList?.filter(option=> option?.value.toLowerCase().includes(search.toLowerCase()))
      callBack(filterOptions)
    }, 3000)
  }

  const loadCategoryOptions = (search, callBack) => {
    setTimeout(()=>{
      const filterOptions = categoryOptions?.filter(option=> option?.value.toLowerCase().includes(search.toLowerCase()))
      callBack(filterOptions)
    }, 3000)
  }
  const loadTransferFromOptions = (search, callBack) => {
    setTimeout(()=>{
      const filterOptions = transferFromList?.filter(option=> option?.value.toLowerCase().includes(search.toLowerCase()))
      callBack(filterOptions)
    }, 3000)
  }

  const loadShopOptions = (search, callBack) => {
    setTimeout(()=>{
      const filterOptions = shopOptionsList?.filter(option=> option?.value.toLowerCase().includes(search.toLowerCase()))
      callBack(filterOptions)
    }, 3000)
  }

  const loadGodownOptions = (search, callBack) => {
    setTimeout(()=>{
      const filterOptions = godownOptionsList?.filter(option=> option?.value.toLowerCase().includes(search.toLowerCase()))
      callBack(filterOptions)
    }, 3000)
  }

  const loadTransferToOptions = (search, callBack) => {
    setTimeout(()=>{
      const filterOptions = transferToList?.filter(option=> option?.value.toLowerCase().includes(search.toLowerCase()))
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
    setSalesId(id);
    navigate("/TranferPreviewBill");
  };

  const handleInvoiceNmberSelectChange = ( value ) => {
    setInvoiceNumber(value?.value);
    setDefaultInvoiceNumber(value)
  };
  const handleTraansferToOptionChange = ( value ) => {
    setDefaultTransferTo(value);
  };

  const handleDateSelectChange = (date) => {
    setSelectedDate(date);
  };
  const handleSelectEndDateChange = (date) => {
    setSelectEndDate(date);
  };

  const handleSearch = () => {
    let Filtered = SalesRecord?.filter((product) => {
      //Filter by Products
      if (
        InvoiceNumber &&
        !product.id
          .toString()
          .toLowerCase()
          .includes(InvoiceNumber.toString().toLowerCase())
      ) {
        return false;
      }

      //Filter by product Type
      if (
        custName &&
        !product.transferTo
          .toString()
          .toLowerCase()
          .includes(custName.toString().toLowerCase())
      ) {
        return false;
      }

      // Filter by starting date
      if (selectedDate) {
        const saleDate = new Date(product.createdAt);
        if (saleDate < selectedDate) {
          return false;
        }
      }

      // Filter by ending date
      if (selectEndDate) {
        const saleDate = new Date(product.createdAt);
        if (saleDate > selectEndDate) {
          return false;
        }
      }

      return true;
    });

    setData(Filtered);
  };

  const columns = [
    { field: "id", label: t("invoiceNumber") },
    { field: "tranferFrom", label: t("transferFrom") },
    { field: "transferTo", label: t("transferTo") },
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
      <MetaData title="QE ~~TransferInvoice" />
      <div className={`Transfer ${colorTheme}`}>
      <div className="secondContainer">
        <div className="contentt-box">
          <div className="heading-container">
            <h3>{t("transferInvoices")}</h3>
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
          {/* <Dropdown
            control={Select}
            options={SalesRecord?.map((element) => ({
              key: element.id,
              text: element.id,
              value: element.id,
            }))}
            placeholder={t("invoiceNumber")}
            className="purchaseDropdown1"
            fluid
            search
            selection
            value={InvoiceNumber}
            onChange={handleInvoiceNmberSelectChange}
          /> */}
         

        {JSON.parse(localStorage.getItem("isAdministrator")) ||
          JSON.parse(localStorage.getItem("isSuperAdmin")) ? (
            <AsyncSelect 
            placeholder = {"Select Option"}
            ref={selectInputRef2}
            loadOptions={categoryOptions?.length > 0 && loadCategoryOptions}
            defaultOptions={categoryOptions} onChange={handleCategoryChange}
            defaultValue={defaultCategoryOption}
          />
            // <Dropdown
            //   control={Select}
            //   placeholder={t("selectWareHouse")}
            //   className="productLocationDropdown"
            //   fluid
            //   selection
            //   clearable
            //   options={categoryOptions}
            //   onChange={handleCategoryChange}
            // />
          ) : (
            <AsyncSelect 
            placeholder = {"Transfer From"}
            ref={selectInputRef3}
            loadOptions={transferFromList?.length > 0 && loadTransferFromOptions}
            defaultOptions={transferFromList} onChange={handleOptionChange}
            defaultValue={defaultTransferFrom}
                   />
            // <Dropdown
            //   placeholder={t("selectTransferFrom")}
            //   className="productLocationDropdown"
            //   fluid
            //   selection
            //   clearable
            //   options={combinedOptions.map((option) => ({
            //     key: option,
            //     text: option,
            //     value: option,
            //   }))}
            //   value={selectedRadioOption}
            //   onChange={handleOptionChange}
            // />
          )}
           {(JSON.parse(localStorage.getItem("isAdministrator")) ||
          JSON.parse(localStorage.getItem("isSuperAdmin"))) && (
          <>
            {selectedShop ? (
              <>
                 <AsyncSelect 
            placeholder = {"Select Shop"}
            ref={selectInputRef4}
            loadOptions={shopOptionsList?.length > 0 && loadShopOptions}
            defaultOptions={shopOptionsList} onChange={handleOptionChange}
            defaultValue={defaultTransferFrom}
                   />
                {/* <Dropdown
                  placeholder="Select an option"
                  selection
                  options={shop.map((option) => ({
                    key: option.shopCode,
                    text: option.shopCode,
                    value: option.shopCode,
                  }))}
                  clearable
                  className="productLocationDropdown1"
                  onChange={handleOptionChange}
                /> */}
              </>
            ) : (
              <>
                {selectedGodown && (
                     <AsyncSelect 
                     placeholder = {"Select Godown"}
                     ref={selectInputRef5}
                     loadOptions={godownOptionsList?.length > 0 && loadGodownOptions}
                     defaultOptions={godownOptionsList} onChange={handleOptionChange}
                     defaultValue={defaultTransferFrom}
                            />
                  // <Dropdown
                  //   placeholder="Select an option"
                  //   selection
                  //   clearable
                  //   options={storage.map((option) => ({
                  //     key: option.storageCode,
                  //     text: option.storageCode,
                  //     value: option.storageCode,
                  //   }))}
                  //   className="productLocationDropdown1"
                  //   onChange={handleOptionChange}
                  // />
                )}
              </>
            )}
          </>
        )}
          <AsyncSelect 
            placeholder = {"Transfer To"}
            ref={selectInputRef6}
            loadOptions={transferToList?.length > 0 && loadTransferToOptions}
            defaultOptions={transferToList} onChange={handleTraansferToOptionChange}
            defaultValue={defaultTransferTo}
                   />
         {/* <Dropdown
            control={Select}
            options={SalesRecord?.map((element) => ({
              key: element.transferTo,
              text: element.transferTo,
              value: element.transferTo,
            }))}
            placeholder={t("enterTransferTo")}
            fluid
            search
            className="purchaseDropdown"
            selection
            value={custName}
            onChange={handlecustomerNameSelectChange}
          /> */}
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
          />
          <DatePicker
            selected={selectEndDate}
            onChange={handleSelectEndDateChange}
            placeholderText={t("endingDate")}
            dateFormat="dd/MM/yyyy"
            className="datePicker"
          /> */}
         
          <Button className="buttonSearch" onClick={handleSearch}>
            {t("search")}&nbsp;&nbsp;{<SearchIcon />}
          </Button>
          <Button
            className="buttonSearchBack"
            onClick={() => {
              setInvoiceNumber("");
              setcustName("");
              setSelectedDate("");
              setSelectEndDate("");
              setSelectedRadioOption('')
              setDateRange([])
              call()  
              selectInputRef1?.current?.clearValue();
              selectInputRef2?.current?.clearValue();
              selectInputRef3?.current?.clearValue();
              selectInputRef4?.current?.clearValue();
              selectInputRef5?.current?.clearValue();
              selectInputRef6?.current?.clearValue();
              // setData(pr);
            }}
          >
            {t("clear")}&nbsp;&nbsp;{<ClearAllIcon />}
          </Button>
        </div>
        <div className="table-container">
          {loading ? (
            <TableComponentId data={data} columns={columns} actions={actions} />
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
