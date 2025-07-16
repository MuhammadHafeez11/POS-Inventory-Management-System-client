import React, { useEffect, useState, useRef } from "react";
import { Button, Form, Dropdown, Container } from "semantic-ui-react";
import { DateRangePicker } from 'rsuite';
import swal from "sweetalert2";

import 'rsuite/DateRangePicker/styles/index.css';
import { useNavigate } from "react-router-dom";
import PrintLaserTable from "../../Components/tableComponent/printLaserTable";
import { ProfitEmpoloyee } from "../../Components/searchComponent/ConsolidatedProfitSearch/ProfitSearch";
import SearchIcon from "@mui/icons-material/Search";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import { getSaleConsolidatedRecord, getSaleRecord, getSaleRecordOnShopCode } from "../../actions/saleProductAction";
import { getUsersOnShopId, refreshTokken } from "../../actions/userAction";
import { useTranslation } from "react-i18next";
import { postEmployeeComssionData } from "../../actions/employeCommissionAction";
import { getPermissionForRoles } from "../user/rolesAssigned/RolesPermissionValidation";
import { useDispatch, useSelector } from "react-redux";
import { getShop } from "../../actions/shopAction";
import PageLoader from "../../Components/Loader/PageLoader";
let salesRecord = [];
let data = [];
let dataa = [];
let salesProfit = [];
let totalProfit = 0;
let isCalled = "false";

let quantityy = [];
let Discount = [];
let totalAmounnt = [];
let taxAmount = [];
let Price = [];
let amount = [];
let profit = [];
const ProfitSalesMan = () => {
  ///////////////================================================////////////////////////
  ///////////////////////// All useState Variables /////////////////////////////////////
  //////////////================================================////////////////////////
  let action4 = "ProfitEmployee";
  const [isCalled, setIsCalled] = useState(true);
  const [shopNoData, setShopNoData] = useState([]);
  const [employeName, setEmployeName] = useState([]);
  const [salesProductShopNoDropDown, setsalesProductShopNoDropDown] =
    useState("");
    const [dateRange, setDateRange] = useState([null, null]);
  const [salesProductSaleByDropDown, setsalesProductSaleByDropDown] =
    useState("");
  const [calculating, setCalculating] = useState(false)
  const [salesStartDateDropDown, setSalesStartDateDropDown] = useState(null);
  const [salesEndDateDropDown, setSalesEndDateDropDown] = useState(null);
  const [isSaleBySelected, setisSaleBySelected] = useState(false);
  const [salRecords, setSalRecords] = useState([]);
  const [percentage, setPercentage] = useState();
  const [colorTheme, setColorTheme] = useState("theme-white");
  const [comissionViewPermission, setComissionViewPermission] = useState(false);
  const {shop, loading} = useSelector((state)=> state.shop)
  const {usersOnShopCode, usersOnShopCodeLoading} = useSelector((state)=> state.usersOnShopCode)
  const {saleRecord, saleRecordLoading} = useSelector((state)=> state.saleRecord)
  const {user} = useSelector((state)=>state.user)
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch()
  const handleClear = () => {
    setsalesProductSaleByDropDown("");
    setisSaleBySelected(false);
    console.log("calleds");
  };
  useEffect(() => {
    setComissionViewPermission(false);
    getPermission();
  }, []);
  async function getPermission() {
    try {
      const permissionForAdd = await getPermissionForRoles(
        "View Commission Report"
      );
      console.log(permissionForAdd);
      setComissionViewPermission(permissionForAdd);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    if (isCalled === "false") {
      isCalled = "true";
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

  ///////////////================================================////////////////////////
  ///////////////////////////// All useEffect  //////////////////////////////////////////
  //////////////================================================////////////////////////
  useEffect(() => {
    // dispatch(getSaleRecord())
    if(user?.user?.roles?.roleName === "Administrator" || user?.user?.roles?.roleName === "superAdmin" )
    {
      dispatch(getSaleRecord())
    }else 
    {
      dispatch(getSaleRecordOnShopCode(user?.user?.shopNo?.shopCode))
    }
  }, []);

  useEffect(() => {
    const currentColorTheme = localStorage.getItem("theme-color");
    if (currentColorTheme) {
      setColorTheme(currentColorTheme);
    }
  }, [colorTheme]);


  useEffect(()=>{
    dispatch(getShop())
  }, [])

  useEffect(()=>{
    console.log(usersOnShopCode)
    if(!usersOnShopCodeLoading && usersOnShopCode?.success)
    {
         let users = usersOnShopCode?.user?.reduce((filteredProducts, user) => {
            console.log(user)
            if (user.roles?.roleName !== "Administrator" && user.roles?.roleName !== "superAdmin") {
              filteredProducts.push(user);
            }
            return filteredProducts;
          },[])
          setEmployeName(users)
    }
  }, [usersOnShopCode, usersOnShopCodeLoading])

  useEffect(()=>{
    let role = JSON.parse(localStorage.getItem("roles"));
    if (user?.user?.roles?.roleName === "Admin") {
      dispatch(getUsersOnShopId(user?.user?.shopNo?._id))
    }
  
  }, [])


  useEffect(()=>{
    if(!saleRecordLoading && saleRecord?.length > 0)
      {
        console.log(saleRecord)
        if(user?.user?.roles?.roleName === "Administrator" || user?.user?.roles?.roleName === "superAdmin")
        {
          console.log('saleRecord', saleRecord)
          data = saleRecord
        }else
        if (user?.user?.roles?.roleName === "Admin") {
          data = saleRecord?.reduce((filteredProducts, product) => {
            if (product.shopNo === JSON.parse(localStorage.getItem("shopId"))) {
              filteredProducts.push(product);
            }
            return filteredProducts;
          }, []);
        } else {
          data = saleRecord?.reduce((filteredProducts, product) => {
            if (
              product.shopNo === user?.user?.shopNo?.shopCode &&
              product.saleBy === user?.user?.name
            ) {
              filteredProducts.push(product);
            }
            return filteredProducts;
          }, []);
        }
      }
  }, [saleRecord, saleRecordLoading])

  ///////////////================================================////////////////////////
  /////////////////// Option Selection for DropDown /////////////////////////////////////
  //////////////================================================////////////////////////
  const handleSaleByvalue = (event, { value }) => {
    setisSaleBySelected(true);
    setsalesProductSaleByDropDown(value);
  };

  const handleShopNovalue = (event, { value }) => {
    console.log(value)
    dispatch(getUsersOnShopId(value?._id))
    dispatch(getSaleRecordOnShopCode(value?.shopCode))
    setsalesProductShopNoDropDown(value?.shopCode);
  };


  ///////////////================================================////////////////////////
  /////////////////// Search data for SaleBy dropDown /////////////////////////////////////
  //////////////================================================////////////////////////
  const getRecord = async () => {
    if (percentage > 0) {
      console.log(data, salesProductSaleByDropDown, salesStartDateDropDown, salesEndDateDropDown)
      setCalculating(true)
      const Filtered = await ProfitEmpoloyee(
        data,
        salesProductSaleByDropDown,
        salesStartDateDropDown,
        salesEndDateDropDown
      );
      salesRecord = Filtered;
      setSalRecords(Filtered);
      // Step 3: Calculate profits for each product sold by the salesman
      const profitPercentage = percentage / 100; // 10%

      let profit = 0;
      salesProfit = Filtered.map((sale) => ({
        ...sale, // Spread the existing sale data
        profit: isNaN(((parseInt(sale.excludeTaxPrice) - parseInt(sale.purchasePrice)) * profitPercentage).toFixed(2)) ? 0 :  parseInt((parseInt(sale.excludeTaxPrice) - (parseInt(sale.purchasePrice) + parseInt(sale.Discount))) * profitPercentage)
        // ((parseInt(sale.excludeTaxPrice) - parseInt(sale.purchaseInvoicePrice)) * profitPercentage).toFixed(2), // Calculate profit
      }));
      console.log(salesProfit);
      totalProfit = salesProfit?.reduce(
        (total, sale) => total + parseInt(sale.profit),
        0
      );
      console.log(totalProfit);
      totalProfit = parseInt(totalProfit);
      // console.log(totalP)
      console.log(`Total profit for: $${totalProfit.toFixed(2)}`);

      quantityy = salesProfit
        ?.reduce(
          (sum, product) => sum + parseInt(product.PurchaseQuantity, 10),
          0
        )
        .toString();
      Price = salesProfit
        ?.reduce((sum, product) => sum + parseFloat(product.excludeTaxPrice), 0)
        .toString();
      Discount = salesProfit
        ?.reduce((sum, product) => sum + parseFloat(product.Discount), 0)
        .toString();
      totalAmounnt = salesProfit
        ?.reduce((sum, product) => sum + parseFloat(product.totalAmounnt), 0)
        ?.toString();
      taxAmount = salesProfit
        ?.reduce((sum, product) => sum + parseFloat(product.taxAmount), 0)
        .toString();
      taxAmount = Number(taxAmount);
      taxAmount = taxAmount.toFixed(2);
      amount = salesProfit
        ?.reduce((sum, product) => sum + parseFloat(product.amount), 0)
        ?.toString();
      setCalculating(false)
    } else {
      console.log("percentage should be greater than 0 ");
      swal.fire({
        icon: "warning",
        title: t("titleWarning"),
        text: t("percentageShouldBeGreaterThanZero"),
        showConfirmButton: false,
        timer: 2000,
        customClass: {
          popup: "custom-swal-popup", // This is the custom class you're adding
        },
      });
    }
  };

  const handleDateChange = (value) => {
    if(value?.length > 0)
    {
      const startingDate = new Date(value[0])
      const endingDate = new Date(value[1])
      setSalesStartDateDropDown(startingDate)
      setSalesEndDateDropDown(endingDate)
      setDateRange(value);
    }else{
      setSalesStartDateDropDown('')
      setSalesEndDateDropDown('')
      setDateRange(value)
    }
    
  };

  const submitCommissionRecord = async () => {
    let result = await postEmployeeComssionData(
      salesProductSaleByDropDown,
      totalProfit,
      percentage,
      salesProductShopNoDropDown,
      salesStartDateDropDown,
      salesEndDateDropDown,
      salesProfit
    );
    console.log(result);
    if (result?.message === `Purchase Product created successfully`) {
      swal.fire({
        icon: "success",
        title: t("titleAdded"),
        text: t("successMessage"),
        showConfirmButton: false,
        timer: 2000,
        customClass: {
          popup: "custom-swal-popup", // This is the custom class you're adding
        },
      });
    }else  if (result?.data?.error) {
      swal.fire({
        icon: "error",
        title: `error`,
        text: t(`${result?.data?.message}`),
        showConfirmButton: false,
        timer: 2000,
        customClass: {
          popup: "custom-swal-popup", // This is the custom class you're adding
        },
      })}
  };

  const columns = [
    { field: "Code", label: "Code" },
    { field: "Namee", label: "Name" },
    { field: "Company", label: "Company" },
    { field: "PurchaseQuantity", label: "Quantity" },
    { field: "purchasePrice", label: "Purchase Price" },
    { field: "excludeTaxPrice", label: "MRP" },
    { field: "Discount", label: "Discount" },
    { field: "amount", label: "Total Price" },
    { field: "profit", label: "Employee Profit" },
  ];
  return (
    <>
      <div className={`Purchase ${colorTheme}`}>
        <div className="secondContainer">
        {comissionViewPermission && (
          <>
            <div className="contentt-box">
              <div className="heading-container">
                <h3>{t("calculateCommission")}</h3>
              </div>
            </div>
            <div className="search-box">
              {(JSON.parse(localStorage.getItem("isAdministrator")) ||
                JSON.parse(localStorage.getItem("isSuperAdmin"))) && (
                <Dropdown
                  options={shop?.map((element) => ({
                    key: element.shopCode,
                    text: element.shopCode,
                    value: element,
                  }))}
                  placeholder={t("selectShop")}
                  className="purchaseDropdown1"
                  fluid
                  
                  selection
                  disabled={isSaleBySelected}
                  onClear={handleClear}
                  value={salesProductShopNoDropDown}
                  onChange={handleShopNovalue}
                />
              )}
              {
                (user?.user?.roles?.roleName !== "Administrator" && user?.user?.roles?.roleName !== "superAdmin" && user?.user?.roles?.roleName !== "Admin") ?
                (
                  <input
                  type="text"
                  name="employeeName"
                  placeholder={"Enter Employee Name"}
                  autoComplete="off"
                  value={user?.user?.name}
                  // onChange={(e) => setPercentage(e.target.value)}
                  className="profitInput"
                  disabled
                  // style={{ flex: 1, padding: "10px", width: "200px" }}
                />
                ) : 
                ( 
                <Dropdown
                  options={employeName?.map((element) => ({
                    key: element?.name,
                    text: element?.name,
                    value: element?.name,
                  }))}
                  placeholder={t("Select Employe")}
                  fluid
                  className="purchaseDropdown"
                  selection
                  value={salesProductSaleByDropDown}
                  onChange={handleSaleByvalue}
                  // style={{ zIndex: "9" }}
                />)
              }
             

              <input
                type="text"
                name="profitPercentage"
                placeholder={"Enter Percentage"}
                autoComplete="off"
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
                className="profitInput"
                // style={{ flex: 1, padding: "10px", width: "200px" }}
              />
              <DateRangePicker
              showOneCalendar
                size="lg"
                value={dateRange}
                onChange={handleDateChange}
                placeholder="Select Date Range"
                className="saleProfitDatePicker"
                // style={{ border: "1px solid black" }}
                />
              <Button className="buttonSearch" onClick={getRecord}>
                {t("calculate")}&nbsp;&nbsp;{<SearchIcon />}
              </Button>
              <Button
                className="buttonSearchBack"
                onClick={() => {
                  setsalesProductSaleByDropDown("");
                  setsalesProductShopNoDropDown("");
                  setPercentage("");
                  salesProfit = [];
                  setSalesStartDateDropDown("");
                  setSalesEndDateDropDown("");
                  setisSaleBySelected(false);
                  dispatch(getSaleRecord())
                  setCalculating(false)
                  setDateRange([null, null])
                  // getData();
                }}
              >
                {t("clear")}&nbsp;&nbsp;{<ClearAllIcon />}
              </Button>
            </div>
            <div className="table-container">
            <div className="consolidatedPurchaseTable">
              {
                calculating ? (<PageLoader />) : (<>  
                <PrintLaserTable
                  data={salesProfit}
                  columns={columns}
                  action4={action4}
                  quantityy={quantityy}
                  Price={Price}
                  Discount={Discount}
                  totalAmounnt={totalAmounnt}
                  taxAmount={taxAmount}
                  amount={amount}
                  totalProfit={totalProfit}
                /></>)
              }
            
            </div>
               {(salesProfit?.length > 0 && salesEndDateDropDown && salesStartDateDropDown )&& (
                <>
                  <div>
                    <Button
                      className="boxButton"
                      onClick={submitCommissionRecord}
                    >
                      Generate Commission Invoice
                    </Button>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
      </div>
    </>
 
  );
};

export default ProfitSalesMan;
