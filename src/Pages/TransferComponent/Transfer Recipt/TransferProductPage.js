import React, { useContext, useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Statte } from "./context/stateContext";
import {
  Button,
} from "semantic-ui-react";
import { useSelector, useDispatch } from "react-redux";
import TableComponentId from "../../../Components/tableComponent/tableComponentId";
import { useCustomState } from "../../../Variables/stateVariables";
import { useTranslation } from "react-i18next";
import { getTemporaryTransfer } from "../../../actions/tempTransferAction";
import {
  getProductLocation,
  getProductLocationOnGodownId,
  getProductLocationOnId,
  getProductLocationOnShopId,
} from "../../../actions/productLocationAction";
import { LocationSearch } from "../../../Components/searchComponent/productLocationSearch/locationSearch";
import PageLoader from "../../../Components/Loader/PageLoader"
let pr = [];
let type = "";
let code = "";
let companyProduct = "";
const SellProductPage = () => {
  const [Products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [producttName, setProducttName] = useState();
  const [productCode, setProductCode] = useState();
  const [producttType, setProducttType] = useState();
  const [prodCompany, setProdCompany] = useState();
  const [selectedShop, setSelectedShop] = useState();
  const [selectedGodown, setSelectedGodown] = useState();
  // const [productTypee, setproductTypee] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [open, setOpen] = useState(true);
  const { data, setData } = useCustomState();
  const {
    quantity,
    setQuantity,
    transferFrom,
    setTransferFrom,
    transferTo,
    setTransferTo,
    quantityidset,
    setQuantityidset,
    locationsetid,
    setLocationsetid,
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

    itemsAdded,
    setItemsAdded,
    selectedItems,
    setSelectedItems,
    tempProductId,
    setTempProductId,
    tempProductAvailibilityId,
    setTempProductAvailibilityId,
    tempProductQuantity,
    setTempProductQuantity,
    getTempTransferData,
    setGetTempTransferData,
    selectedRadioOption,
    setSelectedRadioOption,
    transferShopId,
    setTransferShopId,
    transferGodownId,
    setTransferGodownId,
    productColor,
    setProductColor,
    transferToShopId,
    setTransferToShopId,
    transferToGodownId,
    setTransferToGodownId,
  } = useContext(Statte);
  const dispatch = useDispatch();
  const [colorTheme, setColorTheme] = useState("theme-white");
  const { company } = useSelector((state) => state.company);
  const { productType } = useSelector((state) => state.productType);
  const { productLocation } = useSelector((state) => state.productLocation);
  const navigate = useNavigate();
  useEffect(() => {
    console.log(locationsetid);
    getProduct();
    dispatch(getProductLocation());
    // getCompany();
    // getStorage();
    // getProductTypee();
    // getCompanyy();

    // console.log("vlaue in useeffect " + Namee);
  }, [Namee]);

  useEffect(() => {
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
    let tempProductResult = await getTemporaryTransfer();
    // let tempProductResult= await GetTempTransfer();
    setGetTempTransferData(tempProductResult);
    console.log(tempProductResult);
  };

  const getProduct = async () => {
    console.log(transferShopId);
    console.log(transferGodownId);
    if (transferShopId) {
      pr = await getProductLocationOnShopId(transferShopId);
    } else {
      if (transferGodownId) {
        pr = await getProductLocationOnGodownId(transferGodownId);
      }
    }
    console.log(pr);
    setData(pr);
    setProducts(pr);
    setFilteredProducts(pr);
    setLoading(true);
  };

  const sellproduct = async (id) => {
    setSelectedSaleItem((prevSelectedSaleItems) => [
      ...prevSelectedSaleItems,
      id,
    ]);
    console.log(id)
    let data = await getProductLocationOnId(id);

    console.log(data);
    console.log(data?.data?.product?._id);
    console.log(data?.data?.productAvalibility?._id);
    console.log(data?.data?.productQuantity);
    setTempProductId(data?.data?.product?._id);
    setTempProductAvailibilityId(data?.data?.productAvalibility?._id);
    setNamee(data?.data?.product?.productTypeName?.productName);
    setCode(data?.data?.product?.productCode);
    setCompany(data?.data?.product?.productCompany?.companyName);
    // setColor(data?.product?.productColor?.colorName);
    setColor(data?.data?.colorId?.colorName);
    setProductColor(data?.data?.colorId?._id);
    setActualPrice(data?.data?.product?.productActualPrice);
    setCurrentPrice(data?.data?.product?.productCurrentPrice);
    setQuantitye(data?.data?.productQuantity);
    setQuantityidset(data?.data?.product?._id);
    navigate("/DiscountModelTransfer");
  };

  const handleSearch = async (code, type, companyProduct) => {
    console.log(pr);
    const dataa = await LocationSearch(
      pr,
      transferShopId,
      transferGodownId,
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
    { field: "productQuantity", label: t("quantity") },
    { field: "godownAvalibility.storageCode", label: t("storage") },
  ];

  const column2 = [
    { field: "product.productName", label: t("productName") },
    { field: "product.productCode", label: t("code") },
    { field: "product.productTypeName.productName", label: t("type") },
    { field: "product.productCompany.companyName", label: t("company") },
    { field: "colorId.colorName", label: t("color") },
    { field: "productQuantity", label: t("quantity") },
    { field: "shopAvalibility.shopCode", label: t("storage") },
  ];
  const actions = [
    {
      label: "transfer",
      labeladded: "Sold",
      color: "green",
      handler: (itemId) => sellproduct(itemId),
      url: null,
    },
  ];
  return (
    <>
      <div className={`Transfer ${colorTheme}`}>
      <div className="secondContainer">
        {loading ? (
          <>
            <div className="transferProduct-box" >
              <Button
                onClick={() => {
                  navigate("/TransferRecordd",{state: '/TranferProductPage'});
                }}
              >
                Back
              </Button>
            </div>
            <div className="search-box">
              <input
                type="text"
                name="productCode"
                style={{
                  flex: 1,
                  padding: "10px",
                  width: "350px",
                  backgroundColor: "#ffffff",
                }}
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
                style={{
                  flex: 1,
                  padding: "10px",
                  width: "350px",
                  backgroundColor: "#ffffff",
                }}
                placeholder={t("enterProdType")}
                autoComplete="off"
                value={producttType}
                onChange={(e) => {
                  type = e.target.value;
                  setProducttType(e.target.value);
                  handleSearch(code, type, companyProduct);
                }}
              />
              <input
                type="text"
                name="Company"
                style={{
                  flex: 1,
                  padding: "10px",
                  width: "350px",
                  backgroundColor: "#ffffff",
                }}
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
              {transferShopId ? (
                <TableComponentId
                  data={data}
                  columns={column2}
                  actions={actions}
                />
              ) : (
                <TableComponentId
                  data={data}
                  columns={columns}
                  actions={actions}
                />
              )}
            </div>
          </>
        ) : (
          <div className="loaderPage">
            <PageLoader />
            {/* <Loader active>Loading</Loader> */}
          </div>
        )}
      </div>
      </div>
    </>
  );
};

export default SellProductPage;
