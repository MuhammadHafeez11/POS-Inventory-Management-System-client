import React from "react";
import MetaData from "../../../../MetaData";
import { useEffect, useState, useContext, useRef } from "react";
import AsyncSelect from "react-select/async"
import { Link, Navigate, useNavigate } from "react-router-dom";
import { DateRangePicker } from 'rsuite';
import 'rsuite/DateRangePicker/styles/index.css';
import TableComponentId from "../../../../Components/tableComponent/tableComponentId";
import { useTranslation } from "react-i18next";
import { tableState } from "../../../../Components/tableComponent/tableContext";
import { getPermissionForRoles } from "../../../user/rolesAssigned/RolesPermissionValidation";

import {
  Button,
} from "semantic-ui-react";
import { Statee } from "../context/stateContext";
import PageLoader from "../../../../Components/Loader/PageLoader"
import { useSelector, useDispatch } from "react-redux";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import SearchIcon from "@mui/icons-material/Search";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import { useCustomState } from "../../../../Variables/stateVariables";
import { getExpenseRecord } from "../../../../actions/expenseAction";
import { refreshTokken } from "../../../../actions/userAction";

let pr = [];
let shopOptionsList = []
let isCalledd = "false";
const ExpenseInvoice = () => {
  //for Scrolling
  const tableContainerRef = useRef(null);

  ///////////////////////////////////////////
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
    loading,
    setLoading,
    custName,
    setcustName,
    filteredProducts,
    setFilteredProducts,
  } = useCustomState();
  const { rowCount, seRowCount } = useContext(tableState);
  const [reportType, setReportType] = useState();
  const [filteredData, setFilteredData] = useState([]);
  const { expenseLocation, setExpenseLocation, saledId, setSalesId, setExpenseId } =
    useContext(Statee);
  const [dateRange, setDateRange] = useState([]);
  const [defaultShopNo, setDefaultShopNo] = useState()
    const [defaultCategoryOption, setDefaultCategoryOption] = useState()
    const selectInputRef1 = useRef();
    const selectInputRef2 = useRef();
  const [colorTheme, setColorTheme] = useState("theme-white");
  const [canViewExpenseInvoice, setCanViewExpenseInvoice] = useState(false);
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { shop } = useSelector((state) => state.shop);
  useEffect(() => {
    let currentLang = localStorage.getItem("lang");
    i18n.changeLanguage(currentLang);
  }, []);
  let categoryOptions = [
    { key: "1", label: "Monthly", value: "Monthly" },
    { key: "2", label: "Daily", value: "Daily" },
  ];
  const navigate = useNavigate();

  useEffect(() => {
    setCanViewExpenseInvoice(false);
    getPermission();
  }, []);
  async function getPermission() {
    try {
      const permissionForAdd = await getPermissionForRoles(
        "View Expense Invoice"
      );
      setCanViewExpenseInvoice(permissionForAdd);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    isCalledd = "false";
  });
  useEffect(() => {
    if (isCalledd === "false") {
      isCalledd = "true";
      getToken();
    }
  }, []);

  useEffect(() => {
    const currentColorTheme = localStorage.getItem("theme-color");
    if (currentColorTheme) {
      setColorTheme(currentColorTheme);
    }
  }, [colorTheme]);

  const getToken = async () => {
    const token = await refreshTokken();
    if (token?.data === "Please login to acces this resource") {
      navigate("/login");
    }
    console.log(token);
  };

  useEffect(() => {
    getExpenseRecordd();
    // callStorage();

    // filterData();
  }, []);

  const handleSelectChange = ( value ) => {
    setExpenseLocation(value.value);
    setDefaultShopNo(value)
  };

  const handleCategoryChange = ( value ) => {
    setReportType(value.value);
    setDefaultCategoryOption(value)
  };

  const handleDateSelectChange = (date) => {
    setSelectedDate(date);
  };
  const handleSelectEndDateChange = (date) => {
    setSelectEndDate(date);
  };

  useEffect(()=>{
    if(shop?.length > 0)
    {
      shopOptionsList = shop.map(option => ({
        label: option.shopCode,
        value: option.shopCode
      }))
    }
  }, [shop])

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

  const loadCategoryOptions = (search, callBack) => {
    setTimeout(()=>{
      const filterOptions = categoryOptions?.filter(option=> option?.value.toLowerCase().includes(search.toLowerCase()))
      callBack(filterOptions)
    }, 3000)
  }

  const loadShopOptions = (search, callBack) => {
    setTimeout(()=>{
      const filterOptions = shopOptionsList?.filter(option=> option?.value.toLowerCase().includes(search.toLowerCase()))
      callBack(filterOptions)
    }, 3000)
  }

  // async function callStorage() {
  //   storage = await getStorage();
  //   // console.warn(storage);
  // }

  const sellproduct = (id) => {
    setExpenseId(id);
    navigate("/expensePreview");
  };

  const getExpenseRecordd = async () => {
    pr = await getExpenseRecord();
    console.log(pr);
    if (pr) {
      //to filter product for each storage location that a user login with account
      if (
        JSON.parse(localStorage.getItem("isAdministrator")) ||
        JSON.parse(localStorage.getItem("isSuperAdmin"))
      ) {
        setData(pr);
        setSalesRecord(pr);
        setFilteredProducts(pr.reverse());
        setLoading(true);
      } else {
        pr = pr?.reduce((filteredProducts, product) => {
          if (
            product.expenseLocation ===
            JSON.parse(localStorage.getItem("shopId"))
          ) {
            filteredProducts.push(product);
          }
          return filteredProducts;
        }, []);
        // console.log(pr);
        setData(pr);
        // console.warn(pr.expenses);
        setSalesRecord(pr);
        setFilteredProducts(pr.reverse());
        setLoading(true);
      }
    } else {
      pr = [];
    }
  };

  //Search
  const filterData = () => {
    let Filtered = data?.filter((data) => {
      //for category
      if (
        reportType &&
        !data.expenseCategory
          .toString()
          .toLowerCase()
          .includes(reportType.toString().toLowerCase())
      ) {
        return false;
      }

      //for Expense Location
      if (
        expenseLocation &&
        !data.expenseLocation.shopCode
          .toString()
          .toLowerCase()
          .includes(expenseLocation.toString().toLowerCase())
      ) {
        return false;
      }

      // // Filter by starting date
      if (selectedDate) {
        const saleDate = new Date(data.createdAt);
        if (saleDate < selectedDate) {
          return false;
        }
      }

      // Filter by ending date
      if (selectEndDate) {
        const saleDate = new Date(data.createdAt);
        if (saleDate > selectEndDate) {
          return false;
        }
      }
      return true;
    });
    // console.log(Filtered);
    pr = Filtered;
    setData(Filtered);
  };

  const columns = [
    // { field: "id", label: "Invoice Number" },
    { field: "invoiceNumber", label: t("invoiceNumber") },
    { field: "expenseCategory", label: t("expenseCategory") },
    { field: "expenseLocation", label: t("location") },
    { field: "createdAt", label: t("Date"), format: "date" },
    { field: "createdAt", label: t("time"), format: "time" },
    // {field: `${new Date(createdAt).toLocaleDateString()}`, label: 'Sale Date'},
  ];
  const actions = [
    {
      label: "InvoicePreview",
      color: "green",
      handler: (itemId) => sellproduct(itemId),
      url: null,
    },
  ];
  return (
    <>
      <MetaData title="QE ~~ExpenseInvoice" />
      <div className={`Expense ${colorTheme}`}>
      <div className="secondContainer">
        {canViewExpenseInvoice && (
          <>
            <div className="contentt-box">
              <div className="heading-container">
                <h3>{t("expenseInvoices")}</h3>
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
            placeholder = {"Select Option"}
            ref={selectInputRef1}
            loadOptions={categoryOptions?.length > 0 && loadCategoryOptions}
            defaultOptions={categoryOptions} onChange={handleCategoryChange}
            defaultValue={defaultCategoryOption}
                   />
              {/* <Dropdown
                control={Select}
                placeholder={t("expenseCategory")}
                className="purchaseDropdown1"
                fluid
                search
                selection
                options={categoryOptions}
                value={reportType}
                onChange={handleCategoryChange}
              /> */}
              <AsyncSelect 
                  placeholder = {"Select Shop"}
                    ref={selectInputRef2}
                    loadOptions={shopOptionsList?.length > 0 && loadShopOptions}
                    defaultOptions={shopOptionsList} onChange={handleSelectChange}
                    defaultValue={defaultShopNo}
                   />
              {/* <Dropdown
                control={Select}
                options={shop?.map((str) => ({
                  key: str.shopCode,
                  text: str.shopCode,
                  value: str.shopCode,
                }))}
                placeholder={t("enterTransferTo")}
                fluid
                search
                className="purchaseDropdown"
                selection
                value={expenseLocation}
                onChange={handleSelectChange}
              /> */}

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
                <DateRangePicker
                 showOneCalendar
                size="lg"
                value={dateRange}
                onChange={handleDateChange}
                placeholder="Select Date Range"
                className="saleProfitDatePicker"
                // style={{ left: "700px" }}
                />
              <Button className="buttonSearch" onClick={filterData}>
                {t("search")}&nbsp;&nbsp;{<SearchIcon />}
              </Button>
              <Button
                className="buttonSearchBack"
                onClick={() => {
                  setExpenseLocation("");
                  setReportType("");
                  setSelectEndDate("");
                  setSelectedDate("");
                  getExpenseRecord();
                  setData(pr);
                }}
              >
                {t("clear")}&nbsp;&nbsp;{<ClearAllIcon />}
              </Button>
            </div>
            <div className="table-container">
              {loading ? (
                <TableComponentId
                  data={data}
                  columns={columns}
                  actions={actions}
                />
              ) : (
                <PageLoader />
              )}
            </div>
          </>
        )}
      </div>  </div>
    
    </>
  );
};

export default ExpenseInvoice;
