import React, { useContext, useEffect, useState } from "react";
import MetaData from "../../../MetaData";
import { useTranslation, initReactI18next } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import TransferTable from "./TransferTable";
import { tableState } from "../../../Components/tableComponent/tableContext";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { getPermissionForRoles } from "../../../Pages/user/rolesAssigned/RolesPermissionValidation";

import { refreshTokken } from "../../../actions/userAction";

let isCalled = "false";
const RecordTempTransfer = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { rowCount, setRowCount } = useContext(tableState);
  const [pendingTransferPermission, setPendingTransferPermission] =
    useState(false);
  const [colorTheme, setColorTheme] = useState("theme-white");

  useEffect(() => {
    setPendingTransferPermission(false);
    getPermission();
  }, []);
  async function getPermission() {
    try {
      const permissionForAdd = await getPermissionForRoles(
        "View Pending Transfer"
      );
      setPendingTransferPermission(permissionForAdd);
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

  useEffect(() => {
    isCalled = "false";
    let currentLang = localStorage.getItem("lang");
    i18n.changeLanguage(currentLang);
  }, []);
  return (
    <>
      <MetaData title="QE ~~TransferPendings" />
      <div className={`Transfer ${colorTheme}`}>
      <div className="secondContainer">
        {pendingTransferPermission && (
          <>
            <div className="contentt-box">
              <div className="heading-container">
                <h3> {t("transferPendings")}</h3>
                <h5>
                  <span className="total-records">
                    {t("totalRecords")}&nbsp;&nbsp;
                    <EventAvailableIcon fontSize="small" />
                  </span>
                  <span className="rowCount">{rowCount}</span>
                </h5>
              </div>
            </div>
            <TransferTable />
          </>
        )}
      </div>
      </div>
    </>
  );
};

export default RecordTempTransfer;
