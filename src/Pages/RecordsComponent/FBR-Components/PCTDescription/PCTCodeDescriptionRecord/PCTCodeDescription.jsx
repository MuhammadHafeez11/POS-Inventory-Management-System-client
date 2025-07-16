import React, { useContext, useEffect, useState, useTransition } from "react";
import { useTranslation } from "react-i18next";
import {  useNavigate } from "react-router-dom";
import MetaData from "../../../../../MetaData";
import TableUser from "../PCTCodeDescriptionTable/PCTCodeDescription";
import { tableState } from "../../../../../Components/tableComponent/tableContext";
import { useSelector } from "react-redux";
import { Button } from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { refreshTokken } from "../../../../../actions/userAction";
import TableToExcel from "../../../../../Components/tableComponent/tableToExcelTable";
import { getPermissionForRoles } from "../../../../user/rolesAssigned/RolesPermissionValidation";
import PCTCodeDescriptionTable from "../PCTCodeDescriptionTable/PCTCodeDescription";

let isCalled = "false";
const PCTCodeDescriptionRecord = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { rowCount, setRowCount } = useContext(tableState);
  const [colorTheme, setColorTheme] = useState("theme-white");
  const { pctCodeDescriptionloading, pctCodeDescription } = useSelector((state) => state.pctCodeDescription);
  const [viewCompanyPermission, setViewCompanyPermission] = useState(false);
  const [addCompanyPermission, setAddCompanyPermission] = useState(false);
  const [downloadXLS, setDownloadXLS] = useState(false);

  useEffect(() => {
    setViewCompanyPermission(false);
    setAddCompanyPermission(false);
    setDownloadXLS(false);
    getPermission();
  }, []);
  async function getPermission() {
    try {
      const permissionForAdd = await getPermissionForRoles("Add Company");
      setAddCompanyPermission(permissionForAdd);
      const permission = await getPermissionForRoles("View Company");
      console.log(permission);
      setViewCompanyPermission(permission);
      const permissionXLS = await getPermissionForRoles("download Record XLS");
      console.log(permissionXLS);
      setDownloadXLS(permissionXLS);
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
  useEffect(() => {
    isCalled = "false";
  }, [isCalled, pctCodeDescription]);

  useEffect(() => {
    console.log(isCalled);
    if (isCalled === "false") {
      console.log("hfie");
      isCalled = "true";
      getToken();
    }
  }, [isCalled, pctCodeDescription]);
  const getToken = async () => {
    const token = await refreshTokken();
    if (token.data === "Please login to acces this resource") {
      navigate("/login");
    }
  };

  useEffect(() => {
    isCalled = "false";
    let currentLang = localStorage.getItem("lang");
    i18n.changeLanguage(currentLang);
  }, []);

  const column1 = [
    { field: "_id", label: "_id" },
    { field: "companyName", label: "companyName" },
    { field: "address", label: "address" },
  ];
  return (
    <>
      <MetaData title="QE ~~Company" />
      <div className={`Company ${colorTheme}`}>
      <div className="secondContainer">
        {viewCompanyPermission && (
          <>
            <div className="contentt-box">
              <div className="heading-container">
                <h3> {t("pctCodeDescription")}</h3>
                <h5>
                  <span className="total-records">
                    {t("totalRecords")}&nbsp;&nbsp;
                    <EventAvailableIcon fontSize="small" />
                  </span>
                  <span className="rowCount">{rowCount}</span>
                </h5>
              </div>
              <div className="excelDiv">
                {/* {company !== "No Record Found" && company?.length > 0 && downloadXLS && (
                  <>
                    <TableToExcel
                      className="button-styled"
                      data={company}
                      columns={column1}
                    />
                  </>
                )} */}
                {addCompanyPermission && (
                  <Button
                    className="button-styled" /* Apply the CSS class to the button */
                    variant="outlined"
                    color="error"
                    endIcon={<AddOutlinedIcon fontSize="small" color="error" />}
                    onClick={() => {
                      navigate("/FBR-addPCTDescription", {state: "/FBR-PCTDescription"});
                    }}
                  >
                    {t("add-Description")}
                  </Button>
                )}
              </div>
            </div>
            <PCTCodeDescriptionTable />
          </>
        )}
          </div>
      </div>
    </>
  );
};

export default PCTCodeDescriptionRecord;
