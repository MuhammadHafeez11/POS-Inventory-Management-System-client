import React, { useContext, useEffect, useState } from "react";
import { Loader } from "semantic-ui-react";
import AddIcon from "@mui/icons-material/Add";
// import style from "./rolesStyle.css";
import { Link, useNavigate } from "react-router-dom";
import { Modal, Button, Box, Typography } from "@mui/material";
// import { tableState } from "../../../Components/tableComponent/tableContext";
import { tableState } from "../../Components/tableComponent/tableContext";
import { getRole } from "../../actions/roleAction";
import { getAssignRolesByIdAndNames } from "../../actions/assignTaskAction";
import TableComponentId from "../../Components/tableComponent/tableComponentId";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation, initReactI18next } from "react-i18next";
// import NewRole from "./NewRole";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { getSubscriptionDetails, getSubscriptionsDisplay } from "../../actions/subscriptionAction";
// import { format } from "path";
const action7 = "change Permission";
const SubscriptionTable = () => {
  //General UseStates
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const [roleData, setRoleData] = useState([]);
  const [permission, setPermission] = useState(false);
  const [open, setOpen] = useState(false);
  const [colorTheme, setColorTheme] = useState("theme-white");
  const { loading, role } = useSelector((state) => state.role);
  const { assignTask } = useSelector((state) => state.assignTask);
  const { subscriptionDetail} = useSelector((state) => state.subscriptionDetail);
  const { subscriptionsDisplay } = useSelector((state) => state.subscriptionsDisplay);
  const { rowCount, setRowCount } = useContext(tableState);

  useEffect(() => {
    const currentThemeColor = localStorage.getItem("theme-color");
    if (currentThemeColor) {
      setColorTheme(currentThemeColor);
    }
  }, [colorTheme]);


  useEffect(() => {
  console.log(subscriptionDetail);
  
    getPermission();
  }, []);


  useEffect(() => {
    if (loading === false) {
      const roles = role?.filter((role) => role.roleName !== "superAdmin");
      setRoleData(roles);
      // setRoleData(role);
    }
  }, [loading]);

  async function call() {
    try {
    dispatch(getSubscriptionsDisplay())
    dispatch(getRole());
    } catch (err) {}
  }

  async function getPermission() {
    try {
      console.log(JSON.parse(localStorage.getItem("userRoleId")));
      dispatch(
        getAssignRolesByIdAndNames(
          JSON.parse(localStorage.getItem("userRoleId")),
          "View Subscription"
        )
      );

      //call to view All roles
      call();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const handleClose = () => {
    setOpen(!open);
  };

  const columns = [
    { field: "softwareOwner", label: t("Owner") },
    { field: "packagePlan", label: t("Package Plan") },
    { field: "subscriptionDate", label: t("Subscription Date"), format: "date" },
    { field: "expiryDate", label: t("Expiry Date"), format: "date" },
    { field: "status", label: t("Status") },
  ];

  const actionsForVerifiedUser = [
    {
      label: "change Permission",
      color: "white",
    },
  ];

  return (
    <>
    <div className={`Permission ${colorTheme}`}>
    {!loading ? (<>{assignTask ? (<>
      <div className="settingSecondContainer">
      <div className="contentt-box">
      </div>
      <div className="search-box">
      </div>
      <div className="table-container">
          {JSON.parse(localStorage.getItem("isSuperAdmin")) ? (
            <TableComponentId
            data={subscriptionsDisplay}
            columns={columns}
          />
          ) : (
            <TableComponentId data={subscriptionsDisplay} columns={columns} />
          )}
        </div>
      </div>
           </>
    ) : (<><p>Not allowed By Admin</p></>)}</>) : 
    (<>
          <Loader>Loading</Loader>
       </>
    )
  }
    </div>
    </>
  );
};

export default SubscriptionTable;
