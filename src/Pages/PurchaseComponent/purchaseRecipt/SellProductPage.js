import React, { useContext, useState, useEffect } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import { State } from "./context/stateContext";
import { useTranslation } from "react-i18next";
// import { useLocation } from "react-router-dom";
import { Button, Loader } from "semantic-ui-react";
import { useDispatch, useSelector } from "react-redux";
import TableComponentId from "../../../Components/tableComponent/tableComponentId";
import { useCustomState } from "../../../Variables/stateVariables";
import { getProductDetails } from "../../../actions/productActions";
import { gettStorage } from "../../../actions/storageAction";
import { getTemporaryPurchase } from "../../../actions/tempPurchaseAction";
import { searchProductData } from "../../../Components/searchComponent/productMainPageSearch/productSearch";
import { refreshTokken } from "../../../actions/userAction";
import { getColor } from "../../../actions/colorAction";
import PageLoader from "../../../Components/Loader/PageLoader"
import { useHistoryContext } from "../../../HistoryContext";
let code = "";
let type = "";
let companyProduct = "";
let isCalled = "false";
const SellProductPage = () => {
  const location = useLocation()
  const { data, setData } = useCustomState();
  const dispatch = useDispatch()
  const [Products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productName, setProductName] = useState();
  const [productCode, setProductCode] = useState();
  // const [productType, setProductType] = useState();
  const [prodCompany, setProdCompany] = useState();
  const [productTypee, setProductTypee] = useState([]);
  const [loc, setLoc] = useState("Hello");
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(true);
  const {
    setCode,
    setNamee,
    setCompany,
    setCurrentPrice,
    setQuantityidset,
    setPurchasePrice,
    setPurchaseProductDiscount,
    setPurchaseProductExpense,
    setPurchaseProductTax,setSalesmanSalePrice,setMinimumSalePrice,
    setPurchaseProductPriceExcludeTax,
    setGetTempPurchaseee,setExpensePrice,setExpense,setDiscountValue,setPurchaseTaxPercentage ,
    setItemsAdded,invoicePrice, setinvoicePrice,setPurchaseDiscount,setPurchaseTotalDiscount,
    setClearData,priceExcludingTax, setPriceExcludingTax, setMRP, MRP
  } = useContext(State);
  const [colorTheme, setColorTheme] = useState("theme-white");
  const { productType } = useSelector((state) => state.productType);
  const { productsOnCompanyName, loadingg } = useSelector(
    (state) => state.productsOnCompanyName
  );
  const { previousPath, setPreviousPath } = useHistoryContext();
  const navigate = useNavigate();

  useEffect(()=>{
    setPreviousPath(location.pathname)
  }, [])

  useEffect(() => {
    const currentThemeColor = localStorage.getItem("theme-color");
    if (currentThemeColor) {
      setColorTheme(currentThemeColor);
    }
  }, [colorTheme]);

  useEffect(() => {
    isCalled = "false";
  }, [code, type, companyProduct]);

  useEffect(() => {
    if (isCalled === "false") {
      isCalled = "true";
      getToken();
    }
  }, [isCalled]);

  useEffect(()=>{
    dispatch(getColor())
  }, [])

  const getToken = async () => {
    const token = await refreshTokken();
    if (token?.data === "Please login to acces this resource") {
      navigate("/login");
    }
    console.log(token);
  };

  useEffect(() => {
    console.log(productsOnCompanyName);
    if (productsOnCompanyName  && !loadingg) {
      console.log(productsOnCompanyName);
      setData(productsOnCompanyName);
      setProducts(productsOnCompanyName);
      setFilteredProducts(productsOnCompanyName);
      setLoading(false);
    }
  }, [productsOnCompanyName, !loadingg]);

  useEffect(() => {
    getTempPurchasee();
    setItemsAdded(true);
    setClearData(true);
  }, []);
  const getTempPurchasee = async () => {
    let tempProductResult = await getTemporaryPurchase();

    console.log(tempProductResult);
    setGetTempPurchaseee(tempProductResult);
  };

  async function getProductLocc() {
    // pr= await getProductsOnCompanyName(purchaseCompany)
  }

  const sellproduct = async (id) => {
    // console.log("called");
    // console.log(id);
    let dataa = await getProductDetails(id);
    console.log('fhie')
    // console.log(dataa);
    console.log(dataa);
    setNamee(dataa?.productTypeName?.productName);
    setCode(dataa?.productCode);
    setCompany(dataa?.productCompany?.companyName);
    setCurrentPrice(dataa?.productCurrentPrice);
    setinvoicePrice(dataa?.invoicePrice)
    setExpense(dataa?.productExpenses)
    setExpensePrice(dataa?.productExpenses)
    setPurchaseDiscount(dataa?.productDiscount)
    setPurchaseTotalDiscount(dataa?.productDiscount)
    setDiscountValue(dataa?.productDiscount)
    setPurchaseProductPriceExcludeTax(dataa?.productpriceExcludingTax);
    setPurchaseProductDiscount(dataa?.productDiscount);
    setPurchaseProductExpense(dataa?.productExpenses);
    setPurchaseProductTax(dataa?.productTaxPrice);
    setPurchasePrice(dataa?.purchasePrice);
    setPurchaseTaxPercentage(dataa?.productTaxPrice);
    setSalesmanSalePrice(dataa?.salesmanSalePrice)
    setMinimumSalePrice(dataa?.minimumSalePrice)
    // setPriceExcludingTax(dataa?.productpriceExcludingTax)
    console.log(typeof dataa?.salesmanSalePrice)
    console.log(typeof dataa?.minimumSalePrice)
    setMRP(dataa?.productpriceExcludingTax)
    // // setQuantitye(data.productQuantity);
    // console.log(JSON.parse(localStorage.getItem("shopId")));
    console.log(dataa?._id);
    setQuantityidset(dataa?._id);
    // setLocationsetid(data.productAvalibility._id);
    setLoc("Hec this is new");
    navigate("/purchaseDiscount");
  };

  const handleSearch = async (code, type, companyProduct) => {
    const dataa = await searchProductData(
      productsOnCompanyName,
      code,
      type,
      companyProduct
    );
    // console.warn(dataa);
    setData(dataa);
  };

  const columns = [    
    { field: "avatar", label: "Avatar" }, 
    { field: "productName", label: t("productName") },
    { field: "productCode", label: t("code") },
    { field: "productTypeName.productName", label: t("type") },
    { field: "productCompany.companyName", label: t("company") },
    // { field: "productColor.colorName", label: t("color") },
    { field: "productpriceExcludingTax", label: t("price") },
  ];
  const actions = [
    {
      label: "Purchase",
      labeladded: "Already Added",
      color: "green",
      handler: (itemId) => sellproduct(itemId),
      url: null,
    },
  ];
  return (
    <>
      <div className={`Purchase ${colorTheme}`}>
         <div className="secondContainer">
        {/* {!loading ? ( */}
          <>
            <div className="purchaseProduct-box">
              <Button
                onClick={() => {
                  navigate("/PurchaseRecipt", {state: "/purchaseProductPage"});
                }}
              >
                Back
              </Button>
            </div>
            <div className="search-box">
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
            </div>

            <div className="table-container">
              {!loading ? (
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
        {/* ) : (
          <div className="loaderPage">
            <PageLoader />
          </div>
        )} */}
      </div>
      </div>
    </>
  );
};

export default SellProductPage;
