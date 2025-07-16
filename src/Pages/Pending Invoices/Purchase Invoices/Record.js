import React, { useContext, useEffect, useState } from "react";
import MetaData from "../../../MetaData";
import { useTranslation, initReactI18next } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import PurchaseTable from "./PurchaseTable";
import { tableState } from "../../../Components/tableComponent/tableContext";
import { getPermissionForRoles } from "../../../Pages/user/rolesAssigned/RolesPermissionValidation";
import { useDispatch } from "react-redux";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { refreshTokken } from "../../../actions/userAction";
import { getTempPurchase, getTemporaryPurchaseOnShop } from "../../../actions/tempPurchaseAction";

let isCalled = "false";
const RecordTempPurchase = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { rowCount, setRowCount } = useContext(tableState);
  const [colorTheme, setColorTheme] = useState("theme-white");
  const dispatch = useDispatch()
  const [pendingPurchasePermission, setPendingPurchasePermission] =
    useState(false);

  useEffect(() => {
    setPendingPurchasePermission(false);
    getPermission();
  }, []);
  async function getPermission() {
    try {
      const permissionForAdd = await getPermissionForRoles(
        "View Pending Purchase"
      );
      setPendingPurchasePermission(permissionForAdd);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    dispatch(getTempPurchase());
      dispatch(getTemporaryPurchaseOnShop(JSON.parse(localStorage.getItem("shopId"))));
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
      <MetaData title="QE ~~PurchasePendings" />
      <div className={`Purchase ${colorTheme}`}>
      <div className="secondContainer">
        {pendingPurchasePermission && (
          <>
            <div className="contentt-box">
              <div className="heading-container">
                <h3> {t("purchasePendings")}</h3>
                <h5>
                  <span className="total-records">
                    {t("totalRecords")}&nbsp;&nbsp;
                    <EventAvailableIcon fontSize="small" />
                  </span>
                  <span className="rowCount">{rowCount}</span>
                </h5>
              </div>
            </div>
            <PurchaseTable />
          </>
        )}
      </div>
      </div>
    </>
  );
};

export default RecordTempPurchase;
