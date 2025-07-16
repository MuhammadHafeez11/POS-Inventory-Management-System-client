import React, { useState, useRef } from "react";
// import "./styles.css";
import Logo from "./logo.svg";
import { Icon } from "./Icon";
import { Button } from "./Button";
import { useLocation, useNavigate } from "react-router-dom";
import images from "./logo.png";
import * as AiIcons from "react-icons/ai";
import * as iconss from "react-icons/fa";
import IconButton from "@mui/material/IconButton";
import { BiTransfer } from "react-icons/bi";
import { FaUserTie } from "react-icons/fa";
import { SiExpensify, SiChakraui } from "react-icons/si";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import MoneyIcon from "@mui/icons-material/Money";
import { BiLogOut } from "react-icons/bi";
import SettingsIcon from "@mui/icons-material/Settings";
import { useDispatch, useSelector } from "react-redux";
// import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {
  HiOutlineCurrencyDollar,
  HiOutlineOfficeBuilding,
} from "react-icons/hi";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { logout, refreshTokken } from "../../../actions/userAction";

import { LOAD_USER_Fail } from "../../../constants/userConstants";
const menuItems = [
  {
    name: `catelog`,
    icon: <AiIcons.AiFillHome className="svgClass" />,
    cName: "nav-text",
    roles: ["Admin", "Salesman", "Stock Manager"],
    permission: "Can View Catelog",
    items: [
      {
        name: "products",
        path: "/Record",
        permission: "View Product",
      },
      {
        name: "Product Location",
        path: "/admin/recordLocation",
        permission: "View Product Location",
      },
      {
        name: "Product Location",
        path: "/administrator/recordLocation",
        permission: "View Administrator Product Location",
      },
      {
        name: "Global Products",
        path: "/globalSearchRecord",
        permission: "View Product",
      },
    ],
  },
  {
    name: `FBR - Record`,
    icon: <AiIcons.AiFillHome className="svgClass" />,
    cName: "nav-text",
    roles: ["Administrator", "superAdmin"],
    permission: "Can View FBR-Menu",
    items: [
      {
        name: "PCTCode",
        path: "/ViewPCTCodes",
        permission: "View PCTCode",
      },
      {
        name: "Company",
        path: "/FBR-Company",
        permission: "View PCTCode",
      },
      {
        name: "PCT Code Description",
        path: "/FBR-pctDescription",
        permission: "View PCTCode",
      },
    ],
  },
  {
    name: `records`,
    icon: <AiIcons.AiFillHome className="svgClass" />,
    cName: "nav-text",
    roles: ["Administrator", "superAdmin", "Stock Manager"],
    permission: "Can View Records",
    items: [
      {
        name: "Color",
        path: "/color",
        permission: "View Color",
      },
      {
        name: "Company",
        path: "/company",
        permission: "View Company",
      },
      {
        name: "PCTCode",
        path: "/ViewPCTCodes",
        permission: "View PCTCode",
      },
      {
        name: "stockLocation",
        path: "/godownrecord",
        permission: "View Godown",
      },
      {
        name: "Shops",
        path: "/shopRecord",
        permission: "View Shop",
      },
      {
        name: "Product Type",
        path: "/recordType",
        permission: "View Product Type",
      },
    ],
  },
  {
    name: "productActivity",
    icon: <HiOutlineCurrencyDollar className="svgClass" />,
    cName: "nav-text",
    roles: ["superAdmin", "Admin", "Salesman", "Stock Manager"],
    permission: "Can View Product Activity",
    items: [
      {
        name: "Purchase Product",
        path: "/PurchaseRecipt",
        permission: "Can Purchase Product",
      },
      {
        name: "Sale Product",
        path: "/saleproduct",
        permission: "Can Sale Product",
      },
      {
        name: "Transfer Product",
        path: "/TransferRecordd",
        permission: "Can Transfer Product",
      },
      {
        name: "Return Product",
        path: "/returnProducts",
        permission: "Return Product",
      },
    ],
  },
  {
    name: "Invoice Approval",
    icon: <HiOutlineCurrencyDollar className="svgClass" />,
    cName: "nav-text",
    roles: ["superAdmin", "Admin", "Salesman", "Stock Manager"],
    permission: "View Purchase Approval",
    items: [
      {
        name: "Purchase Approval",
        path: "/PurchaseApproval",
        permission: "View Purchase Approval",
      },
    ],
  },
  {
    name: "Pendings",
    icon: <HiOutlineCurrencyDollar className="svgClass" />,
    cName: "nav-text",
    roles: ["superAdmin", "Admin", "Salesman", "Stock Manager"],
    permission: "Can View Pendings",
    items: [
      {
        name: "Purchase Pendings",
        path: "/tempPurchasePendings",
        permission: "View Pending Purchase",
      },
      {
        name: "Sale Pendings",
        path: "/tempSalePendings",
        permission: "View Pending Sale",
      },
      {
        name: "Transfer Pendings",
        path: "/tempTransferPendings",
        permission: "View Pending Transfer",
      },
    ],
  },
  {
    name: "Invoices",
    icon: <iconss.FaFileInvoice className="svgClass" />,
    // cName: "nav-text",
    roles: [
      "superAdmin",
      "Admin",
      "Administrator",
      "Salesman",
      "Stock Manager",
    ],
    permission: "Can View Invoices",
    items: [
      {
        name: "Purchase Invoice",
        path: "/purchaseRecord",
        permission: "View Purchase Invoice",
      },
      {
        name: "Sales Invoice",
        path: "/Salerecord",
        permission: "View Sale Invoice",
      },
      {
        name: "Return",
        path: "/returnInvoice",
        permission: "Return Invoice",
      },
      {
        name: "Transfer Invoice",
        path: "/TranferPreview",
        permission: "View Transfer Invoice",
      },
      {
        name: "Credit",
        path: "/saleCreditRecord",
        permission: "View Sale Credit Record",
      },
      {
        name: "Expense Invoice",
        path: "/expenseInvoice",
        permission: "View Expense Invoice",
      },
      {
        name: "Commission Invoice",
        path: "/paidEmployeCommission",
        permission: "View Commission Invoice",
      },
      // {
      //   name: "Cash Deposits",
      //   path: "/depositPayments",
      //   permission: "View Commission Invoice",
      // },
    ],
  },
  {
    name: "Consolidated",
    icon: <LiaFileInvoiceDollarSolid className="svgClass" />,
    cName: "nav-text",
    roles: ["Admin", "superAdmin", "Administrator"],
    permission: "Can View Consolidated",
    items: [
      {
        name: "Sales Invoice",
        path: "/consolidatedSalesReport",
        permission: "View Consolidated Sale Invoice",
      },
      {
        name: "Purchase Invoice",
        path: "/consolidatedPuchaseReport",
        permission: "View Consolidated Purchase Invoice",
      },
      {
        name: "Transfer Invoice",
        path: "/consolidatedTransferReport",
        permission: "View Consolidated Transfer Invoice",
      },
      {
        name: "Expense Invoice",
        path: "/consolidatedExpenseReport",
        permission: "View Consolidated Expense Invoice",
      },
    ],
  },

  {
    name: "cashManagement",
    icon: <SiExpensify className="svgClass" />,
    roles: ["Admin", "superAdmin", "Administrator"],
    permission: "Can View Cash Management",
    items: [
      {
        name: "Expense",
        path: "/expensee",
        icon: <SiExpensify />,
        cName: "nav-text",
        // roles: ["Admin", "superAdmin", "Administrator"],
        permission: "Can Add Expense",
      },
      {
        name: "cashDeposit",
        path: "/recordCashDeposit",
        icon: <SiExpensify />,
        cName: "nav-text",
        // roles: ["Admin", "superAdmin", "Administrator"],
        permission: "Can View Cash Deposits",
      },
      {
        name: "cashFlow",
        path: "/paymentWorkFlow",
        icon: <SiExpensify />,
        cName: "nav-text",
        // roles: ["Admin", "superAdmin", "Administrator"],
        permission: "Can View Cash WorkFlow",
      },
      {
        name: "Expense Type",
        path: "/expense",
        permission: "View Expense Type",
      },
    ],
  },
  {
    name: "profit",
    icon: <LiaFileInvoiceDollarSolid className="svgClass" />,
    cName: "nav-text",
    roles: ["Admin", "superAdmin", "Administrator"],
    permission: "Can View Profit",
    items: [
      {
        name: "profitInvoice",
        path: "/consolidateShopProfit",
        permission: "Can View Sale Profit",
      },
    ],
  },
  {
    name: "Commission",
    icon: <MoneyIcon className="svgClass" />,
    roles: ["Admin", "Administrator", "superAdmin", "Salesman"],
    permission: "Can View Commission",
    items: [
      {
        name: "calculateCommission",
        path: "/ProfitSalesman",
        permission: "View Commission Report",
      },
    ],
  },
  {
    name: "Import",
    icon: <MoneyIcon className="svgClass" />,
    roles: [""],
    permission: "Can Import Data",
    items: [
      {
        name: "Color",
        path: "/colorTableToExcel",
        permission: "superAdmin",
      },
      {
        name: "Company",
        path: "/companyTableToExcel",
        permission: "superAdmin",
      },
      {
        name: "Product Type",
        path: "/productTypeTableToExcel",
        permission: "superAdmin",
      },
      {
        name: "products",
        path: "/productsTableToExcel",
        permission: "superAdmin",
      },
      {
        name: "Product Location",
        path: "/productLocationTableToExcel",
        permission: "superAdmin",
      },
    ],
  },
  {
    name: "User",
    icon: <FaUserTie className="svgClass" />,
    roles: ["superAdmin", "Administrator"],
    permission: "Can View Users",
    items: [
      {
        name: "User",
        path: "/usersList",
        permission: "View Users",
      },
    ],
  },
];

const NavHeader = ({ onClick }) => (
  <header className="sidebar-header">
    <button onClick={onClick} type="button">
      <ArrowBackIcon className="svgClass" />
    </button>
    <img src={images} className="sidebar-logo" alt="Logo" />
  </header>
);

const NavButton = ({ onClick, name, icon, isActive, hasSubNav }) => {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      onClick={() => onClick(name)}
      className={isActive ? "active" : ""}
    >
      {icon && <Icon icon={icon} />}
      <span>{t(`${name}`)}</span>
      {hasSubNav && <Icon icon={<ArrowDropDownIcon className="svgClass" />} />}
    </button>
  );
};

const SubMenu = ({ setIsOpen, item, activeItem, handleClick, props }) => {
  const location = useLocation();
  const navRef = useRef(null);
  const navigate = useNavigate();

  const handleLinkClick = async (link, name) => {
    navigate(`${link}`);
    setIsOpen(false);
  };

  const isSubNavOpen = (item, items) =>
    items.some((i) => i === activeItem) || item === activeItem;

  return (
    <div
      className={`sub-nav ${isSubNavOpen(item.name, item.items) ? "open" : ""}`}
      style={{
        height: !isSubNavOpen(item.name, item.items)
          ? 0
          : navRef.current?.clientHeight + 5,
      }}
    >
      <div ref={navRef} className="sub-nav-inner">
        {item?.items.map(
          (subItem) =>
            (props?.permissions?.includes(subItem.permission) ||
              subItem?.permission?.includes("superAdmin")) && (
              <NavButton
                // onClick={handleClick}
                onClick={() => {
                  handleLinkClick(subItem.path, subItem.name);
                  // !item.subItems && setShowMenu(false);
                }}
                name={subItem.name}
                isActive={location.pathname === subItem.path}
                key={subItem.name}
              />
            )
        )}
      </div>
    </div>
  );
};

export const Sidebar = ({ isOpen, setIsOpen, props }) => {
  const [activeItem, setActiveItem] = useState("");
  // const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isSalesman = JSON.parse(localStorage.getItem("isSalesman"));
  const isAdmin = JSON.parse(localStorage.getItem("isAdmin"));
  const isAdministrator = JSON.parse(localStorage.getItem("isAdministrator"));
  const isSuperAdmin = JSON.parse(localStorage.getItem("isSuperAdmin"));
  const isStockManager = JSON.parse(localStorage.getItem("isStockManager"));
  const handleDrawerCloseForLogout = async () => {
    setIsOpen(false);
    // await logout()
    dispatch(logout());
    // dispatch({ type: LOAD_USER_FAIL });
    navigate("/login");
  };
  const userPanel = () => {
    navigate("/settings");
    // navigate("/updateUserProfile");
  };
  const handleClick = (item) => {
    console.log(item);
    setActiveItem(item !== activeItem ? item : "");
  };

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <nav className="sidebar-nav">
        <NavHeader onClick={() => setIsOpen(false)} />
        {menuItems.map((item) => (
          <div key={item.name}>
            {item.items && (
              <>
                {
                // (isSalesman && item?.roles?.includes("Salesman")) ||
                // (isAdmin && item?.roles?.includes("Admin")) ||
                // (isSuperAdmin && item?.roles?.includes("superAdmin")) ||
                // (isAdministrator && item?.roles?.includes("Administrator")) ||
                // (isStockManager && item?.roles?.includes("Stock Manager")) ||
                props?.permissions?.includes(item.permission) ? (
                  <>
                    <NavButton
                      onClick={handleClick}
                      name={item.name}
                      icon={item.icon}
                      isActive={activeItem === item.name}
                      hasSubNav={!!item.items}
                      key={item.name}
                    />
                    <SubMenu
                      setIsOpen={setIsOpen}
                      activeItem={activeItem}
                      handleClick={handleClick}
                      item={item}
                      props={props}
                    />
                  </>
                ) : null}
              </>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};
