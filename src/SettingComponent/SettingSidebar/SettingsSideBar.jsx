import React, { useState } from "react";
import { UilSignOutAlt } from "@iconscout/react-unicons";
// import { SidebarData } from "../Data/Data";
import { UilBars } from "@iconscout/react-unicons";
import { motion } from "framer-motion";
import { SidebarData } from "./SettingSidebarData";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
const Sidebar = ({ onSidebarItemClick }) => {
  const [selected, setSelected] = useState(0);
  const navigate = useNavigate()
  const [expanded, setExpaned] = useState(true)
  const { t, i18n } = useTranslation();
  const sidebarVariants = {
    true: {
      left : '0'
    },
    false:{
      left : '-60%'
    }
  }
const Back =()=>{
  navigate("/dashboard")
}
  console.log(window.innerWidth)
  return (
    <>
      {/* <div className="bars" style={expanded?{left: '60%'}:{left: '5%'}} onClick={()=>setExpaned(!expanded)}>
        <UilBars />
      </div> */}
    <motion.div className='SettingSidebar'
    variants={sidebarVariants}
    animate={window.innerWidth<=768?`${expanded}`:''}
    >
   
      <div className="logoSettings">
        {/* <img src={Logo} alt="logo" /> */}
        <span>
          {t("settings")}
        </span>
      </div>

      <div className="settingMenu">
        {SidebarData.map((item, index) => {
          return (
            <div
              className={selected === index ? "menuItem active" : "menuItem"}
              key={index}
              onClick={() =>{ setSelected(index)
                onSidebarItemClick(item.heading)}}
            >
              <item.icon />
              <span key={item.heading} onClick={() => onSidebarItemClick(item.heading)}>{t(`${item.heading}`)}</span>
            </div>
          );
        })}
      
        <div className="menuItem" >
          {/* <UilSignOutAlt /> */}
        </div>
      </div>
    </motion.div>
    </>
  );
};

export default Sidebar;