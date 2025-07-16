import React, { useContext, useEffect, useState } from "react";
import MetaData from "../../../../MetaData";
import Stocktable from "../GodownTable/Stocktable";
import { useTranslation } from "react-i18next";
import {  useNavigate } from "react-router-dom";
import { tableState } from "../../../../Components/tableComponent/tableContext";
import TableToExcel from "../../../../Components/tableComponent/tableToExcelTable";
import { Button } from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { useSelector } from "react-redux";
import { refreshTokken } from "../../../../actions/userAction";
import { getPermissionForRoles } from "../../../user/rolesAssigned/RolesPermissionValidation";

let isCalled = "false";
const App = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { rowCount, setRowCount } = useContext(tableState);
  const { storage } = useSelector((state) => state.storage);
  const [data, setData] = useState();
  const [viewGodownPermission, setViewGodownPermission] = useState(false);
  const [addGodownPermission, setAddGodownPermission] = useState(false);
  const [downloadXLS, setDownloadXLS] = useState(false);
  const [colorTheme, setColorTheme] = useState("theme-white");
  useEffect(() => {
    const currentThemeColor = localStorage.getItem("theme-color");
    if (currentThemeColor) {
      setColorTheme(currentThemeColor);
    }
  }, [colorTheme]);
  useEffect(() => {
    setViewGodownPermission(false);
    setAddGodownPermission(false);
    setDownloadXLS(false);
    getPermission();
  }, []);
  async function getPermission() {
    try {
      const permissionForAdd = await getPermissionForRoles("Add Godown");
      setAddGodownPermission(permissionForAdd);
      const permission = await getPermissionForRoles("View Godown");
      console.log(permission);
      setViewGodownPermission(permission);
      const permissionXLS = await getPermissionForRoles("download Record XLS");
      console.log(permissionXLS);
      setDownloadXLS(permissionXLS);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    isCalled = "false";
  }, [rowCount]);

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
    let currentLang = localStorage.getItem("lang");
    i18n.changeLanguage(currentLang);
  }, []);

  useEffect(() => {
    if (storage) {
      setData(storage);
    }
  });

  const columns = [
    { field: "storageCode", label: t("storageCode") },
    { field: "storageAddress", label: t("storageAddress") },
    { field: "storageDescription", label: t("storageDescription") },
    { field: "shopId.shopCode", label: t("shop") },
    { field: "storageType", label: t("storageType") },
    { field: "storagePhoneNo", label: t("phoneNumber") },
  ];

  return (
    <>
      <MetaData title="QE ~~Godowns" />
      <div className={`wareHouse ${colorTheme}`}>
      <div className="secondContainer">
        {viewGodownPermission && (
          <>
            <div className="contentt-box">
              <div className="heading-container">
                <h3> {t("stockLocation")}</h3>
                <h5>
                  <span className="total-records">
                    {t("totalRecords")}&nbsp;&nbsp;
                    <EventAvailableIcon fontSize="small" />
                  </span>
                  <span className="rowCount">{rowCount}</span>
                </h5>
              </div>
              <div className="excelDiv">
                {data?.length > 0 && downloadXLS && (
                  <>
                    <TableToExcel
                      className="button-styled"
                      data={data}
                      columns={columns}
                    />
                  </>
                )}
                {addGodownPermission && (
                  <Button
                    className="button-styled" /* Apply the CSS class to the button */
                    variant="outlined"
                    color="error"
                    endIcon={<AddOutlinedIcon fontSize="small" color="error" />}
                    onClick={() => {
                      navigate("/stockform");
                    }}
                  >
                    {t("add-location")}
                  </Button>
                )}
              </div>
            </div>
            <Stocktable />
          </>
        )}
      </div>
      </div>
    </>
  );
};

export default App;
