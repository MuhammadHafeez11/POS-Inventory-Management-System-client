import React, { useContext, useEffect, useState } from "react";
import MetaData from "../../../../MetaData";
import { useTranslation, initReactI18next } from "react-i18next";
import {  useNavigate } from "react-router-dom";
import TableUser from "../TableUser/PCTCodesTable";
import { tableState } from "../../../../Components/tableComponent/tableContext";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { refreshTokken } from "../../../../actions/userAction";
import TableToExcel from "../../../../Components/tableComponent/tableToExcelTable";
import { getPermissionForRoles } from "../../../user/rolesAssigned/RolesPermissionValidation";
import { getCompany } from "../../../../actions/companyAction";
import { getProductType } from "../../../../actions/productTypeAction";
let isCalled = "false";
const RecordPCT = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const { t, i18n } = useTranslation();
  const { rowCount, setRowCount } = useContext(tableState);
  const [colorTheme, setColorTheme] = useState("theme-white");
  // const { loading, color } = useSelector((state) => state.color);
  const [addPCTPermission, setAddPCTPermission] = useState(false);
  const [viewPCTPermimssion, setViewPCTPermimssion] = useState(false);
  // const [downloadXLS, setDownloadXLS] = useState(false);

  useEffect(() => {
    setAddPCTPermission(false);
    setViewPCTPermimssion(false);
    // setDownloadXLS(false);
    getPermission();
  }, []);
  async function getPermission() {
    try {
      const permissionForAdd = await getPermissionForRoles("Add PCTCode");
      setAddPCTPermission(permissionForAdd);
      const permissionView = await getPermissionForRoles("View PCTCode");
      console.log(permissionView);
      setViewPCTPermimssion(permissionView);
      // const permissionXLS = await getPermissionForRoles("download Record XLS");
      // console.log(permissionXLS);
      // setDownloadXLS(permissionXLS);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  useEffect(() => {
    const currentThemeColor = localStorage.getItem("theme-color");
    if (currentThemeColor) {
      setColorTheme(currentThemeColor);
    }
  }, [colorTheme]);

  useEffect(()=>{
    dispatch(getCompany());
    dispatch(getProductType());
  }, [])

  useEffect(() => {
    isCalled = "false";
  }, [isCalled]);

  useEffect(() => {
    if (isCalled === "false") {
      isCalled = "true";
      getToken();
    }
  }, [isCalled]);


  const getToken = async () => {
    const token = await refreshTokken();
    if (token.data === "Please login to acces this resource") {
      navigate("/login");
    }
    console.log(token);
  };

  useEffect(() => {
    isCalled = "false";
    let currentLang = localStorage.getItem("lang");
    i18n.changeLanguage(currentLang);
  }, []);


  return (
    <>
      <MetaData title="QE ~~PCTCodes" />
      <div className={`Color ${colorTheme}`}>
      <div className="secondContainer">
        {viewPCTPermimssion && (
          <>
            <div className="contentt-box">
              <div className="heading-container">
                <h3>{t("PCTCodes")}</h3>
                <h5>
                  <span className="total-records">
                    {t("totalRecords")}&nbsp;&nbsp;
                    <EventAvailableIcon fontSize="small" />
                  </span>
                  <span className="rowCount">{rowCount}</span>
                </h5>
              </div>
              <div className="excelDiv">
                 
                {addPCTPermission && (
                  <Button
                    className="button-styled" /* Apply the CSS class to the button */
                    variant="outlined"
                    color="error"
                    endIcon={<AddOutlinedIcon fontSize="small" color="error" />}
                    onClick={() => {
                      navigate("/addPCT", {state: '/PCTCodes'});
                    }}
                  >
                    {t("add-pctcode",)}
                  </Button>
                )}
              </div>
            </div>
            <TableUser />
          </>
        )}
         </div>
      </div>
    </>
  );
};

export default RecordPCT;
