import React, { useState, useEffect } from "react";
import MetaData from "../MetaData";
import { useNavigate } from "react-router-dom";
import { getPermissionForRoles } from "../Pages/user/rolesAssigned/RolesPermissionValidation";
import Sidebar from "./SettingSidebar/SettingsSideBar";
import RolesTable from "../Pages/user/roles/RolesTable";
import UpdateProfileUser from "../features/users/updateProfileUser";
import { useTranslation } from "react-i18next";
import SubscriptionTable from "./SubscriptionComponent/SubscriptionTable";
import AboutUs from "./AboutUs/AboutUs";
import AllSettingPage from "./SystemSettingPage/AllSettingPage";

const SettingMainPage = () => {
  const navigate = useNavigate();
  const [colorTheme, setColorTheme] = useState("theme-white");
  const [rolePermission, setRolePermission] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState(null);
  const { t, i18n } = useTranslation();
  useEffect(() => {
    setRolePermission(false);
    getPermission();
  }, []);
  async function getPermission() {
    try {
      const permissionForAdd = await getPermissionForRoles("View Roles");
      setRolePermission(permissionForAdd);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  useEffect(() => {
    const currentThemeColor = localStorage.getItem("theme-color");
    console.log(localStorage.getItem("theme-color"));
    if (currentThemeColor) {
      setColorTheme(currentThemeColor);
      document.body.className = currentThemeColor;
    }
  }, [colorTheme]);

  // const handleClickPrinter = async () => {
  //   navigate("/printerSettings");
  // };
  // const handleClickUserProfile = async () => {
  //   navigate("/updateUserProfile");
  // };
  // const handleUserPermission = async () => {
  //   navigate("/RolesTable");
  // };
  // const handleClickTheme = async () => {
  //   navigate("/darkModeSetting");
  // };

  // const handleClickTableSetting = async () => {
  //   navigate("/tablePageSetting");
  // };

  // const handleClickLanguageSetting = async () => {
  //   navigate("/changeLanguageSetting");
  // };
  // const handleClickSystemSetting = async () => {
  //   navigate("/systemSetting");
  // };

  const handleSidebarItemClick = (settingName) => {
    // console.log(settingName)
    setSelectedSetting(settingName);
  };

  const renderSelectedSettingComponent = () => {
    switch (selectedSetting) {
      case 'System Settings':
        return <AllSettingPage />;
      // case 'Themes':
      //   return <DarkMode />;
      case 'Permissions':
        return <RolesTable />;
      // case 'Change Table Settings':
      //   return <TableSettingPage />;
      case 'Change Password':
        return <UpdateProfileUser />;
      // case 'Printers':
      //   return <PrinterSettingPage />;
      case 'Subscription':
          return <SubscriptionTable />;
      case 'About Us':
            return <AboutUs />;
      // Add other cases for different settings
      default:
        return <AllSettingPage />;
    }
  };

  return (
    <>
      <MetaData title="QE ~~Settings" />
      <div className={`Setting ${colorTheme}`}>
        <div className="settingGlass">
          <Sidebar onSidebarItemClick={handleSidebarItemClick}/>
          {renderSelectedSettingComponent()}
        </div>
      </div>
      </>
  );
};

export default SettingMainPage;