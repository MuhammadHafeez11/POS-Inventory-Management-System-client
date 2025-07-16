import React, { useContext, useState, useEffect } from "react";
import { Button, Dropdown, Table } from "semantic-ui-react";
import {  useNavigate } from "react-router-dom";
import { Statee } from "./context/stateContext";
import { useTranslation } from "react-i18next";
import TableComponentId from "../../../Components/tableComponent/tableComponentId";
import { useSelector, useDispatch } from "react-redux";
import { useCustomState } from "../../../Variables/stateVariables";
import {
  getProductLoc,
  getProductLocationOnId,
  getProductLocationOnShopId,
  getProductLocationOnStorageCode,
} from "../../../actions/productLocationAction";
import { useProductOnShop } from "../../../actionHooks/ProductUpdateHook";
import { getTemporarySale } from "../../../actions/tempSaleAction";
import { LocationSearch } from "../../../Components/searchComponent/productLocationSearch/locationSearch";
import PageLoader from "../../../Components/Loader/PageLoader";
import { getCompany } from "../../../actions/companyAction";
import { getProductType } from "../../../actions/productTypeAction";
import { getDistinctCompaniesOnPCTCode } from "../../../actions/pctCodeAction";
let companyy = [];
let storage = [];
let pr = [];
let code = "";
let barcodeProduct = "";
let type = "";
let companyProduct = "";
let pro = [];
const SellProductPage = () => {
  const [Products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [producttName, setProducttName] = useState();
  const [productCode, setProductCode] = useState();
  // const [productType, setProductType] = useState();
  const [prodCompany, setProdCompany] = useState();
  const [productTypee, setProductTypee] = useState([]);
  const [productLoc, setProductLoc] = useState("");
  const [selectedShop, setSelectedShop] = useState();
  const [selectedGodown, setSelectedGodown] = useState();
  const [loc, setLoc] = useState("Hello");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(true);
  const {
    quantity,
    setQuantity,

    Code,
    setCode,
    Namee,
    setNamee,
    Company,
    setCompany,
    Color,
    setColor,
    ActualPrice,
    setActualPrice,
    CurrentPrice,
    setCurrentPrice,
    Quantity,
    setQuantitye,
    selectedSaleItem,
    setSelectedSaleItem,
    quantityidset,
    setQuantityidset,
    locationsetid,
    setLocationsetid,
    excludeTaxPrice,
    setExcludeTaxPrice,
    setTaxPercentage,
    sellExpenses,
    setSellExpenses,
    barcodeDisplay,
    setBarcodeDisplay,
    setBarcode,
    productColor,
    setProductColor,
    getTempSale,
    setGetTempSale,
    itemsAdded,convertedTax, setConvertedTax,
    setItemsAdded,
    MRP, setMRP,
    shopIdForData,purchasePrice, setPurchasePrice,purchaseInvoicePrice, setPurchaseInvoicePrice,
    setShopIdForData, isFirstTime, setIsFirstTime,minimumSalePrice, setMinimumSalePrice,salesmanSalePrice, setSalesmanSalePrice
  } = useContext(Statee);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [colorTheme, setColorTheme] = useState("theme-white");
  const { data, setData } = useCustomState();
  const { productLocation } = useSelector((state) => state.productLocation);
  const { company } = useSelector((state) => state.company);
  const { productType } = useSelector((state) => state.productType);
  const { data: productsData, isLoading, error } = useProductOnShop(shopIdForData);
  const navigate = useNavigate();
  useEffect(() => {
    // getProduct();
  }, [Namee]);


  useEffect(()=>{
    dispatch(getDistinctCompaniesOnPCTCode());
    dispatch(getProductType());
  }, [])

  useEffect(()=>{
    if(productsData?.length > 0)
    {
      console.log(productsData)
      setData(productsData);
            setProducts(productsData);
            setFilteredProducts(productsData);
            setLoading(true);
    }else if(!isLoading){
      setLoading(true);
    }
  }, [productsData, isLoading])
  useEffect(() => {
    setIsFirstTime(false)
    const currentThemeColor = localStorage.getItem("theme-color");
    if (currentThemeColor) {
      setColorTheme(currentThemeColor);
    }
  }, [colorTheme]);

  useEffect(() => {
    setItemsAdded(true);
    getTempTransfer();
  }, []);
  const getTempTransfer = async () => {
    let tempProductResult = await getTemporarySale();
    setGetTempSale(tempProductResult);
    console.log(tempProductResult);
  };

  // const getProduct = async () => {
  //   pro = await getProductLocationOnShopId(shopIdForData);
  //   console.log(pro);
  //   if(pro?.length > 0 )
  //     {
  //       setData(pro);
  //       setProducts(pro);
  //       setFilteredProducts(pro);
  //       setLoading(true);
  //     }
  
  // };

  const sellproduct = async (id) => {
    // console.warn("called");
    // console.warn(id);
    setSelectedSaleItem((prevSelectedSaleItems) => [
      ...prevSelectedSaleItems,
      id,
    ]);
    
    console.log(id);
    let data = await getProductLocationOnId(id);

    console.log(data);
    setBarcode(data?.data?.barcode)
    setNamee(data?.data?.product?.productTypeName?.productName);
    setCode(data?.data?.product?.productCode);
    setCompany(data?.data?.product?.productCompany?.companyName);
    setColor(data?.data?.colorId?.colorName);
    setProductColor(data?.data?.colorId?._id);
    // setActualPrice(data.product?.productActualPrice);
    setCurrentPrice(data?.data?.product?.productCurrentPrice);
    setExcludeTaxPrice(data?.data?.product?.productpriceExcludingTax);
    setMRP(data?.data?.product?.productpriceExcludingTax)
    setTaxPercentage(data?.data?.product?.productTaxPrice);
    setSellExpenses(data?.data?.product?.productExpenses);
    setPurchaseInvoicePrice(data?.data?.product?.invoicePrice)
    // setExcludeTaxPrice(Math.floor(data.product?.productCurrentPrice / 1.18));
    setSalesmanSalePrice(data?.data?.product?.salesmanSalePrice)
    setMinimumSalePrice(data?.data?.product?.minimumSalePrice)
    setPurchasePrice(data?.data?.product?.purchasePrice)
    setQuantitye(data?.data?.productQuantity);
    setQuantityidset(data?.data?.product?._id);
    setLocationsetid(data?.data?.shopAvalibility?._id);
    setShopIdForData(data?.data?.shopAvalibility?._id);
    setBarcodeDisplay("");
    setLoc("Hec this is new");
    navigate("/discountmodel");
  };
  // console.log(loc);

  const handleSearch = async (code, type, companyProduct) => {
    console.log(pro);
    const dataa = await LocationSearch(
      productsData,
      selectedShop,
      selectedGodown,
      code,
      type,
      companyProduct
    );
    setData(dataa);
  };

  const columns = [
    { field: "product.productName", label: t("productName") },
    { field: "product.productCode", label: t("code") },
    { field: "product.productTypeName.productName", label: t("type") },
    { field: "product.productCompany.companyName", label: t("company") },
    { field: "colorId.colorName", label: t("color") },
    { field: "product.productpriceExcludingTax", label: t("price") },
    { field: "productQuantity", label: t("quantity") },
    { field: "shopAvalibility.shopCode", label: t("location") },
    { field: "shopAvalibility.shopAddress", label: t("address") },
  ];
  const actions = [
    {
      label: "Sale",
      labeladded: "Sold",
      color: "green",
      handler: (itemId) => sellproduct(itemId),
      url: null,
    },
  ];
  return (
    <>
      <div className={`Sale ${colorTheme}`}>
      <div className="secondContainer">
        {loading ? (
          <>
            <div className="purchaseProduct-box">
              <Button
                onClick={() => {
                  navigate("/saleproduct", {state: '/saleproductpage'});
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
                  setProductTypee(e.target.value);
                  handleSearch(code, type, companyProduct);
                }}
              />
              <input
                type="text"
                name="Company"
                placeholder={t("enterProdCompany")}
                autoComplete="off"
                value={prodCompany}
                onChange={(e) => {
                  companyProduct = e.target.value;
                  setProdCompany(e.target.value);
                  handleSearch(code, type, companyProduct);
                }}
              />
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
                // <Loader active>Loading</Loader>
              )}
            </div>
          </>
        ) : (
          <div className="loaderPage">
             <PageLoader />
            {/* <Loader active>Loading</Loader> */}
          </div>
        )}
      </div> </div>
    </>
  );
};

export default SellProductPage;
