import React, { useContext, useEffect, useState } from "react";
import MetaData from "../../../../MetaData";
import { useTranslation, initReactI18next } from "react-i18next";
import {  useNavigate } from "react-router-dom";
import TableUser from "../TableUser/TableUserColor";
import { tableState } from "../../../../Components/tableComponent/tableContext";
import { useSelector } from "react-redux";
import { Button } from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { refreshTokken } from "../../../../actions/userAction";
import TableToExcel from "../../../../Components/tableComponent/tableToExcelTable";
import { getPermissionForRoles } from "../../../user/rolesAssigned/RolesPermissionValidation";
let isCalled = "false";
const RecordColor = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { rowCount, setRowCount } = useContext(tableState);
  const [colorTheme, setColorTheme] = useState("theme-white");
  const { loading, color } = useSelector((state) => state.color);
  const [addColorPermission, setAddColorPermission] = useState(false);
  const [viewColorPermimssion, setViewColorPermimssion] = useState(false);
  const [downloadXLS, setDownloadXLS] = useState(false);

  useEffect(() => {
    setAddColorPermission(false);
    setViewColorPermimssion(false);
    setDownloadXLS(false);
    getPermission();
  }, []);
  async function getPermission() {
    try {
      const permissionForAdd = await getPermissionForRoles("Add Color");
      setAddColorPermission(permissionForAdd);
      const permissionView = await getPermissionForRoles("View Color");
      console.log(permissionView);
      setViewColorPermimssion(permissionView);
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
  }, [isCalled, color]);

  useEffect(() => {
    if (isCalled === "false") {
      isCalled = "true";
      getToken();
    }
  }, [isCalled, color]);
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

  const column1 = [
    { field: "_id", label: "_id" },
    { field: "colorName", label: "colorName" },
    { field: "colorDescription", label: "colorDescription" },
  ];
  return (
    <>
      <MetaData title="QE ~~Colors" />
      <div className={`Color ${colorTheme}`}>
      <div className="secondContainer">
        {viewColorPermimssion && (
          <>
            <div className="contentt-box">
              <div className="heading-container">
                <h3>{t("colors")}</h3>
                <h5>
                  <span className="total-records">
                    {t("totalRecords")}&nbsp;&nbsp;
                    <EventAvailableIcon fontSize="small" />
                  </span>
                  <span className="rowCount">{rowCount}</span>
                </h5>
              </div>
              <div className="excelDiv">
                  {color?.length > 0 && downloadXLS && (
                    <>
                      <TableToExcel
                        className="button-styled"
                        data={color}
                        columns={column1}
                      />
                    </>
                  )}
                {addColorPermission && (
                  <Button
                    className="button-styled" /* Apply the CSS class to the button */
                    variant="outlined"
                    color="error"
                    endIcon={<AddOutlinedIcon fontSize="small" color="error" />}
                    onClick={() => {
                      navigate("/addcolor", {state: '/color'});
                    }}
                  >
                    {t("add-color",)}
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

export default RecordColor;
