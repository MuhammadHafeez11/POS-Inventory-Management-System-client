import React, { useContext, useEffect, useState } from "react";
import { Loader } from "semantic-ui-react";
import { Link, useNavigate } from "react-router-dom";
import { tableState } from "../../../Components/tableComponent/tableContext";
import { getRole } from "../../../actions/roleAction";
import { getAssignRolesByIdAndNames } from "../../../actions/assignTaskAction";
import TableComponentId from "../../../Components/tableComponent/tableComponentId";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation, initReactI18next } from "react-i18next";
import NewRole from "./NewRole";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
const action7 = "change Permission";
const RolesTable = () => {
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
  const { rowCount, setRowCount } = useContext(tableState);

  useEffect(() => {
    const currentThemeColor = localStorage.getItem("theme-color");
    if (currentThemeColor) {
      setColorTheme(currentThemeColor);
    }
  }, [colorTheme]);
  useEffect(() => {
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
      dispatch(getRole());
    } catch (err) { }
  }
  async function getPermission() {
    try {
      console.log(JSON.parse(localStorage.getItem("userRoleId")));
      dispatch(
        getAssignRolesByIdAndNames(
          JSON.parse(localStorage.getItem("userRoleId")),
          "View Roles"
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
    { field: "roleName", label: t("roleName") },
    { field: "roleDescription", label: t("roleDescription") },
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
        <div className="settingSecondContainer">
          <div className="search-box">
          </div>

          {!loading ? (<>{assignTask ? (<>


            <div className="table-container">
              {JSON.parse(localStorage.getItem("isSuperAdmin")) ? (
                <TableComponentId
                  data={roleData}
                  columns={columns}
                  actions={actionsForVerifiedUser}
                />
              ) : (
                <TableComponentId data={roleData} columns={columns} />
              )}</div>
          </>
          ) : (<><p>Not allowed By Admin</p></>)}</>) :
            (<>

              <Loader>Loading</Loader>
            </>
            )
          }
        </div>
      </div>
    </>
  );
};

export default RolesTable;