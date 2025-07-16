import React, { useContext, useEffect, useState } from "react";
import MetaData from "../../../../MetaData";
import {  useNavigate } from "react-router-dom";
import TableUser from "../TableUser/TableUser";
import { useTranslation } from "react-i18next";
import { tableState } from "../../../../Components/tableComponent/tableContext";

/////**** Material Ui */
import { useSelector, useDispatch } from "react-redux";
import { Button,  } from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { getPermissionForRoles } from "../../../user/rolesAssigned/RolesPermissionValidation";
import TableToExcel from "../../../../Components/tableComponent/tableToExcelTable";
import { getProductLocation } from "../../../../actions/productLocationAction";
import { getCompany } from "../../../../actions/companyAction";
import { getProductType } from "../../../../actions/productTypeAction";
import { getColor } from "../../../../actions/colorAction";
import { getStorage } from "../../../../actions/storageAction";
import { getProductt } from "../../../../actions/productActions";

let isCalled = "false";
const App = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { rowCount, setRowCount } = useContext(tableState);
  const [colorTheme, setColorTheme] = useState("theme-white");
  const [viewProductPermission, setViewProductPermission] = useState(false);
  const [permissionForAddProduct, setPermissionForAddProduct] = useState(false);
  const [downloadXLS, setDownloadXLS] = useState(false);
  const dispatch = useDispatch();
  const [dataLoading, setDataLoading] = useState(true)
  const { products, productLoading } = useSelector((state) => state.products);
  const { isAuthenticated, loading, user } = useSelector((state) => state.user);
  

  useEffect(() => {
    console.log(isCalled);
    if (isCalled === "false") {
      console.log("hfie");
      isCalled = "true";
      getToken();
    }
  }, [isCalled]);
  const getToken = async () => {
 
  };

  useEffect(()=>{
    dispatch(getProductLocation());
    dispatch(getCompany());
    dispatch(getProductType());
    dispatch(getColor());
    dispatch(getStorage());
    dispatch(getProductt());
  }, [])

  useEffect(()=>{
    setDataLoading(false)
  }, [productLoading])
  useEffect(() => {
    const currentThemeColor = localStorage.getItem("theme-color");
    if (currentThemeColor) {
      setColorTheme(currentThemeColor);
    }
  }, [colorTheme]);

  useEffect(() => {
    setViewProductPermission(false);
    setPermissionForAddProduct(false);
    setDownloadXLS(false);
    getPermission();
  }, []);
  useEffect(() => {
    isCalled = "false";

    let currentLang = localStorage.getItem("lang");
    i18n.changeLanguage(currentLang);
    console.log(isAuthenticated);
  }, [loading, rowCount]);

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

  const column1 = [
    { field: "_id", label: "_id" },
    { field: "productName", label: "productName" },
    { field: "productCode", label: "productCode" },
    { field: "productTypeName._id", label: "productTypeName" },
    { field: "productCompany._id", label: "productCompany" },
    { field: "productpriceExcludingTax", label: "productpriceExcludingTax" },
    { field: "barcodeValue", label: "barcodeValue" },
    { field: "productCurrentPrice", label: "productCurrentPrice" },
    { field: "productExpenses", label: "productExpenses" },
    { field: "productDiscount", label: "productDiscount" },
    { field: "productTaxPrice", label: "productTaxPrice" },
  ];


  return (
    <>
      <MetaData title="QE ~~Products" />
      <div className={`Product ${colorTheme}`}>
      <div className="secondContainer">
      <div className="contentt-box">
                <div className="heading-container">
                  <h3>{t("products")}</h3>
                  <h5>
                    <span className="total-records">
                      {t("totalRecords")}&nbsp;&nbsp;
                      <EventAvailableIcon fontSize="small" />
                    </span>
                    <span className="rowCount">{rowCount}</span>
                  </h5>
                </div>
                <div className="excelDiv">
                  {products?.length > 0 && downloadXLS && (
                    <>
                      <TableToExcel
                        className="button-styled"
                        data={products}
                        columns={column1}
                      />
                    </>
                  )}
                  {permissionForAddProduct && (
                    <Button
                      className="button-styled"
                      variant="outlined"
                      endIcon={<AddOutlinedIcon fontSize="small" color="error" />}
                      onClick={() => {
                        navigate("/additem");
                      }}
                    >
                      {t("addItem")}
                    </Button>
                  )}
                </div>
              </div>
              <TableUser />
      </div>
      </div>
      
    </>
  );
};

export default App;
