import React from "react";
import { useEffect, useState, useRef } from "react";
import {  useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import PageLoader from "../../../../Components/Loader/PageLoader"
///////////////////////////////////
import InventoryTable from "../../../../Components/GlobalTablePageDesign/InventoryTable";
import TableComponentId from "../../../../Components/tableComponent/tableComponentId";
import { useTranslation, initReactI18next } from "react-i18next";
import { searchProductData } from "../../../../Components/searchComponent/productMainPageSearch/productSearch";
import { refreshTokken } from "../../../../actions/userAction";
import MetaData from "../../../../MetaData";
import { getPermissionForRoles } from "../../../user/rolesAssigned/RolesPermissionValidation";
import { getProductLocation } from "../../../../actions/productLocationAction";
import { getCompany } from "../../../../actions/companyAction";
import { getProductType } from "../../../../actions/productTypeAction";
import { getStorage } from "../../../../actions/storageAction";
import { getProductt } from "../../../../actions/productActions";
import { getColor } from "../../../../actions/colorAction";

let userRole = "Salesman";
let selectedShop = [];
let seletedGodown = [];
let code = "";
let type = "";
let companyProduct = "";
let isCalled = "false";
let combinedOptions;
const TableUser = (props) => {
  const componentRef = useRef();
  const navigate = useNavigate();
  //////////////////================================================//////////////////////////////
  /////////////////////////// All useState Variables ////////////////////////////////////////////
  /////////////////=================================================/////////////////////////////
  const [isProductCalled, setIsProductCalled] = useState(true);
  const [isCompanyCalled, setIsCompanyCalled] = useState(true);
  const [productCode, setProductCode] = useState();
  const [colorTheme, setColorTheme] = useState("theme-white");
  const [producttCompany, setProducttCompany] = useState();
  const [selectedRadioOption, setSelectedRadioOption] = useState(
    JSON.parse(localStorage.getItem("shopId"))
  );
  const [storeSorting, setStoreSorting] = useState("");
  const [productTypee, setProductTypee] = useState("");
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);

  //////////////////================================================//////////////////////////////
  /////////////////////////// All Hook Variables ////////////////////////////////////////////
  /////////////////=================================================/////////////////////////////
  //for Scrolling
  const tableContainerRef = useRef(null);
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { company } = useSelector((state) => state.company);
  const { color } = useSelector((state) => state.color);
  const { productType } = useSelector((state) => state.productType);
  const { productLocation } = useSelector((state) => state.productLocation);
  const { productLocationOnStorageCode } = useSelector(
    (state) => state.productLocationOnStorageCode
  );
  const { storage } = useSelector((state) => state.storage);
  const { products, productLoading } = useSelector((state) => state.products);


  const [permissionForAddProduct, setPermissionForAddProduct] = useState(false);
    const [downloadXLS, setDownloadXLS] = useState(false);
      const [viewProductPermission, setViewProductPermission] = useState(false);

  const navigateLinks = {
    addItem: "/additem",
  };

  const [filters, setFilters] = useState({
    productCode: "",
    productType: "",
    productCompany: "",
  });

   const [actionLinks, setActionLinks] = useState({
      action1: "update",
      action2: "Update",
      action3: "Delete",
      action4: "generate",
      action5: "View Barcode",
    });

    const filterFields = [
      { name: "productCode", placeholder: "Enter Product Code", type: "text" },
      { name: "productType", placeholder: "Enter Product Type", type: "text" },
      {
        name: "productCompany",
        placeholder: "Enter Product Company",
        type: "text",
      },
    ];

  ////////////==================================//////////
  /////////////////  shop selection ///////////////////////
  //////////==================================/////////
  const shopAsArray = [selectedShop];
  const shopCodes = shopAsArray?.map((shop) => shop);
  const godownCodes = seletedGodown?.map((godown) => godown?.storageCode);
  useEffect(()=>{
console.log(godownCodes)
    if(godownCodes.length > 0)
    {
      combinedOptions = [...shopCodes, ...godownCodes];
    }
  //  combinedOptions = [...shopCodes, ...godownCodes];
  }, [godownCodes])
 


  useEffect(() => {
    console.log(combinedOptions);
    if (combinedOptions?.length > 0 && !selectedRadioOption) {
      setSelectedRadioOption(combinedOptions[0]);
      console.log(combinedOptions[0]);
    }
  }, [combinedOptions, selectedRadioOption]);

  useEffect(() => {
    const currentThemeColor = localStorage.getItem("theme-color");
    console.log(localStorage.getItem("theme-color"));
    if (currentThemeColor) {
      setColorTheme(currentThemeColor);
      document.body.className = currentThemeColor;
    }
  }, [colorTheme]);

  useEffect(() => {
    isCalled = "false";
  }, [data, products, combinedOptions, productCode]);

  useEffect(() => {
    if (isCalled === "false") {
      isCalled = "true";
      getToken();
    }
  }, [isCalled]);
  const getToken = async () => {
    const token = await refreshTokken();
    if (token?.data === "Please login to acces this resource") {
      navigate("/login");
    }
    console.log(token);
  };

  ////////////==================================//////////
  /////////////////  All UseEffects ///////////////////////
  //////////==================================/////////
  useEffect(() => {
    callCompany();
  }, []);

  useEffect(() => {
    let currentLang = localStorage.getItem("lang");
    i18n.changeLanguage(currentLang);
  }, []);

  useEffect(() => {
    const auth = localStorage.getItem("user");
    userRole = auth ? JSON.parse(auth).role : "";
    // console.log(userRole);
  }, []);

  useEffect(() => {
    selectedShop = JSON.parse(localStorage.getItem("shopId"));
    seletedGodown = JSON.parse(localStorage.getItem("godownId"));
    console.log(selectedShop);
    console.log(seletedGodown);
  },[]);

  useEffect(() => {
    if (products?.length > 0 && !productLoading) {
      console.log(products);
      setData(products);
      setLoading(false);
    }else 
      if(!productLoading && products?.length < 0)
      {
        setLoading(false)
      }
  }, [productLoading, products]);

  ////////////==================================//////////
  /////////////////  Function to get companies ///////////////////////
  //////////==================================/////////
  async function callCompany() {

    setIsCompanyCalled(false);
  }

  ////////////==================================//////////
  /////////////////  Function for search///////////////////////
  //////////==================================/////////

   useEffect(()=>{
      dispatch(getProductLocation());
      dispatch(getCompany());
      dispatch(getProductType());
      dispatch(getColor());
      dispatch(getStorage());
      dispatch(getProductt());
    }, [])

    useEffect(() => {
      setViewProductPermission(false);
      setPermissionForAddProduct(false);
      setDownloadXLS(false);
      getPermission();
    }, []);


      async function getPermission() {
        try {
          const permissionForAdd = await getPermissionForRoles("Add Product");
          setPermissionForAddProduct(permissionForAdd);
          const permission = await getPermissionForRoles("View Product");
          console.log(permission);
          setViewProductPermission(permission);
          const permissionXLS = await getPermissionForRoles("download Record XLS");
          console.log(permissionXLS);
          setDownloadXLS(permissionXLS);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }


  const handleSearch = async (code, type, companyProduct) => {
    console.log(code);
    console.log(type);
    console.log(companyProduct);
    const dataa = await searchProductData(products, code, type, companyProduct);
    // console.warn(dataa);
    setData(dataa);
  };

  useEffect(()=>{
    handleSearch(productCode, productTypee, producttCompany)
  }, [productCode, productTypee, producttCompany])

  const handleFilterChange = (e) => {
    console.log(e.target.name);
    if (e.target.name === "productCode") {
      setProductCode(e.target.value);
    } else if (e.target.name === "productType") {
      setProductTypee(e.target.value);
    } else if (e.target.name === "productCompany") {
      setProducttCompany(e.target.value);
    } 
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const columns = [
    { field: "avatar", label: "Avatar" }, 
    { field: "productName", label: t("productName") },
    { field: "productCode", label: t("code") },
    { field: "productTypeName.productName", label: t("type") },
    { field: "productCompany.companyName", label: t("company") },
    { field: "productpriceExcludingTax", label: t("mrp") },
    { field: "minimumSalePrice", label: t("MSP") },
    { field: "salesmanSalePrice", label: t("SSP") },
  ];


  const actions = [
    {
      label: "Update",
      color: "yellow",
      handler: null,
      url: (itemId) => `/update/${itemId}`,
    },
    // {
    //   label: "View Barcode",
    //   color: "green",
    //   handler: null,
    //   url: (itemId) => `/generate/${itemId}`,
    // },
  ];
  return (
    <>
     <MetaData title="QE ~~ProductLocation" />
     <div className={`GlobalDesignPage ${colorTheme}`}>
        {
          <InventoryTable
            title="All Product"
            recordCount={data?.length}
            isLoading={loading}
            data={data}
            actions={actions}
            tableColumns={columns}
            actionLinks={actionLinks}
            navigateLinks={navigateLinks}
            onFilterChange={handleFilterChange}
            filters={filters}
            filterFields={filterFields}
            downloadXLSPermission={downloadXLS}
            AddItemPermission={permissionForAddProduct}
            clearButton={false}
          />
        }
      </div>
        {/* <div className="search-box">
          <input
            type="text"
            name="productCode"
            placeholder={t("enterProdCode")}
            autoComplete="off"
            value={productCode}
            onChange={(e) => {
              setProductCode(e.target.value);
              code = e.target.value;
              handleSearch(code, type, companyProduct);
            }}
          />
          <input
            type="text"
            name="productType"
            placeholder={t("enterProdType")}
            autoComplete="off"
            onChange={(e) => {
              type = e.target.value;
              handleSearch(code, type, companyProduct);
            }}
          />
          <input
            type="text"
            name="Company"
            placeholder={t("enterProdCompany")}
            autoComplete="off"
            onChange={(e) => {
              companyProduct = e.target.value;
              handleSearch(code, type, companyProduct);
            }}
          />
        </div>

     
          {!loading ? (
               <div className="table-container">
            <TableComponentId
              data={data}
              columns={columns}
              actions={actions}
              linkk={linkk}
              link2={link2}
              actionUpdate={actionUpdate}
              action1={action1}
            />
                </div>
          ) : (<>
          <div className="Product-table-container-loader">
          <PageLoader />
          </div>
         
          </>
           
          )}
     */}
    </>
  );
};

export default TableUser;
